from rest_framework import serializers
from .models import User, Course, Lecture, Flashcard, Note, Test
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'date_joined', 'password')

class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flashcard
        fields = ('id', 'question', 'answer',)

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ('id', 'content',)

class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ('id', 'question', 'choice1', 'choice2', 'choice3', 'choice4','answer')

class LectureSerializer(serializers.ModelSerializer):
    flashcards = FlashcardSerializer(many=True, read_only=True)
    notes = NoteSerializer(many=True, read_only=True)
    test = TestSerializer(many=True, read_only=True)

    class Meta:
        model = Lecture
        fields = ('id', 'name', 'transcription_file', 'video_file', 'flashcards', 'notes', 'test')

class CourseSerializer(serializers.ModelSerializer):
    lectures = LectureSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ('id', 'name', 'created_at', 'user', 'lectures',)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['email'] = user.email
        token['id'] = user.id

        return token