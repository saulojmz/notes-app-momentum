const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GenerateRequest {
  destination: string;
  duration: number;
  category?: string;
  template: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { destination, duration, category, template }: GenerateRequest = await req.json();

    const prompt = `Generate a detailed ${duration}-day travel itinerary for ${destination}.
Template style: ${template}
${category ? `Focus category: ${category}` : ""}

Create a realistic, actionable itinerary with:
- Compelling title (under 60 characters)
- Brief description (under 150 characters)
- Day-by-day breakdown with ${duration} days
- For each day: 3-5 stops with specific timing (e.g., "09:00"), duration, name, description, category (Culture/Food/Nature/History/Shopping/Nightlife), and practical tips
- Include realistic coordinates for each stop
- Mix of must-see landmarks, local experiences, and practical logistics

Return ONLY valid JSON in this exact structure (no markdown, no explanation):
{
  "title": "string",
  "description": "string",
  "category": "Culture|Food|Nature|History|Shopping|Nightlife",
  "tags": ["string", "string", "string"],
  "days": [
    {
      "dayNumber": 1,
      "title": "string",
      "stops": [
        {
          "id": "stop-1",
          "name": "string",
          "time": "HH:MM",
          "duration": "X hours",
          "description": "string",
          "category": "Culture|Food|Nature|History|Shopping|Nightlife",
          "coordinates": { "lat": number, "lng": number },
          "tips": "string"
        }
      ]
    }
  ]
}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://lovable.dev",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp:free",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content generated");
    }

    // Parse AI response
    const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const itineraryData = JSON.parse(cleanContent);

    return new Response(JSON.stringify(itineraryData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating itinerary:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
