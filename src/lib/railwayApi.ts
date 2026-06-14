// ============================================================
//  Indian Railway IRCTC API — via RapidAPI
//  RapidAPI Hub: https://rapidapi.com/manishguptareal2017-dVG3LrLDAOf/api/indian-railway-irctc
//  Add to .env: VITE_RAPIDAPI_KEY=your_key_here
// ============================================================

const RAPIDAPI_KEY  = import.meta.env.VITE_RAPIDAPI_KEY as string;
const RAPIDAPI_HOST = "irctc-insight.p.rapidapi.com";
const BASE_URL      = `https://${RAPIDAPI_HOST}`;

const headers = {
  "x-rapidapi-key":  RAPIDAPI_KEY,
  "x-rapidapi-host": RAPIDAPI_HOST,
  "Content-Type":    "application/json",
};

// ── Types ──────────────────────────────────────────────────────
export type TrainClass = {
  name: string;       // "SL", "3A", "2A", "1A", "CC", "EC"
  price: number;
  available: boolean;
  availableSeats?: number;
};

export type LiveTrain = {
  id: string;
  trainName: string;
  trainNumber: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  availableSeats: number;
  runningDays: string;
  classes: TrainClass[];
  distance?: string;
  via?: string;
};

export type TrainStation = {
  stationCode: string;
  stationName: string;
  state: string;
};

export type PNRStatus = {
  pnr: string;
  trainNumber: string;
  trainName: string;
  journeyDate: string;
  from: string;
  to: string;
  status: string;
  passengers: { seat: string; status: string }[];
};

// ── Check if API key is configured ────────────────────────────
export function isRailwayApiConfigured(): boolean {
  return !!RAPIDAPI_KEY && RAPIDAPI_KEY !== "your_key_here" && RAPIDAPI_KEY.length > 10;
}

// ── Search trains between two stations ─────────────────────────
// Endpoint: GET /api/v3/trainBetweenStations
export async function searchTrains(params: {
  fromStationCode: string;  // e.g. "NDLS" (Delhi), "BCT" (Mumbai)
  toStationCode: string;    // e.g. "CDG" (Chandigarh), "DED" (Dehradun)
  dateOfJourney: string;    // "DD-MM-YYYY"
}): Promise<LiveTrain[]> {
  if (!isRailwayApiConfigured()) {
    throw new Error("VITE_RAPIDAPI_KEY not configured");
  }

  const url = new URL(`${BASE_URL}/api/v3/trainBetweenStations`);
  url.searchParams.set("fromStationCode", params.fromStationCode);
  url.searchParams.set("toStationCode",   params.toStationCode);
  url.searchParams.set("dateOfJourney",   params.dateOfJourney);

  const res = await fetch(url.toString(), { method: "GET", headers });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Railway API error ${res.status}: ${err}`);
  }

  const json = await res.json();

  // Normalise the RapidAPI response shape into our LiveTrain type
  const trains = json?.data || json?.trains || [];
  return trains.map((t: RapidApiTrain) => normaliseTrain(t));
}

// ── Search stations by name (for autocomplete) ─────────────────
// Endpoint: GET /api/v1/searchStation
export async function searchStations(query: string): Promise<TrainStation[]> {
  if (!isRailwayApiConfigured() || query.length < 2) return [];

  const url = new URL(`${BASE_URL}/api/v1/searchStation`);
  url.searchParams.set("query", query);

  const res = await fetch(url.toString(), { method: "GET", headers });
  if (!res.ok) return [];

  const json = await res.json();
  const stations = json?.data || [];
  return stations.map((s: RapidApiStation) => ({
    stationCode: s.stationCode || s.station_code || s.code || "",
    stationName: s.stationName || s.station_name || s.name || "",
    state:       s.state || "",
  }));
}

// ── Get train schedule / route ──────────────────────────────────
// Endpoint: GET /api/v1/getTrainRoute
export async function getTrainRoute(trainNumber: string): Promise<unknown> {
  if (!isRailwayApiConfigured()) throw new Error("API key not configured");

  const url = new URL(`${BASE_URL}/api/v1/getTrainRoute`);
  url.searchParams.set("trainNo", trainNumber);

  const res = await fetch(url.toString(), { method: "GET", headers });
  if (!res.ok) throw new Error(`Railway API error ${res.status}`);

  const json = await res.json();
  return json?.data || [];
}

// ── Check PNR status ───────────────────────────────────────────
// Endpoint: GET /api/v1/getPNRStatus
export async function getPNRStatus(pnr: string): Promise<PNRStatus> {
  if (!isRailwayApiConfigured()) throw new Error("API key not configured");

  const url = new URL(`${BASE_URL}/api/v1/getPNRStatus`);
  url.searchParams.set("pnrNumber", pnr);

  const res = await fetch(url.toString(), { method: "GET", headers });
  if (!res.ok) throw new Error(`Railway API error ${res.status}`);

  const json = await res.json();
  const d = json?.data || {};
  return {
    pnr,
    trainNumber:  d.trainNumber  || d.train_number  || "",
    trainName:    d.trainName    || d.train_name    || "",
    journeyDate:  d.journeyDate  || d.doj           || "",
    from:         d.boardingPoint || d.from          || "",
    to:           d.destinationStation || d.to       || "",
    status:       d.chartStatus  || d.status         || "",
    passengers:   (d.passengerList || d.passengers || []).map((p: RapidApiPassenger) => ({
      seat:   p.currentCoachId   || p.coach   || p.seat   || "–",
      status: p.currentStatusNew || p.status  || "Unknown",
    })),
  };
}

// ── Check live train running status ───────────────────────────
// Endpoint: GET /api/v1/liveTrainStatus
export async function getLiveStatus(trainNumber: string, date: string): Promise<unknown> {
  if (!isRailwayApiConfigured()) throw new Error("API key not configured");

  const url = new URL(`${BASE_URL}/api/v1/liveTrainStatus`);
  url.searchParams.set("trainNo", trainNumber);
  url.searchParams.set("startingDate", date); // "DD-MM-YYYY"

  const res = await fetch(url.toString(), { method: "GET", headers });
  if (!res.ok) throw new Error(`Railway API error ${res.status}`);

  const json = await res.json();
  return json?.data || {};
}

// ── Station code lookup table (common routes) ──────────────────
// Used to auto-convert city names → station codes for the search form
export const STATION_CODES: Record<string, string> = {
  // North India
  "delhi":         "NDLS",
  "new delhi":     "NDLS",
  "delhi sarai rohilla": "DEE",
  "hazrat nizamuddin":   "NZM",
  "mumbai":        "CSTM",
  "mumbai central":"BCT",
  "mumbai bandra": "BVI",
  "kolkata":       "KOAA",
  "howrah":        "HWH",
  "sealdah":       "SDAH",
  "chennai":       "MAS",
  "bangalore":     "SBC",
  "bengaluru":     "SBC",
  "hyderabad":     "HYB",
  "secunderabad":  "SC",
  "ahmedabad":     "ADI",
  "pune":          "PUNE",
  "jaipur":        "JP",
  "lucknow":       "LKO",
  "varanasi":      "BSB",
  "agra":          "AGC",
  "amritsar":      "ASR",
  "chandigarh":    "CDG",
  // Hill station routes
  "dehradun":      "DDN",
  "haridwar":      "HW",
  "rishikesh":     "RKSH",
  "kathgodam":     "KGM",  // for Nainital/Corbett
  "kalka":         "KLK",  // for Shimla
  "pathankot":     "PTKC", // for Dharamshala / Dalhousie
  "joginder nagar":"JGPR", // for Mandi / Kullu
  "shimla":        "SML",
  "manali":        "MNVL",
  "leh":           "LEH",
  "srinagar":      "SRE",
  "jammu":         "JAT",
  // East India
  "guwahati":      "GHY",
  "new jalpaiguri":"NJP",  // for Darjeeling / Sikkim
  "bhubaneswar":   "BBS",
  "puri":          "PURI",
  // South India
  "kochi":         "ERS",
  "thiruvananthapuram": "TVC",
  "kozhikode":     "CLT",
  "mysore":        "MYS",
  "coimbatore":    "CBE",
  "madurai":       "MDU",
  "goa":           "MAO",
  "margao":        "MAO",
  // West India
  "jodhpur":       "JU",
  "udaipur":       "UDZ",
  "jaisalmer":     "JSM",
  "surat":         "ST",
  "vadodara":      "BRC",
  "rajkot":        "RJT",
  // Central India
  "bhopal":        "BPL",
  "indore":        "INDB",
  "nagpur":        "NGP",
  "jabalpur":      "JBP",
  "raipur":        "R",
};

export function cityToStationCode(city: string): string {
  const key = city.toLowerCase().trim();
  return STATION_CODES[key] || city.toUpperCase().slice(0, 4);
}

// ── Raw API response types ─────────────────────────────────────
type RapidApiTrain = {
  trainNumber?: string; train_number?: string; trainNo?: string;
  trainName?: string;   train_name?: string;
  fromStationCode?: string; from?: string; origin?: string;
  toStationCode?: string;   to?: string;   destination?: string;
  departureTime?: string; departure?: string; std?: string;
  arrivalTime?: string;   arrival?: string;   sta?: string;
  duration?: string;      runTime?: string;
  availableSeats?: number; seats?: number;
  runningDays?: string;    daysOfRun?: string;
  distance?: string;
  classDetails?: RapidApiClass[];
  classes?: RapidApiClass[];
};

type RapidApiClass = {
  className?: string; class?: string; classType?: string;
  fare?: number;      price?: number;
  availableSeats?: number; seatsAvailable?: number;
};

type RapidApiStation = {
  stationCode?: string; station_code?: string; code?: string;
  stationName?: string; station_name?: string; name?: string;
  state?: string;
};

type RapidApiPassenger = {
  currentCoachId?: string;   coach?: string;   seat?: string;
  currentStatusNew?: string; status?: string;
};

function normaliseTrain(t: RapidApiTrain): LiveTrain {
  const classData: TrainClass[] = (t.classDetails || t.classes || []).map((c: RapidApiClass) => ({
    name:           c.className || c.class || c.classType || "GEN",
    price:          c.fare      || c.price || 0,
    available:      (c.availableSeats || c.seatsAvailable || 0) > 0,
    availableSeats: c.availableSeats  || c.seatsAvailable || 0,
  }));

  // If no class breakdown from API, create a minimal one
  if (classData.length === 0) {
    classData.push({ name:"GEN", price:0, available:true, availableSeats:50 });
  }

  return {
    id:             t.trainNumber  || t.train_number || t.trainNo || String(Math.random()),
    trainName:      t.trainName    || t.train_name   || "Express Train",
    trainNumber:    t.trainNumber  || t.train_number || t.trainNo || "–",
    from:           t.fromStationCode || t.from      || t.origin  || "–",
    to:             t.toStationCode   || t.to        || t.destination || "–",
    departure:      t.departureTime   || t.departure  || t.std    || "–",
    arrival:        t.arrivalTime     || t.arrival    || t.sta    || "–",
    duration:       t.duration        || t.runTime    || "–",
    availableSeats: t.availableSeats  || t.seats      || 0,
    runningDays:    t.runningDays     || t.daysOfRun  || "Daily",
    distance:       t.distance        || "",
    classes:        classData,
  };
}
