import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Train, Clock, Filter, RotateCcw, ChevronDown, Loader2, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { TRAINS, MAJOR_CITIES } from "@/lib/api";
import { searchTrains, cityToStationCode, isRailwayApiConfigured, type LiveTrain } from "@/lib/railwayApi";

const JOURNEY_CLASSES = [
  { code: "1A", label: "AC First Class (1A)" },
  { code: "2A", label: "AC 2 Tier (2A)" },
  { code: "3A", label: "AC 3 Tier (3A)" },
  { code: "SL", label: "Sleeper (SL)" },
  { code: "CC", label: "Chair Car (CC)" },
  { code: "EC", label: "Exec. Chair Car (EC)" },
];

const TIME_SLOTS = [
  { id: "night",   label: "00:00 – 06:00", icon: "🌙" },
  { id: "morning", label: "06:00 – 12:00", icon: "🌅" },
  { id: "afternoon",label:"12:00 – 18:00", icon: "☀️" },
  { id: "evening", label: "18:00 – 24:00", icon: "🌆" },
];

function inputDateToApi(dateStr: string) {
  if (!dateStr) {
    const d = new Date();
    return `${String(d.getDate()).padStart(2,"0")}-${String(d.getMonth()+1).padStart(2,"0")}-${d.getFullYear()}`;
  }
  const [y,m,d] = dateStr.split("-");
  return `${d}-${m}-${y}`;
}

function formatDisplayDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { weekday:"short", day:"numeric", month:"short", year:"numeric" });
}

export default function TrainSearchPage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [from, setFrom]         = useState("New Delhi (NDLS)");
  const [to, setTo]             = useState("Kathgodam (KGM)");
  const [date, setDate]         = useState(new Date().toISOString().split("T")[0]);
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
      let trains: LiveTrain[];
      if (isRailwayApiConfigured()) {
        const fromCode = cityToStationCode(from.split("(")[0].trim());
        const toCode   = cityToStationCode(to.split("(")[0].trim());
        trains = await searchTrains({ fromStationCode: fromCode, toStationCode: toCode, dateOfJourney: inputDateToApi(date) });
      } else {
        trains = TRAINS.map(t => ({ ...t, id: t.id })) as LiveTrain[];
      }
      setResults(trains);
      setSearched(true);
    } catch {
      toast({ title: "Search failed", description: "Showing sample data", variant: "destructive" });
      setResults(TRAINS as LiveTrain[]);
      setSearched(true);
    }
    setSearching(false);
  };

  const filtered = results.filter(t => {
    if (classFilters.length > 0 && !t.classes.some(c => classFilters.includes(c.name))) return false;
    return true;
  });

  if (selectedTrain) {
    return <SeatSelectionPage train={selectedTrain} date={date} onBack={() => setSelectedTrain(null)} />;
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Search bar */}
      <div className="bg-primary text-white py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/travel"><button className="text-white/70 hover:text-white flex items-center gap-1 text-sm"><ArrowLeft className="w-4 h-4" /> Travel</button></Link>
            <span className="text-white/40">/</span>
            <span className="text-sm text-white/80">Train Search</span>
          </div>
          <div className="glass rounded-[20px] p-5 border border-white/20 bg-white/10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-white/60 font-semibold uppercase tracking-wider mb-1.5 block">Origin</label>
                <input list="from-cities" value={from} onChange={e=>setFrom(e.target.value)}
                  className="w-full bg-white/15 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/50"/>
                <datalist id="from-cities">{MAJOR_CITIES.map(c=><option key={c} value={c}/>)}</datalist>
              </div>
              <div>
                <label className="text-xs text-white/60 font-semibold uppercase tracking-wider mb-1.5 block">Destination</label>
                <input list="to-cities" value={to} onChange={e=>setTo(e.target.value)}
                  className="w-full bg-white/15 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/50"/>
                <datalist id="to-cities">{MAJOR_CITIES.map(c=><option key={c} value={c}/>)}</datalist>
              </div>
              <div>
                <label className="text-xs text-white/60 font-semibold uppercase tracking-wider mb-1.5 block">Date</label>
                <input type="date" value={date} onChange={e=>setDate(e.target.value)}
                  className="w-full bg-white/15 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/50"/>
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch} disabled={searching} className="w-full bg-white text-primary hover:bg-white/90 rounded-xl py-2.5 font-semibold">
                  {searching ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <Search className="w-4 h-4 mr-2"/>}
                  {searching ? "Searching…" : "Search Trains"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters sidebar */}
        <aside className="md:col-span-1">
          <div className="glass rounded-[24px] p-6 border border-border/30 sticky top-24">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-border/30">
              <div className="flex items-center gap-2 font-semibold text-primary"><Filter className="w-4 h-4"/>Filters</div>
              <button onClick={()=>{setClassFilters([]);setTimeFilters([]);}} className="text-xs text-secondary hover:text-primary flex items-center gap-1"><RotateCcw className="w-3 h-3"/>Reset</button>
            </div>
            <div className="mb-6">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Journey Class</h4>
              <div className="space-y-2">
                {JOURNEY_CLASSES.map(c=>(
                  <label key={c.code} className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="checkbox" checked={classFilters.includes(c.code)} onChange={()=>toggleClass(c.code)} className="rounded accent-primary"/>
                    <span className="text-foreground">{c.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Departure Time</h4>
              <div className="space-y-2">
                {TIME_SLOTS.map(t=>(
                  <label key={t.id} className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="checkbox" checked={timeFilters.includes(t.id)} onChange={()=>toggleTime(t.id)} className="rounded accent-primary"/>
                    <span>{t.icon} {t.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="md:col-span-3">
          {!searched && !searching && (
            <div className="text-center py-24 text-muted-foreground">
              <Train className="w-12 h-12 mx-auto mb-4 text-primary/30"/>
              <p className="text-lg font-medium text-primary">Find your train</p>
              <p className="text-sm mt-1">Enter origin, destination and date above</p>
            </div>
          )}
          {searching && (
            <div className="text-center py-24"><Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4"/><p className="text-muted-foreground">Finding trains…</p></div>
          )}
          {searched && !searching && (
            <>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-sm text-muted-foreground">{filtered.length} train{filtered.length!==1?"s":""} found</p>
                  {date && <p className="text-xs text-muted-foreground mt-0.5">Showing availability for {formatDisplayDate(date)}</p>}
                </div>
                {!isRailwayApiConfigured() && <Badge variant="outline" className="text-xs">Sample Data</Badge>}
                {isRailwayApiConfigured() && <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">Live IRCTC</Badge>}
              </div>
              {filtered.length === 0 ? (
                <div className="text-center py-16 glass rounded-2xl border border-border/30">
                  <p className="text-muted-foreground">No trains found. Try different filters or dates.</p>
                </div>
              ) : (
                filtered.map(t=>(
                  <div key={t.id} className="glass rounded-[20px] p-6 border border-border/30 mb-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-serif text-xl text-primary">{t.trainName}</h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>#{t.trainNumber}</span>
                          <span>Runs: {t.runningDays}</span>
                          {t.distance && <span>{t.distance} km</span>}
                        </div>
                      </div>
                      <Badge className="bg-green-50 text-green-700 border-green-200 text-xs shrink-0">🌿 Low Carbon</Badge>
                    </div>
                    <div className="flex items-center gap-4 mb-5">
                      <div className="text-center"><div className="font-serif text-2xl text-primary">{t.departure}</div><div className="text-xs text-muted-foreground mt-0.5">{t.from}</div></div>
                      <div className="flex-1 text-center px-3">
                        <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1"><Clock className="w-3 h-3"/>{t.duration}</div>
                        <div className="h-px bg-border/60 relative"><div className="absolute inset-0 flex items-center justify-center"><Train className="w-3 h-3 bg-background text-muted-foreground"/></div></div>
                      </div>
                      <div className="text-center"><div className="font-serif text-2xl text-primary">{t.arrival}</div><div className="text-xs text-muted-foreground mt-0.5">{t.to}</div></div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {t.classes.map(c=>(
                        <div key={c.name} className={`px-3 py-2 rounded-xl border text-xs text-center min-w-[64px] ${!c.available?"opacity-40 border-border/30 bg-surface-container":"border-border/40 bg-white/50"}`}>
                          <div className="font-bold text-primary">{c.name}</div>
                          {c.price>0&&<div className="text-muted-foreground">₹{c.price}</div>}
                          <div className={`text-[10px] font-semibold mt-0.5 ${c.available?"text-green-600":"text-red-400"}`}>{c.available?(c.availableSeats?`${c.availableSeats} avbl`:"Avbl"):"WL"}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border/30">
                      <span className="text-sm text-muted-foreground">{t.availableSeats>0?`${t.availableSeats} seats available`:""}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" className="text-sm px-5 py-2" onClick={()=>setSelectedTrain(t)}>Select Seats</Button>
                        <Button className="btn-primary text-sm px-5 py-2" onClick={()=>navigate("/checkout")}>Book Now</Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Seat Selection (inline sub-page) ──────────────────────────
function SeatSelectionPage({ train, date, onBack }: { train: LiveTrain; date: string; onBack: () => void }) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState(train.classes.find(c=>c.available)?.name || "SL");
  const [passenger, setPassenger] = useState({ name:"", age:"", gender:"" });

  // Generate a simple seat grid based on class
  const coachLabel = selectedClass === "1A" ? "A1 (AC First)" : selectedClass === "2A" ? "A2 (AC 2 Tier)" : selectedClass === "3A" ? "B1 (AC 3 Tier)" : "S1 (Sleeper)";
  const rows = selectedClass === "1A" ? 4 : selectedClass === "2A" ? 6 : 8;
  const cols = selectedClass === "1A" ? ["A","B"] : selectedClass === "2A" ? ["A","B","C","D"] : ["A","B","C","D","E"];
  const occupied = ["2A","2C","4B","5E","7A"];

  const toggleSeat = (seat: string) => {
    if (occupied.includes(seat)) return;
    setSelectedSeats(p => p.includes(seat) ? p.filter(s=>s!==seat) : [...p, seat]);
  };

  const basePrice = train.classes.find(c=>c.name===selectedClass)?.price || 500;
  const ecoFee = 150;
  const tax = Math.round(basePrice * 0.05);
  const total = basePrice + ecoFee + tax;

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4"/> Back to Search
        </button>
        <h1 className="font-serif text-4xl text-primary mb-2">Select Your Seat</h1>
        <p className="text-muted-foreground mb-8">{train.trainName} · Coach {coachLabel}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat map */}
          <div className="lg:col-span-2">
            {/* Class selector */}
            <div className="flex gap-2 flex-wrap mb-6">
              {train.classes.filter(c=>c.available).map(c=>(
                <button key={c.name} onClick={()=>setSelectedClass(c.name)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${selectedClass===c.name?"bg-primary text-white border-primary":"border-border/50 text-muted-foreground hover:border-primary/30"}`}>
                  {c.name} {c.price>0&&`· ₹${c.price}`}
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="flex gap-4 text-xs text-muted-foreground mb-5">
              <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded bg-primary/10 border border-primary/30 inline-block"/><span className="font-medium text-primary">Available</span></span>
              <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded bg-primary text-white flex items-center justify-center inline-flex text-[8px]">✓</span><span>Selected</span></span>
              <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded bg-surface-container border border-border/30 inline-block"/><span>Occupied</span></span>
            </div>

            {/* Coach diagram */}
            <div className="glass rounded-[20px] p-6 border border-border/30">
              <div className="text-center mb-4">
                <div className="inline-block bg-surface-container rounded-full px-4 py-1 text-xs text-muted-foreground font-semibold">↑ Front of Train</div>
              </div>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {Array.from({length: rows}, (_,ri)=>(
                  <div key={ri} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-5 text-center">{ri+1}</span>
                    <div className="flex gap-1.5 flex-1">
                      {cols.slice(0,Math.ceil(cols.length/2)).map(col=>{
                        const seat = `${ri+1}${col}`;
                        const isOccupied = occupied.includes(seat);
                        const isSelected = selectedSeats.includes(seat);
                        return (
                          <button key={seat} onClick={()=>toggleSeat(seat)}
                            className={`w-9 h-9 rounded-lg text-xs font-bold border transition-all ${isOccupied?"bg-surface-container border-border/30 cursor-not-allowed text-muted-foreground/40":isSelected?"bg-primary text-white border-primary shadow-sm":"bg-primary/8 border-primary/20 text-primary hover:bg-primary/15"}`}>
                            {isSelected?"✓":seat}
                          </button>
                        );
                      })}
                      <div className="flex-1 flex justify-center items-center">
                        <div className="h-full w-px bg-border/40"/>
                      </div>
                      {cols.slice(Math.ceil(cols.length/2)).map(col=>{
                        const seat = `${ri+1}${col}`;
                        const isOccupied = occupied.includes(seat);
                        const isSelected = selectedSeats.includes(seat);
                        return (
                          <button key={seat} onClick={()=>toggleSeat(seat)}
                            className={`w-9 h-9 rounded-lg text-xs font-bold border transition-all ${isOccupied?"bg-surface-container border-border/30 cursor-not-allowed text-muted-foreground/40":isSelected?"bg-primary text-white border-primary shadow-sm":"bg-primary/8 border-primary/20 text-primary hover:bg-primary/15"}`}>
                            {isSelected?"✓":seat}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Passenger + Fare */}
          <div className="space-y-5">
            {/* Passenger details */}
            <div className="glass rounded-[24px] p-6 border border-border/30">
              <h3 className="font-serif text-xl text-primary mb-4">Traveller Details</h3>
              {selectedSeats.length > 0 && (
                <div className="text-xs text-secondary font-semibold mb-3">
                  Seat{selectedSeats.length>1?"s":""}: {selectedSeats.join(", ")} · {coachLabel}
                </div>
              )}
              <div className="space-y-3">
                <input value={passenger.name} onChange={e=>setPassenger(p=>({...p,name:e.target.value}))}
                  placeholder="Full Name" className="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-border/50 text-sm focus:outline-none focus:border-primary/50"/>
                <input value={passenger.age} onChange={e=>setPassenger(p=>({...p,age:e.target.value}))}
                  placeholder="Age" className="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-border/50 text-sm focus:outline-none focus:border-primary/50"/>
                <select value={passenger.gender} onChange={e=>setPassenger(p=>({...p,gender:e.target.value}))}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-border/50 text-sm focus:outline-none appearance-none">
                  <option value="">Select Gender</option>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
            </div>

            {/* Fare summary */}
            <div className="glass rounded-[24px] p-6 border border-border/30">
              <h3 className="font-serif text-xl text-primary mb-4">Fare Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Fare {selectedSeats.length>0&&`(${selectedSeats.length} seat${selectedSeats.length>1?"s":""})`}</span>
                  <span className="font-semibold">₹{(basePrice*(selectedSeats.length||1)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-xs">🌿 Nature Conservancy Fee</span>
                  <span className="font-semibold">₹{ecoFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes & GST</span>
                  <span className="font-semibold">₹{tax}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-border/30 font-bold text-base">
                  <span>Total Amount</span>
                  <span className="font-serif text-xl text-primary">₹{(total*(selectedSeats.length||1)).toLocaleString()}</span>
                </div>
              </div>
              <Button className="btn-primary w-full py-4 mt-5 text-base" onClick={()=>window.location.href="/checkout"}>
                Proceed to Payment <ArrowRight className="w-4 h-4 ml-2"/>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
