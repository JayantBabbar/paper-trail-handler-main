from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
import re

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    email = request.data.get('email')
    password = request.data.get('password')
    if not email or not password:
        return Response({'detail': 'email and password required'}, status=status.HTTP_400_BAD_REQUEST)
    # Basic validation
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return Response({'detail': 'Invalid email address'}, status=status.HTTP_400_BAD_REQUEST)

    if len(password) < 8:
        return Response({'detail': 'Password must be at least 8 characters long'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=email).exists():
        return Response({'detail': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create(username=email, email=email, password=make_password(password))

    # Issue JWT tokens on registration (auto-login)
    refresh = RefreshToken.for_user(user)
    return Response({
        'id': user.id,
        'email': user.email,
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username') or request.data.get('email')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'detail': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Try to authenticate with the provided credentials
    user = authenticate(username=username, password=password)
    
    if user is None:
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    return Response({
        'id': user.id,
        'email': user.email,
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user
    return Response({'id': user.id, 'email': user.email})
