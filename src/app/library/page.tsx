"use client";

import { useState, useEffect } from "react";
import { SongCard } from "@/components/SongCard";
import { Heart, User, ListMusic, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Song } from "@/context/AudioContext";

// Mock Data
const MOCK_LIKED: Song[] = [
    { id: "Umqb9KENgWE", title: "Tum Hi Ho", artist: "Arijit Singh", audioUrl: "", coverUrl: "https://i.ytimg.com/vi/Umqb9KENgWE/hqdefault.jpg", isYouTube: true },
    { id: "TUVcZfQe-Kw", title: "Levitating", artist: "Dua Lipa", audioUrl: "", coverUrl: "https://i.ytimg.com/vi/TUVcZfQe-Kw/hqdefault.jpg", isYouTube: true },
];

const MOCK_ARTISTS = [
    { name: "Arijit Singh", followers: "20M", image: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=300&h=300&fit=crop" },
    { name: "The Weeknd", followers: "85M", image: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=300&h=300&fit=crop" },
];

const MOCK_PLAYLISTS = [
    { name: "My Driving Mix", count: 42, image: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=300&h=300&fit=crop" },
    { name: "Chill Vibes", count: 18, image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop" },
];

type Tab = "liked" | "artists" | "playlists" | "uploads";

export default function LibraryPage() {
    const [activeTab, setActiveTab] = useState<Tab>("liked");
    const [uploads, setUploads] = useState<Song[]>([]);
    const [loadingUploads, setLoadingUploads] = useState(false);

    useEffect(() => {
        if (activeTab === "uploads") {
            setLoadingUploads(true);
            fetch('/api/uploads')
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setUploads(data);
                })
                .catch(console.error)
                .finally(() => setLoadingUploads(false));
        }
    }, [activeTab]);

    return (
        <div className="p-8 space-y-8 pb-32">
            <h1 className="text-4xl font-bold text-white mb-6">My Library</h1>

            {/* Tabs */}
            <div className="flex items-center gap-4 border-b border-zinc-800 pb-1 overflow-x-auto">
                <button
                    onClick={() => setActiveTab("liked")}
                    className={cn(
                        "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap",
                        activeTab === "liked" ? "text-primary" : "text-zinc-400 hover:text-white"
                    )}
                >
                    <Heart className="w-4 h-4" />
                    Liked Songs
                    {activeTab === "liked" && <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-primary" />}
                </button>

                <button
                    onClick={() => setActiveTab("uploads")}
                    className={cn(
                        "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap",
                        activeTab === "uploads" ? "text-primary" : "text-zinc-400 hover:text-white"
                    )}
                >
                    <UploadCloud className="w-4 h-4" />
                    My Uploads
                    {activeTab === "uploads" && <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-primary" />}
                </button>

                <button
                    onClick={() => setActiveTab("artists")}
                    className={cn(
                        "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap",
                        activeTab === "artists" ? "text-primary" : "text-zinc-400 hover:text-white"
                    )}
                >
                    <User className="w-4 h-4" />
                    Artists
                    {activeTab === "artists" && <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-primary" />}
                </button>

                <button
                    onClick={() => setActiveTab("playlists")}
                    className={cn(
                        "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap",
                        activeTab === "playlists" ? "text-primary" : "text-zinc-400 hover:text-white"
                    )}
                >
                    <ListMusic className="w-4 h-4" />
                    Playlists
                    {activeTab === "playlists" && <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-primary" />}
                </button>
            </div>

            {/* Content */}
            <div className="min-h-[300px]">
                {activeTab === "liked" && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {MOCK_LIKED.map(song => (
                            <SongCard key={song.id} song={song} className="bg-zinc-900/40" />
                        ))}
                        {MOCK_LIKED.length === 0 && <p className="text-zinc-500">No liked songs yet.</p>}
                    </div>
                )}

                {activeTab === "uploads" && (
                    <div className="space-y-4">
                        {loadingUploads ? (
                            <div className="text-center text-zinc-500 py-10">Loading uploads...</div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {uploads.map(song => (
                                    <SongCard key={song.id} song={song} className="bg-zinc-900/40" />
                                ))}
                                {uploads.length === 0 && <p className="text-zinc-500">No uploaded songs found. Go to Upload page to add some.</p>}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "artists" && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {MOCK_ARTISTS.map((artist, i) => (
                            <div key={i} className="group p-4 rounded-lg bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-center cursor-pointer">
                                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-3">
                                    <img src={artist.image} alt={artist.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <h3 className="font-medium text-white">{artist.name}</h3>
                                <p className="text-xs text-zinc-500">{artist.followers} followers</p>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "playlists" && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {MOCK_PLAYLISTS.map((playlist, i) => (
                            <div key={i} className="group p-3 rounded-lg bg-zinc-900/40 hover:bg-zinc-900 transition-colors cursor-pointer">
                                <div className="aspect-square rounded-md overflow-hidden mb-3 relative">
                                    <img src={playlist.image} alt={playlist.name} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <ListMusic className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                <h3 className="font-medium text-white truncate">{playlist.name}</h3>
                                <p className="text-xs text-zinc-500">{playlist.count} songs</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
