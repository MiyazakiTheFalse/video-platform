# app.py

import os
from dotenv import load_dotenv
from flask import Flask
from flask_login import LoginManager
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import generate_csrf
from backend.extensions import csrf
from backend.models.user import User, db
from backend.routes.auth import auth_bp
from backend.routes.upload import upload_bp
from backend.routes.videos import videos_bp

load_dotenv()

app = Flask(__name__)

# === Core App Config ===
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# === Cookie Security Config for Flask-Login Sessions ===
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SECURE'] = True  # since you're using HTTPS
app.config['SESSION_COOKIE_SAMESITE'] = 'None'  # 'None' is required for cross-origin credentials with HTTPS

# === CSRF Setup ===
csrf.init_app(app)

@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        'csrf_token',
        generate_csrf(),
        httponly=False,  # JS must be able to read this for header injection
        secure=True,     # secure cookie for HTTPS only
        samesite='None'  # must be 'None' for cross-site cookies
    )
    return response

# === CORS Setup ===
CORS(
    app,
    supports_credentials=True,
    origins=["https://localhost:3000"],  # must match frontend exactly
    methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "X-CSRFToken", "Authorization"],
    expose_headers=["X-CSRFToken"]
)

# === DB and Migration Init ===
db.init_app(app)
migrate = Migrate(app, db)

# === Flask-Login Init ===
login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# === Blueprint Routing ===
app.register_blueprint(auth_bp)
app.register_blueprint(upload_bp)
app.register_blueprint(videos_bp)

# === Run Server with HTTPS in Dev ===
if __name__ == '__main__':
    # Certs are stored one level above frontend (.env is in frontend/)
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    cert_path = os.path.join(base_dir, 'cert.pem')
    key_path = os.path.join(base_dir, 'key.pem')

    app.run(ssl_context=(cert_path, key_path), debug=True)
