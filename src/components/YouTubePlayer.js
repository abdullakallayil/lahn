'use client';

import React, { useEffect } from 'react';
import YouTube from 'react-youtube';
import { usePlayer } from '@/context/PlayerContext';

export default function YouTubePlayer() {
  const { 
    currentTrack, 
    setPlayerInstance, 
    setIsPlaying, 
    volume, 
    setCurrentTime, 
    setDuration,
    repeatMode,
    playerRef,
    playTrack,
    nextTrack
  } = usePlayer();

  const onReady = (event) => {
    setPlayerInstance(event.target);
    event.target.setVolume(volume);
    setDuration(event.target.getDuration());
  };

  useEffect(() => {
    let interval;
    if (currentTrack) {
      interval = setInterval(() => {
        const player = window.YT?.get?.('youtube-player') || (window.youtubePlayerInstance); 
        // Note: we'll use the ref from state instead
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentTrack]);

  const onStateChange = (event) => {
    const player = event.target;
    setPlayerInstance(player);
    
    if (event.data === 1) {
      setIsPlaying(true);
      setDuration(player.getDuration());
    }
    else if (event.data === 2) setIsPlaying(false);
    else if (event.data === 0) {
      setIsPlaying(false);
      if (repeatMode === 'one') {
        player.seekTo(0);
        player.playVideo();
      } else {
        nextTrack();
      }
    }
  };

  // Poll for current time
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        try {
          const time = playerRef.current.getCurrentTime();
          setCurrentTime(time);
        } catch (err) {
          // Player might be destroyed or not ready
        }
      }
    }, 500);
    return () => clearInterval(interval);
  }, [setCurrentTime, playerRef]);

  const onReadyInternal = (event) => {
    onReady(event);
  };

  if (!currentTrack || currentTrack.type !== 'youtube') return null;

  return (
    <div style={{ display: 'none', position: 'absolute', opacity: 0, pointerEvents: 'none' }}>
      <YouTube 
        id="youtube-player"
        videoId={currentTrack.id}
        opts={{
          height: '10',
          width: '10',
          playerVars: { 
            autoplay: 1, 
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1
          }
        }}
        onReady={onReadyInternal}
        onStateChange={onStateChange}
      />
    </div>
  );
}
