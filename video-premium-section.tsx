'use client';

import React, { useState, useRef, useEffect } from 'react';

// Demo videos reales para la sección premium
const videoData = {
  1: [
    { title: "Tutorial Básico", duration: "5:42", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" },
    { title: "Conceptos Avanzados", duration: "8:15", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4" },
    { title: "Práctica Guiada", duration: "12:33", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4" },
    { title: "Casos de Uso", duration: "6:28", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" }
  ],
  2: [
    { title: "Presentación Principal", duration: "12:35", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4" },
    { title: "Demo Interactiva", duration: "15:22", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4" },
    { title: "Masterclass Completa", duration: "28:47", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" },
    { title: "Sesión Q&A", duration: "18:15", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4" },
    { title: "Casos Avanzados", duration: "22:08", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4" }
  ],
  3: [
    { title: "Tips y Trucos", duration: "8:21", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4" },
    { title: "Errores Comunes", duration: "6:45", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" },
    { title: "Optimización", duration: "11:12", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4" },
    { title: "Recursos Extra", duration: "4:33", url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4" }
  ]
};

function VideoPremiumSection() {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [selectedVideos, setSelectedVideos] = useState({ 1: 0, 2: 0, 3: 0 });
  const [currentCenterModal, setCurrentCenterModal] = useState(2);
  const [isReordering, setIsReordering] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenVideo, setFullscreenVideo] = useState<string>('');
  const [currentSpeed, setCurrentSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, note: string, vx?: number, vy?: number, rotation?: number, scale?: number, opacity?: number}>>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = {
    1: useRef<HTMLVideoElement>(null),
    2: useRef<HTMLVideoElement>(null),
    3: useRef<HTMLVideoElement>(null)
  };

  // Efectos de partículas con notas musicales (solo en la sección de video)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Solo crear partículas si el mouse está sobre el contenedor de video
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const isOverContainer = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );
      
      if (!isOverContainer) return;
      
      // Crear notas musicales de forma más fluida y natural
      if (Math.random() > 0.94) {
        const noteSymbols = ['♪', '♫', '♬', '♩', '♭', '♮', '♯'];
        const randomNote = noteSymbols[Math.floor(Math.random() * noteSymbols.length)];
        
        // Crear múltiples partículas sutiles para efecto más fluido
        const particleCount = Math.random() > 0.7 ? 2 : 1;
        
        for (let i = 0; i < particleCount; i++) {
          const newParticle = {
            id: Date.now() + Math.random() + i,
            x: e.clientX + (Math.random() - 0.5) * 40,
            y: e.clientY + (Math.random() - 0.5) * 40,
            note: randomNote,
            vx: (Math.random() - 0.5) * 1.5, // velocidad x más suave
            vy: -Math.random() * 2 - 0.5, // velocidad y más natural
            rotation: Math.random() * 360,
            scale: Math.random() * 0.3 + 0.7, // tamaños más consistentes
            opacity: Math.random() * 0.4 + 0.4 // opacidad variable
          };
          
          setParticles(prev => [...prev, newParticle]);
          
          // Remover después de la animación
          setTimeout(() => {
            setParticles(prev => prev.filter(p => p.id !== newParticle.id));
          }, 2500);
        }
      }
      
      // Crear ondas sonoras más sutiles
      if (Math.random() > 0.97) {
        const newWave = {
          id: Date.now() + Math.random(),
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
          note: '〜',
          vx: (Math.random() - 0.5) * 1,
          vy: -Math.random() * 1.5 - 0.3,
          rotation: Math.random() * 360,
          scale: Math.random() * 0.2 + 0.8,
          opacity: Math.random() * 0.3 + 0.3
        };
        
        setParticles(prev => [...prev, newWave]);
        
        setTimeout(() => {
          setParticles(prev => prev.filter(p => p.id !== newWave.id));
        }, 2000);
      }
    };

    // Throttle del mouse move para mejor performance
    let lastTime = 0;
    const throttledMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime >= 16) { // ~60fps
        handleMouseMove(e);
        lastTime = now;
      }
    };

    document.addEventListener('mousemove', throttledMouseMove);
    return () => document.removeEventListener('mousemove', throttledMouseMove);
  }, []);

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.video-list-dropdown')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Cerrar pantalla completa con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleDropdown = (modalNumber: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveDropdown(activeDropdown === modalNumber ? null : modalNumber);
  };

  const selectVideo = (modalNumber: number, videoIndex: number) => {
    setSelectedVideos(prev => ({ ...prev, [modalNumber]: videoIndex }));
    setActiveDropdown(null);
  };

  const moveToCenter = (modalNumber: number) => {
    if (isReordering || modalNumber === currentCenterModal) return;

    setIsReordering(true);
    setCurrentCenterModal(modalNumber);

    setTimeout(() => {
      setIsReordering(false);
    }, 800);
  };

  const playVideo = (modalNumber: number, event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Pausar todos los videos
    Object.values(videoRefs).forEach(ref => {
      if (ref.current) {
        ref.current.pause();
      }
    });

    if (modalNumber !== currentCenterModal) {
      moveToCenter(modalNumber);
      setTimeout(() => {
        executePlayVideo(modalNumber);
      }, 400);
    } else {
      executePlayVideo(modalNumber);
    }
  };

  const executePlayVideo = (modalNumber: number) => {
    const videoElement = videoRefs[modalNumber as keyof typeof videoRefs]?.current;
    if (videoElement) {
      videoElement.play();
      setTimeout(() => {
        videoElement.pause();
      }, 3000);
    }
  };

  const openFullscreen = (modalNumber: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const currentVideo = videoData[modalNumber as keyof typeof videoData][selectedVideos[modalNumber as keyof typeof selectedVideos]];
    setFullscreenVideo(currentVideo.url);
    setFullscreen(true);
  };

  const closeFullscreen = () => {
    setFullscreen(false);
    setCurrentSpeed(1);
    setIsMuted(false);
    setIsPlaying(false);
  };

  const toggleFullscreenPlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const changeSpeed = () => {
    const speeds = [0.5, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(currentSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setCurrentSpeed(speeds[nextIndex]);
  };

  const getModalClasses = (modalNumber: number) => {
    const isCenter = modalNumber === currentCenterModal;
    const baseClasses = `video-modal transition-all duration-[600ms] cubic-bezier-[0.25,0.8,0.25,1] relative bg-black rounded-[16px] cursor-pointer border shadow-[0_8px_32px_rgba(0,0,0,0.6)] hover:scale-105 hover:opacity-100 hover:border-gray-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.9)]`;
    
    if (isCenter) {
      return `${baseClasses} w-[400px] h-[280px] opacity-100 scale-100 border-2 border-gray-500 shadow-[0_16px_64px_rgba(0,0,0,0.8)] z-20 order-2 hover:scale-[1.02] hover:border-gray-400`;
    } else {
      return `${baseClasses} w-[280px] h-[200px] opacity-70 scale-85 border border-gray-600 z-10 ${modalNumber === 1 ? 'order-1' : 'order-3'} hover:border-gray-500`;
    }
  };

  const renderVideoModal = (modalNumber: number) => {
    const isCenter = modalNumber === currentCenterModal;
    const currentVideo = videoData[modalNumber as keyof typeof videoData][selectedVideos[modalNumber as keyof typeof selectedVideos]];
    const isDropdownActive = activeDropdown === modalNumber;

    return (
      <div
        key={modalNumber}
        className={getModalClasses(modalNumber)}
        data-modal={modalNumber}
        style={{ zIndex: isDropdownActive && modalNumber === 1 ? 999 : undefined }}
      >
        {/* Dropdown de lista de videos */}
        <div className="video-list-dropdown absolute -top-3 -right-3 z-[1000]">
          <div
            className="dropdown-trigger w-7 h-7 bg-black/60 border border-white/10 rounded-[6px] flex items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-[8px] hover:bg-black/80 hover:border-white/20 hover:scale-105 active:scale-[0.98]"
            onClick={(e) => toggleDropdown(modalNumber, e)}
          >
            <div className="dropdown-icon relative w-3 h-0.5 bg-white/60 rounded-[1px] transition-all duration-300 before:content-[''] before:absolute before:w-3 before:h-0.5 before:bg-white/60 before:rounded-[1px] before:-top-1 before:left-0 before:transition-all before:duration-300 after:content-[''] after:absolute after:w-3 after:h-0.5 after:bg-white/60 after:rounded-[1px] after:top-1 after:left-0 after:transition-all after:duration-300"></div>
          </div>

          {isDropdownActive && (
            <div 
              className={`video-list absolute top-10 min-w-[200px] bg-black/98 border border-gray-700 rounded-lg backdrop-blur-[25px] opacity-100 visible translate-y-0 transition-all duration-400 cubic-bezier-[0.25,0.8,0.25,1] max-h-[240px] overflow-y-auto shadow-[0_12px_40px_rgba(0,0,0,0.8)] scrollbar-thin ${
                modalNumber === 1 ? 'left-0 right-auto' : 'right-0'
              }`}
              style={{ zIndex: modalNumber === 1 ? 1002 : 1000 }}
            >
              {videoData[modalNumber as keyof typeof videoData].map((video, index) => (
                <div
                  key={index}
                  className={`video-list-item p-[10px_14px] border-b border-white/5 cursor-pointer transition-all duration-[250ms] flex flex-col gap-[3px] relative hover:bg-white/[0.03] hover:translate-x-[3px] before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-transparent before:transition-all before:duration-300 hover:before:bg-white/40 ${
                    selectedVideos[modalNumber as keyof typeof selectedVideos] === index ? 'bg-white/[0.06] before:bg-white' : ''
                  } last:border-b-0`}
                  onClick={() => selectVideo(modalNumber, index)}
                >
                  <div className="video-list-title text-xs font-normal text-white mb-[1px] leading-[1.3]">
                    {video.title}
                  </div>
                  <div className="video-list-duration text-[10px] text-gray-600 font-light">
                    {video.duration}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botón de pantalla completa (solo para modal central) */}
        {isCenter && (
          <div
            className="fullscreen-button absolute top-3 left-3 w-6 h-6 bg-black/40 border border-white/10 rounded flex items-center justify-center cursor-pointer opacity-100 scale-100 transition-all duration-300 z-[100] hover:bg-black/70 hover:border-white/20 hover:scale-110"
            onClick={(e) => openFullscreen(modalNumber, e)}
          >
            <div className="fullscreen-icon w-2 h-2 relative before:content-[''] before:absolute before:w-[3px] before:h-[3px] before:border before:border-white/80 before:-top-0.5 before:-left-0.5 before:border-r-0 before:border-b-0 after:content-[''] after:absolute after:w-[3px] after:h-[3px] after:border after:border-white/80 after:-bottom-0.5 after:-right-0.5 after:border-l-0 after:border-t-0"></div>
          </div>
        )}

        {/* Contenido del video */}
        <div className="video-content relative w-full h-full bg-gradient-to-[45deg] from-gray-900 to-gray-800 flex items-center justify-center rounded-[16px]">
          {/* Video element */}
          <video
            ref={videoRefs[modalNumber as keyof typeof videoRefs]}
            className="video-element absolute top-0 left-0 w-full h-full object-cover opacity-80"
            src={currentVideo.url}
            muted
            loop
          />

          {/* Thumbnail gradient overlay */}
          <div className="thumbnail absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-700/50 to-gray-800/30 opacity-30"></div>

          {/* Play button */}
          <div
            className={`play-button absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
              isCenter ? 'w-[50px] h-[50px] border-white/20' : 'w-10 h-10 border-white/15'
            } bg-white/5 border rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-[5px] hover:bg-white/10 hover:border-white/30 hover:scale-105`}
            onClick={(e) => playVideo(modalNumber, e)}
          >
            <div className={`play-icon w-0 h-0 ${
              isCenter 
                ? 'border-l-[10px] border-l-white/80 border-t-[6px] border-b-[6px]' 
                : 'border-l-[8px] border-l-white/70 border-t-[5px] border-b-[5px]'
            } border-t-transparent border-b-transparent ml-0.5`}></div>
          </div>

          {/* Video info overlay */}
          <div className="video-info absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-[20px_16px_16px] transform translate-y-full transition-transform duration-300 hover:translate-y-0">
            <div className={`video-title ${isCenter ? 'text-base' : 'text-sm'} font-semibold mb-1 text-white`}>
              {currentVideo.title}
            </div>
            <div className="video-duration text-xs text-gray-400">
              {currentVideo.duration}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="relative w-full py-16 sm:py-20 md:py-24 bg-black flex items-center justify-center">
      {/* Partículas flotantes con animaciones naturales y colores negros */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute pointer-events-none z-[9999] font-serif font-medium select-none"
          style={{
            left: particle.x,
            top: particle.y,
            fontSize: `${(particle.scale || 1) * 16 + 4}px`,
            opacity: particle.opacity || 0.6,
            textShadow: `0 0 4px rgba(0, 0, 0, 0.3), 0 0 8px rgba(0, 0, 0, 0.2)`,
            transform: `scale(${particle.scale || 1}) rotate(${particle.rotation || 0}deg)`,
            animation: particle.note === '〜' 
              ? `waveFloatSmooth 2000ms cubic-bezier(0.4, 0, 0.2, 1) forwards` 
              : `noteFloatSmooth 2500ms cubic-bezier(0.4, 0, 0.2, 1) forwards`,
            color: particle.note === '〜' ? '#1f2937' : '#000000',
            filter: 'none',
            transition: 'all 0.1s ease-out'
          }}
        >
          {particle.note}
        </div>
      ))}

      {/* Container principal */}
      <div 
        className={`video-container flex gap-8 items-center justify-center w-full max-w-[1400px] px-4 sm:px-6 md:px-8 ${isReordering ? 'transition-all duration-[800ms] cubic-bezier-[0.34,1.56,0.64,1]' : ''}`}
      >
        {[1, 2, 3].map(modalNumber => renderVideoModal(modalNumber))}
      </div>

      {/* Modal de pantalla completa */}
      {fullscreen && (
        <div className="fullscreen-modal fixed top-0 left-0 w-screen h-screen bg-black/95 flex items-center justify-center z-[10000] backdrop-blur-[10px]">
          <div className="fullscreen-video-container relative w-[90vw] h-[90vh] max-w-[1200px] max-h-[700px] bg-black rounded-xl">
            <video
              className="fullscreen-video w-full h-full object-cover"
              src={fullscreenVideo}
              controls
              autoPlay
              muted={isMuted}
              style={{}}
              ref={(video) => {
                if (video) {
                  (video as any).playbackRate = currentSpeed;
                }
              }}
            />
            
            {/* Controles de pantalla completa */}
            <div className="fullscreen-controls absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-[15px] bg-black/70 px-5 py-[10px] rounded-[25px] backdrop-blur-[10px]">
              <button
                className="control-button w-10 h-10 bg-transparent border border-white/30 rounded-full text-white cursor-pointer flex items-center justify-center transition-all duration-300 text-sm hover:bg-white/10 hover:border-white/50"
                onClick={toggleFullscreenPlay}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button
                className="control-button w-10 h-10 bg-transparent border border-white/30 rounded-full text-white cursor-pointer flex items-center justify-center transition-all duration-300 text-sm hover:bg-white/10 hover:border-white/50"
                onClick={toggleMute}
              >
                {isMuted ? '🔇' : '🔊'}
              </button>
              <button
                className="control-button w-10 h-10 bg-transparent border border-white/30 rounded-full text-white cursor-pointer flex items-center justify-center transition-all duration-300 text-sm hover:bg-white/10 hover:border-white/50"
                onClick={changeSpeed}
              >
                {currentSpeed}x
              </button>
            </div>

            {/* Botón cerrar */}
            <button
              className="close-fullscreen absolute top-5 right-5 w-10 h-10 bg-black/70 border border-white/30 rounded-full text-white cursor-pointer flex items-center justify-center text-lg transition-all duration-300 hover:bg-white/10 hover:scale-110"
              onClick={closeFullscreen}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Estilos CSS personalizados */}
      <style jsx>{`
        .video-modal:hover .video-info {
          transform: translateY(0);
        }
        
        @media (max-width: 768px) {
          .video-info {
            transform: translateY(0) !important;
          }
          .video-container {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }
          .video-modal {
            width: 300px !important;
            height: 180px !important;
          }
          .video-modal.center {
            width: 350px !important;
            height: 220px !important;
          }
        }
        
        @media (max-width: 480px) {
          .video-container {
            padding: 0.5rem;
          }
          .video-modal {
            width: 280px !important;
            height: 160px !important;
          }
          .video-modal.center {
            width: 320px !important;
            height: 200px !important;
          }
        }
        
        @keyframes noteFloatSmooth {
          0% {
            opacity: 0.6;
            transform: scale(0.8) rotate(0deg) translateY(0px) translateX(0px);
          }
          20% {
            opacity: 0.8;
            transform: scale(1) rotate(45deg) translateY(-8px) translateX(2px);
          }
          40% {
            opacity: 0.9;
            transform: scale(1.05) rotate(90deg) translateY(-20px) translateX(5px);
          }
          60% {
            opacity: 0.7;
            transform: scale(1) rotate(180deg) translateY(-35px) translateX(8px);
          }
          80% {
            opacity: 0.4;
            transform: scale(0.9) rotate(270deg) translateY(-55px) translateX(12px);
          }
          100% {
            opacity: 0;
            transform: scale(0.6) rotate(360deg) translateY(-80px) translateX(15px);
          }
        }
        
        @keyframes waveFloatSmooth {
          0% {
            opacity: 0.5;
            transform: scale(1) translateX(0px) translateY(0px);
          }
          25% {
            opacity: 0.7;
            transform: scale(1.2) translateX(15px) translateY(-5px);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.4) translateX(30px) translateY(-10px);
          }
          75% {
            opacity: 0.5;
            transform: scale(1.2) translateX(50px) translateY(-15px);
          }
          100% {
            opacity: 0;
            transform: scale(0.8) translateX(70px) translateY(-20px);
          }
        }
        
        /* Scrollbar mejorada y más sutil */
        .video-list::-webkit-scrollbar {
          width: 6px;
        }
        .video-list::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 3px;
          margin: 6px 0;
        }
        .video-list::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(156, 163, 175, 0.4) 0%, rgba(156, 163, 175, 0.2) 100%);
          border-radius: 3px;
          transition: all 0.3s ease;
        }
        .video-list::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(156, 163, 175, 0.6) 0%, rgba(156, 163, 175, 0.4) 100%);
        }
        
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.3) rgba(255, 255, 255, 0.03);
        }
      `}</style>
    </div>
  );
}

export default VideoPremiumSection;
