import { useState } from "react";
import { ArrowLeft, Bus, Clock, Filter, RotateCcw, Loader2, Search, ArrowRight, Leaf, Wind, Wifi, Zap, Coffee } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BUSES, MAJOR_CITIES } from "@/lib/api";

const AC_OPTS    = [{ id:"ac",    label:"AC" },{ id:"nonac", label:"Non-AC (Natural Breeze)" }];
const SEAT_OPTS  = [{ id:"sleeper",label:"Sleeper" },{ id:"semi",label:"Semi-Sleeper" },{ id:"seater",label:"Seater" }];
const BOARD_PTS  = ["Kashmere Gate ISBT","Majnu Ka Tila","R K Ashram","Anand Vihar ISBT","Sarai Kale Khan"];
const AMENITY_ICONS: Record<string,React.ReactNode> = {
  "AC":<Wind className="w-3 h-3"/>,"WiFi":<Wifi className="w-3 h-3"/>,
  "USB Charging":<Zap className="w-3 h-3"/>,"Snacks":<Coffee className="w-3 h-3"/>,
};

type BusWithSeat = typeof BUSES[0] & { ecoScore?: number };

export default function BusSearchPage() {
  const [from, setFrom]     = useState("Delhi");
  const [to, setTo]         = useState("Manali");
  const [date, setDate]     = useState(new Date().toISOString().split("T")[0]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched]   = useState(false);
  const [acFilter, setAcFilter]   = useState<string[]>([]);
  const [seatFilter, setSeatFilter] = useState<string[]>([]);
  const [boardFilter, setBoardFilter] = useState<string[]>([]);
  const [selectedBus, setSelectedBus] = useState<BusWithSeat | null>(null);

  const toggleAc    = (v:string) => setAcFilter(p=>p.includes(v)?p.filter(x=>x!==v):[...p,v]);
  const toggleSeat  = (v:string) => setSeatFilter(p=>p.includes(v)?p.filter(x=>x!==v):[...p,v]);
  const toggleBoard = (v:string) => setBoardFilter(p=>p.includes(v)?p.filter(x=>x!==v):[...p,v]);

  const handleSearch = () => {
    setSearching(true);
    setTimeout(()=>{ setSearched(true); setSearching(false); }, 900);
  };

  const enriched: BusWithSeat[] = BUSES.map((b,i)=>({ ...b, ecoScore: [9.2,7.8,8.5,9.0,8.2,7.5,9.4][i%7] }));
  const display = searched ? enriched : [];

  if (selectedBus) return <BusSeatSelectionPage bus={selectedBus} onBack={()=>setSelectedBus(null)}/>;

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <div className="bg-primary text-white py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-5 text-sm">
            <Link href="/travel"><button className="text-white/70 hover:text-white flex items-center gap-1"><ArrowLeft className="w-4 h-4"/>Travel</button></Link>
            <span className="text-white/40">/</span><span className="text-white/80">Bus Search</span>
          </div>
          <div className="glass rounded-[20px] p-5 border border-white/20 bg-white/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-white/60 uppercase tracking-wider mb-1 block">From</label>
                <input list="bus-from" value={from} onChange={e=>setFrom(e.target.value)} className="w-full bg-white/15 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-white/50"/>
                <datalist id="bus-from">{MAJOR_CITIES.map(c=><option key={c} value={c}/>)}</datalist>
              </div>
              <div>
                <label className="text-xs text-white/60 uppercase tracking-wider mb-1 block">To</label>
                <input list="bus-to" value={to} onChange={e=>setTo(e.target.value)} className="w-full bg-white/15 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-white/50"/>
                <datalist id="bus-to">{MAJOR_CITIES.map(c=><option key={c} value={c}/>)}</datalist>
              </div>
              <div>
                <label className="text-xs text-white/60 uppercase tracking-wider mb-1 block">Date</label>
                <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full bg-white/15 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-white/50"/>
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch} disabled={searching} className="w-full bg-white text-primary hover:bg-white/90 rounded-xl py-2.5 font-semibold">
                  {searching?<Loader2 className="w-4 h-4 animate-spin mr-1"/>:<Search className="w-4 h-4 mr-1"/>}
                  {searching?"Searching…":"Search Buses"}
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
            <div className="flex items-center justify-between border-b border-border/30 pb-4">
              <div className="flex items-center gap-2 font-semibold text-primary"><Filter className="w-4 h-4"/>Filters</div>
              <button onClick={()=>{setAcFilter([]);setSeatFilter([]);setBoardFilter([]);}} className="text-xs text-secondary hover:text-primary flex items-center gap-1"><RotateCcw className="w-3 h-3"/>Reset</button>
            </div>
            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">AC Setup</h4>
              {AC_OPTS.map(o=>(
                <label key={o.id} className="flex items-center gap-2 text-sm mb-2 cursor-pointer">
                  <input type="checkbox" checked={acFilter.includes(o.id)} onChange={()=>toggleAc(o.id)} className="rounded accent-primary"/>
                  {o.label}
                </label>
              ))}
            </div>
            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Seating Style</h4>
              {SEAT_OPTS.map(o=>(
                <label key={o.id} className="flex items-center gap-2 text-sm mb-2 cursor-pointer">
                  <input type="checkbox" checked={seatFilter.includes(o.id)} onChange={()=>toggleSeat(o.id)} className="rounded accent-primary"/>
                  {o.label}
                </label>
              ))}
            </div>
            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Boarding Points</h4>
              {BOARD_PTS.map(b=>(
                <label key={b} className="flex items-center gap-2 text-sm mb-2 cursor-pointer">
                  <input type="checkbox" checked={boardFilter.includes(b)} onChange={()=>toggleBoard(b)} className="rounded accent-primary"/>
                  {b}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="md:col-span-3">
          {!searched && !searching && (
            <div className="text-center py-24">
              <Bus className="w-12 h-12 mx-auto mb-4 text-primary/30"/>
              <p className="text-lg font-medium text-primary">The Open Road Awaits</p>
              <p className="text-sm mt-1 text-muted-foreground">Enter route details above to find buses</p>
            </div>
          )}
          {searching && <div className="text-center py-24"><Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4"/><p className="text-muted-foreground">Finding scenic routes…</p></div>}
          {searched && !searching && (
            <>
              <p className="text-sm text-muted-foreground mb-5">{display.length} buses found · {from} → {to}</p>
              {display.map(b=>(
                <div key={b.id} className="glass rounded-[20px] p-6 border border-border/30 mb-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="font-serif text-xl text-primary">{b.busName}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{b.busType} · {b.operator}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Leaf className="w-3.5 h-3.5 text-green-600 fill-green-600"/>
                      <span className="text-xs font-bold text-green-700">{b.ecoScore} Eco-Score</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="text-center shrink-0">
                      <div className="font-serif text-2xl text-primary">{b.departure}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{b.from}</div>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1"><Clock className="w-3 h-3"/>Scenic Route · {b.duration}</div>
                      <div className="h-px bg-border/60 relative"><div className="absolute inset-0 flex items-center justify-center"><Bus className="w-3 h-3 bg-background text-muted-foreground"/></div></div>
                    </div>
                    <div className="text-center shrink-0">
                      <div className="font-serif text-2xl text-primary">{b.arrival}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{b.to}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {b.amenities.map(a=>(
                      <span key={a} className="flex items-center gap-1 text-xs bg-surface-container rounded-full px-2.5 py-1 text-muted-foreground">
                        {AMENITY_ICONS[a]||null} {a}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border/30">
                    <div>
                      <span className="line-through text-muted-foreground text-sm mr-2">₹{Math.round(b.price*1.15)}</span>
                      <span className="font-bold text-primary text-lg">₹{b.price}</span>
                      <span className="text-xs text-muted-foreground"> per seat</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="text-sm px-5" onClick={()=>setSelectedBus(b)}>Select Seats</Button>
                      <Button className="btn-primary text-sm px-5" onClick={()=>window.location.href="/checkout"}>Book Now <ArrowRight className="w-4 h-4 ml-1"/></Button>
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

// ── Bus Seat Selection ─────────────────────────────────────────
function BusSeatSelectionPage({ bus, onBack }: { bus: BusWithSeat; onBack: ()=>void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [name1, setName1] = useState("");
  const [age1,  setAge1]  = useState("");
  const [name2, setName2] = useState("");
  const [age2,  setAge2]  = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const isSleeper  = bus.busType.toLowerCase().includes("sleeper");
  const occupied   = ["L2","L3","U1","U4","L8"];
  const lowerSeats = ["L1","L2","L3","L4","L5","L6","L7","L8","L9","L10"];
  const upperSeats = ["U1","U2","U3","U4","U5","U6","U7","U8"];

  const toggleSeat = (s:string) => {
    if (occupied.includes(s)) return;
    setSelected(p=>p.includes(s)?p.filter(x=>x!==s):p.length<2?[...p,s]:p);
  };

  const basePrice  = bus.price * selected.length;
  const ecoFee     = 100;
  const taxes      = Math.round(basePrice * 0.05);
  const total      = basePrice + ecoFee + taxes;

  const SeatBtn = ({ id }:{id:string}) => {
    const isOcc = occupied.includes(id);
    const isSel = selected.includes(id);
    return (
      <button onClick={()=>toggleSeat(id)}
        className={`rounded-lg text-xs font-bold border transition-all flex items-center justify-center
          ${isSleeper?"w-16 h-10":"w-10 h-10"}
          ${isOcc?"bg-surface-container border-border/30 cursor-not-allowed text-muted-foreground/40"
          :isSel?"bg-primary text-white border-primary shadow-sm"
          :"bg-primary/8 border-primary/20 text-primary hover:bg-primary/15"}`}>
        {isSel?"✓":id}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4"/> Back to Results
        </button>
        <h1 className="font-serif text-4xl text-primary mb-1">Select Your Sanctuary</h1>
        <p className="text-muted-foreground mb-2">Choose your perspective for the journey ahead.</p>
        <p className="text-sm font-semibold text-primary mb-8">{bus.busName} · {bus.from} → {bus.to}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bus layout */}
          <div className="lg:col-span-2">
            {/* Legend */}
            <div className="flex gap-4 text-xs text-muted-foreground mb-5">
              <span className="flex items-center gap-1.5"><span className="w-8 h-6 rounded bg-primary/8 border border-primary/20 inline-block"/><span className="font-medium text-primary">Available</span></span>
              <span className="flex items-center gap-1.5"><span className="w-8 h-6 rounded bg-primary inline-block"/><span>Selected</span></span>
              <span className="flex items-center gap-1.5"><span className="w-8 h-6 rounded bg-surface-container border border-border/30 inline-block"/><span>Occupied</span></span>
            </div>

            <div className="glass rounded-[24px] p-6 border border-border/30">
              {/* Steering */}
              <div className="flex justify-end mb-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-surface-container rounded-full px-3 py-1">🚌 Driver's Cab</div>
              </div>

              {/* Lower deck */}
              <div className="mb-6">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Lower Deck</p>
                <div className="grid grid-cols-5 gap-2">
                  {lowerSeats.map(s=><SeatBtn key={s} id={s}/>)}
                </div>
              </div>

              {isSleeper && (
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 mt-2">Upper Deck</p>
                  <div className="grid grid-cols-5 gap-2">
                    {upperSeats.map(s=><SeatBtn key={s} id={s}/>)}
                  </div>
                </div>
              )}

              {/* Rear window label */}
              <div className="flex justify-center mt-6">
                <div className="text-xs text-muted-foreground bg-surface-container rounded-full px-3 py-1">Rear Window</div>
              </div>
            </div>

            {selected.length > 0 && (
              <div className="mt-4 flex gap-2 flex-wrap">
                {selected.map(s=>(
                  <Badge key={s} className="bg-primary/10 text-primary border-primary/20">
                    {isSleeper?"🛏":"💺"} Seat {s}
                    <button onClick={()=>setSelected(p=>p.filter(x=>x!==s))} className="ml-1 hover:text-red-500">×</button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Passenger + Fare */}
          <div className="space-y-5">
            <div className="glass rounded-[24px] p-6 border border-border/30">
              <h3 className="font-serif text-xl text-primary mb-4">Passenger Details</h3>
              <div className="space-y-4">
                {selected.length > 0 && (
                  <p className="text-xs font-semibold text-secondary">Seat {selected[0]}</p>
                )}
                <input value={name1} onChange={e=>setName1(e.target.value)} placeholder="Full Name" className="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-border/50 text-sm focus:outline-none focus:border-primary/50"/>
                <input value={age1} onChange={e=>setAge1(e.target.value)} placeholder="Age" className="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-border/50 text-sm focus:outline-none focus:border-primary/50"/>
                {selected.length > 1 && (
                  <>
                    <p className="text-xs font-semibold text-secondary mt-2">Seat {selected[1]}</p>
                    <input value={name2} onChange={e=>setName2(e.target.value)} placeholder="Full Name" className="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-border/50 text-sm focus:outline-none focus:border-primary/50"/>
                    <input value={age2} onChange={e=>setAge2(e.target.value)} placeholder="Age" className="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-border/50 text-sm focus:outline-none focus:border-primary/50"/>
                  </>
                )}
                <div className="border-t border-border/30 pt-4 space-y-3">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Contact Information</p>
                  <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email Address" className="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-border/50 text-sm focus:outline-none focus:border-primary/50"/>
                  <input value={phone} onChange={e=>setPhone(e.target.value)} type="tel" placeholder="Phone Number" className="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-border/50 text-sm focus:outline-none focus:border-primary/50"/>
                </div>
              </div>
            </div>

            <div className="glass rounded-[24px] p-6 border border-border/30">
              <h3 className="font-serif text-xl text-primary mb-4">Journey Summary</h3>
              <div className="text-sm space-y-2 mb-4 text-muted-foreground">
                <div className="flex justify-between"><span>{bus.busName}</span></div>
                <div className="flex justify-between"><span>{bus.departure} → {bus.arrival}</span><span>{bus.duration}</span></div>
                <div className="flex justify-between"><span>{bus.from} → {bus.to}</span></div>
              </div>
              <div className="space-y-2 text-sm border-t border-border/30 pt-4">
                <div className="flex justify-between"><span className="text-muted-foreground">Base Fare ({selected.length||1}× {isSleeper?"Sleeper":"Seat"})</span><span className="font-semibold">₹{(bus.price*(selected.length||1)).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground text-xs">🌿 Nature Conservancy Fee</span><span className="font-semibold">₹{ecoFee}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Taxes & Fees</span><span className="font-semibold">₹{taxes}</span></div>
                <div className="flex justify-between pt-3 border-t border-border/30 font-bold text-base">
                  <span>Total</span>
                  <span className="font-serif text-xl text-primary">₹{selected.length>0?total.toLocaleString():bus.price}</span>
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
