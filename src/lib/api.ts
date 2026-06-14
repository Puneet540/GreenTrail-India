// ============================================================
//  GreenTrail India — Complete Data Layer
//  Replace mock hooks with real API calls when backend is ready
//  API keys config: src/lib/config.ts
// ============================================================

export type Destination = {
  id: number; name: string; slug: string; state: string; type: string;
  tags: string[]; description: string; tagline: string; imageUrl: string;
  ecoRating: number; bestTime: string; latitude: number; longitude: number;
  altitude: string; temperature: string; isHiddenGem: boolean;
  famousFor?: string[]; thingsToDoCount?: number;
};

// All 28 states of India + 8 UTs with tourist places (5+ per state)
export const DESTINATIONS: Destination[] = [
  // ── Himachal Pradesh ─────────────────────────────────────────
  { id:1,  name:"Shimla",          slug:"shimla",       state:"Himachal Pradesh", type:"Mountain", tags:["Mountain","Heritage"], description:"The Queen of Hills — colonial architecture, Mall Road, and pine-clad ridges that defined the British Raj's summer capital.", tagline:"Queen of Hills", imageUrl:"https://images.unsplash.com/photo-1562750047-f4bc67a6a2e2?w=800&q=85", ecoRating:4.0, bestTime:"Mar–Jun, Sep–Nov", latitude:31.1048, longitude:77.1734, altitude:"2,206m", temperature:"4–25°C", isHiddenGem:false, famousFor:["Mall Road","Christ Church","Jakhu Temple","Kufri"], thingsToDoCount:24 },
  { id:2,  name:"Manali",          slug:"manali",       state:"Himachal Pradesh", type:"Mountain", tags:["Mountain","Adventure"], description:"Gateway to Lahaul & Spiti, Rohtang Pass and world-class skiing. Set in the Beas river valley surrounded by snowy peaks.", tagline:"Adventure Capital of Himachal", imageUrl:"https://images.unsplash.com/photo-1504652517000-ae1068478c59?w=800&q=85", ecoRating:4.2, bestTime:"Oct–Jun", latitude:32.2396, longitude:77.1887, altitude:"2,050m", temperature:"-10–25°C", isHiddenGem:false, famousFor:["Rohtang Pass","Solang Valley","Hadimba Temple","Old Manali"], thingsToDoCount:31 },
  { id:3,  name:"Dharamshala",     slug:"dharamshala",  state:"Himachal Pradesh", type:"Mountain", tags:["Mountain","Spiritual","Culture"], description:"Home of the Dalai Lama and Tibetan government in exile. Mcleod Ganj sits above in the mist with Tibetan monasteries and Himalayan treks.", tagline:"Little Lhasa of India", imageUrl:"https://images.unsplash.com/photo-1570259476260-75efd20efb31?w=800&q=85", ecoRating:4.5, bestTime:"Mar–Jun, Sep–Dec", latitude:32.2190, longitude:76.3234, altitude:"1,457m", temperature:"5–28°C", isHiddenGem:false, famousFor:["Mcleod Ganj","Namgyal Monastery","Triund Trek","Bhagsu Waterfall"], thingsToDoCount:22 },
  { id:4,  name:"Spiti Valley",    slug:"spiti",        state:"Himachal Pradesh", type:"Desert",   tags:["Mountain","Desert","Spiritual"], description:"A cold desert mountain valley at 3,800–4,600m — monasteries perched on cliffs, lunar landscapes, and starfields that take your breath away.", tagline:"The Middle Land", imageUrl:"https://images.unsplash.com/photo-1591016405280-f0e1e978e432?w=800&q=85", ecoRating:4.8, bestTime:"Jun–Sep", latitude:32.2432, longitude:78.0346, altitude:"3,800–4,600m", temperature:"-5–20°C", isHiddenGem:false, famousFor:["Key Monastery","Chandratal Lake","Kaza","Pin Valley NP"], thingsToDoCount:18 },
  { id:5,  name:"Jibhi",           slug:"jibhi",        state:"Himachal Pradesh", type:"Valley",   tags:["Valley","Forest","Hidden"], description:"A secret hamlet where time slows to the rhythm of the river. Dense deodar forests, wooden watermills, and the Jibhi waterfall far from tourist crowds.", tagline:"The Valley of Stillness", imageUrl:"https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=85", ecoRating:4.9, bestTime:"Mar–Jun, Sep–Nov", latitude:31.5313, longitude:77.4575, altitude:"1,880m", temperature:"5–22°C", isHiddenGem:true, famousFor:["Jibhi Waterfall","Serolsar Lake","Jalori Pass","Raghupur Fort"], thingsToDoCount:12 },
  { id:6,  name:"Kasol",           slug:"kasol",        state:"Himachal Pradesh", type:"Valley",   tags:["Mountain","Valley","Hidden"], description:"A tiny paradise in the Parvati Valley. Riverside campsites, Kheerganga trek, and mountain air so pure it changes you.", tagline:"Parvati Valley Haven", imageUrl:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=85", ecoRating:4.5, bestTime:"Mar–May, Sep–Nov", latitude:32.0102, longitude:77.3143, altitude:"1,640m", temperature:"5–25°C", isHiddenGem:true, famousFor:["Kheerganga Trek","Parvati River","Malana","Chalal Walk"], thingsToDoCount:14 },
  { id:7,  name:"Tirthan Valley",  slug:"tirthan",      state:"Himachal Pradesh", type:"River",    tags:["Valley","River","Forest","Hidden"], description:"A pristine ribbon of river valley bordering GHNP. Trout fishing, forest hikes, and complete disconnection from modern life.", tagline:"Where Rivers Breathe", imageUrl:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=85", ecoRating:4.9, bestTime:"Mar–Jun, Sep–Nov", latitude:31.6118, longitude:77.5295, altitude:"1,600m", temperature:"5–22°C", isHiddenGem:true, famousFor:["GHNP","Trout Fishing","Chhoie Waterfall","Saryolsar Lake"], thingsToDoCount:11 },
  { id:8,  name:"Dalhousie",       slug:"dalhousie",    state:"Himachal Pradesh", type:"Mountain", tags:["Mountain","Heritage"], description:"A Victorian hill station of winding roads, colonial bungalows, and sweeping views of the Pir Panjal and Dhauladhar ranges.", tagline:"Scotland of India", imageUrl:"https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=85", ecoRating:4.3, bestTime:"Mar–Jun, Sep–Nov", latitude:32.5387, longitude:75.9734, altitude:"2,036m", temperature:"2–24°C", isHiddenGem:false, famousFor:["Khajjiar","Dainkund Peak","Kalatop Wildlife Sanctuary","Gandhi Chowk"], thingsToDoCount:16 },

  // ── Uttarakhand ───────────────────────────────────────────────
  { id:9,  name:"Rishikesh",       slug:"rishikesh",    state:"Uttarakhand", type:"River",    tags:["River","Spiritual","Adventure"], description:"Yoga capital of the world. The Ganges runs cold and clear through ancient ghats. White-water rafting, bungee, and profound spiritual energy.", tagline:"Gateway to the Himalayas", imageUrl:"https://images.unsplash.com/photo-1595981234058-a9302fb97229?w=800&q=85", ecoRating:4.2, bestTime:"Sep–Apr", latitude:30.0869, longitude:78.2676, altitude:"372m", temperature:"12–35°C", isHiddenGem:false, famousFor:["Laxman Jhula","Rafting","Yoga Ashrams","Beatles Ashram"], thingsToDoCount:28 },
  { id:10, name:"Haridwar",        slug:"haridwar",     state:"Uttarakhand", type:"River",    tags:["River","Spiritual"], description:"One of the seven holiest cities in Hinduism. The Ganga Aarti at Har Ki Pauri at dusk is among India's most transcendent experiences.", tagline:"Gateway to the Gods", imageUrl:"https://images.unsplash.com/photo-1561714200-05fdfd2e7f66?w=800&q=85", ecoRating:3.8, bestTime:"Oct–Apr", latitude:29.9457, longitude:78.1642, altitude:"314m", temperature:"10–38°C", isHiddenGem:false, famousFor:["Har Ki Pauri","Ganga Aarti","Mansa Devi Temple","Chandi Devi"], thingsToDoCount:19 },
  { id:11, name:"Mussoorie",       slug:"mussoorie",    state:"Uttarakhand", type:"Mountain", tags:["Mountain","Heritage"], description:"The Queen of Hill Stations. Kempty Falls, Gun Hill, and misty ridgeline walks above the Doon Valley.", tagline:"Queen of Hill Stations", imageUrl:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85", ecoRating:4.0, bestTime:"Mar–Jun, Sep–Nov", latitude:30.4598, longitude:78.0664, altitude:"2,005m", temperature:"1–25°C", isHiddenGem:false, famousFor:["Kempty Falls","Gun Hill","Lal Tibba","Camel's Back Road"], thingsToDoCount:20 },
  { id:12, name:"Auli",            slug:"auli",         state:"Uttarakhand", type:"Mountain", tags:["Mountain","Adventure"], description:"India's premier ski resort — 500m of groomed slopes, a 4km gondola, and views of Nanda Devi, Kamet and Mana Peak.", tagline:"Himalayan Ski Paradise", imageUrl:"https://images.unsplash.com/photo-1591016405280-f0e1e978e432?w=800&q=80", ecoRating:4.6, bestTime:"Nov–Mar (ski), Apr–Jun (trek)", latitude:30.5232, longitude:79.5681, altitude:"2,519m", temperature:"-8–20°C", isHiddenGem:false, famousFor:["Skiing","Gorson Bugyal","Joshimath","Ropeway"], thingsToDoCount:14 },
  { id:13, name:"Chopta",          slug:"chopta",       state:"Uttarakhand", type:"Forest",   tags:["Mountain","Forest","Hidden"], description:"Mini Switzerland of Uttarakhand. Vast bugyals (meadows) carpeted in wildflowers in spring. Trek to Tungnath — world's highest Shiva temple.", tagline:"Meadow of the Gods", imageUrl:"https://images.unsplash.com/photo-1623141629340-6ebb660d3c6b?w=800&q=85", ecoRating:4.7, bestTime:"Mar–Jun", latitude:30.5231, longitude:79.1989, altitude:"2,680m", temperature:"0–18°C", isHiddenGem:true, famousFor:["Tungnath Temple","Chandrashila Summit","Deoria Tal","Rohini Bugyal"], thingsToDoCount:10 },
  { id:14, name:"Jim Corbett NP",  slug:"corbett",      state:"Uttarakhand", type:"Wildlife", tags:["Forest","Wildlife"], description:"India's oldest national park. Bengal tigers, Asian elephants, and 600+ bird species in the foothills of the Himalayas.", tagline:"Land of the Tiger", imageUrl:"https://images.unsplash.com/photo-1549366021-9f761d040a94?w=800&q=85", ecoRating:4.7, bestTime:"Nov–Jun", latitude:29.5300, longitude:78.7747, altitude:"385–1,100m", temperature:"5–40°C", isHiddenGem:false, famousFor:["Tiger Safari","Dhikala Zone","Birding","Elephant Safari"], thingsToDoCount:16 },
  { id:15, name:"Valley of Flowers", slug:"valley-of-flowers", state:"Uttarakhand", type:"Valley", tags:["Mountain","Forest","Valley"], description:"A UNESCO World Heritage Site. 300+ Himalayan wildflower species bloom in a remote alpine valley accessible only on foot.", tagline:"UNESCO Flower Sanctuary", imageUrl:"https://images.unsplash.com/photo-1584507776049-b99a97f7b5f6?w=800&q=80", ecoRating:5.0, bestTime:"Jul–Aug", latitude:30.7280, longitude:79.6050, altitude:"3,352–3,658m", temperature:"5–20°C", isHiddenGem:false, famousFor:["Wildflower Trek","Hemkund Sahib","Ghangaria","Nanda Devi Biosphere"], thingsToDoCount:8 },

  // ── Rajasthan ─────────────────────────────────────────────────
  { id:16, name:"Jaipur",          slug:"jaipur",       state:"Rajasthan", type:"Heritage", tags:["Heritage","Culture","Desert"], description:"The Pink City — Amber Fort, City Palace, Hawa Mahal, and bazaars bursting with textiles, gems, and Rajput grandeur.", tagline:"The Pink City", imageUrl:"https://images.unsplash.com/photo-1477587458883-47145ed31672?w=800&q=85", ecoRating:3.8, bestTime:"Oct–Mar", latitude:26.9124, longitude:75.7873, altitude:"431m", temperature:"5–45°C", isHiddenGem:false, famousFor:["Amber Fort","City Palace","Hawa Mahal","Jantar Mantar"], thingsToDoCount:35 },
  { id:17, name:"Udaipur",         slug:"udaipur",      state:"Rajasthan", type:"Heritage", tags:["Heritage","Lake","Culture"], description:"The City of Lakes — palaces rising from shimmering water, ancient ghats, and a romance that has made it India's most loved city.", tagline:"Venice of the East", imageUrl:"https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=800&q=85", ecoRating:4.1, bestTime:"Oct–Mar", latitude:24.5854, longitude:73.7125, altitude:"598m", temperature:"8–40°C", isHiddenGem:false, famousFor:["City Palace","Pichola Lake","Monsoon Palace","Fateh Sagar"], thingsToDoCount:29 },
  { id:18, name:"Jaisalmer",       slug:"jaisalmer",    state:"Rajasthan", type:"Desert",   tags:["Desert","Heritage"], description:"The Golden City. A sandstone fort rising from the Thar Desert with camel safaris, desert camps, and Rajput havelis.", tagline:"The Golden City", imageUrl:"https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=85", ecoRating:4.3, bestTime:"Oct–Feb", latitude:26.9157, longitude:70.9083, altitude:"225m", temperature:"2–42°C", isHiddenGem:false, famousFor:["Jaisalmer Fort","Sam Sand Dunes","Patwon Ki Haveli","Gadisar Lake"], thingsToDoCount:22 },
  { id:19, name:"Jodhpur",         slug:"jodhpur",      state:"Rajasthan", type:"Heritage", tags:["Heritage","Desert","Culture"], description:"The Blue City — Mehrangarh Fort towering over indigo-painted old city lanes, clock towers, and spice markets.", tagline:"The Blue City", imageUrl:"https://images.unsplash.com/photo-1524230572899-a752b3835840?w=800&q=85", ecoRating:4.0, bestTime:"Oct–Mar", latitude:26.2389, longitude:73.0243, altitude:"231m", temperature:"6–42°C", isHiddenGem:false, famousFor:["Mehrangarh Fort","Umaid Bhawan Palace","Clock Tower","Jaswant Thada"], thingsToDoCount:26 },
  { id:20, name:"Pushkar",         slug:"pushkar",      state:"Rajasthan", type:"Spiritual",tags:["Spiritual","Desert","Culture"], description:"A sacred lake town famous for the Brahma Temple — one of the few in the world. The camel fair transforms it each November.", tagline:"Sacred Desert Oasis", imageUrl:"https://images.unsplash.com/photo-1624380083826-1ade3e5e1d60?w=800&q=85", ecoRating:4.4, bestTime:"Oct–Mar", latitude:26.4896, longitude:74.5511, altitude:"510m", temperature:"5–40°C", isHiddenGem:false, famousFor:["Brahma Temple","Pushkar Lake","Camel Fair","Savitri Temple Trek"], thingsToDoCount:15 },

  // ── Kerala ────────────────────────────────────────────────────
  { id:21, name:"Alleppey",        slug:"alleppey",     state:"Kerala", type:"Backwaters", tags:["Backwaters","Culture"], description:"Venice of the East. A maze of canals, coconut groves, and rice paddies best explored from a traditional Kerala houseboat.", tagline:"Backwater Wonderland", imageUrl:"https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800&q=85", ecoRating:4.5, bestTime:"Oct–Feb", latitude:9.4981, longitude:76.3388, altitude:"0–5m", temperature:"23–33°C", isHiddenGem:false, famousFor:["Houseboat Stay","Vembanad Lake","Nehru Trophy Boat Race","Kuttanad Paddyfields"], thingsToDoCount:20 },
  { id:22, name:"Munnar",          slug:"munnar",       state:"Kerala", type:"Mountain",   tags:["Mountain","Forest","Tea"], description:"Rolling tea estates at 1,600m in the Western Ghats. Mist-draped hills, Anamudi peak, and the rare Neelakurinji flower.", tagline:"Tea Garden Paradise", imageUrl:"https://images.unsplash.com/photo-1580289018575-f2f2c47a72f8?w=800&q=85", ecoRating:4.6, bestTime:"Oct–Mar", latitude:10.0889, longitude:77.0595, altitude:"1,600m", temperature:"10–25°C", isHiddenGem:false, famousFor:["Tea Plantations","Eravikulam NP","Anamudi","Top Station"], thingsToDoCount:18 },
  { id:23, name:"Wayanad",         slug:"wayanad",      state:"Kerala", type:"Forest",     tags:["Forest","Wildlife","Hidden"], description:"A plateau of spice plantations, tribal heritage, and wildlife sanctuaries. Edakkal Caves, Chembra Peak, and the ancient Thirunelli Temple.", tagline:"The Green Heart of Kerala", imageUrl:"https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=85", ecoRating:4.8, bestTime:"Oct–Feb", latitude:11.6854, longitude:76.1320, altitude:"700–2,100m", temperature:"18–28°C", isHiddenGem:false, famousFor:["Chembra Peak","Edakkal Caves","Banasura Sagar Dam","Muthanga Wildlife"], thingsToDoCount:21 },
  { id:24, name:"Thekkady",        slug:"thekkady",     state:"Kerala", type:"Wildlife",   tags:["Forest","Wildlife"], description:"Periyar Wildlife Sanctuary — boat rides among wild elephants, tiger reserve, and spice plantation walks.", tagline:"Spice & Wildlife Haven", imageUrl:"https://images.unsplash.com/photo-1564349683136-77e08dba1ef3?w=800&q=85", ecoRating:4.7, bestTime:"Oct–Jun", latitude:9.5916, longitude:77.1534, altitude:"900m", temperature:"15–32°C", isHiddenGem:false, famousFor:["Periyar Lake Boat Ride","Elephant Safari","Spice Plantations","Bamboo Rafting"], thingsToDoCount:17 },
  { id:25, name:"Varkala",         slug:"varkala",      state:"Kerala", type:"Beach",      tags:["Beach","Spiritual"], description:"Dramatic red laterite cliffs above the Arabian Sea with natural springs. A beach that heals — Papanasam ghat washes sins according to Hindu tradition.", tagline:"Clifftop Beach Sanctuary", imageUrl:"https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=85", ecoRating:4.5, bestTime:"Oct–Feb", latitude:8.7379, longitude:76.7163, altitude:"0–15m", temperature:"22–33°C", isHiddenGem:true, famousFor:["Varkala Cliff","Papanasam Beach","Janardhana Swami Temple","Sunset Point"], thingsToDoCount:14 },

  // ── Ladakh ────────────────────────────────────────────────────
  { id:26, name:"Leh",             slug:"leh",          state:"Ladakh", type:"Mountain",  tags:["Mountain","Desert","Spiritual"], description:"The Land of High Passes — Tibetan Buddhist monasteries, moonscapes, and the most dramatic roads on earth.", tagline:"Roof of the World", imageUrl:"https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=85", ecoRating:4.5, bestTime:"Jun–Sep", latitude:34.1526, longitude:77.5771, altitude:"3,524m", temperature:"-20–30°C", isHiddenGem:false, famousFor:["Pangong Lake","Nubra Valley","Khardung La","Hemis Monastery"], thingsToDoCount:30 },
  { id:27, name:"Pangong Lake",    slug:"pangong",      state:"Ladakh", type:"Lake",      tags:["Mountain","Lake","Desert"], description:"A 134km lake straddling India and China at 4,350m. The colour shifts from turquoise to navy blue to grey in minutes.", tagline:"The Shifting Blue Lake", imageUrl:"https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=800&q=85", ecoRating:4.9, bestTime:"Jun–Sep", latitude:33.7597, longitude:78.6429, altitude:"4,350m", temperature:"-10–20°C", isHiddenGem:false, famousFor:["Sunrise at South Bank","3 Idiots Point","Chang La Pass","Camp Stays"], thingsToDoCount:10 },
  { id:28, name:"Nubra Valley",    slug:"nubra",        state:"Ladakh", type:"Desert",    tags:["Desert","Mountain","Hidden"], description:"A surreal sand-dune valley between the Karakoram and Ladakh ranges, where Bactrian camels wander under stars.", tagline:"Valley of Flowers & Sand", imageUrl:"https://images.unsplash.com/photo-1609766856923-7c0d8fc5c30b?w=800&q=85", ecoRating:4.6, bestTime:"Jun–Sep", latitude:34.6542, longitude:77.5498, altitude:"3,048m", temperature:"-15–25°C", isHiddenGem:true, famousFor:["Diskit Monastery","Bactrian Camels","Hunder Sand Dunes","Siachen Glacier View"], thingsToDoCount:12 },
  { id:29, name:"Tso Moriri",      slug:"tso-moriri",   state:"Ladakh", type:"Lake",      tags:["Mountain","Lake","Desert","Hidden"], description:"A remote high-altitude lake at 4,522m — less visited than Pangong but arguably more beautiful, surrounded by nomadic Changpa pastures.", tagline:"The Forgotten High Lake", imageUrl:"https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=800&q=85", ecoRating:5.0, bestTime:"Jun–Sep", latitude:32.9023, longitude:78.2875, altitude:"4,522m", temperature:"-15–18°C", isHiddenGem:true, famousFor:["Korzok Gompa","Black-Necked Cranes","Nomadic Camps","Rambling Plateau"], thingsToDoCount:8 },

  // ── Goa ───────────────────────────────────────────────────────
  { id:30, name:"North Goa",       slug:"north-goa",    state:"Goa", type:"Beach",     tags:["Beach","Culture","Heritage"], description:"Calangute, Anjuna, Vagator — India's most famous beaches with Portuguese churches, spice farms, and a world-class nightlife.", tagline:"India's Party Paradise", imageUrl:"https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=85", ecoRating:3.9, bestTime:"Nov–Mar", latitude:15.5993, longitude:73.7522, altitude:"0–50m", temperature:"20–33°C", isHiddenGem:false, famousFor:["Anjuna Beach","Basilica of Bom Jesus","Chapora Fort","Saturday Night Market"], thingsToDoCount:32 },
  { id:31, name:"South Goa",       slug:"south-goa",    state:"Goa", type:"Beach",     tags:["Beach","Forest","Hidden"], description:"Quieter, greener, and more local than the north. Palolem, Agonda, and Cola beaches backed by jungle. The real Goa.", tagline:"The Quiet Goa", imageUrl:"https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=85", ecoRating:4.5, bestTime:"Nov–Mar", latitude:15.1727, longitude:74.0047, altitude:"0–60m", temperature:"20–33°C", isHiddenGem:true, famousFor:["Palolem Beach","Agonda Beach","Cotigao Wildlife","Cola Beach"], thingsToDoCount:22 },

  // ── West Bengal ───────────────────────────────────────────────
  { id:32, name:"Darjeeling",      slug:"darjeeling",   state:"West Bengal", type:"Mountain", tags:["Mountain","Heritage","Tea"], description:"Toy train through mist, Tiger Hill sunrise over Kangchenjunga, and tea estates where the world's finest second-flush black tea grows.", tagline:"Queen of the Hills (East)", imageUrl:"https://images.unsplash.com/photo-1544461772-722b699b4c40?w=800&q=85", ecoRating:4.4, bestTime:"Mar–May, Oct–Nov", latitude:27.0360, longitude:88.2627, altitude:"2,045m", temperature:"5–25°C", isHiddenGem:false, famousFor:["Tiger Hill Sunrise","Toy Train","Tea Garden Tour","Batasia Loop"], thingsToDoCount:22 },
  { id:33, name:"Sundarbans",      slug:"sundarbans",   state:"West Bengal", type:"Wildlife", tags:["Forest","Wildlife","Backwaters"], description:"The world's largest mangrove delta — UNESCO listed and home to the Royal Bengal Tiger that swims between islands.", tagline:"World's Largest Mangrove Forest", imageUrl:"https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?w=800&q=80", ecoRating:4.8, bestTime:"Oct–Mar", latitude:21.9497, longitude:89.1833, altitude:"0–10m", temperature:"18–36°C", isHiddenGem:false, famousFor:["Tiger Safari","Boat Safari","Sajnekhali Bird Sanctuary","Mangrove Forest Walk"], thingsToDoCount:14 },
  { id:34, name:"Sandakphu",       slug:"sandakphu",    state:"West Bengal", type:"Mountain", tags:["Mountain","Hidden","Forest"], description:"At 3,636m, it's West Bengal's highest peak with views of four of the world's five highest mountains on a clear day.", tagline:"5 Peaks Vista Point", imageUrl:"https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?w=800&q=80", ecoRating:4.9, bestTime:"Apr–May, Oct–Dec", latitude:27.1037, longitude:88.0049, altitude:"3,636m", temperature:"-5–20°C", isHiddenGem:true, famousFor:["Singalila Ridge Trek","Four Peaks View","Rhododendron Forest","Tumling Village"], thingsToDoCount:9 },

  // ── Tamil Nadu ────────────────────────────────────────────────
  { id:35, name:"Ooty",            slug:"ooty",         state:"Tamil Nadu", type:"Mountain", tags:["Mountain","Heritage","Tea"], description:"The Nilgiri hills at 2,240m — emerald tea gardens, a UNESCO-listed toy train, and Botanical Gardens of extraordinary beauty.", tagline:"Queen of Hill Stations (South)", imageUrl:"https://images.unsplash.com/photo-1580289018575-f2f2c47a72f8?w=800&q=85", ecoRating:4.2, bestTime:"Apr–Jun, Sep–Nov", latitude:11.4102, longitude:76.6950, altitude:"2,240m", temperature:"5–25°C", isHiddenGem:false, famousFor:["Ooty Lake","Botanical Gardens","Toy Train","Dodabetta Peak"], thingsToDoCount:19 },
  { id:36, name:"Kodaikanal",      slug:"kodaikanal",   state:"Tamil Nadu", type:"Mountain", tags:["Mountain","Hidden","Forest"], description:"Princess of Hill Stations at 2,133m — a crater lake, Silver Cascade Falls, Pillar Rocks, and dense shola forests.", tagline:"Princess of Hill Stations", imageUrl:"https://images.unsplash.com/photo-1584507776049-b99a97f7b5f6?w=800&q=80", ecoRating:4.5, bestTime:"Apr–Jun", latitude:10.2381, longitude:77.4892, altitude:"2,133m", temperature:"8–20°C", isHiddenGem:false, famousFor:["Kodai Lake","Coaker's Walk","Pillar Rocks","Silver Cascade"], thingsToDoCount:17 },
  { id:37, name:"Rameswaram",      slug:"rameswaram",   state:"Tamil Nadu", type:"Spiritual",tags:["Spiritual","Beach"], description:"A sacred island city. The Ramanathaswamy Temple has the world's longest temple corridor. Dawn at the Agni Tirtha is unforgettable.", tagline:"Island of Devotion", imageUrl:"https://images.unsplash.com/photo-1584507776049-b99a97f7b5f6?w=800&q=80", ecoRating:4.1, bestTime:"Oct–Apr", latitude:9.2876, longitude:79.3129, altitude:"0–10m", temperature:"24–37°C", isHiddenGem:false, famousFor:["Ramanathaswamy Temple","Pamban Bridge","Dhanushkodi","Agni Tirtha"], thingsToDoCount:15 },

  // ── Karnataka ─────────────────────────────────────────────────
  { id:38, name:"Coorg",           slug:"coorg",        state:"Karnataka", type:"Forest",   tags:["Forest","Mountain","Tea"], description:"Scotland of India — rolling coffee and cardamom estates, misty mornings, Abbey Falls, and the warmth of Kodava hospitality.", tagline:"Coffee Country", imageUrl:"https://images.unsplash.com/photo-1580289018575-f2f2c47a72f8?w=800&q=85", ecoRating:4.5, bestTime:"Oct–Mar", latitude:12.4244, longitude:75.7382, altitude:"900–1,750m", temperature:"10–25°C", isHiddenGem:false, famousFor:["Coffee Plantation Walks","Abbey Falls","Nagarhole NP","Mandalpatti Peak"], thingsToDoCount:21 },
  { id:39, name:"Hampi",           slug:"hampi",        state:"Karnataka", type:"Heritage", tags:["Heritage","Desert","Culture"], description:"A UNESCO World Heritage Site — 500 years ago, Vijayanagara was the world's second largest city. Boulders, temples, and ancient bazaars.", tagline:"Ancient Empire City", imageUrl:"https://images.unsplash.com/photo-1600697395543-a2c8f0a7b1db?w=800&q=85", ecoRating:4.6, bestTime:"Oct–Feb", latitude:15.3350, longitude:76.4600, altitude:"467m", temperature:"22–40°C", isHiddenGem:false, famousFor:["Virupaksha Temple","Vittala Temple","Boulder Landscape","Tungabhadra River"], thingsToDoCount:24 },

  // ── Meghalaya ─────────────────────────────────────────────────
  { id:40, name:"Shillong",        slug:"shillong",     state:"Meghalaya", type:"Mountain", tags:["Mountain","Culture"], description:"Scotland of the East — pine forests, emerald Umiam Lake, and the rock music capital of India that produced Megadeth-level talent.", tagline:"Scotland of the East", imageUrl:"https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=85", ecoRating:4.3, bestTime:"Mar–Jun, Sep–Nov", latitude:25.5788, longitude:91.8933, altitude:"1,496m", temperature:"5–22°C", isHiddenGem:false, famousFor:["Elephant Falls","Shillong Peak","Ward's Lake","Don Bosco Museum"], thingsToDoCount:18 },
  { id:41, name:"Cherrapunji",     slug:"cherrapunji",  state:"Meghalaya", type:"Forest",   tags:["Forest","Hidden","Valley"], description:"The wettest place on Earth. Living root bridges, Nohkalikai Falls (India's tallest), and cloud forests unlike anywhere on the planet.", tagline:"Land of Endless Rain", imageUrl:"https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=85", ecoRating:4.9, bestTime:"Oct–May", latitude:25.2800, longitude:91.7200, altitude:"1,484m", temperature:"10–22°C", isHiddenGem:false, famousFor:["Nohkalikai Falls","Living Root Bridges","Mawsmai Cave","Seven Sisters Falls"], thingsToDoCount:16 },
  { id:42, name:"Dawki",           slug:"dawki",        state:"Meghalaya", type:"River",    tags:["River","Hidden","Forest"], description:"The Umngot River is so clear you feel like the boats are floating on air. A jaw-dropping natural phenomenon less than 4 hours from Shillong.", tagline:"Crystal Clear River Town", imageUrl:"https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?w=800&q=80", ecoRating:5.0, bestTime:"Nov–May", latitude:25.1793, longitude:92.0222, altitude:"570m", temperature:"10–28°C", isHiddenGem:true, famousFor:["Umngot River Boating","India-Bangladesh Border","Shnongpdeng Camping","Underwater Clarity"], thingsToDoCount:8 },

  // ── Sikkim ────────────────────────────────────────────────────
  { id:43, name:"Gangtok",         slug:"gangtok",      state:"Sikkim", type:"Mountain",  tags:["Mountain","Spiritual","Culture"], description:"Perched at 1,650m with views of Kangchenjunga — clean, walkable, and full of Tibetan Buddhist culture. The MG Road is one of India's finest.", tagline:"Kangchenjunga's Gateway", imageUrl:"https://images.unsplash.com/photo-1544461772-722b699b4c40?w=800&q=85", ecoRating:4.5, bestTime:"Mar–Jun, Oct–Dec", latitude:27.3314, longitude:88.6138, altitude:"1,650m", temperature:"5–22°C", isHiddenGem:false, famousFor:["Rumtek Monastery","MG Marg","Tsomgo Lake","Banjhakri Waterfall"], thingsToDoCount:20 },
  { id:44, name:"Yumthang Valley", slug:"yumthang",     state:"Sikkim", type:"Valley",    tags:["Mountain","Valley","Hidden"], description:"Valley of Flowers of the East — rhododendrons bloom at 3,564m. Hot springs, yak pastures, and one road that ends in paradise.", tagline:"Valley of Rhododendrons", imageUrl:"https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=800&q=80", ecoRating:4.9, bestTime:"Mar–Jun", latitude:27.8261, longitude:88.6855, altitude:"3,564m", temperature:"0–18°C", isHiddenGem:true, famousFor:["Rhododendron Season","Hot Springs","Zero Point","Lachen Village"], thingsToDoCount:10 },

  // ── Andaman & Nicobar ─────────────────────────────────────────
  { id:45, name:"Havelock Island",  slug:"havelock",    state:"Andaman & Nicobar Islands", type:"Beach", tags:["Beach","Forest","Hidden"], description:"Radhanagar Beach — voted Asia's best beach. Turquoise bioluminescent bays, untouched coral reefs, and jungle that meets the sea.", tagline:"Asia's Finest Beach Island", imageUrl:"https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=85", ecoRating:4.9, bestTime:"Nov–Apr", latitude:11.9673, longitude:93.0031, altitude:"0–30m", temperature:"23–32°C", isHiddenGem:false, famousFor:["Radhanagar Beach","Elephant Beach Snorkelling","Kalapathar Beach","Sea Walk"], thingsToDoCount:16 },

  // ── Jammu & Kashmir ───────────────────────────────────────────
  { id:46, name:"Srinagar",        slug:"srinagar",     state:"Jammu & Kashmir", type:"Lake",    tags:["Lake","Heritage","Mountain"], description:"The City of Lakes and Gardens — Dal Lake houseboats, Mughal gardens, and saffron fields against the backdrop of the Great Himalayas.", tagline:"Heaven on Earth", imageUrl:"https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=800&q=85", ecoRating:4.4, bestTime:"Apr–Oct", latitude:34.0837, longitude:74.7973, altitude:"1,585m", temperature:"-4–30°C", isHiddenGem:false, famousFor:["Dal Lake Shikara","Shalimar Bagh","Gulmarg Day Trip","Pahalgam"], thingsToDoCount:25 },
  { id:47, name:"Gulmarg",         slug:"gulmarg",      state:"Jammu & Kashmir", type:"Mountain",tags:["Mountain","Adventure"], description:"A high altitude meadow at 2,650m with Asia's highest gondola, world-class skiing, and wildflowers that cover every inch in summer.", tagline:"Meadow of Flowers", imageUrl:"https://images.unsplash.com/photo-1606836316958-3d05beaec5ff?w=800&q=85", ecoRating:4.6, bestTime:"Dec–Mar (ski), Apr–Sep (trek)", latitude:34.0506, longitude:74.3806, altitude:"2,650m", temperature:"-10–25°C", isHiddenGem:false, famousFor:["Gondola Ride","Skiing","Alpather Lake","Strawberry Valley"], thingsToDoCount:18 },

  // ── Maharashtra ───────────────────────────────────────────────
  { id:48, name:"Lonavala",        slug:"lonavala",     state:"Maharashtra", type:"Mountain", tags:["Mountain","Forest"], description:"The rooftop of Maharashtra. Karla and Bhaja Caves, Bhushi Dam, Tiger's Leap, and monsoon waterfalls that draw Mumbai crowds each July.", tagline:"Maharashtra's Favourite Escape", imageUrl:"https://images.unsplash.com/photo-1542273917363-3b1817f69a5d?w=800&q=80", ecoRating:3.9, bestTime:"Jun–Feb", latitude:18.7537, longitude:73.4068, altitude:"622m", temperature:"10–28°C", isHiddenGem:false, famousFor:["Tiger's Leap","Karla Caves","Bhushi Dam","Visapur Fort"], thingsToDoCount:18 },
  { id:49, name:"Mahabaleshwar",   slug:"mahabaleshwar",state:"Maharashtra", type:"Mountain", tags:["Mountain","Forest"], description:"A lush plateau at 1,353m with strawberry farms, Arthur's Seat cliff, Venna Lake boating, and Pratapgad Fort of Maratha history.", tagline:"Strawberry Hills of Maharashtra", imageUrl:"https://images.unsplash.com/photo-1542273917363-3b1817f69a5d?w=800&q=80", ecoRating:4.1, bestTime:"Oct–Jun", latitude:17.9244, longitude:73.6583, altitude:"1,353m", temperature:"5–30°C", isHiddenGem:false, famousFor:["Venna Lake","Arthur's Seat","Elephant's Head Point","Pratapgad Fort"], thingsToDoCount:16 },

  // ── Madhya Pradesh ────────────────────────────────────────────
  { id:50, name:"Khajuraho",       slug:"khajuraho",    state:"Madhya Pradesh", type:"Heritage", tags:["Heritage","Culture"], description:"UNESCO World Heritage — 10th century temples covered in extraordinarily detailed erotic and spiritual carvings. One of India's greatest architectural achievements.", tagline:"Temple of Eternal Art", imageUrl:"https://images.unsplash.com/photo-1542273917363-3b1817f69a5d?w=800&q=80", ecoRating:4.4, bestTime:"Oct–Feb", latitude:24.8318, longitude:79.9199, altitude:"285m", temperature:"8–43°C", isHiddenGem:false, famousFor:["Kandariya Mahadev Temple","Light & Sound Show","Lakshmana Temple","Chaturbhuj Temple"], thingsToDoCount:14 },
  { id:51, name:"Kanha NP",        slug:"kanha",        state:"Madhya Pradesh", type:"Wildlife", tags:["Forest","Wildlife"], description:"India's finest national park. The original inspiration for Jungle Book — Baloo the bear, Bagheera the panther, and real tigers on every safari.", tagline:"The Jungle Book Homeland", imageUrl:"https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?w=800&q=80", ecoRating:4.8, bestTime:"Oct–Jun", latitude:22.2576, longitude:80.6084, altitude:"440–945m", temperature:"5–42°C", isHiddenGem:false, famousFor:["Tiger Safari","Barasingha Meadow","Bamni Dadar Sunset","Jordi Safari Zone"], thingsToDoCount:16 },

  // ── Odisha ────────────────────────────────────────────────────
  { id:52, name:"Puri",            slug:"puri",         state:"Odisha", type:"Beach",     tags:["Beach","Spiritual"], description:"One of the four dhams — the Jagannath Temple dominates the town while the Bay of Bengal provides endless beach. Rath Yatra is one of India's biggest festivals.", tagline:"Holy Beach of the East", imageUrl:"https://images.unsplash.com/photo-1584507776049-b99a97f7b5f6?w=800&q=80", ecoRating:4.0, bestTime:"Oct–Mar", latitude:19.8135, longitude:85.8312, altitude:"0–5m", temperature:"18–35°C", isHiddenGem:false, famousFor:["Jagannath Temple","Puri Beach","Chilika Lake","Rath Yatra"], thingsToDoCount:16 },
  { id:53, name:"Konark",          slug:"konark",       state:"Odisha", type:"Heritage",  tags:["Heritage","Beach"], description:"The Sun Temple — a UNESCO World Heritage 13th-century chariot of stone pulled by 7 stone horses, with the most intricate medieval carvings in India.", tagline:"Sun Temple of India", imageUrl:"https://images.unsplash.com/photo-1542273917363-3b1817f69a5d?w=800&q=80", ecoRating:4.5, bestTime:"Oct–Mar", latitude:19.8876, longitude:86.0945, altitude:"10m", temperature:"18–36°C", isHiddenGem:false, famousFor:["Sun Temple (UNESCO)","Chandrabhaga Beach","Chandrabhaga Mela","Ramachandi Temple"], thingsToDoCount:12 },

  // ── Gujarat ───────────────────────────────────────────────────
  { id:54, name:"Rann of Kutch",   slug:"rann-of-kutch",state:"Gujarat", type:"Desert",   tags:["Desert","Culture"], description:"The world's largest salt desert turns white under the full moon during Rann Utsav. Wild ass sanctuary, flamingos, and Kutchi crafts.", tagline:"White Desert of India", imageUrl:"https://images.unsplash.com/photo-1567591370978-30cc8f236a4e?w=800&q=85", ecoRating:4.6, bestTime:"Nov–Feb (Rann Utsav)", latitude:23.7336, longitude:69.8597, altitude:"0–50m", temperature:"8–45°C", isHiddenGem:false, famousFor:["White Rann","Wild Ass Sanctuary","Kala Dungar","Bhuj Crafts"], thingsToDoCount:18 },
  { id:55, name:"Gir NP",          slug:"gir",          state:"Gujarat", type:"Wildlife", tags:["Forest","Wildlife"], description:"The last wild habitat of the Asiatic lion — 500+ lions live in this protected scrub forest, one of India's greatest conservation victories.", tagline:"Land of Asiatic Lions", imageUrl:"https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?w=800&q=80", ecoRating:4.8, bestTime:"Dec–May", latitude:21.1256, longitude:70.8049, altitude:"150–500m", temperature:"10–44°C", isHiddenGem:false, famousFor:["Lion Safari","Kamleshwar Dam","Gir Birding","Sasan Village Walk"], thingsToDoCount:14 },

  // ── Assam ─────────────────────────────────────────────────────
  { id:56, name:"Kaziranga NP",    slug:"kaziranga",    state:"Assam", type:"Wildlife",  tags:["Forest","Wildlife"], description:"UNESCO listed — home to the world's largest population of Indian one-horned rhinoceroses. Elephants, tigers, and wild water buffalo in Brahmaputra floodplains.", tagline:"Rhino Capital of the World", imageUrl:"https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=800&q=85", ecoRating:4.9, bestTime:"Nov–Apr", latitude:26.5775, longitude:93.1711, altitude:"40–80m", temperature:"8–36°C", isHiddenGem:false, famousFor:["Rhino Safari","Elephant Riding","Orchid Gardens","Brahmaputra River Cruise"], thingsToDoCount:16 },

  // ── Punjab ────────────────────────────────────────────────────
  { id:57, name:"Amritsar",        slug:"amritsar",     state:"Punjab", type:"Spiritual", tags:["Spiritual","Heritage","Culture"], description:"The Golden Temple — Sikhism's holiest shrine feeds 100,000 people daily in the world's largest free kitchen. The Wagah Border ceremony is unmissable.", tagline:"City of the Golden Temple", imageUrl:"https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=800&q=85", ecoRating:4.5, bestTime:"Oct–Mar", latitude:31.6340, longitude:74.8723, altitude:"234m", temperature:"2–42°C", isHiddenGem:false, famousFor:["Golden Temple","Jallianwala Bagh","Wagah Border Ceremony","Langar"], thingsToDoCount:18 },
  {
  id:58,
  name:"Amritsar",
  slug:"amritsar",
  state:"Punjab",
  type:"Heritage",
  tags:["Heritage","Spiritual","Culture"],
  description:"Home to the Golden Temple and the cultural heart of Punjab. A city rich in history, faith, and Punjabi hospitality.",
  tagline:"The Soul of Punjab",
  imageUrl:"https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=85",
  ecoRating:4.2,
  bestTime:"Oct–Mar",
  latitude:31.6340,
  longitude:74.8723,
  altitude:"234m",
  temperature:"5–42°C",
  isHiddenGem:false,
  famousFor:["Golden Temple","Jallianwala Bagh","Wagah Border","Punjabi Cuisine"],
  thingsToDoCount:18
},
{
  id:59,
  name:"Patiala",
  slug:"patiala",
  state:"Punjab",
  type:"Heritage",
  tags:["Palace","Culture","History"],
  description:"Known for royal palaces, rich Sikh history, and the famous Patiala peg.",
  tagline:"Royal Heritage of Punjab",
  imageUrl:"https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=85",
  ecoRating:4.0,
  bestTime:"Oct–Mar",
  latitude:30.3398,
  longitude:76.3869,
  altitude:"250m",
  temperature:"7–43°C",
  isHiddenGem:false,
  famousFor:["Qila Mubarak","Sheesh Mahal","Baradari Gardens"],
  thingsToDoCount:12
},
{
  id:60,
  name:"Anandpur Sahib",
  slug:"anandpur-sahib",
  state:"Punjab",
  type:"Spiritual",
  tags:["Temple","Heritage","Spiritual"],
  description:"One of Sikhism's most sacred cities and birthplace of the Khalsa.",
  tagline:"Land of the Khalsa",
  imageUrl:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=85",
  ecoRating:4.4,
  bestTime:"Oct–Mar",
  latitude:31.2390,
  longitude:76.5026,
  altitude:"320m",
  temperature:"8–40°C",
  isHiddenGem:false,
  famousFor:["Takht Sri Keshgarh Sahib","Hola Mohalla"],
  thingsToDoCount:10
},
{
  id:61,
  name:"Ludhiana",
  slug:"ludhiana",
  state:"Punjab",
  type:"City",
  tags:["Urban","Culture","Food"],
  description:"Punjab's largest city known for industry, food, and vibrant culture.",
  tagline:"Industrial Heart of Punjab",
  imageUrl:"https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=800&q=85",
  ecoRating:3.9,
  bestTime:"Oct–Mar",
  latitude:30.9009,
  longitude:75.8573,
  altitude:"244m",
  temperature:"6–43°C",
  isHiddenGem:false,
  famousFor:["Punjab Agricultural University","Nehru Rose Garden"],
  thingsToDoCount:11
},
{
  id:62,
  name:"Bathinda",
  slug:"bathinda",
  state:"Punjab",
  type:"Heritage",
  tags:["Fort","History"],
  description:"Historic city famous for Qila Mubarak and Punjab's rich heritage.",
  tagline:"City of Lakes and Forts",
  imageUrl:"https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&q=85",
  ecoRating:4.0,
  bestTime:"Oct–Mar",
  latitude:30.2110,
  longitude:74.9455,
  altitude:"211m",
  temperature:"5–44°C",
  isHiddenGem:false,
  famousFor:["Qila Mubarak","Rose Garden"],
  thingsToDoCount:9
},
{
  id:63,
  name:"Kapurthala",
  slug:"kapurthala",
  state:"Punjab",
  type:"Heritage",
  tags:["Palace","Architecture"],
  description:"Known as the Paris of Punjab for its French-inspired architecture.",
  tagline:"Paris of Punjab",
  imageUrl:"https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=85",
  ecoRating:4.1,
  bestTime:"Oct–Mar",
  latitude:31.3801,
  longitude:75.3810,
  altitude:"229m",
  temperature:"7–42°C",
  isHiddenGem:false,
  famousFor:["Jagatjit Palace","Moorish Mosque"],
  thingsToDoCount:8
},
{
  id:64,
  name:"Pathankot",
  slug:"pathankot",
  state:"Punjab",
  type:"Gateway",
  tags:["Nature","Hills"],
  description:"Gateway to Himachal Pradesh and Jammu with scenic surroundings.",
  tagline:"Gateway to the Himalayas",
  imageUrl:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=85",
  ecoRating:4.3,
  bestTime:"Oct–Apr",
  latitude:32.2643,
  longitude:75.6421,
  altitude:"332m",
  temperature:"5–38°C",
  isHiddenGem:false,
  famousFor:["Mukteshwar Temple","Ranjit Sagar Dam"],
  thingsToDoCount:10
},
{
  id:65,
  name:"Harike Wetland",
  slug:"harike-wetland",
  state:"Punjab",
  type:"Nature",
  tags:["Birding","Wetland","Wildlife"],
  description:"Largest wetland in North India and a paradise for birdwatchers.",
  tagline:"Birdwatcher's Paradise",
  imageUrl:"https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=85",
  ecoRating:4.8,
  bestTime:"Nov–Feb",
  latitude:31.1600,
  longitude:74.9300,
  altitude:"210m",
  temperature:"8–35°C",
  isHiddenGem:true,
  famousFor:["Migratory Birds","Wetland Safari"],
  thingsToDoCount:6
},

  // ── Arunachal Pradesh ─────────────────────────────────────────
  { id:66, name:"Tawang",          slug:"tawang",       state:"Arunachal Pradesh", type:"Mountain", tags:["Mountain","Spiritual","Hidden"], description:"India's largest monastery above 3,000m — Tawang Monastery overlooks a town near the Chinese border with Tibetan culture and Himalayan lakes.", tagline:"Hidden Himalayan Monastery Town", imageUrl:"https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=85", ecoRating:4.8, bestTime:"Mar–Oct", latitude:27.5860, longitude:91.8594, altitude:"3,048m", temperature:"-5–20°C", isHiddenGem:true, famousFor:["Tawang Monastery","Sela Pass","Madhuri Lake","Jung Waterfall"], thingsToDoCount:14 },

  // ── Nagaland ──────────────────────────────────────────────────
  { id:67, name:"Dzükou Valley",   slug:"dzukou",       state:"Nagaland", type:"Valley",   tags:["Valley","Forest","Hidden"], description:"A mystical valley on the Nagaland-Manipur border, blanketed in the rare Dzükou lily — accessible only by trekking and profoundly remote.", tagline:"Valley of Flowering Beauty", imageUrl:"https://images.unsplash.com/photo-1584507776049-b99a97f7b5f6?w=800&q=80", ecoRating:5.0, bestTime:"Jun–Sep", latitude:25.5800, longitude:94.1200, altitude:"2,452m", temperature:"5–18°C", isHiddenGem:true, famousFor:["Dzükou Lily Season","Summit Trek","Camping","Viswema Village"], thingsToDoCount:8 },
  { id:68, name:"Hornbill Festival HQ", slug:"kohima",  state:"Nagaland", type:"Culture",  tags:["Culture","Heritage"], description:"Kohima, site of WWII's 'Stalingrad of the East', now hosts the Hornbill Festival — the greatest tribal cultural festival in Northeast India.", tagline:"Land of Tribal Festivals", imageUrl:"https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?w=800&q=80", ecoRating:4.6, bestTime:"Nov–Mar", latitude:25.6751, longitude:94.1086, altitude:"1,444m", temperature:"4–24°C", isHiddenGem:false, famousFor:["Hornbill Festival","WWII Cemetery","Naga Heritage Village","Dzukou Valley Trek"], thingsToDoCount:14 },

  // haryana
  // ------------------------------------------------------
  {
  id:68,
  name:"Kurukshetra",
  slug:"kurukshetra",
  state:"Haryana",
  type:"Spiritual",
  tags:["History","Spiritual","Culture"],
  description:"The legendary battlefield of the Mahabharata and one of India's most sacred pilgrimage destinations.",
  tagline:"Land of the Bhagavad Gita",
  imageUrl:"https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=85",
  ecoRating:4.4,
  bestTime:"Oct–Mar",
  latitude:29.9695,
  longitude:76.8783,
  altitude:"260m",
  temperature:"5–42°C",
  isHiddenGem:false,
  famousFor:["Brahma Sarovar","Jyotisar","Krishna Museum"],
  thingsToDoCount:14
},
{
  id:69,
  name:"Pinjore",
  slug:"pinjore",
  state:"Haryana",
  type:"Garden",
  tags:["Garden","Nature","Family"],
  description:"Famous for the Mughal-style Yadavindra Gardens nestled at the foothills of the Himalayas.",
  tagline:"Historic Garden Retreat",
  imageUrl:"https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=85",
  ecoRating:4.5,
  bestTime:"Oct–Mar",
  latitude:30.7987,
  longitude:76.9184,
  altitude:"365m",
  temperature:"8–38°C",
  isHiddenGem:false,
  famousFor:["Yadavindra Gardens","Mini Zoo"],
  thingsToDoCount:8
},
{
  id:70,
  name:"Morni Hills",
  slug:"morni-hills",
  state:"Haryana",
  type:"Hill Station",
  tags:["Nature","Adventure","Hidden"],
  description:"The only hill station in Haryana surrounded by forests, lakes and hiking trails.",
  tagline:"Haryana's Hidden Hills",
  imageUrl:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=85",
  ecoRating:4.8,
  bestTime:"Sep–Apr",
  latitude:30.7750,
  longitude:77.0700,
  altitude:"1,220m",
  temperature:"5–25°C",
  isHiddenGem:true,
  famousFor:["Tikkar Taal","Trekking","Birdwatching"],
  thingsToDoCount:12
},
{
  id:71,
  name:"Sultanpur National Park",
  slug:"sultanpur-national-park",
  state:"Haryana",
  type:"Wildlife",
  tags:["Birding","Nature","Wildlife"],
  description:"A famous bird sanctuary attracting migratory birds from across the world.",
  tagline:"Bird Paradise Near Delhi",
  imageUrl:"https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&q=85",
  ecoRating:4.9,
  bestTime:"Nov–Feb",
  latitude:28.4600,
  longitude:76.8900,
  altitude:"220m",
  temperature:"8–35°C",
  isHiddenGem:false,
  famousFor:["Migratory Birds","Photography"],
  thingsToDoCount:7
},
{
  id:72,
  name:"Faridabad",
  slug:"faridabad",
  state:"Haryana",
  type:"City",
  tags:["Urban","Lake","Culture"],
  description:"A major NCR city with lakes, temples and weekend getaway attractions.",
  tagline:"Gateway to Haryana",
  imageUrl:"https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=800&q=85",
  ecoRating:3.9,
  bestTime:"Oct–Mar",
  latitude:28.4089,
  longitude:77.3178,
  altitude:"198m",
  temperature:"7–44°C",
  isHiddenGem:false,
  famousFor:["Surajkund","Badkhal Lake"],
  thingsToDoCount:10
},
{
  id:73,
  name:"Surajkund",
  slug:"surajkund",
  state:"Haryana",
  type:"Cultural",
  tags:["Festival","Culture","Crafts"],
  description:"Known worldwide for the Surajkund International Crafts Mela.",
  tagline:"India's Craft Capital",
  imageUrl:"https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=85",
  ecoRating:4.2,
  bestTime:"Feb",
  latitude:28.4910,
  longitude:77.2860,
  altitude:"210m",
  temperature:"10–32°C",
  isHiddenGem:false,
  famousFor:["Crafts Mela","Traditional Arts"],
  thingsToDoCount:6
},
{
  id:74,
  name:"Panchkula",
  slug:"panchkula",
  state:"Haryana",
  type:"Nature",
  tags:["Nature","Urban","Family"],
  description:"A green city known for parks, gardens and proximity to the Shivalik Hills.",
  tagline:"City of Gardens",
  imageUrl:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=85",
  ecoRating:4.3,
  bestTime:"Oct–Mar",
  latitude:30.6942,
  longitude:76.8606,
  altitude:"365m",
  temperature:"6–38°C",
  isHiddenGem:false,
  famousFor:["Cactus Garden","Morni Hills"],
  thingsToDoCount:9
},
{
  id:75,
  name:"Panipat",
  slug:"panipat",
  state:"Haryana",
  type:"Historical",
  tags:["History","Battlefield"],
  description:"Site of three famous battles that shaped Indian history.",
  tagline:"Battlefield of Empires",
  imageUrl:"https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=85",
  ecoRating:4.1,
  bestTime:"Oct–Mar",
  latitude:29.3909,
  longitude:76.9635,
  altitude:"219m",
  temperature:"5–43°C",
  isHiddenGem:false,
  famousFor:["Panipat Museum","Kabuli Bagh"],
  thingsToDoCount:8
},
{
  id:76,
  name:"Kalesar National Park",
  slug:"kalesar-national-park",
  state:"Haryana",
  type:"Wildlife",
  tags:["Forest","Wildlife","Adventure"],
  description:"Dense forest reserve near the Himalayan foothills rich in biodiversity.",
  tagline:"Haryana's Wild Frontier",
  imageUrl:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=85",
  ecoRating:4.9,
  bestTime:"Nov–Apr",
  latitude:30.3200,
  longitude:77.5400,
  altitude:"450m",
  temperature:"8–32°C",
  isHiddenGem:true,
  famousFor:["Leopards","Birdwatching","Forest Trails"],
  thingsToDoCount:10
},
{
  id:77,
  name:"Damdama Lake",
  slug:"damdama-lake",
  state:"Haryana",
  type:"Lake",
  tags:["Lake","Adventure","Nature"],
  description:"One of the largest natural lakes in Haryana popular for water activities.",
  tagline:"Adventure by the Lake",
  imageUrl:"https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=85",
  ecoRating:4.6,
  bestTime:"Oct–Mar",
  latitude:28.3100,
  longitude:77.1200,
  altitude:"220m",
  temperature:"8–38°C",
  isHiddenGem:false,
  famousFor:["Boating","Rock Climbing","Camping"],
  thingsToDoCount:11
}
];

// 28 States + 8 UTs
export const STATES = [
  { name:"Himachal Pradesh",         slug:"himachal-pradesh",        destinationCount:8,  imageUrl:"https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&q=80" },
  { name:"Uttarakhand",              slug:"uttarakhand",             destinationCount:7,  imageUrl:"https://images.unsplash.com/photo-1623141629340-6ebb660d3c6b?w=400&q=80" },
  { name:"Rajasthan",                slug:"rajasthan",               destinationCount:5,  imageUrl:"https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80" },
  { name:"Kerala",                   slug:"kerala",                  destinationCount:5,  imageUrl:"https://images.unsplash.com/photo-1584507776049-b99a97f7b5f6?w=400&q=80" },
  { name:"Ladakh",                   slug:"ladakh",                  destinationCount:4,  imageUrl:"https://images.unsplash.com/photo-1591016405280-f0e1e978e432?w=400&q=80" },
  { name:"Goa",                      slug:"goa",                     destinationCount:2,  imageUrl:"https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?w=400&q=80" },
  { name:"West Bengal",              slug:"west-bengal",             destinationCount:3,  imageUrl:"https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?w=400&q=80" },
  { name:"Tamil Nadu",               slug:"tamil-nadu",              destinationCount:3,  imageUrl:"https://images.unsplash.com/photo-1584507776049-b99a97f7b5f6?w=400&q=80" },
  { name:"Karnataka",                slug:"karnataka",               destinationCount:2,  imageUrl:"https://images.unsplash.com/photo-1542273917363-3b1817f69a5d?w=400&q=80" },
  { name:"Meghalaya",                slug:"meghalaya",               destinationCount:3,  imageUrl:"https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?w=400&q=80" },
  { name:"Sikkim",                   slug:"sikkim",                  destinationCount:2,  imageUrl:"https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=400&q=80" },
  { name:"Andaman & Nicobar Islands",slug:"andaman",                 destinationCount:1,  imageUrl:"https://images.unsplash.com/photo-1584507776049-b99a97f7b5f6?w=400&q=80" },
  { name:"Jammu & Kashmir",          slug:"jammu-kashmir",           destinationCount:2,  imageUrl:"https://images.unsplash.com/photo-1591016405280-f0e1e978e432?w=400&q=80" },
  { name:"Maharashtra",              slug:"maharashtra",             destinationCount:2,  imageUrl:"https://images.unsplash.com/photo-1542273917363-3b1817f69a5d?w=400&q=80" },
  { name:"Madhya Pradesh",           slug:"madhya-pradesh",          destinationCount:2,  imageUrl:"https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?w=400&q=80" },
  { name:"Odisha",                   slug:"odisha",                  destinationCount:2,  imageUrl:"https://images.unsplash.com/photo-1584507776049-b99a97f7b5f6?w=400&q=80" },
  { name:"Gujarat",                  slug:"gujarat",                 destinationCount:2,  imageUrl:"https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80" },
  { name:"Assam",                    slug:"assam",                   destinationCount:1,  imageUrl:"https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?w=400&q=80" },
  { name:"Punjab",                   slug:"punjab",                  destinationCount:1,  imageUrl:"https://images.unsplash.com/photo-1542273917363-3b1817f69a5d?w=400&q=80" },
  { name:"Arunachal Pradesh",        slug:"arunachal-pradesh",       destinationCount:1,  imageUrl:"https://images.unsplash.com/photo-1591016405280-f0e1e978e432?w=400&q=80" },
  { name:"Nagaland",                 slug:"nagaland",                destinationCount:2,  imageUrl:"https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?w=400&q=80" },
   { name:"Haryana",                 slug:"haryana",                destinationCount:2,  imageUrl:"https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?w=400&q=80" },
];

export const STAYS = [
  { id:1, name:"The Pine Whispers Sanctuary", destinationName:"Jibhi", destinationId:5, state:"Himachal Pradesh", environment:"Mountains", ecoRating:4.8, pricePerNight:4500, imageUrl:"https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=85", description:"A boutique wooden retreat perched above the Jibhi stream. Solar-powered, zero-waste, organic kitchen.", amenities:["Forest walks","Bonfire","Organic meals","Star gazing","Bird watching"], latitude:31.5313, longitude:77.4575 },
  { id:2, name:"River Nook Eco-Homestay", destinationName:"Tirthan", destinationId:7, state:"Himachal Pradesh", environment:"River", ecoRating:4.9, pricePerNight:3200, imageUrl:"https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=600&q=80", description:"A family-run riverside homestay with trout fishing, forest hikes, and homemade Himachali cuisine.", amenities:["Trout fishing","Guided hikes","Local cuisine","River view","Fire pit"], latitude:31.6118, longitude:77.5295 },
  { id:3, name:"Forest Bloom Camp", destinationName:"Chopta", destinationId:13, state:"Uttarakhand", environment:"Forest", ecoRating:4.7, pricePerNight:2800, imageUrl:"https://images.unsplash.com/photo-1623141629340-6ebb660d3c6b?w=800&q=85", description:"Solar-powered tented camp in the bugyals of Chopta, with panoramic Himalayan views and Tungnath trek access.", amenities:["Solar powered","Trekking","Yoga","Himalayan views","Bird watching"], latitude:30.5231, longitude:79.1989 },
  { id:4, name:"Silent Waters Backwater Retreat", destinationName:"Alleppey", destinationId:21, state:"Kerala", environment:"Backwaters", ecoRating:4.8, pricePerNight:5800, imageUrl:"https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800&q=85", description:"A floating sanctuary on Kerala's pristine backwaters, surrounded by coconut groves and paddy fields.", amenities:["Kayaking","Ayurveda","Bird watching","Organic farm","Yoga"], latitude:9.4981, longitude:76.3388 },
  { id:5, name:"Spiti Hermitage", destinationName:"Spiti Valley", destinationId:4, state:"Himachal Pradesh", environment:"Mountains", ecoRating:4.9, pricePerNight:3900, imageUrl:"https://images.unsplash.com/photo-1591016405280-f0e1e978e432?w=800&q=85", description:"A traditional stone-and-wood guesthouse at 4,500m, with monastery views and warm Spitian hospitality.", amenities:["Monastery visits","Star gazing","Local cuisine","Heritage architecture","Meditation"], latitude:32.2432, longitude:78.0346 },
  { id:6, name:"The Coffee Estate Bungalow", destinationName:"Coorg", destinationId:38, state:"Karnataka", environment:"Forest", ecoRating:4.5, pricePerNight:7200, imageUrl:"https://images.unsplash.com/photo-1580289018575-f2f2c47a72f8?w=800&q=85", description:"A colonial-era planter's bungalow within a working coffee estate, with plantation walks and coffee tastings.", amenities:["Plantation tour","Coffee tasting","Waterfall hike","Heritage property","Forest walks"], latitude:12.4244, longitude:75.7382 },
  { id:7, name:"Pangong Lakeside Camp", destinationName:"Pangong Lake", destinationId:27, state:"Ladakh", environment:"Mountains", ecoRating:4.7, pricePerNight:6500, imageUrl:"https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=800&q=85", description:"Glamping tents on the south bank of Pangong at 4,350m. Fall asleep to the colour shifts of the lake.", amenities:["Lake views","Star gazing","Yak Cheese","Sunrise Photography","Local Guide"], latitude:33.7597, longitude:78.6429 },
  { id:8, name:"Rann Utsav Tent City", destinationName:"Rann of Kutch", destinationId:54, state:"Gujarat", environment:"Desert", ecoRating:4.2, pricePerNight:8500, imageUrl:"https://images.unsplash.com/photo-1567591370978-30cc8f236a4e?w=800&q=85", description:"Luxury tented accommodation in the heart of the white salt desert — Rann Utsav cultural evenings included.", amenities:["Cultural Show","White Desert Walk","Camel Ride","Folk Music","Sunrise Walk"], latitude:23.7336, longitude:69.8597 },
];

export const STORIES = [
  { id:1, title:"Seven Days Without Wi-Fi in Jibhi", destination:"Himachal Pradesh", authorName:"Priya Kapoor", authorAvatar:"https://i.pravatar.cc/150?u=priya", imageUrl:"https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80", excerpt:"I arrived in Jibhi with two weeks of notifications and left with nothing but the sound of the river.", content:"The bus from Aut to Jibhi winds through a valley so green it seems painted. I arrived just before sunset, when the deodar trees catch fire in the last light. My phone had no signal. For the first time in years, I felt my shoulders drop.\n\nThe homestay was run by an elderly couple whose warmth required no translation. Dinner was rajma and rice cooked on wood fire, served with pickled vegetables from their garden. I ate more than I had in weeks.\n\nEach day followed a gentle rhythm: wake with the birds, walk along the stream, sit in silence watching the fog lift from the mountains. By day four, I had stopped thinking about emails entirely.\n\nOn day seven, packing to leave, I realized I hadn't checked the news once. I didn't feel uninformed. I felt restored.", likes:124, isFeatured:true, tags:["forest","silent","solo","detox"], createdAt:"2024-10-12T00:00:00Z" },
  { id:2, title:"The Last Train to the Hills", destination:"Uttarakhand", authorName:"Rahul Sharma", authorAvatar:"https://i.pravatar.cc/150?u=rahul", imageUrl:"https://images.unsplash.com/photo-1623141629340-6ebb660d3c6b?w=800&q=80", excerpt:"A slow journey by rail that taught me the art of arriving without hurrying.", content:"I took the Ranikhet Express on a Tuesday evening, watching the plains give way to foothills through a dusty window. By the time we hit Kathgodam, the air had changed completely.\n\nThere was something about the slowness of a mountain train that forced a different kind of presence. No playlist felt appropriate. I just watched.", likes:89, isFeatured:false, tags:["train","uttarakhand","solo"], createdAt:"2024-09-04T00:00:00Z" },
  { id:3, title:"A Week in the Spiti Desert", destination:"Ladakh", authorName:"Meera Nair", authorAvatar:"https://i.pravatar.cc/150?u=meera", imageUrl:"https://images.unsplash.com/photo-1591016405280-f0e1e978e432?w=800&q=80", excerpt:"High altitude, low oxygen, and an overwhelming sense of being exactly where I was supposed to be.", content:"The altitude hit me on day one. By day three, I was drinking barley soup and watching monks debate in the monastery courtyard. By the end of the week, the barrenness felt like the most beautiful thing I had ever seen.", likes:201, isFeatured:false, tags:["spiti","altitude","monastery","solo"], createdAt:"2024-08-20T00:00:00Z" },
  { id:4, title:"Monsoon Magic in Wayanad", destination:"Kerala", authorName:"Aditya Rao", authorAvatar:"https://i.pravatar.cc/150?u=aditya", imageUrl:"https://images.unsplash.com/photo-1584507776049-b99a97f7b5f6?w=800&q=80", excerpt:"Everyone said don't go in monsoon. Everyone was wrong.", content:"The rain in Wayanad is a different kind of rain. It falls in curtains through the tea estates, it hisses through bamboo groves, and it turns the paths into mirrors reflecting the grey sky above.\n\nI came for the wildlife sanctuary but stayed for the sound of water against the plantation leaves at 3am.", likes:167, isFeatured:false, tags:["monsoon","kerala","wildlife","couple"], createdAt:"2024-07-15T00:00:00Z" },
];

export const BOOKINGS = [
  { id:1, stayName:"The Pine Whispers Sanctuary", destinationName:"Jibhi, Himachal Pradesh", checkIn:"2024-10-14", checkOut:"2024-10-18", guests:2, totalAmount:19600, status:"upcoming" as const, imageUrl:"https://images.unsplash.com/photo-1542314831-c6a4d14272ce?w=400&q=80" },
  { id:2, stayName:"River Nook Eco-Homestay", destinationName:"Tirthan, Himachal Pradesh", checkIn:"2024-12-22", checkOut:"2024-12-27", guests:2, totalAmount:16000, status:"upcoming" as const, imageUrl:"https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=400&q=80" },
  { id:3, stayName:"Forest Bloom Camp", destinationName:"Chopta, Uttarakhand", checkIn:"2024-05-10", checkOut:"2024-05-14", guests:2, totalAmount:11200, status:"completed" as const, imageUrl:"https://images.unsplash.com/photo-1623141629340-6ebb660d3c6b?w=400&q=80" },
  { id:4, stayName:"Silent Waters Retreat", destinationName:"Alleppey, Kerala", checkIn:"2024-02-03", checkOut:"2024-02-06", guests:2, totalAmount:17400, status:"completed" as const, imageUrl:"https://images.unsplash.com/photo-1584507776049-b99a97f7b5f6?w=400&q=80" },
];

export const PROFILE = {
  id:1, name:"Arjun Mehta", email:"arjun.mehta@example.com",
  bio:"A lover of pine forests and cold mountain streams. Searching for the soul of India one trail at a time.",
  location:"Delhi, India", avatarUrl:"https://i.pravatar.cc/150?u=arjun",
  bookmarkedDestinations:[1, 4, 23],
};

// ── Travel Data ──────────────────────────────────────────────────
// Replace these with real API calls to IRCTC, MakeMyTrip, Redbus APIs
// API Key config: add your keys to .env as VITE_IRCTC_API_KEY, VITE_MMT_API_KEY etc.

export const MAJOR_CITIES = [
  "Delhi","Mumbai","Kolkata","Chennai","Bangalore","Hyderabad","Ahmedabad","Pune",
  "Chandigarh","Jaipur","Lucknow","Bhopal","Patna","Bhubaneswar","Guwahati",
  "Dehradun","Shimla","Srinagar","Leh","Amritsar","Kochi","Coimbatore","Mysore",
  "Varanasi","Agra","Jodhpur","Udaipur","Jodhpur","Manali","Kasol","Rishikesh",
];

// Realistic train data for popular hill routes
export const TRAINS = [
  { id:"t1", trainName:"Kalka Shatabdi", trainNumber:"12005", from:"Delhi (NDLS)", to:"Kalka", departure:"07:40", arrival:"11:50", duration:"4h 10m", availableSeats:62, runningDays:"Daily", classes:[{name:"CC",price:695,available:true},{name:"EC",price:1290,available:true}] },
  { id:"t2", trainName:"Himalayan Queen", trainNumber:"14095", from:"Delhi (NDLS)", to:"Kalka", departure:"06:00", arrival:"11:05", duration:"5h 5m", availableSeats:32, runningDays:"Daily", classes:[{name:"SL",price:235,available:true},{name:"3A",price:605,available:true},{name:"2A",price:875,available:false},{name:"1A",price:1490,available:true}] },
  { id:"t3", trainName:"Nanda Devi Express", trainNumber:"12205", from:"Delhi (NDLS)", to:"Dehradun", departure:"23:00", arrival:"05:25", duration:"6h 25m", availableSeats:18, runningDays:"Daily", classes:[{name:"SL",price:265,available:true},{name:"3A",price:690,available:true},{name:"2A",price:995,available:true},{name:"1A",price:1680,available:false}] },
  { id:"t4", trainName:"Jan Shatabdi Express", trainNumber:"12055", from:"Delhi (NDLS)", to:"Dehradun", departure:"06:15", arrival:"11:30", duration:"5h 15m", availableSeats:44, runningDays:"Daily", classes:[{name:"CC",price:545,available:true},{name:"2S",price:185,available:true}] },
  { id:"t5", trainName:"Ranikhet Express", trainNumber:"15013", from:"Delhi (NDLS)", to:"Kathgodam", departure:"22:30", arrival:"05:45", duration:"7h 15m", availableSeats:8, runningDays:"Daily", classes:[{name:"SL",price:250,available:true},{name:"3A",price:650,available:false},{name:"2A",price:940,available:true}] },
  { id:"t6", trainName:"Mandovi Express", trainNumber:"10103", from:"Mumbai (CSTM)", to:"Goa (MAO)", departure:"07:10", arrival:"19:05", duration:"11h 55m", availableSeats:55, runningDays:"Daily", classes:[{name:"SL",price:340,available:true},{name:"3A",price:895,available:true},{name:"2A",price:1290,available:true}] },
  { id:"t7", trainName:"Rajdhani Express", trainNumber:"12431", from:"Delhi (NDLS)", to:"Trivandrum (TVC)", departure:"11:00", arrival:"13:30+2", duration:"50h 30m", availableSeats:22, runningDays:"Tue,Thu,Sat", classes:[{name:"3A",price:2100,available:true},{name:"2A",price:2980,available:true},{name:"1A",price:4950,available:false}] },
];

export const FLIGHTS = [
  { id:"f1", airline:"IndiGo", flightNumber:"6E-2345", from:"Delhi (DEL)", to:"Bhuntar/Kullu (KUU)", departure:"08:15", arrival:"09:35", duration:"1h 20m", price:4850, availableSeats:6, stops:0, aircraft:"ATR 72" },
  { id:"f2", airline:"Air India", flightNumber:"AI-448", from:"Delhi (DEL)", to:"Dehradun (DED)", departure:"07:30", arrival:"08:30", duration:"1h 0m", price:3990, availableSeats:12, stops:0, aircraft:"A320" },
  { id:"f3", airline:"SpiceJet", flightNumber:"SG-127", from:"Mumbai (BOM)", to:"Srinagar (SXR)", departure:"06:50", arrival:"09:10", duration:"2h 20m", price:5650, availableSeats:9, stops:0, aircraft:"B737" },
  { id:"f4", airline:"Air India Regional", flightNumber:"IX-554", from:"Chandigarh (IXC)", to:"Leh (IXL)", departure:"07:00", arrival:"08:15", duration:"1h 15m", price:7200, availableSeats:4, stops:0, aircraft:"ATR 72" },
  { id:"f5", airline:"IndiGo", flightNumber:"6E-911", from:"Delhi (DEL)", to:"Leh (IXL)", departure:"06:00", arrival:"07:30", duration:"1h 30m", price:6400, availableSeats:14, stops:0, aircraft:"A320" },
  { id:"f6", airline:"Vistara", flightNumber:"UK-843", from:"Mumbai (BOM)", to:"Kochi (COK)", departure:"10:10", arrival:"12:25", duration:"2h 15m", price:4200, availableSeats:22, stops:0, aircraft:"A320neo" },
  { id:"f7", airline:"Air India", flightNumber:"AI-677", from:"Delhi (DEL)", to:"Bagdogra/Siliguri (IXB)", departure:"09:45", arrival:"12:05", duration:"2h 20m", price:4650, availableSeats:18, stops:0, aircraft:"B737" },
];

export const BUSES = [
  { id:"b1", busName:"HRTC Volvo AC", busType:"AC Sleeper", operator:"HRTC (Govt)", from:"Delhi (ISBT Kashmiri Gate)", to:"Manali", departure:"17:30", arrival:"07:00", duration:"13h 30m", price:1450, availableSeats:14, amenities:["AC","Blanket","Water Bottle","USB Charging","GPS Tracked"] },
  { id:"b2", busName:"HRTC Volvo Bhuntar", busType:"AC Seater", operator:"HRTC (Govt)", from:"Delhi (ISBT Kashmiri Gate)", to:"Bhuntar (for Kasol)", departure:"20:00", arrival:"08:30", duration:"12h 30m", price:1100, availableSeats:22, amenities:["AC","USB Charging","GPS Tracked"] },
  { id:"b3", busName:"GMOU Volvo", busType:"AC Sleeper", operator:"GMOU (Govt)", from:"Delhi (ISBT Kashmiri Gate)", to:"Dehradun", departure:"22:00", arrival:"05:30", duration:"7h 30m", price:680, availableSeats:8, amenities:["AC","Blanket","USB Charging"] },
  { id:"b4", busName:"RSRTC Volvo Gold", busType:"AC Semi-Sleeper", operator:"RSRTC (Govt)", from:"Delhi (Sarai Kale Khan)", to:"Jaipur", departure:"06:00", arrival:"11:00", duration:"5h 0m", price:520, availableSeats:31, amenities:["AC","Water","Snacks","WiFi","USB Charging"] },
  { id:"b5", busName:"Karnataka Sarige", busType:"AC Sleeper", operator:"KSRTC (Govt)", from:"Bangalore", to:"Coorg (Madikeri)", departure:"21:30", arrival:"04:30", duration:"7h 0m", price:750, availableSeats:16, amenities:["AC","Blanket","GPS Tracked"] },
  { id:"b6", busName:"Kerala SRTC Superfast", busType:"AC Seater", operator:"KSRTC Kerala (Govt)", from:"Kochi", to:"Munnar", departure:"07:30", arrival:"11:00", duration:"3h 30m", price:310, availableSeats:28, amenities:["AC","Scenic Route"] },
  { id:"b7", busName:"Zingbus Premium", busType:"AC Sleeper", operator:"Zingbus", from:"Delhi", to:"Rishikesh", departure:"22:30", arrival:"05:30", duration:"7h 0m", price:599, availableSeats:6, amenities:["AC","Blanket","USB Charging","Pillow","WiFi","GPS Tracked"] },
];
