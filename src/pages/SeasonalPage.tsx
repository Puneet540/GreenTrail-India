import { useState } from "react";
import { Link } from "wouter";
import { Sun, Leaf, Snowflake, Droplets, ArrowRight, Thermometer } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const SEASONS = [
  {
    id: "winter",
    name: "Winter",
    months: "Dec – Feb",
    icon: Snowflake,
    color: "#4b9fe0",
    hero: "https://images.unsplash.com/photo-1591016405280-f0e1e978e432?w=1600&q=80",
    description: "High-altitude deserts open up. Spiti Valley under snow is otherworldly. Rajasthan's golden days shine. Ski season peaks in Auli and Gulmarg.",
    destinations: [
      { name: "Spiti Valley", state: "Himachal", temp: "-5°C", img: "https://images.unsplash.com/photo-1591016405280-f0e1e978e432?w=400&q=80" },
      { name: "Jaisalmer", state: "Rajasthan", temp: "18°C", img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80" },
      { name: "Gulmarg", state: "Jammu & Kashmir", temp: "-12°C", img: "https://images.unsplash.com/photo-1623141629340-6ebb660d3c6b?w=400&q=80" },
      { name: "Kerala", state: "Kerala", temp: "28°C", img: "https://images.unsplash.com/photo-1584507776049-b99a97f7b5f6?w=400&q=80" },
    ]
  },
  {
    id: "spring",
    name: "Spring",
    months: "Mar – May",
    icon: Leaf,
    color: "#386934",
    hero: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1600&q=80",
    description: "Rhododendrons blanket the Himalayas in crimson. Valley trails open up. Perfect trekking weather before the summer crowds arrive.",
    destinations: [
      { name: "Chopta", state: "Uttarakhand", temp: "12°C", img: "https://images.unsplash.com/photo-1623141629340-6ebb660d3c6b?w=400&q=80" },
      { name: "Jibhi", state: "Himachal Pradesh", temp: "14°C", img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&q=80" },
      { name: "Darjeeling", state: "West Bengal", temp: "10°C", img: "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?w=400&q=80" },
      { name: "Valley of Flowers", state: "Uttarakhand", temp: "8°C", img: "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=400&q=80" },
    ]
  },
  {
    id: "summer",
    name: "Summer",
    months: "Jun – Aug",
    icon: Sun,
    color: "#e8a000",
    hero: "https://images.unsplash.com/photo-1542314831-c6a4d14272ce?w=1600&q=80",
    description: "The High Himalayas come alive. Ladakh, Spiti, and Leh open their roads. Northeast India glows in green. Beat the heat in high-altitude meadows.",
    destinations: [
      { name: "Ladakh", state: "Ladakh", temp: "20°C", img: "https://images.unsplash.com/photo-1591016405280-f0e1e978e432?w=400&q=80" },
      { name: "Nubra Valley", state: "Ladakh", temp: "22°C", img: "https://images.unsplash.com/photo-1623141629340-6ebb660d3c6b?w=400&q=80" },
      { name: "Meghalaya", state: "Meghalaya", temp: "20°C", img: "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?w=400&q=80" },
      { name: "Pangot", state: "Uttarakhand", temp: "18°C", img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&q=80" },
    ]
  },
  {
    id: "monsoon",
    name: "Monsoon",
    months: "Sep – Nov",
    icon: Droplets,
    color: "#2e7d9c",
    hero: "https://images.unsplash.com/photo-1584507776049-b99a97f7b5f6?w=1600&q=80",
    description: "The Western Ghats erupt with waterfalls. North-East India transforms into a living green cathedral. Wayanad, Coorg, and Kodaikanal glow at their most lush.",
    destinations: [
      { name: "Wayanad", state: "Kerala", temp: "24°C", img: "https://images.unsplash.com/photo-1584507776049-b99a97f7b5f6?w=400&q=80" },
      { name: "Coorg", state: "Karnataka", temp: "20°C", img: "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?w=400&q=80" },
      { name: "Athirappilly", state: "Kerala", temp: "25°C", img: "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=400&q=80" },
      { name: "Cherrapunji", state: "Meghalaya", temp: "18°C", img: "https://images.unsplash.com/photo-1623141629340-6ebb660d3c6b?w=400&q=80" },
    ]
  },
];

export default function SeasonalPage() {
  const [active, setActive] = useState("spring");
  const season = SEASONS.find(s => s.id === active)!;
  const Icon = season.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative h-[75vh] overflow-hidden group">
        <img
          src={season.hero}
          alt={season.name}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
          key={season.id}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Current Season Badge */}
        <div className="absolute top-28 left-6 md:left-12">
          <Badge className="glass text-white border-none px-4 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            {active === "spring" ? "✦ Current Season" : "Select Season"}
          </Badge>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end">
          <div className="text-white max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Icon className="w-6 h-6" style={{ color: season.color }} />
              <span className="font-mono text-sm uppercase tracking-widest text-white/70">{season.months}</span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl mb-4 leading-tight">
              The {season.name} Awakening
            </h1>
            <p className="text-white/80 text-lg font-light">{season.description}</p>
          </div>
        </div>
      </section>

      {/* Season Selector */}
      <div className="sticky top-16 z-30 py-4 px-6 backdrop-blur-xl border-b border-border/30" style={{ background: "rgba(249,250,242,0.9)" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 flex-wrap">
          {SEASONS.map(s => {
            const SIcon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${active === s.id ? "bg-primary text-white border-primary shadow-md" : "border-border/60 text-muted-foreground hover:border-primary/30 bg-white/60"}`}
              >
                <SIcon className="w-4 h-4" />
                {s.name}
                <span className="text-xs opacity-60">({s.months})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Destinations */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-serif text-4xl text-primary">{season.name} Destinations</h2>
          <Link href="/destinations">
            <button className="text-secondary text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {season.destinations.map(dest => (
            <Link key={dest.name} href={`/destinations?q=${dest.name.toLowerCase()}`}>
              <div className="group cursor-pointer">
                <div className="relative h-[450px] rounded-[20px] overflow-hidden mb-4 shadow-sm hover:shadow-lg transition-shadow">
                  <img
                    src={dest.img}
                    alt={dest.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1 shadow-sm">
                    <Thermometer className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-bold text-primary">{dest.temp}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-primary group-hover:text-secondary transition-colors">{dest.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{dest.state}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
