# backend/routes/videos.py
from flask import Blueprint, jsonify
from backend.models.video import Video
from backend.models.user import db

videos_bp = Blueprint('videos', __name__)

@videos_bp.route('/videos')
def list_videos():
    videos = Video.query.order_by(Video.upload_date.desc()).all()
    return jsonify([
        {
            'id': v.id,
            'title': v.title,
            'description': v.description,
            'thumbnail': v.thumbnail or 'placeholder.jpg'
        }
        for v in videos
    ])

# ✅ Route to get one video’s metadata (used by VideoPlayer page)
@videos_bp.route('/videos/<int:video_id>')
def get_video(video_id):
    video = Video.query.get_or_404(video_id)
    return jsonify({
        'id': video.id,
        'title': video.title,
        'description': video.description,
        'filename': f"media/{video.filename}",
        'processed_1080p': video.processed_1080p,
        'processed_720p': video.processed_720p,
        'processed_480p': video.processed_480p,
        'thumbnail': video.thumbnail
    })