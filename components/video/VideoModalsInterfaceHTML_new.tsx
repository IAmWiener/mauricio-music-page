'use client';

import React, { useEffect, useRef, useState } from 'react';

const VideoModalsInterface: React.FC = () => {
  // Estado local para dropdown activo
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  // Estado de reproducción por modal (1,2,3)
  const [playingModal, setPlayingModal] = useState<number | null>(null);
  // Estado para saber si hay fullscreen activo y en qué modal
  const [fullscreenModal, setFullscreenModal] = useState<number | null>(null);
  // Refs para los triggers de cada dropdown
  const triggerRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Datos de ejemplo para mostrar en las listas (puedes sustituir por los reales)
  const videoData = {
    1: [
      { title: 'Tutorial Básico', duration: '5:42', url: '/Video/Film&Game/Advertisement - Clorox.mov' },
      { title: 'Conceptos Avanzados', duration: '8:15', url: '/Video/VideoModalLeft.mp4' },
      { title: 'Práctica Guiada', duration: '12:33', url: '/Video/VideoModalLeft.mp4' },
      { title: 'Armonía I', duration: '6:12', url: '/Video/VideoModalLeft.mp4' },
      { title: 'Armonía II', duration: '7:45', url: '/Video/VideoModalLeft.mp4' },
      { title: 'Orquestación', duration: '9:10', url: '/Video/VideoModalLeft.mp4' },
      { title: 'Mix Básico', duration: '4:33', url: '/Video/VideoModalLeft.mp4' },
      { title: 'Mastering Tips', duration: '5:20', url: '/Video/VideoModalLeft.mp4' },
      { title: 'Workflow', duration: '3:48', url: '/Video/VideoModalLeft.mp4' },
      { title: 'Resumen', duration: '2:59', url: '/Video/VideoModalLeft.mp4' },
    ],
    2: [
      { title: 'Little Match Girl', duration: '5:42', src: 'https://drive.google.com/uc?export=download&id=1cFJmuCoiTQiueBVujushfS08n5Q2gBNS' },
      { title: 'Advertisement - Clorox', duration: '8:15', src: 'https://drive.google.com/uc?export=download&id=1cFJmuCoiTQiueBVujushfS08n5Q2gBNS' },
      { title: 'Advertisement - Whole Food', duration: '12:33', url: '/Video/Film&Game/Advertisement - Whole Food.mov' },
      { title: 'Narcos Main Title - Rescore', duration: '6:05', url: '/Video/Film&Game/Narcos Main Title - Rescore.mp4' },
      { title: 'Shrek - Church Scene Rescore', duration: '7:18', url: '/Video/Film&Game/Shrek - Church Scene Rescore.mp4' },
      { title: 'Shrek - Escape From the Dragon Rescore', duration: '9:02', url: '/Video/Film&Game/Shrek - Escape From the Dragon Rescore.mp4' },
      { title: 'Shrek - Opening Scene Rescore', duration: '4:12', url: '/Video/Film&Game/Shrek - Opening Scene Rescore.mp4' },
      { title: 'The Oracles Curse - Game Loop', duration: '5:58', url: '/Video/Film&Game/The Oracles Curse - Game Loop.mp4' },
      { title: 'The Oracles Curse - Main Theme', duration: '3:31', url: '/Video/Film&Game/The Oracles Curse - Main Theme.mp4' },

    ],
    3: [
      { title: 'Tutorial Básico', duration: '5:42', url: '/Video/VideoModalRight.mp4' },
      { title: 'Conceptos Avanzados', duration: '8:15', url: '/Video/VideoModalRight.mp4' },
      { title: 'Práctica Guiada', duration: '12:33', url: '/Video/VideoModalRight.mp4' },
      { title: 'Sound Design', duration: '6:40', url: '/Video/VideoModalRight.mp4' },
      { title: 'Texturas', duration: '7:05', url: '/Video/VideoModalRight.mp4' },
      { title: 'Ambientes', duration: '8:29', url: '/Video/VideoModalRight.mp4' },
      { title: 'FX', duration: '3:59', url: '/Video/VideoModalRight.mp4' },
      { title: 'Layers', duration: '5:13', url: '/Video/VideoModalRight.mp4' },
      { title: 'Routing', duration: '4:44', url: '/Video/VideoModalRight.mp4' },
      { title: 'Export', duration: '3:05', url: '/Video/VideoModalRight.mp4' },
    ],
  } as const;

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const el = e.target as Element | null;
      if (!el?.closest('.video-list-dropdown')) {
        setActiveDropdown(null);
        // limpiar estilos inline si quedaron
        [1,2,3].forEach((n) => {
          const list = document.getElementById(`videoList${n}`) as HTMLElement | null;
          if (list) { list.style.cssText = ''; }
        });
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  // Cerrar dropdown al scrollear la página
  useEffect(() => {
    const onScroll = () => {
      if (activeDropdown !== null) {
        setActiveDropdown(null);
        [1,2,3].forEach((n) => {
          const list = document.getElementById(`videoList${n}`) as HTMLElement | null;
          if (list) list.style.cssText = '';
        });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [activeDropdown]);

  // Desbloquear orientación al salir de fullscreen
  useEffect(() => {
    const onFsChange = () => {
      // Si no hay ningún elemento en fullscreen
      const isFs = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
      if (!isFs) {
        setFullscreenModal(null);
        try {
          const so = (screen as any).orientation;
          if (so?.unlock) so.unlock();
        } catch {}
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange as any);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange as any);
    };
  }, []);

  const toggleDropdown = (modalNumber: number, e: React.MouseEvent) => {
    e.stopPropagation();

    setActiveDropdown((prev) => {
      const next = prev === modalNumber ? null : modalNumber;

      // Ajuste de posición mobile (fixed al viewport)
      const list = document.getElementById(`videoList${modalNumber}`) as HTMLElement | null;
      const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
      const triggerEl = triggerRefs.current[modalNumber] as HTMLElement | null;
      if (list) {
        if (next && isMobile && triggerEl) {
          const rect = triggerEl.getBoundingClientRect();
          const top = Math.round(rect.bottom + 8);
          list.style.position = 'fixed';
          list.style.left = '8px';
          list.style.right = '8px';
          list.style.width = 'auto';
          list.style.top = `${top}px`;
          list.style.maxHeight = 'calc(52px * 3 + 24px)';
        } else {
          // limpiar para desktop o al cerrar o si no hay trigger
          list.style.cssText = '';
        }
      }

      // Reset estilos de otras listas
      if (next) {
        [1,2,3].forEach((n) => {
          if (n !== modalNumber) {
            const other = document.getElementById(`videoList${n}`) as HTMLElement | null;
            if (other) other.style.cssText = '';
          }
        });
      }

      return next;
    });
  };

  const selectVideo = (modalNumber: number, index: number) => {
    const selected = (videoData as any)[modalNumber][index];
    // Actualiza título/duración visibles en el modal
    const modal = document.querySelector(`.video-modal[data-modal-id="${modalNumber}"]`);
    const titleEl = modal?.querySelector('.video-title');
    const durationEl = modal?.querySelector('.video-duration');
    if (titleEl) titleEl.textContent = selected.title;
    if (durationEl) durationEl.textContent = selected.duration;
    // Cambiar src del video (opcional)
    const videoEl = modal?.querySelector('video.video-element') as HTMLVideoElement | null;
    if (videoEl && selected?.url) {
      videoEl.src = selected.url;
      videoEl.load();
    }
    setActiveDropdown(null);
  };

  const togglePlayModal = (modalNumber: number) => {
    const video = document.querySelector(
      `.video-modal[data-modal-id="${modalNumber}"] video.video-element`
    ) as HTMLVideoElement | null;
    if (!video) return;

    if (video.paused) {
      // Pausar otros videos
      const allVideos = document.querySelectorAll('video.video-element');
      allVideos.forEach((v) => {
        if (v !== video) {
          (v as HTMLVideoElement).pause();
        }
      });
      // Activar audio y reproducir
      video.muted = false;
      video.volume = 1;
      video.currentTime = video.currentTime; // no-op para forzar state update en algunos navegadores
      video.play().then(() => {
        setPlayingModal(modalNumber);
      }).catch(() => {
        // En caso de bloqueo del navegador, mantener botón visible
      });
    } else {
      video.pause();
      if (playingModal === modalNumber) setPlayingModal(null);
    }
  };

  const handleEnded = (modalNumber: number) => {
    if (playingModal === modalNumber) setPlayingModal(null);
  };

  const enterFullscreen = (modalNumber: number) => {
    const video = document.querySelector(
      `.video-modal[data-modal-id="${modalNumber}"] video.video-element`
    ) as HTMLVideoElement | null;
    if (!video) return;
    const anyVideo = video as any;
    if (video.requestFullscreen) {
      video.requestFullscreen()
        .then(async () => {
          setFullscreenModal(modalNumber);
          // Intentar forzar horizontal cuando sea posible
          try {
            const so = (screen as any).orientation;
            if (so?.lock) await so.lock('landscape');
          } catch {}
        })
        .catch(() => {});
    } else if (anyVideo.webkitEnterFullscreen) {
      // iOS Safari
      anyVideo.webkitEnterFullscreen();
      setFullscreenModal(modalNumber);
    } else if (anyVideo.webkitRequestFullscreen) {
      anyVideo.webkitRequestFullscreen();
      setFullscreenModal(modalNumber);
    }
  };

  return (
    <>
      <div className="video-modals-container">
        {/* Modal 1 */}
  <div className={`video-modal left ${playingModal === 1 ? 'playing' : ''}`} data-modal-id="1">
          <div className="video-modal-content">
            <div className="video-wrapper">
              <div className="video-card-badge">Film & Game Music</div>
              <video id="video1" className="video-element" loop muted playsInline onEnded={() => handleEnded(1)}>
                {/* Video preview */}
                <source src="/Video/VideoModalLeft.mp4" type="video/mp4" />
              </video>
              <div className="video-overlay">
                <div className="video-title">Video Izquierdo</div>
                <div className="video-duration">0:58</div>
              </div>
              <div className="video-controls">
                <button className="play-pause-btn" onClick={() => togglePlayModal(1)} title="Play/Pause">
                  {playingModal === 1 ? (
                    <svg viewBox="0 0 24 24" width="24" height="24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="24" height="24"><path d="M8 5v14l11-7z"/></svg>
                  )}
                </button>
              </div>
              {/* Fullscreen button visible al reproducir */}
              {playingModal === 1 && (
                <button
                  className="fullscreen-btn"
                  onClick={() => enterFullscreen(1)}
                  aria-label="Fullscreen"
                  title="Ver en pantalla completa"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M7 14H5v5h5v-2H7v-3zm0-4h2V7h3V5H7v5zm10 7h-3v2h5v-5h-2v3zm0-12h-5v2h3v3h2V5z" />
                  </svg>
                </button>
              )}
            </div>
            <div className="video-list-dropdown">
              <div
                className="dropdown-trigger"
                ref={(el) => { triggerRefs.current[1] = el; }}
                onClick={(e) => toggleDropdown(1, e)}
              >
                <svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
              </div>
              <div id="videoList1" className={`video-list ${activeDropdown === 1 ? 'active' : ''}`}>
                {videoData[1].map((v, i) => (
                  <div key={i} className="video-list-item" onClick={() => selectVideo(1, i)}>
                    <span className="video-item-title">{v.title}</span>
                    <span className="video-item-duration">{v.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal 2 */}
  <div className={`video-modal center ${playingModal === 2 ? 'playing' : ''}`} data-modal-id="2">
          <div className="video-modal-content">
            <div className="video-wrapper">
              <div className="video-card-badge">Film & Game Music</div>
              <video id="video2" className="video-element" loop muted playsInline onEnded={() => handleEnded(2)}>
                {/* Video preview */}
                <source src="/Video/Film&Game/Little Match Girl - Mauricio Felix.mp4" type="video/mp4" />
              </video>
              <div className="video-overlay">
                <div className="video-title">Video Central</div>
                <div className="video-duration">0:58</div>
              </div>
              <div className="video-controls">
                <button className="play-pause-btn" onClick={() => togglePlayModal(2)} title="Play/Pause">
                  {playingModal === 2 ? (
                    <svg viewBox="0 0 24 24" width="24" height="24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="24" height="24"><path d="M8 5v14l11-7z"/></svg>
                  )}
                </button>
              </div>
              {playingModal === 2 && (
                <button
                  className="fullscreen-btn"
                  onClick={() => enterFullscreen(2)}
                  aria-label="Fullscreen"
                  title="Ver en pantalla completa"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M7 14H5v5h5v-2H7v-3zm0-4h2V7h3V5H7v5zm10 7h-3v2h5v-5h-2v3zm0-12h-5v2h3v3h2V5z" />
                  </svg>
                </button>
              )}
            </div>
            <div className="video-list-dropdown">
              <div
                className="dropdown-trigger"
                ref={(el) => { triggerRefs.current[2] = el; }}
                onClick={(e) => toggleDropdown(2, e)}
              >
                <svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
              </div>
              <div id="videoList2" className={`video-list ${activeDropdown === 2 ? 'active' : ''}`}>
                {videoData[2].map((v, i) => (
                  <div key={i} className="video-list-item" onClick={() => selectVideo(2, i)}>
                    <span className="video-item-title">{v.title}</span>
                    <span className="video-item-duration">{v.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal 3 */}
  <div className={`video-modal right ${playingModal === 3 ? 'playing' : ''}`} data-modal-id="3">
          <div className="video-modal-content">
            <div className="video-wrapper">
              <div className="video-card-badge">Original Compositions</div>
              <video id="video3" className="video-element" loop muted playsInline onEnded={() => handleEnded(3)}>
                {/* Video preview */}
                <source src="/Video/VideoModalRight.mp4" type="video/mp4" />
              </video>
              <div className="video-overlay">
                <div className="video-title">Video Derecho</div>
                <div className="video-duration">0:58</div>
              </div>
              <div className="video-controls">
                <button className="play-pause-btn" onClick={() => togglePlayModal(3)} title="Play/Pause">
                  {playingModal === 3 ? (
                    <svg viewBox="0 0 24 24" width="24" height="24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="24" height="24"><path d="M8 5v14l11-7z"/></svg>
                  )}
                </button>
              </div>
              {playingModal === 3 && (
                <button
                  className="fullscreen-btn"
                  onClick={() => enterFullscreen(3)}
                  aria-label="Fullscreen"
                  title="Ver en pantalla completa"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M7 14H5v5h5v-2H7v-3zm0-4h2V7h3V5H7v5zm10 7h-3v2h5v-5h-2v3zm0-12h-5v2h3v3h2V5z" />
                  </svg>
                </button>
              )}
            </div>
            <div className="video-list-dropdown">
              <div
                className="dropdown-trigger"
                ref={(el) => { triggerRefs.current[3] = el; }}
                onClick={(e) => toggleDropdown(3, e)}
              >
                <svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
              </div>
              <div id="videoList3" className={`video-list ${activeDropdown === 3 ? 'active' : ''}`}>
                {videoData[3].map((v, i) => (
                  <div key={i} className="video-list-item" onClick={() => selectVideo(3, i)}>
                    <span className="video-item-title">{v.title}</span>
                    <span className="video-item-duration">{v.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
  .video-modals-container { display: flex; align-items: center; justify-content: center; gap: 2rem; padding: 1rem; width: 100%; }
        .video-modal { position: relative; border-radius: 1rem; overflow: visible; transition: transform 0.3s ease, opacity 0.3s ease; }
        .video-modal.left, .video-modal.right { width: 300px; height: 180px; opacity: 0.7; transform: scale(0.9); }
        .video-modal.center { width: 450px; height: 270px; z-index: 10; transform: scale(1); }
        .video-modal:hover { transform: scale(1.05); opacity: 1; }
        .video-modal.center:hover { transform: scale(1.02); }
        .video-modal-content { position: relative; width: 100%; height: 100%; }
        .video-wrapper { position: relative; width: 100%; height: 100%; overflow: hidden; border-radius: 1rem; }

        .video-list-dropdown { position: absolute; top: 1rem; right: 1rem; z-index: 40; }
        .dropdown-trigger { width: 32px; height: 32px; background-color: rgba(26,26,26,0.8); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background-color 0.2s ease; }
        .dropdown-trigger:hover { background-color: rgba(40,40,40,0.9); }
        .dropdown-trigger svg { fill: #fff; width: 20px; height: 20px; }

  .video-list { position: absolute; top: calc(100% + 8px); right: 0; background: rgba(24,24,24,0.96); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; width: clamp(220px, 24vw, 280px); padding: 8px; z-index: 45; opacity: 0; visibility: hidden; transform: translateY(-8px); transition: opacity .18s ease, transform .18s ease, visibility .18s ease; box-shadow: 0 16px 40px rgba(0,0,0,0.6); max-height: calc(52px * 3 + 24px); overflow-y: auto; overscroll-behavior: contain; backdrop-filter: blur(8px); transform-origin: top right; }
        .video-list.active { opacity: 1; visibility: visible; transform: translateY(0); }

        .video-list::-webkit-scrollbar { width: 8px; }
        .video-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 8px; }
        .video-list:hover::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.25); }
        .video-list { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.2) transparent; }

        .video-list-item { height: 52px; display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 12px; cursor: pointer; color: #eaeaea; padding: 0 12px; border-radius: 8px; }
        .video-list-item + .video-list-item { margin-top: 4px; }
        .video-list-item:hover { background-color: rgba(255,255,255,0.06); }
        .video-item-title { color: #ffffff; font-size: 14px; font-weight: 600; letter-spacing: .1px; }
        .video-item-duration { color: #9b9b9b; font-size: 12px; }

        .video-element { width: 100%; height: 100%; object-fit: cover; }
  /* Fullscreen sizing */
  .video-element:fullscreen { width: 100vw; height: 100vh; object-fit: contain; background: #000; }
  .video-element:-webkit-full-screen { width: 100vw; height: 100vh; object-fit: contain; background: #000; }
        .video-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 1rem; background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%); color: white; border-radius: 0 0 1rem 1rem; pointer-events: none; }
        .video-title { font-size: 1.25rem; font-weight: bold; }
        .video-duration { font-size: 0.875rem; }
  .video-controls { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
        .play-pause-btn { background: rgba(0,0,0,0.5); border: none; border-radius: 50%; color: white; cursor: pointer; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; }
        .play-pause-btn svg { fill: white; width: 32px; height: 32px; }
  /* Título/badge de cada card */
  .video-card-badge { position: absolute; top: 12px; left: 12px; z-index: 3; background: rgba(0,0,0,0.6); color: #fff; padding: 6px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; letter-spacing: .3px; backdrop-filter: blur(6px); }
  /* Botón de fullscreen */
  .fullscreen-btn { position: absolute; bottom: 12px; right: 12px; z-index: 3; background: rgba(0,0,0,0.5); color: #fff; border: none; border-radius: 8px; padding: 8px; cursor: pointer; display: ${'inline-flex'}; align-items: center; justify-content: center; }
  .fullscreen-btn:hover { background: rgba(0,0,0,0.6); }

        @media (max-width: 768px) {
          .video-modals-container { flex-direction: column; gap: 1.5rem; padding: 1rem; }
          .video-modal.left, .video-modal.right, .video-modal.center { width: 92vw; max-width: 480px; height: auto; aspect-ratio: 16/9; transform: none; opacity: 1; border-radius: 12px; }
          .video-wrapper { border-radius: 12px; }
          .video-list-dropdown { top: 0.75rem; right: 0.75rem; }
          .dropdown-trigger { width: 36px; height: 36px; }
          .video-list { position: fixed; left: 8px; right: 8px; width: auto; max-height: calc(52px * 3 + 24px); }
          .video-item-title { font-size: 15px; }
          .video-item-duration { font-size: 12px; }
          .fullscreen-btn { bottom: 8px; right: 8px; padding: 8px; }
        }

        @media (max-width: 420px) {
          .video-list { left: 8px; right: 8px; width: auto; }
          .dropdown-trigger { width: 36px; height: 36px; }
          .video-item-title { font-size: 14px; }
        }
      `}</style>
    </>
  );
};

export default VideoModalsInterface;
