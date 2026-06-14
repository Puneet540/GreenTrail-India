import { useState } from "react";
import { Heart, MessageCircle, Share2, MapPin, Clock, Search, Bookmark, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { STORIES, DESTINATIONS } from "@/lib/api";

// Extended community feed with more posts
const COMMUNITY_POSTS = [
  { id:1, author:"@elara_travels", avatar:"https://i.pravatar.cc/150?u=elara", location:"Coorg, Karnataka", timeAgo:"2 days ago", image:"https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?w=600&q=80", caption:"Morning mist over the canopy. Woke up to absolute silence and the smell of wet earth. The trail from the estate leads right into the clouds.", tags:["Coorg","Karnataka","MorningMist","EcoTrail"], likes:147, comments:24, saves:38 },
  { id:2, author:"@julian_thorne", avatar:"https://i.pravatar.cc/150?u=julian", location:"Coorg, Karnataka", timeAgo:"2 days ago", image:"https://images.unsplash.com/photo-1542273917363-3b1817f69a5d?w=600&q=80", caption:"If you take the unmarked path just past the second tea estate, you'll find a secluded waterfall. It requires a bit of a scramble but having the entire pool to yourself at golden hour was worth every step.", tags:["HiddenWaterfall","Coorg","OffTheMap"], likes:89, comments:31, saves:62 },
  { id:3, author:"@priya.wanders", avatar:"https://i.pravatar.cc/150?u=priya2", location:"Jibhi, Himachal Pradesh", timeAgo:"4 days ago", image:"https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80", caption:"Day 4 in Jibhi. I've stopped counting steps and started counting sounds — the river, the wind, the distant cowbell. This is what slow travel feels like.", tags:["Jibhi","SlowTravel","Himachal"], likes:203, comments:45, saves:91 },
  { id:4, author:"@meera_wild", avatar:"https://i.pravatar.cc/150?u=meera2", location:"Spiti Valley, Himachal Pradesh", timeAgo:"1 week ago", image:"https://images.unsplash.com/photo-1591016405280-f0e1e978e432?w=600&q=80", caption:"Kaza at 4am. The stars in Spiti aren't stars, they're an ocean of light. No pollution, no light interference, just the entire Milky Way splashed above a stone monastery.", tags:["Spiti","StarGazing","Himachal","MonkeyPoint"], likes:341, comments:67, saves:154 },
  { id:5, author:"@aditya_frames", avatar:"https://i.pravatar.cc/150?u=aditya2", location:"Alleppey, Kerala", timeAgo:"1 week ago", image:"https://images.unsplash.com/photo-1584507776049-b99a97f7b5f6?w=600&q=80", caption:"The backwaters at 6am before the tourist boats arrive. Just you, a silent canoe, and a heron fishing in the mist. Kerala's real magic lives in this hour.", tags:["Alleppey","Kerala","Backwaters","SilentMorning"], likes:178, comments:29, saves:77 },
  { id:6, author:"@rahul.paths", avatar:"https://i.pravatar.cc/150?u=rahul2", location:"Pangong Lake, Ladakh", timeAgo:"2 weeks ago", image:"https://images.unsplash.com/photo-1591016405280-f0e1e978e432?w=600&q=80", caption:"The colour of Pangong changes every 20 minutes. I watched it shift from pale turquoise to deep navy blue and back to silver as a storm rolled in from Tibet. Three hours just sitting.", tags:["Pangong","Ladakh","HighAltitude","LakeViews"], likes:412, comments:84, saves:210 },
];

const DESTINATIONS_FILTER = ["All", ...new Set(COMMUNITY_POSTS.map(p => p.location.split(",")[1]?.trim() || p.location))];

export default function CommunityStoriesPage() {
  const [destFilter, setDestFilter] = useState("All");
  const [searchQ, setSearchQ] = useState("");
  const [liked, setLiked]     = useState<number[]>([]);
  const [saved, setSaved]     = useState<number[]>([]);

  const toggleLike = (id:number) => setLiked(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const toggleSave = (id:number) => setSaved(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);

  const filtered = COMMUNITY_POSTS
    .filter(p => destFilter === "All" || p.location.includes(destFilter))
    .filter(p => !searchQ || p.caption.toLowerCase().includes(searchQ.toLowerCase()) || p.tags.some(t=>t.toLowerCase().includes(searchQ.toLowerCase())));

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="pt-32 pb-12 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="font-serif text-5xl text-primary mb-2">Rhythms of the Community</h1>
            <p className="text-muted-foreground text-lg">Moments, hidden clearings, and silent summits shared by the modern naturalist community.</p>
          </div>
          <Link href="/stories">
            <button className="btn-outline text-sm px-6 py-3 flex items-center gap-2 shrink-0">
              Share Your Story <ArrowRight className="w-4 h-4"/>
            </button>
          </Link>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
            <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search stories, tags…"
              className="w-full pl-9 pr-4 py-2.5 rounded-full bg-white/60 border border-border/50 text-sm focus:outline-none focus:border-primary/40"/>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {DESTINATIONS_FILTER.map(d=>(
              <button key={d} onClick={()=>setDestFilter(d)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold border transition-all shrink-0 ${destFilter===d?"bg-primary text-white border-primary":"bg-white/60 border-border/50 text-muted-foreground hover:border-primary/30"}`}>
                {d}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry feed */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        {/* Featured story from stories data */}
        {STORIES.filter(s=>s.isFeatured).map(story=>(
          <Link key={story.id} href={`/stories/${story.id}`}>
            <div className="group relative rounded-[28px] overflow-hidden h-80 mb-10 cursor-pointer hover:shadow-xl transition-shadow">
              <img src={story.imageUrl} alt={story.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"/>
              <div className="absolute top-5 left-5"><Badge className="bg-white/20 text-white border-none backdrop-blur-sm text-xs uppercase tracking-wider">✦ Featured Story</Badge></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-2 flex items-center gap-2">
                    <img src={story.authorAvatar} alt={story.authorName} className="w-6 h-6 rounded-full"/>
                    {story.authorName}
                  </p>
                  <h2 className="font-serif text-3xl text-white mb-1">{story.title}</h2>
                  <p className="text-white/75 text-sm line-clamp-1">{story.excerpt}</p>
                </div>
                <span className="text-white/80 text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0 ml-6">
                  Read <ArrowRight className="w-4 h-4"/>
                </span>
              </div>
            </div>
          </Link>
        ))}

        {/* Community post grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filtered.map(post=>(
            <div key={post.id} className="break-inside-avoid glass rounded-[24px] overflow-hidden border border-border/20 shadow-sm hover:shadow-md transition-shadow">
              {/* Author header */}
              <div className="flex items-center gap-3 p-4 pb-3">
                <img src={post.avatar} alt={post.author} className="w-9 h-9 rounded-full border border-border/30"/>
                <div>
                  <div className="font-semibold text-sm text-primary">{post.author}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3"/>{post.location}
                    <span className="mx-1">·</span>
                    <Clock className="w-3 h-3"/>{post.timeAgo}
                  </div>
                </div>
              </div>
              {/* Image */}
              <div className="relative overflow-hidden">
                <img src={post.image} alt={post.caption.slice(0,30)} className="w-full object-cover hover:scale-105 transition-transform duration-500" style={{maxHeight:"280px",objectFit:"cover"}}/>
              </div>
              {/* Caption */}
              <div className="p-4">
                <p className="text-sm text-foreground leading-relaxed mb-3">{post.caption}</p>
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.map(t=>(
                    <span key={t} className="text-xs text-secondary font-semibold cursor-pointer hover:text-primary transition-colors">#{t}</span>
                  ))}
                </div>
                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-border/30">
                  <div className="flex items-center gap-4">
                    <button onClick={()=>toggleLike(post.id)} className={`flex items-center gap-1.5 text-sm transition-colors ${liked.includes(post.id)?"text-red-500":"text-muted-foreground hover:text-red-400"}`}>
                      <Heart className={`w-4 h-4 ${liked.includes(post.id)?"fill-current":""}`}/>
                      <span>{post.likes + (liked.includes(post.id)?1:0)}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <MessageCircle className="w-4 h-4"/><span>{post.comments}</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={()=>toggleSave(post.id)} className={`transition-colors ${saved.includes(post.id)?"text-primary":"text-muted-foreground hover:text-primary"}`}>
                      <Bookmark className={`w-4 h-4 ${saved.includes(post.id)?"fill-current":""}`}/>
                    </button>
                    <button className="text-muted-foreground hover:text-primary transition-colors">
                      <Share2 className="w-4 h-4"/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p>No stories found for these filters.</p>
            <button onClick={()=>{setDestFilter("All");setSearchQ("");}} className="mt-3 text-secondary text-sm font-semibold">Clear filters</button>
          </div>
        )}
      </section>
    </div>
  );
}
