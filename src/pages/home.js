import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <button
        onClick={() => navigate('/cat')}
        style={{
          padding: '20px 60px',
          fontSize: '24px',
          borderRadius: '12px',
          cursor: 'pointer',
        }}
      >
        cat
      </button>
    </div>
  );
}

export default Home;