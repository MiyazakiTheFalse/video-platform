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
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "Missing username, email or password"}), 400

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({"error": "Username or email already registered"}), 400

    hashed_pw = generate_password_hash(password, method="pbkdf2:sha256", salt_length=16)
    user = User(username=username, email=email, password=hashed_pw)
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered"})

@auth_bp.route('/login', methods=['GET', 'POST'])
@csrf.exempt  # or properly handle CSRF token here
def login():
    if request.method == 'GET':
        return jsonify({"message": "Use POST to login"}), 200
    
    data = request.json or {}
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
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
def get_me():
    return jsonify({
        'id': current_user.id,
        'email': current_user.email,
        'username': current_user.username
    })