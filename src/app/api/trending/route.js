import YTSearch from 'youtube-search-without-api-key';

export async function GET() {
  try {
    const results = await YTSearch.Search('trending music 2026 top hits');
    const videos = results.slice(0, 15).map(v => ({
      id: v.id.videoId,
      title: v.title,
      artist: v.snippet?.channelTitle || 'Unknown',
      thumbnail: v.thumbnail?.thumbnails?.slice(-1)[0]?.url || `https://i.ytimg.com/vi/${v.id?.videoId}/hqdefault.jpg`,
      duration: '',
      type: 'youtube'
    }));
    
    return new Response(JSON.stringify(videos), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Trending Fetch Error:", error);
    return new Response(JSON.stringify({ error: 'Failed to fetch trending music', details: error.message }), { status: 500 });
  }
}
