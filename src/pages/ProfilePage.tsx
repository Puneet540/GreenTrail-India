import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Camera, MapPin, Edit3, ChevronRight, LogOut, Bell, Shield, HelpCircle, Settings, BookmarkIcon, Heart, Leaf, Check, X, ArrowRight, Star, Trash2 } from "lucide-react";
import { useGetProfile, useUpdateProfile, useListBookings } from "@/lib/mockHooks";
import { useToast } from "@/hooks/use-toast";
import { DESTINATIONS } from "@/lib/api";
import { PROFILE } from "@/lib/api";
import { useDestinationImage } from "@/hooks/useDestinationImage";

// ── Local storage keys ──────────────────────────────────────
const LS_PROFILE = "greentrail_profile";
const LS_WISHLIST = "greentrail_wishlist";
const LS_NOTIF = "greentrail_notifications";

type ProfileData = {
  name: string; email: string; bio: string; location: string;
  avatarUrl: string; phone: string; travelStyle: string;
};

const TRAVEL_STYLES = ["Solo Wanderer", "Couple Explorer", "Family Trekker", "Group Adventurer"];
const DEFAULT_WISHLIST = [1, 4, 23];

const ACHIEVEMENTS = [
  { id: "eco-warrior",    label: "Eco-Warrior",     icon: "🌿", desc: "Stayed at 5+ certified eco-retreats", earned: true },
  { id: "trailblazer",    label: "Trailblazer",      icon: "🥾", desc: "Completed 10+ nature trails", earned: true },
  { id: "river-guardian", label: "River Guardian",   icon: "💧", desc: "Zero single-use plastic on 3 trips", earned: true },
  { id: "storyteller",    label: "Storyteller",      icon: "✍️", desc: "Published 3 trail stories", earned: false },
  { id: "mountain-soul",  label: "Mountain Soul",    icon: "🏔️", desc: "Visited 5+ mountain destinations", earned: false },
];

const NOTIFICATIONS = [
  { id: 1, title: "Booking Confirmed", body: "Pine Whispers Sanctuary · Oct 14–18", time: "2h ago", read: false, icon: "✅" },
  { id: 2, title: "New Hidden Gem Added", body: "Dawki, Meghalaya — Crystal Clear River", time: "1 day ago", read: false, icon: "💎" },
  { id: 3, title: "Seasonal Guide Updated", body: "Best time to visit Ladakh is now", time: "3 days ago", read: true, icon: "📅" },
  { id: 4, title: "Your Review Approved", body: "Forest Bloom Camp — 5 stars", time: "1 week ago", read: true, icon: "⭐" },
];

export default function ProfilePage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Local state with localStorage persistence ──────────────
  const [profile, setProfile] = useState<ProfileData>(() => {
    try {
      const saved = localStorage.getItem(LS_PROFILE);
      return saved ? JSON.parse(saved) : {
        name: PROFILE.name, email: PROFILE.email, bio: PROFILE.bio,
        location: PROFILE.location, avatarUrl: PROFILE.avatarUrl,
        phone: "+91 98765 43210", travelStyle: "Solo Wanderer",
      };
    } catch { return { name: PROFILE.name, email: PROFILE.email, bio: PROFILE.bio, location: PROFILE.location, avatarUrl: PROFILE.avatarUrl, phone: "+91 98765 43210", travelStyle: "Solo Wanderer" }; }
  });

  const [wishlist, setWishlist] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem(LS_WISHLIST) || "null") || DEFAULT_WISHLIST; } catch { return DEFAULT_WISHLIST; }
  });

  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<"journeys" | "saved" | "achievements" | "settings">("journeys");
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<ProfileData>(profile);

  // ── Persist changes ────────────────────────────────────────
  useEffect(() => { localStorage.setItem(LS_PROFILE, JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem(LS_WISHLIST, JSON.stringify(wishlist)); }, [wishlist]);

  const { data: bookings } = useListBookings();

  // ── Handlers ───────────────────────────────────────────────
  const handleSave = () => {
    setProfile(editForm);
    setEditing(false);
    toast({ title: "Profile updated!", description: "Your changes have been saved." });
  };

  const handleCancel = () => { setEditForm(profile); setEditing(false); };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast({ title: "Image too large", description: "Max 5MB", variant: "destructive" }); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      const url = ev.target?.result as string;
      setProfile(p => ({ ...p, avatarUrl: url }));
      setEditForm(p => ({ ...p, avatarUrl: url }));
      toast({ title: "Avatar updated!" });
    };
    reader.readAsDataURL(file);
  };

  const removeFromWishlist = (id: number) => {
    setWishlist(p => p.filter(x => x !== id));
    toast({ title: "Removed from saved" });
  };

  const markAllRead = () => {
    setNotifications(p => p.map(n => ({ ...n, read: true })));
    toast({ title: "All notifications marked as read" });
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const savedDests = DESTINATIONS.filter(d => wishlist.includes(d.id));

  function SavedDestinationImage({
  name,
  fallback,
}: {
  name: string;
  fallback: string;
}) {
  const image = useDestinationImage(
    name,
    fallback
  );

  return (
    <img
      src={image}
      alt={name}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
    />
  );
}

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-16">
      {/* Hidden file input for avatar */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />

      {/* ── MOBILE HEADER ── */}
      <header className="md:hidden fixed top-0 left-0 w-full z-50 px-5 pt-4 pb-3 flex justify-between items-center"
        style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(194,201,187,0.35)" }}>
        <span className="font-serif text-xl text-primary italic">My Profile</span>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button onClick={() => setActiveTab("settings")} className="relative">
              <Bell className="w-5 h-5 text-primary" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">{unreadCount}</span>
            </button>
          )}
          <button onClick={() => setEditing(v => !v)} className="text-primary">
            <Edit3 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ── COVER + PROFILE CARD ── */}
      <div className="relative">
        <div className="h-36 md:h-52 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80" alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
        </div>

        <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-12 md:-mt-16 relative z-10">
          <div className="glass rounded-[24px] md:rounded-[32px] p-5 md:p-8 border border-white/40 shadow-xl">

            {/* Avatar + basic info row */}
            <div className="flex flex-col md:flex-row md:items-start gap-5 md:gap-8">
              {/* Avatar */}
              <div className="flex justify-center md:block shrink-0">
                <div className="relative">
                  <img src={profile.avatarUrl} alt={profile.name}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-xl object-cover" />
                  <button onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:bg-secondary transition-colors">
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Name / Edit form */}
              <div className="flex-1 text-center md:text-left">
                {editing ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Name</label>
                        <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-xl bg-white/60 border border-border/50 text-sm focus:outline-none focus:border-primary/50" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Location</label>
                        <input value={editForm.location} onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-xl bg-white/60 border border-border/50 text-sm focus:outline-none focus:border-primary/50" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Email</label>
                        <input type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-xl bg-white/60 border border-border/50 text-sm focus:outline-none focus:border-primary/50" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Phone</label>
                        <input type="tel" value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-xl bg-white/60 border border-border/50 text-sm focus:outline-none focus:border-primary/50" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Bio</label>
                      <textarea value={editForm.bio} onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))}
                        rows={3} className="w-full px-3 py-2.5 rounded-xl bg-white/60 border border-border/50 text-sm focus:outline-none focus:border-primary/50 resize-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Travel Style</label>
                      <div className="flex flex-wrap gap-2">
                        {TRAVEL_STYLES.map(s => (
                          <button key={s} onClick={() => setEditForm(f => ({ ...f, travelStyle: s }))}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${editForm.travelStyle === s ? "bg-primary text-white border-primary" : "border-border/50 text-muted-foreground"}`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={handleSave} className="btn-primary text-sm px-6 py-2.5 flex-1 flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" /> Save Changes
                      </button>
                      <button onClick={handleCancel} className="btn-outline text-sm px-5 py-2.5 flex items-center gap-2">
                        <X className="w-4 h-4" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-center md:justify-between gap-3 mb-1">
                      <div>
                        <h1 className="font-serif text-2xl md:text-3xl text-primary">{profile.name}</h1>
                        <p className="text-muted-foreground text-sm flex items-center justify-center md:justify-start gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5" />{profile.location}
                        </p>
                      </div>
                      <button onClick={() => setEditing(true)}
                        className="hidden md:flex items-center gap-1.5 text-sm text-secondary hover:text-primary transition-colors shrink-0 mt-1">
                        <Edit3 className="w-4 h-4" /> Edit Profile
                      </button>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-lg mt-2">{profile.bio}</p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3">
                      <span className="text-xs bg-surface-container rounded-full px-3 py-1 text-muted-foreground font-semibold">{profile.travelStyle}</span>
                      <span className="text-xs bg-green-50 text-green-700 rounded-full px-3 py-1 font-semibold flex items-center gap-1">
                        <Leaf className="w-3 h-3 fill-green-600" /> Eco Traveler
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Desktop stats */}
              {!editing && (
                <div className="hidden md:grid grid-cols-3 gap-3 shrink-0">
                  {[
                    { value: bookings?.length || 4, label: "Trips" },
                    { value: 45, label: "Trees 🌱" },
                    { value: savedDests.length, label: "Saved" },
                  ].map(s => (
                    <div key={s.label} className="text-center bg-surface-container/60 rounded-2xl px-4 py-3">
                      <div className="font-serif text-2xl text-primary font-semibold">{s.value}</div>
                      <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile stats row */}
            {!editing && (
              <div className="md:hidden flex justify-around mt-5 pt-5 border-t border-border/30">
                {[
                  { value: bookings?.length || 4, label: "Trips" },
                  { value: 45, label: "Trees 🌱" },
                  { value: savedDests.length, label: "Saved" },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <div className="font-serif text-xl text-primary font-semibold">{s.value}</div>
                    <div className="text-xs text-muted-foreground font-semibold mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── TABS ── */}
          <div className="flex gap-1 mt-5 bg-white/60 rounded-full p-1 border border-border/30 backdrop-blur-md">
            {(["journeys", "saved", "achievements", "settings"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all relative ${
                  activeTab === tab ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-primary"
                }`}>
                {tab === "settings" && unreadCount > 0 && (
                  <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-red-500" />
                )}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* ── TAB CONTENT ── */}
          <div className="mt-6 space-y-4">

            {/* JOURNEYS */}
            {activeTab === "journeys" && (
              <>
                {bookings && bookings.length > 0 ? bookings.map(b => (
                  <div key={b.id} className="glass rounded-[18px] overflow-hidden border border-border/20 flex flex-row shadow-sm hover:shadow-md transition-shadow">
                    <img src={b.imageUrl} alt={b.stayName} className="w-24 md:w-36 shrink-0 object-cover" />
                    <div className="flex-1 p-4 min-w-0">
                      <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${b.status === "upcoming" ? "text-green-600" : "text-muted-foreground"}`}>
                        {b.status === "upcoming" ? "✦ Upcoming" : "✓ Completed"}
                      </div>
                      <h3 className="font-serif text-base text-primary line-clamp-1">{b.stayName}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />{b.destinationName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        📅 {new Date(b.checkIn).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – {new Date(b.checkOut).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-bold text-primary text-sm">₹{b.totalAmount.toLocaleString()}</span>
                        {b.status === "upcoming"
                          ? <Link href={`/stays/1`}><button className="text-xs text-secondary font-bold hover:text-primary flex items-center gap-0.5">View <ChevronRight className="w-3 h-3" /></button></Link>
                          : <Link href="/stories"><button className="text-xs text-secondary font-bold hover:text-primary flex items-center gap-0.5">Review <Star className="w-3 h-3" /></button></Link>
                        }
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-14 glass rounded-[20px] border border-border/20">
                    <div className="text-5xl mb-4">🏕️</div>
                    <h3 className="font-serif text-xl text-primary mb-2">No trips yet</h3>
                    <p className="text-muted-foreground text-sm mb-5">Your first eco-adventure awaits.</p>
                    <Link href="/stays"><button className="btn-primary text-sm px-7 py-3">Browse Retreats →</button></Link>
                  </div>
                )}
                <Link href="/my-journeys">
                  <button className="w-full py-3 text-center text-secondary font-semibold text-sm border border-border/40 rounded-2xl bg-white/50 hover:bg-white/80 transition-colors">
                    View All Trips <ArrowRight className="w-4 h-4 inline ml-1" />
                  </button>
                </Link>
              </>
            )}

            {/* SAVED */}
            {activeTab === "saved" && (
              <>
                {savedDests.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {savedDests.map(dest => (
                      <div key={dest.id} className="relative group">
                        <Link href={`/destinations/${dest.slug}`}>
                          <div className="relative h-40 md:h-52 rounded-[18px] overflow-hidden cursor-pointer">
                            <SavedDestinationImage
  name={dest.name}
  fallback={dest.imageUrl}
/>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">{dest.state}</p>
                              <h3 className="font-serif text-sm text-white leading-tight">{dest.name}</h3>
                            </div>
                          </div>
                        </Link>
                        <button onClick={() => removeFromWishlist(dest.id)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50">
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </button>
                      </div>
                    ))}
                    <Link href="/destinations">
                      <div className="h-40 md:h-52 rounded-[18px] border-2 border-dashed border-border/50 flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 transition-colors bg-surface-container/30">
                        <span className="text-2xl mb-2">+</span>
                        <p className="text-xs text-muted-foreground font-semibold text-center px-3">Discover more places</p>
                      </div>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-14 glass rounded-[20px] border border-border/20">
                    <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="font-serif text-xl text-primary mb-2">No saved destinations</h3>
                    <p className="text-muted-foreground text-sm mb-5">Bookmark places you want to visit.</p>
                    <Link href="/destinations"><button className="btn-primary text-sm px-7 py-3">Explore Destinations</button></Link>
                  </div>
                )}
              </>
            )}

            {/* ACHIEVEMENTS */}
            {activeTab === "achievements" && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4">You've earned {ACHIEVEMENTS.filter(a => a.earned).length} of {ACHIEVEMENTS.length} achievements.</p>
                {ACHIEVEMENTS.map(a => (
                  <div key={a.id} className={`glass rounded-[18px] p-4 border flex items-center gap-4 ${a.earned ? "border-green-200/60 bg-green-50/30" : "border-border/20 opacity-60"}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0 ${a.earned ? "bg-green-100" : "bg-surface-container"}`}>
                      {a.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-primary text-sm">{a.label}</h3>
                        {a.earned && <Check className="w-3.5 h-3.5 text-green-600" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
                    </div>
                    {a.earned
                      ? <span className="text-xs font-bold text-green-600 bg-green-100 px-2.5 py-1 rounded-full">Earned</span>
                      : <span className="text-xs font-bold text-muted-foreground bg-surface-container px-2.5 py-1 rounded-full">Locked</span>
                    }
                  </div>
                ))}
              </div>
            )}

            {/* SETTINGS */}
            {activeTab === "settings" && (
              <div className="space-y-4">
                {/* Notifications */}
                <div className="glass rounded-[20px] p-5 border border-border/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-lg text-primary flex items-center gap-2">
                      <Bell className="w-4 h-4 text-secondary" /> Notifications
                      {unreadCount > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{unreadCount} new</span>}
                    </h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs text-secondary font-semibold hover:text-primary transition-colors">Mark all read</button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {notifications.map(n => (
                      <div key={n.id} className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${!n.read ? "bg-primary/5 border border-primary/10" : ""}`}>
                        <span className="text-xl shrink-0">{n.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold ${!n.read ? "text-primary" : "text-muted-foreground"}`}>{n.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                          <p className="text-[10px] text-muted-foreground/60 mt-1">{n.time}</p>
                        </div>
                        {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Account info */}
                <div className="glass rounded-[20px] p-5 border border-border/20">
                  <h3 className="font-serif text-lg text-primary mb-4">Account Info</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-semibold text-primary">{profile.email}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="font-semibold text-primary">{profile.phone}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Member since</span><span className="font-semibold text-primary">Jan 2023</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Travel style</span><span className="font-semibold text-primary">{profile.travelStyle}</span></div>
                  </div>
                </div>

                {/* Settings links */}
                {[
                  { icon: Shield,      label: "Privacy & Safety",  href: "#",    sub: "Manage data & visibility" },
                  { icon: HelpCircle,  label: "Help & Support",    href: "/faq", sub: "FAQs and contact us" },
                  { icon: Settings,    label: "App Preferences",   href: "#",    sub: "Language, currency, units" },
                ].map(item => (
                  <Link key={item.label} href={item.href}>
                    <div className="glass rounded-[18px] px-5 py-4 border border-border/20 flex items-center justify-between cursor-pointer hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center">
                          <item.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-primary">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.sub}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}

                <button
                  onClick={() => toast({ title: "Signed out", description: "See you on the trail! 🌿" })}
                  className="w-full glass rounded-[18px] px-5 py-4 border border-red-200/50 flex items-center gap-3 hover:bg-red-50/50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
                    <LogOut className="w-4 h-4 text-red-500" />
                  </div>
                  <span className="text-sm font-semibold text-red-500">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
