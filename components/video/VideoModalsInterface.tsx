'use client';


import React, { useState, useEffect, useRef } from 'react';
import { VideoItem, VideoData, Particle } from '@/types/video';
import FullscreenVideoModal from './FullscreenVideoModal';

// Datos de los videos para cada modal
const videoData: VideoData = {
  1: [
    { title: "Tutorial Básico", duration: "5:42", progress: 45, url: "/Video/VideoModalLeft.mp4" },
    { title: "Conceptos Avanzados", duration: "8:15", progress: 0, url: "/Video/VideoModalLeft.mp4" },
    { title: "Práctica Guiada", duration: "12:33", progress: 23, url: "/Video/VideoModalLeft.mp4" },
    { title: "Casos de Uso", duration: "6:28", progress: 67, url: "/Video/VideoModalLeft.mp4" }
  ],
  2: [
    { title: "Presentación Principal", duration: "12:35", progress: 73, url: "/Video/VideoModalCenter.mp4" },
    { title: "Demo Interactiva", duration: "15:22", progress: 12, url: "/Video/VideoModalCenter.mp4" },
    { title: "Masterclass Completa", duration: "28:47", progress: 0, url: "/Video/VideoModalCenter.mp4" },
    { title: "Sesión Q&A", duration: "18:15", progress: 88, url: "/Video/VideoModalCenter.mp4" },
    { title: "Casos Avanzados", duration: "22:08", progress: 34, url: "/Video/VideoModalCenter.mp4" }
  ],
  3: [
    { title: "Tips y Trucos", duration: "8:21", progress: 28, url: "/Video/VideoModalRight.mp4" },
    { title: "Errores Comunes", duration: "6:45", progress: 0, url: "/Video/VideoModalRight.mp4" },
    { title: "Optimización", duration: "11:12", progress: 56, url: "/Video/VideoModalRight.mp4" },
    { title: "Recursos Extra", duration: "4:33", progress: 100, url: "/Video/VideoModalRight.mp4" }
  ]
};

const VideoModalsInterface: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [selectedVideos, setSelectedVideos] = useState<{ [key: number]: number }>({ 1: 0, 2: 0, 3: 0 });
  const [playingVideos, setPlayingVideos] = useState<{ [key: number]: boolean }>({ 1: false, 2: false, 3: false });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [fullscreenModal, setFullscreenModal] = useState<{ isOpen: boolean; videoUrl: string; title: string }>({
    isOpen: false,
    videoUrl: '',
    title: ''
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  // Función para alternar dropdown
  const toggleDropdown = (modalNumber: number, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setActiveDropdown(prev => prev === modalNumber ? null : modalNumber);
  };

  // Función para seleccionar video
  const selectVideo = (modalNumber: number, videoIndex: number, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setSelectedVideos(prev => ({
      ...prev,
      [modalNumber]: videoIndex
    }));
    setActiveDropdown(null);
  };

  // Función para reproducir/pausar video ULTRA-ESTABILIZADA
  const toggleVideoPlay = (modalNumber: number, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    
    const video = videoRefs.current[modalNumber];
    if (video) {
      try {
        if (playingVideos[modalNumber]) {
          // PAUSAR inmediatamente sin efectos
          video.pause();
          setPlayingVideos(prev => ({ ...prev, [modalNumber]: false }));
        } else {
          // REPRODUCIR con máxima estabilidad
          video.muted = true; // Asegurar que esté silenciado
          video.currentTime = 0; // Reiniciar desde el inicio
          
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setPlayingVideos(prev => ({ ...prev, [modalNumber]: true }));
              })
              .catch((error) => {
                console.log('Error de reproducción silenciado:', error);
                // Fallo silencioso
              });
          } else {
            // Fallback para navegadores sin Promise
            setPlayingVideos(prev => ({ ...prev, [modalNumber]: true }));
          }
        }
      } catch (error) {
        console.log('Error en toggleVideoPlay:', error);
      }
    }
  };

  // Función para expandir video a pantalla completa
  const expandVideo = (modalNumber: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const currentVideoIndex = selectedVideos[modalNumber];
    const currentVideo = videoData[modalNumber][currentVideoIndex];
    
    if (currentVideo.url) {
      setFullscreenModal({
        isOpen: true,
        videoUrl: currentVideo.url,
        title: currentVideo.title
      });
    }
  };

  // Función para cerrar modal de pantalla completa
  const closeFullscreenModal = () => {
    setFullscreenModal({
      isOpen: false,
      videoUrl: '',
      title: ''
    });
  };

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

  // Efectos de partículas SUTILES con notas musicales solo en la sección de videos
  useEffect(() => {
    const musicNotes = ['♪', '♫', '♬', '♩'];
    let lastParticleTime = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      const currentTime = Date.now();
      // Verificar si el cursor está dentro del contenedor de videos y limitar frecuencia
      if (containerRef.current && 
          containerRef.current.contains(e.target as Node) &&
          currentTime - lastParticleTime > 300 && // Mínimo 300ms entre partículas
          Math.random() > 0.97) { // Probabilidad muy reducida (3%)
        
        lastParticleTime = currentTime;
        const randomNote = musicNotes[Math.floor(Math.random() * musicNotes.length)];
        
        const newParticle = {
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY,
          opacity: 0.6, // Menos opacidad para ser más sutil
          note: randomNote,
          vx: (Math.random() - 0.5) * 1, // Movimiento más lento
          vy: -Math.random() * 1.5 - 0.5, // Velocidad vertical más sutil
          rotation: Math.random() * 180, // Menos rotación
          scale: 0.6 + Math.random() * 0.3 // Tamaño más pequeño
        };

        setParticles(prev => [...prev, newParticle]);

        // Remover partícula después de la animación (más rápido)
        setTimeout(() => {
          setParticles(prev => prev.filter(p => p.id !== newParticle.id));
        }, 1500);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Efecto MEGA-ESTABILIZADO para ELIMINAR COMPLETAMENTE palpitaciones
  useEffect(() => {
    // ESTABILIZACIÓN MÁXIMA de todos los videos
    Object.keys(videoRefs.current).forEach(modalNumber => {
      const video = videoRefs.current[parseInt(modalNumber)];
      if (video) {
        // PAUSAR Y RESETEAR completamente
        video.pause();
        video.currentTime = 0;
        
        // Aplicar estilos MEGA anti-palpitación con !important
        video.style.cssText = `
          transition: none !important;
          animation: none !important;
          transform: none !important;
          will-change: auto !important;
          backface-visibility: hidden !important;
          perspective: none !important;
          transform-style: flat !important;
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          background: #0a0a0a !important;
          display: block !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          opacity: 1 !important;
          border-radius: 16px 16px 0 0 !important;
          pointer-events: none !important;
          contain: strict !important;
          isolation: isolate !important;
          filter: none !important;
          outline: none !important;
          box-shadow: none !important;
          margin: 0 !important;
          padding: 0 !important;
        `;
        
        // CONFIGURACIÓN ULTRA-ESTABLE
        video.removeAttribute('autoplay');
        video.removeAttribute('loop');
        video.muted = true;
        video.playsInline = true;
        video.preload = 'metadata';
        
        // BLOQUEAR todos los eventos problemáticos
        video.onloadstart = null;
        video.onloadeddata = null;
        video.oncanplay = null;
        video.onloadedmetadata = null;
        video.onplay = null;
        video.onpause = null;
        video.onseeking = null;
        video.onseeked = null;
        
        // LISTENER para evitar cambios automáticos
        video.addEventListener('loadstart', (e) => e.stopPropagation());
        video.addEventListener('canplay', (e) => e.stopPropagation());
      }
    });
    
    // Reiniciar estado de reproducción INMEDIATAMENTE
    setPlayingVideos({ 1: false, 2: false, 3: false });
  }, [selectedVideos]);

  // Efecto de estabilización inicial al montar el componente
  useEffect(() => {
    const stabilizeAllVideos = () => {
      Object.values(videoRefs.current).forEach(video => {
        if (video) {
          // Aplicar estilos de estabilización directamente
          video.style.transition = 'none !important';
          video.style.animation = 'none !important';
          video.style.transform = 'none !important';
          video.style.willChange = 'auto';
          
          // Prevenir eventos que puedan causar palpitaciones
          video.removeAttribute('autoplay');
          video.removeAttribute('loop');
          video.currentTime = 0;
        }
      });
    };

    // Estabilizar inmediatamente y después de un delay
    stabilizeAllVideos();
    const timeoutId = setTimeout(stabilizeAllVideos, 500);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Componente de Modal de Video
  const VideoModal: React.FC<{ 
    modalNumber: number; 
    type: 'side' | 'center';
    position?: 'left' | 'right' | 'center';
  }> = ({ modalNumber, type, position }) => {
    const currentVideoIndex = selectedVideos[modalNumber];
    const currentVideo = videoData[modalNumber][currentVideoIndex];

    return (
      <div className={`video-modal ${type} ${position || ''}`} data-modal={modalNumber}>
        <div className="video-list-dropdown">
          <button
            className="dropdown-trigger"
            onClick={(e) => toggleDropdown(modalNumber, e)}
            type="button"
            title="Seleccionar video"
          >
            <div className="dropdown-icon" />
          </button>
          <div className={`video-list ${activeDropdown === modalNumber ? 'active' : ''}`} id={`videoList${modalNumber}`}>
            {videoData[modalNumber].map((video, index) => (
              <button
                key={index}
                className={`video-list-item ${index === currentVideoIndex ? 'active' : ''}`}
                onClick={(e) => selectVideo(modalNumber, index, e)}
                type="button"
              >
                <div className="video-list-title">{video.title}</div>
                <div className="video-list-duration">{video.duration}</div>
              </button>
            ))}
          </div>
        </div>

        {/* CONTENIDO DEL VIDEO CON ASPECT RATIO 16:9 */}
  <div className="video-content">
          {/* VIDEO PREVIEW CON ENCUADRE MEJORADO Y CERO PARPADEOS */}
          {currentVideo.url && (
            <video
              ref={el => {
                if (el) {
                  videoRefs.current[modalNumber] = el;
                  el.pause();
                  el.currentTime = 0;
                  el.muted = true;
                  el.playsInline = true;
                }
              }}
              className="video-preview"
              src={currentVideo.url}
              muted
              playsInline
              preload="metadata"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                background: '#000',
                display: 'block',
                position: 'absolute',
                top: 0,
                left: 0,
                borderRadius: '16px 16px 0 0',
                pointerEvents: 'none',
                outline: 'none',
                boxShadow: 'none',
                margin: 0,
                padding: 0
              }}
              onEnded={() => {
                setPlayingVideos(prev => ({ ...prev, [modalNumber]: false }));
              }}
              onLoadStart={e => e.currentTarget.pause()}
              onCanPlay={e => { if (!playingVideos[modalNumber]) e.currentTarget.pause(); }}
            />
          )}
          {/* Overlay de preview cuando no está reproduciendo */}
          {!playingVideos[modalNumber] && <div className="thumbnail" />}
          <button
            className={`play-button ${playingVideos[modalNumber] ? 'playing' : ''}`}
            onClick={(e) => toggleVideoPlay(modalNumber, e)}
            type="button"
            title={playingVideos[modalNumber] ? 'Pausar' : 'Reproducir'}
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          >
            {playingVideos[modalNumber] ? (
              <div style={{ display: 'flex', gap: 4 }}>
                <span style={{ width: 4, height: 18, background: '#fff', borderRadius: 2 }} />
                <span style={{ width: 4, height: 18, background: '#fff', borderRadius: 2 }} />
              </div>
            ) : (
              <span className="play-icon" />
            )}
          </button>
          <button
            className="expand-button"
            onClick={(e) => expandVideo(modalNumber, e)}
            type="button"
            title="Pantalla completa"
            style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: 12, padding: '6px 10px', borderRadius: 20 }}
          >
            Fullscreen
          </button>
        </div>
        <div className="video-info">
          <div className="video-title">{currentVideo.title}</div>
          <div className="video-duration">{currentVideo.duration}</div>
          <div className="progress-bar" style={{ ['--progress' as any]: `${currentVideo.progress}%` }} />
        </div>
      </div>
    );
  };

  return (
    <div className="video-modals-interface" ref={containerRef}>
      <div className="video-container">
        {/* Modal Izquierdo */}
        <VideoModal modalNumber={1} type="side" position="left" />
        
        {/* Modal Central (Principal) */}
        <VideoModal modalNumber={2} type="center" position="center" />
        
        {/* Modal Derecho */}
        <VideoModal modalNumber={3} type="side" position="right" />
      </div>

      {/* Partículas de notas musicales SUTILES */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="music-note-particle"
          style={{
            position: 'fixed',
            left: particle.x - 8,
            top: particle.y - 8,
            fontSize: `${12 * (particle.scale || 0.8)}px`, // Más pequeñas
            color: `rgba(255, 255, 255, ${(particle.opacity || 0.6) * 0.7})`, // Más transparentes
            pointerEvents: 'none',
            animation: 'musicNoteFloat 1.5s ease-out forwards', // Más rápidas
            zIndex: 100, // Menos prominentes
            fontWeight: '300', // Menos bold
            textShadow: '0 0 6px rgba(255, 255, 255, 0.3)', // Sombra más sutil
            transform: `rotate(${particle.rotation || 0}deg) scale(${particle.scale || 0.8})`,
            filter: 'blur(0.5px)' // Ligeramente borrosas para mayor sutileza
          }}
        >
          {particle.note || '♪'}
        </div>
      ))}

      {/* Modal de video en pantalla completa */}
      <FullscreenVideoModal
        isOpen={fullscreenModal.isOpen}
        videoUrl={fullscreenModal.videoUrl}
        title={fullscreenModal.title}
        onClose={closeFullscreenModal}
      />
    </div>
  );
};

export default VideoModalsInterface;
