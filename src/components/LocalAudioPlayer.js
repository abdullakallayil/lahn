'use client';

import { useEffect } from 'react';
import { usePlayer } from '@/context/PlayerContext';

export default function LocalAudioPlayer() {
  const { 
    currentTrack, 
    isPlaying, 
    setIsPlaying, 
    volume, 
    setCurrentTime, 
    setDuration,
    repeatMode,
    nextTrack,
    audioRef
  } = usePlayer();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
        setIsPlaying(true);
      } else {
        nextTrack();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioRef, setCurrentTime, setDuration, setIsPlaying, repeatMode, nextTrack]);

  // Effect to handle source changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || currentTrack?.type !== 'local') {
      if (audio && currentTrack?.type !== 'local') audio.pause();
      return;
    }

    // Only update src if it's different and track changed
    const currentSrc = audio.src;
    const targetSrc = currentTrack.url;
    
    // Check if we need to update the source
    // audio.src returns absolute URL, so we check if it includes targetSrc
    if (!currentSrc.includes(targetSrc)) {
      audio.src = targetSrc;
      if (isPlaying) {
        audio.play().catch(err => console.error("Playback failed on src change:", err));
      }
    }
  }, [currentTrack?.id, audioRef]);

  // Effect to handle play/pause state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || currentTrack?.type !== 'local') return;

    if (isPlaying) {
      if (audio.paused) {
        audio.play().catch(err => console.error("Playback failed on toggle:", err));
      }
    } else {
      if (!audio.paused) {
        audio.pause();
      }
    }
  }, [isPlaying, currentTrack?.id, audioRef]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume, audioRef]);

  return (
    <audio 
      ref={audioRef} 
      style={{ display: 'none' }} 
      preload="auto"
    />
  );
}
