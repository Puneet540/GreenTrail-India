import { useState, useRef, useEffect } from "react";
import { Train, Plane, Bus, MapPin, Calendar, Users, ArrowRight, Clock,
  Wifi, Zap, Wind, Coffee, AlertCircle, CheckCircle2, Search, Loader2, RefreshCw, 
  Link} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FLIGHTS, BUSES, MAJOR_CITIES, TRAINS } from "@/lib/api";
import {
  searchTrains, searchStations, isRailwayApiConfigured,
  cityToStationCode, type LiveTrain, type TrainStation,
} from "@/lib/railwayApi";

// ── Simple navigate hook shim ──────────────────────────────────
function useGoTo() {
  return (path: string) => { window.location.href = path; };
}

// ── Helpers ────────────────────────────────────────────────────
function normalise(s: string) { return s.toLowerCase().replace(/[^a-z]/g, ""); }
function matches(city: string, query: string) {
  return !query || normalise(city).includes(normalise(query));
}
function todayStr() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,"0")}-${String(d.getMonth()+1).padStart(2,"0")}-${d.getFullYear()}`;
}
function inputDateToApi(dateStr: string) {
  // input type=date gives YYYY-MM-DD, API wants DD-MM-YYYY
  if (!dateStr) return todayStr();
  const [y, m, d] = dateStr.split("-");
  return `${d}-${m}-${y}`;
}

// ── Station Autocomplete Input ─────────────────────────────────
function StationInput({ placeholder, value, onChange }: {
  placeholder: string; value: string; onChange: (v: string, code?: string) => void;
}) {
  const [suggestions, setSuggestions] = useState<TrainStation[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleInput = async (v: string) => {
    onChange(v);
    if (v.length < 2) { setSuggestions([]); setOpen(false); return; }
    if (isRailwayApiConfigured()) {
      setLoading(true);
      try {
        const results = await searchStations(v);
        setSuggestions(results.slice(0, 6));
        setOpen(results.length > 0);
      } catch { setSuggestions([]); }
      finally { setLoading(false); }
    } else {
      // Offline: filter from MAJOR_CITIES
      const filtered = MAJOR_CITIES.filter(c => c.toLowerCase().includes(v.toLowerCase())).slice(0, 6);
      setSuggestions(filtered.map(c => ({ stationCode: cityToStationCode(c), stationName: c, state: "" })));
      setOpen(filtered.length > 0);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
      {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 animate-spin text-muted-foreground" />}
      <Input
        value={value}
        onChange={e => handleInput(e.target.value)}
        placeholder={placeholder}
        className="pl-9 rounded-full bg-white/60 border-border/50 text-sm"
        onFocus={() => suggestions.length > 0 && setOpen(true)}
      />
      {open && suggestions.length > 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-2xl shadow-xl border border-border/30 z-50 overflow-hidden">
          {suggestions.map(s => (
            <button
              key={s.stationCode}
              className="w-full text-left px-4 py-3 text-sm hover:bg-surface-container transition-colors flex items-center justify-between gap-2"
              onMouseDown={e => {
                e.preventDefault();
                onChange(s.stationName, s.stationCode);
                setOpen(false);
              }}
            >
              <span className="font-medium text-primary">{s.stationName}</span>
              <span className="text-xs text-muted-foreground shrink-0 font-mono bg-surface-container px-1.5 py-0.5 rounded">{s.stationCode}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Train Card ─────────────────────────────────────────────────
function TrainCard({ t, onBook }: { t: LiveTrain; onBook: () => void }) {
  const [selected, setSelected] = useState(t.classes.find(c => c.available)?.name || "");
  const price = t.classes.find(c => c.name === selected)?.price ?? 0;
  return (
    <div className="glass rounded-[20px] p-6 border border-border/30 shadow-sm hover:shadow-md transition-shadow mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Train className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="font-serif text-lg text-primary leading-tight">{t.trainName}</div>
            <div className="text-xs text-muted-foreground">#{t.trainNumber} · {t.runningDays}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">🌿 Low Carbon</Badge>
          {t.distance && <Badge variant="outline" className="text-xs">{t.distance} km</Badge>}
        </div>
      </div>

      {/* Journey strip */}
      <div className="flex items-center gap-3 mb-5">
        <div className="text-center shrink-0">
          <div className="font-serif text-2xl text-primary font-semibold">{t.departure}</div>
          <div className="text-xs text-muted-foreground mt-0.5 max-w-[80px] truncate">{t.from}</div>
        </div>
        <div className="flex-1 text-center px-2 min-w-0">
          <div className="text-xs text-muted-foreground mb-1.5 flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" />{t.duration}
          </div>
          <div className="relative h-px bg-border/60">
            <div className="absolute inset-0 flex items-center justify-center">
              <Train className="w-3 h-3 bg-background text-muted-foreground" />
            </div>
          </div>
        </div>
        <div className="text-center shrink-0">
          <div className="font-serif text-2xl text-primary font-semibold">{t.arrival}</div>
          <div className="text-xs text-muted-foreground mt-0.5 max-w-[80px] truncate">{t.to}</div>
        </div>
      </div>

      {/* Class selector */}
      <div className="flex flex-wrap gap-2 mb-5">
        {t.classes.map(c => (
          <button
            key={c.name}
            onClick={() => c.available && setSelected(c.name)}
            className={`px-3 py-2 rounded-xl border text-xs text-center transition-all min-w-[56px] ${
              !c.available
                ? "opacity-40 cursor-not-allowed border-border/30 bg-surface-container"
                : selected === c.name
                ? "border-primary bg-primary/10 text-primary shadow-sm"
                : "border-border/40 hover:border-primary/40 cursor-pointer"
            }`}
          >
            <div className="font-bold">{c.name}</div>
            {c.price > 0 && <div className="text-muted-foreground">₹{c.price}</div>}
            <div className={`font-semibold mt-0.5 text-[10px] ${c.available ? "text-green-600" : "text-red-400"}`}>
              {c.available ? (c.availableSeats ? `${c.availableSeats} avbl` : "Avbl") : "WL"}
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border/30">
        <div className="text-sm text-muted-foreground">
          {t.availableSeats > 0 ? `${t.availableSeats} seats available` : "Check availability"}
          {price > 0 && <> · <span className="font-bold text-primary">₹{price}/person</span></>}
        </div>
        <Button onClick={onBook} className="btn-primary text-sm px-6 py-2.5">Book Now</Button>
      </div>
    </div>
  );
}

// ── Flight Card ─────────────────────────────────────────────────
function FlightCard({ f, onBook }: { f: typeof FLIGHTS[0]; onBook: () => void }) {
  const colors: Record<string, string> = {
    "IndiGo":"bg-indigo-100 text-indigo-700", "Air India":"bg-orange-100 text-orange-700",
    "SpiceJet":"bg-red-100 text-red-700", "Vistara":"bg-purple-100 text-purple-700",
    "Air India Regional":"bg-orange-100 text-orange-700",
  };
  return (
    <div className="glass rounded-[20px] p-6 border border-border/30 shadow-sm hover:shadow-md transition-shadow mb-4">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-xl text-xs font-bold ${colors[f.airline] || "bg-gray-100 text-gray-700"}`}>{f.airline}</div>
          <span className="text-xs text-muted-foreground">{f.flightNumber} · {f.aircraft}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs">⚠️ Higher CO₂</Badge>
          <Badge variant="outline" className="text-xs">{f.stops === 0 ? "Non-stop" : `${f.stops} stop`}</Badge>
        </div>
      </div>
      <div className="flex items-center gap-3 mb-5">
        <div className="text-center shrink-0">
          <div className="font-serif text-2xl text-primary font-semibold">{f.departure}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{f.from}</div>
        </div>
        <div className="flex-1 text-center px-2">
          <div className="text-xs text-muted-foreground mb-1.5 flex items-center justify-center gap-1"><Clock className="w-3 h-3" />{f.duration}</div>
          <div className="relative h-px bg-border/60"><div className="absolute inset-0 flex items-center justify-center"><Plane className="w-3 h-3 bg-background text-muted-foreground" /></div></div>
        </div>
        <div className="text-center shrink-0">
          <div className="font-serif text-2xl text-primary font-semibold">{f.arrival}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{f.to}</div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-border/30">
        <div className="text-sm text-muted-foreground">{f.availableSeats} seats left</div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-muted-foreground">from</div>
            <div className="font-serif text-2xl text-primary font-semibold">₹{f.price.toLocaleString()}</div>
          </div>
          <Button onClick={onBook} className="btn-primary text-sm px-6 py-2.5">Book Now</Button>
        </div>
      </div>
    </div>
  );
}

// ── Bus Card ────────────────────────────────────────────────────
const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "AC": <Wind className="w-3 h-3" />, "WiFi": <Wifi className="w-3 h-3" />,
  "USB Charging": <Zap className="w-3 h-3" />, "Snacks": <Coffee className="w-3 h-3" />,
};
function BusCard({ b, onBook }: { b: typeof BUSES[0]; onBook: () => void }) {
  return (
    <div className="glass rounded-[20px] p-6 border border-border/30 shadow-sm hover:shadow-md transition-shadow mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="font-serif text-lg text-primary">{b.busName}</div>
          <div className="text-xs text-muted-foreground">{b.busType} · {b.operator}</div>
        </div>
        <Badge className="bg-green-50 text-green-700 border-green-200 text-xs w-fit">🌿 Low Carbon</Badge>
      </div>
      <div className="flex items-center gap-3 mb-5">
        <div className="text-center shrink-0">
          <div className="font-serif text-xl text-primary font-semibold">{b.departure}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{b.from}</div>
        </div>
        <div className="flex-1 text-center px-2">
          <div className="text-xs text-muted-foreground mb-1.5 flex items-center justify-center gap-1"><Clock className="w-3 h-3" />{b.duration}</div>
          <div className="relative h-px bg-border/60"><div className="absolute inset-0 flex items-center justify-center"><Bus className="w-3 h-3 bg-background text-muted-foreground" /></div></div>
        </div>
        <div className="text-center shrink-0">
          <div className="font-serif text-xl text-primary font-semibold">{b.arrival}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{b.to}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-5">
        {b.amenities.map(a => (
          <span key={a} className="flex items-center gap-1 text-xs bg-surface-container rounded-full px-2.5 py-1 text-muted-foreground">
            {AMENITY_ICONS[a] || null} {a}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-border/30">
        <div className="text-sm text-muted-foreground">
          {b.availableSeats} seats · <span className="font-bold text-primary">₹{b.price}/person</span>
        </div>
        <Button onClick={onBook} className="btn-primary text-sm px-6 py-2.5">Book Now</Button>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────
type SearchForm = { from: string; fromCode: string; to: string; toCode: string; date: string; passengers: string };

export default function TravelPage() {
  const { toast } = useToast();
  const goTo = useGoTo();

  const [form, setForm] = useState<SearchForm>({
    from: "", fromCode: "", to: "", toCode: "", date: "", passengers: "1",
  });
  const [activeTab, setActiveTab]   = useState("trains");
  const [searching, setSearching]   = useState(false);
  const [searched, setSearched]     = useState(false);
  const [liveTrains, setLiveTrains] = useState<LiveTrain[]>([]);
  const [apiError, setApiError]     = useState<string | null>(null);

  const apiReady = isRailwayApiConfigured();

  // Flights & buses: filter from static data
  const flights = searched
    ? FLIGHTS.filter(f => !form.from || matches(f.from, form.from))
             .filter(f => !form.to   || matches(f.to,   form.to))
    : [];
  const buses = searched
    ? BUSES.filter(b => !form.from || matches(b.from, form.from))
           .filter(b => !form.to   || matches(b.to,   form.to))
    : [];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.from || !form.to) {
      toast({ title: "Please enter both origin and destination", variant: "destructive" });
      return;
    }

    setSearching(true);
    setSearched(false);
    setApiError(null);
    setLiveTrains([]);

    if (activeTab === "trains" && apiReady) {
      try {
        const fromCode = form.fromCode || cityToStationCode(form.from);
        const toCode   = form.toCode   || cityToStationCode(form.to);
        const date     = inputDateToApi(form.date);
        const results  = await searchTrains({ fromStationCode: fromCode, toStationCode: toCode, dateOfJourney: date });
        setLiveTrains(results);
        if (results.length === 0) {
          toast({ title: "No trains found", description: "Try different stations or date." });
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to fetch trains";
        setApiError(msg);
        toast({ title: "API Error", description: msg, variant: "destructive" });
      }
    }

    setSearched(true);
    setSearching(false);
  };

  // Trains to display: live if API worked, else fall back to static sample data
  const displayTrains: LiveTrain[] = liveTrains.length > 0
    ? liveTrains
    : searched
      ? TRAINS.filter(t => !form.from || matches(t.from, form.from))
               .filter(t => !form.to   || matches(t.to,   form.to))
               .map(t => ({ ...t, id: t.id }))
      : [];

  const handleBook = () => goTo("/checkout");

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      {/* Mobile header */}
      <header className="md:hidden fixed top-0 left-0 w-full z-50 px-5 pt-4 pb-3 flex items-center gap-3"
        style={{background:"rgba(255,255,255,0.88)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(194,201,187,0.35)"}}>
        <span className="font-serif text-xl text-primary italic">Travel</span>
      </header>

      {/* Hero */}
      <div className="relative h-48 md:h-64 overflow-hidden flex items-end">
        <img src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1600&q=80"
          alt="Travel India" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-transparent" />
        <div className="relative z-10 px-8 pb-10 pt-28">
          <h1 className="font-serif text-5xl md:text-6xl text-white drop-shadow-lg">Travel Across India</h1>
          <p className="text-white/80 mt-2 text-lg">Find trains, flights &amp; buses to every corner of the subcontinent.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-4 pt-20 md:pt-10 pb-10">

        {/* API status banner */}
        <div className={`rounded-2xl px-5 py-3 border flex items-center gap-3 text-sm mb-8 ${
          apiReady
            ? "bg-green-50 border-green-200 text-green-800"
            : "glass border-border/30 text-muted-foreground"
        }`}>
          {apiReady
            ? <><CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" /><span><strong>Live IRCTC data active</strong> via RapidAPI. Train searches return real-time availability.</span></>
            : <><AlertCircle className="w-4 h-4 text-amber-500 shrink-0" /><span>Add <code className="bg-surface-container px-1.5 py-0.5 rounded text-xs mx-1">VITE_RAPIDAPI_KEY=your_key</code> to <code className="bg-surface-container px-1.5 py-0.5 rounded text-xs">.env</code> to enable live IRCTC train data. Showing sample routes now.</span></>
          }
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={v => { setActiveTab(v); setSearched(false); }}>
          <div className="flex justify-center mb-8">
            <TabsList className="glass rounded-full p-1 border border-border/50 shadow-sm h-auto">
              <TabsTrigger value="trains"  className="rounded-full px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                <Train  className="w-4 h-4 mr-2" />Trains {apiReady && <span className="ml-1.5 text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full">LIVE</span>}
              </TabsTrigger>
              <TabsTrigger value="flights" className="rounded-full px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                <Plane  className="w-4 h-4 mr-2" />Flights
              </TabsTrigger>
              <TabsTrigger value="buses"   className="rounded-full px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                <Bus    className="w-4 h-4 mr-2" />Buses
              </TabsTrigger>
            </TabsList>
          <div className="flex justify-center gap-3 mt-3 text-xs text-muted-foreground">
            <Link href="/travel/trains" className="text-secondary hover:text-primary font-semibold underline underline-offset-2">Advanced Train Search →</Link>
            <span>·</span>
            <Link href="/travel/flights" className="text-secondary hover:text-primary font-semibold underline underline-offset-2">Flight Search →</Link>
            <span>·</span>
            <Link href="/travel/buses" className="text-secondary hover:text-primary font-semibold underline underline-offset-2">Bus Search with Seat Selection →</Link>
          </div>
          </div>

          {/* Search form */}
          <div className="glass rounded-[24px] p-6 mb-10 border border-border/50 shadow-sm">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <StationInput
                placeholder={activeTab === "trains" ? "From station / city" : "From city"}
                value={form.from}
                onChange={(v, code) => setForm(f => ({ ...f, from: v, fromCode: code || "" }))}
              />
              <StationInput
                placeholder={activeTab === "trains" ? "To station / city" : "To city"}
                value={form.to}
                onChange={(v, code) => setForm(f => ({ ...f, to: v, toCode: code || "" }))}
              />
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="date" className="pl-9 rounded-full bg-white/60 border-border/50 text-sm"
                  value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              <Select value={form.passengers} onValueChange={v => setForm(f => ({ ...f, passengers: v }))}>
                <SelectTrigger className="rounded-full bg-white/60">
                  <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Passengers" />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6].map(n => (
                    <SelectItem key={n} value={String(n)}>{n} Passenger{n > 1 ? "s" : ""}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit" disabled={searching} className="btn-primary rounded-full">
                {searching
                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Searching…</>
                  : <><Search className="w-4 h-4 mr-2" /> Search</>
                }
              </Button>
            </form>

            {/* Station code helper */}
            {activeTab === "trains" && (form.fromCode || form.toCode) && (
              <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                {form.fromCode && <span>From: <code className="bg-surface-container px-1.5 py-0.5 rounded font-mono">{form.fromCode}</code></span>}
                {form.toCode   && <span>To: <code className="bg-surface-container px-1.5 py-0.5 rounded font-mono">{form.toCode}</code></span>}
              </div>
            )}
          </div>

          {/* API Error */}
          {apiError && (
            <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-4 flex items-start gap-3 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <strong>API Error:</strong> {apiError}
                <p className="mt-1 text-red-600 text-xs">Showing sample data below as fallback.</p>
              </div>
            </div>
          )}

          {/* Results */}
          <TabsContent value="trains">
            {!searched && !searching && <SearchPrompt icon={<Train className="w-6 h-6" />} text="Search trains between any two Indian cities or stations" sub={apiReady ? "Live seat availability from IRCTC" : "Add VITE_RAPIDAPI_KEY for live data"} />}
            {searching && <LoadingState label="Searching trains…" />}
            {searched && !searching && (
              <>
                <ResultsHeader
                  count={displayTrains.length}
                  live={liveTrains.length > 0}
                  onRefresh={() => handleSearch({ preventDefault: () => {} } as React.FormEvent)}
                />
                {displayTrains.length > 0
                  ? displayTrains.map(t => <TrainCard key={t.id} t={t} onBook={handleBook} />)
                  : <EmptyState mode="trains" />
                }
              </>
            )}
          </TabsContent>

          <TabsContent value="flights">
            {!searched && !searching && <SearchPrompt icon={<Plane className="w-6 h-6" />} text="Search flights across India" sub="Amadeus or MakeMyTrip API for live prices" />}
            {searching && <LoadingState label="Searching flights…" />}
            {searched && !searching && (
              <>
                <ResultsHeader count={flights.length > 0 ? flights.length : FLIGHTS.length} live={false} />
                {(flights.length > 0 ? flights : FLIGHTS).map(f => <FlightCard key={f.id} f={f} onBook={handleBook} />)}
              </>
            )}
          </TabsContent>

          <TabsContent value="buses">
            {!searched && !searching && <SearchPrompt icon={<Bus className="w-6 h-6" />} text="Search overnight & day buses" sub="RedBus API for live availability" />}
            {searching && <LoadingState label="Searching buses…" />}
            {searched && !searching && (
              <>
                <ResultsHeader count={buses.length > 0 ? buses.length : BUSES.length} live={false} />
                {(buses.length > 0 ? buses : BUSES).map(b => <BusCard key={b.id} b={b} onBook={handleBook} />)}
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* Eco note */}
        {searched && (
          <div className="mt-10 glass rounded-2xl p-6 border border-border/30 flex items-start gap-4">
            <div className="text-2xl">🌍</div>
            <div>
              <h3 className="font-serif text-lg text-primary mb-1">Travel Greener</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Trains and buses emit <strong>3–5× less CO₂ per km</strong> than flights.
                Choosing ground transport for trips under 600km makes a real difference.
                GreenTrail always shows you the eco-impact of each option.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Small UI helpers ───────────────────────────────────────────
function SearchPrompt({ icon, text, sub }: { icon: React.ReactNode; text: string; sub?: string }) {
  return (
    <div className="text-center py-20 text-muted-foreground">
      <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-4 text-primary">{icon}</div>
      <p className="text-lg font-medium text-primary">{text}</p>
      {sub && <p className="text-sm mt-2">{sub}</p>}
    </div>
  );
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="text-center py-20">
      <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
      <p className="text-muted-foreground">{label}</p>
    </div>
  );
}

function EmptyState({ mode }: { mode: string }) {
  return (
    <div className="text-center py-16 glass rounded-2xl border border-border/30">
      <p className="text-lg text-muted-foreground mb-2">No {mode} found for this route.</p>
      <p className="text-sm text-muted-foreground">Try different cities, dates, or check the station codes.</p>
    </div>
  );
}

function ResultsHeader({ count, live, onRefresh }: { count: number; live: boolean; onRefresh?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground font-medium">{count} result{count !== 1 ? "s" : ""} found</p>
        {live && <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">Live Data</Badge>}
        {!live && <Badge variant="outline" className="text-xs text-muted-foreground">Sample Data</Badge>}
      </div>
      {onRefresh && (
        <button onClick={onRefresh} className="flex items-center gap-1 text-xs text-secondary hover:text-primary transition-colors font-semibold">
          <RefreshCw className="w-3 h-3" /> Refresh
        </button>
      )}
    </div>
  );
}
