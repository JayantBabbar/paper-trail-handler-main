import os
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
import requests

from .models import Department, File, StatusHistory, EmailThread, User
from .serializers import (
    DepartmentSerializer,
    FileSerializer,
    StatusHistorySerializer,
    EmailThreadSerializer,
    UserSerializer,
)

from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.utils.decorators import method_decorator


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


class FileViewSet(viewsets.ModelViewSet):
    serializer_class = FileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Only return files owned by the authenticated user
        return File.objects.filter(owner=self.request.user).order_by('-created_at')
    
    def perform_create(self, serializer):
        # Automatically set the owner to the authenticated user
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        file = self.get_object()
        new_status = request.data.get('status')
        reason = request.data.get('reason')
        if not new_status:
            return Response({'detail': 'status is required'}, status=status.HTTP_400_BAD_REQUEST)

        file.status = new_status
        file.save()

        history = StatusHistory.objects.create(file=file, status=new_status, reason=reason)
        return Response(StatusHistorySerializer(history).data)


class StatusHistoryViewSet(viewsets.ModelViewSet):
    serializer_class = StatusHistorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Only return status history for files owned by the authenticated user
        return StatusHistory.objects.filter(file__owner=self.request.user).order_by('-timestamp')


class EmailThreadViewSet(viewsets.ModelViewSet):
    serializer_class = EmailThreadSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Only return email threads for files owned by the authenticated user
        return EmailThread.objects.filter(file__owner=self.request.user).order_by('-created_at')


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_email(request):
    data = request.data
    recipient = data.get('recipientEmail')
    cc = data.get('ccEmail')
    subject = data.get('subject')
    body = data.get('messageBody')
    file_url = data.get('fileUrl')
    file_name = data.get('fileName')

    if not recipient or not subject or not body:
        return Response({'detail': 'recipientEmail, subject and messageBody are required'}, status=status.HTTP_400_BAD_REQUEST)

    # Save thread
    thread = EmailThread.objects.create(
        sender_email=os.getenv('EMAIL_SENDER', 'noreply@example.com'),
        recipient_email=recipient,
        cc_email=cc or '',
        subject=subject,
        message_body=body,
        attachment_path=file_url or '',
        status='pending'
    )

    # If RESEND_API_KEY is set, proxy to Resend API
    resend_api_key = os.getenv('RESEND_API_KEY')
    try:
        if resend_api_key:
            files = None
            if file_url and file_name:
                # download file
                resp = requests.get(file_url)
                resp.raise_for_status()
                files = {
                    'attachments': (file_name, resp.content)
                }

            payload = {
                'from': os.getenv('EMAIL_FROM', 'DAK <onboarding@example.com>'),
                'to': [recipient],
                'cc': [cc] if cc else [],
                'subject': subject,
                'html': body,
            }

            headers = {
                'Authorization': f'Bearer {resend_api_key}',
                'Content-Type': 'application/json'
            }

            # Resend API expects JSON; attachments handling may differ. We'll use the resend emails endpoint
            r = requests.post('https://api.resend.com/emails', json=payload, headers=headers)
            r.raise_for_status()

            thread.status = 'sent'
            thread.save()
            return Response({'success': True, 'data': r.json()})
        else:
            # Fallback to Django's send_mail using configured EMAIL_BACKEND
            send_mail(subject, body, os.getenv('EMAIL_FROM', 'noreply@example.com'), [recipient], fail_silently=False)
            thread.status = 'sent'
            thread.save()
            return Response({'success': True})
    except Exception as e:
        thread.status = 'failed'
        thread.error_message = str(e)
        thread.save()
        return Response({'success': False, 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def upload_file(request):
    # Accept multipart form upload with file field 'file'
    print(f"Upload request received: {request.method}")
    print(f"Files in request: {list(request.FILES.keys())}")
    
    upload = request.FILES.get('file')
    if not upload:
        return Response({'detail': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

    filename = upload.name
    # Save to MEDIA_ROOT/files/<filename>
    path = default_storage.save(f'files/{filename}', ContentFile(upload.read()))

    storage_path = path

    return Response({'storage_path': storage_path})
