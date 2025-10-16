from django.contrib import admin
from .models import Department, File, StatusHistory, EmailThread, User

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_custom', 'created_at')


@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ('file_number', 'title', 'type', 'department', 'date', 'status')
    search_fields = ('file_number', 'title')


@admin.register(StatusHistory)
class StatusHistoryAdmin(admin.ModelAdmin):
    list_display = ('file', 'status', 'timestamp')


@admin.register(EmailThread)
class EmailThreadAdmin(admin.ModelAdmin):
    list_display = ('recipient_email', 'subject', 'status', 'created_at')


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'created_at')
