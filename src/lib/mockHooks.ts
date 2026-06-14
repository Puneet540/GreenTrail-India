// Mock hooks that replace @workspace/api-client-react
// All data comes from src/lib/api.ts

import { useState, useEffect } from "react";
import {
  DESTINATIONS, STAYS, STORIES, BOOKINGS, PROFILE,
  TRAINS, FLIGHTS, BUSES, STATES
} from "./api";

type QueryResult<T> = { data: T | undefined; isLoading: boolean; error: null };

function useQuery<T>(fn: () => T, deps: unknown[] = []): QueryResult<T> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => { setData(fn()); setIsLoading(false); }, 300);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return { data, isLoading, error: null };
}

type MutationResult<T> = {
  mutate: (input: T, opts?: { onSuccess?: (data: unknown) => void; onError?: () => void }) => void;
  isPending: boolean;
};

function useMutation<T>(fn: (input: T) => unknown): MutationResult<T> {
  const [isPending, setIsPending] = useState(false);
  const mutate = (input: T, opts?: { onSuccess?: (data: unknown) => void; onError?: () => void }) => {
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      const result = fn(input);
      opts?.onSuccess?.(result);
    }, 800);
  };
  return { mutate, isPending };
}

// ── Destinations ──────────────────────────────────────────────
export const useListDestinations = (params?: { state?: string; type?: string; q?: string }) =>
  useQuery(() => {
    let d = [...DESTINATIONS];
    if (params?.state && params.state !== "All") {
      // Exact match first, then partial (handles both full name "Himachal Pradesh" and slug "himachal-pradesh")
      const exact = d.filter(x => x.state === params.state);
      d = exact.length > 0 ? exact : d.filter(x => x.state.toLowerCase().includes(params.state!.toLowerCase().replace(/-/g," ")));
    }
    if (params?.type) d = d.filter(x => x.type === params.type);
    if (params?.q) d = d.filter(x =>
      x.name.toLowerCase().includes(params.q!.toLowerCase()) ||
      x.state.toLowerCase().includes(params.q!.toLowerCase()) ||
      x.tagline.toLowerCase().includes(params.q!.toLowerCase()) ||
      x.famousFor?.some(f => f.toLowerCase().includes(params.q!.toLowerCase()))
    );
    return d;
  }, [params?.state, params?.type, params?.q]);

export const useGetDestination = (id: number | string) =>
  useQuery(() => DESTINATIONS.find(d => String(d.id) === String(id) || d.slug === String(id)), [id]);

export const useListHiddenGems = () =>
  useQuery(() => DESTINATIONS.filter(d => d.isHiddenGem));

export const useListStates = () =>
  useQuery(() => STATES);

// ── Stays ─────────────────────────────────────────────────────
export const useListStays = (params?: { destinationId?: number; env?: string; minEco?: number; maxPrice?: number }) =>
  useQuery(() => {
    let s = [...STAYS];
    if (params?.destinationId) s = s.filter(x => x.destinationId === params.destinationId);
    if (params?.env) s = s.filter(x => x.environment === params.env);
    if (params?.minEco) s = s.filter(x => x.ecoRating >= params.minEco!);
    if (params?.maxPrice) s = s.filter(x => x.pricePerNight <= params.maxPrice!);
    return s;
  }, [params?.destinationId, params?.env, params?.minEco, params?.maxPrice]);

export const useListFeaturedStays = () =>
  useQuery(() => STAYS.slice(0, 4));

export const useGetStay = (id: number | string) =>
  useQuery(() => STAYS.find(s => String(s.id) === String(id)), [id]);

// ── Stories ───────────────────────────────────────────────────
export const useListStories = (params?: { destination?: string; featured?: boolean }) =>
  useQuery(() => {
    let s = [...STORIES];
    if (params?.destination) s = s.filter(x => x.destination === params.destination);
    if (params?.featured) s = s.filter(x => x.isFeatured);
    return s;
  }, [params?.destination, params?.featured]);

export const useGetStory = (id: number | string) =>
  useQuery(() => STORIES.find(s => String(s.id) === String(id)), [id]);

export const useCreateStory = () =>
  useMutation((input: { data: Partial<typeof STORIES[0]> }) => {
    const newStory = { id: Date.now(), likes: 0, isFeatured: false, createdAt: new Date().toISOString(), ...input.data };
    STORIES.push(newStory as typeof STORIES[0]);
    return newStory;
  });

// ── Bookings ──────────────────────────────────────────────────
export const useListBookings = (params?: { status?: string }) =>
  useQuery(() => params?.status ? BOOKINGS.filter(b => b.status === params.status) : [...BOOKINGS], [params?.status]);

export const useCreateBooking = () =>
  useMutation((input: { data: Partial<typeof BOOKINGS[0]> }) => {
    const booking = { id: Date.now(), ...input.data };
    return booking;
  });

// ── Profile ───────────────────────────────────────────────────
export const useGetProfile = () =>
  useQuery(() => ({ ...PROFILE }));

export const useUpdateProfile = () =>
  useMutation((_: { data: Partial<typeof PROFILE> }) => ({ ...PROFILE }));

// ── Travel ────────────────────────────────────────────────────
export const useSearchTrains = (params?: { from?: string; to?: string }) =>
  useQuery(() => params?.from ? TRAINS : [], [params?.from, params?.to]);

export const useSearchFlights = (params?: { from?: string; to?: string }) =>
  useQuery(() => params?.from ? FLIGHTS : [], [params?.from, params?.to]);

export const useSearchBuses = (params?: { from?: string; to?: string }) =>
  useQuery(() => params?.from ? BUSES : [], [params?.from, params?.to]);

// ── Admin ─────────────────────────────────────────────────────
export const useGetDashboardStats = () =>
  useQuery(() => ({
    totalDestinations: DESTINATIONS.length,
    totalStays: STAYS.length,
    totalBookings: BOOKINGS.length,
    totalStories: STORIES.length,
    totalUsers: 2847,
    revenueThisMonth: 482000,
    recentBookings: BOOKINGS.map(b => ({
      id: b.id,
      destinationName: b.destinationName,
      type: "stay",
      totalAmount: b.totalAmount,
      status: b.status,
    })),
    popularDestinations: DESTINATIONS.slice(0, 4).map(d => ({
      id: d.id,
      name: d.name,
      state: d.state,
      imageUrl: d.imageUrl,
      rating: d.ecoRating,
    })),
  }));

export const useGetSeasonalData = () =>
  useQuery(() => [
    { month: "Jan", bookings: 42, revenue: 189000 },
    { month: "Feb", bookings: 58, revenue: 261000 },
    { month: "Mar", bookings: 94, revenue: 423000 },
    { month: "Apr", bookings: 127, revenue: 571500 },
    { month: "May", bookings: 145, revenue: 652500 },
    { month: "Jun", bookings: 189, revenue: 850500 },
    { month: "Jul", bookings: 203, revenue: 913500 },
    { month: "Aug", bookings: 178, revenue: 801000 },
    { month: "Sep", bookings: 156, revenue: 702000 },
    { month: "Oct", bookings: 210, revenue: 945000 },
    { month: "Nov", bookings: 167, revenue: 751500 },
    { month: "Dec", bookings: 134, revenue: 603000 },
  ]);

// ── Helpers re-exported ───────────────────────────────────────
export const getGetStayQueryKey = (id: number) => ["stay", id];
export const getGetStoryQueryKey = (id: number) => ["story", id];
export const getGetDestinationQueryKey = (id: number) => ["destination", id];
export const getListStaysQueryKey = (p?: object) => ["stays", p];
export const getListStoriesQueryKey = (p?: object) => ["stories", p];

// ── AI Planner ─────────────────────────────────────────────────
type ItineraryInput = {
  data: {
    mood?: string; pace?: string; duration?: number;
    destinations?: string[]; budget?: string; groupType?: string; interests?: string[];
  };
};

type ItineraryDay = { day: number; title: string; location: string; activities: string[]; accommodation?: string };
type Itinerary = {
  id?: number; title: string; summary: string; duration: number;
  estimatedBudget: string; destinations?: string[]; days?: ItineraryDay[];
};

const SAMPLE_DAYS: ItineraryDay[] = [
  { day: 1, title: "Arrival & Acclimatise", location: "Base Village", activities: ["Settle into your eco-retreat", "Evening walk along the nearest trail", "Dinner of local cuisine by firelight"], accommodation: "Eco-boutique homestay" },
  { day: 2, title: "Deep Forest Walk", location: "Valley Floor", activities: ["Sunrise bird-watching session (5:30am)", "3-hour guided trek through dense forest", "Afternoon journaling at the river bank", "Sunset meditation at a high viewpoint"], accommodation: "Same homestay" },
  { day: 3, title: "Village & Culture", location: "Local Village", activities: ["Visit a traditional village, meet local artisans", "Cooking class with a local family", "Afternoon at a monastery or heritage temple", "Village bonfire in the evening"], accommodation: "Village guesthouse" },
  { day: 4, title: "Wild Day", location: "High Altitude Trail", activities: ["Full-day trek to a hidden summit viewpoint", "Packed picnic among wildflowers", "Photography session at golden hour", "Campfire under open sky"] },
  { day: 5, title: "Gentle Farewell", location: "Base Village", activities: ["Morning yoga overlooking the valley", "Visit a local handicraft market", "Slow departure — carry the silence with you"] },
];

export const useGenerateItinerary = () => {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [data, setData] = useState<Itinerary | null>(null);

  const mutate = (input: ItineraryInput, opts?: { onSuccess?: (d: Itinerary) => void }) => {
    setIsPending(true); setIsSuccess(false);
    setTimeout(() => {
      const dest = input.data.destinations?.[0] || "the Himalayas";
      const dur = input.data.duration || 5;
      const budgetMap: Record<string, string> = { budget: "₹3,000–6,000/day", comfort: "₹6,000–15,000/day", luxury: "₹15,000+/day" };
      const result: Itinerary = {
        id: Date.now(),
        title: `${dur} Days of ${input.data.mood || "Quiet Reflection"} in ${dest}`,
        summary: `A hand-crafted journey through the ${dest} region, designed for a ${input.data.groupType?.toLowerCase() || "solo"} traveler seeking ${input.data.mood?.toLowerCase() || "serenity"}.`,
        duration: dur,
        estimatedBudget: budgetMap[input.data.budget || "comfort"],
        destinations: input.data.destinations,
        days: SAMPLE_DAYS.slice(0, Math.min(dur, 5)),
      };
      setData(result); setIsPending(false); setIsSuccess(true);
      opts?.onSuccess?.(result);
    }, 1800);
  };

  return { mutate, isPending, isSuccess, data };
};

export const useListItineraries = (_opts?: unknown) =>
  useQuery<Itinerary[]>(() => []);

export const getListItinerariesQueryKey = () => ["itineraries"];

// ── Booking Summary ────────────────────────────────────────────
export const useGetBookingsSummary = () =>
  useQuery(() => ({
    totalBookings: BOOKINGS.length,
    totalSpent: BOOKINGS.reduce((sum, b) => sum + b.totalAmount, 0),
    upcomingCount: BOOKINGS.filter(b => b.status === "upcoming").length,
    completedCount: BOOKINGS.filter(b => b.status === "completed").length,
  }));
