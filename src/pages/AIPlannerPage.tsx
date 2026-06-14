import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, MapPin, Calendar, Clock, Leaf, ChevronDown, ChevronUp, ArrowRight, CheckCircle2, AlertCircle, Backpack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { DESTINATIONS } from "@/lib/api";
import { generateGeminiItinerary, generateLocalItinerary, type GeneratedItinerary } from "@/lib/geminiApi";
import CONFIG from "@/lib/config";

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
  const [mood, setMood]           = useState(MOODS[0]);
  const [duration, setDuration]   = useState(5);
  const [selectedDests, setSelectedDests] = useState<string[]>([]);
  const [budget, setBudget]       = useState("comfort");
  const [groupType, setGroupType] = useState("Couple");
  const [interests, setInterests] = useState<string[]>(["Trekking","Culture"]);
  const [generating, setGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [usedGemini, setUsedGemini] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number|null>(1);

  const geminiReady = CONFIG.isGeminiEnabled();

  const toggleDest = (d:string) => setSelectedDests(p =>
    p.includes(d) ? p.filter(x=>x!==d) : p.length < 3 ? [...p,d] : (toast({title:"Max 3 regions",variant:"destructive"}),p)
  );
  const toggleInterest = (i:string) => setInterests(p => p.includes(i)?p.filter(x=>x!==i):[...p,i]);

  const handleGenerate = async () => {
    if (!selectedDests.length) { toast({title:"Select at least one region",variant:"destructive"}); return; }
    setGenerating(true); setItinerary(null);
    const params = { mood, duration, destinations: selectedDests, budget, groupType, interests };
    for (let i = 0; i < 2; i++) {
    try {
      if (geminiReady) {
        const result = await generateGeminiItinerary(params);
        setItinerary(result); setUsedGemini(true);
      } else {
        await new Promise(r => setTimeout(r, 1500));
        setItinerary(generateLocalItinerary(params)); setUsedGemini(false);
      }
    } catch (err) {
      toast({ title:"Gemini error", description: "Falling back to local generation", variant:"destructive" });
      await new Promise(r => setTimeout(r, 800));
      setItinerary(generateLocalItinerary(params)); setUsedGemini(false);
    }
  
    setGenerating(false);
    setTimeout(() => document.getElementById("itinerary-result")?.scrollIntoView({behavior:"smooth"}), 100);}
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80" alt="Mountains" className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-background"/>
        <div className="relative z-10 text-center pt-20 px-4">
          <Badge className="bg-white/20 text-white border-none backdrop-blur-md mb-4 text-xs uppercase tracking-widest px-4 py-1.5">
            <Sparkles className="w-3 h-3 mr-1"/> {geminiReady ? "Powered by Gemini AI" : "AI Journey Designer"}
          </Badge>
          <h1 className="font-serif text-4xl md:text-6xl text-white drop-shadow-lg mb-3">Design Your Journey</h1>
          <p className="text-white/80 text-base md:text-lg font-light">Tell us how you want to feel. We'll weave the trail.</p>
        </div>
      </div>

      {/* Planner form */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 pb-28 md:pb-16">
        <div className="glass rounded-[28px] md:rounded-[32px] p-6 md:p-12 space-y-8 md:space-y-10 border border-border/30 shadow-sm">

          {/* Mood */}
          <div>
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">How do you want to feel?</h3>
            <div className="flex flex-wrap gap-2">
              {MOODS.map(m=><Chip key={m} label={m} active={mood===m} onClick={()=>setMood(m)}/>)}
            </div>
          </div>

          {/* Duration */}
          <div>
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Duration</h3>
            <div className="flex flex-wrap gap-2">
              {DURATIONS.map(d=><Chip key={d} label={`${d} days`} active={duration===d} onClick={()=>setDuration(d)}/>)}
            </div>
          </div>

          {/* Regions */}
          <div>
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Regions <span className="text-muted-foreground font-normal normal-case text-xs">(up to 3)</span></h3>
            <p className="text-xs text-muted-foreground mb-4">All 28 Indian states</p>
            <div className="max-h-44 overflow-y-auto pr-1 flex flex-wrap gap-2 mb-3">
              {ALL_REGIONS.map(r=><Chip key={r} label={r} active={selectedDests.includes(r)} onClick={()=>toggleDest(r)}/>)}
            </div>
            {selectedDests.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {selectedDests.map(d=>(
                  <Badge key={d} className="bg-primary/10 text-primary border-primary/20 gap-1">
                    <MapPin className="w-3 h-3"/>{d}
                    <button onClick={()=>toggleDest(d)} className="ml-1 hover:text-red-500">×</button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Budget */}
          <div>
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Budget</h3>
            <div className="grid grid-cols-3 gap-3">
              {BUDGETS.map(b=>(
                <button key={b.id} onClick={()=>setBudget(b.id)}
                  className={`rounded-2xl p-4 border-2 text-center transition-all ${budget===b.id?"border-primary bg-primary/5":"border-border/40 hover:border-primary/30"}`}>
                  <div className="text-2xl mb-1">{b.icon}</div>
                  <div className="font-semibold text-sm text-primary">{b.label}</div>
                  <div className="text-xs text-muted-foreground">{b.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Group */}
          <div>
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Travelling as</h3>
            <div className="flex flex-wrap gap-2">
              {GROUP_TYPES.map(g=><Chip key={g} label={g} active={groupType===g} onClick={()=>setGroupType(g)}/>)}
            </div>
          </div>

          {/* Interests */}
          <div>
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map(i=><Chip key={i} label={i} active={interests.includes(i)} onClick={()=>toggleInterest(i)}/>)}
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={generating} className="w-full py-5 md:py-6 text-base btn-primary">
            {generating
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/>Weaving your trail with {geminiReady?"Gemini AI":"local intelligence"}…</>
              : <><Sparkles className="w-4 h-4 mr-2"/>{geminiReady?"Generate with Gemini AI":"Generate My Itinerary"}</>
            }
          </Button>
        </div>

        {/* Itinerary result */}
        <AnimatePresence>
          {itinerary && (
            <motion.div id="itinerary-result" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} className="mt-10">
              <div className="glass rounded-[28px] p-6 md:p-10 border border-border/30 shadow-sm">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 pb-8 border-b border-border/30">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge className={usedGemini?"bg-purple-100 text-purple-700 border-purple-200":"bg-surface-container text-muted-foreground"}>
                        {usedGemini ? <><Sparkles className="w-3 h-3 mr-1"/>Gemini AI Generated</> : "Local Generation"}
                      </Badge>
                      <Badge className="bg-green-50 text-green-700 border-green-200">{itinerary.ecoScore} Eco Score</Badge>
                    </div>
                    <h2 className="font-serif text-2xl md:text-3xl text-primary mb-1">{itinerary.title}</h2>
                    <p className="text-muted-foreground italic">{itinerary.subtitle}</p>
                    <p className="text-muted-foreground text-sm mt-2">{itinerary.summary}</p>
                  </div>
                  <Link href={`/stays?city=${selectedDests[0]}`}className="shrink-0">
                    <Button className="btn-primary px-6 py-3 w-full md:w-auto">Find Stays <ArrowRight className="w-4 h-4 ml-2"/></Button>
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                  {[
                    {icon:Calendar, label:"Duration",   value:`${itinerary.duration} Days`},
                    {icon:MapPin,   label:"Region",     value:itinerary.destinations.join(", ")},
                    {icon:Leaf,     label:"Eco Score",  value:itinerary.ecoScore},
                    {icon:Clock,    label:"Budget",     value:itinerary.estimatedBudget},
                  ].map(s=>(
                    <div key={s.label} className="bg-surface-container/50 rounded-2xl p-4 text-center">
                      <s.icon className="w-5 h-5 text-secondary mx-auto mb-2"/>
                      <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">{s.label}</div>
                      <div className="font-semibold text-primary text-sm leading-tight">{s.value}</div>
                    </div>
                  ))}
                </div>

                {/* Highlights */}
                {itinerary.highlights?.length > 0 && (
                  <div className="mb-8 flex flex-wrap gap-2">
                    {itinerary.highlights.map(h=>(
                      <span key={h} className="flex items-center gap-1.5 text-xs bg-secondary/10 text-secondary px-3 py-1.5 rounded-full font-semibold">
                        <CheckCircle2 className="w-3 h-3"/> {h}
                      </span>
                    ))}
                  </div>
                )}

                {/* Day-by-day */}
                <div className="space-y-3 mb-8">
                  {itinerary.days.map(day=>(
                    <div key={day.day} className="border border-border/40 rounded-2xl overflow-hidden">
                      <button className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-surface-container/30 transition-colors"
                        onClick={()=>setExpandedDay(expandedDay===day.day?null:day.day)}>
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">{day.day}</div>
                          <div className="text-left">
                            <div className="font-serif text-base md:text-lg text-primary leading-tight">{day.title}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3"/>{day.location}</div>
                          </div>
                        </div>
                        {expandedDay===day.day ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0"/> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0"/>}
                      </button>
                      {expandedDay===day.day && (
                        <div className="px-4 md:px-5 pb-5 space-y-4 border-t border-border/30 pt-4">
                          {day.description && <p className="text-sm text-muted-foreground italic">{day.description}</p>}
                          <div className="space-y-2">
                            {day.activities.map((a,i)=>(
                              <div key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0"/>
                                {a}
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                            {day.accommodation && <div className="text-xs bg-surface-container/70 rounded-xl p-3"><span className="font-bold block text-primary mb-1">🛏 Stay</span>{day.accommodation}</div>}
                            {day.meals && <div className="text-xs bg-surface-container/70 rounded-xl p-3"><span className="font-bold block text-primary mb-1">🍽 Eat</span>{day.meals}</div>}
                            {day.ecoTip && <div className="text-xs bg-green-50 rounded-xl p-3"><span className="font-bold block text-green-700 mb-1">🌿 Eco Tip</span>{day.ecoTip}</div>}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Packing + Eco commitments */}
                {itinerary.packingEssentials?.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="glass rounded-2xl p-5 border border-border/30">
                      <h3 className="font-serif text-lg text-primary mb-4 flex items-center gap-2"><Backpack className="w-4 h-4"/> Packing Essentials</h3>
                      <ul className="space-y-2">
                        {itinerary.packingEssentials.map(e=>(
                          <li key={e} className="flex items-start gap-2 text-sm text-muted-foreground"><span className="text-secondary mt-0.5">✓</span>{e}</li>
                        ))}
                      </ul>
                    </div>
                    {itinerary.ecoCommitments?.length > 0 && (
                      <div className="bg-green-50 rounded-2xl p-5 border border-green-200">
                        <h3 className="font-serif text-lg text-green-800 mb-4 flex items-center gap-2"><Leaf className="w-4 h-4"/> Eco Commitments</h3>
                        <ul className="space-y-2">
                          {itinerary.ecoCommitments.map(e=>(
                            <li key={e} className="flex items-start gap-2 text-sm text-green-700"><span className="mt-0.5">🌱</span>{e}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-secondary/5 rounded-2xl p-5 border border-secondary/20 mb-8">
  <h3 className="font-serif text-xl text-primary mb-2">
    Ready to find your stay?
  </h3>

  <p className="text-muted-foreground mb-4">
    Explore handpicked hotels, hostels, homestays, and eco-retreats for your journey.
  </p>

  <Link href="/stays">
    <Button className="btn-primary">
      Explore Stays
      <ArrowRight className="w-4 h-4 ml-2" />
    </Button>
  </Link>
</div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-border/30">
                  <Link href={`/stays?city=${selectedDests[0]}`} className="flex-1">
                    <Button className="btn-primary w-full py-4 text-base">Find Stays — {itinerary.estimatedBudget}</Button>
                  </Link>
                  <Button variant="outline" onClick={handleGenerate} className="flex-1 py-4 text-base btn-outline">
                    <Sparkles className="w-4 h-4 mr-2"/> Regenerate
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile sticky generate button */}
      {!itinerary && !generating && (
        <div className="md:hidden fixed bottom-16 left-0 w-full px-4 pb-3 pt-2 z-40"
          style={{background:"rgba(249,250,242,0.92)",backdropFilter:"blur(16px)",borderTop:"1px solid rgba(194,201,187,0.4)"}}>
          <Button onClick={handleGenerate} disabled={generating || selectedDests.length===0} className="w-full py-4 text-base btn-primary">
            <Sparkles className="w-4 h-4 mr-2"/>
            {selectedDests.length===0 ? "Select a region first" : geminiReady ? "Generate with Gemini AI" : "Generate Itinerary"}
          </Button>
        </div>
      )}
    </div>
  );
}
