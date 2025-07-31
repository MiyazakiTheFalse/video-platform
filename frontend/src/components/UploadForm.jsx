import React, { useState } from 'react';
import axios from 'axios';

export default function UploadForm() {
  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      setStatus('Please select a video file.');
      return;
    }
    if (!title.trim()) {
      setStatus('Please enter a title.');
      return;
    }

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('title', title);
    formData.append('description', description);

    try {
      setStatus('Uploading...');
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, // send cookies for auth session
      });
      setStatus(`Upload successful! Video ID: ${res.data.video_id}`);
      setVideoFile(null);
      setTitle('');
      setDescription('');
    } catch (err) {
      setStatus(
        err.response?.data?.error || 'Upload failed, please try again.'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Upload a Video</h2>

      <label>
        Video File:
        <input type="file" accept="video/*" onChange={handleFileChange} />
      </label>
      <br />

      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={255}
        />
      </label>
      <br />

      <label>
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={1000}
        />
      </label>
      <br />

      <button type="submit">Upload</button>
      <p>{status}</p>
    </form>
  );
}
