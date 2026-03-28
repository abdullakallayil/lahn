'use client';

import { useState, useEffect } from 'react';
import { Play, Search, Bell, Users, User, LayoutGrid, Home as HomeIcon, Heart, Music } from 'lucide-react';
import styles from './page.module.css';
import { usePlayer } from '@/context/PlayerContext';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const { 
    playTrack, currentTrack, isPlaying, togglePlay, setQueue, 
    setCurrentIndex, likedSongs, userSongs, currentView 
  } = usePlayer();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch('/api/trending');
        if (res.ok) {
          const data = await res.json();
          setTrending(data);
        }
      } catch (err) {
        console.error("Failed to fetch trending:", err);
      } finally {
        setTrendingLoading(false);
      }
    };
    fetchTrending();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackClick = (track, index, sourceList) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      setQueue(sourceList);
      setCurrentIndex(index);
      playTrack(track);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.navButtons}>
          <button className={styles.circleBtn}>{'<'}</button>
          <button className={styles.circleBtn}>{'>'}</button>
        </div>
        
        <div className={styles.centerActions}>
          <button className={styles.circleBtn}><HomeIcon size={20} /></button>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchBar}>
              <Search size={20} color="#b3b3b3" />
              <input 
                type="text" 
                placeholder="What do you want to play?" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={styles.searchInput}
              />
              <div className={styles.searchDivider}></div>
              <LayoutGrid size={20} color="#b3b3b3" />
            </div>
          </form>
        </div>

        <div className={styles.authButtons}>
          <button className={styles.upgradeBtn}>Explore Premium</button>
          <button className={styles.iconBtn}><Bell size={20} /></button>
          <button className={styles.iconBtn}><Users size={20} /></button>
          <div className={styles.profileBtn}><User size={20} /></div>
        </div>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)' }}>
          Loading tracks...
        </div>
      ) : currentView === 'liked' ? (
        <section className={styles.section}>
          <div className={styles.likedHeader} style={{ background: 'linear-gradient(to bottom, #7a0f0f, #000000)' }}>
            <div className={styles.likedImgBig} style={{ background: 'rgba(255,255,255,0.1)' }}>
               <Heart fill="white" size={64} color="white" />
            </div>
            <div className={styles.likedInfo}>
              <span className={styles.badge}>Playlist</span>
              <h1 className={styles.likedTitleLarge}>Liked Songs</h1>
              <div className={styles.likedMeta}>
                <span className={styles.username}>User</span> • {likedSongs.length} songs
              </div>
            </div>
          </div>

          <div className={styles.tracksHeader}>
            <span># TITLE</span>
            <span>ALBUM</span>
            <span>DATE ADDED</span>
            <span>DURATION</span>
          </div>
          <div className={styles.divider}></div>

          <div className={styles.trackList}>
            {likedSongs.length > 0 ? (
              likedSongs.map((track, index) => {
                const isActive = currentTrack?.id === track.id;
                return (
                  <div 
                    key={track.id} 
                    className={`${styles.trackRow} ${isActive ? styles.activeTrack : ''}`}
                    onClick={() => handleTrackClick(track, index, likedSongs)}
                  >
                    <div className={styles.trackIndex}>{index + 1}</div>
                    <div className={styles.trackMain}>
                      <img src={track.thumbnail} alt="" className={styles.trackThumb} />
                      <div className={styles.trackDetails}>
                        <div className={styles.trackTitle}>{track.title}</div>
                        <div className={styles.trackArtist}>{track.artist}</div>
                      </div>
                    </div>
                    <div className={styles.trackAlbum}>Search Result</div>
                    <div className={styles.trackDate}>Recently</div>
                    <div className={styles.trackTime}>--:--</div>
                  </div>
                );
              })
            ) : (
              <div className={styles.emptyState}>
                Your liked songs will appear here.
              </div>
            )}
          </div>
        </section>
      ) : currentView === 'uploads' ? (
        <section className={styles.section}>
          <div className={styles.likedHeader} style={{ background: 'linear-gradient(to bottom, #ee1d23, #000000)' }}>
            <div className={styles.likedImgBig} style={{ background: 'rgba(255,255,255,0.1)' }}>
               <Music fill="white" size={64} color="white" />
            </div>
            <div className={styles.likedInfo}>
              <span className={styles.badge}>Library</span>
              <h1 className={styles.likedTitleLarge}>Your Uploads</h1>
              <div className={styles.likedMeta}>
                <span className={styles.username}>User</span> • {userSongs.length} songs
              </div>
            </div>
          </div>

          <div className={styles.tracksHeader}>
            <span># TITLE</span>
            <span>ALBUM</span>
            <span>DATE ADDED</span>
            <span>DURATION</span>
          </div>
          <div className={styles.divider}></div>

          <div className={styles.trackList}>
            {userSongs.length > 0 ? (
              userSongs.map((track, index) => {
                const isActive = currentTrack?.id === track.id;
                return (
                  <div 
                    key={track.id} 
                    className={`${styles.trackRow} ${isActive ? styles.activeTrack : ''}`}
                    onClick={() => handleTrackClick(track, index, userSongs)}
                  >
                    <div className={styles.trackIndex}>{index + 1}</div>
                    <div className={styles.trackMain}>
                      <img src={track.thumbnail} alt="" className={styles.trackThumb} />
                      <div className={styles.trackDetails}>
                        <div className={styles.trackTitle}>{track.title}</div>
                        <div className={styles.trackArtist}>{track.artist}</div>
                      </div>
                    </div>
                    <div className={styles.trackAlbum}>Manual Upload</div>
                    <div className={styles.trackDate}>
                      {track.createdAt ? new Date(track.createdAt).toLocaleDateString() : 'Recently'}
                    </div>
                    <div className={styles.trackTime}>--:--</div>
                  </div>
                );
              })
            ) : (
              <div className={styles.emptyState}>
                You haven't uploaded any songs yet. Click "Upload Song" in the sidebar to get started!
              </div>
            )}
          </div>
        </section>
      ) : results.length > 0 ? (
        <section className={styles.section}>
          <h2 className={styles.greeting}>Search Results</h2>
          <div className={styles.recentGrid}>
            {results.map((track, index) => {
              const isActive = currentTrack?.id === track.id;
              return (
                <div 
                  key={track.id} 
                  className={`${styles.recentCard} ${isActive ? styles.activeCard : ''}`}
                  onClick={() => handleTrackClick(track, index, results)}
                >
                  <div 
                    className={styles.recentImg} 
                    style={{ backgroundImage: `url(${track.thumbnail})`, backgroundSize: 'cover' }}
                  ></div>
                  <div className={styles.recentText}>
                    <div className={styles.recentTitle}>{track.title}</div>
                    <div className={styles.recentArtist}>{track.artist}</div>
                  </div>
                  <button className={styles.cardPlayBtn} style={{ opacity: isActive ? 1 : '' }}>
                    <Play fill="currentColor" size={20} />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <>
          <section className={styles.section}>
            <h1 className={styles.greeting}>Good Evening</h1>
            <div className={styles.recentGrid}>
              {likedSongs.length > 0 ? (
                likedSongs.slice(0, 6).map((track, index) => (
                  <div 
                    key={track.id} 
                    className={styles.recentCard}
                    onClick={() => handleTrackClick(track, index, likedSongs)}
                  >
                    <div 
                      className={styles.recentImg}
                      style={{ backgroundImage: `url(${track.thumbnail})`, backgroundSize: 'cover' }}
                    ></div>
                    <div className={styles.recentText}>
                      <div className={styles.recentTitle}>{track.title}</div>
                    </div>
                    <button className={styles.cardPlayBtn} style={{ opacity: currentTrack?.id === track.id ? 1 : '' }}>
                      <Play fill="currentColor" size={20} />
                    </button>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  Your liked songs will appear here.
                </div>
              )}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Trending Now</h2>
            </div>
            {trendingLoading ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '14px', padding: '20px 0' }}>Loading trending...</div>
            ) : (
              <div className={styles.recentGrid}>
                {trending.slice(0, 6).map((track, index) => {
                  const isActive = currentTrack?.id === track.id;
                  return (
                    <div 
                      key={track.id} 
                      className={`${styles.recentCard} ${isActive ? styles.activeCard : ''}`}
                      onClick={() => handleTrackClick(track, index, trending)}
                    >
                      <div 
                        className={styles.recentImg}
                        style={{ backgroundImage: `url(${track.thumbnail})`, backgroundSize: 'cover' }}
                      ></div>
                      <div className={styles.recentText}>
                        <div className={styles.recentTitle}>{track.title}</div>
                        <div className={styles.recentArtist}>{track.artist}</div>
                      </div>
                      <button className={styles.cardPlayBtn} style={{ opacity: isActive ? 1 : '' }}>
                        <Play fill="currentColor" size={20} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Made For You</h2>
              <span className={styles.seeAll}>Show all</span>
            </div>
            
            <div className={styles.carousel}>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className={styles.mixCard}>
                  <div className={styles.mixImg}>
                    <button className={styles.mixPlayBtn}>
                      <Play fill="currentColor" size={24} />
                    </button>
                  </div>
                  <h3 className={styles.mixTitle}>Daily Mix {item}</h3>
                  <p className={styles.mixDesc}>Your daily blend of favorite tracks.</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
