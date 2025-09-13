'use client'

import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, X } from 'lucide-react'
import { useState } from 'react'

interface AudioPlayerProps {
  isDarkMode: boolean
}

export function AudioPlayer({ isDarkMode }: AudioPlayerProps) {
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    currentSong,
    isLoading,
    error,
    pause,
    seek,
    setVolume,
    formatTime
  } = useAudioPlayer()

  const [isMuted, setIsMuted] = useState(false)

  if (!currentSong) return null

  const toggleMute = () => {
    if (isMuted) {
      setVolume(1)
      setIsMuted(false)
    } else {
      setVolume(0)
      setIsMuted(true)
    }
  }

  const handleSeek = (value: number[]) => {
    if (duration > 0) {
      seek(value[0])
    }
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    setIsMuted(value[0] === 0)
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 p-4 backdrop-blur-md border-t transition-all duration-500 transform ${
      isDarkMode 
        ? "bg-black/95 border-neutral-800" 
        : "bg-white/95 border-gray-200"
    }`}>
      <div className="container mx-auto">
        <div className="flex items-center space-x-4">
          {/* Song Info */}
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-medium truncate transition-colors duration-500 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}>
              {currentSong.title}
            </h4>
            <p className={`text-xs transition-colors duration-500 ${
              isDarkMode ? "text-neutral-400" : "text-gray-500"
            }`}>
              {error ? "Demo Mode" : `${formatTime(currentTime)} / ${formatTime(duration)}`}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              className={`transition-colors duration-200 ${
                isDarkMode 
                  ? "text-neutral-400 hover:text-white" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
              disabled={!!error}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button
              size="sm"
              onClick={isPlaying ? pause : () => {}}
              disabled={isLoading || !!error}
              className={`transition-colors duration-200 ${
                isDarkMode 
                  ? "bg-white text-black hover:bg-gray-100" 
                  : "bg-gray-900 hover:bg-gray-800 text-white"
              } ${(isLoading || error) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              className={`transition-colors duration-200 ${
                isDarkMode 
                  ? "text-neutral-400 hover:text-white" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
              disabled={!!error}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="flex-1 max-w-md">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
              disabled={!duration || !!error}
            />
          </div>

          {/* Volume */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleMute}
              className={`transition-colors duration-200 ${
                isDarkMode 
                  ? "text-neutral-400 hover:text-white" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
              disabled={!!error}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Slider
              value={[volume]}
              max={1}
              step={0.1}
              onValueChange={handleVolumeChange}
              className="w-20"
              disabled={!!error}
            />
          </div>

          {/* Close Button */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => window.location.reload()}
            className={`transition-colors duration-200 ${
              isDarkMode 
                ? "text-neutral-400 hover:text-white" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className={`mt-2 text-xs text-center ${
            isDarkMode ? "text-neutral-500" : "text-gray-500"
          }`}>
            🎵 Demo mode: Replace with real audio URLs to enable playback
          </div>
        )}
      </div>
    </div>
  )
}
