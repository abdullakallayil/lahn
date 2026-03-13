"use client";

import { useAudio } from "@/context/AudioContext";
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

function formatTime(seconds: number) {
    if (!seconds || isNaN(seconds) || !isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function PlayerBar() {
    const { currentSong, isPlaying, togglePlay, next, prev, currentTime, duration, seek, volume, setVolume } = useAudio();

    if (!currentSong) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 h-24 bg-zinc-950/80 backdrop-blur-xl border-t border-white/5 px-6 flex items-center justify-between z-50">
            {/* Song Info */}
            <div className="flex items-center gap-4 w-[30%]">
                <div className="w-14 h-14 rounded-md bg-zinc-800 overflow-hidden relative group">
                    {currentSong.coverUrl ? (
                        <img src={currentSong.coverUrl} alt={currentSong.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                            <span className="text-xs text-zinc-600">No Art</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center">
                        <Maximize2 className="w-4 h-4 text-white" />
                    </div>
                </div>
                <div>
                    <h4 className="text-white font-medium text-sm truncate max-w-[200px]">{currentSong.title}</h4>
                    <p className="text-zinc-500 text-xs truncate max-w-[200px]">{currentSong.artist}</p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-2 w-[40%]">
                <div className="flex items-center gap-6">
                    <button onClick={prev} className="text-zinc-400 hover:text-white transition-colors">
                        <SkipBack className="w-5 h-5" />
                    </button>

                    <button
                        onClick={togglePlay}
                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
                    >
                        {isPlaying ?
                            <Pause className="w-5 h-5 text-black fill-black" /> :
                            <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                        }
                    </button>

                    <button onClick={next} className="text-zinc-400 hover:text-white transition-colors">
                        <SkipForward className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex items-center gap-3 w-full max-w-md">
                    <span className="text-xs text-zinc-500 min-w-[35px] text-right">{formatTime(currentTime)}</span>
                    <div className="flex-1 h-1 bg-zinc-800 rounded-full relative group cursor-pointer">
                        <input
                            type="range"
                            min={0}
                            max={duration || 100}
                            value={currentTime}
                            onChange={(e) => seek(Number(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div
                            className="h-full bg-white rounded-full relative"
                            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                    <span className="text-xs text-zinc-500 min-w-[35px]">{formatTime(duration)}</span>
                </div>
            </div>

            {/* Volume / Extras */}
            <div className="flex items-center justify-end gap-3 w-[30%]">
                <Volume2 className="w-5 h-5 text-zinc-400" />
                <div className="w-24 h-1 bg-zinc-800 rounded-full relative group">
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div
                        className="h-full bg-zinc-400 group-hover:bg-primary rounded-full transition-colors"
                        style={{ width: `${volume * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
