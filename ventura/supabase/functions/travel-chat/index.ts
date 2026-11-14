import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper function to fetch image from Unsplash
async function getUnsplashImage(destination: string): Promise<string> {
  const UNSPLASH_ACCESS_KEY = Deno.env.get("UNSPLASH_ACCESS_KEY");
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn("UNSPLASH_ACCESS_KEY not configured, using placeholder");
    return `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop`;
  }

  try {
    const query = encodeURIComponent(`${destination} travel destination`);
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=landscape`,
      {
        headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` }
      }
    );
    
    if (!response.ok) throw new Error("Unsplash API error");
    
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return `${data.results[0].urls.regular}&w=800&h=600&fit=crop`;
    }
  } catch (error) {
    console.error("Error fetching Unsplash image:", error);
  }
  
  return `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, stage = 1 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    console.log(`Processing request for stage ${stage}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: stage === 1 
              ? `You are a friendly, conversational travel assistant helping users plan their perfect trip.

YOUR TASK: Collect these 6 required pieces of information before generating itineraries:

1. **Region/Destination** - Where do they want to go? (Country, region, or specific city)
2. **Trip Type/Vibe** - What's the mood? (Adventurous, calm, romantic, cultural, beach, etc.)
3. **Number of People** - Solo, couple, or group? How many travelers?
4. **Dates** - When are they traveling? (Specific dates, month, or season)
5. **Budget** - What's their spending range per person?
6. **Activities** - What do they want to do? (Hiking, museums, nightlife, relaxing, food tours, etc.)

IMPORTANT RULES:
- **COUNT** how many of the 6 criteria you have collected
- If you have **fewer than 6**, ask for the missing information in a friendly, conversational way
- If you have **all 6 criteria**, call the \`generate_itineraries\` tool IMMEDIATELY and SILENTLY (no text message)
- DO NOT generate until you have all 6 pieces

CONVERSATION STYLE:
- Keep responses warm, brief (1-2 sentences), and encouraging
- Ask for 1-2 missing items at a time (don't overwhelm with a long list)
- If user gives vague info (e.g., "beach vibes" without location), ask clarifying questions
- Make it feel like a natural conversation, not an interrogation

EXAMPLE FLOW:

User: "I want a solo adventure"
You: "Awesome! Where are you thinking of going? Any specific region or country in mind? 🌍"

User: "Maybe Southeast Asia"
You: "Great choice! What's your vibe - are you looking for more adventurous activities, cultural experiences, beach relaxation, or a mix? And when are you planning to go?"

User: "Adventurous stuff, probably in June"
You: "Love it! What's your budget looking like for this trip? And how long are you thinking - a week, two weeks?"

User: "About $2000 for 10 days"
You: "Perfect! Last question - what kind of adventures excite you? Hiking, water sports, wildlife, trekking, exploring cities?"

User: "Hiking and trekking"
[You now have all 6 criteria - call generate_itineraries tool silently]`
              : `You are generating the second set of travel itineraries. You already collected all criteria in the previous conversation. 

CRITICAL: You MUST immediately call the generate_traveler_itineraries tool using the same travel criteria from the previous conversation.
- DO NOT send ANY text message
- DO NOT ask for more information
- Just call the tool silently`
          },
          ...messages,
        ],
        tools: stage === 1 ? [
          {
            type: "function",
            function: {
              name: "generate_itineraries",
              description: "Generate 3 AI-curated travel itinerary options. Call this ONLY when you have confirmed all 6 criteria: (1) region/destination, (2) trip type/vibe, (3) number of people, (4) dates, (5) budget, (6) activities. DO NOT call this if any criteria are missing. IMPORTANT: If the user specified a COUNTRY or REGION (not a specific city), generate itineraries for 3 DIFFERENT cities/locations within that area. If they specified a CITY, keep the same city but vary the activities and vibe for each itinerary.",
              parameters: {
                type: "object",
                properties: {
                  itineraries: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        destination: { type: "string", description: "Destination name - if user specified a country/region, this should be a specific city within it (vary cities across the 3 itineraries). If user specified a city, keep that city name." },
                        summary: { type: "string", description: "Brief 1-2 sentence summary" },
                        description: { type: "string", description: "Detailed description of the experience" },
                        vibe: { type: "string", description: "Trip vibe label like 'Fun Adventure', 'Budget Escape', 'Luxury Retreat', 'Cultural Journey', etc." },
                        days: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              day: { type: "number" },
                              title: { type: "string" },
                              activities: { type: "array", items: { type: "string" } }
                            },
                            required: ["day", "title", "activities"]
                          }
                        },
                        budget: { type: "string", description: "Budget estimate" },
                        housing: { type: "array", items: { type: "string" }, description: "Array of recommended accommodation options (provide at least 2-3, or empty array if none)" },
                        keyActivities: { type: "array", items: { type: "string" }, description: "Array of must-do activities (provide at least 3-5, or empty array if none)" },
                        imageUrl: { type: "string", description: "Image URL for the destination" }
                      },
                      required: ["destination", "summary", "description", "vibe", "days", "budget", "housing", "keyActivities", "imageUrl"]
                    }
                  }
                },
                required: ["itineraries"]
              }
            }
          }
        ] : [
          {
            type: "function",
            function: {
              name: "generate_traveler_itineraries",
              description: "Generate 3 traveler-style itineraries with ratings and reviews. Call this immediately and silently. Match the same destination context from the previous conversation. IMPORTANT: If the user specified a COUNTRY or REGION, ensure these 3 itineraries cover 3 DIFFERENT cities/locations within that area. If they specified a CITY, vary the activities and trip style instead.",
              parameters: {
                type: "object",
                properties: {
                  travelerItineraries: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        destination: { type: "string", description: "Destination name - if user specified a country/region, this should be a specific city within it (vary cities across the 3 itineraries). If user specified a city, keep that city name." },
                        summary: { type: "string", description: "Brief 1-2 sentence summary" },
                        description: { type: "string", description: "Detailed description" },
                        vibe: { type: "string", description: "Trip vibe" },
                        days: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              day: { type: "number" },
                              title: { type: "string" },
                              activities: { type: "array", items: { type: "string" } }
                            },
                            required: ["day", "title", "activities"]
                          }
                        },
                        budget: { type: "string" },
                        housing: { type: "array", items: { type: "string" }, description: "Array of recommended accommodation options (provide at least 2-3, or empty array if none)" },
                        keyActivities: { type: "array", items: { type: "string" }, description: "Array of must-do activities (provide at least 3-5, or empty array if none)" },
                        imageUrl: { type: "string", description: "Image URL" },
                        rating: { type: "number", description: "Rating between 4.0-5.0" },
                        reviewCount: { type: "number", description: "Number of reviews (50-500)" },
                        authorName: { type: "string", description: "Fictional traveler name" },
                        reviewSnippet: { type: "string", description: "Short review quote (1-2 sentences)" }
                      },
                      required: ["destination", "summary", "description", "vibe", "days", "budget", "housing", "keyActivities", "imageUrl", "rating", "reviewCount", "authorName", "reviewSnippet"]
                    }
                  }
                },
                required: ["travelerItineraries"]
              }
            }
          }
        ],
        tool_choice: stage === 1 
          ? "auto"  // Let Gemini decide when to call the tool based on collected info
          : { type: "function", function: { name: "generate_traveler_itineraries" } },  // Force Stage 2 to always generate
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Stream and intercept tool calls to inject real image URLs
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        if (!reader) return controller.close();

        let buffer = "";
        let toolCallBuffer: Record<string, any> = {};

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (!line.trim() || line.trim() === "data: [DONE]") {
                controller.enqueue(encoder.encode(line + "\n"));
                continue;
              }

              if (line.startsWith("data: ")) {
                try {
                  const jsonStr = line.slice(6);
                  const chunk = JSON.parse(jsonStr);
                  
                  // Check for error chunks
                  if (chunk.error) {
                    console.error("AI gateway error chunk:", chunk.error);
                    const errorMessage = chunk.error.code === 502 
                      ? "⚠️ The AI service is overloaded. Please try again in a moment."
                      : "⚠️ Sorry, I encountered an issue. Please try again.";
                    
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                      choices: [{
                        delta: { content: errorMessage },
                        finish_reason: null
                      }]
                    })}\n`));
                    continue;
                  }
                  
                  // Track tool calls as they stream in
                  if (chunk.choices?.[0]?.delta?.tool_calls) {
                    for (const toolCall of chunk.choices[0].delta.tool_calls) {
                      const index = toolCall.index;
                      if (!toolCallBuffer[index]) {
                        toolCallBuffer[index] = {
                          id: toolCall.id || "",
                          type: toolCall.type || "function",
                          function: {
                            name: toolCall.function?.name || "",
                            arguments: ""
                          }
                        };
                      }
                      if (toolCall.function?.arguments) {
                        toolCallBuffer[index].function.arguments += toolCall.function.arguments;
                      }
                      if (toolCall.function?.name) {
                        toolCallBuffer[index].function.name = toolCall.function.name;
                      }
                    }
                  }

                  // When finish_reason is tool_calls, process and inject images
                  if (chunk.choices?.[0]?.finish_reason === "tool_calls") {
                    console.log("Tool call complete, processing images...");
                    
                    for (const [index, toolCall] of Object.entries(toolCallBuffer)) {
                      if (toolCall.function.arguments) {
                        try {
                          const args = JSON.parse(toolCall.function.arguments);
                          console.log(`Processing ${toolCall.function.name}`);
                          
                          // Handle both generate_itineraries and generate_traveler_itineraries
                          const itinerariesKey = toolCall.function.name === "generate_traveler_itineraries" 
                            ? "travelerItineraries" 
                            : "itineraries";
                          
                          if (args[itinerariesKey]) {
                            const itineraries = args[itinerariesKey];
                            
                            // Fetch all images in parallel for better performance
                            const imagePromises = itineraries.map((itinerary: any) => 
                              getUnsplashImage(itinerary.destination)
                            );
                            const imageUrls = await Promise.all(imagePromises);
                            
                            // Assign results and ensure array fields are never undefined
                            itineraries.forEach((itinerary: any, i: number) => {
                              itinerary.imageUrl = imageUrls[i];
                              itinerary.keyActivities = itinerary.keyActivities || [];
                              itinerary.housing = itinerary.housing || [];
                              itinerary.days = itinerary.days || [];
                            });
                            
                            // Update the arguments with real image URLs
                            args[itinerariesKey] = itineraries;
                            toolCall.function.arguments = JSON.stringify(args);
                          }
                        } catch (e) {
                          console.error("Error processing tool call:", e);
                        }
                      }
                    }

                    // Inject the modified tool calls into the chunk
                    if (Object.keys(toolCallBuffer).length > 0) {
                      chunk.choices[0].delta.tool_calls = Object.values(toolCallBuffer);
                    }
                  }

                  controller.enqueue(encoder.encode("data: " + JSON.stringify(chunk) + "\n"));
                } catch (e) {
                  console.error("Error parsing SSE chunk:", e);
                  controller.enqueue(encoder.encode(line + "\n"));
                }
              } else {
                controller.enqueue(encoder.encode(line + "\n"));
              }
            }
          }

          if (buffer.trim()) {
            controller.enqueue(encoder.encode(buffer + "\n"));
          }
        } catch (e) {
          console.error("Stream error:", e);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
