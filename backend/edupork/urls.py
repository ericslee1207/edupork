from django.urls import path
from edupork.views import UserViewSet, CourseViewSet, LectureViewSet, FlashcardViewSet, NoteViewSet, TestViewSet, generate_educational_content, transcribe_video
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'lectures', LectureViewSet, basename='lecture')
router.register(r'flashcards', FlashcardViewSet, basename='flashcard')
router.register(r'notes', NoteViewSet, basename='note')
router.register(r'tests', TestViewSet, basename='test')

urlpatterns = [
    path('generate_content/<int:lecture_id>/', generate_educational_content, name='generate_educational_content'),
    path('transcribe/<int:lecture_id>/', transcribe_video, name='transcribe_video'),
]

urlpatterns += router.urls