'use client';

import React, { useEffect, useRef, useCallback } from 'react';

const VideoModalsInterfaceHTML: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Datos de los videos para cada modal
  const videoData = {
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

  // Funciones para el dropdown
  const toggleDropdown = useCallback((modalNumber: number) => {
    console.log('toggleDropdown called for modal:', modalNumber);
    const dropdown = document.getElementById(`videoList${modalNumber}`);
    const modal = document.querySelector(`.video-modal[data-modal="${modalNumber}"]`);
    const trigger = modal?.querySelector('.dropdown-trigger');
    const allDropdowns = document.querySelectorAll('.video-list');
    
    console.log('dropdown found:', dropdown);
    console.log('modal found:', modal);
    console.log('trigger found:', trigger);
    
    // Cerrar otros dropdowns
    allDropdowns.forEach(d => {
      if (d !== dropdown) {
        d.classList.remove('active');
      }
    });
    
    if (dropdown && trigger) {
      // Obtener dimensiones
      const rect = trigger.getBoundingClientRect();
      const dropdownWidth = 220; // Ancho del dropdown
      const windowWidth = window.innerWidth;
      const scrollY = window.scrollY;
      
      // Calcular posición inicial
      let topPos = rect.bottom + scrollY + 8;
      let leftPos = rect.right - dropdownWidth;
      
      // Ajustes según el modal
      if (modalNumber === 1) {
        // Modal izquierdo - mostrar a la derecha del trigger
        leftPos = rect.left;
      } else if (modalNumber === 2) {
        // Modal central - centrar respecto al trigger
        leftPos = rect.left + (rect.width / 2) - (dropdownWidth / 2);
      } else if (modalNumber === 3) {
        // Modal derecho - mostrar a la izquierda del trigger
        leftPos = rect.right - dropdownWidth;
      }
      
      // Ajustar si se sale de la pantalla
      if (leftPos + dropdownWidth > windowWidth) {
        leftPos = windowWidth - dropdownWidth - 15;
      }
      if (leftPos < 15) {
        leftPos = 15;
      }
      
      // Aplicar estilos forzados
      dropdown.style.position = 'fixed';
      dropdown.style.top = topPos + 'px';
      dropdown.style.left = leftPos + 'px';
      dropdown.style.right = 'auto';
      dropdown.style.zIndex = '99999';
      dropdown.style.display = 'block';
      
      // Toggle del dropdown actual
      const wasActive = dropdown.classList.contains('active');
      dropdown.classList.toggle('active');
      
      console.log('🎯 Dropdown debug:', {
        modalNumber,
        wasActive,
        nowActive: dropdown.classList.contains('active'),
        position: { top: topPos, left: leftPos },
        element: dropdown
      });
      
      // Forzar repaint
      dropdown.offsetHeight;
    }
  }, []);

  // Función para seleccionar video
  const selectVideo = useCallback((modalNumber: number, videoIndex: number) => {
    console.log('selectVideo called:', modalNumber, videoIndex);
    const modal = document.querySelector(`.video-modal[data-modal="${modalNumber}"]`);
    const videoInfo = modal?.querySelector('.video-info');
    const videoElement = modal?.querySelector('.video-element') as HTMLVideoElement;
    const videoList = document.getElementById(`videoList${modalNumber}`);
    
    // Pausar el video actual si está reproduciendo
    if (videoElement && !videoElement.paused) {
      videoElement.pause();
    }
    
    // Actualizar datos del video
    const selectedVideo = (videoData as any)[modalNumber][videoIndex];
    if (videoInfo && selectedVideo) {
      const titleEl = videoInfo.querySelector('.video-title');
      const durationEl = videoInfo.querySelector('.video-duration');
      if (titleEl) titleEl.textContent = selectedVideo.title;
      if (durationEl) durationEl.textContent = selectedVideo.duration;
    }
    
    // Cambiar el src del video
    if (videoElement && selectedVideo) {
      videoElement.src = selectedVideo.url;
      videoElement.load();
    }
    
    // Actualizar item activo en la lista
    videoList?.querySelectorAll('.video-list-item').forEach((item, index) => {
      item.classList.toggle('active', index === videoIndex);
    });
    
    // Cerrar dropdown
    videoList?.classList.remove('active');
    
    console.log('Video selected:', selectedVideo?.title);
  }, []);

  // Función para reproducir video
  const playVideo = useCallback((modalNumber: number) => {
    console.log('playVideo called for modal:', modalNumber);
    const modal = document.querySelector(`.video-modal[data-modal="${modalNumber}"]`);
    const playButton = modal?.querySelector('.play-button') as HTMLElement;
    const videoElement = modal?.querySelector('.video-element') as HTMLVideoElement;
    
    // Pausar todos los otros videos primero
    const allModals = document.querySelectorAll('.video-modal');
    allModals.forEach((otherModal, index) => {
      const otherModalNumber = parseInt(otherModal.getAttribute('data-modal') || '0');
      if (otherModalNumber !== modalNumber) {
        const otherPlayButton = otherModal.querySelector('.play-button') as HTMLElement;
        const otherVideoElement = otherModal.querySelector('.video-element') as HTMLVideoElement;
        
        if (otherVideoElement && !otherVideoElement.paused) {
          otherVideoElement.pause();
        }
        if (otherModal) otherModal.classList.remove('playing');
        if (otherPlayButton) {
          otherPlayButton.style.opacity = '1';
          otherPlayButton.style.transform = 'translate(-50%, -50%) scale(1)';
        }
      }
    });
    
    // Animación al hacer clic
    if (playButton) {
      playButton.style.transform = 'translate(-50%, -50%) scale(0.9)';
      setTimeout(() => {
        playButton.style.transform = 'translate(-50%, -50%) scale(1.05)';
      }, 100);
    }
    
    // Reproducir el video
    setTimeout(() => {
      if (playButton) playButton.style.opacity = '0';
      if (modal) modal.classList.add('playing');
      if (videoElement) {
        videoElement.classList.add('playing');
        videoElement.play().catch(error => {
          console.log('Error al reproducir video:', error);
        });
      }
      console.log(`Reproduciendo video del modal ${modalNumber}`);
    }, 200);
  }, []);

  // Función para pausar video
  const pauseVideo = useCallback((modalNumber: number) => {
    console.log('pauseVideo called for modal:', modalNumber);
    const modal = document.querySelector(`.video-modal[data-modal="${modalNumber}"]`);
    const playButton = modal?.querySelector('.play-button') as HTMLElement;
    const videoElement = modal?.querySelector('.video-element') as HTMLVideoElement;
    
    if (videoElement) {
      videoElement.pause();
      videoElement.classList.remove('playing');
    }
    if (modal) modal.classList.remove('playing');
    if (playButton) {
      playButton.style.opacity = '1';
      playButton.style.transform = 'translate(-50%, -50%) scale(1)';
    }
  }, []);

  // Función mejorada para pantalla completa
  const openFullscreen = useCallback((modalNumber: number) => {
    console.log('openFullscreen called for modal:', modalNumber);
    const modal = document.querySelector(`.video-modal[data-modal="${modalNumber}"]`);
    const videoElement = modal?.querySelector('.video-element') as HTMLVideoElement;
    
    if (!videoElement) {
      console.log('No video element found');
      return;
    }

    // Crear overlay de pantalla completa
    const fullscreenOverlay = document.createElement('div');
    fullscreenOverlay.id = 'fullscreen-overlay';
    fullscreenOverlay.innerHTML = `
      <div class="fullscreen-container">
        <video id="fullscreen-video" controls autoplay>
          <source src="${videoElement.src}" type="video/mp4" />
        </video>
        <button class="close-fullscreen" onclick="closeFullscreen()">✕</button>
      </div>
    `;
    
    // Estilos para pantalla completa
    const styles = `
      <style>
        #fullscreen-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.95);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }
        .fullscreen-container {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
        }
        #fullscreen-video {
          width: 100%;
          height: auto;
          max-width: 90vw;
          max-height: 90vh;
          border-radius: 12px;
        }
        .close-fullscreen {
          position: absolute;
          top: -40px;
          right: 0;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        .close-fullscreen:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }
      </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
    document.body.appendChild(fullscreenOverlay);
    
    // Reproducir desde el tiempo actual del video original
    const fullscreenVideo = document.getElementById('fullscreen-video') as HTMLVideoElement;
    if (fullscreenVideo) {
      fullscreenVideo.currentTime = videoElement.currentTime;
    }
    
    // Pausar el video original
    pauseVideo(modalNumber);
    
    console.log('Fullscreen opened for modal:', modalNumber);
  }, [pauseVideo]);

  // Función para cerrar pantalla completa
  const closeFullscreen = useCallback(() => {
    console.log('closeFullscreen called');
    const overlay = document.getElementById('fullscreen-overlay');
    const styles = document.querySelector('style[data-fullscreen]');
    
    if (overlay) {
      overlay.remove();
    }
    if (styles) {
      styles.remove();
    }
    
    console.log('Fullscreen closed');
  }, []);

  useEffect(() => {
    // Asignar funciones a window para compatibilidad
    (window as any).toggleDropdown = toggleDropdown;
    (window as any).selectVideo = selectVideo;
    (window as any).playVideo = playVideo;
    (window as any).pauseVideo = pauseVideo;
    (window as any).openFullscreen = openFullscreen;
    (window as any).closeFullscreen = closeFullscreen;
    
    // Debug function
    (window as any).debugDropdowns = () => {
      const lists = document.querySelectorAll('.video-list');
      console.log('🔍 Found', lists.length, 'dropdown lists:');
      lists.forEach((list, index) => {
        console.log(`List ${index + 1}:`, {
          id: list.id,
          classList: Array.from(list.classList),
          style: list.getAttribute('style'),
          visible: getComputedStyle(list).visibility,
          opacity: getComputedStyle(list).opacity,
          display: getComputedStyle(list).display
        });
      });
    };
    
    // Auto debug after mount
    setTimeout(() => {
      (window as any).debugDropdowns();
    }, 1000);

    (window as any).selectVideo = function(modalNumber: number, videoIndex: number) {
      const modal = document.querySelector(`.video-modal[data-modal="${modalNumber}"]`);
      const videoInfo = modal?.querySelector('.video-info');
      const videoElement = modal?.querySelector('.video-element') as HTMLVideoElement;
      const videoList = document.getElementById(`videoList${modalNumber}`);
      
      // Pausar el video actual si está reproduciendo
      if (videoElement && !videoElement.paused) {
        (window as any).pauseVideo(modalNumber);
      }
      
      // Actualizar datos del video
      const selectedVideo = (videoData as any)[modalNumber][videoIndex];
      if (videoInfo) {
        const titleEl = videoInfo.querySelector('.video-title');
        const durationEl = videoInfo.querySelector('.video-duration');
        if (titleEl) titleEl.textContent = selectedVideo.title;
        if (durationEl) durationEl.textContent = selectedVideo.duration;
      }
      
      // Cambiar el src del video
      if (videoElement) {
        videoElement.src = selectedVideo.url;
        videoElement.load();
      }
      
      // Actualizar item activo en la lista
      videoList?.querySelectorAll('.video-list-item').forEach((item, index) => {
        item.classList.toggle('active', index === videoIndex);
      });
      
      // Cerrar dropdown
      videoList?.classList.remove('active');
      
      // Prevenir propagación
      event?.stopPropagation();
    };

    // Función para pausar todos los videos excepto el actual
    (window as any).pauseAllOtherVideos = function(currentModalNumber: number) {
      const allModals = document.querySelectorAll('.video-modal');
      
      allModals.forEach((modal, index) => {
        const modalNumber = parseInt(modal.getAttribute('data-modal') || '0');
        if (modalNumber !== currentModalNumber) {
          const playButton = modal.querySelector('.play-button') as HTMLElement;
          const videoElement = modal.querySelector('.video-element') as HTMLVideoElement;
          
          if (videoElement && !videoElement.paused) {
            videoElement.pause();
            videoElement.classList.remove('playing');
          }
          if (modal) modal.classList.remove('playing');
          if (playButton) {
            playButton.style.opacity = '1';
            playButton.style.transform = 'translate(-50%, -50%) scale(1)';
          }
        }
      });
    };

    (window as any).playVideo = function(modalNumber: number) {
      const modal = document.querySelector(`.video-modal[data-modal="${modalNumber}"]`);
      const playButton = modal?.querySelector('.play-button') as HTMLElement;
      const videoElement = modal?.querySelector('.video-element') as HTMLVideoElement;
      
      // Pausar todos los otros videos primero
      (window as any).pauseAllOtherVideos(modalNumber);
      
      // Animación al hacer clic
      if (playButton) {
        playButton.style.transform = 'translate(-50%, -50%) scale(0.9)';
        setTimeout(() => {
          playButton.style.transform = 'translate(-50%, -50%) scale(1.05)';
        }, 100);
      }
      
      // Reproducir el video
      setTimeout(() => {
        if (playButton) playButton.style.opacity = '0';
        if (modal) modal.classList.add('playing');
        if (videoElement) {
          videoElement.classList.add('playing');
          videoElement.play().catch(error => {
            console.log('Error al reproducir video:', error);
          });
        }
        console.log(`Reproduciendo video del modal ${modalNumber}`);
      }, 200);
    };

    // Función para pausar video y mostrar botón de play
    (window as any).pauseVideo = function(modalNumber: number) {
      const modal = document.querySelector(`.video-modal[data-modal="${modalNumber}"]`);
      const playButton = modal?.querySelector('.play-button') as HTMLElement;
      const videoElement = modal?.querySelector('.video-element') as HTMLVideoElement;
      
      if (videoElement) {
        videoElement.pause();
        videoElement.classList.remove('playing');
      }
      if (modal) modal.classList.remove('playing');
      if (playButton) {
        playButton.style.opacity = '1';
        playButton.style.transform = 'translate(-50%, -50%) scale(1)';
      }
    };

    // Función para abrir video en pantalla completa
    (window as any).openFullscreen = function(modalNumber: number) {
      const modal = document.querySelector(`.video-modal[data-modal="${modalNumber}"]`);
      const videoElement = modal?.querySelector('.video-element') as HTMLVideoElement;
      const fullscreenModal = document.getElementById('fullscreenModal');
      const fullscreenVideo = document.getElementById('fullscreenVideo') as HTMLVideoElement;
      const fullscreenVideoSource = document.getElementById('fullscreenVideoSource') as HTMLSourceElement;
      
      if (videoElement && fullscreenModal && fullscreenVideo && fullscreenVideoSource) {
        // Pausar el video original
        videoElement.pause();
        
        // Limpiar completamente el video anterior
        fullscreenVideo.pause();
        fullscreenVideo.currentTime = 0;
        fullscreenVideoSource.src = '';
        fullscreenVideo.src = '';
        fullscreenVideo.load();
        
        // Obtener la URL del video original
        const originalSource = videoElement.querySelector('source') as HTMLSourceElement;
        let videoSrc = '';
        
        if (originalSource && originalSource.src) {
          videoSrc = originalSource.src;
        } else if (videoElement.src) {
          videoSrc = videoElement.src;
        } else {
          // Fallback: construir la URL basada en el modal
          switch(modalNumber) {
            case 1:
              videoSrc = '/Video/VideoModalLeft.mp4';
              break;
            case 2:
              videoSrc = '/Video/VideoModalCenter.mp4'; 
              break;
            case 3:
              videoSrc = '/Video/VideoModalRight.mp4';
              break;
            default:
              console.error('Modal number not recognized:', modalNumber);
              return;
          }
        }
        
        console.log('Loading video:', videoSrc);
        
        // Configurar el video de pantalla completa
        fullscreenVideoSource.src = videoSrc;
        fullscreenVideo.load(); // Cargar el nuevo source
        fullscreenVideo.muted = false; // Permitir audio en pantalla completa
        
        // Mostrar modal
        fullscreenModal.classList.add('active');
        
        // Función para intentar reproducir
        const tryToPlay = () => {
          fullscreenVideo.play().catch(error => {
            console.log('Error al reproducir video en pantalla completa:', error);
            // Si falla, intentar de nuevo con muted
            fullscreenVideo.muted = true;
            fullscreenVideo.play().catch(mutedError => {
              console.log('Error incluso con muted:', mutedError);
            });
          });
        };
        
        // Esperar a que cargue y reproducir
        const onCanPlay = () => {
          fullscreenVideo.removeEventListener('canplay', onCanPlay);
          fullscreenVideo.currentTime = videoElement.currentTime;
          tryToPlay();
        };
        
        fullscreenVideo.addEventListener('canplay', onCanPlay);
        
        // Fallback timeout más largo
        setTimeout(() => {
          if (fullscreenVideo.readyState >= 3) { // HAVE_FUTURE_DATA
            fullscreenVideo.currentTime = videoElement.currentTime;
            tryToPlay();
          }
        }, 1000);
      }
    };

    // Función para cerrar pantalla completa
    (window as any).closeFullscreen = function() {
      const fullscreenModal = document.getElementById('fullscreenModal');
      const fullscreenVideo = document.getElementById('fullscreenVideo') as HTMLVideoElement;
      const fullscreenVideoSource = document.getElementById('fullscreenVideoSource') as HTMLSourceElement;
      
      if (fullscreenModal && fullscreenVideo) {
        // Remover event listeners para evitar memory leaks
        const newVideo = fullscreenVideo.cloneNode(true) as HTMLVideoElement;
        fullscreenVideo.parentNode?.replaceChild(newVideo, fullscreenVideo);
        
        fullscreenModal.classList.remove('active');
        
        // Limpiar sources correctamente
        if (fullscreenVideoSource) {
          fullscreenVideoSource.src = '';
        }
        
        // Obtener la nueva referencia después del reemplazo
        const cleanVideo = document.getElementById('fullscreenVideo') as HTMLVideoElement;
        const cleanSource = document.getElementById('fullscreenVideoSource') as HTMLSourceElement;
        
        if (cleanVideo) {
          cleanVideo.pause();
          cleanVideo.currentTime = 0;
          cleanVideo.src = '';
          if (cleanSource) {
            cleanSource.src = '';
          }
          cleanVideo.load();
        }
      }
    };

    // Cerrar dropdowns al hacer clic fuera
    const handleDocumentClick = (e: MouseEvent) => {
      if (!(e.target as Element)?.closest('.video-list-dropdown')) {
        document.querySelectorAll('.video-list').forEach(dropdown => {
          dropdown.classList.remove('active');
        });
        
        // Remover clase dropdown-active y trigger active
        document.querySelectorAll('.video-modal').forEach(modal => {
          modal.classList.remove('dropdown-active');
        });
        
        document.querySelectorAll('.dropdown-trigger').forEach(trigger => {
          trigger.classList.remove('active');
        });
      }
    };

    // Reposicionar dropdowns al hacer scroll o resize
    const handleScrollResize = () => {
      document.querySelectorAll('.video-list.active').forEach((dropdown, index) => {
        const modalNumber = index + 1;
        const modal = document.querySelector(`.video-modal[data-modal="${modalNumber}"]`);
        const trigger = modal?.querySelector('.dropdown-trigger');
        
        if (trigger) {
          const rect = trigger.getBoundingClientRect();
          const dropdownWidth = 220;
          const windowWidth = window.innerWidth;
          const scrollY = window.scrollY;
          
          let topPos = rect.bottom + scrollY + 8;
          let leftPos = rect.right - dropdownWidth;
          
          // Ajustes según el modal
          if (modalNumber === 1) {
            leftPos = rect.left;
          } else if (modalNumber === 2) {
            leftPos = rect.left + (rect.width / 2) - (dropdownWidth / 2);
          }
          
          // Ajustar límites
          if (leftPos + dropdownWidth > windowWidth) {
            leftPos = windowWidth - dropdownWidth - 15;
          }
          if (leftPos < 15) {
            leftPos = 15;
          }
          
          (dropdown as HTMLElement).style.top = topPos + 'px';
          (dropdown as HTMLElement).style.left = leftPos + 'px';
        }
      });
    };

    // Cerrar modal con tecla ESC
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const fullscreenModal = document.getElementById('fullscreenModal');
        if (fullscreenModal?.classList.contains('active')) {
          (window as any).closeFullscreen();
        }
      }
    };

    // Efectos de partículas
    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.95) {
        const cursor = document.createElement('div');
        cursor.style.position = 'fixed';
        cursor.style.width = '4px';
        cursor.style.height = '4px';
        cursor.style.background = 'rgba(255, 255, 255, 0.1)';
        cursor.style.borderRadius = '50%';
        cursor.style.pointerEvents = 'none';
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursor.style.animation = 'fadeOut 1s ease-out forwards';
        
        document.body.appendChild(cursor);
        
        setTimeout(() => {
          cursor.remove();
        }, 1000);
      }
    };

    // Efecto de respiración para el modal central
    const breathingInterval = setInterval(() => {
      const centerModal = document.querySelector('.video-modal.center') as HTMLElement;
      if (centerModal && !centerModal.matches(':hover')) {
        centerModal.style.transform = 'scale(1.005)';
        setTimeout(() => {
          centerModal.style.transform = 'scale(1)';
        }, 2000);
      }
    }, 4000);

    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScrollResize);
    window.addEventListener('resize', handleScrollResize);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScrollResize);
      window.removeEventListener('resize', handleScrollResize);
      clearInterval(breathingInterval);
      delete (window as any).toggleDropdown;
      delete (window as any).selectVideo;
      delete (window as any).playVideo;
      delete (window as any).pauseVideo;
      delete (window as any).pauseAllOtherVideos;
      delete (window as any).openFullscreen;
      delete (window as any).closeFullscreen;
    };
  }, []);

  return (
    <>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .video-modals-html-body {
          background: linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%);
          color: #ffffff;
          font-family: 'Arial', sans-serif;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .video-container {
          display: flex;
          gap: 2rem;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 1400px;
          padding: 2rem;
        }

        .video-modal {
          position: relative;
          background: #000000;
          border-radius: 16px;
          overflow: visible;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
          border: 1px solid #333;
        }

        .video-modal.side {
          width: 280px;
          height: 200px;
          opacity: 0.7;
          transform: scale(0.85);
        }

        .video-modal.center {
          width: 400px;
          height: 280px;
          opacity: 1;
          transform: scale(1);
          border: 2px solid #444;
          box-shadow: 0 16px 64px rgba(0, 0, 0, 0.8);
        }

        .video-modal:hover {
          transform: scale(1.05);
          opacity: 1;
          border-color: #666;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.9);
        }

        .video-modal.center:hover {
          transform: scale(1.02);
        }

        .video-content {
          position: relative;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, #111 0%, #222 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 16px;
        }

        .play-button {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .video-modal.center .play-button {
          width: 80px;
          height: 80px;
          border-color: rgba(255, 255, 255, 0.5);
        }

        .play-button:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.6);
          transform: translate(-50%, -50%) scale(1.1);
        }

        .play-icon {
          width: 0;
          height: 0;
          border-left: 15px solid rgba(255, 255, 255, 0.8);
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
          margin-left: 3px;
        }

        .video-modal.center .play-icon {
          border-left: 20px solid rgba(255, 255, 255, 0.9);
          border-top: 12px solid transparent;
          border-bottom: 12px solid transparent;
        }

        .video-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
          padding: 20px 16px 16px;
          transform: translateY(100%);
          transition: transform 0.3s ease;
        }

        .video-modal:hover .video-info {
          transform: translateY(0);
        }

        .video-title {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 4px;
          color: #ffffff;
        }

        .video-modal.center .video-title {
          font-size: 16px;
        }

        .video-duration {
          font-size: 12px;
          color: #999;
        }

        .progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          background: rgba(255, 255, 255, 0.3);
          width: var(--progress, 0%);
          transition: width 0.3s ease;
        }

        .video-modal.side:nth-child(1) .progress-bar {
          --progress: 45%;
        }

        .video-modal.center .progress-bar {
          --progress: 73%;
          height: 4px;
          background: rgba(255, 255, 255, 0.5);
        }

        .video-modal.side:nth-child(3) .progress-bar {
          --progress: 28%;
        }

        .thumbnail {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
          opacity: 0.3;
        }

        .video-element {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 16px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .video-element.playing {
          opacity: 1;
        }

        .fullscreen-button {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 36px;
          height: 36px;
          background: rgba(0, 0, 0, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          z-index: 15;
        }

        .video-modal.playing .fullscreen-button {
          opacity: 1;
        }

        .fullscreen-button:hover {
          background: rgba(0, 0, 0, 0.9);
          border-color: rgba(255, 255, 255, 0.6);
          transform: scale(1.05);
        }

        .fullscreen-icon {
          width: 16px;
          height: 16px;
          position: relative;
        }

        .fullscreen-icon::before,
        .fullscreen-icon::after {
          content: '';
          position: absolute;
          background: rgba(255, 255, 255, 0.9);
        }

        .fullscreen-icon::before {
          width: 8px;
          height: 8px;
          border-top: 2px solid;
          border-right: 2px solid;
          top: 0;
          right: 0;
        }

        .fullscreen-icon::after {
          width: 8px;
          height: 8px;
          border-bottom: 2px solid;
          border-left: 2px solid;
          bottom: 0;
          left: 0;
        }

        .fullscreen-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .fullscreen-modal.active {
          opacity: 1;
          visibility: visible;
        }

        .fullscreen-video {
          max-width: 90vw;
          max-height: 90vh;
          width: auto;
          height: auto;
          border-radius: 12px;
          background: #000;
        }

        .close-fullscreen {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .close-fullscreen:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.6);
          transform: scale(1.1);
        }

        .close-icon {
          width: 16px;
          height: 16px;
          position: relative;
        }

        .close-icon::before,
        .close-icon::after {
          content: '';
          position: absolute;
          width: 2px;
          height: 16px;
          background: rgba(255, 255, 255, 0.9);
          top: 0;
          left: 7px;
        }

        .close-icon::before {
          transform: rotate(45deg);
        }

        .close-icon::after {
          transform: rotate(-45deg);
        }

        /* Dropdown de lista de videos */
        .video-list-dropdown {
          position: absolute;
          top: -12px;
          right: -12px;
          z-index: 10;
        }

        .dropdown-trigger {
          width: 32px;
          height: 32px;
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid #444;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .dropdown-trigger:hover {
          background: rgba(0, 0, 0, 0.9);
          border-color: #666;
          transform: scale(1.1);
        }

        .dropdown-icon {
          width: 4px;
          height: 4px;
          background: #fff;
          border-radius: 50%;
          position: relative;
        }

        .dropdown-icon::before,
        .dropdown-icon::after {
          content: '';
          position: absolute;
          width: 4px;
          height: 4px;
          background: #fff;
          border-radius: 50%;
        }

        .dropdown-icon::before {
          top: -8px;
        }

        .dropdown-icon::after {
          top: 8px;
        }

        .video-list {
          position: fixed;
          min-width: 220px;
          width: 220px;
          background: rgba(0, 0, 0, 0.95);
          border: 1px solid #444;
          border-radius: 12px;
          backdrop-filter: blur(20px);
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px) scale(0.95);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          max-height: 300px;
          overflow-y: auto;
          z-index: 99999;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
          pointer-events: none;
        }

        .video-list.active {
          opacity: 1 !important;
          visibility: visible !important;
          transform: translateY(0) scale(1) !important;
          pointer-events: auto !important;
          background: rgba(0, 0, 0, 0.98) !important;
          border: 1px solid #666 !important;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9) !important;
        }

        .video-list-item {
          padding: 12px 16px;
          border-bottom: 1px solid #222;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          gap: 4px;
          position: relative;
          z-index: 1;
        }

        .video-list-item:last-child {
          border-bottom: none;
        }

        .video-list-item:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          transform: translateX(2px);
        }

        .video-list-item.active {
          background: rgba(255, 255, 255, 0.15) !important;
          border-left: 3px solid #fff;
        }

        .video-list-title {
          font-size: 13px;
          font-weight: 500;
          color: #fff;
          margin-bottom: 2px;
        }

        .video-list-duration {
          font-size: 11px;
          color: #888;
        }

        /* Scrollbar personalizada con más brillo */
        .video-list::-webkit-scrollbar {
          width: 8px;
        }

        .video-list::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          margin: 4px 0;
        }

        .video-list::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.4) 100%);
          border-radius: 4px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(255, 255, 255, 0.2);
        }

        .video-list::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%);
          transform: scaleX(1.2);
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
        }

        .video-list::-webkit-scrollbar-thumb:active {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
          box-shadow: 0 6px 16px rgba(255, 255, 255, 0.4);
        }

        /* Animación del scroll */
        .video-list {
          scroll-behavior: smooth;
        }

        .video-list:hover::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.5) 100%);
        }

        @media (max-width: 768px) {
          .video-container {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }
          
          .video-modal.side {
            width: 300px;
            height: 180px;
          }
          
          .video-modal.center {
            width: 350px;
            height: 220px;
          }

          .video-list {
            min-width: 200px;
            width: 200px;
            max-width: 240px;
          }

          .video-list-item {
            padding: 10px 12px;
          }

          .video-list-title {
            font-size: 12px;
          }

          .video-list-duration {
            font-size: 10px;
          }

          .fullscreen-button {
            width: 32px;
            height: 32px;
          }

          .fullscreen-icon {
            width: 14px;
            height: 14px;
          }
        }

        @media (max-width: 480px) {
          .video-container {
            padding: 0.5rem;
          }

          .video-modal.side {
            width: 280px;
            height: 160px;
          }
          
          .video-modal.center {
            width: 320px;
            height: 200px;
          }

          .dropdown-trigger {
            width: 28px;
            height: 28px;
          }

          .video-list-item {
            padding: 8px 10px;
          }

          .fullscreen-button {
            width: 28px;
            height: 28px;
          }

          .fullscreen-icon {
            width: 12px;
            height: 12px;
          }

          .fullscreen-video {
            max-width: 95vw;
            max-height: 85vh;
          }

          .close-fullscreen {
            top: 15px;
            right: 15px;
            width: 36px;
            height: 36px;
          }
        }

        @keyframes fadeOut {
          to {
            opacity: 0;
            transform: scale(0);
          }
        }

        @keyframes noteFloat {
          0% {
            opacity: 1;
            transform: scale(0) rotate(0deg);
          }
          30% {
            opacity: 0.8;
            transform: scale(var(--final-scale, 1)) rotate(90deg) translateY(-5px);
          }
          70% {
            opacity: 0.6;
            transform: scale(var(--final-scale, 1.2)) rotate(180deg) translateY(-15px);
          }
          100% {
            opacity: 0;
            transform: scale(0) rotate(270deg) translateY(-25px);
          }
        }

        @keyframes waveFloat {
          0% {
            opacity: 1;
            transform: scale(1) rotate(var(--rotation, 0deg));
          }
          50% {
            opacity: 0.6;
            transform: scale(1.5) rotate(var(--rotation, 0deg)) translateX(15px);
          }
          100% {
            opacity: 0;
            transform: scale(0.3) rotate(var(--rotation, 0deg)) translateX(30px);
          }
        }
      `}</style>
      
      <div className="video-modals-html-body" suppressHydrationWarning ref={containerRef}>
        <div className="video-container">
          {/* Modal Izquierdo */}
          <div className="video-modal side" data-modal="1">
            <div className="video-list-dropdown">
              <div className="dropdown-trigger" onClick={(e) => { e.stopPropagation(); toggleDropdown(1); }}>
                <div className="dropdown-icon"></div>
              </div>
              <div className="video-list" id="videoList1">
                <div className="video-list-item active" onClick={() => (window as any).selectVideo(1, 0)}>
                  <div className="video-list-title">Tutorial Básico</div>
                  <div className="video-list-duration">5:42</div>
                </div>
                <div className="video-list-item" onClick={() => (window as any).selectVideo(1, 1)}>
                  <div className="video-list-title">Conceptos Avanzados</div>
                  <div className="video-list-duration">8:15</div>
                </div>
                <div className="video-list-item" onClick={() => (window as any).selectVideo(1, 2)}>
                  <div className="video-list-title">Práctica Guiada</div>
                  <div className="video-list-duration">12:33</div>
                </div>
                <div className="video-list-item" onClick={() => (window as any).selectVideo(1, 3)}>
                  <div className="video-list-title">Casos de Uso</div>
                  <div className="video-list-duration">6:28</div>
                </div>
              </div>
            </div>
            <div className="video-content" onClick={() => (window as any).playVideo(1)}>
              <div className="thumbnail"></div>
              <video 
                className="video-element" 
                muted 
                preload="metadata"
                onEnded={() => (window as any).pauseVideo(1)}
                suppressHydrationWarning
              >
                <source src="/Video/VideoModal" type="video/mp4" />
              </video>
              <div className="play-button">
                <div className="play-icon"></div>
              </div>
              <div className="fullscreen-button" onClick={(e) => { e.stopPropagation(); (window as any).openFullscreen(1); }}>
                <div className="fullscreen-icon"></div>
              </div>
              <div className="video-info">
                <div className="video-title">Tutorial Básico</div>
                <div className="video-duration">5:42</div>
              </div>
              <div className="progress-bar"></div>
            </div>
          </div>

          {/* Modal Central (Principal) */}
          <div className="video-modal center" data-modal="2">
            <div className="video-list-dropdown">
              <div className="dropdown-trigger" onClick={(e) => { e.stopPropagation(); toggleDropdown(2); }}>
                <div className="dropdown-icon"></div>
              </div>
              <div className="video-list" id="videoList2">
                <div className="video-list-item active" onClick={() => (window as any).selectVideo(2, 0)}>
                  <div className="video-list-title">Presentación Principal</div>
                  <div className="video-list-duration">12:35</div>
                </div>
                <div className="video-list-item" onClick={() => (window as any).selectVideo(2, 1)}>
                  <div className="video-list-title">Demo Interactiva</div>
                  <div className="video-list-duration">15:22</div>
                </div>
                <div className="video-list-item" onClick={() => (window as any).selectVideo(2, 2)}>
                  <div className="video-list-title">Masterclass Completa</div>
                  <div className="video-list-duration">28:47</div>
                </div>
                <div className="video-list-item" onClick={() => (window as any).selectVideo(2, 3)}>
                  <div className="video-list-title">Sesión Q&A</div>
                  <div className="video-list-duration">18:15</div>
                </div>
                <div className="video-list-item" onClick={() => (window as any).selectVideo(2, 4)}>
                  <div className="video-list-title">Casos Avanzados</div>
                  <div className="video-list-duration">22:08</div>
                </div>
              </div>
            </div>
            <div className="video-content" onClick={() => (window as any).playVideo(2)}>
              <div className="thumbnail"></div>
              <video 
                className="video-element" 
                muted 
                preload="metadata"
                onEnded={() => (window as any).pauseVideo(2)}
                suppressHydrationWarning
              >
                <source src="/Video/VideoModalCenter.mp4" type="video/mp4" />
              </video>
              <div className="play-button">
                <div className="play-icon"></div>
              </div>
              <div className="fullscreen-button" onClick={(e) => { e.stopPropagation(); (window as any).openFullscreen(2); }}>
                <div className="fullscreen-icon"></div>
              </div>
              <div className="video-info">
                <div className="video-title">Presentación Principal</div>
                <div className="video-duration">12:35</div>
              </div>
              <div className="progress-bar"></div>
            </div>
          </div>

          {/* Modal Derecho */}
          <div className="video-modal side" data-modal="3">
            <div className="video-list-dropdown">
              <div className="dropdown-trigger" onClick={(e) => { e.stopPropagation(); toggleDropdown(3); }}>
                <div className="dropdown-icon"></div>
              </div>
              <div className="video-list" id="videoList3">
                <div className="video-list-item active" onClick={() => (window as any).selectVideo(3, 0)}>
                  <div className="video-list-title">Tips y Trucos</div>
                  <div className="video-list-duration">8:21</div>
                </div>
                <div className="video-list-item" onClick={() => (window as any).selectVideo(3, 1)}>
                  <div className="video-list-title">Errores Comunes</div>
                  <div className="video-list-duration">6:45</div>
                </div>
                <div className="video-list-item" onClick={() => (window as any).selectVideo(3, 2)}>
                  <div className="video-list-title">Optimización</div>
                  <div className="video-list-duration">11:12</div>
                </div>
                <div className="video-list-item" onClick={() => (window as any).selectVideo(3, 3)}>
                  <div className="video-list-title">Recursos Extra</div>
                  <div className="video-list-duration">4:33</div>
                </div>
              </div>
            </div>
            <div className="video-content" onClick={() => (window as any).playVideo(3)}>
              <div className="thumbnail"></div>
              <video 
                className="video-element" 
                muted 
                preload="metadata"
                onEnded={() => (window as any).pauseVideo(3)}
                suppressHydrationWarning
              >
                <source src="/Video/VideoModalRight.mp4" type="video/mp4" />
              </video>
              <div className="play-button">
                <div className="play-icon"></div>
              </div>
              <div className="fullscreen-button" onClick={(e) => { e.stopPropagation(); (window as any).openFullscreen(3); }}>
                <div className="fullscreen-icon"></div>
              </div>
              <div className="video-info">
                <div className="video-title">Tips y Trucos</div>
                <div className="video-duration">8:21</div>
              </div>
              <div className="progress-bar"></div>
            </div>
          </div>
        </div>

        {/* Modal de pantalla completa */}
        <div className="fullscreen-modal" id="fullscreenModal" onClick={() => (window as any).closeFullscreen()}>
          <div className="close-fullscreen" onClick={() => (window as any).closeFullscreen()}>
            <div className="close-icon"></div>
          </div>
          <video 
            className="fullscreen-video" 
            id="fullscreenVideo" 
            controls
            preload="metadata"
            onClick={(e) => e.stopPropagation()}
            onEnded={() => (window as any).closeFullscreen()}
            suppressHydrationWarning
          >
            <source id="fullscreenVideoSource" type="video/mp4" />
          </video>
        </div>
      </div>
    </>
  );
};

export default VideoModalsInterfaceHTML;
