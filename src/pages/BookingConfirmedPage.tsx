import { useState } from "react";
import { Link } from "wouter";
import { CheckCircle, Download, Calendar, MapPin, Clock, Users, ArrowRight, Plus, Share2, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import { useSearch } from "wouter";

export default function BookingConfirmedPage() {
  const [added, setAdded] = useState(false);
  const search = useSearch();

const params = new URLSearchParams(search);

const total = params.get("total");
const guests = params.get("guests");
const checkin = params.get("checkin");
const checkout = params.get("checkout");
const stayId = Number(params.get("stayId") || 1);

  useEffect(()=>{
    // Simple confetti using DOM elements
    const colors = ["#154212","#386934","#bcf0ae","#ffdeac","#a1d494"];
    for (let i = 0; i < 60; i++) {
      const el = document.createElement("div");
      el.style.cssText = `position:fixed;top:-10px;left:${Math.random()*100}%;width:8px;height:8px;border-radius:${Math.random()>0.5?"50%":"2px"};background:${colors[Math.floor(Math.random()*colors.length)]};z-index:9999;pointer-events:none;animation:confettiFall ${1.5+Math.random()*2}s ${Math.random()*0.8}s ease-in forwards`;
      document.body.appendChild(el);
      setTimeout(()=>el.remove(), 4000);
    }
    // Inject keyframes once
    if (!document.getElementById("confetti-style")) {
      const style = document.createElement("style");
      style.id = "confetti-style";
      style.textContent = `@keyframes confettiFall{to{transform:translateY(100vh) rotate(720deg);opacity:0}}`;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero bg */}
      <div className="relative h-72 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1542314831-c6a4d14272ce?w=1600&q=80" alt="Retreat" className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-background"/>
      </div>

      <div className="max-w-3xl mx-auto px-6 -mt-32 relative z-10 pb-24">
        {/* Confirmation card */}
        <div className="glass rounded-[32px] p-8 md:p-12 border border-border/30 shadow-2xl text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600 fill-green-100"/>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
            <Leaf className="w-3 h-3 fill-green-600"/> Eco-Certified Booking Confirmed
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-primary mb-3">Your Journey is Confirmed</h1>
          <p className="text-muted-foreground text-lg font-light">The quiet rhythm of the wild awaits. Your retreat has been successfully secured.</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground">Booking Reference</span>
            <code className="bg-surface-container px-3 py-1 rounded-full text-sm font-bold text-primary">GTI-8492-VLY</code>
            <button className="text-secondary hover:text-primary transition-colors" onClick={()=>navigator.clipboard?.writeText("GTI-8492-VLY")}>
              <Download className="w-4 h-4"/>
            </button>
          </div>
        </div>

        {/* Journey timeline */}
        <div className="glass rounded-[28px] p-8 border border-border/30 mb-6">
          <h2 className="font-serif text-2xl text-primary mb-6">Your Journey Begins</h2>
          <p className="text-sm text-muted-foreground mb-6 italic">A timeline of your upcoming escape.</p>

          <div className="space-y-0">
            {/* Arrival */}
            <div className="flex items-start gap-4 pb-6 relative">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary text-lg">🏔️</span>
                </div>
                <div className="w-px flex-1 bg-border/40 mt-2 min-h-[40px]"/>
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">Arrival</Badge>
                  <span className="text-xs text-muted-foreground">Check-in from 2:00 PM</span>
                </div>
                <p className="font-semibold text-primary">Oct 14, 2024</p>
                <p className="text-sm text-muted-foreground">The Silent Valley Retreat · Jibhi</p>
              </div>
            </div>

            {/* Stay */}
            <div className="flex items-start gap-4 pb-6 relative">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                  <span className="text-secondary text-lg">🌿</span>
                </div>
                <div className="w-px flex-1 bg-border/40 mt-2 min-h-[40px]"/>
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-secondary/10 text-secondary border-secondary/20 text-xs">4 Nights</Badge>
                </div>
                <p className="font-semibold text-primary">Your Stay</p>
                <p className="text-sm text-muted-foreground">Forest walks, river sounds, organic meals, star gazing</p>
              </div>
            </div>

            {/* Departure */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                <span className="text-amber-600 text-lg">🌅</span>
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs">Departure</Badge>
                  <span className="text-xs text-muted-foreground">Check-out by 11:00 AM</span>
                </div>
                <p className="font-semibold text-primary">Oct 18, 2024</p>
                <p className="text-sm text-muted-foreground">Carry the silence with you</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking details */}
        <div className="glass rounded-[28px] p-8 border border-border/30 mb-6">
          <h2 className="font-serif text-2xl text-primary mb-5">Booking Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: MapPin,    label:"Retreat",   value:"The Pine Whispers Sanctuary" },
              { icon: Calendar,  label:"Dates",     value:"Oct 14 – 18, 2024" },
              { icon: Users,     label:"Guests",    value:"2 Travellers" },
              { icon: Clock,     label:"Duration",  value:"4 Nights" },
            ].map(d=>(
              <div key={d.label} className="bg-surface-container/50 rounded-2xl p-4 text-center">
                <d.icon className="w-5 h-5 text-secondary mx-auto mb-2"/>
                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">{d.label}</div>
                <div className="text-sm font-semibold text-primary">{d.value}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-6 pt-5 border-t border-border/30">
            <div>
              <p className="text-xs text-muted-foreground">Total Paid</p>
              <p className="font-serif text-2xl text-primary font-semibold">₹19,600</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Eco Impact</p>
              <p className="text-sm font-semibold text-green-700">🌱 3 Trees Planted</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="btn-outline py-4 flex items-center justify-center gap-2 text-sm">
            <Download className="w-4 h-4"/> Receipt generation available soon.
          </Button>
          <Button
            variant="outline"
            className={`py-4 flex items-center justify-center gap-2 text-sm transition-colors ${added?"border-green-500 text-green-600":"btn-outline"}`}
            onClick={()=>setAdded(true)}
          >
            <Plus className="w-4 h-4"/> {added?"Added to Trips ✓":"Add to My Trips"}
          </Button>
          <Button
  variant="outline"
  className="btn-outline py-4 flex items-center justify-center gap-2 text-sm"
  onClick={async () => {
    const shareData = {
      title: "My GreenTrail Journey",
      text: "I'm going on an amazing eco-friendly retreat with GreenTrail India!",
      url: window.location.origin,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);

        alert(
          "Booking link copied to clipboard!"
        );
      }
    } catch (err) {
      console.error(err);
    }
  }}
>
  <Share2 className="w-4 h-4"/>
  Invite Fellow Travellers
</Button>
        </div>

        <div className="text-center mt-8">
          <Link href="/">
            <button className="text-secondary font-semibold text-sm hover:text-primary transition-colors flex items-center gap-1 mx-auto">
              Return to GreenTrail <ArrowRight className="w-4 h-4"/>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
