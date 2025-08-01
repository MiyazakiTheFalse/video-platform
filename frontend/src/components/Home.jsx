// src/components/Home.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios.get('/videos')
      .then(res => setVideos(res.data))
      .catch(err => console.error('Failed to fetch videos', err));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Latest Videos</h2>
      {videos.map(video => (
        <div key={video.id} style={{ marginBottom: '1rem' }}>
          <Link to={`/watch/${video.id}`} style={{ textDecoration: 'none', color: 'black' }}>
            <img 
              src={`/${video.thumbnail}`} 
              alt="thumbnail"
              style={{ width: '240px', borderRadius: '8px' }}
            />
            <div>
              <strong>{video.title}</strong>
              <p>{video.description}</p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Home;
