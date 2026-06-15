// ============================================================
//  GreenTrail India — AI Planner Page (Backend-powered)
//  Gemini calls go through backend proxy. Itineraries saved to MongoDB.
// ============================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, MapPin, Calendar, Clock, Leaf, ChevronDown, ChevronUp, ArrowRight, CheckCircle2, AlertCircle, Backpack, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { DESTINATIONS } from "@/lib/api";
import { generateLocalItinerary, type GeneratedItinerary, type ItineraryParams } from "@/lib/geminiApi";
import { generateItineraryViaProxy, saveItinerary } from "@/lib/backendApi";
import { useAuth } from "@/context/AuthContext";

const MOODS = ["Quiet Reflection","Raw Adventure","Cultural Immersion","Spiritual Restoration","Wildlife Encounter","Culinary Journey"];
const DURATIONS = [3,5,7,10,14];
const BUDGETS = [
  { id:"budget",  label:"Budget",  desc:"₹3k–6k/day",  icon:"🎒" },
  { id:"comfort", label:"Comfort", desc:"₹6k–15k/day", icon:"🌿" },
  { id:"luxury",  label:"Luxury",  desc:"₹15k+/day",   icon:"✨" },
];
const GROUP_TYPES = ["Solo","Couple","Family","Friends Group"];
const INTERESTS = ["Trekking","Wildlife","Culture","Photography","Food","Spiritual","Art & Craft","Birdwatching","Yoga","River Rafting","Camping","History"];
const ALL_REGIONS = [...new Set(DESTINATIONS.map(d => d.state))].sort();

function Chip({ label, active, onClick }: { label:string; active:boolean; onClick:()=>void }) {
  return (
    <button onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
        active ? "bg-primary text-white border-primary shadow-sm" : "bg-white/60 text-on-surface border-border/50 hover:border-primary/40 hover:bg-primary/5"
      }`}>
      {label}
    </button>
  );
}

export default function AIPlannerPage() {
  const { toast } = useToast();
  const { firebaseUser, backendUser } = useAuth();

  const [mood, setMood]           = useState(MOODS[0]);
  const [duration, setDuration]   = useState(5);
  const [selectedDests, setSelectedDests] = useState<string[]>([]);
  const [budget, setBudget]       = useState("comfort");
  const [groupType, setGroupType] = useState("Couple");
  const [interests, setInterests] = useState<string[]>(["Trekking","Culture"]);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [usedBackend, setUsedBackend] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number|null>(1);

  const toggleDest = (d:string) => setSelectedDests(p =>
    p.includes(d) ? p.filter(x=>x!==d) : p.length < 3 ? [...p,d] : (toast({title:"Max 3 regions",variant:"destructive"}),p)
  );
  const toggleInterest = (i:string) => setInterests(p => p.includes(i)?p.filter(x=>x!==i):[...p,i]);

  // ── Build Gemini prompt ─────────────────────────────────────
  const buildPrompt = (params: ItineraryParams) => {
    const budgetMap: Record<string, string> = {
      budget: "₹3,000–6,000/day",
      comfort: "₹6,000–15,000/day",
      luxury: "₹15,000+/day",
    };
    return `You are GreenTrail India's expert eco-travel planner. Create a detailed, authentic travel itinerary for India.

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
      "activities": ["activity 1", "activity 2", "activity 3", "activity 4"],
      "accommodation": "specific eco-stay recommendation",
      "meals": "specific local food recommendation",
      "ecoTip": "practical eco-tip for this day",
      "weatherNote": "what to expect weather-wise"
    }
  ],
  "packingEssentials": ["item 1", "item 2", "item 3", "item 4", "item 5"],
  "ecoCommitments": ["commitment 1", "commitment 2", "commitment 3"]
}`;
  };

  const handleGenerate = async () => {
    if (!selectedDests.length) { toast({title:"Select at least one region",variant:"destructive"}); return; }
    setGenerating(true); setItinerary(null);
    const params: ItineraryParams = { mood, duration, destinations: selectedDests, budget, groupType, interests };

    // Try backend proxy first (if user is logged in), fall back to local
    if (firebaseUser) {
      try {
        const prompt = buildPrompt(params);
        const res = await generateItineraryViaProxy(prompt);
        const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
          const parsed = JSON.parse(cleaned) as GeneratedItinerary;
          setItinerary(parsed);
          setUsedBackend(true);
          setGenerating(false);
          return;
        }
      } catch (err) {
        console.warn("Backend proxy failed, falling back to local:", err);
      }
    }

    // Fallback: local mock itinerary
    try {
      const localResult = generateLocalItinerary(params);
      setItinerary(localResult);
      setUsedBackend(false);
    } catch {
      toast({ title: "Generation failed", description: "Please try again.", variant: "destructive" });
    }
    setGenerating(false);
  };

  // ── Save itinerary to MongoDB ───────────────────────────────
  const handleSave = async () => {
    if (!itinerary) return;
    if (!backendUser) {
      toast({ title: "Sign in to save itineraries", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await saveItinerary({
        title: itinerary.title,
        destination: itinerary.destinations[0],
        duration: itinerary.duration,
        dayPlans: itinerary.days,
        highlights: itinerary.highlights,
        ecoScore: parseFloat(itinerary.ecoScore),
        sustainabilityTips: itinerary.ecoCommitments,
        packingList: itinerary.packingEssentials,
        summary: itinerary.summary,
        budget: { currency: "INR" },
        travelStyle: [mood],
      });
      toast({ title: "Itinerary saved!", description: "View it in your profile." });
    } catch {
      toast({ title: "Failed to save", description: "Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  // ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-surface pb-24 md:pb-8">
      {/* Hero */}
      <section className="relative pt-28 pb-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80" alt="Mountains" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-surface" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <Badge variant="outline" className="border-white/30 text-white/80 backdrop-blur-sm mb-6 text-xs px-3 py-1">
            <Sparkles className="w-3 h-3 mr-1" /> AI-Powered Planning
          </Badge>
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-4 leading-tight">
            Plan Your<br />Perfect Eco-Journey
          </h1>
          <p className="text-white/80 text-lg max-w-lg mx-auto">
            Tell us your travel dream. Our AI crafts a personalised, sustainable Indian adventure — day by day.
          </p>
        </div>
      </section>

      {/* Planner Form */}
      <section className="max-w-3xl mx-auto px-4 -mt-8 relative z-10 space-y-8">

        {/* Mood */}
        <div className="glass rounded-[28px] p-6">
          <h2 className="font-serif text-xl text-primary mb-4">What's your travel mood?</h2>
          <div className="flex flex-wrap gap-2">
            {MOODS.map(m => <Chip key={m} label={m} active={mood===m} onClick={()=>setMood(m)} />)}
          </div>
        </div>

        {/* Duration */}
        <div className="glass rounded-[28px] p-6">
          <h2 className="font-serif text-xl text-primary mb-4">How many days?</h2>
          <div className="flex flex-wrap gap-2">
            {DURATIONS.map(d => (
              <Chip key={d} label={`${d} days`} active={duration===d} onClick={()=>setDuration(d)} />
            ))}
          </div>
        </div>

        {/* Destinations */}
        <div className="glass rounded-[28px] p-6">
          <h2 className="font-serif text-xl text-primary mb-1">Which regions? <span className="text-sm font-normal text-muted-foreground">(pick up to 3)</span></h2>
          <div className="flex flex-wrap gap-2 mt-4">
            {ALL_REGIONS.map(r => <Chip key={r} label={r} active={selectedDests.includes(r)} onClick={()=>toggleDest(r)} />)}
          </div>
        </div>

        {/* Budget */}
        <div className="glass rounded-[28px] p-6">
          <h2 className="font-serif text-xl text-primary mb-4">Budget style?</h2>
          <div className="grid grid-cols-3 gap-3">
            {BUDGETS.map(b => (
              <button key={b.id} onClick={()=>setBudget(b.id)}
                className={`rounded-2xl p-4 text-center border-2 transition-all ${budget===b.id ? "border-primary bg-primary/5" : "border-border bg-white/60 hover:border-primary/30"}`}>
                <div className="text-2xl mb-1">{b.icon}</div>
                <div className="font-semibold text-sm">{b.label}</div>
                <div className="text-xs text-muted-foreground">{b.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Group */}
        <div className="glass rounded-[28px] p-6">
          <h2 className="font-serif text-xl text-primary mb-4">Traveling as?</h2>
          <div className="flex flex-wrap gap-2">
            {GROUP_TYPES.map(g => <Chip key={g} label={g} active={groupType===g} onClick={()=>setGroupType(g)} />)}
          </div>
        </div>

        {/* Interests */}
        <div className="glass rounded-[28px] p-6">
          <h2 className="font-serif text-xl text-primary mb-4">Your interests</h2>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map(i => <Chip key={i} label={i} active={interests.includes(i)} onClick={()=>toggleInterest(i)} />)}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full h-14 rounded-2xl text-lg font-semibold bg-primary hover:bg-primary/90 text-white shadow-xl"
        >
          {generating ? (
            <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Crafting your journey...</>
          ) : (
            <><Sparkles className="w-5 h-5 mr-2" /> Generate My Itinerary</>
          )}
        </Button>

        {/* Result */}
        <AnimatePresence>
          {itinerary && (
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="space-y-6">

              {/* Source badge */}
              <div className={`flex items-center gap-2 text-sm px-4 py-2 rounded-full w-fit ${usedBackend ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {usedBackend ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {usedBackend ? "Generated by Gemini AI (via secure backend)" : "Preview mode — add Gemini key for real AI"}
              </div>

              {/* Header card */}
              <div className="glass rounded-[28px] p-8">
                <h2 className="text-3xl font-serif text-primary mb-2">{itinerary.title}</h2>
                <p className="text-muted-foreground italic mb-4">{itinerary.subtitle}</p>
                <p className="text-foreground/80 mb-6">{itinerary.summary}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon:<MapPin className="w-4 h-4"/>, label:"Destinations", value:itinerary.destinations.join(", ") },
                    { icon:<Calendar className="w-4 h-4"/>, label:"Duration", value:`${itinerary.duration} days` },
                    { icon:<Clock className="w-4 h-4"/>, label:"Best Time", value:itinerary.bestTime },
                    { icon:<Leaf className="w-4 h-4"/>, label:"Eco Score", value:itinerary.ecoScore },
                  ].map(s => (
                    <div key={s.label} className="bg-primary/5 rounded-xl p-3">
                      <div className="flex items-center gap-1 text-primary mb-1">{s.icon}<span className="text-xs font-medium">{s.label}</span></div>
                      <p className="text-sm font-semibold text-foreground">{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="mt-6 flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {backendUser ? "Save to My Journeys" : "Sign in to Save"}
                </button>
              </div>

              {/* Day Plans */}
              <div className="space-y-3">
                {itinerary.days.map(day => (
                  <div key={day.day} className="glass rounded-[24px] overflow-hidden">
                    <button
                      onClick={() => setExpandedDay(expandedDay===day.day ? null : day.day)}
                      className="w-full flex items-center justify-between p-6 text-left"
                    >
                      <div>
                        <span className="text-xs font-semibold text-primary uppercase tracking-wide">Day {day.day}</span>
                        <h3 className="text-lg font-serif text-foreground">{day.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{day.location}</p>
                      </div>
                      {expandedDay===day.day ? <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
                    </button>
                    {expandedDay===day.day && (
                      <div className="px-6 pb-6 space-y-4 border-t border-border/30">
                        <p className="text-sm text-foreground/80 pt-4">{day.description}</p>
                        <div>
                          <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">Activities</p>
                          <ul className="space-y-1">
                            {day.activities.map((a,i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <ArrowRight className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />{a}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="bg-primary/5 rounded-xl p-3">
                            <p className="text-xs font-semibold text-primary mb-1">🍽 Meals</p>
                            <p className="text-foreground/80">{day.meals}</p>
                          </div>
                          <div className="bg-primary/5 rounded-xl p-3">
                            <p className="text-xs font-semibold text-primary mb-1">🏡 Stay</p>
                            <p className="text-foreground/80">{day.accommodation}</p>
                          </div>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                          <p className="text-xs font-semibold text-green-700 mb-1">🌿 Eco Tip</p>
                          <p className="text-sm text-green-800">{day.ecoTip}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Packing */}
              <div className="glass rounded-[28px] p-6">
                <h3 className="font-serif text-xl text-primary mb-4 flex items-center gap-2"><Backpack className="w-5 h-5" /> Packing Essentials</h3>
                <div className="flex flex-wrap gap-2">
                  {itinerary.packingEssentials.map((item,i) => (
                    <span key={i} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">{item}</span>
                  ))}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
