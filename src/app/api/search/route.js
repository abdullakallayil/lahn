import ytSearch from 'yt-search';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!query) {
    return new Response(JSON.stringify({ error: 'Missing query parameter "q"' }), { status: 400 });
  }

  try {
    const results = await ytSearch(query);
    const videos = results.videos.slice(0, 20).map(v => ({
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
    console.error("Search Error:", error);
    return new Response(JSON.stringify({ error: 'Failed to search YouTube' }), { status: 500 });
  }
}
