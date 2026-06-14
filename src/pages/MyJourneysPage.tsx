import { useState } from "react";
import { Link } from "wouter";
import { MapPin, Calendar, Users, Leaf, ChevronRight, ArrowRight, Star } from "lucide-react";
import { useListBookings, useGetBookingsSummary } from "@/lib/mockHooks";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_TABS = [
  { id:"all",       label:"All Trips" },
  { id:"upcoming",  label:"Upcoming" },
  { id:"completed", label:"Completed" },
];

export default function MyJourneysPage() {
  const [status, setStatus] = useState("all");
  const { data: allBookings, isLoading } = useListBookings();
  const { data: summary } = useGetBookingsSummary();

  const bookings = status==="all" ? allBookings : allBookings?.filter(b=>b.status===status);

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-16">
      {/* Mobile header */}
      <header className="md:hidden fixed top-0 left-0 w-full z-50 px-5 pt-4 pb-3 flex items-center justify-between"
        style={{background:"rgba(255,255,255,0.88)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(194,201,187,0.35)"}}>
        <span className="font-serif text-xl text-primary italic">My Journeys</span>
        <Link href="/ai-planner">
          <button className="text-xs font-semibold text-secondary flex items-center gap-1 hover:text-primary transition-colors">
            Plan New <ArrowRight className="w-3.5 h-3.5"/>
          </button>
        </Link>
      </header>

      {/* Desktop header */}
      <div className="hidden md:block pt-32 pb-10 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-serif text-5xl text-primary mb-2">My Journeys</h1>
            <p className="text-muted-foreground text-xl">Your trail through India</p>
          </div>
          <Link href="/ai-planner">
            <button className="btn-primary text-sm px-6 py-3 flex items-center gap-2">
              Plan New Journey <ArrowRight className="w-4 h-4"/>
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mt-20 md:mt-0 mb-8">
          {[
            { value: summary?.totalBookings ?? "4",   label:"Total Trips",    icon:"📍" },
            { value: summary?.totalSpent ? `₹${Math.round(summary.totalSpent/1000)}k` : "₹62k", label:"Total Spent",    icon:"💰" },
            { value: summary?.upcomingCount ?? "2",   label:"Upcoming",       icon:"📅" },
            { value: "28",                            label:"Trees Planted 🌱",icon:"🌱" },
          ].map(s=>(
            <div key={s.label} className="glass rounded-[18px] md:rounded-[20px] p-4 md:p-6 text-center border border-border/20 shadow-sm">
              <div className="text-xl md:text-2xl mb-1">{s.icon}</div>
              <div className="font-serif text-2xl md:text-3xl text-primary font-semibold">{s.value}</div>
              <div className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Eco impact bar */}
        <div className="glass rounded-[18px] p-4 md:p-5 border border-green-200/60 bg-green-50/50 mb-8 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <Leaf className="w-5 h-5 text-green-600 fill-green-600"/>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-800">Your eco footprint is 68% lighter than average</p>
            <p className="text-xs text-green-600 mt-0.5">You've saved 1.2 tonnes of CO₂ by choosing eco-stays over hotels</p>
          </div>
          <div className="text-2xl">🏆</div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 mb-6">
          {STATUS_TABS.map(tab=>(
            <button key={tab.id} onClick={()=>setStatus(tab.id)}
              className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all ${
                status===tab.id ? "bg-primary text-white shadow-sm" : "bg-white/60 border border-border/50 text-muted-foreground hover:border-primary/30"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings */}
        {isLoading ? (
          <div className="space-y-4">{[1,2,3].map(i=><Skeleton key={i} className="h-36 rounded-[20px]"/>)}</div>
        ) : bookings && bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {bookings.map(b=>(
              <div key={b.id} className="glass rounded-[20px] md:rounded-[24px] overflow-hidden border border-border/20 shadow-sm hover:shadow-md transition-shadow flex flex-row">
                <div className="w-24 md:w-40 shrink-0 overflow-hidden">
                  <img src={b.imageUrl} alt={b.stayName} className="w-full h-full object-cover"/>
                </div>
                <div className="flex-1 p-4 md:p-5 flex flex-col justify-between min-w-0">
                  <div>
                    <div className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 ${
                      b.status==="upcoming" ? "text-green-600" : "text-muted-foreground"
                    }`}>
                      {b.status==="upcoming" ? "✦ Upcoming" : "✓ Completed"}
                    </div>
                    <h3 className="font-serif text-base md:text-lg text-primary leading-tight line-clamp-1 mb-1">{b.stayName}</h3>
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0"/><span className="truncate">{b.destinationName}</span>
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3 shrink-0"/>
                        {new Date(b.checkIn).toLocaleDateString("en-IN",{day:"numeric",month:"short"})} – {new Date(b.checkOut).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3 shrink-0"/>{b.guests} guest{b.guests>1?"s":""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                    <span className="font-bold text-primary text-sm">₹{b.totalAmount.toLocaleString()}</span>
                    {b.status==="upcoming" ? (
                      <Link href="/stays/1"><button className="text-xs text-secondary font-bold hover:text-primary transition-colors flex items-center gap-0.5">View <ChevronRight className="w-3 h-3"/></button></Link>
                    ) : (
                      <Link href="/stories"><button className="text-xs text-secondary font-bold hover:text-primary transition-colors flex items-center gap-0.5">Rate & Review <Star className="w-3 h-3"/></button></Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass rounded-[24px] border border-border/20">
            <div className="text-5xl mb-5">🏕️</div>
            <h3 className="font-serif text-2xl text-primary mb-2">No {status!=="all"?status+" ":""} trips yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-sm">Your trail is waiting. Discover your first eco-retreat and begin your story.</p>
            <Link href="/stays">
              <button className="btn-primary px-8 py-3 text-sm">Browse Retreats →</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
