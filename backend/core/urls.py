from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    DepartmentViewSet,
    FileViewSet,
    StatusHistoryViewSet,
    EmailThreadViewSet,
    UserViewSet,
    send_email,
    upload_file,
)
from .auth_views import register, login, me
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet, basename='departments')
router.register(r'files', FileViewSet, basename='files')
router.register(r'status_history', StatusHistoryViewSet, basename='status_history')
router.register(r'email_threads', EmailThreadViewSet, basename='email_threads')
router.register(r'users', UserViewSet, basename='users')

urlpatterns = [
    # Put specific paths before the router to avoid conflicts
    path('files/upload/', upload_file, name='file-upload'),
    path('send-email/', send_email, name='send-email'),
    # Auth
    path('auth/register/', register, name='auth-register'),
    path('auth/login/', login, name='auth-login'),
    path('auth/me/', me, name='auth-me'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Router URLs (should be last to avoid conflicts)
    path('', include(router.urls)),
]
