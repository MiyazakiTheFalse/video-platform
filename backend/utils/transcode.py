import subprocess
import os

def run_ffmpeg(cmd):
    """Helper to run FFmpeg command and raise error if fails"""
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if result.returncode != 0:
        raise RuntimeError(f"FFmpeg error: {result.stderr.decode()}")

def transcode_to_resolutions(input_path, output_dir):
    """
    Transcodes input video to multiple resolutions and extracts thumbnail.
    Returns dict of output filepaths.
    """
    base_filename = os.path.splitext(os.path.basename(input_path))[0]

    resolutions = {
        '1080p': '1920x1080',
        '720p': '1280x720',
        '480p': '854x480'
    }

    outputs = {}

    os.makedirs(output_dir, exist_ok=True)

    for label, resolution in resolutions.items():
        output_file = os.path.join(output_dir, f"{base_filename}_{label}.mp4")
        cmd = [
            'ffmpeg', '-i', input_path,
            '-vf', f'scale=w={resolution.split("x")[0]}:h={resolution.split("x")[1]}:force_original_aspect_ratio=decrease',
            '-c:v', 'libx264',
            '-preset', 'fast',
            '-crf', '23',
            '-c:a', 'aac',
            '-movflags', '+faststart',
            output_file
        ]
        run_ffmpeg(cmd)
        outputs[label] = output_file

    # Extract thumbnail at 5 seconds (or earliest frame)
    thumbnail_path = os.path.join(output_dir, f"{base_filename}_thumbnail.jpg")
    thumb_cmd = [
        'ffmpeg', '-ss', '00:00:05', '-i', input_path,
        '-frames:v', '1',
        '-q:v', '2',
        thumbnail_path
    ]
    run_ffmpeg(thumb_cmd)

    outputs['thumbnail'] = thumbnail_path

    return outputs
