// ============================================================
//  GreenTrail India — Backend API Client
//  All API calls go through here, using Firebase ID tokens
//  Backend URL: http://localhost:5000 (dev) or VITE_BACKEND_URL (prod)
// ============================================================

import { getAuth } from "firebase/auth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// ── Get Firebase token from current user ─────────────────────
async function getToken(): Promise<string | null> {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
}

// ── Base fetch wrapper ────────────────────────────────────────
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  requireAuth = true
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (requireAuth) {
    const token = await getToken();
    if (!token) throw new Error("Not authenticated");
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `API error ${res.status}`);
  }

  return data;
}

// ═══════════════════════════════════════════════════════════════
//  AUTH
// ═══════════════════════════════════════════════════════════════

// Sync user to MongoDB after Firebase login/register
export async function syncUser(extraData?: { name?: string; photoURL?: string }) {
  const token = await getToken();
  if (!token) throw new Error("No token");

  const res = await fetch(`${BACKEND_URL}/api/auth/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(extraData || {}),
  });

  return res.json();
}

export async function logoutFromBackend() {
  return apiFetch("/api/auth/logout", { method: "POST" });
}

// ═══════════════════════════════════════════════════════════════
//  USER PROFILE
// ═══════════════════════════════════════════════════════════════

export async function getMyProfile() {
  return apiFetch<{ success: boolean; data: UserProfile }>("/api/users/me");
}

export async function updateMyProfile(updates: Partial<UserProfile>) {
  return apiFetch<{ success: boolean; data: UserProfile }>("/api/users/me", {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export async function updateMyPreferences(prefs: {
  travelStyle?: string[];
  preferredTransport?: string[];
  dietaryPreferences?: string[];
}) {
  return apiFetch("/api/users/me/preferences", {
    method: "PUT",
    body: JSON.stringify(prefs),
  });
}

export async function getSavedDestinations() {
  return apiFetch<{ success: boolean; data: SavedDestination[] }>(
    "/api/users/me/saved-destinations"
  );
}

export async function saveDestination(destinationId: string, destinationName: string) {
  return apiFetch("/api/users/me/saved-destinations", {
    method: "POST",
    body: JSON.stringify({ destinationId, destinationName }),
  });
}

export async function removeSavedDestination(destinationId: string) {
  return apiFetch(`/api/users/me/saved-destinations/${destinationId}`, {
    method: "DELETE",
  });
}

// ═══════════════════════════════════════════════════════════════
//  ITINERARIES
// ═══════════════════════════════════════════════════════════════

export async function getMyItineraries(params?: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  return apiFetch<ItineraryListResponse>(`/api/itineraries${query ? `?${query}` : ""}`);
}

export async function saveItinerary(itineraryData: SaveItineraryPayload) {
  return apiFetch<{ success: boolean; data: SavedItinerary }>("/api/itineraries", {
    method: "POST",
    body: JSON.stringify(itineraryData),
  });
}

export async function getItinerary(id: string) {
  return apiFetch<{ success: boolean; data: SavedItinerary }>(`/api/itineraries/${id}`);
}

export async function updateItinerary(id: string, updates: Partial<SavedItinerary>) {
  return apiFetch<{ success: boolean; data: SavedItinerary }>(`/api/itineraries/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export async function deleteItinerary(id: string) {
  return apiFetch(`/api/itineraries/${id}`, { method: "DELETE" });
}

export async function getPublicItineraries(params?: { destination?: string; page?: number }) {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  return apiFetch<ItineraryListResponse>(
    `/api/itineraries/public/explore${query ? `?${query}` : ""}`,
    {},
    false
  );
}

// ═══════════════════════════════════════════════════════════════
//  BOOKINGS
// ═══════════════════════════════════════════════════════════════

export async function getMyBookings(params?: { bookingType?: string; status?: string }) {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  return apiFetch<BookingListResponse>(`/api/bookings${query ? `?${query}` : ""}`);
}

export async function createBooking(payload: CreateBookingPayload) {
  return apiFetch<CreateBookingResponse>("/api/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function verifyPayment(payload: VerifyPaymentPayload) {
  return apiFetch("/api/bookings/verify-payment", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getBooking(id: string) {
  return apiFetch<{ success: boolean; data: Booking }>(`/api/bookings/${id}`);
}

export async function cancelBooking(id: string, reason?: string) {
  return apiFetch(`/api/bookings/${id}/cancel`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

// ═══════════════════════════════════════════════════════════════
//  REVIEWS
// ═══════════════════════════════════════════════════════════════

export async function getReviews(params: {
  destinationId?: string;
  hotelId?: string;
  reviewType?: string;
  page?: number;
}) {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  return apiFetch<ReviewListResponse>(`/api/reviews?${query}`, {}, false);
}

export async function submitReview(payload: SubmitReviewPayload) {
  return apiFetch("/api/reviews", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMyReviews() {
  return apiFetch<{ success: boolean; data: Review[] }>("/api/reviews/my-reviews");
}

export async function deleteReview(id: string) {
  return apiFetch(`/api/reviews/${id}`, { method: "DELETE" });
}

export async function voteReview(id: string) {
  return apiFetch(`/api/reviews/${id}/vote`, { method: "POST" });
}

// ═══════════════════════════════════════════════════════════════
//  PROXY — External API calls (keys hidden on backend)
// ═══════════════════════════════════════════════════════════════

// Gemini AI via backend proxy (secure)
export async function generateItineraryViaProxy(prompt: string) {
  return apiFetch<{ success: boolean; data: GeminiResponse }>("/api/proxy/gemini", {
    method: "POST",
    body: JSON.stringify({ prompt, model: "gemini-2.5-flash" }),
  });
}

// Hotel search via backend proxy
export async function searchHotelsViaProxy(params: {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults?: number;
  children?: number;
  rooms?: number;
}) {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  return apiFetch<{ success: boolean; data: unknown }>(`/api/proxy/hotels?${query}`);
}

// Hotel location lookup via backend proxy
export async function searchHotelLocationViaProxy(query: string) {
  return apiFetch<{ success: boolean; data: unknown }>(
    `/api/proxy/hotels/location?query=${encodeURIComponent(query)}`
  );
}

// Train search via backend proxy
export async function searchTrainsViaProxy(params: {
  fromStation: string;
  toStation: string;
  date: string;
}) {
  const query = new URLSearchParams(params).toString();
  return apiFetch<{ success: boolean; data: unknown }>(`/api/proxy/trains?${query}`);
}

// Station search via backend proxy
export async function searchStationsViaProxy(query: string) {
  return apiFetch<{ success: boolean; data: unknown }>(
    `/api/proxy/trains/station?query=${encodeURIComponent(query)}`
  );
}

// Google Places via backend proxy
export async function searchPlacesViaProxy(query: string, location?: string) {
  const params = new URLSearchParams({ query, ...(location ? { location } : {}) }).toString();
  return apiFetch<{ success: boolean; data: unknown }>(`/api/proxy/places?${params}`);
}

// ═══════════════════════════════════════════════════════════════
//  TYPES
// ═══════════════════════════════════════════════════════════════

export type UserProfile = {
  _id: string;
  firebaseUid: string;
  name: string;
  email: string;
  photoURL: string;
  phone: string;
  bio: string;
  location: string;
  preferences: {
    travelStyle: string[];
    preferredTransport: string[];
    dietaryPreferences: string[];
  };
  savedDestinations: SavedDestination[];
  stats: { totalTrips: number; totalItineraries: number; totalReviews: number };
  createdAt: string;
};

export type SavedDestination = {
  destinationId: string;
  destinationName: string;
  savedAt: string;
};

export type SavedItinerary = {
  _id: string;
  title: string;
  destination: string;
  duration: number;
  status: string;
  ecoScore: number;
  isFavorite: boolean;
  isPublic: boolean;
  createdAt: string;
  dayPlans: unknown[];
};

export type SaveItineraryPayload = {
  title: string;
  destination: string;
  duration: number;
  dayPlans: unknown[];
  budget?: { total?: number; currency?: string };
  travelStyle?: string[];
  highlights?: string[];
  ecoScore?: number;
  sustainabilityTips?: string[];
  packingList?: string[];
  summary?: string;
};

export type ItineraryListResponse = {
  success: boolean;
  data: SavedItinerary[];
  pagination: { total: number; page: number; pages: number };
};

export type Booking = {
  _id: string;
  bookingType: "hotel" | "train" | "flight";
  status: string;
  bookingReference: string;
  pricing: { totalAmount: number; currency: string };
  payment: { status: string; razorpayOrderId?: string };
  hotel?: unknown;
  train?: unknown;
  createdAt: string;
};

export type CreateBookingPayload = {
  bookingType: "hotel" | "train";
  hotel?: unknown;
  train?: unknown;
  pricing: { basePrice: number; taxes: number; totalAmount: number };
  itineraryId?: string;
};

export type CreateBookingResponse = {
  success: boolean;
  data: { booking: Booking; razorpayOrderId: string; razorpayKeyId: string; amount: number };
};

export type VerifyPaymentPayload = {
  bookingId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
};

export type BookingListResponse = {
  success: boolean;
  data: Booking[];
  pagination: { total: number; page: number; pages: number };
};

export type Review = {
  _id: string;
  title: string;
  content: string;
  ratings: { overall: number; ecoFriendliness?: number; valueForMoney?: number };
  userId: { name: string; photoURL: string };
  createdAt: string;
  helpfulVotes: number;
};

export type SubmitReviewPayload = {
  reviewType: "destination" | "hotel" | "train";
  destinationId?: string;
  destinationName?: string;
  hotelId?: string;
  hotelName?: string;
  title: string;
  content: string;
  ratings: { overall: number; ecoFriendliness?: number; valueForMoney?: number; cleanliness?: number };
  travelType?: string;
  travelMonth?: number;
  travelYear?: number;
};

export type ReviewListResponse = {
  success: boolean;
  data: Review[];
  averageRatings: {
    avgOverall: number;
    avgEco: number;
    avgValue: number;
    count: number;
  } | null;
  pagination: { total: number; page: number; pages: number };
};

export type GeminiResponse = {
  candidates: { content: { parts: { text: string }[] } }[];
};
