import YTSearch from 'youtube-search-without-api-key';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!query) {
    return new Response(JSON.stringify({ error: 'Missing query parameter "q"' }), { status: 400 });
  }

  try {
    const results = await YTSearch.Search(query);
    const videos = results.slice(0, 20).map(v => ({
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
    console.error("Search Error:", error);
    return new Response(JSON.stringify({ error: 'Failed to search YouTube', details: error.message }), { status: 500 });
  }
}
