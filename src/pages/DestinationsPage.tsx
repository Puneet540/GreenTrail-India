import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Leaf, Star, ArrowRight, SlidersHorizontal } from "lucide-react";
import { Link, useSearch } from "wouter";
import { DESTINATIONS, STATES } from "@/lib/api";
import { getDynamicLocationImage } from "@/lib/imagesApi";
import { useDestinationImage } from "@/hooks/useDestinationImage";

const CATEGORIES = ["All","Mountain","Forest","Valley","Lake","River","Desert","Beach","Backwaters","Heritage","Spiritual","Wildlife","Culture"];
const container = { hidden:{opacity:0}, show:{opacity:1,transition:{staggerChildren:0.06}} };
const item = { hidden:{opacity:0,y:16}, show:{opacity:1,y:0} };

export default function DestinationsPage() {
  const searchStr = useSearch();
  const urlState = useMemo(()=>{ const p=new URLSearchParams(searchStr); return p.get("state")||"All"; },[searchStr]);

  const [selectedState,    setSelectedState]    = useState(urlState);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery,      setSearchQuery]       = useState("");
  const [showSearch,       setShowSearch]        = useState(false);

  useEffect(()=>setSelectedState(urlState),[urlState]);

  const filtered = useMemo(()=>DESTINATIONS.filter(d=>{
    const stateMatch    = selectedState==="All" || d.state===selectedState;
    const categoryMatch = selectedCategory==="All" || d.tags.includes(selectedCategory) || d.type===selectedCategory;
    const searchMatch   = !searchQuery ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.famousFor?.some(f=>f.toLowerCase().includes(searchQuery.toLowerCase()));
    return stateMatch&&categoryMatch&&searchMatch;
  }),[selectedState,selectedCategory,searchQuery]);

  const hiddenGems = filtered.filter(d=>d.isHiddenGem);
  const mainDests  = filtered.filter(d=>!d.isHiddenGem);
  const currentStateInfo = STATES.find(s=>s.name===selectedState);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <header className="md:hidden fixed top-0 left-0 w-full z-50 px-5 pt-4 pb-3 flex justify-between items-center"
        style={{background:"rgba(255,255,255,0.88)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(194,201,187,0.35)"}}>
        <span className="font-serif text-xl text-primary" style={{fontStyle:"italic"}}>GreenTrail India</span>
        <button
          onClick={()=>setShowSearch(v=>!v)}
          className={`text-primary p-1 rounded-full transition-colors ${showSearch ? "bg-primary/10" : ""}`}><Search className="w-5 h-5"/></button>
      </header>

      {/* ── MOBILE SPACER — pushes content below fixed header ── */}
      <div className="md:hidden h-14" />

      {/* ── MOBILE SEARCH DROPDOWN ── */}
      {showSearch && (
        <div className="md:hidden fixed z-40 left-0 w-full px-4 py-3"
          style={{
            top: 56,
            background: "rgba(249,250,242,0.98)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(194,201,187,0.4)",
          }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
            <input
              autoFocus
              value={searchQuery}
              onChange={e=>setSearchQuery(e.target.value)}
              placeholder="Search destinations, experiences…"
              className="w-full pl-9 pr-10 py-2.5 rounded-full text-sm focus:outline-none"
              style={{background:"rgba(255,255,255,0.8)",border:"1px solid rgba(194,201,187,0.6)"}}
            />
            {searchQuery && (
              <button onClick={()=>setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary text-xs font-bold">
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      <div className="relative h-[320px] overflow-hidden">
  <img
    src="https://images.unsplash.com/photo-1530801584475-31d9d4cf7b33?w=1600&q=80&fit=crop"
    className="absolute inset-0 w-full h-full object-cover"
    alt="Explore India"
  />

  <div className="absolute inset-0 bg-black/40" />

  <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
    <h1 className="text-5xl font-serif mb-4">
      Discover India
    </h1>

    <p className="text-lg">
      Explore iconic destinations and hidden gems.
    </p>
  </div>
</div>

      {/* Desktop header */}

      {/* Sticky filter bar */}
      <div className="px-3 md:px-6 py-2.5 border-b border-border/40 bg-background">
        <div className="max-w-7xl mx-auto">
          {/* State chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            <button onClick={()=>setSelectedState("All")}
              className={`px-4 py-1.5 md:py-2 rounded-full whitespace-nowrap text-xs md:text-sm font-semibold border transition-all shrink-0 ${selectedState==="All"?"bg-primary text-white border-primary":"bg-white/70 border-border/50 text-muted-foreground"}`}>
              All India
            </button>
            {STATES.map(st=>(
              <button key={st.name} onClick={()=>setSelectedState(st.name)}
                className={`px-4 py-1.5 md:py-2 rounded-full whitespace-nowrap text-xs md:text-sm font-semibold border transition-all shrink-0 ${selectedState===st.name?"bg-primary text-white border-primary":"bg-white/70 border-border/50 text-muted-foreground"}`}>
                {st.name} <span className="opacity-50 text-[10px]"></span>
              </button>
            ))}
          </div>
          {/* Category chips + desktop search */}
          <div className="flex items-center justify-between gap-3 mt-2">
            <div className="flex gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
              {CATEGORIES.map(cat=>(
                <button key={cat} onClick={()=>setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full whitespace-nowrap text-[11px] md:text-xs font-semibold border transition-all shrink-0 ${selectedCategory===cat?"bg-secondary text-white border-secondary":"bg-white/60 border-border/50 text-muted-foreground"}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative shrink-0 hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
              <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
                placeholder="Search destinations…"
                className="pl-9 pr-4 py-2.5 rounded-full bg-white/60 border border-border/50 text-sm focus:outline-none focus:border-primary/40 w-52"/>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12 pb-24 md:pb-16">
        {/* Mobile title */}
        <div className="md:hidden mb-6 mt-4">
          <h1 className="font-serif text-3xl text-primary">{selectedState==="All"?"All Destinations":selectedState}</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} destinations found</p>
        </div>

        {/* State banner */}
        {selectedState!=="All" && currentStateInfo && (
          <div className="relative rounded-[20px] md:rounded-[28px] overflow-hidden h-36 md:h-52 mb-8 md:mb-12">
            <img src={currentStateInfo.imageUrl} alt={selectedState} className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"/>
            <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-8">
              <h2 className="font-serif text-2xl md:text-4xl text-white mb-1">{selectedState}</h2>
              <p className="text-white/75 text-sm">{filtered.length} destinations · {hiddenGems.length} hidden gems</p>
            </div>
          </div>
        )}

        {/* No results */}
        {filtered.length===0 && (
          <div className="text-center py-20">
            <MapPin className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4"/>
            <h3 className="text-xl font-serif text-primary mb-2">No destinations found</h3>
            <p className="text-muted-foreground text-sm">Try adjusting your filters or search terms.</p>
            <button onClick={()=>{setSelectedState("All");setSelectedCategory("All");setSearchQuery("");}}
              className="mt-5 btn-outline text-sm px-6 py-2.5">Clear Filters</button>
          </div>
        )}

        {/* Popular grid */}
        {mainDests.length>0 && (
          <>
            {hiddenGems.length>0 && <h2 className="font-serif text-xl md:text-2xl text-primary mb-5">Popular Destinations</h2>}
            <motion.div variants={container} initial="hidden" animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7 mb-12">
              {mainDests.map(dest=><motion.div key={dest.id} variants={item}><DestCard dest={dest}/></motion.div>)}
            </motion.div>
          </>
        )}

        {/* Hidden gems */}
        {hiddenGems.length>0 && (
          <>
            <div className="flex items-end justify-between mb-5 md:mb-6">
              <div>
                <h2 className="font-serif text-xl md:text-3xl text-primary">Hidden Gems</h2>
                <p className="text-muted-foreground text-sm mt-0.5">Places that reward the curious</p>
              </div>
              <Link href="/hidden-gems">
                <button className="text-secondary text-xs md:text-sm font-bold flex items-center gap-1 hover:text-primary transition-colors">
                  View all <ArrowRight className="w-3.5 h-3.5"/>
                </button>
              </Link>
            </div>
            <motion.div variants={container} initial="hidden" animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
              {hiddenGems.map(dest=>(
                <motion.div key={dest.id} variants={item} className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-amber-400/30 to-green-400/30 rounded-[26px] blur-sm"/>
                  <DestCard dest={dest} gem/>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

function DestCard({dest,gem}:{dest:typeof DESTINATIONS[0];gem?:boolean}) {
  const imgSrc = useDestinationImage(
  dest.name,
  dest.imageUrl
);


  return (
    <Link href={`/destinations/${dest.slug}`}>
      <div className="group relative rounded-[22px] md:rounded-[24px] overflow-hidden bg-white border border-border/20 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full flex flex-col">
        <div className="relative h-44 md:h-56 overflow-hidden shrink-0">
  <img
    src={imgSrc}
    alt={dest.name}
    onError={(e) => {
      const target = e.target as HTMLImageElement;
      target.onerror = null;
      target.src =
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85";
    }}
    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
  />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"/>
          {gem && <div className="absolute top-3 left-3 bg-amber-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">✦ Hidden Gem</div>}
          <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/20">{dest.type}</div>
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1">
            <Leaf className="w-3 h-3 text-green-600 fill-green-600"/>
            <span className="text-xs font-bold text-green-700">{dest.ecoRating}</span>
          </div>
        </div>
        <div className="p-4 md:p-5 flex flex-col flex-1">
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{dest.state}</p>
          <h3 className="font-serif text-lg md:text-xl text-primary group-hover:text-secondary transition-colors mb-0.5">{dest.name}</h3>
          <p className="text-xs md:text-sm text-muted-foreground italic mb-2">{dest.tagline}</p>
          <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 flex-1 mb-3">{dest.description}</p>
          {dest.famousFor && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {dest.famousFor.slice(0,3).map(f=><span key={f} className="text-[10px] md:text-xs bg-surface-container text-muted-foreground px-2 py-0.5 rounded-full">{f}</span>)}
            </div>
          )}
          <div className="flex items-center justify-between pt-3 border-t border-border/30 mt-auto">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400"/>
              <span className="font-semibold">{dest.ecoRating}</span>
              <span className="hidden md:inline">· {dest.bestTime.split(",")[0]}</span>
            </div>
            <span className="text-secondary text-xs font-bold flex items-center gap-1">Explore <ArrowRight className="w-3 h-3"/></span>
          </div>
        </div>
      </div>
    </Link>
  );
}
