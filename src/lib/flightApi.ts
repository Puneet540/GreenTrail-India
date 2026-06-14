// ============================================================
// AviationStack API
// Free Plan Compatible
// ============================================================

import CONFIG from "./config";

export type LiveFlight = {
  id: string;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  status: string;
  aircraft: string;
  duration: string;
  price: number;
  availableSeats: number;
  stops: number;
};

export async function searchFlights(params?: {
  from?: string;
  to?: string;
  date?: string;
  departureIata?: string;
  arrivalIata?: string;
}) {
  if (!CONFIG.AVIATIONSTACK_KEY) {
    throw new Error("AVIATIONSTACK_NOT_CONFIGURED");
  }

  const url = new URL("https://api.aviationstack.com/v1/flights");

  url.searchParams.set(
    "access_key",
    CONFIG.AVIATIONSTACK_KEY
  );

  // Optional filters
  if (params?.departureIata) {
    url.searchParams.set(
      "dep_iata",
      params.departureIata
    );
  }

  if (params?.arrivalIata) {
    url.searchParams.set(
      "arr_iata",
      params.arrivalIata
    );
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(
      `AviationStack Error ${response.status}`
    );
  }

  const json = await response.json();

  return (json.data || []).map(
    (flight: any): LiveFlight => ({
      id:
        flight.flight?.iata ||
        Math.random().toString(),

      airline:
        flight.airline?.name ||
        "Unknown Airline",

      flightNumber:
        flight.flight?.iata ||
        flight.flight?.number ||
        "N/A",

      from:
        flight.departure?.airport ||
        flight.departure?.iata ||
        "Unknown",

      to:
        flight.arrival?.airport ||
        flight.arrival?.iata ||
        "Unknown",

      departure:
        flight.departure?.scheduled
          ? new Date(
              flight.departure.scheduled
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "--:--",

      arrival:
        flight.arrival?.scheduled
          ? new Date(
              flight.arrival.scheduled
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "--:--",

      status:
        flight.flight_status ||
        "scheduled",

      aircraft:
        flight.aircraft?.registration ||
        "Aircraft",

      duration: "2h 30m",
      price: 5500,
      availableSeats: 12,
      stops: 0,
    })
  );
}

export function isFlightApiConfigured() {
  return !!CONFIG.AVIATIONSTACK_KEY;
}