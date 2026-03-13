
"use client";

import React, { useEffect, useRef } from 'react';
import YouTube, { YouTubePlayer as YTPlayer } from 'react-youtube';
import { useAudio } from '@/context/AudioContext';

export default function YouTubePlayer() {
    const { currentSong, isPlaying, volume, setDuration, setCurrentTime, setPlayer } = useAudio();
    const playerRef = useRef<YTPlayer | null>(null);

    const opts = {
        height: '0',
        width: '0',
        playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
        },
    };

    const onReady = (event: { target: YTPlayer }) => {
        if (!event.target) return;
        try {
            playerRef.current = event.target;
            setPlayer(event.target);
            if (typeof event.target.setVolume === 'function') {
                event.target.setVolume(volume * 100);
            }
            if (typeof event.target.getDuration === 'function') {
                setDuration(event.target.getDuration());
            }
        } catch (err) {
            console.error("YouTube onReady Error:", err);
        }
    };

    const onStateChange = (event: { data: number, target: YTPlayer }) => {
        const playerState = event.data;
        // YouTube Player States: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)

        if (playerState === 1) { // Playing
            setDuration(event.target.getDuration());
        }
    };

    // Effect to sync play/pause state
    useEffect(() => {
        if (playerRef.current) {
            if (isPlaying) {
                playerRef.current.playVideo();
            } else {
                playerRef.current.pauseVideo();
            }
        }
    }, [isPlaying]);

    // Effect to sync volume
    useEffect(() => {
        if (playerRef.current) {
            playerRef.current.setVolume(volume * 100);
        }
    }, [volume]);

    // Timer to update current time
    useEffect(() => {
        const interval = setInterval(() => {
            if (playerRef.current && isPlaying) {
                const time = playerRef.current.getCurrentTime();
                setCurrentTime(time);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isPlaying, setCurrentTime]);

    if (!currentSong || !currentSong.isYouTube) return null;

    return (
        <div className="hidden">
            <YouTube
                videoId={currentSong.id}
                opts={opts}
                onReady={onReady}
                onStateChange={onStateChange}
                onEnd={() => { /* Handle auto-next here if needed */ }}
            />
        </div>
    );
}
