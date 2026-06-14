import { useRoute, Link } from "wouter";
import { ArrowLeft, Heart, Leaf, MapPin, Star, Calendar, Users, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGetStay } from "@/lib/mockHooks";
import { Skeleton } from "@/components/ui/skeleton";

const AMENITY_ICONS: Record<string, string> = {
  "Forest walks": "forest", "Bonfire": "local_fire_department", "Organic meals": "restaurant",
  "Star gazing": "star", "Bird watching": "flutter_dash", "Trout fishing": "water",
  "Guided hikes": "hiking", "Local cuisine": "rice_bowl", "River view": "water_full",
  "Solar powered": "solar_power", "Trekking": "hiking", "Yoga": "self_improvement",
  "Himalayan views": "landscape", "Kayaking": "kayaking", "Ayurveda": "spa",
  "Meditation": "self_improvement", "Plantation tour": "nature", "Coffee tasting": "local_cafe",
  "Waterfall hike": "waterfall", "Heritage property": "museum", "Lake views": "water_full",
  "Cultural Show": "theater_comedy", "Camel Ride": "travel_explore",
};

const GALLERY_IMGS = [
  "https://images.unsplash.com/photo-1542314831-c6a4d14272ce?w=800&q=80",
  "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?w=800&q=80",
  "https://images.unsplash.com/photo-1584507776049-b99a97f7b5f6?w=800&q=80",
  "https://images.unsplash.com/photo-1623141629340-6ebb660d3c6b?w=800&q=80",
];

export default function StayDetailPage() {
  const [_, params] = useRoute("/stays/:id");
  const stayId = parseInt(params?.id || "1");
  const { data: stay, isLoading } = useGetStay(stayId);

  const [galleryIdx, setGalleryIdx] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [checkin, setCheckin]   = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests]     = useState("2");

  if (isLoading) return (
    <div className="min-h-screen">
      <Skeleton className="h-[530px] w-full" />
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-4">
        <Skeleton className="h-10 w-2/3" /><Skeleton className="h-5 w-full" /><Skeleton className="h-5 w-full" />
      </div>
    </div>
  );

  if (!stay) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-serif text-primary mb-2">
          Stay not found
        </h1>
        <p className="text-muted-foreground mb-4">
          The retreat you're looking for doesn't exist.
        </p>

        <Link href="/stays">
          <Button>
            Browse Stays
          </Button>
        </Link>
      </div>
    </div>
  );
}

  const imgs = [stay.imageUrl || GALLERY_IMGS[0], ...GALLERY_IMGS.slice(1)];

  return (
    <div className="min-h-screen bg-background pb-28">

      {/* ── MOBILE back/share header ── */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50 px-5 pt-4 pb-2 flex justify-between items-center"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.45), transparent)" }}>
        <Link href="/stays">
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-white border border-white/30"
            style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(12px)" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
          </button>
        </Link>
        <div className="flex gap-2">
          <button onClick={() => setWishlisted(v => !v)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white border border-white/30"
            style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(12px)" }}>
            <Heart className={`w-4 h-4 ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-white border border-white/30"
            style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(12px)" }}>
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── GALLERY ── */}
      <section className="relative w-full h-[530px] md:h-[620px] overflow-hidden">
        <img src={imgs[galleryIdx]} alt={stay?.name}
          className="w-full h-full object-cover transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Gallery nav arrows (desktop) */}
        <button onClick={() => setGalleryIdx(i => (i - 1 + imgs.length) % imgs.length)}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 items-center justify-center hover:bg-white transition-colors shadow-md">
          <ChevronLeft className="w-5 h-5 text-primary" />
        </button>
        <button onClick={() => setGalleryIdx(i => (i + 1) % imgs.length)}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 items-center justify-center hover:bg-white transition-colors shadow-md">
          <ChevronRight className="w-5 h-5 text-primary" />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {imgs.map((_, i) => (
            <button key={i} onClick={() => setGalleryIdx(i)}
              className={`rounded-full transition-all ${i === galleryIdx ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/50"}`} />
          ))}
        </div>

        {/* Eco badge */}
        <div className="absolute top-5 right-5 flex items-center gap-1 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(45,90,39,0.85)", backdropFilter: "blur(12px)" }}>
          <Leaf className="w-3 h-3 text-green-300 fill-green-300" />
          <span className="text-xs font-bold text-white">{stay?.ecoRating} Eco</span>
        </div>
      </section>

      {/* ── CONTENT CANVAS (overlapping glassmorphic card on mobile) ── */}
      <main className="relative z-10 px-5 md:px-6 -mt-8 md:mt-0 max-w-5xl mx-auto">
        <div className="rounded-t-[32px] md:rounded-[40px] md:mt-10 p-6 md:p-12 border border-white/40 shadow-lg"
          style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(20px)" }}>

          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: "rgba(182,238,171,0.6)", color: "#154212" }}>{stay?.environment}</span>
              <span className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"
                style={{ background: "rgba(237,239,231,0.8)", color: "#42493e" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>eco</span> Gold Certified
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-5xl text-primary mb-2 leading-tight">{stay?.name}</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-secondary" />
              {stay?.destinationName}, {stay?.state}
            </p>
          </div>

          {/* Description */}
          <div className="mb-10 text-muted-foreground leading-relaxed text-base md:text-lg">
            <p className="mb-4">{stay?.description}</p>
            <p>Wake up to the rhythm of the forest, partake in mindful rituals, and experience the profound quiet of nature. Our commitment to preserving the wild rhythm ensures that your stay leaves nothing but footprints.</p>
          </div>

          {/* Amenities */}
          <div className="mb-10">
            <h2 className="font-serif text-2xl md:text-3xl text-primary mb-6">Rhythms of the Retreat</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(stay?.amenities || []).map(a => (
                <div key={a} className="rounded-2xl p-4 border text-center flex flex-col items-center gap-3"
                  style={{ background: "rgba(249,250,242,0.8)", borderColor: "rgba(194,201,187,0.4)" }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(21,66,18,0.1)" }}>
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: 22 }}>
                      {AMENITY_ICONS[a] || "eco"}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-primary">{a}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery grid */}
          <div className="mb-10">
            <h2 className="font-serif text-2xl text-primary mb-5">Glimpses</h2>
            <div className="grid grid-cols-2 gap-3 h-64 md:h-80">
              <div className="col-span-1 h-full rounded-2xl overflow-hidden group">
                <img src={imgs[1] || imgs[0]} alt="Interior" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="col-span-1 grid grid-rows-2 gap-3 h-full">
                <div className="rounded-2xl overflow-hidden group">
                  <img src={imgs[2] || imgs[0]} alt="Food" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="rounded-2xl overflow-hidden group">
                  <img src={imgs[3] || imgs[0]} alt="Yoga" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
            </div>
          </div>

          {/* Booking form (desktop only — mobile uses sticky bar) */}
          <div className="hidden md:block glass rounded-3xl p-8 border border-border/30">
            <h2 className="font-serif text-2xl text-primary mb-6">Plan Your Stay</h2>
            <div className="grid grid-cols-3 gap-4 mb-5">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Check-in</label>
                <input type="date" value={checkin} onChange={e => setCheckin(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/60 border border-border/50 text-sm focus:outline-none focus:border-primary/50" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Check-out</label>
                <input type="date" value={checkout} onChange={e => setCheckout(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/60 border border-border/50 text-sm focus:outline-none focus:border-primary/50" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Guests</label>
                <select value={guests} onChange={e => setGuests(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/60 border border-border/50 text-sm focus:outline-none">
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? "s" : ""}</option>)}
                </select>
              </div>
            </div>
            <Link href={`/checkout?stayId=${stay.id}`}>
              <button className="w-full py-4 rounded-full text-white text-base font-semibold transition-all hover:scale-[1.02] shadow-lg"
                style={{ background: "linear-gradient(to bottom, #386934, #154212)" }}>
                Reserve Stay →
              </button>
            </Link>
            <p className="text-xs text-muted-foreground text-center mt-3">Free cancellation up to 48 hours before check-in</p>
          </div>
        </div>
      </main>

      {/* ── MOBILE STICKY BOTTOM BAR (from mobile_sanctuary_detail design) ── */}
      <div className="md:hidden fixed bottom-16 left-0 w-full z-50 px-5 py-4 flex justify-between items-center border-t border-border/30"
        style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", boxShadow: "0 -8px 32px rgba(45,90,39,0.06)" }}>
        <div>
          <p className="text-xs text-muted-foreground font-semibold">From</p>
          <p className="font-serif text-2xl text-primary font-semibold">
            ₹{stay?.pricePerNight?.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">/ night</span>
          </p>
        </div>
        <Link href={`/checkout?stayId=${stay.id}`}>
          <button className="px-8 py-3 rounded-full text-white text-sm font-semibold flex items-center gap-2 shadow-lg"
            style={{ background: "linear-gradient(to bottom, #386934, #154212)" }}>
            Reserve Stay <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
