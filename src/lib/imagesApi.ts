// ============================================================
//  Real Location Images API
//  Priority: Google Places Photos → Unsplash API → Curated fallbacks
//  .env: VITE_GOOGLE_PLACES_KEY, VITE_UNSPLASH_ACCESS_KEY
// ============================================================

import CONFIG from "./config";

// ── Curated, verified Unsplash photo IDs for each Indian destination ──
// These are specific, high-quality images that will always render
// export const LOCATION_IMAGES: Record<string, string[]> = {
//   // ── Himachal Pradesh ──────────────────────────────────────────
//   "Shimla":           ["https://images.unsplash.com/photo-1562750047-f4bc67a6a2e2?w=800&q=85","https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85"],
//   "Manali":           ["https://images.unsplash.com/photo-1504652517000-ae1068478c59?w=800&q=85","https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=85"],
//   "Dharamshala":      ["https://images.unsplash.com/photo-1570259476260-75efd20efb31?w=800&q=85","https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=85"],
//   "Spiti Valley":     ["https://images.unsplash.com/photo-1591016405280-f0e1e978e432?w=800&q=85","https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=800&q=85"],
//   "Jibhi":            ["https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=85","https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&q=85"],
//   "Kasol":            ["https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=800&q=85","https://images.unsplash.com/photo-1510797215324-95aa89f43c33?w=800&q=85"],
//   "Tirthan Valley":   ["https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=85","https://images.unsplash.com/photo-1624461050280-f1ee5c6f7c8b?w=800&q=85"],
//   "Dalhousie":        ["https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=85","https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=85"],
//   // ── Uttarakhand ───────────────────────────────────────────────
//   "Rishikesh":        ["https://images.unsplash.com/photo-1595981234058-a9302fb97229?w=800&q=85","https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85"],
//   "Haridwar":         ["https://images.unsplash.com/photo-1561714200-05fdfd2e7f66?w=800&q=85","https://images.unsplash.com/photo-1547483238-f400e65ccd56?w=800&q=85"],
//   "Mussoorie":        ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85","https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85"],
//   "Auli":             ["https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&q=85","https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85"],
//   "Chopta":           ["https://images.unsplash.com/photo-1623141629340-6ebb660d3c6b?w=800&q=85","https://images.unsplash.com/photo-1504652517000-ae1068478c59?w=800&q=85"],
//   "Jim Corbett NP":   ["https://images.unsplash.com/photo-1549366021-9f761d040a94?w=800&q=85","https://images.unsplash.com/photo-1564349683136-77e08dba1ef3?w=800&q=85"],
//   "Valley of Flowers":["https://images.unsplash.com/photo-1565073624497-7144969b9e8b?w=800&q=85","https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=85"],
//   // ── Rajasthan ─────────────────────────────────────────────────
//   "Jaipur":           ["https://images.unsplash.com/photo-1477587458883-47145ed31672?w=800&q=85","https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&q=85"],
//   "Udaipur":          ["https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=800&q=85","https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=85"],
//   "Jaisalmer":        ["https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=85","https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85"],
//   "Jodhpur":          ["https://images.unsplash.com/photo-1524230572899-a752b3835840?w=800&q=85","https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=85"],
//   "Pushkar":          ["https://images.unsplash.com/photo-1624380083826-1ade3e5e1d60?w=800&q=85","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85"],
//   // ── Kerala ────────────────────────────────────────────────────
//   "Alleppey":         ["https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800&q=85","https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=85"],
//   "Munnar":           ["https://images.unsplash.com/photo-1580289018575-f2f2c47a72f8?w=800&q=85","https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=85"],
//   "Wayanad":          ["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=85","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85"],
//   "Thekkady":         ["https://images.unsplash.com/photo-1564349683136-77e08dba1ef3?w=800&q=85","https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=85"],
//   "Varkala":          ["https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=85","https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85"],
//   // ── Ladakh ────────────────────────────────────────────────────
//   "Leh":              ["https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=85","https://images.unsplash.com/photo-1591016405280-f0e1e978e432?w=800&q=85"],
//   "Pangong Lake":     ["https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=800&q=85","https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=85"],
//   "Nubra Valley":     ["https://images.unsplash.com/photo-1609766856923-7c0d8fc5c30b?w=800&q=85","https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=85"],
//   "Tso Moriri":       ["https://images.unsplash.com/photo-1591016405280-f0e1e978e432?w=800&q=85","https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=800&q=85"],
//   // ── Goa ───────────────────────────────────────────────────────
//   "North Goa":        ["https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=85","https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=85"],
//   "South Goa":        ["https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=85","https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85"],
//   // ── West Bengal ───────────────────────────────────────────────
//   "Darjeeling":       ["https://images.unsplash.com/photo-1544461772-722b699b4c40?w=800&q=85","https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=85"],
//   "Sundarbans":       ["https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=800&q=85","https://images.unsplash.com/photo-1564349683136-77e08dba1ef3?w=800&q=85"],
//   "Sandakphu":        ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85","https://images.unsplash.com/photo-1623141629340-6ebb660d3c6b?w=800&q=85"],
//   // ── Tamil Nadu ────────────────────────────────────────────────
//   "Ooty":             ["https://images.unsplash.com/photo-1580289018575-f2f2c47a72f8?w=800&q=85","https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=85"],
//   "Kodaikanal":       ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85","https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85"],
//   "Rameswaram":       ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=85","https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=85"],
//   // ── Karnataka ─────────────────────────────────────────────────
//   "Coorg":            ["https://images.unsplash.com/photo-1580289018575-f2f2c47a72f8?w=800&q=85","https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=85"],
//   "Hampi":            ["https://images.unsplash.com/photo-1600697395543-a2c8f0a7b1db?w=800&q=85","https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&q=85"],
//   // ── Meghalaya ─────────────────────────────────────────────────
//   "Shillong":         ["https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=85","https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=85"],
//   "Cherrapunji":      ["https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=85","https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85"],
//   "Dawki":            ["https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=85","https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=85"],
//   // ── Sikkim ────────────────────────────────────────────────────
//   "Gangtok":          ["https://images.unsplash.com/photo-1544461772-722b699b4c40?w=800&q=85","https://images.unsplash.com/photo-1623141629340-6ebb660d3c6b?w=800&q=85"],
//   "Yumthang Valley":  ["https://images.unsplash.com/photo-1565073624497-7144969b9e8b?w=800&q=85","https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=85"],
//   // ── Others ────────────────────────────────────────────────────
//   "Havelock Island":  ["https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=85","https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85"],
//   "Srinagar":         ["https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=800&q=85","https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=85"],
//   "Gulmarg":          ["https://images.unsplash.com/photo-1606836316958-3d05beaec5ff?w=800&q=85","https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=85"],
//   "Lonavala":         ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85","https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85"],
//   "Mahabaleshwar":    ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85","https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=85"],
//   "Khajuraho":        ["https://images.unsplash.com/photo-1600697395543-a2c8f0a7b1db?w=800&q=85","https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&q=85"],
//   "Kanha NP":         ["https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=800&q=85","https://images.unsplash.com/photo-1564349683136-77e08dba1ef3?w=800&q=85"],
//   "Puri":             ["https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=85","https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=85"],
//   "Konark":           ["https://images.unsplash.com/photo-1600697395543-a2c8f0a7b1db?w=800&q=85","https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&q=85"],
//   "Rann of Kutch":    ["https://images.unsplash.com/photo-1567591370978-30cc8f236a4e?w=800&q=85","https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=85"],
//   "Gir NP":           ["https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=800&q=85","https://images.unsplash.com/photo-1564349683136-77e08dba1ef3?w=800&q=85"],
//   "Kaziranga NP":     ["https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=800&q=85","https://images.unsplash.com/photo-1564349683136-77e08dba1ef3?w=800&q=85"],
//   "Amritsar":         ["https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=800&q=85","https://images.unsplash.com/photo-1561714200-05fdfd2e7f66?w=800&q=85"],
//   "Tawang":           ["https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=85","https://images.unsplash.com/photo-1591016405280-f0e1e978e432?w=800&q=85"],
//   "Dzükou Valley":    ["https://images.unsplash.com/photo-1565073624497-7144969b9e8b?w=800&q=85","https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=85"],
// };

// State-level images
export const STATE_IMAGES: Record<string, string> = {
  "Himachal Pradesh":          "https://images.unsplash.com/photo-1562750047-f4bc67a6a2e2?w=600&q=85",
  "Uttarakhand":               "https://images.unsplash.com/photo-1595981234058-a9302fb97229?w=600&q=85",
  "Rajasthan":                 "https://images.unsplash.com/photo-1477587458883-47145ed31672?w=600&q=85",
  "Kerala":                    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=85",
  "Ladakh":                    "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=85",
  "Goa":                       "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=85",
  "West Bengal":               "https://images.unsplash.com/photo-1544461772-722b699b4c40?w=600&q=85",
  "Tamil Nadu":                "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=85",
  "Karnataka":                 "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=600&q=85",
  "Meghalaya":                 "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&q=85",
  "Sikkim":                    "https://images.unsplash.com/photo-1623141629340-6ebb660d3c6b?w=600&q=85",
  "Andaman & Nicobar Islands": "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&q=85",
  "Jammu & Kashmir":           "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=600&q=85",
  "Maharashtra":               "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=600&q=85",
  "Madhya Pradesh":            "https://images.unsplash.com/photo-1600697395543-a2c8f0a7b1db?w=600&q=85",
  "Odisha":                    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=85",
  "Gujarat":                   "https://images.unsplash.com/photo-1567591370978-30cc8f236a4e?w=600&q=85",
  "Assam":                     "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=600&q=85",
  "Punjab":                    "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=600&q=85",
  "Arunachal Pradesh":         "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=85",
  "Nagaland":                  "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&q=85",
};

// ── Get best image for a location ────────────────────────────

// ── Fetch image via Unsplash API (when key is set) ────────────
export async function fetchUnsplashImage(query: string): Promise<string | null> {
  if (!CONFIG.isUnsplashEnabled()) return null;
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query + " India travel landscape")}&per_page=1&orientation=landscape`;
    const res = await fetch(url, { headers: { Authorization: `Client-ID ${CONFIG.UNSPLASH_KEY}` } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.results?.[0]?.urls?.regular || null;
  } catch { return null; }
}
const imageCache = new Map<string, string>();

export async function getDynamicLocationImage(
  locationName: string
): Promise<string> {
  if (imageCache.has(locationName)) {
    return imageCache.get(locationName)!;
  }

  const image =
    await fetchUnsplashImage(locationName);

  const fallback =
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85";

  const finalImage = image || fallback;

  imageCache.set(locationName, finalImage);

  return finalImage;
}

// ── Google Places Photo (when key is set) ─────────────────────
export async function getGooglePlacePhoto(placeName: string): Promise<string | null> {
  if (!CONFIG.isPlacesEnabled()) return null;
  try {
    // Step 1: Find place
    const findUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(placeName + " India")}&inputtype=textquery&fields=photos,place_id&key=${CONFIG.GOOGLE_PLACES_KEY}`;
    const findRes = await fetch(findUrl);
    const findJson = await findRes.json();
    const ref = findJson?.candidates?.[0]?.photos?.[0]?.photo_reference;
    if (!ref) return null;
    // Step 2: Get photo URL
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${ref}&key=${CONFIG.GOOGLE_PLACES_KEY}`;
  } catch { return null; }
}
