'use client';


import React from 'react';
import VideoModalsInterface from './VideoModalsInterface';

interface VideoSectionProps {
  className?: string;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  id?: string;
}

const VideoSection: React.FC<VideoSectionProps> = ({ 
  className = '', 
  title = "Videos Premium", 
  subtitle = "Explora nuestro contenido exclusivo",
  showHeader = true,
  id = "videos"
}) => {
  return (
  <section id={id} className={`video-section-wrapper w-full ${className}`}>
      {/* Header de la sección */}
      {showHeader && (
        <div className="text-center py-8 px-8">
          <h2 className="text-4xl font-bold text-white mb-4">{title}</h2>
          <p className="text-xl text-gray-300">{subtitle}</p>
        </div>
      )}
      
      {/* Componente de modales de video */}
      <VideoModalsInterface />
    </section>
  );
};

export default VideoSection;
