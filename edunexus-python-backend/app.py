import os
from dotenv import load_dotenv

load_dotenv()

from flask import Flask, request, jsonify, redirect, send_from_directory, send_file
from flask_cors import CORS
# Removed Flask-Mail, Flask-SQLAlchemy, Flask-JWT-Extended, and Passlib
from werkzeug.utils import secure_filename
import uuid
from groq import Groq
import json

# PDF generation imports
import io
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

# --- Initialize the Flask Application and Extensions ---
app = Flask(__name__)

# Apply CORS globally
CORS(app, resources={r"/api/*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"], "allow_headers": ["Content-Type", "Authorization"]}})

# You'll need a simple way to create a token without JWT or a database.
# For a demo, we can just return a placeholder.
# This is a dummy secret key. In a real app, this should be secure.
app.config["DEMO_SECRET_KEY"] = "demo-hackathon-secret-key"

# Groq Client Initialization
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Define the folder for photo uploads and create it if it doesn't exist
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# --- Helper function for file uploads ---
def save_photo(photo_file):
    if not photo_file:
        return None
    
    filename = secure_filename(str(uuid.uuid4()) + os.path.splitext(photo_file.filename)[1])
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    
    try:
        photo_file.save(filepath)
        return filename
    except Exception as e:
        print(f"Error saving file: {e}")
        return None

# --- API Routes ---
# Removed all database models and authentication code

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    """
    Dummy signup route for the demo. It will always "succeed" for any input.
    """
    return jsonify({'message': 'Registration successful. (Demo Mode)'}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    """
    Login route that bypasses the database and returns a dummy user
    that reflects the details provided in the login form.
    """
    data = request.json
    email = data.get('email')
    
    # --- START OF THE FIX ---
    # Get the role from the JSON data sent by the frontend.
    # We provide a default of 'student' in case the role isn't sent.
    demo_user_role = data.get('role', 'student')
    # --- END OF THE FIX ---
    
    # This dummy user now simulates a successful login with the provided email and a dynamic name.
    demo_user = {
        'id': str(uuid.uuid4()), # Use a UUID for a unique ID
        'name': email.split('@')[0], # Use the part of the email before @ as a name
        'email': email,
        'role': demo_user_role, # This will now be dynamic
        'grade': 'N/A', # Or any other mock data
        'photo': None,
        'isVerified': True
    }
    
    # Generate a simple token.
    demo_token = str(uuid.uuid4())
    
    return jsonify({
        'message': 'Login successful (Demo Mode)',
        'user': demo_user,
        'token': demo_token
    }), 200

# The delete_account route and verify-email are removed since they require a database.

@app.route('/api/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# --- Groq Routes ---
@app.route('/api/groq/chat', methods=['POST'])
def chat():
    """
    Handles a chat conversation with a Groq model.
    """
    data = request.get_json()
    messages = data.get('messages')

    if not messages:
        return jsonify({"error": "No messages provided"}), 400

    try:
        chat_completion = groq_client.chat.completions.create(
            messages=messages,
            model="llama-3.1-8b-instant",
            temperature=0.7,
            max_tokens=1024,
            top_p=1,
            stream=False,
        )

        bot_response_content = chat_completion.choices[0].message.content
        return jsonify({"content": bot_response_content})

    except Exception as e:
        print(f"Error during Groq API call: {e}")
        return jsonify({"error": "Failed to get a response from the AI tutor."}), 500

@app.route('/api/generate-lesson-plan', methods=['POST'])
def generate_lesson_plan():
    """
    Handles lesson plan generation using the Groq AI model.
    """
    data = request.get_json()
    lesson_topic = data.get('topic')
    grade_level = data.get('grade')
    duration = data.get('duration')

    if not all([lesson_topic, grade_level, duration]):
        return jsonify({"error": "Missing topic, grade, or duration"}), 400

    prompt = f"""
    You are an expert educational lesson planner. Your task is to generate a detailed lesson plan based on the user's input. The plan must be returned as a single JSON object.

    The user has provided the following details:
    - Lesson Topic: {lesson_topic}
    - Grade Level: {grade_level}
    - Duration: {duration}

    The JSON object must have the following structure and content. Ensure all fields are present and correctly formatted. DO NOT include any text or markdown outside of the JSON object.

    {{
      "title": "A clear and concise title for the lesson plan.",
      "duration": "The total duration of the lesson.",
      "objectives": ["List of 2-4 specific learning objectives."],
      "materials": ["List of 3-5 materials needed."],
      "activities": [
        {{"name": "Name of the activity (e.g., Warm-up)", "duration": "Duration", "description": "A brief description of the activity."}},
        {{"name": "Name of the activity (e.g., Guided Practice)", "duration": "Duration", "description": "A brief description of the activity."}}
      ],
      "assessment": ["List of 1-3 assessment strategies."],
      "differentiation": ["List of 1-3 differentiation strategies for different learner needs."]
    }}
    """
    
    try:
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {"role": "user", "content": prompt}
            ],
            model="llama-3.1-8b-instant",
            temperature=0.5,
            response_format={"type": "json_object"}
        )

        groq_response_json_str = chat_completion.choices[0].message.content
        lesson_plan = json.loads(groq_response_json_str)
        return jsonify(lesson_plan)

    except json.JSONDecodeError as e:
        print(f"Failed to parse JSON response from Groq: {e}")
        return jsonify({"error": "Failed to generate a valid lesson plan. Please try again."}), 500
    except Exception as e:
        print(f"Error during Groq API call: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500

# --- New Route for PDF Export ---
@app.route('/api/export-lesson-plan-pdf', methods=['POST'])
def export_lesson_plan_pdf():
    """
    Generates and returns a PDF of the lesson plan.
    """
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No lesson plan data provided."}), 400

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        styles = getSampleStyleSheet()

        flowables = []
        flowables.append(Paragraph(data.get('title', 'Lesson Plan'), styles['Title']))
        flowables.append(Spacer(1, 12))

        flowables.append(Paragraph("<b>Lesson Overview</b>", styles['h2']))
        flowables.append(Paragraph(f"<b>Grade Level:</b> {data.get('grade', 'N/A')}", styles['Normal']))
        flowables.append(Paragraph(f"<b>Duration:</b> {data.get('duration', 'N/A')}", styles['Normal']))
        flowables.append(Spacer(1, 12))

        flowables.append(Paragraph("<b>Learning Objectives</b>", styles['h2']))
        for obj in data.get('objectives', []):
            flowables.append(Paragraph(f"- {obj}", styles['Normal']))
        flowables.append(Spacer(1, 12))

        flowables.append(Paragraph("<b>Materials Needed</b>", styles['h2']))
        for material in data.get('materials', []):
            flowables.append(Paragraph(f"- {material}", styles['Normal']))
        flowables.append(Spacer(1, 12))

        flowables.append(Paragraph("<b>Activities</b>", styles['h2']))
        for activity in data.get('activities', []):
            flowables.append(Paragraph(f"<b>{activity['name']}</b> ({activity['duration']})", styles['h3']))
            flowables.append(Paragraph(activity['description'], styles['Normal']))
            flowables.append(Spacer(1, 6))

        flowables.append(Paragraph("<b>Assessment Strategies</b>", styles['h2']))
        for item in data.get('assessment', []):
            flowables.append(Paragraph(f"- {item}", styles['Normal']))
        flowables.append(Spacer(1, 12))

        flowables.append(Paragraph("<b>Differentiation Strategies</b>", styles['h2']))
        for strategy in data.get('differentiation', []):
            flowables.append(Paragraph(f"- {strategy}", styles['Normal']))
        flowables.append(Spacer(1, 12))

        doc.build(flowables)
        buffer.seek(0)

        return send_file(
            buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f"{data.get('title', 'lesson_plan').replace(' ', '_').lower()}.pdf"
        )

    except Exception as e:
        print(f"Error generating PDF: {e}")
        return jsonify({"error": "An error occurred during PDF generation."}), 500

@app.route('/api/grade-assignments', methods=['POST'])
def grade_assignments():
    """
    Handles grading of assignments using the Groq AI model.
    """
    data = request.get_json()
    manual_answers = data.get('manual_answers')
    rubric = data.get('rubric')

    if not manual_answers:
        return jsonify({"error": "No answers provided for manual grading."}), 400
    
    prompt = f"""
    You are an expert academic grader. Your task is to grade student responses and provide feedback based on a given rubric. The output must be a single JSON object.

    The user has provided the following student responses:
    {manual_answers}

    The grading rubric is:
    {rubric}

    Analyze the responses and provide a comprehensive grading summary. The JSON object should follow this exact structure:

    {{
      "totalSubmissions": "The number of submissions analyzed.",
      "avgScore": "The calculated average score of all submissions (number, 0-100).",
      "gradedCount": "The number of submissions successfully graded.",
      "timeToGrade": "A brief, human-readable estimate of time saved.",
      "distribution": {{
        "A (90-100%)": "Count of A grades.",
        "B (80-89%)": "Count of B grades.",
        "C (70-79%)": "Count of C grades.",
        "D (60-69%)": "Count of D grades.",
        "F (0-59%)": "Count of F grades."
      }},
      "studentResults": [
        {{
          "name": "Student's Name or identifier",
          "score": "The student's score (number, 0-100).",
          "feedback": "Concise, actionable feedback."
        }}
      ]
    }}

    The student responses are typically in a format like:
    "Student Name: [Student's Response]"
    Use this format to identify and grade each student.
    """

    try:
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {"role": "user", "content": prompt}
            ],
            model="llama-3.1-8b-instant",
            temperature=0.2,
            response_format={"type": "json_object"}
        )
        
        groq_response_json_str = chat_completion.choices[0].message.content
        graded_results = json.loads(groq_response_json_str)
        return jsonify(graded_results)

    except json.JSONDecodeError as e:
        print(f"Failed to parse JSON response from Groq: {e}")
        return jsonify({"error": "Failed to generate a valid grade report. Please check the format of the student answers and try again."}), 500
    except Exception as e:
        print(f"Error during Groq API call: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500


# --- Application Entry Point ---
if __name__ == '__main__':
    # No db.create_all() call here, as we removed the database
    app.run(debug=True, port=os.getenv('PORT', 5000))