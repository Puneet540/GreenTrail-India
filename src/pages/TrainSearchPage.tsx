// ============================================================
//  GreenTrail India — Train Search Page (Backend Proxy)
//  API calls go to /api/proxy/trains instead of directly to RapidAPI
// ============================================================

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Train, Clock, Filter, RotateCcw, ChevronDown, Loader2, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { TRAINS, MAJOR_CITIES } from "@/lib/api";
import { cityToStationCode, type LiveTrain } from "@/lib/railwayApi";
import { searchTrainsViaProxy, searchStationsViaProxy } from "@/lib/backendApi";
import { useAuth } from "@/context/AuthContext";

const JOURNEY_CLASSES = [
  { code: "1A", label: "AC First Class (1A)" },
  { code: "2A", label: "AC 2 Tier (2A)" },
  { code: "3A", label: "AC 3 Tier (3A)" },
  { code: "SL", label: "Sleeper (SL)" },
  { code: "CC", label: "Chair Car (CC)" },
  { code: "EC", label: "Exec. Chair Car (EC)" },
];

const TIME_SLOTS = [
  { id: "night",    label: "00:00 – 06:00", icon: "🌙" },
  { id: "morning",  label: "06:00 – 12:00", icon: "🌅" },
  { id: "afternoon",label: "12:00 – 18:00", icon: "☀️" },
  { id: "evening",  label: "18:00 – 24:00", icon: "🌆" },
];

function inputDateToApi(dateStr: string) {
  if (!dateStr) {
    const d = new Date();
    return `${String(d.getDate()).padStart(2,"0")}-${String(d.getMonth()+1).padStart(2,"0")}-${d.getFullYear()}`;
  }
  const [y,m,d] = dateStr.split("-");
  return `${d}-${m}-${y}`;
}

export default function TrainSearchPage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { firebaseUser } = useAuth();

  const [from, setFrom]           = useState("New Delhi (NDLS)");
  const [to, setTo]               = useState("Kathgodam (KGM)");
  const [date, setDate]           = useState(new Date().toISOString().split("T")[0]);
  const [classFilters, setClassFilters] = useState<string[]>([]);
  const [timeFilters, setTimeFilters]   = useState<string[]>([]);
  const [searching, setSearching]       = useState(false);
  const [results, setResults]           = useState<LiveTrain[]>([]);
  const [searched, setSearched]         = useState(false);
  const [selectedTrain, setSelectedTrain] = useState<LiveTrain | null>(null);

  const toggleClass = (c: string) => setClassFilters(p => p.includes(c) ? p.filter(x=>x!==c) : [...p,c]);
  const toggleTime  = (t: string) => setTimeFilters(p => p.includes(t) ? p.filter(x=>x!==t) : [...p,t]);

  const handleSearch = async () => {
    if (!from || !to) { toast({ title:"Enter origin and destination", variant:"destructive" }); return; }

    setSearching(true); setResults([]); setSearched(false);

    try {
      let trains: LiveTrain[] = [];

      if (firebaseUser) {
        // ── Use backend proxy (hides RapidAPI key) ──────────────
        const fromCode = cityToStationCode(from.split("(")[0].trim());
        const toCode   = cityToStationCode(to.split("(")[0].trim());

        const res = await searchTrainsViaProxy({
          fromStation: fromCode,
          toStation: toCode,
          date: inputDateToApi(date),
        });

        // Normalise API response
        const raw = (res.data as { data?: LiveTrain[] })?.data || (res.data as LiveTrain[]) || [];
        trains = Array.isArray(raw) ? raw : [];
      }

      // Fallback to mock data if no results or not logged in
      if (trains.length === 0) {
        trains = TRAINS as LiveTrain[];
        if (!firebaseUser) {
          toast({ title: "Sign in to search live trains", description: "Showing sample data." });
        }
      }

      setResults(trains);
      setSearched(true);
    } catch {
      toast({ title: "Search failed", description: "Showing sample data", variant: "destructive" });
      setResults(TRAINS as LiveTrain[]);
      setSearched(true);
    } finally {
      setSearching(false);
    }
  };

  // Station autocomplete via backend proxy
  const handleStationSearch = async (query: string) => {
    if (!firebaseUser || query.length < 2) return;
    try {
      await searchStationsViaProxy(query);
    } catch {
      // Silently fail — user still has manual input
    }
  };

  const filtered = results.filter(t => {
    if (classFilters.length > 0 && !t.classes.some(c => classFilters.includes(c.name))) return false;
    return true;
  });

  const swap = () => { setFrom(to); setTo(from); };

  return (
    <div className="min-h-screen bg-surface pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-primary pt-12 pb-8 px-4">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => navigate("/travel")} className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Travel
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Train className="w-6 h-6 text-white" />
            <h1 className="text-2xl font-serif text-white">Train Search</h1>
          </div>
          <p className="text-white/70 text-sm">
            {firebaseUser ? "Live train data via secure API" : "Sign in to search live trains"}
          </p>
        </div>
      </div>

      {/* Search Form */}
      <div className="max-w-2xl mx-auto px-4 -mt-4">
        <div className="glass rounded-[24px] p-6 space-y-4">

          {/* From / To */}
          <div className="flex gap-3 items-center">
            <div className="flex-1 space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">From</label>
                <input
                  value={from}
                  onChange={e => { setFrom(e.target.value); handleStationSearch(e.target.value); }}
                  list="major-cities"
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Delhi (NDLS)"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">To</label>
                <input
                  value={to}
                  onChange={e => { setTo(e.target.value); handleStationSearch(e.target.value); }}
                  list="major-cities"
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Kathgodam (KGM)"
                />
              </div>
            </div>
            <button onClick={swap} className="p-2 rounded-full border border-border hover:bg-muted/50 transition-colors flex-shrink-0">
              <RotateCcw className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <datalist id="major-cities">
            {MAJOR_CITIES.map(c => <option key={c} value={c} />)}
          </datalist>

          {/* Date */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Date of Journey</label>
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={e => setDate(e.target.value)}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <Button onClick={handleSearch} disabled={searching} className="w-full h-12 rounded-xl bg-primary text-white font-semibold">
            {searching ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Searching...</> : <><Search className="w-4 h-4 mr-2" />Search Trains</>}
          </Button>
        </div>

        {/* Filters */}
        {searched && (
          <div className="mt-4 glass rounded-[20px] p-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Filter Results</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {JOURNEY_CLASSES.map(c => (
                <button key={c.code} onClick={()=>toggleClass(c.code)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${classFilters.includes(c.code) ? "bg-primary text-white border-primary" : "border-border bg-white/60 hover:border-primary/40"}`}>
                  {c.code}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {searched && (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-muted-foreground">{filtered.length} trains found</p>
            {filtered.map(train => (
              <div key={train.id} className="glass rounded-[20px] p-5 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedTrain(selectedTrain?.id === train.id ? null : train)}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{train.trainName}</h3>
                    <p className="text-xs text-muted-foreground">#{train.trainNumber} · {train.runningDays}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">{train.availableSeats} seats</Badge>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-xl font-bold text-foreground">{train.departure}</p>
                    <p className="text-xs text-muted-foreground">{train.from}</p>
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-px bg-border" />
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />{train.duration}
                    </div>
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-foreground">{train.arrival}</p>
                    <p className="text-xs text-muted-foreground">{train.to}</p>
                  </div>
                </div>

                {/* Classes */}
                {selectedTrain?.id === train.id && (
                  <div className="mt-4 pt-4 border-t border-border/30 grid grid-cols-2 gap-2">
                    {train.classes.map(cls => (
                      <div key={cls.name} className={`rounded-xl p-3 border ${cls.available ? "border-primary/20 bg-primary/5" : "border-border bg-muted/30 opacity-60"}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold">{cls.name}</span>
                          {!cls.available && <span className="text-xs text-red-500">Full</span>}
                        </div>
                        <p className="text-primary font-bold">₹{cls.price.toLocaleString()}</p>
                        {cls.available && (
                          <button className="mt-2 w-full bg-primary text-white text-xs py-1.5 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                            Book Now
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
