import { useState, useMemo } from "react";
import { MapPin, Leaf, Star, Heart, SlidersHorizontal, X, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { STAYS, DESTINATIONS } from "@/lib/api";

const ENV_TYPES = ["Eco-Lodges","Boutique Homestays","Wilderness Camps"];
const ESSENTIALS = ["Farm-to-Table","River View","Meditation Space","Local Guides","Star Gazing","Yoga Studio"];

export default function StaysMapPage() {
  const [destination, setDestination] = useState("Kasol");
  const [checkin,  setCheckin]  = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests,   setGuests]   = useState("2");
  const [minPrice, setMinPrice] = useState(1000);
  const [maxPrice, setMaxPrice] = useState(25000);
  const [envTypes, setEnvTypes] = useState<string[]>([]);
  const [essentials, setEssentials] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeStay, setActiveStay] = useState<number | null>(null);

  const toggleEnv  = (v:string) => setEnvTypes(p=>p.includes(v)?p.filter(x=>x!==v):[...p,v]);
  const toggleEss  = (v:string) => setEssentials(p=>p.includes(v)?p.filter(x=>x!==v):[...p,v]);
  const toggleWish = (id:number) => setWishlist(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);

  const filtered = useMemo(()=>
    STAYS.filter(s=>s.pricePerNight>=minPrice && s.pricePerNight<=maxPrice), [minPrice,maxPrice]);

  const activeStayData = activeStay ? STAYS.find(s=>s.id===activeStay) : null;

  return (
    <div className="min-h-screen bg-background pt-20 flex flex-col">
      {/* Top bar */}
      <div className="glass border-b border-border/30 px-6 py-4 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-surface-container rounded-full px-4 py-2 text-sm">
              <MapPin className="w-4 h-4 text-primary"/><span className="font-semibold text-primary">{filtered.length} Stays</span>
              <span className="text-muted-foreground">in {destination}</span>
            </div>
            {checkin && <div className="flex items-center gap-2 bg-surface-container rounded-full px-4 py-2 text-sm text-muted-foreground">📅 {checkin} → {checkout}</div>}
            <div className="flex items-center gap-2 bg-surface-container rounded-full px-4 py-2 text-sm text-muted-foreground">👤 {guests} Guests</div>
          </div>
          <Button variant="outline" onClick={()=>setShowFilters(!showFilters)} className="flex items-center gap-2 text-sm rounded-full">
            <SlidersHorizontal className="w-4 h-4"/> Refine Retreats
            {(envTypes.length+essentials.length)>0 && <Badge className="bg-primary text-white text-xs">{envTypes.length+essentials.length}</Badge>}
          </Button>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="max-w-7xl mx-auto mt-5 pt-5 border-t border-border/30 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                Nightly Rate: ₹{minPrice.toLocaleString()} – ₹{maxPrice>=25000?"25k+":maxPrice.toLocaleString()}
              </label>
              <div className="flex gap-3 items-center">
                <input type="range" min={1000} max={25000} step={500} value={minPrice} onChange={e=>setMinPrice(Number(e.target.value))} className="flex-1 accent-primary"/>
                <input type="range" min={1000} max={25000} step={500} value={maxPrice} onChange={e=>setMaxPrice(Number(e.target.value))} className="flex-1 accent-primary"/>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Sanctuary Type</label>
              <div className="flex flex-wrap gap-2">
                {ENV_TYPES.map(t=>(
                  <button key={t} onClick={()=>toggleEnv(t)} className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all ${envTypes.includes(t)?"bg-primary text-white border-primary":"border-border/50 text-muted-foreground hover:border-primary/30"}`}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Essentials</label>
              <div className="flex flex-wrap gap-2">
                {ESSENTIALS.map(e=>(
                  <button key={e} onClick={()=>toggleEss(e)} className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all ${essentials.includes(e)?"bg-secondary text-white border-secondary":"border-border/50 text-muted-foreground hover:border-secondary/30"}`}>{e}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main content: list + map */}
      <div className="flex flex-1 overflow-hidden max-w-7xl mx-auto w-full px-6 py-6 gap-6">
        {/* Stays list */}
        <div className="w-full md:w-[420px] shrink-0 overflow-y-auto pr-2 space-y-4 hide-scrollbar">
          {filtered.map(stay=>(
            <div key={stay.id}
              onClick={()=>setActiveStay(stay.id===activeStay?null:stay.id)}
              className={`glass rounded-[20px] overflow-hidden border cursor-pointer transition-all hover:shadow-lg ${activeStay===stay.id?"border-primary shadow-md ring-2 ring-primary/20":"border-border/30"}`}>
              <div className="relative h-44 overflow-hidden">
                <img src={stay.imageUrl} alt={stay.name} className="w-full h-full object-cover"/>
                <button onClick={e=>{e.stopPropagation();toggleWish(stay.id);}}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${wishlist.includes(stay.id)?"bg-red-500 text-white":"bg-white/80 text-muted-foreground hover:text-red-500"}`}>
                  <Heart className={`w-4 h-4 ${wishlist.includes(stay.id)?"fill-current":""}`}/>
                </button>
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1">
                  <Leaf className="w-3 h-3 text-green-600 fill-green-600"/>
                  <span className="text-xs font-bold text-green-700">{stay.ecoRating}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-serif text-lg text-primary leading-tight">{stay.name}</h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400"/>
                    <span className="text-xs font-bold">{stay.ecoRating}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                  <MapPin className="w-3 h-3"/>
                  {stay.destinationName}, {stay.state}
                  <span className="ml-2">· {Math.round(stay.latitude*100)%10+1}km to trail</span>
                </p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {stay.amenities.slice(0,3).map(a=><span key={a} className="text-xs bg-surface-container rounded-full px-2 py-0.5 text-muted-foreground">{a}</span>)}
                </div>
                <div className="flex items-center justify-between">
                  <div><span className="font-serif text-lg text-primary font-semibold">₹{stay.pricePerNight.toLocaleString()}</span><span className="text-xs text-muted-foreground"> /night</span></div>
                  <Link href={`/stays/${stay.id}`} onClick={e=>e.stopPropagation()}>
                    <Button className="btn-primary text-xs px-4 py-2">Book Now</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {filtered.length===0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p>No stays match your filters.</p>
              <button onClick={()=>{setMinPrice(1000);setMaxPrice(25000);setEnvTypes([]);setEssentials([]);}} className="mt-3 text-secondary text-sm font-semibold">Reset Filters</button>
            </div>
          )}
        </div>

        {/* Map placeholder */}
        <div className="hidden md:flex flex-1 rounded-[24px] overflow-hidden border border-border/30 relative bg-surface-container/60">
          {/* Decorative map-like grid */}
          <div className="absolute inset-0 opacity-10" style={{backgroundImage:"linear-gradient(#154212 1px,transparent 1px),linear-gradient(90deg,#154212 1px,transparent 1px)",backgroundSize:"40px 40px"}}/>
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
            <div className="glass rounded-[24px] p-6 text-center max-w-sm border border-border/30">
              <MapPin className="w-10 h-10 text-primary mx-auto mb-3"/>
              <h3 className="font-serif text-xl text-primary mb-2">Interactive Map</h3>
              <p className="text-sm text-muted-foreground mb-4">Add <code className="bg-surface-container px-1.5 py-0.5 rounded text-xs">VITE_GOOGLE_MAPS_API_KEY</code> to your .env to enable the live map view with stay pins.</p>
              <Link href="/stays"><Button variant="outline" className="text-sm rounded-full">Browse All Stays <ArrowRight className="w-4 h-4 ml-1"/></Button></Link>
            </div>
          </div>

          {/* Pin markers for each stay */}
          {filtered.map((stay,i)=>(
            <button key={stay.id} onClick={()=>setActiveStay(stay.id===activeStay?null:stay.id)}
              style={{ position:"absolute", left:`${15+(i*12)%65}%`, top:`${20+(i*17)%55}%` }}
              className={`group flex items-center gap-1 transition-all ${activeStay===stay.id?"z-20 scale-110":""}`}>
              <div className={`px-2.5 py-1.5 rounded-full text-xs font-bold shadow-lg transition-all ${activeStay===stay.id?"bg-primary text-white":"bg-white text-primary hover:bg-primary hover:text-white"}`}>
                ₹{(stay.pricePerNight/1000).toFixed(1)}k
              </div>
            </button>
          ))}

          {/* Active stay popup */}
          {activeStayData && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass rounded-[20px] p-4 border border-border/30 shadow-xl flex items-center gap-4 w-72">
              <img src={activeStayData.imageUrl} alt={activeStayData.name} className="w-16 h-16 rounded-xl object-cover shrink-0"/>
              <div className="flex-1 min-w-0">
                <h4 className="font-serif text-primary font-semibold text-sm leading-tight line-clamp-1">{activeStayData.name}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{activeStayData.destinationName}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-primary text-sm">₹{activeStayData.pricePerNight.toLocaleString()}</span>
                  <button onClick={()=>setActiveStay(null)} className="text-muted-foreground hover:text-primary"><X className="w-3.5 h-3.5"/></button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
