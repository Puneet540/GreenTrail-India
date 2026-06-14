import { Link } from "wouter";
import { ArrowRight, Leaf } from "lucide-react";
import { useListHiddenGems } from "@/lib/mockHooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const COMPARISONS = [
  {
    famous: "Manali",
    alt: "Jibhi",
    state: "Himachal Pradesh",
    altSlug: "jibhi",
    famousDesc: "Overcrowded markets, constant traffic, commercialised adventure sports that feel increasingly disconnected from the mountains.",
    altDesc: "A secret hamlet of wooden bridges and watermills. Dense pine forests, the Jibhi waterfall, and a silence so complete you can hear the river from your bed.",
    altImg: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80",
  },
  {
    famous: "Nainital",
    alt: "Pangot & Kilbury",
    state: "Uttarakhand",
    altSlug: "pangot",
    famousDesc: "Weekend traffic gridlock, over-lit lakeside hotels, and tourist boats bumper-to-bumper across Naini Lake.",
    altDesc: "15km from Nainital but a world apart — 580+ bird species inhabit dense oak and rhododendron forests. One of India's premier birding sanctuaries.",
    altImg: "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?w=800&q=80",
  },
  {
    famous: "Rishikesh",
    alt: "Chopta",
    state: "Uttarakhand",
    altSlug: "chopta",
    famousDesc: "Yoga cafes, bungee queues, traffic noise — the spiritual heart has become a busy tourist highway.",
    altDesc: "The Mini Switzerland of India. Vast bugyals (meadows) carpeted in wildflowers in spring, snow in winter. The trek to Tungnath temple at 3,680m remains one of India's most rewarding.",
    altImg: "https://images.unsplash.com/photo-1623141629340-6ebb660d3c6b?w=800&q=80",
  },
];

export default function HiddenGemsPage() {
  const { data: gems, isLoading } = useListHiddenGems();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative h-[75vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1600&q=80"
          alt="Hidden Valley"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-background" />
        <div className="relative z-10 text-center px-6 max-w-3xl pt-20">
          <h1 className="font-serif text-6xl md:text-7xl text-white drop-shadow-lg mb-6 leading-tight">
            Beyond the Beaten Path
          </h1>
          <p className="text-white/85 text-xl font-light max-w-xl mx-auto">
            Discover the quiet counterparts to India's most famous destinations. Uncrowded, pristine, and deeply restorative.
          </p>
        </div>
      </section>

      {/* Comparisons */}
      <section className="max-w-7xl mx-auto px-6 py-24 space-y-24">
        {COMPARISONS.map((c, i) => (
          <div
            key={c.alt}
            className={`flex flex-col lg:flex-row items-stretch gap-5 ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
          >
            {/* Famous — greyed out */}
            <div className="w-full lg:w-5/12 bg-surface-container/60 rounded-[28px] p-10 flex flex-col justify-end min-h-72 border border-outline-variant/30 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,#154212_0,#154212_1px,transparent_0,transparent_50%)] bg-[length:10px_10px]" />
              <div className="relative z-10">
                <Badge variant="outline" className="mb-3 text-muted-foreground">The Overcrowded Route</Badge>
                <h3 className="font-serif text-4xl text-foreground/40 mb-2">{c.famous}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{c.famousDesc}</p>
              </div>
            </div>

            {/* Swap icon */}
            <div className="hidden lg:flex items-center justify-center w-14 shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg text-lg font-bold">↔</div>
            </div>

            {/* Alternative — rich */}
            <Link href={`/destinations/${c.altSlug}`} className="w-full lg:w-5/12 group relative rounded-[28px] overflow-hidden min-h-72 flex flex-col justify-end cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300">
              <img
                src={c.altImg}
                alt={c.alt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="relative z-10 p-8">
                <Badge className="bg-secondary/80 text-white border-none mb-3 text-xs">
                  <Leaf className="w-3 h-3 mr-1 fill-current" /> Hidden Gem · {c.state}
                </Badge>
                <h3 className="font-serif text-4xl text-white mb-2">{c.alt}</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-4">{c.altDesc}</p>
                <span className="inline-flex items-center gap-1 text-white/90 text-xs font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                  Discover this gem <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          </div>
        ))}
      </section>

      {/* All Hidden Gems Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-serif text-4xl text-primary">All Hidden Gems</h2>
            <p className="text-muted-foreground mt-2">Places that reward the curious and the patient.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-[28px]" />
            ))}
          </div>
        ) : gems && gems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gems.map((gem) => (
              <Link key={gem.id} href={`/destinations/${gem.id}`}>
                <div className="group relative rounded-[28px] overflow-hidden h-80 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <img
                    src={gem.imageUrl || "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80"}
                    alt={gem.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <Badge className="bg-white/20 text-white border-none mb-3 text-xs backdrop-blur-sm">{gem.state}</Badge>
                    <h3 className="font-serif text-2xl text-white mb-1">{gem.name}</h3>
                    <p className="text-white/75 text-sm line-clamp-2 font-light">{gem.tagline || gem.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: "jibhi", name: "Jibhi", state: "Himachal Pradesh", tagline: "Valley of Stillness", img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80" },
              { id: "chopta", name: "Chopta", state: "Uttarakhand", tagline: "Meadow of the Gods", img: "https://images.unsplash.com/photo-1623141629340-6ebb660d3c6b?w=600&q=80" },
              { id: "pangot", name: "Pangot", state: "Uttarakhand", tagline: "Bird Sanctuary of the Clouds", img: "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?w=600&q=80" },
            ].map((gem) => (
              <Link key={gem.id} href={`/destinations/${gem.id}`}>
                <div className="group relative rounded-[28px] overflow-hidden h-80 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <img src={gem.img} alt={gem.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <Badge className="bg-white/20 text-white border-none mb-3 text-xs backdrop-blur-sm">{gem.state}</Badge>
                    <h3 className="font-serif text-2xl text-white mb-1">{gem.name}</h3>
                    <p className="text-white/75 text-sm font-light">{gem.tagline}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <Button asChild className="btn-primary text-base px-10 py-6">
            <Link href="/destinations">Explore All Destinations <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
