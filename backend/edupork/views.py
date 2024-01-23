import os
from django.core.files import File
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import Flashcard, Note, Lecture, Test
from .ai_generators import generate_flashcards, generate_notes, generate_test, transcribe_audio
from django.core.exceptions import ObjectDoesNotExist

from django.shortcuts import get_object_or_404
from edupork.serializers import UserSerializer, CourseSerializer, LectureSerializer, FlashcardSerializer, NoteSerializer, TestSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

from edupork.models import User, Course, Lecture, Flashcard, Note, Test

class UserViewSet(viewsets.ViewSet):
    @action(detail=True, methods=['GET'])
    def courses(self, request, pk=None):
        user = get_object_or_404(User, pk=pk)
        courses = Course.objects.filter(user=user)
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['POST'])
    def create_course(self, request, pk=None):
        user = get_object_or_404(User, pk=pk)
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request):
        queryset = User.objects.all()
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = User.objects.all()
        user = get_object_or_404(queryset, pk=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    def create(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = User.objects.create_user(  # Use create_user to ensure password gets hashed
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password']
            )
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CourseViewSet(viewsets.ViewSet):
    @action(detail=True, methods=['POST'])
    def create_lecture(self, request, pk=None):
        course = get_object_or_404(Course, pk=pk)
        serializer = LectureSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(course=course)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['GET'])
    def lectures(self, request, pk=None):
        course = get_object_or_404(Course, pk=pk)
        lectures = Lecture.objects.filter(course=course)
        serializer = LectureSerializer(lectures, many=True)
        return Response(serializer.data)
    
    def list(self, request):
        queryset = Course.objects.all()
        serializer = CourseSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Course.objects.all()
        course = get_object_or_404(queryset, pk=pk)
        serializer = CourseSerializer(course)
        return Response(serializer.data)
    
class LectureViewSet(viewsets.ViewSet):
    @action(detail=True, methods=['POST'])
    def create_flashcard(self, request, pk=None):
        lecture = get_object_or_404(Lecture, pk=pk)
        serializer = FlashcardSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(lecture=lecture)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['POST'])
    def create_note(self, request, pk=None):
        lecture = get_object_or_404(Lecture, pk=pk)
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(lecture=lecture)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['POST'])
    def create_test(self, request, pk=None):
        lecture = get_object_or_404(Lecture, pk=pk)
        serializer = TestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(lecture=lecture)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['GET'])
    def flashcards(self, request, pk=None):
        lecture = get_object_or_404(Lecture, pk=pk)
        flashcards = Flashcard.objects.filter(lecture=lecture)
        serializer = FlashcardSerializer(flashcards, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['GET'])
    def notes(self, request, pk=None):
        lecture = get_object_or_404(Lecture, pk=pk)
        notes = Note.objects.filter(lecture=lecture)
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['GET'])
    def test(self, request, pk=None):
        lecture = get_object_or_404(Lecture, pk=pk)
        test = Test.objects.filter(lecture=lecture)
        serializer = TestSerializer(test, many=True)
        return Response(serializer.data)
    
    def list(self, request):
        queryset = Lecture.objects.all()
        serializer = LectureSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Lecture.objects.all()
        lecture = get_object_or_404(queryset, pk=pk)
        serializer = LectureSerializer(lecture)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        lecture = get_object_or_404(Lecture, pk=pk)
        serializer = LectureSerializer(lecture, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        lecture = get_object_or_404(Lecture, pk=pk)
        lecture.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class FlashcardViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Flashcard.objects.all()
        serializer = FlashcardSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Flashcard.objects.all()
        flashcard = get_object_or_404(queryset, pk=pk)
        serializer = FlashcardSerializer(flashcard)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        flashcard = get_object_or_404(Flashcard, pk=pk)
        serializer = FlashcardSerializer(flashcard, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        flashcard = get_object_or_404(Flashcard, pk=pk)
        flashcard.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class NoteViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Note.objects.all()
        serializer = NoteSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Note.objects.all()
        note = get_object_or_404(queryset, pk=pk)
        serializer = NoteSerializer(note)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        note = get_object_or_404(Note, pk=pk)
        serializer = NoteSerializer(note, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        note = get_object_or_404(Note, pk=pk)
        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class TestViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Test.objects.all()
        serializer = TestSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Test.objects.all()
        test = get_object_or_404(queryset, pk=pk)
        serializer = TestSerializer(test)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        test = get_object_or_404(Test, pk=pk)
        serializer = TestSerializer(test, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        test = get_object_or_404(Test, pk=pk)
        test.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)  

@csrf_exempt
def transcribe_video(request, lecture_id):
    try:
        lecture = Lecture.objects.get(id=lecture_id)
    except ObjectDoesNotExist:
        return JsonResponse({'error': 'Lecture not found'}, status=404)
    try:
        with lecture.video_file.open('rb') as f:
            transcribed_text = transcribe_audio(f)
            
            if not transcribed_text:
                return JsonResponse({'error': 'Failed to transcribe video'}, status=500)
                        
            transcription_file_name = f"transcription_{lecture_id}.txt"
            base_dir = os.path.dirname(os.path.abspath(__file__))

            # Construct the path for the 'transcriptions' directory that's outside 'edupork'
            transcription_file_path = os.path.join(base_dir, "../transcriptions", transcription_file_name)

            # Make sure the target directory exists
            os.makedirs(os.path.join(base_dir, "transcriptions"), exist_ok=True)
            
            with open(transcription_file_path, 'w') as f:
                f.write(transcribed_text)
            
            if lecture.transcription_file:
                existing_file_path = lecture.transcription_file.path
                if os.path.isfile(existing_file_path):
                    os.remove(existing_file_path)
            
            with open(transcription_file_path, 'rb') as f:
                lecture.transcription_file.save(transcription_file_name, File(f))

            lecture.save()

            return generate_educational_content(request, lecture_id)
            
    except Exception as e:
        return JsonResponse({'error': f"An error occurred while reading the video file: {str(e)}"}, status=500)

CHUNK_SIZE = 1024

@csrf_exempt
def generate_educational_content(request, lecture_id):
    print("HERE 1")
    try:
        lecture = Lecture.objects.get(id=lecture_id)
    except ObjectDoesNotExist:
        return JsonResponse({'error': 'Lecture not found'}, status=404)
   
    try:
        print("HERE 2")

        file_path = lecture.transcription_file.path

        with open(file_path, 'r', encoding='utf-8') as f:
            transcribed_text = f.read()
    except Exception as e:
        print(e)
        return JsonResponse({'error': f"An error occurred while reading the transcription file: {str(e)}"}, status=500)

    flashcards = []

    print("HERE 3")

    # for i in range(0, len(transcribed_text), CHUNK_SIZE):
    #     print("HERE 4")
    #     chunk = transcribed_text[i: i + CHUNK_SIZE]
    #     flashcards_chunk = generate_flashcards(chunk, num_flashcards=5)
    #     flashcards.extend(flashcards_chunk)

    # for question, answer in flashcards:
    #     Flashcard.objects.create(question=question, answer=answer, lecture=lecture)

    notes_content = ""
    for i in range(0, len(transcribed_text), CHUNK_SIZE):
        print("HERE 5")
        chunk = transcribed_text[i: i + CHUNK_SIZE]
        notes_chunk = generate_notes(chunk)
        notes_content += notes_chunk + "\n"

    Note.objects.create(content=notes_content, lecture=lecture)

    # questions = []
    # for i in range(0, len(transcribed_text), CHUNK_SIZE):
    #     chunk = transcribed_text[i: i + CHUNK_SIZE]
    #     test_chunk = generate_test(chunk)
    #     questions.extend(test_chunk)


    # for question_data in questions:
    #     Test.objects.create(
    #         question=question_data['text'],
    #         choice1=question_data['option_a'],
    #         choice2=question_data['option_b'],
    #         choice3=question_data['option_c'],
    #         choice4=question_data['option_d'],
    #         answer=question_data['answer'],
    #         lecture=lecture
    #     )
       
    return JsonResponse({'message': 'Flashcards and Notes and Test have generated successfully'})