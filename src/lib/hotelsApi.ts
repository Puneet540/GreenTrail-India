// ============================================================
//  Hotels & Stays API — Booking.com via RapidAPI
//  Docs: https://rapidapi.com/tipsters/api/booking-com
//  .env: VITE_BOOKING_API_KEY=your_rapidapi_key
//  Also supports: MakeMyTrip, Goibibo fallback data
// ============================================================

import CONFIG from "./config";

export type HotelResult = {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  starRating: number;
  reviewScore: number;
  reviewCount: number;
  pricePerNight: number;
  currency: string;
  imageUrl: string;
  images: string[];
  facilities: string[];
  isBreakfastIncluded: boolean;
  isFreeCancel: boolean;
  description: string;
  deepLink: string;
};

const BOOKING_HEADERS = {
  "x-rapidapi-key":  CONFIG.BOOKING_API_KEY,
  "x-rapidapi-host": CONFIG.BOOKING_API_HOST,
};

// ── Destination ID lookup (Booking.com uses numeric IDs) ──────
export async function searchDestinationId(cityName: string): Promise<string | null> {
  if (!CONFIG.isBookingEnabled()) return null;
  try {
    const url = `https://${CONFIG.BOOKING_API_HOST}/v1/hotels/locations?name=${encodeURIComponent(cityName)}&locale=en-gb`;
    const res = await fetch(url, { headers: BOOKING_HEADERS });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.[0]?.dest_id || null;
  } catch { return null; }
}

// ── Search hotels in a destination ───────────────────────────
export async function searchHotels(params: {
  destId: string;
  checkin: string;   // "YYYY-MM-DD"
  checkout: string;  // "YYYY-MM-DD"
  adults: number;
  rooms?: number;
  currency?: string;
  minScore?: number; // 7-10
}): Promise<HotelResult[]> {
  if (!CONFIG.isBookingEnabled()) throw new Error("BOOKING_NOT_CONFIGURED");

  const { destId, checkin, checkout, adults, rooms = 1, currency = "INR", minScore } = params;

  const url = new URL(`https://${CONFIG.BOOKING_API_HOST}/v1/hotels/search`);
  url.searchParams.set("dest_id",        destId);
  url.searchParams.set("dest_type",      "city");
  url.searchParams.set("checkin_date",   checkin);
  url.searchParams.set("checkout_date",  checkout);
  url.searchParams.set("adults_number",  String(adults));
  url.searchParams.set("room_number",    String(rooms));
  url.searchParams.set("currency",       currency);
  url.searchParams.set("locale",         "en-gb");
  url.searchParams.set("units",          "metric");
  url.searchParams.set("order_by",       "popularity");
  url.searchParams.set("filter_by_currency", currency);
  if (minScore) url.searchParams.set("review_score", String(minScore));

  const res = await fetch(url.toString(), { headers: BOOKING_HEADERS });
  if (!res.ok) throw new Error(`Booking API ${res.status}: ${await res.text()}`);

  const json = await res.json();
  const hotels = json?.result || [];

  return hotels.slice(0, 20).map((h: BookingHotel) => normaliseHotel(h));
}

// ── Get hotel details ─────────────────────────────────────────
export async function getHotelDetails(hotelId: string): Promise<HotelResult | null> {
  if (!CONFIG.isBookingEnabled()) return null;
  try {
    const url = `https://${CONFIG.BOOKING_API_HOST}/v1/hotels/data?hotel_id=${hotelId}&locale=en-gb`;
    const res = await fetch(url, { headers: BOOKING_HEADERS });
    if (!res.ok) return null;
    const json = await res.json();
    return normaliseHotel(json);
  } catch { return null; }
}

// ── Normalise Booking.com response ───────────────────────────
type BookingHotel = {
  hotel_id?: string | number;
  hotel_name?: string; name?: string;
  address?: string; address_trans?: string;
  city?: string; city_trans?: string; city_name_en?: string;
  latitude?: number; longitude?: number;
  class?: number; stars?: number;
  review_score?: number; reviewScore?: number;
  review_nr?: number; reviewCount?: number;
  price_breakdown?: { gross_price?: number; all_inclusive_price?: number };
  min_total_price?: number;
  currency_code?: string;
  main_photo_url?: string; main_photo?: string; imageUrl?: string;
  hotel_photos?: { photo_id?: string; url_original?: string }[];
  hotel_facilities_filtered?: { name?: string }[];
  is_free_cancellable?: boolean;
  breakfast_included?: number;
  hotel_description?: string; description?: string;
  url?: string;
};

function normaliseHotel(h: BookingHotel): HotelResult {
  const price = h.price_breakdown?.gross_price
    || h.price_breakdown?.all_inclusive_price
    || h.min_total_price
    || 3500;

  const mainImg = h.main_photo_url || h.main_photo || h.imageUrl || "";
  const photos  = (h.hotel_photos || [])
    .map((p) => p.url_original || "")
    .filter(Boolean)
    .slice(0, 6);

  return {
    id:          String(h.hotel_id || Math.random()),
    name:        h.hotel_name || h.name || "Eco Retreat",
    address:     h.address || h.address_trans || "",
    city:        h.city || h.city_trans || h.city_name_en || "",
    country:     "India",
    latitude:    h.latitude || 0,
    longitude:   h.longitude || 0,
    starRating:  h.class || h.stars || 3,
    reviewScore: h.review_score || h.reviewScore || 7,
    reviewCount: h.review_nr || h.reviewCount || 0,
    pricePerNight: Math.round(Number(price)),
    currency:    h.currency_code || "INR",
    imageUrl:    mainImg.replace(/square\d+/, "max1280x900"),
    images:      photos.length ? photos : [mainImg],
    facilities:  (h.hotel_facilities_filtered || []).map((f) => f.name || "").filter(Boolean),
    isFreeCancel: !!h.is_free_cancellable,
    isBreakfastIncluded: h.breakfast_included === 1,
    description: h.hotel_description || h.description || "",
    deepLink:
  h.url ||
  `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(
    h.city
  )}`,
  };
}

// ── Feature flag ──────────────────────────────────────────────
export function isHotelsApiConfigured(): boolean {
  return !!CONFIG.BOOKING_API_KEY && CONFIG.BOOKING_API_KEY.length > 10;
}
