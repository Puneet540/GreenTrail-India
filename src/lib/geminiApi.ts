// ============================================================
//  Gemini AI API Integration
//  Model: gemini-1.5-flash (free tier: 15 req/min, 1M tokens/day)
//  Docs: https://ai.google.dev/gemini-api/docs
// ============================================================

import CONFIG from "./config";

export type ItineraryParams = {
  mood: string;
  duration: number;
  destinations: string[];
  budget: string;
  groupType: string;
  interests: string[];
};

export type ItineraryDay = {
  day: number;
  title: string;
  location: string;
  description: string;
  activities: string[];
  accommodation: string;
  meals: string;
  ecoTip: string;
  weatherNote?: string;
};

export type GeneratedItinerary = {
  title: string;
  subtitle: string;
  summary: string;
  duration: number;
  destinations: string[];
  estimatedBudget: string;
  budgetPerDay: string;
  bestTime: string;
  ecoScore: string;
  highlights: string[];
  days: ItineraryDay[];
  packingEssentials: string[];
  ecoCommitments: string[];
};

// ── Generate itinerary with Gemini ────────────────────────────
export async function generateGeminiItinerary(params: ItineraryParams): Promise<GeneratedItinerary> {
  if (!CONFIG.isGeminiEnabled()) {
    throw new Error("GEMINI_NOT_CONFIGURED");
  }

  const budgetMap: Record<string, string> = {
    budget: "₹3,000–6,000/day (budget stays, local transport, dhabas)",
    comfort: "₹6,000–15,000/day (eco-boutique stays, hired cab, good restaurants)",
    luxury: "₹15,000+/day (premium eco-resorts, private transfers, curated dining)",
  };

  const prompt = `You are GreenTrail India's expert eco-travel planner. Create a detailed, authentic travel itinerary for India.

TRAVELER PROFILE:
- Mood: ${params.mood}
- Duration: ${params.duration} days
- Region(s): ${params.destinations.join(", ")}
- Budget: ${budgetMap[params.budget] || params.budget}
- Traveling as: ${params.groupType}
- Interests: ${params.interests.join(", ")}

REQUIREMENTS:
- Focus on sustainable, eco-conscious travel
- Include specific real place names, trails, and local experiences
- Avoid tourist traps; recommend hidden gems and local businesses
- Each day must feel distinct and authentic
- Include local food recommendations
- Add practical eco-tips for each day
- Be specific to ${params.destinations[0]} geography and culture

Respond ONLY with valid JSON matching this exact schema (no markdown, no backticks):
{
  "title": "evocative 5-word title",
  "subtitle": "poetic one-line subtitle",
  "summary": "2-sentence journey description",
  "duration": ${params.duration},
  "destinations": ${JSON.stringify(params.destinations)},
  "estimatedBudget": "total estimated cost for entire trip",
  "budgetPerDay": "cost per day",
  "bestTime": "best months to visit",
  "ecoScore": "4.X / 5",
  "highlights": ["highlight 1", "highlight 2", "highlight 3"],
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "location": "specific village/town name",
      "description": "2-sentence day narrative",
      "activities": ["specific activity 1", "specific activity 2", "specific activity 3", "specific activity 4"],
      "accommodation": "specific eco-stay recommendation",
      "meals": "specific local food recommendation",
      "ecoTip": "practical eco-tip for this day",
      "weatherNote": "what to expect weather-wise"
    }
  ],
  "packingEssentials": ["item 1", "item 2", "item 3", "item 4", "item 5"],
  "ecoCommitments": ["commitment 1", "commitment 2", "commitment 3"]
}`;

  const url = `${CONFIG.GEMINI_ENDPOINT}/${CONFIG.GEMINI_MODEL}:generateContent?key=${CONFIG.GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
        topP: 0.9,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT",        threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH",       threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errText}`);
  }

  const json = await response.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) throw new Error("Empty response from Gemini");

  // Clean up any accidental markdown fences
  const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned) as GeneratedItinerary;
}

// ── Fallback local itinerary (when no API key) ────────────────
export function generateLocalItinerary(params: ItineraryParams): GeneratedItinerary {
  const dest = params.destinations[0] || "Himachal Pradesh";
  const budgetMap: Record<string, string> = {
    budget: `₹${(3500 * params.duration).toLocaleString()}`,
    comfort: `₹${(10000 * params.duration).toLocaleString()}`,
    luxury: `₹${(22000 * params.duration).toLocaleString()}`,
  };
  const perDayMap: Record<string, string> = {
    budget: "₹3,000–5,000", comfort: "₹8,000–12,000", luxury: "₹18,000–25,000",
  };

  const dayTemplates: ItineraryDay[] = [
    { day:1, title:"Arrival & Acclimatise", location:dest, description:"Settle into the rhythm of your destination. Let the mountain air or coastal breeze replace the city hum.", activities:["Check into your eco-retreat and meet your hosts","Evening trail walk through the surrounding landscape","Farm-to-table welcome dinner with local produce","Stargazing session if skies are clear"], accommodation:`Curated eco-homestay in ${dest}`, meals:"Traditional thali with locally grown vegetables", ecoTip:"Carry a reusable water bottle — most mountain regions have clean spring water you can refill for free.", weatherNote:`Expect ${dest.includes("Ladakh") || dest.includes("Himachal") ? "crisp mountain air, 10–20°C" : "pleasant temperatures, 22–30°C"}` },
    { day:2, title:"Deep Nature Immersion", location:`${dest} forest trails`, description:"Rise with the birds and spend the day in deep communion with the surrounding wilderness.", activities:["Dawn bird-watching walk (5:30am) with local naturalist","3-hour guided forest trek on unmarked trails","River or stream-side picnic lunch with packed local food","Photography golden hour from a high viewpoint"], accommodation:"Same eco-retreat", meals:"Packed local snacks: paratha, pickle, seasonal fruit", ecoTip:"Stay on marked trails. Every off-trail footstep disturbs root systems that took decades to form.", weatherNote:"Best visibility in the morning. Afternoon mist is possible." },
    { day:3, title:"Culture & Village Life", location:`Local village near ${dest}`, description:"Connect with the people who have kept these landscapes alive for generations.", activities:["Morning walk to a traditional village to meet local artisans","Cooking class with a local family — learn regional recipes","Visit to a heritage temple, monastery, or sacred site","Evening bonfire with local folk music"], accommodation:"Village guesthouse or heritage homestay", meals:"Home-cooked regional meal with the host family", ecoTip:"Buy handicrafts directly from artisans. It keeps money in the community and avoids exploitative middlemen." },
    { day:4, title:"Summit & Wild Day", location:"High altitude trail", description:"Push your limits on a full-day trek to a viewpoint that earns its reward.", activities:[`Full-day trek to ${params.interests.includes("Trekking") ? "a local summit or high ridge" : "a hidden waterfall or valley"}`,`Picnic at the top among ${dest.includes("Ladakh") ? "Himalayan steppe" : "wildflowers and meadows"}`,`Photography session at golden hour`,`Campfire dinner under open sky`], accommodation:"Camp or forest guesthouse", meals:"High-energy trail lunch: nuts, dates, local granola bars", ecoTip:"Carry all waste back down from the mountain. Plastic left at altitude can take 400+ years to degrade.", weatherNote:"Start early — weather shifts at high altitude after noon." },
    { day:5, title:"Slow Morning & Local Market", location:`${dest} market`, description:"Let this day breathe. No agenda. Just the pleasure of being in a beautiful place.", activities:["Slow morning yoga or meditation overlooking the landscape","Browse the local weekly market for handmade crafts","Conversation with elders — oral history of the region","Afternoon hammock or riverside journaling"], accommodation:"Last night at eco-retreat", meals:"Street food trail through the local market", ecoTip:"Practice mindful shopping — one meaningful locally-made purchase supports more than ten tourist trinkets." },
    { day:6, title:"Ecological Walk & Conservation", location:"Protected zone or reserve", description:"Go deeper into the ecological story of this region with a conservation-focused guide.", activities:["Morning nature walk with a conservation expert","Visit to a community forest or wildlife corridor","Learn about local conservation challenges and successes","Afternoon at a social enterprise or sustainable farm"], accommodation:"Eco-lodge near the reserve", meals:"Organic meal at a sustainable community kitchen", ecoTip:"Ask your guide what you can do to support local conservation efforts. Many have specific needs." },
    { day:7, title:"Gentle Farewell", location:dest, description:"Leave slowly. The wild gives more to those who depart without haste.", activities:["Final sunrise walk on your favourite trail from the week","Visit a local cooperative to buy ethically produced souvenirs","Slow farewell lunch with your hosts","Depart — carry the silence inside you"], accommodation:"N/A (check-out day)", meals:"Final breakfast made by your homestay host", ecoTip:"Leave a review for your eco-stay. Visibility is the most valuable support for small sustainable businesses." },
    { day:8, title:"Hidden Waterfall Day", location:"Unmarked trail", description:"A day for the truly curious — following a path that doesn't appear on any map.", activities:["Local guide-led trek to a hidden waterfall","Swimming in natural pools (seasonal)","Documentation walk — sketching or photographing endemic plants","Return by a different trail"], accommodation:"Trail camp or nearby village stay", meals:"Foraged and cooked with guide's permission and knowledge", ecoTip:"Only enter swimming holes if your guide confirms it's safe and low-impact." },
    { day:9, title:"Spiritual & Sacred Sites", location:"Sacred landscape", description:"Honour the spiritual geography of the land — ancient temples, sacred groves, pilgrimage routes.", activities:["Dawn visit to a local temple or sacred site","Silent walk along a pilgrimage route","Interaction with a local spiritual practitioner","Meditative journaling at sunset"], accommodation:"Ashram guesthouse or eco-lodge", meals:"Simple sattvic meal (no onion/garlic) as per local tradition", ecoTip:"Remove shoes, speak softly, ask before photographing. Sacred spaces demand presence, not performance." },
    { day:10, title:"Arrival at Second Destination", location:params.destinations[1] || dest, description:"The journey shifts. A new landscape, a new rhythm.", activities:["Scenic travel to next destination","Orientation walk on arrival","Early dinner and rest","Planning the days ahead with local knowledge"], accommodation:"New eco-retreat in next destination", meals:"Local specialty of the new region", ecoTip:"Learn 5 words in the local dialect. It transforms how locals receive you." },
    { day:11, title:"Adventure & Elevation", location:"High point", description:"Peak day. Summit or vista point that defines the entire journey.", activities:["Pre-dawn start for the main trek or excursion","Reward viewpoint with 360-degree Himalayan/coastal panorama","Long lunch at altitude","Slow descent with time for wildflower identification"], accommodation:"Mountain lodge", meals:"Energy-dense mountain food: tsampa, local bread, dried fruit", ecoTip:"Acclimatise properly. One sick day at altitude wastes more of the journey than any extra rest day." },
    { day:12, title:"Community Day", location:"Local NGO or social enterprise", description:"Give something back before your journey ends.", activities:["Morning volunteering with a local conservation or education NGO","Community lunch made together","Learning a local craft — pottery, weaving, natural dyeing","Farewell walk through the landscape"], accommodation:"Volunteer guesthouse", meals:"Community meal — cooked and eaten together", ecoTip:"Volunteer meaningfully, not performatively. Ask what is actually needed, not what you want to do." },
    { day:13, title:"Slow River or Beach Day", location:"Waterway", description:"Water always brings perspective. A day of total presence beside moving water.", activities:["Morning kayak or boat ride","Riverside/beachside journaling and sketching","Swimming, reading, doing nothing — all equally valid","Sunset on the water"], accommodation:"Riverside or beachside eco-cabin", meals:"Fresh seafood or river fish cooked on site", ecoTip:"Don't use sunscreen in natural water bodies. It destroys aquatic ecosystems." },
    { day:14, title:"Last Day of the Wild", location:dest, description:"The final day is not for closing — it's for opening. Carry it forward.", activities:["One last long walk without a destination","Letter-writing to yourself — what has this journey taught?","Farewell ceremony if your host offers one","Departure with gratitude and clarity"], accommodation:"N/A (departure day)", meals:"Host-prepared farewell breakfast", ecoTip:"Your best souvenir is the stories you share. Tell people about these places responsibly — oversharing can destroy what you love." },
  ];

  const days = dayTemplates.slice(0, Math.min(params.duration, dayTemplates.length));

  return {
    title: `${params.duration} Days of ${params.mood} in ${dest}`,
    subtitle: `A ${params.groupType.toLowerCase()} journey into the heart of ${dest}`,
    summary: `A hand-crafted ${params.duration}-day journey through ${dest}, designed for ${params.groupType.toLowerCase()} travelers seeking ${params.mood.toLowerCase()}. Each day is shaped around your passion for ${params.interests.slice(0, 2).join(" and ")}.`,
    duration: params.duration,
    destinations: params.destinations,
    estimatedBudget: budgetMap[params.budget] || `₹${(10000 * params.duration).toLocaleString()}`,
    budgetPerDay: perDayMap[params.budget] || "₹8,000–12,000",
    bestTime: "October – June (avoid peak summer in plains)",
    ecoScore: "4.7 / 5",
    highlights: [`Authentic ${dest} countryside experience`, "Zero-waste eco-certified stays", "Local community immersion"],
    days,
    packingEssentials: ["Reusable water bottle + filter straw", "Lightweight merino wool layers", "Solid shampoo & soap bars (eco-friendly)", "Trekking poles (rentable locally)", "Offline maps downloaded (Maps.me or AllTrails)"],
    ecoCommitments: ["Support only eco-certified stays", "Buy local, avoid imported goods", "Leave no trace on every trail"],
  };
}
