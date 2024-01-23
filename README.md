# edupork

Necessary tools: postgres, pgAdmin 4

Running Backend Steps:
- "source venv/bin/activate" (activate virtual environment)
- "pip install -r requirements.txt"  at root level
- To run on localhost, configure database credentials in settings.py located in backend/backend and create a local database in pgAdmin 4
- Configure 
- Run "python manage.py makemigrations"
- Run "python manage.py migrate"
- Set up Open AI API key in /edupork/backend/edupork/ai_generators.py

Running Frontend Steps:
- In the frontend directory, run "npm install"
- Then, run "npm start"

Or, visit https://edupork-2b1e34edc290.herokuapp.com/


