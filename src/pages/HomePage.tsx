import { useState } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { 
  ChevronDown, MapPin, 
  Leaf, Star, ArrowRight, Sparkles, 
  TreePine, Mountain, Waves 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { STATES } from "@/lib/api";
import { STATE_IMAGES } from "@/lib/imagesApi";
import { 
  useListHiddenGems, 
  useListFeaturedStays, 
  useListStates, 
  useListStories 
} from "@/lib/mockHooks";

// For motion stagger
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};


// ── All-India state grid ────────────────────────────────────────

function StateGrid({ loading }: { loading: boolean }) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? STATES : STATES.slice(0, 12);
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] rounded-[20px] bg-surface-container animate-pulse" />
        ))}
      </div>
    );
  }
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {displayed.map(st => (
          <Link
            key={st.slug}
            href={`/destinations?state=${encodeURIComponent(st.name)}`}
            className="group relative aspect-[3/4] rounded-[20px] overflow-hidden bg-surface-container cursor-pointer"
          >
            <img
              src={STATE_IMAGES[st.name] || st.imageUrl || "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&q=80"}
              alt={st.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&q=80"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
              <h3 className="font-serif text-sm md:text-base text-white leading-tight mb-0.5">{st.name}</h3>
              <span className="text-white/60 text-[10px] font-semibold uppercase tracking-wider">{st.destinationCount} places</span>
            </div>
          </Link>
        ))}
      </div>
      <div className="text-center mt-8">
        <button
          onClick={() => setShowAll(v => !v)}
          className="btn-outline text-sm px-8 py-3 inline-flex items-center gap-2"
        >
          {showAll ? "Show Less" : `Show All ${STATES.length} States & UTs`}
          <ArrowRight className={`w-4 h-4 transition-transform ${showAll ? "rotate-90" : ""}`} />
        </button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [, navigate]       = useLocation();
  const { data: hiddenGems, isLoading: loadingGems }     = useListHiddenGems();
  const { data: featuredStays, isLoading: loadingStays } = useListFeaturedStays();
  const { data: states, isLoading: loadingStates }       = useListStates();
  const { data: stories, isLoading: loadingStories }     = useListStories({ featured: false });


  return (
    <div className="min-h-screen bg-background">
        {/* 1. Full-viewport Hero */}
        <section className="relative h-[100dvh] min-h-[600px] flex flex-col items-center justify-center pt-20">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed z-0" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/30 to-transparent z-10" />
          
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center"
          >
            <motion.div variants={item}>
              <Badge variant="outline" className="bg-white/10 text-white border-white/20 backdrop-blur-md mb-6 py-1.5 px-4 text-sm font-medium tracking-wide">
                Explore Responsibly
              </Badge>
            </motion.div>
            
            <motion.h1 variants={item} className="font-serif text-5xl md:text-7xl text-white mb-6 leading-tight tracking-tight">
              Discover the Serenity of the Untamed Himalayas.
            </motion.h1>
            
            <motion.p variants={item} className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl font-light">
              Curated eco-journeys through India's most sacred landscapes
            </motion.p>
            

            <motion.div variants={item} className="flex flex-wrap justify-center gap-3">
              {['Himachal', 'Uttarakhand', 'Ladakh', 'Sikkim', 'Western Ghats', 'Rajasthan'].map(state => (
                <button 
                  key={state}
                  onClick={() => navigate(`/destinations?state=${encodeURIComponent(state)}`)}
                  className="text-xs font-medium text-white/80 bg-white/5 hover:bg-white/20 transition-colors px-4 py-2 rounded-full backdrop-blur-sm border border-white/10"
                  data-testid={`hero-chip-${state.toLowerCase()}`}
                >
                  {state}
                </button>
              ))}
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/60 flex flex-col items-center"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <ChevronDown className="h-8 w-8" />
            </motion.div>
          </motion.div>
        </section>

        {/* 2. Hidden Gems Section */}
        <section className="py-32 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-primary mb-4">Hidden Gems of India</h2>
            <p className="text-muted-foreground text-lg">Places the guidebooks forgot</p>
          </div>

          {loadingGems ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
              <Skeleton className="md:col-span-2 md:row-span-2 rounded-[32px] h-full" />
              <Skeleton className="rounded-[32px]" />
              <Skeleton className="rounded-[32px]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-6 h-auto md:h-[600px]">
              {hiddenGems?.slice(0, 3).map((gem, idx) => (
                <Link 
                  key={gem.id} 
                  href={`/destinations/${gem.id}`}
                  className={`group relative overflow-hidden rounded-[32px] block cursor-pointer bg-card ${
                    idx === 0 ? 'md:col-span-2 md:row-span-2 h-[400px] md:h-full' : 'h-[300px] md:h-full'
                  }`}
                  data-testid={`card-hidden-gem-${gem.id}`}
                >
                  <img 
                    src={gem.imageUrl || 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800'} 
                    alt={gem.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <Badge className="bg-white/20 text-white backdrop-blur-md hover:bg-white/30 mb-4 border-none px-3 py-1 text-xs">
                      {gem.state}
                    </Badge>
                    <h3 className="font-serif text-3xl text-white mb-2">{gem.name}</h3>
                    <p className="text-white/80 line-clamp-2 font-light">{gem.tagline || gem.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* 3. AI Planner Promo Section */}
        <section className="py-24 bg-primary/5 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-5/12 space-y-6">
              <Badge variant="outline" className="text-secondary border-secondary/30 bg-secondary/10 px-3 py-1">
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                Powered by Nature Intelligence
              </Badge>
              <h2 className="font-serif text-4xl md:text-5xl text-primary leading-tight">
                Design Your Perfect Journey
              </h2>
              <p className="text-lg text-muted-foreground font-light leading-relaxed">
                Tell us how you want to feel, what you want to see, and how long you have. 
                Our AI crafts deeply personalized, sustainable itineraries that tread lightly on the earth.
              </p>
              <Button asChild className="btn-primary rounded-full px-8 py-6 text-lg mt-4 font-medium">
                <Link href="/ai-planner" data-testid="btn-start-planning">
                  Start Planning <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
            
            <div className="w-full md:w-7/12">
              <div className="glass rounded-[32px] p-8 md:p-12 relative overflow-hidden border border-white/50 shadow-xl bg-white/40">
                <div className="absolute top-0 right-0 p-32 bg-secondary/10 rounded-full blur-[100px] -mr-16 -mt-16 pointer-events-none" />
                
                <div className="relative z-10 space-y-8">
                  <div>
                    <h3 className="text-lg font-medium text-primary mb-4">I want to feel...</h3>
                    <div className="flex flex-wrap gap-3">
                      {['Quiet & Reflective', 'Raw & Wild', 'Culturally Immersed', 'Spiritually Restored'].map(mood => (
                        <button key={mood} className="px-5 py-2.5 rounded-full border border-primary/10 hover:border-primary/30 hover:bg-white bg-white/60 text-primary transition-all text-sm font-medium shadow-sm">
                          {mood}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-primary mb-4">For...</h3>
                    <div className="flex flex-wrap gap-3">
                      {['3 days', '7 days', '10 days', '14 days'].map(days => (
                        <button key={days} className="px-5 py-2.5 rounded-full border border-primary/10 hover:border-primary/30 hover:bg-white bg-white/60 text-primary transition-all text-sm font-medium shadow-sm">
                          {days}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <Button asChild className="w-full btn-primary py-6 text-lg rounded-full shadow-lg hover:shadow-xl mt-4 font-medium">
                    <Link href="/ai-planner" data-testid="btn-generate-journey">
                      <Sparkles className="mr-2 w-5 h-5" /> Generate My Journey
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Featured Retreats */}
        <section className="py-32 pl-6 md:pl-0 max-w-7xl mx-auto">
          <div className="md:px-6 mb-12 flex items-end justify-between pr-6">
            <h2 className="font-serif text-4xl text-primary">Handpicked Retreats</h2>
            <Link href="/stays" className="text-secondary hover:text-primary font-medium flex items-center transition-colors">
              View all <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar md:px-6 snap-x">
            {loadingStays ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-80 shrink-0 snap-start">
                  <Skeleton className="w-full h-[420px] rounded-[24px]" />
                </div>
              ))
            ) : (
              featuredStays?.map((stay) => (
                <div key={stay.id} className="w-80 shrink-0 snap-start group relative rounded-[24px] overflow-hidden h-[420px] shadow-sm border border-border bg-card">
                  <img 
                    src={stay.imageUrl || 'https://images.unsplash.com/photo-1542314831-c6a4d14272ce?w=800'} 
                    alt={stay.name}
                    className="w-full h-[60%] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="absolute bottom-0 left-0 right-0 h-[40%] glass p-6 flex flex-col justify-between z-10 transition-transform bg-white/90 backdrop-blur-xl border-t border-white/20">
                    <div>
                      <h3 className="font-serif text-xl font-medium text-foreground line-clamp-1">{stay.name}</h3>
                      <div className="flex items-center text-muted-foreground text-sm mt-2">
                        <MapPin className="w-3.5 h-3.5 mr-1" />
                        {stay.destinationName}, {stay.state}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-1.5 text-secondary bg-secondary/10 px-2 py-1 rounded-full">
                        <Leaf className="w-3.5 h-3.5 fill-current" />
                        <span className="text-xs font-semibold">{stay.ecoRating}/5</span>
                      </div>
                      <div className="text-right flex flex-col">
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">from</span>
                        <span className="font-serif text-lg font-semibold text-primary">₹{stay.pricePerNight}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/stays/${stay.id}`} 
                    className="absolute inset-0 z-20"
                    data-testid={`card-stay-${stay.id}`}
                  >
                    <span className="sr-only">Explore {stay.name}</span>
                  </Link>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 5. Explore by State */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-primary mb-4">Explore India by State</h2>
            <p className="text-muted-foreground text-lg">Diverse landscapes, endless possibilities</p>
          </div>

          <StateGrid loading={loadingStates} />
        </section>

        {/* 6. Traveler Stories */}
        <section className="py-32 px-6 max-w-7xl mx-auto bg-card/50 rounded-[40px] my-12 border border-border/50">
          <div className="text-center mb-16">
            <span className="text-secondary font-semibold tracking-widest uppercase text-xs">Shared Rhythms</span>
            <h2 className="font-serif text-4xl text-primary mt-4">Stories from the trail</h2>
          </div>

          {loadingStories ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="w-full aspect-[4/3] rounded-[24px]" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stories?.slice(0, 3).map((story) => (
                <div key={story.id} className="group cursor-pointer">
                  <Link href={`/stories/${story.id}`} data-testid={`card-story-${story.id}`}>
                    <div className="relative overflow-hidden rounded-[24px] aspect-[4/3] mb-6">
                      <img 
                        src={story.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'} 
                        alt={story.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 text-primary hover:bg-white backdrop-blur-sm shadow-sm border-none font-medium px-3 py-1">
                          {story.destination}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <img 
                        src={story.authorAvatar || `https://i.pravatar.cc/150?u=${story.authorName}`} 
                        alt={story.authorName} 
                        className="w-8 h-8 rounded-full border border-border"
                      />
                      <span className="text-sm font-medium text-foreground">{story.authorName}</span>
                    </div>
                    
                    <h3 className="font-serif text-2xl text-primary mb-3 group-hover:text-secondary transition-colors line-clamp-2">
                      {story.title}
                    </h3>
                    
                    <p className="text-muted-foreground line-clamp-2 mb-4 font-light leading-relaxed">
                      {story.excerpt || story.content?.substring(0, 100) + '...'}
                    </p>
                    
                    <span className="text-sm font-semibold text-secondary flex items-center group-hover:translate-x-1 transition-transform">
                      Read story <ArrowRight className="ml-1.5 w-4 h-4" />
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 7. Seasonal Explorer Banner */}
        <section className="py-24 bg-primary/5">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="font-serif text-3xl text-primary mb-10 text-center">Travel by Season</h2>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {[
                { name: 'Winter', desc: 'Dec-Feb', icon: Mountain },
                { name: 'Spring', desc: 'Mar-May', icon: TreePine },
                { name: 'Summer', desc: 'Jun-Aug', icon: Waves },
                { name: 'Monsoon', desc: 'Sep-Nov', icon: Leaf },
              ].map(season => (
                <button 
                  key={season.name}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-primary/10 text-primary hover:border-primary/30 hover:shadow-md transition-all group"
                >
                  <season.icon className="w-4 h-4 text-secondary group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{season.name}</span>
                  <span className="text-muted-foreground text-sm font-light">({season.desc})</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 8. CTA Section */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-primary z-0" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542314831-c6a4d14272ce?w=1600')] bg-cover bg-center opacity-20 mix-blend-overlay z-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent z-10" />
          
          <div className="relative z-20 max-w-4xl mx-auto px-6 text-center text-primary-foreground">
            <h2 className="font-serif text-5xl md:text-6xl mb-6 leading-tight">Ready to Explore India's Wild Heart?</h2>
            <p className="text-primary-foreground/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Join thousands of conscious travelers discovering the untouched beauty of the subcontinent.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild className="bg-white text-primary hover:bg-white/90 rounded-full px-8 py-6 text-lg w-full sm:w-auto shadow-xl font-medium">
                <Link href="/destinations">Browse Destinations</Link>
              </Button>
              <Button asChild variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg w-full sm:w-auto backdrop-blur-sm font-medium">
                <Link href="/ai-planner">
                  <Sparkles className="w-5 h-5 mr-2" /> Plan with AI
                </Link>
              </Button>
            </div>
          </div>
        </section>
    </div>
  );
}