
import { NextResponse } from 'next/server';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    if (!YOUTUBE_API_KEY) {
        console.error("YOUTUBE_API_KEY is not set");
        // Return mock data if no key, to prevent app breakage during development if user forgets key
        // BUT for this specific request, I should probably try to return real data or error. 
        // Let's return an error to prompt the user to add the key.
        return NextResponse.json({ error: 'Server configuration error: YOUTUBE_API_KEY missing' }, { status: 500 });
    }

    try {
        const response = await fetch(`${YOUTUBE_API_URL}?part=snippet&type=video&maxResults=5&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`);

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: 'YouTube API Error', details: errorData }, { status: response.status });
        }

        const data = await response.json();

        const results = data.items.map((item: any) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            artist: item.snippet.channelTitle,
            coverUrl: item.snippet.thumbnails.high.url,
            audioUrl: '',
            isYouTube: true
        }));

        return NextResponse.json(results);

    } catch (error) {
        console.error('Search API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
