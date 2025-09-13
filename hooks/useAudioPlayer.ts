"use client"

import { useState, useRef, useEffect } from "react"

export function useAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentSong, setCurrentSong] = useState<{
    id: number
    title: string
    url: string
    playlistId: number
  } | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => {
      setDuration(audio.duration)
      setIsLoading(false)
      setError(null)
    }
    const handleEnded = () => setIsPlaying(false)
    const handleLoadStart = () => {
      setIsLoading(true)
      setError(null)
    }
    const handleCanPlay = () => setIsLoading(false)
    const handleError = (e: Event) => {
      setIsLoading(false)
      setIsPlaying(false)
      setError("Unable to load audio file")
      console.error("Audio error:", e)
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("loadstart", handleLoadStart)
    audio.addEventListener("canplay", handleCanPlay)
    audio.addEventListener("error", handleError)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("loadstart", handleLoadStart)
      audio.removeEventListener("canplay", handleCanPlay)
      audio.removeEventListener("error", handleError)
    }
  }, [currentSong])

  const play = async (song: { id: number; title: string; url: string; playlistId: number }) => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio()
      }

      const audio = audioRef.current

      if (currentSong?.id === song.id) {
        if (isPlaying) {
          audio.pause()
          setIsPlaying(false)
        } else {
          await audio.play()
          setIsPlaying(true)
        }
      } else {
        setIsLoading(true)
        setError(null)

        audio.pause()
        setIsPlaying(false)

        // Set audio source and volume
        audio.src = song.url
        audio.volume = volume
        setCurrentSong(song)
        setCurrentTime(0)

        const playAudio = () => {
          return new Promise<void>((resolve, reject) => {
            const onCanPlay = () => {
              audio.removeEventListener("canplay", onCanPlay)
              audio.removeEventListener("error", onError)
              audio
                .play()
                .then(() => {
                  setIsPlaying(true)
                  resolve()
                })
                .catch(reject)
            }

            const onError = (e: Event) => {
              audio.removeEventListener("canplay", onCanPlay)
              audio.removeEventListener("error", onError)
              reject(e)
            }

            audio.addEventListener("canplay", onCanPlay)
            audio.addEventListener("error", onError)

            // If audio is already ready, play immediately
            if (audio.readyState >= 3) {
              audio.removeEventListener("canplay", onCanPlay)
              audio.removeEventListener("error", onError)
              audio
                .play()
                .then(() => {
                  setIsPlaying(true)
                  resolve()
                })
                .catch(reject)
            }
          })
        }

        await playAudio()
      }
    } catch (error) {
      console.error("Error playing audio:", error)
      setIsLoading(false)
      setIsPlaying(false)
      setError("Failed to play audio. This might be a demo file.")
    }
  }

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const seek = (time: number) => {
    if (audioRef.current && !isNaN(time) && isFinite(time)) {
      audioRef.current.currentTime = Math.max(0, Math.min(time, duration))
      setCurrentTime(time)
    }
  }

  const setVolumeLevel = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    setVolume(clampedVolume)
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    currentSong,
    isLoading,
    error,
    play,
    pause,
    seek,
    setVolume: setVolumeLevel,
    formatTime,
  }
}
