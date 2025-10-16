from django.db import models
import uuid

class Department(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    is_custom = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class File(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    file_number = models.CharField(max_length=255, unique=True)
    title = models.CharField(max_length=1024)
    type = models.CharField(max_length=50)
    department = models.CharField(max_length=255)
    date = models.DateField()
    status = models.CharField(max_length=255, default='Pending')
    description = models.TextField(null=True, blank=True)
    remarks = models.TextField(null=True, blank=True)
    needs_return = models.BooleanField(default=False)
    storage_path = models.CharField(max_length=1024, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.file_number} - {self.title}"


class StatusHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    file = models.ForeignKey(File, related_name='status_history', on_delete=models.CASCADE)
    status = models.CharField(max_length=255)
    reason = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.file.file_number}: {self.status} at {self.timestamp}"


class EmailThread(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    file = models.ForeignKey(File, related_name='email_threads', null=True, blank=True, on_delete=models.SET_NULL)
    sender_email = models.EmailField()
    recipient_email = models.EmailField()
    cc_email = models.CharField(max_length=1024, null=True, blank=True)
    subject = models.CharField(max_length=1024)
    message_body = models.TextField()
    attachment_path = models.CharField(max_length=1024, null=True, blank=True)
    status = models.CharField(max_length=50, default='pending')
    error_message = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Email to {self.recipient_email} - {self.subject}"


class User(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=1024)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email
