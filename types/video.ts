// types/video.ts
export interface VideoItem {
  title: string;
  duration: string;
  progress: number;
  url?: string;
}

export interface VideoData {
  [key: number]: VideoItem[];
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  opacity: number;
  note?: string;
  vx?: number;
  vy?: number;
  rotation?: number;
  scale?: number;
}

export interface VideoModalProps {
  modalNumber: number;
  type: 'side' | 'center';
  position?: 'left' | 'right' | 'center';
  onVideoSelect?: (modalNumber: number, videoIndex: number) => void;
  onVideoPlay?: (modalNumber: number) => void;
}
