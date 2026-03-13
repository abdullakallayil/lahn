"use client";

import { useState } from "react";
import { Search, Clock, ArrowRight } from "lucide-react";
import { SongCard } from "@/components/SongCard";
import type { Song } from "@/context/AudioContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Real YouTube Video IDs
const MOCK_RECENTS = ["Arijit Singh", "Lofi Beats", "Rock Classics", "Latest Punabi"];
const MOCK_SONGS: Song[] = [
  { id: "Umqb9KENgWE", title: "Tum Hi Ho", artist: "Arijit Singh", audioUrl: "", coverUrl: "https://i.ytimg.com/vi/Umqb9KENgWE/hqdefault.jpg", isYouTube: true },
  { id: "4NRXx6U8ABQ", title: "Blinding Lights", artist: "The Weeknd", audioUrl: "", coverUrl: "https://i.ytimg.com/vi/4NRXx6U8ABQ/hqdefault.jpg", isYouTube: true },
  { id: "TUVcZfQe-Kw", title: "Levitating", artist: "Dua Lipa", audioUrl: "", coverUrl: "https://i.ytimg.com/vi/TUVcZfQe-Kw/hqdefault.jpg", isYouTube: true },
  { id: "tQ0yjYUFKAE", title: "Peaches", artist: "Justin Bieber", audioUrl: "", coverUrl: "https://i.ytimg.com/vi/tQ0yjYUFKAE/hqdefault.jpg", isYouTube: true },
  { id: "JGwWNGJdvx8", title: "Shape of You", artist: "Ed Sheeran", audioUrl: "", coverUrl: "https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg", isYouTube: true },
];

export default function Home() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  return (
    <div className="p-6 pb-32 space-y-8">
      {/* Header / Search */}
      <div className="flex justify-between items-center gap-4 relative">
        <div className="relative flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="What do you want to play?"
              className="w-full h-12 rounded-full bg-zinc-900 border border-zinc-800 text-white pl-10 pr-4 focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-500"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                }
              }}
            />
          </div>

          {/* Recent Searches Dropdown */}
          {isSearchFocused && !searchQuery && (
            <div className="absolute top-14 left-0 w-full bg-zinc-900 rounded-lg border border-zinc-800 shadow-xl p-4 z-50">
              <h4 className="text-sm font-semibold text-white mb-3">Recent Searches</h4>
              <div className="space-y-1">
                {MOCK_RECENTS.map((recent, i) => (
                  <div key={i} className="flex items-center justify-between p-2 hover:bg-zinc-800 rounded-md cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-zinc-500 group-hover:text-white" />
                      <span className="text-zinc-400 group-hover:text-white text-sm">{recent}</span>
                    </div>
                    <button className="text-zinc-600 hover:text-white">x</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Placeholder for User Profile / Notifications if needed */}
        </div>
      </div>

      {/* Made For You */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">Made For You</h2>
          <Link href="/library" className="text-sm text-zinc-500 hover:text-white font-medium">Show all</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {MOCK_SONGS.map((song) => (
            <SongCard key={song.id} song={song} className="bg-zinc-900/50 hover:bg-zinc-900" />
          ))}
        </div>
      </section>

      {/* New Releases or other sections */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">New Releases</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {MOCK_SONGS.slice().reverse().map((song) => (
            <SongCard key={song.id + 'new'} song={{ ...song, id: song.id + 'new' }} className="bg-zinc-900/50 hover:bg-zinc-900" />
          ))}
        </div>
      </section>
    </div>
  );
}
