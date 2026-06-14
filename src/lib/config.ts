// ============================================================
//  GreenTrail India — API Configuration
//  All keys read from .env file (VITE_ prefix required)
// ============================================================

export const CONFIG = {
  // ── Gemini AI (for itinerary generation) ──────────────────────
  // Get key: https://aistudio.google.com/app/apikey (free)
  // .env: VITE_GEMINI_API_KEY=AIza...
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY as string || "",
  GEMINI_MODEL:   "gemini-2.5-flash",  // fastest, free tier available
  GEMINI_ENDPOINT: "https://generativelanguage.googleapis.com/v1beta/models",

  // ── RapidAPI IRCTC (live train search) ────────────────────────
  // Get key: https://rapidapi.com/search/indian-railway-irctc
  // .env: VITE_RAPIDAPI_KEY=your_key
  RAPIDAPI_KEY:  import.meta.env.VITE_RAPIDAPI_KEY as string || "",

  // ── Booking.com via RapidAPI (real hotels & stays) ────────────
  // Get key: https://rapidapi.com/tipsters/api/booking-com
  // .env: VITE_BOOKING_API_KEY=your_key
  BOOKING_API_KEY:  import.meta.env.VITE_BOOKING_API_KEY as string || "",

  // ── Google Places (real location photos) ──────────────────────
  // Get key: https://console.cloud.google.com → Maps → Places API
  // Enable: Places API, Maps JavaScript API
  // .env: VITE_GOOGLE_PLACES_KEY=AIza...
  GOOGLE_PLACES_KEY: import.meta.env.VITE_GOOGLE_PLACES_KEY as string || "",

  // ── Unsplash (fallback location images) ───────────────────────
  // Get key: https://unsplash.com/developers (free, 50 req/hr)
  // .env: VITE_UNSPLASH_ACCESS_KEY=your_key
  UNSPLASH_KEY: import.meta.env.VITE_UNSPLASH_ACCESS_KEY as string || "",

  // aviationstack (live flight search) ───────────────────────────────
 AVIATIONSTACK_KEY:
  import.meta.env.VITE_AVIATIONSTACK_KEY || "",

isFlightApiEnabled: () =>
  !!import.meta.env.VITE_AVIATIONSTACK_KEY,

  // ── Feature flags ──────────────────────────────────────────────
  isGeminiEnabled:    () => !!import.meta.env.VITE_GEMINI_API_KEY,
  isRailwayEnabled:   () => !!import.meta.env.VITE_RAPIDAPI_KEY,
  isBookingEnabled:   () => !!import.meta.env.VITE_BOOKING_API_KEY,
  isPlacesEnabled:    () => !!import.meta.env.VITE_GOOGLE_PLACES_KEY,
  isUnsplashEnabled:  () => !!import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
  isAviationStackEnabled: () => !!import.meta.env.VITE_AVIATIONSTACK_KEY,
};

export default CONFIG;
