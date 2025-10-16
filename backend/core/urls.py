from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    DepartmentViewSet,
    FileViewSet,
    StatusHistoryViewSet,
    EmailThreadViewSet,
    UserViewSet,
    send_email,
)

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet, basename='departments')
router.register(r'files', FileViewSet, basename='files')
router.register(r'status_history', StatusHistoryViewSet, basename='status_history')
router.register(r'email_threads', EmailThreadViewSet, basename='email_threads')
router.register(r'users', UserViewSet, basename='users')

urlpatterns = [
    path('', include(router.urls)),
    path('send-email/', send_email, name='send-email'),
]
