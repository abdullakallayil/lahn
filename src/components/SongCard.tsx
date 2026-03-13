"use client";

import { Song, useAudio } from "@/context/AudioContext";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface SongCardProps {
    song: Song;
    className?: string;
}

export function SongCard({ song, className }: SongCardProps) {
    const { play, pause, currentSong, isPlaying } = useAudio();

    const isCurrent = currentSong?.id === song.id;
    const isCurrentlyPlaying = isCurrent && isPlaying;

    const handlePlayClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            if (isCurrentlyPlaying) {
                pause();
            } else {
                play(song);
            }
        } catch (err) {
            console.error("SongCard Click Error:", err);
        }
    };

    return (
        <div
            className={cn("group p-3 rounded-md hover:bg-zinc-900 transition-colors cursor-pointer", className)}
            onClick={() => {
                try {
                    play(song);
                } catch (err) {
                    console.error("SongCard Card Click Error:", err);
                }
            }}
        >
            <div className="relative aspect-square rounded-md overflow-hidden bg-zinc-800 mb-3 text-zinc-500 flex items-center justify-center">
                {song.coverUrl ? (
                    <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-4xl select-none">♪</span>
                )}

                <button
                    onClick={handlePlayClick}
                    className={cn(
                        "absolute bottom-2 right-2 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300",
                        isCurrentlyPlaying && "opacity-100 translate-y-0"
                    )}
                >
                    {isCurrentlyPlaying ? (
                        <Pause className="w-5 h-5 text-white fill-white" />
                    ) : (
                        <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    )}
                </button>
            </div>
            <h3 className="font-medium text-white truncate text-base">{song.title}</h3>
            <p className="text-zinc-500 text-sm truncate">{song.artist}</p>
        </div>
    );
}
