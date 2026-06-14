import { useState, useMemo, useEffect } from "react";
import { Search, Map, Star, Heart, Leaf, SlidersHorizontal, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { STAYS } from "@/lib/api";
import { searchHotels, searchDestinationId, isHotelsApiConfigured, type HotelResult } from "@/lib/hotelsApi";
import { useToast } from "@/hooks/use-toast";
import { useDestinationImage } from "@/hooks/useDestinationImage";
import { Link, useSearch } from "wouter";


const REGION_CHIPS = ["All","Himachal Pradesh","Uttarakhand","Kerala","Ladakh","Rajasthan","Goa","Karnataka","Meghalaya"];
const ENV_TYPES = ["Mountains","Forest","River","Backwaters","Desert","Beach"];

type DisplayStay = {
  id: string | number; name: string; destinationName: string; state: string;
  environment: string; ecoRating: number; pricePerNight: number; imageUrl: string;
  description: string; amenities: string[]; isLive?: boolean; reviewScore?: number;
  reviewCount?: number; isFreeCancel?: boolean; deepLink?: string;
};

function toDisplayStay(s: typeof STAYS[0]): DisplayStay {
  return { ...s, id: s.id, amenities: s.amenities || [] };
}
function hotelToDisplay(h: HotelResult): DisplayStay {
  return {
    id: h.id, name: h.name, destinationName: h.city, state: h.city,
    environment: "Hotels", ecoRating: h.reviewScore / 2,
    pricePerNight: h.pricePerNight, imageUrl: h.imageUrl,
    description: h.description || `${h.starRating}-star property in ${h.city}. ${h.isBreakfastIncluded ? "Breakfast included. " : ""}${h.isFreeCancel ? "Free cancellation." : ""}`,
    amenities: h.facilities.slice(0,4),
    isLive: true, reviewScore: h.reviewScore, reviewCount: h.reviewCount, isFreeCancel: h.isFreeCancel,
    deepLink: h.deepLink,
  };
}

export default function StaysPage() {
  const { toast } = useToast();
  const [region, setRegion]       = useState("All");
  const [envFilter, setEnvFilter] = useState<string[]>([]);
  const [minEco, setMinEco]       = useState(3);
  const [maxPrice, setMaxPrice]   = useState(25000);
  const [wishlist, setWishlist]   = useState<(string|number)[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [liveHotels, setLiveHotels]   = useState<DisplayStay[]>([]);
  const [loadingLive, setLoadingLive] = useState(false);
  const [checkin,  setCheckin]  = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests,   setGuests]   = useState("2");
  const apiReady = isHotelsApiConfigured();
  // 1. Grab the URL query string from wouter
  const searchString = useSearch();
  
  // 2. Extract the city (this catches ?city=, ?search=, or ?q=)
  const queryCity = useMemo(() => {
    const params = new URLSearchParams(searchString);
    return params.get("city") || params.get("search") || params.get("q") || "";
  }, [searchString]);

  // 3. Initialize your search input with the URL parameter
  const [city, setCity] = useState(queryCity);

  // 4. Update the input field if the URL changes while you're already on the page
  useEffect(() => {
    if (queryCity && queryCity !== city) {
      setCity(queryCity);
    }
  }, [queryCity]);

  const toggleEnv  = (v:string) => setEnvFilter(p=>p.includes(v)?p.filter(x=>x!==v):[...p,v]);
  const toggleWish = (id:string|number) => setWishlist(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);

  const staticFiltered = useMemo(() => STAYS.filter(s => {
    const regionMatch = region === "All" || s.state === region;
    const envMatch    = envFilter.length === 0 || envFilter.includes(s.environment);
    const ecoMatch    = s.ecoRating >= minEco;
    const priceMatch  = s.pricePerNight <= maxPrice;
    
    // Changed `searchQ` to `city` so it actually hooks up to your input
    const searchMatch = !city || 
      s.name.toLowerCase().includes(city.toLowerCase()) || 
      s.destinationName.toLowerCase().includes(city.toLowerCase());
      
    return regionMatch && envMatch && ecoMatch && priceMatch && searchMatch;
  }), [region, envFilter, minEco, maxPrice, city]); // Added city to dependencies

  const allStays: DisplayStay[] = [
    ...liveHotels,
    ...staticFiltered.map(toDisplayStay).filter(
  s =>
    !liveHotels.some(
      h =>
        h.name.toLowerCase() ===
        s.name.toLowerCase()
    )
),
  ];

  // Add an optional 'overrideCity' parameter
  const searchLiveHotels = async (overrideCity?: string) => {
    // Check either the override passed from the URL, or the local input state
    const targetCity = overrideCity || city; 

    if (!targetCity.trim()) {
      return;
    }
    
    setLoadingLive(true); 

    try {
      const searchLocation = targetCity.trim() || region;

      const destId = await searchDestinationId(
        `${searchLocation}, India`
      );
      
      if (!destId) { 
        setLiveHotels([]); 
        return; 
      }
      
      const today = new Date(); 
      const tomorrow = new Date(today); tomorrow.setDate(today.getDate()+1);
      const fmt = (d:Date) => d.toISOString().split("T")[0];
      
      const results = await searchHotels({
        destId, 
        checkin: checkin || fmt(today), 
        checkout: checkout || fmt(tomorrow),
        adults: parseInt(guests) || 2, 
        minScore: minEco * 1.5,
      });
      
      setLiveHotels(results.slice(0,12).map(hotelToDisplay));
      toast({title:`Found ${results.length} live properties in ${searchLocation}`});
      
    } catch (err) {
      console.error(err);
      setLiveHotels([]);
      toast({title: "Showing curated stays", description: "Live search unavailable.", variant: "destructive"});
    } finally {
      setLoadingLive(false); 
    }
  };

  // Auto-run the live API if a city was passed from the Navbar
  useEffect(() => {
    if (queryCity && apiReady) {
      searchLiveHotels(queryCity);
    }
  }, [queryCity, apiReady]);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <header className="md:hidden fixed top-0 left-0 w-full z-50 px-5 pt-safe pt-4 pb-3 flex justify-between items-center"
        style={{background:"rgba(255,255,255,0.88)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(194,201,187,0.35)"}}>
        <span className="font-serif text-xl text-primary italic">GreenTrail India</span>
        <div className="flex items-center gap-3">
          <button onClick={()=>setShowFilters(v=>!v)} className={`text-primary transition-colors ${showFilters?"text-secondary":""}`}>
            <SlidersHorizontal className="w-5 h-5"/>
          </button>
          <Link href="/stays/map">
            <button className="text-primary"><Map className="w-5 h-5"/></button>
          </Link>
        </div>
      </header>
      <div className="hidden md:block h-20"/>

      {/* API status banner */}
      {/* <div className="max-w-7xl mx-auto px-4 md:px-6 pt-20 md:pt-6 pb-2">
        <div className={`rounded-xl px-4 py-2.5 border flex items-center gap-2 text-xs ${
          apiReady ? "bg-green-50 border-green-200 text-green-800" : "glass border-border/30 text-muted-foreground"
        }`}>
          {apiReady
            ? <><CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0"/><span><strong>Live hotel data</strong> — Booking.com via RapidAPI active for real-time availability &amp; pricing.</span></>
            : <><AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0"/><span>Add <code className="bg-white px-1 py-0.5 rounded mx-1">VITE_BOOKING_API_KEY</code> to .env for live hotel search. Showing curated eco-stays now.</span></>
          }
        </div>
      </div> */}

      {/* Region chips */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 overflow-x-auto hide-scrollbar">
        <div className="flex gap-2 w-max md:w-auto md:flex-wrap">
          {REGION_CHIPS.map(r=>(
            <button key={r} onClick={()=>setRegion(r)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold border transition-all ${
                region===r ? "bg-primary text-white border-primary shadow-sm" : "bg-white/70 border-border/50 text-muted-foreground hover:border-primary/30"
              }`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-2">
  <input
    type="text"
    value={city}
    onChange={(e) => setCity(e.target.value)}
    placeholder="Search city (e.g. Manali, Kasol, Shimla)"
    className="w-full px-4 py-3 rounded-xl border border-border/50"
  />
</div>

      {/* Desktop filter bar */}
      <div className={`hidden md:block transition-all overflow-hidden ${showFilters?"max-h-48":"max-h-0"}`}>
        <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-4 gap-6 border-b border-border/30 bg-surface-container/30">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Check-in</label>
            <input type="date" value={checkin} onChange={e=>setCheckin(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-white/60 border border-border/50 text-sm focus:outline-none"/>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Check-out</label>
            <input type="date" value={checkout} onChange={e=>setCheckout(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-white/60 border border-border/50 text-sm focus:outline-none"/>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Min Eco: {minEco}/5</label>
            <input type="range" min={1} max={5} value={minEco} onChange={e=>setMinEco(Number(e.target.value))} className="w-full accent-primary"/>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Max ₹{maxPrice.toLocaleString()}</label>
            <input type="range" min={1000} max={25000} step={500} value={maxPrice} onChange={e=>setMaxPrice(Number(e.target.value))} className="w-full accent-primary"/>
          </div>
          {apiReady && (
            <div className="col-span-4 flex justify-end">
              <button onClick={() => searchLiveHotels()} disabled={loadingLive|| !city.trim()}
                className="btn-primary text-sm px-6 py-2.5 flex items-center gap-2 disabled:opacity-50">
                {loadingLive?<Loader2 className="w-4 h-4 animate-spin"/>:null} Search Live Hotels
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter panel */}
      <AnimatedFilters show={showFilters} region={region} minEco={minEco} setMinEco={setMinEco}
        maxPrice={maxPrice} setMaxPrice={setMaxPrice} envFilter={envFilter} toggleEnv={toggleEnv}
        checkin={checkin} setCheckin={setCheckin} checkout={checkout} setCheckout={setCheckout}
        city={city} setCity={setCity} apiReady={apiReady} loadingLive={loadingLive} onSearch={searchLiveHotels}/>

      {/* Main grid */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-16">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-serif text-3xl md:text-5xl text-primary">
              {region==="All" ? "All Retreats" : region}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {loadingLive ? "Searching live properties…" : `${allStays.length} sanctuaries found`}
              {liveHotels.length>0 && <span className="ml-2 text-green-600 font-semibold">· {liveHotels.length} live</span>}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button onClick={()=>setShowFilters(v=>!v)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${showFilters?"bg-primary text-white border-primary":"bg-white/60 border-border/50 text-muted-foreground"}`}>
              <SlidersHorizontal className="w-4 h-4"/> Refine
            </button>
            <Link href="/stays/map">
              <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-white/60 border border-border/50 text-muted-foreground hover:border-primary/30">
                <Map className="w-4 h-4"/> Map View
              </button>
            </Link>
          </div>
        </div>

        {loadingLive ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary"/>
            <p className="text-muted-foreground">Fetching live properties in {city || region}…</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
            {allStays.map(stay=>(
              <StayCard key={stay.id} stay={stay} wishlisted={wishlist.includes(stay.id)} onWishlist={()=>toggleWish(stay.id)}/>
            ))}
            {allStays.length===0 && (
              <div className="col-span-full text-center py-16 text-muted-foreground">
                <p className="text-lg">No retreats match your filters.</p>
                <button onClick={()=>{setRegion("All");setEnvFilter([]);setCity("");}} className="mt-3 text-secondary text-sm font-semibold">Clear all filters</button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Mobile map FAB */}
      <Link href="/stays/map">
        <button className="md:hidden fixed bottom-20 right-4 w-14 h-14 rounded-full text-white flex items-center justify-center shadow-xl z-40"
          style={{background:"linear-gradient(to bottom, #386934, #154212)",boxShadow:"0 8px 32px rgba(45,90,39,0.3)"}}>
          <Map className="w-6 h-6"/>
        </button>
      </Link>
    </div>
  );
}

function AnimatedFilters({ show, region, minEco, setMinEco, maxPrice, setMaxPrice, envFilter, toggleEnv, checkin, setCheckin, checkout, setCheckout, city, setCity, apiReady, loadingLive, onSearch }: {
  show:boolean; region:string; minEco:number; setMinEco:(v:number)=>void;
  maxPrice:number; setMaxPrice:(v:number)=>void; envFilter:string[]; toggleEnv:(v:string)=>void;
  checkin:string; setCheckin:(v:string)=>void; checkout:string; setCheckout:(v:string)=>void;
  city:string; setCity:(v:string)=>void; apiReady:boolean; loadingLive:boolean; onSearch:()=>void;
}) {
  if (!show) return null;
  return (
    <div className="md:hidden px-4 py-5 border-b border-border/30 bg-surface-container/30 space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Check-in</label>
          <input type="date" value={checkin} onChange={e=>setCheckin(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-white/70 border border-border/50 text-sm focus:outline-none"/>
        </div>
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Check-out</label>
          <input type="date" value={checkout} onChange={e=>setCheckout(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-white/70 border border-border/50 text-sm focus:outline-none"/>
        </div>
      </div>
      <div>
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Min Eco: {minEco}/5 · Max: ₹{maxPrice.toLocaleString()}</label>
        <div className="flex gap-3">
          <input type="range" min={1} max={5} value={minEco} onChange={e=>setMinEco(Number(e.target.value))} className="flex-1 accent-primary"/>
          <input type="range" min={1000} max={25000} step={500} value={maxPrice} onChange={e=>setMaxPrice(Number(e.target.value))} className="flex-1 accent-primary"/>
        </div>
      </div>
      <div>
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Environment</label>
        <div className="flex flex-wrap gap-2">
          {["Mountains","Forest","River","Backwaters","Desert","Beach"].map(e=>(
            <button key={e} onClick={()=>toggleEnv(e)}
              className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all ${envFilter.includes(e)?"bg-secondary text-white border-secondary":"border-border/50 text-muted-foreground"}`}>
              {e}
            </button>
          ))}
        </div>
      </div>
      {apiReady && (
        <button onClick={onSearch} disabled={loadingLive|| !city.trim()}
          className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-sm disabled:opacity-50 rounded-full">
          {loadingLive?<Loader2 className="w-4 h-4 animate-spin"/>:null} Search Live Hotels
        </button>
      )}
    </div>
  );
}

function StayCard({ stay, wishlisted, onWishlist }:{stay:DisplayStay; wishlisted:boolean; onWishlist:()=>void}) {
 const imgSrc = useDestinationImage(
  stay.destinationName,
  stay.imageUrl
);
  const content = (
    <article className="group relative rounded-[24px] overflow-hidden cursor-pointer bg-white border border-border/20 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
        {/* Image */}
        <div className="relative h-56 overflow-hidden shrink-0">
          <img src={imgSrc} alt={stay.name} onError={(e) => {
  const target = e.target as HTMLImageElement;
  target.onerror = null;
  target.src =
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85";
}}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"/>
          {/* Wishlist */}
          <button onClick={e=>{e.preventDefault();onWishlist();}}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{background:"rgba(255,255,255,0.75)",backdropFilter:"blur(8px)"}}>
            <Heart className={`w-4 h-4 ${wishlisted?"fill-red-500 text-red-500":"text-muted-foreground"}`}/>
          </button>
          {/* Eco badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full"
            style={{background:"rgba(21,66,18,0.82)",backdropFilter:"blur(8px)"}}>
            <Leaf className="w-3 h-3 text-green-300 fill-green-300"/>
            <span className="text-xs font-bold text-white">{stay.ecoRating.toFixed(1)} Eco</span>
          </div>
          {/* Live badge */}
          {stay.isLive && (
            <div className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">LIVE</div>
          )}
          {stay.isFreeCancel && (
            <div className="absolute bottom-3 right-3 bg-white/85 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">Free cancel</div>
          )}
        </div>
        {/* Body */}
        <div className="p-5 flex flex-col flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
            {stay.environment} · {stay.state}
          </p>
          <h3 className="font-serif text-xl text-primary group-hover:text-secondary transition-colors mb-1 line-clamp-1">{stay.name}</h3>
          {stay.reviewCount ? (
            <p className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400"/>{stay.reviewScore?.toFixed(1)} · {stay.reviewCount.toLocaleString()} reviews
            </p>
          ) : null}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{stay.description}</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {stay.amenities.slice(0,3).map(a=><span key={a} className="text-xs bg-surface-container rounded-full px-2.5 py-1 text-muted-foreground">{a}</span>)}
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-border/30">
            <div><span className="font-serif text-xl text-primary font-semibold">₹{stay.pricePerNight.toLocaleString()}</span><span className="text-xs text-muted-foreground">/night</span></div>
            <span className="text-secondary text-xs font-bold flex items-center gap-1">Book Now <span>→</span></span>
          </div>
        </div>
      </article>
    );
  return stay.isLive ? (
    <a
      href={stay.deepLink}
      target="_blank"
      rel="noopener noreferrer"
    >
      {content}
    </a>
  ) : (
    <Link href={`/stays/${stay.id}`}>
      {content}
    </Link>
  );
}
