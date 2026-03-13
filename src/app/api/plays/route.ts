
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { videoId, title, artist } = body;

        if (!videoId) {
            return NextResponse.json({ error: 'Missing videoId' }, { status: 400 });
        }

        // Upsert song and increment plays
        // We use a stored procedure or just manual upsert if atomic increment is needed.
        // For simplicity, we'll try a simple upsert with a separate update or check.
        // Supabase basic upsert doesn't easily do "increment if exists", so we might need a function or logic.

        // Strategy:
        // 1. Try to insert. If conflict (id exists), ignore.
        // 2. Increment.
        // Actually, let's just use what we have.

        // Using a rpc call is best for atomic increment, but let's assume we don't have one set up.
        // We can check if it exists.

        const { data: existing } = await supabase
            .from('songs')
            .select('plays')
            .eq('video_id', videoId)
            .single();

        if (existing) {
            await supabase
                .from('songs')
                .update({
                    plays: existing.plays + 1,
                    last_played_at: new Date().toISOString()
                })
                .eq('video_id', videoId);
        } else {
            await supabase
                .from('songs')
                .insert({
                    video_id: videoId,
                    title,
                    artist,
                    plays: 1,
                    last_played_at: new Date().toISOString()
                });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Plays API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
