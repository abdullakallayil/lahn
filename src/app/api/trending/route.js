import ytSearch from 'yt-search';

export async function GET() {
  try {
    // Searching for 'trending songs 2026' or 'top hits' to simulate a trending list
    const results = await ytSearch('trending songs 2026');
    const videos = results.videos.slice(0, 15).map(v => ({
      id: v.videoId,
      title: v.title,
      artist: v.author.name,
      thumbnail: v.thumbnail,
      duration: v.timestamp,
      type: 'youtube'
    }));
    
    return new Response(JSON.stringify(videos), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Trending Fetch Error:", error);
    return new Response(JSON.stringify({ error: 'Failed to fetch trending music' }), { status: 500 });
  }
}
