// src/components/VideoPlayer.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function VideoPlayer() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    axios.get(`/videos/${id}`)
      .then(res => setVideo(res.data))
      .catch(err => console.error('Failed to load video', err));
  }, [id]);

  if (!video) return <p>Loading...</p>;

  const source = video.processed_720p || video.processed_480p || video.filename;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{video.title}</h2>
      <video controls width="720" src={`/${source}`} />
      <p>{video.description}</p>
    </div>
  );
}

export default VideoPlayer;
