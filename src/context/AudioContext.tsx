"use client";

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import type { YouTubePlayer } from "react-youtube";

export interface Song {
    id: string; // YouTube Video ID or Local File Path
    title: string;
    artist: string;
    coverUrl?: string;
    audioUrl?: string; // Present for local files
    duration?: number;
    isYouTube?: boolean; // Flag to distinguish
}

interface AudioContextType {
    currentSong: Song | null;
    isPlaying: boolean;
    play: (song?: Song) => void;
    pause: () => void;
    togglePlay: () => void;
    next: () => void;
    prev: () => void;
    queue: Song[];
    addToQueue: (song: Song) => void;
    setQueue: (songs: Song[]) => void;
    currentTime: number;
    duration: number;
    seek: (time: number) => void;
    volume: number;
    setVolume: (val: number) => void;
    setPlayer: (player: YouTubePlayer) => void;
    setDuration: (duration: number) => void;
    setCurrentTime: (time: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [queue, setQueue] = useState<Song[]>([]);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolumeState] = useState(0.8);
    const [ytPlayer, setYtPlayer] = useState<YouTubePlayer | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Safe Player Helpers
    const safeYtCall = useCallback((fn: (p: YouTubePlayer) => void) => {
        if (!ytPlayer) return;
        try {
            fn(ytPlayer);
        } catch (e) {
            console.error("YouTube Player Error:", e);
        }
    }, [ytPlayer]);

    const safeAudioCall = useCallback((fn: (a: HTMLAudioElement) => void) => {
        if (!audioRef.current) return;
        try {
            fn(audioRef.current);
        } catch (e) {
            console.error("HTML5 Audio Error:", e);
        }
    }, []);

    // Play Logic
    const resume = useCallback(() => {
        try {
            setIsPlaying(true);
            if (currentSong?.isYouTube) {
                safeYtCall(p => p.playVideo());
            } else {
                safeAudioCall(a => {
                    const promise = a.play();
                    if (promise !== undefined) {
                        promise.catch(error => {
                            console.error("Audio playback failed:", error);
                            setIsPlaying(false);
                        });
                    }
                });
            }
        } catch (err) {
            console.error("Resume Error:", err);
            setIsPlaying(false);
        }
    }, [currentSong, safeYtCall, safeAudioCall]);

    const pause = useCallback(() => {
        try {
            setIsPlaying(false);
            if (currentSong?.isYouTube) {
                safeYtCall(p => p.pauseVideo());
            } else {
                safeAudioCall(a => a.pause());
            }
        } catch (err) {
            console.error("Pause Error:", err);
        }
    }, [currentSong, safeYtCall, safeAudioCall]);

    const play = useCallback((song?: Song) => {
        try {
            if (song) {
                const isNewSong = currentSong?.id !== song.id;

                if (isNewSong) {
                    setCurrentSong(song);
                    setIsPlaying(true);

                    // Analytics
                    if (song.id && song.isYouTube) {
                        console.log("Logging play for:", song.id);
                        fetch('/api/plays', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ videoId: song.id, title: song.title, artist: song.artist })
                        }).catch(err => console.error("Analytics Error:", err));
                    }

                    if (song.isYouTube) {
                        safeAudioCall(a => a.pause());
                    } else if (song.audioUrl) {
                        safeYtCall(p => p.pauseVideo());
                        safeAudioCall(a => {
                            a.src = song.audioUrl!;
                            const promise = a.play();
                            if (promise !== undefined) {
                                promise.catch(error => {
                                    console.error("Audio playback error:", error);
                                    setIsPlaying(false);
                                });
                            }
                        });
                    } else {
                        console.warn("No audio source found for song:", song);
                    }
                } else {
                    console.log("Resuming current song");
                    resume();
                }
            } else {
                console.log("No song provided, resuming");
                resume();
            }
        } catch (err) {
            console.error("CRITICAL Play Error:", err);
            setIsPlaying(false);
        }
    }, [currentSong, safeYtCall, safeAudioCall, resume]);

    const next = useCallback(() => {
        if (!currentSong || queue.length === 0) return;
        const idx = queue.findIndex(s => s.id === currentSong.id);
        if (idx < queue.length - 1) {
            play(queue[idx + 1]);
        }
    }, [currentSong, queue, play]);

    const seek = useCallback((time: number) => {
        try {
            setCurrentTime(time);
            if (currentSong?.isYouTube) {
                safeYtCall(p => p.seekTo(time, true));
            } else {
                safeAudioCall(a => { a.currentTime = time; });
            }
        } catch (err) {
            console.error("Seek Error:", err);
        }
    }, [currentSong, safeYtCall, safeAudioCall]);

    const prev = useCallback(() => {
        if (currentTime > 3) {
            seek(0);
            return;
        }
        if (!currentSong || queue.length === 0) return;
        const idx = queue.findIndex(s => s.id === currentSong.id);
        if (idx > 0) {
            play(queue[idx - 1]);
        }
    }, [currentSong, queue, play, currentTime, seek]);

    // Initialize HTML5 Audio Once
    useEffect(() => {
        audioRef.current = new Audio();

        // Add global error listener
        const handleError = (e: ErrorEvent) => {
            console.error("Audio Element Error:", e);
        };
        audioRef.current.addEventListener('error', handleError as any);

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('error', handleError as any);
                audioRef.current.pause();
                audioRef.current.src = "";
            }
        };
    }, []);

    // Handle Events (Re-attach when currentSong changes to capture closure)
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            if (currentSong && !currentSong.isYouTube) {
                setCurrentTime(audio.currentTime);
            }
        };
        const handleLoadedMetadata = () => {
            if (currentSong && !currentSong.isYouTube) {
                setDuration(audio.duration);
            }
        };
        const handleEnded = () => {
            setIsPlaying(false);
            next();
        };

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [currentSong, next]); // next is now stable due to useCallback

    // Volume Sync
    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume;
        if (ytPlayer) ytPlayer.setVolume(volume * 100);
    }, [volume, ytPlayer]);

    const togglePlay = useCallback(() => {
        if (isPlaying) pause();
        else play();
    }, [isPlaying, pause, play]);


    const setVolume = useCallback((val: number) => {
        setVolumeState(val);
    }, []);

    const setPlayer = useCallback((p: YouTubePlayer) => {
        setYtPlayer(p);
    }, []);

    const addToQueue = useCallback((song: Song) => {
        setQueue(prev => [...prev, song]);
    }, []);

    return (
        <AudioContext.Provider value={{
            currentSong, isPlaying, play, pause, togglePlay,
            next, prev, queue, setQueue, addToQueue,
            currentTime, duration, seek, volume, setVolume,
            setPlayer, setDuration, setCurrentTime
        }}>
            {children}
        </AudioContext.Provider>
    );
}

export function useAudio() {
    const context = useContext(AudioContext);
    if (!context) throw new Error("useAudio must be used within an AudioProvider");
    return context;
}
