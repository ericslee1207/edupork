import openai
import re

openai.api_key = "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"

def generate_flashcards(transcribed_text, num_flashcards):
    flashcards = []
    chat_history = [
        {"role": "system", "content": "You are a helpful assistant specialized in generating educational flashcards from lecture transcripts. The flashcards should start with 'Front: ' followed by the question, and 'Back: ' followed by the answer."},
        {"role": "user", "content": f"Please generate flashcards based on the lecture content: {transcribed_text}"}
    ]
    
    for _ in range(num_flashcards):
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=chat_history
        )
        
        if response is not None:
            text = response['choices'][0]['message']['content']
            # Parsing question and answer from text
            lines = text.strip().split('\n')
            if len(lines) >= 2:
                question_line = lines[0].replace('Front: ', '')
                answer_line = lines[1].replace('Back: ', '')

                # Check for duplicate flashcards
                if (question_line, answer_line) not in flashcards:
                    flashcards.append((question_line, answer_line))
                    
                    # Add to chat history to inform the model of the flashcards already generated
                    chat_history.append({"role": "system", "content": f"Flashcard generated: Front: {question_line}, Back: {answer_line}"})
                else:
                    print("Duplicate flashcard skipped.")
                    
            else:
                print("Incomplete flashcard generated.")
                print("Model's response was:")
                print(text)
        else:
            print("API call failed.")
            return None
            
    return flashcards

def generate_notes(transcribed_text):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant specialized in summarizing lecture transcripts into study notes."},
            {"role": "user", "content": f"Please summarize the following lecture content into study notes: {transcribed_text}"}
        ]
    )
    notes_content = response['choices'][0]['message']['content']
    return notes_content

def generate_test(transcribed_text):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant specialized in creating test questions based on lecture transcripts or study notes."},
            {"role": "user", "content": f"""Please create 3 multiple choice test questions based on the following information. These questions should quiz on topics and not just examples given in lecture. 
                The questions should be formatted as 

                Question: This is the question
                a) Answer choice one
                b) Answer choice two
                c) Answer choice three
                d) Answer choice four
                Answer: This is the answer

                The question  should not be numbered.Here is the lecture: {transcribed_text}"""}
        ]
    )

    def parse_multiple_questions(response):
        sections = response.split("Question:")  # Skip the first empty part
        parsed_questions = []
        for section in sections:
            lines = section.strip().split('\n')
            if len(lines) >= 5:
                question_text = lines[0].strip()
                option_a = lines[1].replace("a)", "").strip()
                option_b = lines[2].replace("b)", "").strip()
                option_c = lines[3].replace("c)", "").strip()
                option_d = lines[4].replace("d)", "").strip()
                answer = lines[5].replace("Answer:", "").strip()

                parsed_questions.append({
                    'text': question_text,
                    'option_a': option_a,
                    'option_b': option_b,
                    'option_c': option_c,
                    'option_d': option_d,
                    'answer': answer
                })

        return parsed_questions



    parsed_data = parse_multiple_questions(response['choices'][0]['message']['content'])
    return parsed_data

def transcribe_audio(audio_file):
    transcript = openai.Audio.transcribe("whisper-1", audio_file, 
            prompt="This transcript is a lecture recording. There will be pauses, and also verbal tics like hmm, or ummm") 
    return transcript["text"]