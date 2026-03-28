'use client';

import { 
  Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, 
  Volume2, Maximize2, Mic2, Layers, PlusCircle, MonitorSpeaker, 
  PictureInPicture2, Heart
} from 'lucide-react';
import styles from './Player.module.css';
import { usePlayer } from '@/context/PlayerContext';

export default function Player() {
  const { 
    currentTrack, isPlaying, togglePlay, volume, setVolume,
    setIsExpanded, isExpanded, currentTime, duration,
    isShuffle, setIsShuffle, repeatMode, setRepeatMode,
    playerRef, audioRef, nextTrack, prevTrack, likedSongs, toggleLike
  } = usePlayer();

  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (currentTrack?.type === 'local' && audioRef.current) {
      audioRef.current.currentTime = time;
    } else if (playerRef.current?.seekTo) {
      playerRef.current.seekTo(time);
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseInt(e.target.value);
    setVolume(newVol);
    if (currentTrack?.type === 'local' && audioRef.current) {
      audioRef.current.volume = newVol / 100;
    } else if (playerRef.current?.setVolume) {
      playerRef.current.setVolume(newVol);
    }
  };

  const toggleRepeat = () => {
    setRepeatMode(prev => prev === 'none' ? 'one' : prev === 'one' ? 'all' : 'none');
  };

  const isLiked = currentTrack && likedSongs.some(s => s.id === currentTrack.id);

  return (
    <div className={styles.playerContainer}>
      {/* LEFT: Info */}
      <div className={styles.nowPlaying}>
        {currentTrack ? (
          <>
            <div 
              className={styles.albumArt} 
              style={{ backgroundImage: `url(${currentTrack.thumbnail})`, backgroundSize: 'cover' }}
            ></div>
            <div className={styles.trackInfo}>
              <div className={styles.trackName}>{currentTrack.title}</div>
              <div className={styles.artistName}>{currentTrack.artist}</div>
            </div>
            <button 
              className={`${styles.actionBtnSmall} ${isLiked ? styles.activeHeart : ''}`}
              onClick={() => toggleLike(currentTrack)}
            >
              <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
            </button>
            <button className={styles.actionBtnSmall}><PlusCircle size={18} /></button>
          </>
        ) : (
          <div className={styles.trackInfo}>
            <div className={styles.trackName}>No track playing</div>
            <div className={styles.artistName}>Search to start listening</div>
          </div>
        )}
      </div>

      {/* CENTER: Controls & Progress */}
      <div className={styles.controlsSection}>
        <div className={styles.buttons}>
          <button 
            className={`${styles.controlBtn} ${isShuffle ? styles.activeControl : ''}`}
            onClick={() => setIsShuffle(!isShuffle)}
          >
            <Shuffle size={18} />
          </button>
          <button className={styles.controlBtn} onClick={prevTrack}>
            <SkipBack size={22} fill="currentColor" />
          </button>
          <button className={`${styles.playBtn} ${isPlaying ? styles.isPlaying : ''}`} onClick={togglePlay}>
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" style={{ marginLeft: '2px' }} />}
          </button>
          <button className={styles.controlBtn} onClick={nextTrack}>
            <SkipForward size={22} fill="currentColor" />
          </button>
          <button 
            className={`${styles.controlBtn} ${repeatMode !== 'none' ? styles.activeControl : ''}`}
            onClick={toggleRepeat}
          >
            <Repeat size={18} />
            {repeatMode === 'one' && <span className={styles.repeatBadge}>1</span>}
          </button>
        </div>
        
        <div className={styles.progressRow}>
          <span className={styles.timeText}>{formatTime(currentTime)}</span>
          <input 
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className={styles.rangeSlider}
            style={{ 
              background: `linear-gradient(to right, #fff ${currentTime / (duration || 1) * 100}%, rgba(255, 255, 255, 0.1) 0%)` 
            }}
          />
          <span className={styles.timeText}>{formatTime(duration)}</span>
        </div>
      </div>

      {/* RIGHT: Extra Actions */}
      <div className={styles.extraControls}>
        <button className={styles.controlBtn}><Mic2 size={16} /></button>
        <button className={styles.controlBtn}><Layers size={16} /></button>
        <button className={styles.controlBtn}><MonitorSpeaker size={16} /></button>
        <div className={styles.volumeContainer}>
          <Volume2 size={16} className={styles.controlBtn} />
          <input 
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className={styles.volumeSlider}
            style={{ 
              background: `linear-gradient(to right, #ee1d23 ${volume}%, rgba(255, 255, 255, 0.1) 0%)` 
            }}
          />
        </div>
        <button className={styles.controlBtn}><PictureInPicture2 size={16} /></button>
        <button className={styles.controlBtn} onClick={() => setIsExpanded(!isExpanded)}><Maximize2 size={16} /></button>
      </div>
    </div>
  );
}
