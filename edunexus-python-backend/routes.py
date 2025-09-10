# routes.py

from flask import Blueprint, request, jsonify, redirect, send_from_directory
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from passlib.hash import pbkdf2_sha256
from werkzeug.utils import secure_filename
from flask_mail import Message
import os
import uuid

# Import extensions from the new extensions.py file
from extensions import db, mail

# Import the app instance directly from app.py
from app import app

# Import the User model from models.py
from models import User

# Create a blueprint for the authentication routes
auth_bp = Blueprint('auth_bp', __name__)

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
@auth_bp.route('/signup', methods=['POST'])
def signup():
    # ... (rest of your existing signup code) ...
    name = request.form.get('name')
    email = request.form.get('email')
    password = request.form.get('password')
    role = request.form.get('role')
    grade = request.form.get('grade')
    photo_file = request.files.get('photo')
    
    if not all([name, email, password, role]):
        return jsonify({'message': 'Missing required fields'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'User with this email already exists'}), 409

    photo_filename = save_photo(photo_file)
    hashed_password = pbkdf2_sha256.hash(password)
    verification_token = str(uuid.uuid4())

    new_user = User(
        name=name,
        email=email,
        password=hashed_password,
        role=role,
        grade=grade,
        photo=photo_filename,
        isVerified=False,
        verification_token=verification_token
    )
    
    try:
        db.session.add(new_user)
        db.session.commit()
        
        msg = Message(
            'Verify Your EduNexus Account',
            sender=app.config['MAIL_DEFAULT_SENDER'],
            recipients=[email]
        )
        msg.body = f"Hello {name},\n\nPlease click the following link to verify your email address:\n\nhttp://localhost:5000/api/auth/verify-email/{verification_token}\n\nThank you!"
        mail.send(msg)
        return jsonify({'message': 'Registration successful. A verification link has been sent to your email.'}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Failed to send email or save user: {e}")
        return jsonify({'message': 'Registration failed.'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    # ... (rest of your existing login code) ...
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({'message': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not pbkdf2_sha256.verify(password, user.password):
        return jsonify({'message': 'Invalid email or password'}), 401

    if not user.isVerified:
        return jsonify({'message': 'Please verify your email address before logging in.', 'verification_token': user.verification_token}), 403

    access_token = create_access_token(identity=user.id)
    user_info = {
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'role': user.role,
        'grade': user.grade,
        'photo': user.photo,
        'isVerified': user.isVerified
    }
    return jsonify({'message': 'Login successful', 'user': user_info, 'token': access_token}), 200

@auth_bp.route('/delete_account', methods=['DELETE'])
@jwt_required()
def delete_account():
    # ... (rest of your existing delete_account code) ...
    current_user_id = get_jwt_identity()
    user_to_delete = User.query.get(current_user_id)

    if not user_to_delete:
        return jsonify({"message": "User not found."}), 404

    try:
        db.session.delete(user_to_delete)
        db.session.commit()
        return jsonify({"message": "Account successfully deleted."}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting account: {e}")
        return jsonify({"message": "An internal server error occurred."}), 500

@auth_bp.route('/verify-email/<token>', methods=['GET'])
def verify_email(token):
    # ... (rest of your existing verify_email code) ...
    user = User.query.filter_by(verification_token=token).first()
    if user:
        user.isVerified = True
        user.verification_token = None
        db.session.commit()
        return redirect("http://localhost:5173/verification-success")
    return jsonify({'message': 'Invalid or expired verification link'}), 400

@auth_bp.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)