import { Home, Search, Library, PlusSquare, Heart } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const { currentView, setCurrentView, setShowUploadModal } = usePlayer();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo} onClick={() => setCurrentView('home')}>
        <img src="/logo.png" alt="Lahn Logo" className={styles.logoImg} />
        <h2>Lahn</h2>
      </div>

      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li 
            className={currentView === 'home' ? styles.active : ''} 
            onClick={() => setCurrentView('home')}
          >
            <Home size={24} />
            <span>Home</span>
          </li>
          <li 
            className={currentView === 'uploads' ? styles.active : ''} 
            onClick={() => setCurrentView('uploads')}
          >
            <Library size={24} />
            <span>Your Uploads</span>
          </li>
        </ul>
      </nav>

      <div className={styles.actions}>
        <ul>
          <li>
            <div className={styles.actionIcon} style={{ background: '#b3b3b3', color: '#000' }}>
              <PlusSquare size={20} />
            </div>
            <span>Create Playlist</span>
          </li>
          <li 
            className={currentView === 'liked' ? styles.active : ''} 
            onClick={() => setCurrentView('liked')}
          >
            <div className={styles.actionIcon} style={{ background: 'linear-gradient(135deg, #7a0f0f, #ee1d23)' }}>
              <Heart size={20} color="white" />
            </div>
            <span>Liked Songs</span>
          </li>
          <li onClick={() => setShowUploadModal(true)}>
            <div className={styles.actionIcon} style={{ background: '#ee1d23', color: '#fff' }}>
              <PlusSquare size={20} />
            </div>
            <span>Upload Song</span>
          </li>
        </ul>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.playlists}>
        <ul>
          <li>Chill Vibes</li>
          <li>Discover Weekly</li>
          <li>Top Hits 2026</li>
          <li>Focus Mode</li>
          <li>Workout Mix</li>
          <li>Late Night Drives</li>
        </ul>
      </div>
    </aside>
  );
}
