import os
from flask import Blueprint, request, jsonify, current_app
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
from backend.models.video import Video
from backend.models.user import db
from backend.utils.transcode import transcode_to_resolutions
import threading  # for async call, optional

upload_bp = Blueprint('upload', __name__)

# Allowed extensions for upload
ALLOWED_EXTENSIONS = {'mp4', 'mov', 'avi', 'mkv'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@upload_bp.route('/upload', methods=['POST'])
@login_required  # <-- protects route, only logged-in users can upload
def upload_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided'}), 400

    video_file = request.files['video']
    title = request.form.get('title')
    description = request.form.get('description', '')

    if video_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if not allowed_file(video_file.filename):
        return jsonify({'error': 'Unsupported file type'}), 400

    if not title:
        return jsonify({'error': 'Title is required'}), 400

    filename = secure_filename(video_file.filename)
    save_path = os.path.join(current_app.root_path, 'media', filename)

    # Ensure media folder exists
    os.makedirs(os.path.dirname(save_path), exist_ok=True)

    video_file.save(save_path)

    # Save metadata in DB
    new_video = Video(
        filename=filename,
        title=title,
        description=description,
        user_id=current_user.id
    )
    db.session.add(new_video)
    db.session.commit()

    return jsonify({'message': 'Video uploaded successfully', 'video_id': new_video.id}), 201

# Optional: route to check current logged-in user info (for testing auth)
@upload_bp.route('/current_user', methods=['GET'])
@login_required
def current_user_info():
    return jsonify({
        'id': current_user.id,
        'email': current_user.email,
        'username': getattr(current_user, 'username', None)
    })
