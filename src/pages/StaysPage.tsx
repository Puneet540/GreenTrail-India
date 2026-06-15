// ============================================================
//  GreenTrail India — Stays Page (Backend Proxy for Hotels)
// ============================================================

import { useState, useMemo, useEffect } from "react";
import { Search, Star, Heart, Leaf, SlidersHorizontal, Loader2 } from "lucide-react";
import { STAYS } from "@/lib/api";
import { type HotelResult } from "@/lib/hotelsApi";
import { searchHotelsViaProxy, searchHotelLocationViaProxy } from "@/lib/backendApi";
import { useToast } from "@/hooks/use-toast";
import { useDestinationImage } from "@/hooks/useDestinationImage";
import { Link, useSearch } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    description: h.description || `${h.starRating}-star property in ${h.city}.`,
    amenities: h.facilities.slice(0,4),
    isLive: true, reviewScore: h.reviewScore, reviewCount: h.reviewCount,
    isFreeCancel: h.isFreeCancel, deepLink: h.deepLink,
  };
}

function StayCard({ stay, wishlisted, onWishlist }: { stay: DisplayStay; wishlisted: boolean; onWishlist: ()=>void }) {
  const fallback = useDestinationImage(stay.destinationName);
  return (
    <div className="glass rounded-[24px] overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative h-52 overflow-hidden">
        <img
          src={stay.imageUrl || fallback}
          alt={stay.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { (e.target as HTMLImageElement).src = fallback; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <button onClick={onWishlist} className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow">
          <Heart className={`w-4 h-4 ${wishlisted ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
        </button>
        {stay.isLive && (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
            Live Price
          </span>
        )}
        {stay.isFreeCancel && (
          <span className="absolute bottom-3 left-3 bg-white/90 text-xs px-2 py-0.5 rounded-full font-medium text-green-700">
            Free Cancel
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0 pr-2">
            <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-1">{stay.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{stay.destinationName} · {stay.environment}</p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Leaf className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">{stay.ecoRating.toFixed(1)}</span>
          </div>
        </div>
        {stay.reviewScore && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-muted-foreground">{stay.reviewScore}/10 ({stay.reviewCount} reviews)</span>
          </div>
        )}
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{stay.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-primary">₹{stay.pricePerNight.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">/night</span>
          </div>
          {stay.deepLink ? (
            <a href={stay.deepLink} target="_blank" rel="noopener noreferrer"
              className="bg-primary text-white text-xs px-4 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors">
              Book Now
            </a>
          ) : (
            <Link href={`/stays/${stay.id}`}
              className="bg-primary text-white text-xs px-4 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors">
              View Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StaysPage() {
  const { toast } = useToast();
  const { firebaseUser } = useAuth();

  const [region, setRegion]       = useState("All");
  const [envFilter, setEnvFilter] = useState<string[]>([]);
  const [minEco, setMinEco]       = useState(3);
  const [maxPrice, setMaxPrice]   = useState(25000);
  const [wishlist, setWishlist]   = useState<(string|number)[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [liveHotels, setLiveHotels]   = useState<DisplayStay[]>([]);
  const [loadingLive, setLoadingLive] = useState(false);

  const searchString = useSearch();
  const queryCity = useMemo(() => {
    const params = new URLSearchParams(searchString);
    return params.get("city") || params.get("search") || params.get("q") || "";
  }, [searchString]);
  const [city, setCity] = useState(queryCity);

  // Auto-search if city param present
  useEffect(() => {
    if (queryCity) handleLiveSearch();
  }, [queryCity]);

  const handleLiveSearch = async () => {
    if (!city) {
      toast({ title: "Enter a city name", variant: "destructive" });
      return;
    }
    if (!firebaseUser) {
      toast({ title: "Sign in to search live hotels", description: "Showing curated eco-stays." });
      return;
    }

    setLoadingLive(true);
    try {
      // First get destination ID
      const locRes = await searchHotelLocationViaProxy(city);
      const locData = locRes.data as { dest_id?: string }[];
      const destId = Array.isArray(locData) ? locData[0]?.dest_id : null;

      if (!destId) {
        toast({ title: "City not found", description: "Try a different city name.", variant: "destructive" });
        setLoadingLive(false);
        return;
      }

      // Search hotels
      const hotelRes = await searchHotelsViaProxy({
        destination: destId,
        checkIn: new Date().toISOString().split("T")[0],
        checkOut: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      });

      const hotels = ((hotelRes.data as { result?: HotelResult[] })?.result || []) as HotelResult[];
      setLiveHotels(hotels.slice(0, 20).map(hotelToDisplay));

      if (hotels.length === 0) {
        toast({ title: "No hotels found", description: "Try different dates or city." });
      }
    } catch {
      toast({ title: "Hotel search failed", description: "Showing curated stays instead.", variant: "destructive" });
    } finally {
      setLoadingLive(false);
    }
  };

  const toggleWishlist = (id: string | number) =>
    setWishlist(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);

  // Apply filters to curated stays
  const curated = useMemo(() => {
    return STAYS
      .map(toDisplayStay)
      .filter(s => {
        if (region !== "All" && s.state !== region) return false;
        if (envFilter.length && !envFilter.includes(s.environment)) return false;
        if (s.ecoRating < minEco) return false;
        if (s.pricePerNight > maxPrice) return false;
        return true;
      });
  }, [region, envFilter, minEco, maxPrice]);

  const displayStays = liveHotels.length > 0 ? liveHotels : curated;

  return (
    <div className="min-h-screen bg-surface pb-24 md:pb-8">
      {/* Hero */}
      {/* Hero */}
<div className="relative h-[320px] overflow-hidden">
  <img
    src="https://images.unsplash.com/photo-1609326129829-0f5f15f0df30?w=1600&q=80&fit=crop"
    alt="Eco Stays"
    className="absolute inset-0 w-full h-full object-cover"
  />

  <div className="absolute inset-0 bg-black/40" />

  <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
    <h1 className="text-5xl font-serif mb-4">
      Eco Stays Across India
    </h1>

    <p className="text-lg max-w-2xl">
      Discover sustainable retreats, mountain homestays and unforgettable experiences across India.
    </p>
  </div>
</div>

      <div className="max-w-4xl mx-auto px-4 mt-6 space-y-6">

        {/* Live Hotel Search */}
        <div className="glass rounded-[24px] p-6">
  <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
    <Search className="w-4 h-4 text-primary" />

    {firebaseUser
      ? "Search Live Hotels"
      : "Search Live Hotels (Sign in required)"}
  </h2>

  <div className="flex flex-col md:flex-row gap-3">
    <Input
      placeholder="Search hotels by city..."
      value={city}
      onChange={(e) => setCity(e.target.value)}
      className="flex-1"
    />

    <Button
      onClick={handleLiveSearch}
      disabled={loadingLive}
      className="md:w-auto"
    >
      {loadingLive ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Searching...
        </>
      ) : (
        <>
          <Search className="w-4 h-4 mr-2" />
          Search
        </>
      )}
    </Button>
  </div>

  {liveHotels.length > 0 && (
    <button
      onClick={() => setLiveHotels([])}
      className="mt-3 text-xs text-muted-foreground underline w-full text-center"
    >
      Clear live results — show curated stays
    </button>
  )}
</div>

        {/* Region Chips (only when showing curated) */}
        {liveHotels.length === 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {REGION_CHIPS.map(r => (
              <button key={r} onClick={()=>setRegion(r)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${region===r ? "bg-primary text-white border-primary" : "border-border bg-white/60 hover:border-primary/30"}`}>
                {r}
              </button>
            ))}
          </div>
        )}

        {/* Filters toggle */}
        {liveHotels.length === 0 && (
          <button onClick={()=>setShowFilters(p=>!p)}
            className="flex items-center gap-2 text-sm font-medium text-primary">
            <SlidersHorizontal className="w-4 h-4" />
            {showFilters ? "Hide filters" : "More filters"}
          </button>
        )}

        {showFilters && liveHotels.length === 0 && (
          <div className="glass rounded-[20px] p-5 space-y-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Environment</p>
              <div className="flex flex-wrap gap-2">
                {ENV_TYPES.map(e => (
                  <button key={e} onClick={()=>setEnvFilter(p=>p.includes(e)?p.filter(x=>x!==e):[...p,e])}
                    className={`px-3 py-1 rounded-full text-xs border font-medium transition-colors ${envFilter.includes(e)?"bg-primary text-white border-primary":"border-border bg-white/60"}`}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Eco Rating: {minEco}+</p>
              <input type="range" min={0} max={5} step={0.5} value={minEco} onChange={e=>setMinEco(parseFloat(e.target.value))} className="w-full accent-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Max Price: ₹{maxPrice.toLocaleString()}/night</p>
              <input type="range" min={1000} max={25000} step={500} value={maxPrice} onChange={e=>setMaxPrice(parseInt(e.target.value))} className="w-full accent-primary" />
            </div>
          </div>
        )}

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          {liveHotels.length > 0 ? `${liveHotels.length} live hotels found in ${city}` : `${displayStays.length} curated eco-stays`}
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayStays.map(stay => (
            <StayCard
              key={stay.id}
              stay={stay}
              wishlisted={wishlist.includes(stay.id)}
              onWishlist={()=>toggleWishlist(stay.id)}
            />
          ))}
          {displayStays.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No stays match your filters. Try adjusting them.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
