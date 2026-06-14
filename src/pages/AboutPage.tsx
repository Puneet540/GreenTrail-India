import { Link } from "wouter";
import { Leaf, Users, Shield, ArrowRight, Globe, TreePine, Heart } from "lucide-react";

const TEAM = [
  { name: "Priya Kapoor", role: "Co-Founder & Chief Explorer", img: "https://i.pravatar.cc/150?u=priya", bio: "8 years trekking India's forgotten trails. Former wildlife biologist." },
  { name: "Rahul Sharma", role: "Head of Eco Partnerships", img: "https://i.pravatar.cc/150?u=rahul", bio: "Verifies every retreat personally. Passionate about sustainable tourism policy." },
  { name: "Meera Nair", role: "Lead Experience Curator", img: "https://i.pravatar.cc/150?u=meera", bio: "Former travel journalist. Has visited 450+ destinations across India." },
  { name: "Aditya Rao", role: "Technology & AI Planner", img: "https://i.pravatar.cc/150?u=aditya", bio: "Built systems that understand how people want to feel, not just where they want to go." },
];

const STATS = [
  { value: "2,400+", label: "Conscious Travelers", icon: Users },
  { value: "180+", label: "Verified Eco Retreats", icon: TreePine },
  { value: "28", label: "States Covered", icon: Globe },
  { value: "₹0", label: "Greenwashing Tolerated", icon: Heart },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542273917363-3b1817f69a5d?w=1600&q=80"
          alt="Forest landscape"
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        <div className="relative z-10 text-center px-4 pt-16">
          <h1 className="text-6xl md:text-7xl font-serif text-white mb-4">The GreenTrail Manifesto</h1>
          <p className="text-white/80 text-xl md:text-2xl font-light">Rediscovering India's untamed spirit.</p>
        </div>
      </div>

      {/* Mission Quote */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-24 text-center">
        <Leaf className="w-12 h-12 mx-auto text-primary mb-8 fill-primary/20" />
        <h2 className="text-4xl md:text-5xl font-serif text-primary leading-tight">
          "We believe the wild is not a place to conquer, but a place to listen."
        </h2>
      </div>

      {/* Stats */}
      <div className="py-16 px-6" style={{ background: "rgba(21,66,18,0.04)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="glass rounded-[24px] p-6 text-center border border-border/30 hover:-translate-y-1 transition-transform">
                <Icon className="w-7 h-7 text-secondary mx-auto mb-3" />
                <div className="font-serif text-3xl text-primary font-semibold mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Values */}
      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-4xl text-primary text-center mb-14">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="glass rounded-[32px] p-10 text-center border border-border/30 hover:-translate-y-2 transition-all duration-300">
              <Shield className="w-10 h-10 mx-auto text-primary mb-6" />
              <h3 className="text-2xl font-serif text-primary mb-4">Sustainability</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We partner exclusively with eco-retreats and local communities that prioritize conservation over commercialization. Every listed property is audited annually.
              </p>
            </div>
            <div className="glass rounded-[32px] p-10 text-center border border-border/30 hover:-translate-y-2 transition-all duration-300">
              <Leaf className="w-10 h-10 mx-auto text-primary mb-6" />
              <h3 className="text-2xl font-serif text-primary mb-4">Authenticity</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                No tourist traps. No greenwashing. Only profound, genuine experiences that connect you deeply with nature, culture, and yourself.
              </p>
            </div>
            <div className="glass rounded-[32px] p-10 text-center border border-border/30 hover:-translate-y-2 transition-all duration-300">
              <Users className="w-10 h-10 mx-auto text-primary mb-6" />
              <h3 className="text-2xl font-serif text-primary mb-4">Community</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                A collective of modern naturalists sharing stories, discovering hidden gems, and protecting the wild together — one mindful journey at a time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Story */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 border-t border-border/30">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-1/2">
            <h2 className="text-4xl font-serif text-primary mb-6">Our Roots</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
              <p>
                GreenTrail India was born from a simple realization: the most beautiful parts of India were being loved to death, while incredible, sustainable havens remained hidden in the shadows.
              </p>
              <p>
                In 2021, four friends who'd spent years trekking the Himalayas and studying wildlife decided to build something different. Not a booking aggregator, but a curated platform built on trust — where every listing was personally verified.
              </p>
              <p>
                Today, we are more than a booking platform. We are a community of storytellers, explorers, and guardians of the wild.
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1542273917363-3b1817f69a5d?w=600&q=80" alt="Nature 1" className="rounded-3xl w-full h-64 object-cover" />
            <img src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80" alt="Nature 2" className="rounded-3xl w-full h-64 object-cover mt-10" />
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="py-20 px-6" style={{ background: "rgba(21,66,18,0.04)" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-4xl text-primary text-center mb-14">The Guardians Behind the Trail</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM.map(member => (
              <div key={member.name} className="text-center group">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white shadow-md group-hover:-translate-y-1 transition-transform">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-serif text-xl text-primary">{member.name}</h3>
                <p className="text-xs text-secondary font-semibold uppercase tracking-wider mt-1 mb-2">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 text-center px-4">
        <h2 className="text-4xl font-serif text-primary mb-8">Ready to find your trail?</h2>
        <Link href="/register">
          <button className="btn-primary px-10 py-5 text-lg inline-flex items-center gap-2">
            Join the Community <ArrowRight className="w-5 h-5" />
          </button>
        </Link>
      </div>
    </div>
  );
}
