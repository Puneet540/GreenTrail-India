import { useState } from "react";
import { ArrowLeft, Plane, Clock, ArrowRight, Filter, Loader2, Search } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FLIGHTS, MAJOR_CITIES } from "@/lib/api";
import {
  searchFlights,
  isFlightApiConfigured,
  type LiveFlight,
} from "@/lib/flightApi";

const AIRLINES = ["Vistara","Air India","IndiGo","SpiceJet","Air India Regional"];
const STOPS_OPTS = [{ value:"0", label:"Direct" },{ value:"1", label:"1 Stop" }];

export default function FlightSearchPage() {
  const [from, setFrom]       = useState("Delhi (DEL)");
  const [to, setTo]           = useState("Leh (IXL)");
  const [date, setDate]       = useState(new Date().toISOString().split("T")[0]);
  const [pax, setPax]         = useState("1");
  const [cabin, setCabin]     = useState("Economy");
  const [searching, setSearching] = useState(false);
  const [searched, setSearched]   = useState(false);
  const [airlineFilter, setAirlineFilter] = useState<string[]>([]);
  const [stopsFilter, setStopsFilter]     = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(15000);
  const [liveFlights, setLiveFlights] = useState<LiveFlight[]>([]);
const flightApiReady = isFlightApiConfigured();

  const toggleAirline = (a: string) => setAirlineFilter(p => p.includes(a)?p.filter(x=>x!==a):[...p,a]);
  const toggleStop    = (s: string) => setStopsFilter(p => p.includes(s)?p.filter(x=>x!==s):[...p,s]);

  const handleSearch = async () => {
  setSearching(true);

  try {
    if (flightApiReady) {
      const data = await searchFlights({
        from,
        to,
        date,
      });
      setLiveFlights(data);
    }
  } catch (err) {
    console.error("Flight API Error:", err);
  }

  setSearched(true);
  setSearching(false);
};

  const results = liveFlights.length
  ? liveFlights
  : searched
    ? FLIGHTS
        .filter(f => airlineFilter.length === 0 || airlineFilter.includes(f.airline))
        .filter(f => stopsFilter.length === 0 || stopsFilter.includes(String(f.stops)))
        .filter(f => f.price <= maxPrice)
    : [];

  const display = results.length > 0 ? results : searched ? FLIGHTS : [];

  const airlineColors: Record<string,string> = {
    "IndiGo":"bg-indigo-100 text-indigo-700","Air India":"bg-orange-100 text-orange-700",
    "SpiceJet":"bg-red-100 text-red-700","Vistara":"bg-purple-100 text-purple-700",
    "Air India Regional":"bg-orange-100 text-orange-700",
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Search header */}
      <div className="bg-primary text-white py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <Link href="/travel"><button className="text-white/70 hover:text-white flex items-center gap-1 text-sm"><ArrowLeft className="w-4 h-4"/>Travel</button></Link>
            <span className="text-white/40">/</span>
            <span className="text-sm text-white/80">Flight Search</span>
          </div>
          <div className="glass rounded-[20px] p-5 border border-white/20 bg-white/10">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              <div className="col-span-2 md:col-span-1">
                <label className="text-xs text-white/60 uppercase tracking-wider mb-1 block">From</label>
                <input list="fl-from" value={from} onChange={e=>setFrom(e.target.value)} className="w-full bg-white/15 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-white/50"/>
                <datalist id="fl-from">{MAJOR_CITIES.map(c=><option key={c} value={c}/>)}</datalist>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="text-xs text-white/60 uppercase tracking-wider mb-1 block">To</label>
                <input list="fl-to" value={to} onChange={e=>setTo(e.target.value)} className="w-full bg-white/15 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-white/50"/>
                <datalist id="fl-to">{MAJOR_CITIES.map(c=><option key={c} value={c}/>)}</datalist>
              </div>
              <div>
                <label className="text-xs text-white/60 uppercase tracking-wider mb-1 block">Date</label>
                <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full bg-white/15 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-white/50"/>
              </div>
              <div>
                <label className="text-xs text-white/60 uppercase tracking-wider mb-1 block">Passengers</label>
                <select value={pax} onChange={e=>setPax(e.target.value)} className="w-full bg-white/15 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none appearance-none">
                  {[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n} Pax</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/60 uppercase tracking-wider mb-1 block">Cabin</label>
                <select value={cabin} onChange={e=>setCabin(e.target.value)} className="w-full bg-white/15 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none appearance-none">
                  <option>Economy</option><option>Business</option><option>First</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch} disabled={searching} className="w-full bg-white text-primary hover:bg-white/90 rounded-xl py-2.5 font-semibold">
                  {searching?<Loader2 className="w-4 h-4 animate-spin mr-1"/>:<Search className="w-4 h-4 mr-1"/>}
                  {searching?"Searching…":"Search"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters */}
        <aside className="md:col-span-1">
          <div className="glass rounded-[24px] p-6 border border-border/30 sticky top-24 space-y-6">
            <div className="flex items-center gap-2 font-semibold text-primary border-b border-border/30 pb-4"><Filter className="w-4 h-4"/>Filters</div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-3">Max Price: ₹{maxPrice.toLocaleString()}</label>
              <input type="range" min={2000} max={20000} step={500} value={maxPrice} onChange={e=>setMaxPrice(Number(e.target.value))} className="w-full accent-primary"/>
            </div>
            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Stops</h4>
              {STOPS_OPTS.map(s=>(
                <label key={s.value} className="flex items-center gap-2 text-sm mb-2 cursor-pointer">
                  <input type="checkbox" checked={stopsFilter.includes(s.value)} onChange={()=>toggleStop(s.value)} className="rounded accent-primary"/>
                  {s.label}
                </label>
              ))}
            </div>
            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Airlines</h4>
              {AIRLINES.map(a=>(
                <label key={a} className="flex items-center gap-2 text-sm mb-2 cursor-pointer">
                  <input type="checkbox" checked={airlineFilter.includes(a)} onChange={()=>toggleAirline(a)} className="rounded accent-primary"/>
                  {a}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="md:col-span-3">
          {!searched && !searching && (
            <div className="text-center py-24 text-muted-foreground">
              <Plane className="w-12 h-12 mx-auto mb-4 text-primary/30"/>
              <p className="text-lg font-medium text-primary">Select Departure Flight</p>
              <p className="text-sm mt-1">Enter cities and click Search to see flights</p>
            </div>
          )}
          {searching && <div className="text-center py-24"><Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4"/><p className="text-muted-foreground">Searching flights…</p></div>}
          {searched && !searching && (
            <>
              <div className="flex justify-between items-center mb-5">
                <p className="text-sm text-muted-foreground">{display.length} flight{display.length!==1?"s":""} found</p>
                <Badge variant="outline">
  {liveFlights.length
    ? "Live AviationStack Data"
    : "Fallback Sample Data"}
</Badge>
              </div>
              {display.map(f=>(
                <div key={f.id} className="glass rounded-[20px] p-6 border border-border/30 mb-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1.5 rounded-xl text-xs font-bold ${airlineColors[f.airline]||"bg-gray-100 text-gray-700"}`}>{f.airline}</div>
                      <span className="text-xs text-muted-foreground">{f.flightNumber} · {f.aircraft}</span>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs">⚠️ Higher CO₂</Badge>
                      <Badge variant="outline" className="text-xs">{f.stops===0?"Non-stop":"1 Stop"}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="text-center"><div className="font-serif text-2xl text-primary">{f.departure}</div><div className="text-xs text-muted-foreground">{f.from}</div></div>
                    <div className="flex-1 text-center">
                      <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1"><Clock className="w-3 h-3"/>{f.duration}</div>
                      <div className="h-px bg-border/60 relative"><div className="absolute inset-0 flex items-center justify-center"><Plane className="w-3 h-3 bg-background text-muted-foreground"/></div></div>
                    </div>
                    <div className="text-center"><div className="font-serif text-2xl text-primary">{f.arrival}</div><div className="text-xs text-muted-foreground">{f.to}</div></div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border/30">
                    <div><div className="text-xs text-muted-foreground">{f.availableSeats} seats · {cabin}</div></div>
                    <div className="flex items-center gap-4">
                      <div className="text-right"><div className="text-xs text-muted-foreground">from</div><div className="font-serif text-2xl text-primary">₹{f.price.toLocaleString()}</div></div>
                      <Button className="btn-primary text-sm px-5" onClick={()=>window.location.href="/checkout"}>Select <ArrowRight className="w-4 h-4 ml-1"/></Button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
