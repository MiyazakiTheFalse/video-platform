import os
from dotenv import load_dotenv
from flask import Flask
from flask_login import LoginManager
from flask_cors import CORS
from flask_migrate import Migrate
from backend.extensions import csrf

from backend.models.user import User, db
from backend.routes.auth import auth_bp
from backend.routes.upload import upload_bp
from backend.models.video import Video
from backend.routes.videos import videos_bp
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Flask-Login session cookie security config
app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SECURE=True,  # Set True in production with HTTPS
    SESSION_COOKIE_SAMESITE='Lax',
)

csrf.init_app(app)  # Enable CSRF globally

CORS(app)
db.init_app(app)
migrate = Migrate(app, db)

login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    from backend.models.user import User
    return User.query.get(int(user_id))

# Register blueprints after extensions are initialized
app.register_blueprint(auth_bp)
app.register_blueprint(upload_bp)
app.register_blueprint(videos_bp)

if __name__ == '__main__':
    app.run(ssl_context=('cert.pem', 'key.pem'), debug=True)