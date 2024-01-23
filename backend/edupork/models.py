from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        user = self.create_user(email, password=password, **extra_fields)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

class Course(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(User, related_name='courses', on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Lecture(models.Model):
    name = models.CharField(max_length=255)
    transcription_file = models.FileField(upload_to='transcriptions/', null=True, blank=True)
    video_file = models.FileField(upload_to='videos/', null=True, blank=True)
    course = models.ForeignKey(Course, related_name='lectures', on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Flashcard(models.Model):
    question = models.TextField()
    answer = models.TextField()
    lecture = models.ForeignKey(Lecture, related_name='flashcards', on_delete=models.CASCADE)

    def __str__(self):
        return self.question

class Note(models.Model):
    content = models.TextField()
    lecture = models.ForeignKey(Lecture, related_name='notes', on_delete=models.CASCADE)

    def __str__(self):
        return self.content[:50] + '...'

class Test(models.Model):
    question = models.TextField()
    choice1 = models.TextField()
    choice2 = models.TextField()
    choice3 = models.TextField()
    choice4 = models.TextField()
    answer = models.TextField()
    lecture = models.ForeignKey(Lecture, related_name='test', on_delete=models.CASCADE)
   
    def __str__(self):
        return self.question