'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isExpanded, setIsExpanded] = useState(false);
  const [themeColor, setThemeColor] = useState('#634a17');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none'); 
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [likedSongs, setLikedSongs] = useState([]);
  const [userSongs, setUserSongs] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const playerRef = useRef(null);
  const audioRef = useRef(null);

  const playTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    // Color logic
    const colors = ['#4d0a0a', '#1a1a1a', '#2b0505', '#121212', '#7a0f0f', '#000000'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setThemeColor(randomColor);
  };

  const fetchUserSongs = async () => {
    try {
      const res = await fetch('/api/my-music');
      if (res.ok) {
        const data = await res.json();
        setUserSongs(data);
      }
    } catch (err) {
      console.error("Failed to fetch user songs:", err);
    }
  };

  useEffect(() => {
    fetchUserSongs();
  }, []);

  const togglePlay = () => {
    if (!currentTrack) return;
    
    if (currentTrack.type === 'local') {
      if (audioRef.current) {
        if (isPlaying) audioRef.current.pause();
        else audioRef.current.play();
      }
    } else {
      if (playerRef.current) {
        if (isPlaying) playerRef.current.pauseVideo();
        else playerRef.current.playVideo();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const toggleLike = (track) => {
    if (!track) return;
    setLikedSongs(prev => {
      const isLiked = prev.some(s => s.id === track.id);
      if (isLiked) {
        return prev.filter(s => s.id !== track.id);
      } else {
        return [...prev, track];
      }
    });
  };

  const setPlayerInstance = (player) => {
    playerRef.current = player;
  };

  return (
    <PlayerContext.Provider value={{
      currentTrack,
      isPlaying,
      setIsPlaying,
      playTrack,
      togglePlay,
      volume,
      setVolume,
      playerRef,
      setPlayerInstance,
      isExpanded,
      setIsExpanded,
      themeColor,
      setThemeColor,
      currentTime,
      setCurrentTime,
      duration,
      setDuration,
      isShuffle,
      setIsShuffle,
      repeatMode,
      setRepeatMode,
      queue,
      setQueue,
      currentIndex,
      setCurrentIndex,
      nextTrack: () => {
        if (queue.length === 0) return;
        const nextIdx = (currentIndex + 1) % queue.length;
        setCurrentIndex(nextIdx);
        setCurrentTrack(queue[nextIdx]);
      },
      prevTrack: () => {
        if (queue.length === 0) return;
        if (currentTime > 5) {
          if (currentTrack?.type === 'local' && audioRef.current) {
            audioRef.current.currentTime = 0;
          } else if (playerRef.current?.seekTo) {
            playerRef.current.seekTo(0);
          }
        } else {
          const prevIdx = (currentIndex - 1 + queue.length) % queue.length;
          setCurrentIndex(prevIdx);
          setCurrentTrack(queue[prevIdx]);
        }
      },
      likedSongs,
      setLikedSongs,
      toggleLike,
      userSongs,
      setUserSongs,
      fetchUserSongs,
      showUploadModal,
      setShowUploadModal,
      audioRef,
      currentView,
      setCurrentView
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);
