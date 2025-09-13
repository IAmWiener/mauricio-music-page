'use client';

import React, { useState } from 'react';

const VideoDropdownTest: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const toggleDropdown = (modalNumber: number) => {
    console.log('Toggling dropdown for modal:', modalNumber);
    setActiveDropdown(prev => {
      const newValue = prev === modalNumber ? null : modalNumber;
      console.log('Previous active:', prev, 'New active:', newValue);
      return newValue;
    });
  };

  return (
    <div style={{ padding: '50px', background: '#000', minHeight: '100vh' }}>
      <h1 style={{ color: 'white', marginBottom: '30px' }}>Dropdown Test</h1>
      
      {[1, 2, 3].map(modalNumber => (
        <div key={modalNumber} style={{ 
          position: 'relative', 
          display: 'inline-block', 
          margin: '20px',
          background: '#333',
          width: '200px',
          height: '150px',
          borderRadius: '12px'
        }}>
          <h3 style={{ color: 'white', padding: '10px' }}>Modal {modalNumber}</h3>
          
          {/* Dropdown trigger */}
          <button
            onClick={() => toggleDropdown(modalNumber)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.8)',
              border: '1px solid #666',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            ⋮
          </button>

          {/* Dropdown list */}
          <div style={{
            position: 'absolute',
            top: '50px',
            right: '10px',
            background: 'rgba(0,0,0,0.95)',
            border: '1px solid #666',
            borderRadius: '8px',
            minWidth: '150px',
            zIndex: 1000,
            display: activeDropdown === modalNumber ? 'block' : 'none'
          }}>
            {['Video 1', 'Video 2', 'Video 3'].map((video, index) => (
              <div
                key={index}
                style={{
                  padding: '10px',
                  color: 'white',
                  cursor: 'pointer',
                  borderBottom: index < 2 ? '1px solid #333' : 'none'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {video}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoDropdownTest;
