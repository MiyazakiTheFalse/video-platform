from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required, current_user
from backend.models.user import User, db
from backend.extensions import csrf
from flask_wtf.csrf import generate_csrf

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/csrf-token', methods=['GET'])
def get_csrf_token():
    token = generate_csrf()
    return jsonify({'csrf_token': token})

@auth_bp.route('/register', methods=['POST'])
@csrf.exempt  # Temporarily disabled until frontend handles CSRF properly
def register():
    data = request.json
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Missing data"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already registered"}), 400

    hashed_pw = generate_password_hash(data["password"], method="sha256")
    user = User(email=data["email"], password=hashed_pw)
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered"})

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
    login_user(user)
    return jsonify({'message': 'Login successful'})

@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'})

@auth_bp.route('/me', methods=['GET'])
@login_required
def me():
    return jsonify({
        'username': current_user.username,
        'email': current_user.email,
        'is_admin': current_user.is_admin
    })