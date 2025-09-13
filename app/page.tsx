"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Play, Instagram, Youtube, Mail, Phone, MapPin, Menu, X, Sun, Moon } from "lucide-react"
import { Raleway } from "next/font/google"

// Brand font must be initialized at module scope (Next.js font loader rule)
const brand = Raleway({ subsets: ["latin"], weight: ["400", "600"] })
import { useAudioPlayer } from "@/hooks/useAudioPlayer"
import VideoModalsInterfaceHTML from "@/components/video/VideoModalsInterfaceHTML_new"

// Counter hook for animated numbers
function useCounter(end: number, start = 0, duration = 2000) {
  const [count, setCount] = useState(start)
  const [isVisible, setIsVisible] = useState(false)
  const countRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 },
    )

    if (countRef.current) {
      observer.observe(countRef.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(easeOutQuart * (end - start) + start)

      setCount(currentCount)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [isVisible, end, start, duration])

  return { count, countRef }
}

export default function MusicianWebsite() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [visibleSections, setVisibleSections] = useState<string[]>([])
  const [isMounted, setIsMounted] = useState(false)

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const streamsCounter = useCounter(50, 0, 2500)
  const songsCounter = useCounter(25, 0, 2000)

  const audioPlayer = useAudioPlayer()

  // Agregar estado para controlar videos activos
  const [activeVideo, setActiveVideo] = useState<{playlistId: number, songId: number} | null>(null)

  const [fullscreenVideo, setFullscreenVideo] = useState<string | null>(null)

  const handleFullscreen = (playlistId: number) => {
    const video = document.querySelector(`video[data-playlist="${playlistId}"]`) as HTMLVideoElement
    if (video) {
      if (video.requestFullscreen) {
        video.requestFullscreen()
        setFullscreenVideo(String(playlistId))
      }
    }
  }

  // Adaptar para el nuevo estado de activeVideo (playlistId y songId)
  const handleVideoClick = (playlistId: number, songId: number, videoElement: HTMLVideoElement) => {
    console.log("[v0] Video clicked:", playlistId, songId, "Current active:", activeVideo)

    if (activeVideo && activeVideo.playlistId === playlistId && activeVideo.songId === songId) {
      // Si el video ya está activo, pausarlo
      videoElement.pause()
      setActiveVideo(null)
      console.log("[v0] Video paused")
    } else {
      // Pausar cualquier otro video activo
      const allVideos = document.querySelectorAll("video[data-playlist]")
      ;(allVideos as any).forEach((video: any) => {
        if (video !== videoElement) {
          video.pause()
          video.currentTime = 0
        }
      })

      // Activar el nuevo video
      videoElement.currentTime = 0
      videoElement
        .play()
        .then(() => {
          setActiveVideo({ playlistId, songId })
          console.log("[v0] Video started playing")
        })
        .catch((error) => {
          console.log("[v0] Error playing video:", error)
        })
    }
  }

  // Updated playlists with the real video
  const playlists = [
    //Contenido de modal de la izquierda
    {
      id: 1,
      title: "Film & Game Music",
      description: "Cinematic compositions and game soundtracks",
      videoUrl: "Video/VideoModal",
      songs: [
        {
          id: 1,
          title: "The Oracle's Curse - Main Menu Theme",
          duration: "3:23",
          genre: "Game Music",
          url: "Music/Music1ML.mp3",
        },
        {
          id: 2,
          title: "Electric Soul",
          duration: "4:12",
          genre: "Electronic",
          url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
        },
        {
          id: 3,
          title: "Urban Nights",
          duration: "3:28",
          genre: "Hip-Hop",
          url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
        },
        {
          id: 4,
          title: "Neon Lights",
          duration: "3:52",
          genre: "Synthwave",
          url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
        },
        {
          id: 5,
          title: "Digital Heart",
          duration: "4:05",
          genre: "Electronic",
          url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
        },
      ],
    },
    //Contenido de modal del centro
    {
      id: 2,
      title: "Jazz & Arrangements",
      description: "Sophisticated jazz interpretations and arrangements",
      videoUrl: "Video/VideoModalCenter.mp4",
      songs: [
        {
          id: 6,
          title: "Acoustic Heart",
          duration: "4:01",
          genre: "Acoustic",
          url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
        },
        {
          id: 7,
          title: "Whispered Words",
          duration: "3:33",
          genre: "Folk",
          url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
        },
        {
          id: 8,
          title: "Morning Coffee",
          duration: "2:58",
          genre: "Indie",
          url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
        },
        {
          id: 9,
          title: "Sunset Drive",
          duration: "4:22",
          genre: "Acoustic",
          url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
        },
        {
          id: 10,
          title: "Quiet Moments",
          duration: "3:15",
          genre: "Ambient",
          url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
        },
      ],
    },
    //Contenido de modal del la izquierda
    {
      id: 3,
      title: "Original Compositions",
      description: "Creative collaborations and original works",
      videoUrl: "Video/VideoModalRight.mp4",
      songs: [
        {
          id: 11,
          title: "The Oracle's Curse - Main Menu Theme",
          duration: "4:32",
          genre: "Game Music",
          url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/The%20Oracle%27s%20Curse%20-%20Main%20Menu%20Theme-SpPobAUYaeMCidMzsD1LlZ58mk3dlt.mp3",
        },
        {
          id: 12,
          title: "Little Women - Orchestral, Peaceful",
          duration: "3:45",
          genre: "Orchestral",
          url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Little%20Women%20-%20Orchestral%2C%20Peaceful-42nZUK3YlVdSpGD6F85liwhI3vPSxa.mp3",
        },
        {
          id: 13,
          title: "1917 Story - Orchestral, Drama",
          duration: "4:18",
          genre: "Orchestral",
          url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1917%20Story%20-%20Orchestral%2C%20Drama-4nhnZVA0oMwpZfwJonyLOnM8xBEZvv.mp3",
        },
        {
          id: 14,
          title: "Cross Paths",
          duration: "4:03",
          genre: "Hip-Hop",
          url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
        },
        {
          id: 15,
          title: "Unity",
          duration: "3:56",
          genre: "World",
          url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
        },
      ],
    },
  ]

  // Contact form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear errors when user starts typing
    if (error) setError(null)
    if (isSuccess) setIsSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!contactForm.name.trim()) {
      setError("Por favor ingresa tu nombre")
      return
    }

    if (!contactForm.email.trim()) {
      setError("Por favor ingresa tu email")
      return
    }

    if (!contactForm.message.trim()) {
      setError("Por favor escribe tu mensaje")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(contactForm.email)) {
      setError("Por favor ingresa un email válido")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log("[v0] Enviando formulario de contacto:", contactForm)

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      })

      console.log("[v0] Respuesta del servidor:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      })

      const contentType = response.headers.get("content-type")
      let data

      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
        console.log("[v0] Datos JSON recibidos:", data)
      } else {
        // If not JSON, get text content for error message
        const textContent = await response.text()
        console.log("[v0] Respuesta no-JSON recibida:", textContent)

        if (response.status === 404) {
          throw new Error("Servicio de contacto no disponible. Por favor intenta más tarde.")
        } else if (response.status >= 500) {
          throw new Error("Error interno del servidor. Por favor intenta más tarde.")
        } else {
          throw new Error(`Error del servidor (${response.status}): ${response.statusText}`)
        }
      }

      if (!response.ok) {
        const errorMessage = data?.error || data?.message || `Error ${response.status}: ${response.statusText}`
        throw new Error(errorMessage)
      }

      console.log("[v0] Mensaje enviado exitosamente")
      setIsSuccess(true)
      setContactForm({ name: "", email: "", message: "" })
    } catch (err) {
      console.log("[v0] Error en envío:", err)

      if (err instanceof TypeError && err.message.includes("fetch")) {
        setError("Error de conexión. Verifica tu internet e intenta nuevamente.")
      } else if (err instanceof SyntaxError) {
        setError("Error de comunicación con el servidor. Por favor intenta más tarde.")
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Error desconocido al enviar el mensaje. Por favor intenta más tarde.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "music", "about", "contact"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Intersection Observer para animaciones
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id
            setVisibleSections((prev) => [...prev, sectionId])
          }
        })
      },
      { threshold: 0.1 },
    )

    const sections = document.querySelectorAll("section[id]")
    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  // Set mounted state to prevent hydration flash
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  const togglePlay = (playlistId: number, songId: number) => {
    const playlist = playlists.find((p) => p.id === playlistId)
    const song = playlist?.songs.find((s) => s.id === songId)

    if (song) {
      // Si es la misma canción que está reproduciéndose, pausar/reanudar
      if (audioPlayer.currentSong?.id === song.id) {
        if (audioPlayer.isPlaying) {
          audioPlayer.pause()
        } else {
          audioPlayer.play({
            id: song.id,
            title: song.title,
            url: song.url,
            playlistId: playlistId,
          })
        }
      } else {
        // Si es una canción diferente, reproducir la nueva
        audioPlayer.play({
          id: song.id,
          title: song.title,
          url: song.url,
          playlistId: playlistId,
        })
      }
    }
  }

  // Nuevo: pausa explícita del preview cuando se necesite forzar parada
  const pausePreview = () => {
    if (audioPlayer.isPlaying) {
      audioPlayer.pause()
    }
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const themeClasses = isDarkMode ? "bg-black text-white" : "bg-white text-gray-900"

  return (
    <div className={`min-h-screen transition-colors duration-500 ${themeClasses}`}>
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 backdrop-blur-md border-b transition-all duration-500 ${
          isDarkMode ? "bg-black/90 border-neutral-800" : "bg-white/90 border-gray-200"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => scrollToSection("home")}
              className="group flex items-center min-w-0 text-left focus:outline-none"
              aria-label="Go to Home"
            >
              <span
                aria-label="Mauricio Felix"
                className={`${brand.className} text-[1.05rem] sm:text-xl font-semibold tracking-wide truncate ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <span className="inline-flex items-baseline">
                  <span className="mr-[1px]">Maur</span>
                  <span className="relative inline-block align-baseline mx-[1px]">
                    {/* Dotless i with elegant note dot */}
                    ı
                    <span
                      aria-hidden
                      className={`absolute -top-1 left-1/2 -translate-x-1/2 text-[10px] sm:text-[11px] leading-none transition-transform duration-200 ${
                        isDarkMode ? "text-amber-400" : "text-yellow-600"
                      } group-hover:-translate-y-[1px]`}
                    >
                      ♩
                    </span>
                  </span>
                  <span className="mr-2">cio</span>
                  <span className="opacity-90">Felix</span>
                </span>
              </span>
            </button>

            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full transition-colors duration-200 ${
                  isDarkMode
                    ? "bg-neutral-900 text-yellow-400 hover:bg-neutral-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              {/* Desktop Menu */}
              <div className="hidden md:flex space-x-6 lg:space-x-8">
                {["home", "music", "about", "contact"].map((section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={`text-sm font-light tracking-wider uppercase transition-all duration-300 hover:tracking-widest ${
                      activeSection === section
                        ? isDarkMode
                          ? "text-white border-b border-white"
                          : "text-gray-900 border-b border-gray-900"
                        : isDarkMode
                          ? "text-neutral-400 hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <button
                className={`md:hidden p-2 transition-colors duration-200 ${isDarkMode ? "text-white hover:bg-neutral-800" : "text-gray-900 hover:bg-gray-100"} rounded-lg`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu - Better positioned */}
          <div
            className={`md:hidden absolute left-0 right-0 top-full transition-all duration-300 ${
              isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
            } ${isDarkMode ? "bg-black/95 border-neutral-800" : "bg-white/95 border-gray-200"} border-t backdrop-blur-md`}
          >
            <div className="container mx-auto px-4 py-4">
              <div className="space-y-1">
                {["home", "music", "about", "contact"].map((section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={`block w-full text-left py-4 px-4 text-base font-medium transition-all duration-200 rounded-lg ${
                      activeSection === section
                        ? isDarkMode
                          ? "text-white bg-neutral-800 border-l-4 border-white"
                          : "text-gray-900 bg-gray-100 border-l-4 border-gray-900"
                        : isDarkMode
                          ? "text-neutral-400 hover:text-white hover:bg-neutral-900"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
      {/* Home Section */}
      <section
        id="home"
        className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-500 ${
          isDarkMode ? "bg-neutral-900" : "bg-gray-50"
        }`}
      >
        {/* Video Background - Using the real video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-50"
            style={{ filter: isDarkMode ? "brightness(0.7) contrast(1.1)" : "brightness(0.9) contrast(1.05)" }}
          >
            <source
              src="Video/VideoBackground.mp4"
              type="video/mp4"
            />
            {/* Fallback image if video doesn't load */}
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-white/20 text-4xl sm:text-6xl">🎵</div>
            </div>
          </video>
          {/* Video Overlay */}
          <div
            className={`absolute inset-0 transition-colors duration-500 ${isDarkMode ? "bg-black/60" : "bg-white/35"}`}
          />
        </div>

        <div
          className={`container mx-auto px-4 sm:px-6 text-center relative z-10 transition-all duration-1000 ${
            visibleSections.includes("home") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="max-w-3xl mx-auto">
            <h1
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-4 sm:mb-6 tracking-wider transition-colors duration-500 ${
                isDarkMode ? "text-white" : "text-gray-900"
              } font-serif drop-shadow-lg`}
            >
              Mauricio Felix
            </h1>
            <p
              className={`text-base sm:text-lg md:text-xl mb-8 sm:mb-12 font-light tracking-wide transition-colors duration-500 ${
                isDarkMode ? "text-neutral-200" : "text-gray-700"
              } uppercase text-xs sm:text-sm drop-shadow-md`}
            >
              Musician · Composer · Arranger
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
              <Button
                size="lg"
                className={`px-6 sm:px-8 py-3 text-sm sm:text-base transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                  isDarkMode
                    ? "bg-white text-black hover:bg-gray-100 hover:shadow-white/20"
                    : "bg-gray-900 hover:bg-gray-800 text-white hover:shadow-gray-900/30"
                }`}
                onClick={() => scrollToSection("music")}
              >
                <Play className="mr-2 h-4 w-4" />
                Listen
              </Button>
              <Button
                size="lg"
                className={`px-6 sm:px-8 py-3 text-sm sm:text-base transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                  isDarkMode
                    ? "bg-white text-black hover:bg-gray-100 hover:shadow-white/20"
                    : "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-gray-900/30"
                }`}
                onClick={() => scrollToSection("contact")}
              >
                Contact
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Videos Section */}
      <section
        id="music"
        className={`min-h-screen flex items-center transition-colors duration-500 ${
          isDarkMode ? "bg-black" : "bg-white"
        } pt-12 sm:pt-14 md:pt-16 pb-0`}
      >
  <div className="container mx-auto px-4 sm:px-6 -translate-y-6 sm:-translate-y-10 md:-translate-y-12">
          <div className="max-w-6xl mx-auto">
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-light text-center mb-12 sm:mb-16 md:mb-20 tracking-wider transition-all duration-1000 ${
                isDarkMode ? "text-white" : "text-gray-900"
              } font-serif ${
                visibleSections.includes("music") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              Videos
            </h2>

            {/* Premium Video Modals */}
            <div className={`transition-all duration-1000 delay-200 ${
              visibleSections.includes("music") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}>
              {isMounted && <VideoModalsInterfaceHTML />}
            </div>
          </div>
        </div>
      </section>
      {/* About Section */}
      <section
        id="about"
        className={`py-16 sm:py-20 md:py-24 relative overflow-hidden transition-colors duration-500 ${isDarkMode ? "bg-black" : "bg-white"}`}
      >
        {/* Background photo with soft top/bottom fade */}
        <div
          className={`about-photo-bg ${isDarkMode ? 'dark' : 'light'}`}
          aria-hidden="true"
        />
        {/* Fallback gradient overlay in case mask isn't supported */}
        <div className="about-photo-fade" aria-hidden="true" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2
              className={`text-3xl sm:text-4xl font-light text-center mb-12 sm:mb-16 md:mb-20 tracking-wider transition-all duration-1000 ${
                isDarkMode ? "text-white" : "text-gray-900"
              } font-serif ${
                visibleSections.includes("about") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              My Story
            </h2>

            <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
              {/* Musical Book (left) */}
              <div
                className={`relative transition-all duration-1000 delay-300 ${
                  visibleSections.includes("about") ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                }`}
              >
                <div
                  className={`aspect-square rounded-sm overflow-hidden relative transition-colors duration-500 ${
                    isDarkMode ? "bg-neutral-900" : "bg-gray-100"
                  } group cursor-pointer max-w-sm mx-auto md:max-w-none`}
                >
                  {/* Book Cover */}
                  <div
                    className={`absolute inset-4 rounded-sm transition-all duration-500 group-hover:rotate-y-12 ${
                      isDarkMode ? "bg-neutral-800 border border-neutral-700" : "bg-gray-200 border border-gray-300"
                    }`}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Book Title */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6">
                      <div
                        className={`text-lg sm:text-xl md:text-2xl font-serif mb-2 sm:mb-4 transition-colors duration-500 text-center ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Musical Journey
                      </div>
                      <div
                        className={`text-xs sm:text-sm uppercase tracking-wider transition-colors duration-500 text-center ${
                          isDarkMode ? "text-neutral-400" : "text-gray-600"
                        }`}
                      >
                        Mauricio Sound
                      </div>

                      {/* Musical Notes Decoration */}
                      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 opacity-30">
                        <svg width="16" height="16" className="sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                        </svg>
                      </div>

                      {/* Page Lines */}
                      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-3 sm:left-4 md:left-6 right-3 sm:right-4 md:right-6 space-y-1 md:space-y-2">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-px transition-colors duration-500 ${
                              isDarkMode ? "bg-gray-600" : "bg-gray-400"
                            }`}
                            style={{ width: `${100 - i * 10}%` }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Book Pages Effect */}
                    <div
                      className={`absolute inset-0 rounded-sm transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 ${
                        isDarkMode ? "bg-gray-700 border border-gray-600" : "bg-gray-300 border border-gray-400"
                      }`}
                      style={{ zIndex: -1 }}
                    />
                    <div
                      className={`absolute inset-0 rounded-sm transition-all duration-300 group-hover:translate-x-2 group-hover:-translate-y-2 ${
                        isDarkMode ? "bg-gray-600 border border-gray-500" : "bg-gray-400 border border-gray-500"
                      }`}
                      style={{ zIndex: -2 }}
                    />
                  </div>

                  {/* Floating Pages */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`absolute w-4 sm:w-6 md:w-8 h-6 sm:h-8 md:h-10 rounded-sm opacity-0 group-hover:opacity-60 transition-all duration-700 ${
                          isDarkMode ? "bg-white" : "bg-gray-100"
                        }`}
                        style={{
                          top: `${20 + i * 15}%`,
                          right: `${10 + i * 5}%`,
                          transform: `rotate(${5 + i * 3}deg)`,
                          transitionDelay: `${i * 200}ms`,
                          animation: `float ${3 + i}s ease-in-out infinite`,
                        }}
                      >
                        {/* Mini musical notes on floating pages */}
                        <div className="absolute inset-1 space-y-1">
                          {[...Array(3)].map((_, j) => (
                            <div key={j} className={`h-px ${isDarkMode ? "bg-gray-400" : "bg-gray-600"}`} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Narrative text (right) */}
              <div
                className={`transition-all duration-1000 delay-500 ${
                  visibleSections.includes("about") ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                }`}
              >
                <div
                  className={`w-full max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-serif ${
                    isDarkMode ? "text-neutral-300" : "text-gray-700"
                  } story-follow-highlight ${isDarkMode ? "dark" : "light"}`}
                  lang="es"
                  onMouseMove={(e) => {
                    const t = e.currentTarget as HTMLDivElement
                    const rect = t.getBoundingClientRect()
                    t.style.setProperty("--y", `${e.clientY - rect.top}px`)
                  }}
                  onMouseLeave={(e) => {
                    const t = e.currentTarget as HTMLDivElement
                    t.style.setProperty("--y", `-9999px`)
                  }}
                >
                  <p className="mb-4">
                    Mauricio Felix is a film composer, arranger, and bass player from Lima, Peru, currently residing in Boston, Massachusetts.
                  </p>
                  <p className="mb-4">
                    Performing in various styles, including Afro-Peruvian, Latin, folkloric, jazz, and orchestral music, his goal is to blend his background with these styles to bring a unique sound.
                  </p>
                  <p className="mb-4">
                    He started learning the electric bass at the age of 11. Throughout his development as a musician, he became the student of some of the biggest bass players in Lima, Luis Linares, Felipe Pumarada, and Ricardo Otárola. Keen to become a successful musician, he started his studies at Berklee College of Music in Boston. At that institution, he took classes in arranging, composition for film with professors Lenny Williams, Claudio Ragazzi, Tim Huling, among others; as well as improving his bass skills with lessons from Oscar Stagnaro, Lincoln Goines, and Anthony Vitti.
                  </p>
                  <p>
                    Some accomplishments he has been part of are opening for Tony Succar in Lake Eola Park in Orlando, participating in Latin Music festivals in Boston, and touring in Peru and Boston with saxophonist Diego Herrera. He has also arranged for musical theater performances with Berklee’s Broadway Band, as well as taking part in multiple recordings of singles, albums, and EPs as a bass player and arranger. He is an alumnus of Berklee College of Music, recently graduated in Spring 2025, with a Bachelor’s Degree in Contemporary Writing and Production, and Film and Media Scoring.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className={`py-16 sm:py-20 md:py-24 relative overflow-hidden transition-colors duration-500 ${isDarkMode ? "bg-black" : "bg-white"}`}
      >
        <style jsx>{`
          .about-photo-bg {
            position: absolute;
            inset: 0;
            z-index: 0;
            /* tweak position to favor subject slightly right */
            background: 55% center / cover no-repeat;
            /* Reliable fallback: if the first fails, the second shows */
            background-image: url('/about-bg.jpg'), url('/placeholder.jpg');
            pointer-events: none;
            /* Fade out at top/bottom for smooth transition */
            -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(255,255,255,1) 18%, rgba(255,255,255,1) 82%, transparent 100%);
            mask-image: linear-gradient(to bottom, transparent 0%, rgba(255,255,255,1) 18%, rgba(255,255,255,1) 82%, transparent 100%);
          }
          .about-photo-fade {
            position: absolute;
            inset: 0;
            z-index: 1;
            pointer-events: none;
            :global(button),
            :global([type="button"]),
            :global([type="submit"]),
            :global([type="reset"]),
            :global([role="button"]),
            :global(a[role="button"]),
            :global(.cursor-pointer) {
              cursor: pointer;
            }

            opacity: 0.28;
            filter: brightness(1.05) contrast(1.03) saturate(0.95);
          }
          .story-follow-highlight {
            position: relative;
            border-radius: 8px;
            /* remove inner padding so text aligns neatly to edges */
            padding: 0;
            line-height: 1.85;
            text-align: justify;
            text-justify: inter-word;
            text-align-last: justify;
            -moz-text-align-last: justify;
            hyphens: auto;
            -webkit-hyphens: auto;
            -ms-hyphens: auto;
            overflow-wrap: break-word;
            word-break: normal;
            /* invisible by default; we draw a moving stripe via gradient */
            background:
              linear-gradient(
                to bottom,
                transparent calc(var(--y, -200px) - 0.9em),
                var(--hl, rgba(255,255,255,0.08)) calc(var(--y, -200px) - 0.9em),
                var(--hl, rgba(255,255,255,0.12)) calc(var(--y, -200px) + 0.2em),
                transparent calc(var(--y, -200px) + 0.2em)
              );
            background-attachment: local;
            transition: background 80ms ease-out, color 200ms ease;
          }
          .story-follow-highlight.dark { --hl: rgba(255,255,255,0.08); }
          .story-follow-highlight.light { --hl: rgba(0,0,0,0.06); }
          .story-follow-highlight p {
            margin-bottom: 1rem;
            text-align: justify;
            text-justify: inter-word;
            hyphens: auto;
            -webkit-hyphens: auto;
            -ms-hyphens: auto;
          }
          .story-follow-highlight p:last-child { margin-bottom: 0; }
        `}</style>
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating musical notes only */}
          <div className="absolute top-20 right-1/4 text-xl sm:text-2xl opacity-10 animate-float">🎵</div>
          <div
            className="absolute bottom-32 left-1/3 text-lg sm:text-xl opacity-10 animate-float"
            style={{ animationDelay: "1s" }}
          >
            🎶
          </div>
          <div
            className="absolute top-1/3 right-1/3 text-base sm:text-lg opacity-10 animate-float"
            style={{ animationDelay: "2s" }}
          >
            ♪
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-light text-center mb-6 sm:mb-8 tracking-wider transition-all duration-1000 ${
                isDarkMode ? "text-white" : "text-gray-900"
              } font-serif ${
                visibleSections.includes("contact") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              Let's Create Together
            </h2>

            <p
              className={`text-center text-base sm:text-lg mb-12 sm:mb-16 max-w-2xl mx-auto transition-colors duration-500 px-4 ${
                isDarkMode ? "text-neutral-300" : "text-gray-600"
              }`}
            >
              Ready to bring your musical vision to life? Let's start a conversation.
            </p>

            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-start">
              {/* Contact Form - Modern Glass Card */}
              <div
                className={`transition-all duration-1000 delay-300 ${
                  visibleSections.includes("contact") ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                }`}
              >
                <div
                  className={`relative p-6 sm:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-sm border transition-all duration-500 hover:shadow-2xl ${
                    isDarkMode
                      ? "bg-neutral-900/80 border-neutral-700/50 hover:bg-neutral-900/90"
                      : "bg-white/80 border-gray-200/50 hover:bg-white/90 hover:shadow-gray-200/50"
                  }`}
                >
                  {/* Decorative gradient overlay */}
                  <div
                    className={`absolute inset-0 rounded-2xl sm:rounded-3xl opacity-5 ${
                      isDarkMode
                        ? "bg-gradient-to-br from-white via-transparent to-white"
                        : "bg-gradient-to-br from-gray-900 via-transparent to-gray-900"
                    }`}
                  />

                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 relative z-10">
                    <div className="space-y-3 sm:space-y-4">
                      <Input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={contactForm.name}
                        onChange={handleInputChange}
                        className={`w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl border-0 transition-all duration-300 focus:ring-2 focus:ring-offset-0 text-sm sm:text-base ${
                          isDarkMode
                            ? "bg-neutral-800/70 text-white placeholder:text-neutral-400 focus:bg-neutral-800 focus:ring-white/20"
                            : "bg-gray-100/70 text-gray-900 placeholder:text-gray-500 focus:bg-gray-100 focus:ring-gray-900/20"
                        }`}
                        required
                      />

                      <Input
                        type="email"
                        name="email"
                        placeholder="your.email@example.com"
                        value={contactForm.email}
                        onChange={handleInputChange}
                        className={`w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl border-0 transition-all duration-300 focus:ring-2 focus:ring-offset-0 text-sm sm:text-base ${
                          isDarkMode
                            ? "bg-neutral-800/70 text-white placeholder:text-neutral-400 focus:bg-neutral-800 focus:ring-white/20"
                            : "bg-gray-100/70 text-gray-900 placeholder:text-gray-500 focus:bg-gray-100 focus:ring-gray-900/20"
                        }`}
                        required
                      />

                      <Textarea
                        name="message"
                        placeholder="Tell me about your project, ideas, or just say hello..."
                        value={contactForm.message}
                        onChange={handleInputChange}
                        rows={5}
                        className={`w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl border-0 resize-none transition-all duration-300 focus:ring-2 focus:ring-offset-0 text-sm sm:text-base ${
                          isDarkMode
                            ? "bg-neutral-800/70 text-white placeholder:text-neutral-400 focus:bg-neutral-800 focus:ring-white/20"
                            : "bg-gray-100/70 text-gray-900 placeholder:text-gray-500 focus:bg-gray-100 focus:ring-gray-900/20"
                        }`}
                        required
                      />
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="text-red-400 text-xs sm:text-sm text-center bg-red-500/10 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-red-500/20">
                        {error}
                      </div>
                    )}

                    {/* Success Message */}
                    {isSuccess && (
                      <div className="text-green-400 text-xs sm:text-sm text-center bg-green-500/10 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-green-500/20">
                        ¡Mensaje enviado correctamente! Te contactaré pronto.
                      </div>
                    )}

                    <div className="flex justify-center pt-2 sm:pt-4">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className={`px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base ${
                          isDarkMode
                            ? "bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-white hover:shadow-white/20"
                            : "bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-gray-800 hover:to-gray-900 hover:shadow-gray-900/30"
                        }`}
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            <span>Sending...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span>Send Message</span>
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                              />
                            </svg>
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Contact Information - Modern Cards */}
              <div
                className={`transition-all duration-1000 delay-500 ${
                  visibleSections.includes("contact") ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                }`}
              >
                <div className="space-y-4 sm:space-y-6">
                  {/* Contact Cards */}
                  {[
                    {
                      icon: Mail,
                      title: "Email",
                      content: "mauricio@example.com",
                      description: "Drop me a line anytime",
                      gradient: "from-blue-500/20 to-purple-500/20",
                    },
                    {
                      icon: Phone,
                      title: "Phone",
                      content: "+123 456 7890",
                      description: "Let's talk directly",
                      gradient: "from-green-500/20 to-blue-500/20",
                    },
                    {
                      icon: MapPin,
                      title: "Location",
                      content: "Music City, Creative District",
                      description: "Where the magic happens",
                      gradient: "from-orange-500/20 to-red-500/20",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`group p-4 sm:p-6 rounded-xl sm:rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer ${
                        isDarkMode
                          ? "bg-neutral-900/50 border-neutral-700/30 hover:bg-neutral-900/70"
                          : "bg-white/50 border-gray-200/30 hover:bg-white/70"
                      }`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <div
                        className={`absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${item.gradient}`}
                      />
                      <div className="relative z-10 flex items-start space-x-3 sm:space-x-4">
                        <div
                          className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 group-hover:scale-110 ${
                            isDarkMode ? "bg-neutral-800/50" : "bg-gray-100/50"
                          }`}
                        >
                          <item.icon
                            className={`h-5 w-5 sm:h-6 sm:w-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}
                          />
                        </div>
                        <div className="flex-1">
                          <h3
                            className={`font-medium text-base sm:text-lg mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}
                          >
                            {item.title}
                          </h3>
                          <p
                            className={`font-light mb-1 sm:mb-2 text-sm sm:text-base ${isDarkMode ? "text-white" : "text-gray-900"}`}
                          >
                            {item.content}
                          </p>
                          <p className={`text-xs sm:text-sm ${isDarkMode ? "text-neutral-400" : "text-gray-600"}`}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Social Media Section */}
                  <div
                    className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
                      isDarkMode ? "bg-neutral-900/50 border-neutral-700/30" : "bg-white/50 border-gray-200/30"
                    }`}
                  >
                    <h3
                      className={`font-medium text-base sm:text-lg mb-3 sm:mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}
                    >
                      Follow the Journey
                    </h3>
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                      {[
                        { icon: Instagram, label: "@mauricio.sound", gradient: "from-pink-500 to-orange-500" },
                        { icon: Youtube, label: "Mauricio Sound", gradient: "from-red-500 to-red-600" },
                      ].map((social, index) => (
                        <a
                          key={index}
                          href="#"
                          className={`group flex items-center space-x-3 p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg flex-1 ${
                            isDarkMode
                              ? "bg-neutral-800/50 hover:bg-neutral-800/80"
                              : "bg-gray-100/50 hover:bg-gray-100/80"
                          }`}
                        >
                          <div className={`p-1.5 sm:p-2 rounded-lg bg-gradient-to-r ${social.gradient} text-white`}>
                            <social.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                          </div>
                          <span
                            className={`font-light text-sm sm:text-base ${isDarkMode ? "text-white" : "text-gray-900"}`}
                          >
                            {social.label}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div
                    className={`text-center p-6 sm:p-8 rounded-xl sm:rounded-2xl backdrop-blur-sm border ${
                      isDarkMode
                        ? "bg-gradient-to-br from-neutral-900/80 to-neutral-800/80 border-neutral-700/30"
                        : "bg-gradient-to-br from-white/80 to-gray-50/80 border-gray-200/30"
                    }`}
                  >
                    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎵</div>
                    <h3
                      className={`text-lg sm:text-xl font-light mb-1 sm:mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}
                    >
                      Ready to Make Music?
                    </h3>
                    <p className={`text-xs sm:text-sm ${isDarkMode ? "text-neutral-400" : "text-gray-600"}`}>
                      Every great song starts with a conversation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Mini Player: Pause/Play preview */}
      {audioPlayer.currentSong && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-3 py-2 sm:px-4 sm:py-3 rounded-xl shadow-lg border backdrop-blur-md flex items-center gap-3 sm:gap-4 ${
            isDarkMode ? "bg-neutral-900/80 border-neutral-800 text-white" : "bg-white/80 border-gray-200 text-gray-900"
          }`}
        >
          <div className="max-w-[40vw] sm:max-w-[300px] truncate">
            <span className="text-xs sm:text-sm opacity-70 mr-2">Now Playing:</span>
            <span className="text-sm sm:text-base font-medium truncate align-middle">
              {audioPlayer.currentSong.title}
            </span>
          </div>
          <button
            onClick={() => {
              if (audioPlayer.isPlaying) {
                audioPlayer.pause()
              } else if (audioPlayer.currentSong) {
                audioPlayer.play({
                  id: audioPlayer.currentSong.id,
                  title: audioPlayer.currentSong.title,
                  url: audioPlayer.currentSong.url,
                  playlistId: (audioPlayer.currentSong as any).playlistId ?? 0,
                })
              }
            }}
            aria-label={audioPlayer.isPlaying ? 'Pausar' : 'Reanudar'}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDarkMode ? 'bg-white text-black hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {audioPlayer.isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>
      )}
    </div>
  )
}
