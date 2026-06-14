import { useGetDashboardStats, useGetSeasonalData } from "@/lib/mockHooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Calendar, TrendingUp, DollarSign, BookOpen } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function AdminPage() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: seasonalData, isLoading: seasonalLoading } = useGetSeasonalData();

  return (
    <div className="min-h-screen pt-24 pb-16 flex flex-col md:flex-row max-w-[1400px] mx-auto px-4 md:px-8 gap-8">
      {/* Sidebar */}
      <div className="w-full md:w-1/5 md:sticky md:top-32 h-fit">
        <div className="glass rounded-[32px] p-6 mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-serif text-primary">A</span>
          </div>
          <h2 className="text-xl font-serif text-primary">Admin Panel</h2>
          <p className="text-muted-foreground text-sm">System Overview</p>
        </div>
        
        <nav className="space-y-2">
          <button className="w-full text-left px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium">
            Dashboard
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-primary/5 text-muted-foreground transition-colors">
            Bookings
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-primary/5 text-muted-foreground transition-colors">
            Destinations
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-primary/5 text-muted-foreground transition-colors">
            Stories
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="w-full md:w-4/5">
        <div className="mb-8">
          <h1 className="text-4xl font-serif text-primary">The Pulse of the Wild</h1>
          <p className="text-muted-foreground">Platform analytics and recent activity</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {statsLoading ? (
            Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-3xl" />)
          ) : stats ? (
            <>
              <StatCard title="Total Destinations" value={stats.totalDestinations} icon={<MapPin className="text-primary" />} id="destinations" />
              <StatCard title="Total Stays" value={stats.totalStays} icon={<MapPin className="text-primary" />} id="stays" />
              <StatCard title="Total Bookings" value={stats.totalBookings} icon={<Calendar className="text-primary" />} id="bookings" />
              <StatCard title="Total Stories" value={stats.totalStories} icon={<BookOpen className="text-primary" />} id="stories" />
              <StatCard title="Total Users" value={stats.totalUsers} icon={<Users className="text-primary" />} id="users" />
              <StatCard title="Revenue This Month" value={`₹${(stats.revenueThisMonth ?? 0).toLocaleString()}`} icon={<DollarSign className="text-primary" />} id="revenue" />
            </>
          ) : null}
        </div>

        {/* Charts */}
        <div className="glass rounded-[32px] p-8 mb-12">
          <h2 className="text-2xl font-serif text-primary mb-8">Seasonal Bookings Trend</h2>
          <div className="h-[400px] w-full">
            {seasonalLoading ? (
              <Skeleton className="w-full h-full rounded-2xl" />
            ) : seasonalData ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={seasonalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'currentColor', opacity: 0.5 }} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: 'currentColor', opacity: 0.5 }} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: 'currentColor', opacity: 0.5 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  />
                  <Legend iconType="circle" />
                  <Line yAxisId="left" type="monotone" dataKey="bookings" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Bookings" />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Revenue (₹)" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">No data available</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <div className="glass rounded-[32px] p-8">
            <h2 className="text-2xl font-serif text-primary mb-6">Recent Bookings</h2>
            {statsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
              </div>
            ) : stats?.recentBookings ? (
              <div className="space-y-4">
                {stats.recentBookings.map((b) => (
                  <div key={b.id} className="flex justify-between items-center p-4 rounded-2xl bg-white/40 hover:bg-white/60 transition-colors">
                    <div>
                      <div className="font-medium text-sm">#{b.id}</div>
                      <div className="text-xs text-muted-foreground">{b.destinationName} • {b.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm">₹{b.totalAmount.toLocaleString()}</div>
                      <Badge variant="outline" className="text-[10px] mt-1 bg-white">{b.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* Popular Destinations */}
          <div className="glass rounded-[32px] p-8">
            <h2 className="text-2xl font-serif text-primary mb-6">Popular Destinations</h2>
            {statsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
              </div>
            ) : stats?.popularDestinations ? (
              <div className="space-y-4">
                {stats.popularDestinations.map((d) => (
                  <div key={d.id} className="flex items-center gap-4 p-3 rounded-2xl bg-white/40 hover:bg-white/60 transition-colors">
                    <img src={d.imageUrl} alt={d.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1">
                      <div className="font-medium">{d.name}</div>
                      <div className="text-xs text-muted-foreground">{d.state}</div>
                    </div>
                    <div className="flex items-center gap-1 font-medium">
                      <TrendingUp className="w-4 h-4 text-primary" /> {d.rating}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, id }: { title: string, value: string | number, icon: React.ReactNode, id: string }) {
  return (
    <div data-testid={`admin-stats-${id}`} className="glass rounded-[24px] p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white/60 rounded-full">{icon}</div>
        <Badge variant="outline" className="bg-white/40 border-none">+12%</Badge>
      </div>
      <div className="text-4xl font-serif text-primary mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{title}</div>
    </div>
  );
}
