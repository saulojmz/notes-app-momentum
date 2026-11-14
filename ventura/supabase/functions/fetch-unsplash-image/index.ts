import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query = 'edinburgh castle scotland', count = 1 } = await req.json();
    const accessKey = Deno.env.get('UNSPLASH_ACCESS_KEY');

    if (!accessKey) {
      throw new Error('UNSPLASH_ACCESS_KEY not configured');
    }

    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&count=${count}`,
      {
        headers: {
          'Authorization': `Client-ID ${accessKey}`,
        },
      }
    );

    // Handle 404 (no images found) gracefully - return empty array
    if (response.status === 404) {
      console.log(`No images found for query: "${query}"`);
      return new Response(
        JSON.stringify({ images: [] }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle both single image and array responses
    const images = Array.isArray(data) ? data : [data];

    return new Response(
      JSON.stringify({
        images: images.map(img => ({
          imageUrl: img.urls.regular,
          imageId: img.id,
          photographer: img.user.name,
          photographerUrl: img.user.links.html,
        }))
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching Unsplash image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
