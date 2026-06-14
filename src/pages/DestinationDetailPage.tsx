import { useRoute, Link } from "wouter";
import { useState } from "react";
import { ArrowLeft, MapPin, Leaf, Star, Calendar, Thermometer, Mountain, Share2, Heart, ChevronLeft, ChevronRight, Clock, ArrowRight } from "lucide-react";
import { useGetDestination, useListStays, useListStories } from "@/lib/mockHooks";
import { useDestinationImage } from "@/hooks/useDestinationImage";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function DestinationDetailPage() {
  const [, params] = useRoute("/destinations/:id");
  const id = params?.id || "1";

  const { data: destination, isLoading } = useGetDestination(id);
  const { data: stays }   = useListStays({ destinationId: destination?.id });
  const { data: stories } = useListStories({ destination: destination?.name });

  const relatedStays = stays || [];

  const [activeImg,   setActiveImg]   = useState(0);
  const [wishlisted,  setWishlisted]  = useState(false);

  const heroImage = useDestinationImage(
  destination?.name || "",
  destination?.imageUrl || ""
);

if (isLoading || !destination) {
  return (
    <div className="min-h-screen bg-background">
      <Skeleton className="h-[55vh] w-full" />
      <div className="max-w-4xl mx-auto px-5 py-10 space-y-4">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}

const allPhotos = [
  heroImage,
  heroImage,
  heroImage,
];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">

      {/* ── MOBILE HEADER ── */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50 px-5 pt-4 pb-2 flex justify-between items-center"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)" }}>
        <Link href="/destinations">
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-white border border-white/30"
            style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(12px)" }}>
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div className="flex gap-2">
          <button onClick={() => setWishlisted(v => !v)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white border border-white/30"
            style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(12px)" }}>
            <Heart className={`w-4 h-4 ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-white border border-white/30"
            style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(12px)" }}>
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── PHOTO GALLERY ── */}
      <section className="relative">
        {/* Main hero photo */}
        <div className="relative h-[55vh] md:h-[70vh] overflow-hidden">
          <img
            src={allPhotos[activeImg]}
            alt={`${destination.name} - photo ${activeImg + 1}`}
            className="w-full h-full object-cover transition-all duration-700"
            onError={e => { (e.target as HTMLImageElement).src = destination.imageUrl; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

          {/* Arrow navigation (show on desktop and if multiple photos) */}
          {allPhotos.length > 1 && (
            <>
              <button
                onClick={() => setActiveImg(i => (i - 1 + allPhotos.length) % allPhotos.length)}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 items-center justify-center hover:bg-white transition-colors shadow-md z-10">
                <ChevronLeft className="w-5 h-5 text-primary" />
              </button>
              <button
                onClick={() => setActiveImg(i => (i + 1) % allPhotos.length)}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 items-center justify-center hover:bg-white transition-colors shadow-md z-10">
                <ChevronRight className="w-5 h-5 text-primary" />
              </button>
            </>
          )}

          {/* Photo counter dots */}
          {allPhotos.length > 1 && (
            <div className="absolute bottom-28 md:bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {allPhotos.map((_, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`rounded-full transition-all ${i === activeImg ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50"}`} />
              ))}
            </div>
          )}

          {/* Desktop back */}
          <Link href="/destinations" className="hidden md:flex absolute top-24 left-6 z-10 items-center gap-2 text-white text-sm font-semibold hover:text-white/80 transition-colors">
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <ArrowLeft className="w-4 h-4" />
            </div>
            All Destinations
          </Link>

          {/* Hero title overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-5 md:px-12 pb-6 md:pb-10">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-xs font-bold px-3 py-1 rounded-full border border-white/30 text-white"
                style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
                <MapPin className="w-3 h-3 inline mr-1" />{destination.state}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full border border-white/30 text-white flex items-center gap-1"
                style={{ background: "rgba(21,66,18,0.7)", backdropFilter: "blur(8px)" }}>
                <Leaf className="w-3 h-3 fill-green-300 text-green-300" /> {destination.ecoRating}/5 Eco
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-6xl text-white mb-1 leading-tight">{destination.name}</h1>
            <p className="text-white/80 text-base md:text-xl font-light italic">{destination.tagline}</p>
          </div>
        </div>

        {/* ── THUMBNAIL STRIP (2-3 photos) ── */}
        {allPhotos.length > 1 && (
          <div className="flex gap-2 px-5 md:px-12 -mt-0 py-3 bg-background/80 backdrop-blur-md border-b border-border/30">
            {allPhotos.map((photo, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                className={`rounded-xl overflow-hidden shrink-0 transition-all duration-200 border-2 ${
                  activeImg === i ? "border-primary scale-105 shadow-md" : "border-transparent opacity-70 hover:opacity-100"
                }`}
                style={{ width: 72, height: 52 }}>
                <img src={photo} alt={`View ${i + 1}`}
                  className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).src = destination.imageUrl; }} />
              </button>
            ))}
            <div className="flex items-center ml-2">
              <span className="text-xs text-muted-foreground font-semibold">{allPhotos.length} photos</span>
            </div>
          </div>
        )}
      </section>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-5xl mx-auto px-5 md:px-6 py-8 md:py-12">

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {[
            { icon: Mountain,    label: "Altitude",     value: destination.altitude    || "Varies" },
            { icon: Calendar,    label: "Best Time",    value: destination.bestTime?.split(",")[0] || "Year-round" },
            { icon: Thermometer, label: "Temperature",  value: destination.temperature || "Moderate" },
            { icon: Star,        label: "Eco Rating",   value: `${destination.ecoRating}/5.0` },
          ].map(s => (
            <div key={s.label} className="glass rounded-2xl p-4 text-center border border-border/20 shadow-sm">
              <s.icon className="w-5 h-5 text-secondary mx-auto mb-2" />
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">{s.label}</div>
              <div className="font-semibold text-primary text-sm leading-tight">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Description */}
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl md:text-3xl text-primary mb-5">About {destination.name}</h2>
            <p className="text-muted-foreground leading-relaxed text-base md:text-lg mb-6">{destination.description}</p>

            {/* Famous For */}
            {destination.famousFor && destination.famousFor.length > 0 && (
              <div className="mb-8">
                <h3 className="font-serif text-xl text-primary mb-4">Famous For</h3>
                <div className="grid grid-cols-2 gap-3">
                  {destination.famousFor.map(f => (
                    <div key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground bg-surface-container/60 rounded-xl px-3 py-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {destination.tags && destination.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {destination.tags.map(tag => (
                  <span key={tag} className="text-xs bg-primary/8 text-primary px-3 py-1.5 rounded-full font-semibold border border-primary/15">{tag}</span>
                ))}
              </div>
            )}

            {/* Getting there */}
            <div className="glass rounded-[20px] p-5 border border-border/20 mb-8">
              <h3 className="font-serif text-xl text-primary mb-4">Getting There</h3>
              <div className="space-y-3">
                {[
                  { icon: "🚂", mode: "By Train", tip: `Nearest railhead in ${destination.state}. Book via IRCTC.` },
                  { icon: "✈️", mode: "By Air",   tip: `Check flights to nearest airport in ${destination.state}.` },
                  { icon: "🚌", mode: "By Bus",   tip: `HRTC/KSRTC buses connect major cities during season.` },
                ].map(t => (
                  <div key={t.mode} className="flex items-start gap-3 text-sm">
                    <span className="text-lg shrink-0">{t.icon}</span>
                    <div>
                      <span className="font-semibold text-primary">{t.mode} — </span>
                      <span className="text-muted-foreground">{t.tip}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/travel">
                <button className="mt-4 text-xs text-secondary font-bold flex items-center gap-1 hover:text-primary transition-colors">
                  Search trains, flights & buses <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </div>

          {/* Sidebar — best time + eco info */}
          <div className="space-y-5">
            <div className="glass rounded-[20px] p-5 border border-border/20 shadow-sm">
              <h3 className="font-serif text-lg text-primary mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-secondary" /> When to Visit
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-primary">Best months:</strong> {destination.bestTime}
              </p>
              <div className="mt-3 p-3 bg-green-50 rounded-xl text-xs text-green-700">
                🌿 Travelling in shoulder season reduces overcrowding and supports year-round local livelihoods.
              </div>
            </div>

            <div className="glass rounded-[20px] p-5 border border-border/20 shadow-sm">
              <h3 className="font-serif text-lg text-primary mb-4">Eco Responsibility</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><span className="text-green-600 font-bold shrink-0">✓</span> Carry all waste back from trails</li>
                <li className="flex items-start gap-2"><span className="text-green-600 font-bold shrink-0">✓</span> Use reusable water bottles</li>
                <li className="flex items-start gap-2"><span className="text-green-600 font-bold shrink-0">✓</span> Buy local, eat local</li>
                <li className="flex items-start gap-2"><span className="text-green-600 font-bold shrink-0">✓</span> Stay on marked trails</li>
              </ul>
            </div>

            <Link href="/stays">
              <button className="w-full btn-primary py-4 text-sm flex items-center justify-center gap-2">
                Find Eco Retreats Here <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>

        {/* ── RELATED STAYS ── */}
        {relatedStays.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl md:text-3xl text-primary">Retreats in {destination.name}</h2>
              <Link href="/stays">
                <button className="text-secondary text-sm font-bold flex items-center gap-1 hover:text-primary transition-colors">
                  View all <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedStays.map((stay: any) => (
                <Link key={stay.id} href={`/stays/${stay.id}`}>
                  <div className="group glass rounded-[20px] overflow-hidden border border-border/20 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                    <div className="relative h-44 overflow-hidden">
                      <img src={stay.imageUrl} alt={stay.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={e => { (e.target as HTMLImageElement).src = destination.imageUrl; }} />
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full"
                        style={{ background: "rgba(21,66,18,0.82)", backdropFilter: "blur(8px)" }}>
                        <Leaf className="w-3 h-3 text-green-300 fill-green-300" />
                        <span className="text-xs font-bold text-white">{stay.ecoRating}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-lg text-primary group-hover:text-secondary transition-colors line-clamp-1">{stay.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        from <span className="font-bold text-primary">₹{stay.pricePerNight.toLocaleString()}</span>/night
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── STORIES ── */}
        {stories && stories.length > 0 && (
          <div className="mt-14">
            <h2 className="font-serif text-2xl md:text-3xl text-primary mb-6">Stories from here</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {stories.slice(0, 2).map(story => (
                <Link key={story.id} href={`/stories/${story.id}`}>
                  <div className="group glass rounded-[20px] overflow-hidden border border-border/20 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-row">
                    <img src={story.imageUrl} alt={story.title}
                      className="w-28 h-full object-cover shrink-0 group-hover:scale-105 transition-transform duration-700" />
                    <div className="p-4 flex flex-col justify-between min-w-0">
                      <div>
                        <h3 className="font-serif text-base text-primary line-clamp-2 mb-1">{story.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{story.excerpt}</p>
                      </div>
                      <p className="text-xs text-secondary font-bold mt-2">By {story.authorName}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── MOBILE STICKY BOOK BAR ── */}
      <div className="md:hidden fixed bottom-16 left-0 w-full px-4 py-3 z-40 border-t border-border/30"
        style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(16px)" }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Eco retreats from</p>
            <p className="font-serif text-xl text-primary font-semibold">₹2,800<span className="text-xs font-normal text-muted-foreground">/night</span></p>
          </div>
          <Link href="/stays">
            <button className="px-6 py-3 rounded-full text-white text-sm font-semibold flex items-center gap-2 shadow-lg"
              style={{ background: "linear-gradient(to bottom, #386934, #154212)" }}>
              Find Retreats <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
