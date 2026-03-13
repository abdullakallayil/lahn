
import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';

export async function GET() {
    try {
        const musicDir = join(process.cwd(), 'public', 'music');

        // Ensure directory exists (or return empty)
        try {
            await readdir(musicDir);
        } catch {
            return NextResponse.json([]);
        }

        const files = await readdir(musicDir);

        const songs = files
            .filter(file => {
                const lower = file.toLowerCase();
                return lower.endsWith('.mp3') || lower.endsWith('.wav') || lower.endsWith('.ogg') || lower.endsWith('.webm') || lower.endsWith('.m4a');
            })
            .map(file => {
                // Remove timestamp prefix for display title if present
                const nameParts = file.split('-');
                const displayTitle = nameParts.length > 1 ? nameParts.slice(1).join('-') : file;

                return {
                    id: file, // Use filename as ID
                    title: displayTitle,
                    artist: 'Local Upload',
                    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop', // Generic cover
                    audioUrl: `/music/${file}`,
                    isYouTube: false
                };
            });

        return NextResponse.json(songs);
    } catch (error) {
        console.error('Error listing uploads:', error);
        return NextResponse.json({ error: 'Failed to list uploads' }, { status: 500 });
    }
}
