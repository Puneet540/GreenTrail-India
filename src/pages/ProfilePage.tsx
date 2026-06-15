// ============================================================
//  GreenTrail India — Profile Page (Backend-powered)
// ============================================================

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2, Edit2, Save, X, MapPin, Mail, Phone, Leaf, Star, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { updateMyProfile, getMyItineraries, getMyBookings, getMyReviews, type SavedItinerary, type Booking, type Review } from "@/lib/backendApi";
import { signOutUser } from "@/lib/firebase";

export default function ProfilePage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { backendUser, loading, refreshBackendUser } = useAuth();

  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [editData, setEditData] = useState({ name: "", bio: "", location: "", phone: "" });

  const [itineraries, setItineraries] = useState<SavedItinerary[]>([]);
  const [bookings, setBookings]       = useState<Booking[]>([]);
  const [reviews, setReviews]         = useState<Review[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !backendUser) navigate("/login");
  }, [loading, backendUser, navigate]);

  // Pre-fill edit form
  useEffect(() => {
    if (backendUser) {
      setEditData({
        name:     backendUser.name,
        bio:      backendUser.bio || "",
        location: backendUser.location || "",
        phone:    backendUser.phone || "",
      });
    }
  }, [backendUser]);

  // Load user data
  useEffect(() => {
    if (!backendUser) return;
    Promise.all([getMyItineraries({ limit: 5 }), getMyBookings({ limit: 5 }), getMyReviews()])
      .then(([itin, book, rev]) => {
        setItineraries(itin.data || []);
        setBookings(book.data || []);
        setReviews(rev.data || []);
      })
      .catch(console.error)
      .finally(() => setDataLoading(false));
  }, [backendUser]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateMyProfile(editData);
      await refreshBackendUser();
      setEditing(false);
      toast({ title: "Profile updated!" });
    } catch {
      toast({ title: "Update failed", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      navigate("/");
      toast({ title: "Signed out successfully" });
    } catch {
      toast({ title: "Logout failed", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!backendUser) return null;

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 pt-20 pb-8 px-4">
        <div className="max-w-3xl mx-auto flex items-start gap-6">
          <img
            src={backendUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(backendUser.name)}&background=2D6A4F&color=fff`}
            alt={backendUser.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="space-y-3">
                <input
                  value={editData.name}
                  onChange={e => setEditData(p => ({ ...p, name: e.target.value }))}
                  className="text-2xl font-serif bg-white/80 border border-border rounded-lg px-3 py-1 w-full"
                  placeholder="Your name"
                />
                <input
                  value={editData.location}
                  onChange={e => setEditData(p => ({ ...p, location: e.target.value }))}
                  className="text-sm bg-white/80 border border-border rounded-lg px-3 py-1 w-full"
                  placeholder="Your location"
                />
                <input
                  value={editData.phone}
                  onChange={e => setEditData(p => ({ ...p, phone: e.target.value }))}
                  className="text-sm bg-white/80 border border-border rounded-lg px-3 py-1 w-full"
                  placeholder="Phone number"
                />
                <textarea
                  value={editData.bio}
                  onChange={e => setEditData(p => ({ ...p, bio: e.target.value }))}
                  className="text-sm bg-white/80 border border-border rounded-lg px-3 py-2 w-full resize-none"
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1.5 bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-medium disabled:opacity-60"
                  >
                    {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="flex items-center gap-1.5 border border-border px-4 py-1.5 rounded-lg text-sm"
                  >
                    <X className="w-3 h-3" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-serif text-foreground">{backendUser.name}</h1>
                {backendUser.location && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {backendUser.location}
                  </p>
                )}
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Mail className="w-3 h-3" /> {backendUser.email}
                </p>
                {backendUser.phone && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3" /> {backendUser.phone}
                  </p>
                )}
                {backendUser.bio && (
                  <p className="text-sm text-foreground/80 mt-2 max-w-lg">{backendUser.bio}</p>
                )}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-1.5 border border-border bg-white/80 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-white transition-colors"
                  >
                    <Edit2 className="w-3 h-3" /> Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 border border-red-200 text-red-600 bg-white/80 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-3 h-3" /> Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-3xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Trips",       value: backendUser.stats.totalTrips,        icon: "🌿" },
            { label: "Itineraries", value: backendUser.stats.totalItineraries,  icon: "📋" },
            { label: "Reviews",     value: backendUser.stats.totalReviews,      icon: "⭐" },
          ].map(s => (
            <div key={s.label} className="glass rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold text-primary">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {dataLoading ? (
        <div className="flex justify-center mt-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="max-w-3xl mx-auto px-4 mt-8 space-y-8">

          {/* Recent Itineraries */}
          <section>
            <h2 className="text-lg font-serif text-foreground mb-3 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-primary" /> My Itineraries
            </h2>
            {itineraries.length === 0 ? (
              <div className="glass rounded-2xl p-6 text-center text-muted-foreground text-sm">
                No itineraries yet. <a href="/planner" className="text-primary underline">Create one with AI →</a>
              </div>
            ) : (
              <div className="space-y-3">
                {itineraries.map(itin => (
                  <div key={itin._id} className="glass rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{itin.title}</p>
                      <p className="text-xs text-muted-foreground">{itin.destination} · {itin.duration} days</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      itin.status === "planned" ? "bg-green-100 text-green-700" :
                      itin.status === "completed" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {itin.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recent Bookings */}
          <section>
            <h2 className="text-lg font-serif text-foreground mb-3 flex items-center gap-2">
              🏨 My Bookings
            </h2>
            {bookings.length === 0 ? (
              <div className="glass rounded-2xl p-6 text-center text-muted-foreground text-sm">
                No bookings yet. <a href="/stays" className="text-primary underline">Explore stays →</a>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map(b => (
                  <div key={b._id} className="glass rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm capitalize">{b.bookingType} booking</p>
                      <p className="text-xs text-muted-foreground">Ref: {b.bookingReference}</p>
                      <p className="text-xs font-medium text-primary">₹{b.pricing.totalAmount.toLocaleString()}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      b.status === "confirmed" ? "bg-green-100 text-green-700" :
                      b.status === "pending"   ? "bg-yellow-100 text-yellow-700" :
                      b.status === "cancelled" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Reviews */}
          <section>
            <h2 className="text-lg font-serif text-foreground mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" /> My Reviews
            </h2>
            {reviews.length === 0 ? (
              <div className="glass rounded-2xl p-6 text-center text-muted-foreground text-sm">
                You haven't written any reviews yet.
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map(r => (
                  <div key={r._id} className="glass rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm">{r.title}</p>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < r.ratings.overall ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{r.content}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      )}
    </div>
  );
}
