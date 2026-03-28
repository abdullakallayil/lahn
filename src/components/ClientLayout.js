'use client';

import Sidebar from "@/components/Sidebar";
import Player from "@/components/Player";
import YouTubePlayer from "@/components/YouTubePlayer";
import LocalAudioPlayer from "@/components/LocalAudioPlayer";
import UploadModal from "@/components/UploadModal";
import ExpandedView from "@/components/ExpandedView";
import { PlayerProvider, usePlayer } from "@/context/PlayerContext";

export default function ClientLayout({ children }) {
  return (
    <PlayerProvider>
      <LayoutInner>{children}</LayoutInner>
    </PlayerProvider>
  );
}

function LayoutInner({ children }) {
  const { isExpanded, themeColor, showUploadModal } = usePlayer();

  return (
    <div className="app-container" style={{ '--player-theme': themeColor }}>
      {isExpanded && <ExpandedView />}
      {showUploadModal && <UploadModal />}
      <LocalAudioPlayer />
      <div className="sidebar-area">
        <Sidebar />
      </div>
      <main className="main-area">
        {children}
      </main>
      <div className="player-area glass">
        <Player />
      </div>
      <YouTubePlayer />
    </div>
  );
}
