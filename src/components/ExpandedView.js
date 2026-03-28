import { X, MoreHorizontal, Maximize2, Mic2, Heart, Plus } from 'lucide-react';
import styles from './ExpandedView.module.css';
import { usePlayer } from '@/context/PlayerContext';

export default function ExpandedView() {
  const { currentTrack, isPlaying, setIsExpanded, toggleLike, likedSongs } = usePlayer();

  if (!currentTrack) return null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.closeBtn} onClick={() => setIsExpanded(false)}>
          <X size={24} />
        </button>
        <div className={styles.trackTitle}>{currentTrack.title}</div>
        <div className={styles.headerActions}>
          <button 
            className={`${styles.actionBtn} ${currentTrack && likedSongs.some(s => s.id === currentTrack.id) ? styles.activeHeart : ''}`}
            onClick={() => toggleLike(currentTrack)}
          >
            <Heart size={20} fill={currentTrack && likedSongs.some(s => s.id === currentTrack.id) ? "currentColor" : "none"} />
          </button>
          <button className={styles.actionBtn}><Plus size={20} /></button>
          <button className={styles.actionBtn}><MoreHorizontal size={20} /></button>
        </div>
      </header>

      <div className={styles.content}>
        <div className={`${styles.albumArtWrapper} ${isPlaying ? styles.playing : ''}`}>
          <div 
            className={styles.albumArt} 
            style={{ backgroundImage: `url(${currentTrack.thumbnail.replace('default', 'hqdefault')})` }}
          ></div>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.expandedControls}>
          <button className={styles.extraBtn}><Plus size={20} /></button>
          <button className={styles.extraBtn}><Maximize2 size={20} /></button>
          <button className={styles.extraBtn}><Mic2 size={20} /></button>
        </div>
      </footer>
    </div>
  );
}
