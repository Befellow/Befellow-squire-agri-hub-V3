import { useState, useMemo, useEffect } from "react";

// ─── BRAND TOKENS ────────────────────────────────────────────────
const C = {
  maroon: "#6B1E3F", maroonDark: "#4A1229",
  gold: "#C4973A", goldLight: "#E8B85A",
  green: "#2D6A4F", greenLight: "#52B788", greenPale: "#D8F3DC",
  soil: "#8B6914", soilLight: "#F4EBD0",
  cream: "#FDFAF5", charcoal: "#1A1A1A", muted: "#6B7280",
  border: "#E5E0D8", white: "#FFFFFF",
  red: "#C0392B", orange: "#E67E22", blue: "#2980B9",
};

// ─── STATIC DATA ─────────────────────────────────────────────────
const INITIAL_FARMERS = [
  { id: "F001", name: "Ramesh Yadav", village: "Mataundh", district: "Hamirpur", land: 1.5, soilType: "Sandy Loam", nitrogen: 180, phosphorus: 28, potassium: 210, soc: 0.38, waterAvail: "Borewell (seasonal)", cropHistory: "Wheat, Wheat, Wheat", economicProfile: "Marginal (<1ha)", status: "Plan Generated", planGenerated: true, produce: [{ id: "P001", crop: "Mustard", qty: 180, stage: "Cold Storage", buyer: "Mandi Sell", qrGenerated: true, harvestDate: "2026-03-10" }], plan: null },
  { id: "F002", name: "Sita Devi", village: "Jhansi", district: "Jhansi", land: 0.8, soilType: "Clay", nitrogen: 140, phosphorus: 18, potassium: 185, soc: 0.21, waterAvail: "Rainfed only", cropHistory: "Paddy, Paddy, Wheat", economicProfile: "Marginal (<1ha)", status: "Soil Assessed", planGenerated: false, produce: [], plan: null },
  { id: "F003", name: "Mohan Patel", village: "Banda", district: "Banda", land: 2.2, soilType: "Clay Loam", nitrogen: 210, phosphorus: 35, potassium: 240, soc: 0.52, waterAvail: "Canal irrigation", cropHistory: "Gram, Wheat, Mustard", economicProfile: "Small (1–2ha)", status: "Plan Generated", planGenerated: true, produce: [{ id: "P002", crop: "Gram", qty: 320, stage: "Buyer Matched", buyer: "B2B Buyer", qrGenerated: true, harvestDate: "2026-02-18" }, { id: "P003", crop: "Wheat", qty: 410, stage: "Sold", buyer: "Mandi Sell", qrGenerated: true, harvestDate: "2026-04-02" }], plan: null },
];

const INITIAL_RENTALS = [
  { id: "R001", farmerId: "F001", farmerName: "Ramesh Yadav", equipment: "Multi-crop Seeder", startDate: "2026-06-20", endDate: "2026-06-22", hours: 6, ratePerHour: 180, status: "Confirmed", totalCost: 1080 },
  { id: "R002", farmerId: "F003", farmerName: "Mohan Patel", equipment: "Soil Sensor Kit", startDate: "2026-06-18", endDate: "2026-06-18", hours: 2, ratePerHour: 250, status: "Completed", totalCost: 500 },
];

const EQUIPMENT_LIST = [
  { name: "Multi-crop Seeder", icon: "🌱", ratePerHour: 180, available: true, desc: "Precision multi-crop seeder for row sowing" },
  { name: "Rotavator", icon: "⚙️", ratePerHour: 220, available: true, desc: "Deep soil tillage and seedbed preparation" },
  { name: "Soil Sensor Kit", icon: "🔬", ratePerHour: 250, available: false, desc: "NPK + SOC field sensor with digital readout" },
  { name: "Mini Tractor (25HP)", icon: "🚜", ratePerHour: 350, available: true, desc: "Compact tractor for smallholder fields" },
  { name: "Drip Irrigation Set", icon: "💧", ratePerHour: 120, available: true, desc: "2-acre drip irrigation setup with timer" },
  { name: "Drone Sprayer", icon: "🚁", ratePerHour: 480, available: false, desc: "Agricultural drone for precision spray" },
  { name: "Thresher (Portable)", icon: "🌾", ratePerHour: 200, available: true, desc: "Portable grain thresher for post-harvest" },
  { name: "Bio-Shredder", icon: "♻️", ratePerHour: 150, available: true, desc: "Organic matter shredder for compost making" },
];

const CROP_OPTIONS = {
  "High Profit / Cash Engines": [
    "Baby Corn", "Banana", "Button Mushroom", "Carnation", "Cherry Tomato", 
    "Coloured Capsicum", "Dragon Fruit", "Gerbera", "Gladiolus", "Guava", 
    "Lilium", "Lettuce", "Mango", "Milky Mushroom", "Oyster Mushroom", 
    "Orchid", "Papaya", "Pomegranate", "Potato", "Stevia", "Strawberry", 
    "Sugarcane", "Sweet Corn", "Tuberose"
  ],
  "Market Stability & Core Grains": [
    "Barley", "Brinjal", "Cabbage", "Capsicum", "Cauliflower", "Chilli", 
    "Coriander", "Cucumber", "Garlic", "Groundnut", "Ginger", "Maize", 
    "Mustard", "Onion", "Oats", "Oat", "Paddy", "Pumpkin", "Radish", 
    "Rapeseed", "Sunflower", "Tomato", "Turmeric", "Turnip", "Wheat"
  ],
  "Restorative & Low-Water (Soil Builders)": [
    "Amaranthus", "Arhar (Pigeon Pea)", "Ash Gourd", "Bajra", "Berseem", 
    "Bitter Gourd", "Black Gram", "Bottle Gourd", "Broccoli", "Chickpea", 
    "Cluster Bean", "Colocasia", "Cowpea", "Elephant Foot Yam", "Fenugreek", 
    "Field Pea", "French Bean", "Green Gram", "Guinea Grass", "Knol Khol", 
    "Lathyrus", "Lentil", "Lucerne", "Moringa", "Napier Grass", "Okra", 
    "Paddy Straw Mushroom", "Pea", "Pearl Millet", "Pointed Gourd", 
    "Ridge Gourd", "Sorghum", "Soybean", "Spinach", "Sponge Gourd", 
    "Sweet Potato", "Watermelon"
  ],
  "Aromatic, Medicinal & Forestry Assets": [
    "Ajwain", "Aloe Vera", "Aonla", "Arjun", "Ashwagandha", "Babul", 
    "Bamboo", "Bael", "Ber", "Brahmi", "Calendula", "Castor", 
    "Chrysanthemum", "Citronella", "Crossandra", "Cumin", "Dahlia", 
    "Dill", "Custard Apple", "Eucalyptus", "Fennel", "Fig", "Gaillardia", 
    "Gmelina", "Isabgol", "Jackfruit", "Jasmine", "Jatropha", "Kadam", 
    "Kalmegh", "Kalonji", "Karanj", "Karonda", "Lemon", "Lemongrass", 
    "Linseed", "Melia dubia", "Mentha", "Mulberry", "Muskmelon", 
    "Neem", "Orange", "Palmarosa", "Petunia", "Phalsa", "Poplar", 
    "Rose", "Safed Musli", "Senna", "Sesame", "Shisham", "Sweet Lime", 
    "Sweet Sorghum", "Teak", "Tobacco (limited)", "Tulsi", "Zinnia"
  ]
};
const SOIL_TYPES = ["Sandy Loam","Clay Loam","Red Laterite","Black Cotton","Sandy","Clay","Silty Loam"];
const WATER_OPTIONS = ["Canal irrigation","Borewell (seasonal)","Borewell (perennial)","Rainfed only","Check dam nearby","Drip irrigation"];
const DISTRICTS = ["Hamirpur","Jhansi","Banda","Mahoba","Lalitpur","Chitrakoot","Kanpur Dehat","Kanpur Nagar"];
const ECO_PROFILES = ["Marginal (<1ha)","Small (1–2ha)","Semi-medium (2–4ha)","Medium (4–10ha)"];
const PRODUCE_STAGES = ["Harvested","Cold Storage","Buyer Matched","Dispatched","Sold"];
const BUYER_TYPES = ["Mandi Sell","B2B Buyer","B2C Premium","FPO Aggregation","Cold Storage Hold"];
const MANDI_PER_KG = {
  // --- Market Stability & Core Grains ---
  "Wheat": 22.75, "Paddy": 23.00, "Mustard": 56.50, "Gram": 54.40, "Barley": 21.00,
  "Maize": 20.90, "Oats": 24.00, "Oat": 24.00, "Rapeseed": 52.00, "Sunflower": 67.60,
  "Groundnut": 65.00, "Soybean": 46.00, "Onion": 25.00, "Garlic": 110.00, "Ginger": 90.00,
  "Turmeric": 85.00, "Coriander": 75.00, "Chilli": 45.00, "Tomato": 28.00, "Brinjal": 18.00,
  "Cabbage": 16.00, "Cauliflower": 22.00, "Capsicum": 45.00, "Cucumber": 20.00, "Turnip": 15.00,
  "Radish": 12.00, "Pumpkin": 14.00,

  // --- High Profit / Cash Engines ---
  "Sugarcane": 3.40, "Potato": 18.00, "Sweet Corn": 25.00, "Baby Corn": 45.00,
  "Mango": 45.00, "Guava": 35.00, "Banana": 16.00, "Papaya": 22.00, "Pomegranate": 95.00,
  "Dragon Fruit": 160.00, "Strawberry": 180.00, "Stevia": 120.00, "Lettuce": 60.00,
  "Button Mushroom": 140.00, "Milky Mushroom": 120.00, "Oyster Mushroom": 150.00,
  "Orchid": 250.00, "Carnation": 180.00, "Lilium": 300.00, "Gerbera": 140.00,
  "Gladiolus": 120.00, "Tuberose": 130.00, "Cherry Tomato": 80.00, "Coloured Capsicum": 90.00,

  // --- Restorative & Low-Water (Soil Builders) ---
  "Arhar (Pigeon Pea)": 70.00, "Lentil": 60.00, "Green Gram": 72.00, "Black Gram": 68.00,
  "Chickpea": 54.40, "Field Pea": 42.00, "Cowpea": 38.00, "Lathyrus": 35.00,
  "Pearl Millet": 22.00, "Bajra": 22.00, "Sorghum": 24.00, "Amaranthus": 45.00,
  "Moringa": 35.00, "Broccoli": 50.00, "Knol Khol": 25.00, "Spinach": 15.00,
  "Okra": 24.00, "Fenugreek": 35.00, "French Bean": 40.00, "Cluster Bean": 28.00,
  "Pea": 32.00, "Ash Gourd": 14.00, "Bottle Gourd": 12.00, "Bitter Gourd": 26.00,
  "Ridge Gourd": 20.00, "Sponge Gourd": 18.00, "Watermelon": 15.00, "Sweet Potato": 22.00,
  "Elephant Foot Yam": 35.00, "Colocasia": 25.00, "Berseem": 4.50, "Lucerne": 5.50,
  "Guinea Grass": 3.50, "Napier Grass": 3.20, "Paddy Straw Mushroom": 110.00,

  // --- Aromatic, Medicinal & Forestry Assets ---
  "Mentha": 950.00, "Lemongrass": 140.00, "Citronella": 135.00, "Palmarosa": 160.00,
  "Ashwagandha": 280.00, "Tulsi": 45.00, "Aloe Vera": 12.00, "Safed Musli": 850.00,
  "Kalmegh": 65.00, "Isabgol": 125.00, "Senna": 55.00, "Brahmi": 40.00,
  "Fennel": 95.00, "Cumin": 190.00, "Ajwain": 115.00, "Dill": 70.00, "Kalonji": 140.00,
  "Rose": 80.00, "Jasmine": 120.00, "Chrysanthemum": 70.00, "Marigold": 35.00,
  "Crossandra": 150.00, "Gaillardia": 40.00, "Dahlia": 50.00, "Petunia": 45.00,
  "Calendula": 40.00, "Zinnia": 35.00, "Aonla": 28.00, "Ber": 20.00, "Jackfruit": 18.00,
  "Mulberry": 45.00, "Jamun": 60.00, "Custard Apple": 50.00, "Fig": 80.00, "Bael": 15.00,
  "Karonda": 30.00, "Phalsa": 70.00, "Teak": 45.00, "Poplar": 8.50, "Eucalyptus": 7.00,
  "Subabul": 4.00, "Melia dubia": 6.50, "Shisham": 35.00, "Neem": 12.00, "Arjun": 10.00,
  "Bamboo": 8.00, "Karanj": 14.00, "Babul": 9.00, "Gmelina": 18.00, "Kadam": 7.50,
  "Jatropha": 15.00, "Sweet Sorghum": 4.50, "Tobacco (limited)": 45.00
};

// ─── AI CROP PLAN — calls /api/gemini (Vercel backend) ───────────
function projectFiveYearBaseline(farmer) {
  const landAcres = parseFloat((farmer.land * 2.47).toFixed(2)) || 1;
  const capitalAccess = { "Marginal (<1ha)":0.7, "Small (1–2ha)":0.85, "Semi-medium (2–4ha)":1.0, "Medium (4–10ha)":1.15 }[farmer.economicProfile] || 0.8;
  const profitRows = calcProfit(farmer);
  const baseGross = profitRows.reduce((a,r)=>a+r.grossRev,0) || Math.round(18000*landAcres);
  const baseA2 = profitRows.reduce((a,r)=>a+r.inputCost,0) || Math.round(9000*landAcres);

  let soc = Math.max(farmer.soc, 0.15);
  const schedule = [
    { yr:1, yieldMult: soc<0.40?0.75:0.90, chemMult:1.00, socStep:0.05 },
    { yr:2, yieldMult:0.92, chemMult:0.85, socStep:0.13 },
    { yr:3, yieldMult:1.12, chemMult:0.80, socStep:0.14 },
    { yr:4, yieldMult:1.16, chemMult:0.78, socStep:0.12 },
    { yr:5, yieldMult:1.22, chemMult:0.74, socStep:0.10 },
  ];
  return schedule.map(s=>{
    soc = parseFloat(Math.min(soc+s.socStep,1.6).toFixed(2));
    const grossRealization = Math.round(baseGross*s.yieldMult);
    const a2Cost = Math.round(baseA2*s.chemMult);
    const flCost = Math.round(22*landAcres*320*capitalAccess);
    const imputedLandRent = Math.round(6500*landAcres);
    const interestFixedCapital = Math.round(28000*landAcres*0.09);
    const c2 = a2Cost+flCost+imputedLandRent+interestFixedCapital;
    const netProfit = grossRealization-c2;
    const cushionRatio = c2>0?parseFloat((netProfit/c2).toFixed(2)):0;
    return { yr:s.yr, soc, grossRealization, c2, netProfit, cushionRatio, gatePassed: cushionRatio>=1.5 };
  });
}

// Computes A2 / A2+FL / C2 / C2+50% target / realized-price gap for one crop,
// per the Swaminathan Commission cost layers — used by Part D of the
// Restorative Farming Plan. Same cost constants as projectFiveYearBaseline,
// kept self-contained here.
function computeC2Economics(crop, farmer) {
  const landAcres = farmer.land * 2.47;
  const waterMult = WATER_YIELD_MULT[farmer.waterAvail] || 0.7;
  const socMult = farmer.soc < 0.3 ? 0.65 : farmer.soc < 0.5 ? 0.82 : 1.0;
  const yieldQtl = getBaseYield(crop) * waterMult * socMult * farmer.land;
  const priceQtl = getMandiPricePerQtl(crop);
  const grossRev = Math.round(yieldQtl * priceQtl);
  const a2 = Math.round(grossRev * 0.42); // out-of-pocket: seed, fert, pesticide, hired labour, fuel, irrigation
  const capitalAccess = { "Marginal (<1ha)":0.7, "Small (1–2ha)":0.85, "Semi-medium (2–4ha)":1.0, "Medium (4–10ha)":1.15 }[farmer.economicProfile] || 0.8;
  const flCost = Math.round(22 * landAcres * 320 * capitalAccess); // imputed unpaid family labour
  const a2fl = a2 + flCost;
  const landRent = Math.round(6500 * landAcres); // imputed rent on owned land
  const interest = Math.round(28000 * landAcres * 0.09); // imputed interest on owned capital/fixed assets
  const c2 = a2fl + landRent + interest;
  const c2Target = Math.round(c2 * 1.5); // Swaminathan C2+50%
  const gap = grossRev - c2Target;
  const gapPct = c2Target > 0 ? parseFloat(((gap / c2Target) * 100).toFixed(1)) : 0;
  return { crop, yieldQtl: parseFloat(yieldQtl.toFixed(1)), priceQtl, grossRev, a2, flCost, a2fl, landRent, interest, c2, c2Target, gap, gapPct, clearsGate: gap >= 0 };
}

// Ranks a crop pool by projected Swaminathan cushion (net / C2-style input cost),
// using the exact same Mandi-synced getBaseYield/getMandiPricePerQtl resolvers
// used everywhere else — no invented numbers, no AI involvement.
function rankCropCandidates(pool, farmer, exclude=[]) {
  const waterMult = WATER_YIELD_MULT[farmer.waterAvail] || 0.7;
  const socMult = farmer.soc<0.3?0.65:farmer.soc<0.5?0.82:1.0;
  return pool.filter(c=>!exclude.includes(c)).map(crop=>{
    const yld = getBaseYield(crop)*waterMult*socMult*farmer.land;
    const price = getMandiPricePerQtl(crop);
    const gross = yld*price;
    const cost = gross*0.42;
    const net = gross-cost;
    return { crop, cushion: cost>0?net/cost:0, net:Math.round(net) };
  }).sort((a,b)=>b.cushion-a.cushion);
}

const LEGUME_POOL = ["Green Gram", "Black Gram", "Chickpea", "Arhar (Pigeon Pea)", "Lentil", "Field Pea", "Cowpea"];

// Builds the complete 10-Part Restorative & Profitable Farming Plan
// (Bundelkhand/Central UP format) entirely from deterministic math — the AI
// never touches crop selection, cost figures, phase logic, or the weather/pest
// matrices. This feeds both the legacy Inputs Tab / Econometric Terminal
// fields AND the new partA..partJ structure rendered in tab==="plan".
function buildDeterministicBlueprint(farmer) {
  const drs = calcDRS(farmer);
  const pest = calcPest(farmer);
  const weather = calcWeather(farmer);
  const lastCrop = (farmer.cropHistory || "Wheat").split(",").map(c=>c.trim()).pop();
  const cropHistoryArr = (farmer.cropHistory || "Wheat").split(",").map(c=>c.trim());
  const uniqueCropCount = new Set(cropHistoryArr).size;
  const constrainedWater = ["Rainfed only","Borewell (seasonal)"].includes(farmer.waterAvail);
  const landAcres = parseFloat((farmer.land * 2.47).toFixed(2));

  const staplePool = CROP_OPTIONS["Market Stability & Core Grains"];
  const restorativePool = CROP_OPTIONS["Restorative & Low-Water (Soil Builders)"];
  const aromaticPool = CROP_OPTIONS["Aromatic, Medicinal & Forestry Assets"];
  const highValuePool = CROP_OPTIONS["High Profit / Cash Engines"];

  // ── PART C selection: Floor Crop (MSP-linked staple) → Legume (N-fixing) → Growth Crop (value-linked) ──
  const floorRanked = rankCropCandidates(staplePool, farmer, [lastCrop]);
  const floorCrop = floorRanked[0] || { crop: lastCrop, net: 0 };
  const legumeRanked = rankCropCandidates(LEGUME_POOL, farmer, [lastCrop, floorCrop.crop]);
  const legumeCrop = legumeRanked[0] || { crop: "Green Gram", net: 0 };
  const growthRanked = rankCropCandidates(highValuePool, farmer, [lastCrop, floorCrop.crop, legumeCrop.crop]);
  const aromaticRanked = rankCropCandidates(aromaticPool, farmer, [lastCrop, floorCrop.crop, legumeCrop.crop]);
  const growthCrop = (constrainedWater && aromaticRanked[0] && aromaticRanked[0].cushion > (growthRanked[0]?.cushion||0))
    ? aromaticRanked[0] : (growthRanked[0] || legumeRanked[1] || legumeCrop);

  const restorativeRanked = rankCropCandidates(restorativePool, farmer, [lastCrop, floorCrop.crop]);
  const usedSoFar = [lastCrop, floorCrop.crop, legumeCrop.crop, growthCrop.crop].filter(Boolean);
  const year3Pool = [...restorativeRanked, ...rankCropCandidates(highValuePool, farmer, usedSoFar)].sort((a,b)=>b.cushion-a.cushion).slice(0,3).map(x=>x.crop);
  const year5Pool = [...rankCropCandidates(highValuePool, farmer, usedSoFar), ...aromaticRanked].sort((a,b)=>b.cushion-a.cushion).slice(0,3).map(x=>x.crop);

  // ── PART A — Farm Diagnostic Profile & Baseline ──
  const partA = {
    location: `${farmer.village}, ${farmer.district}`,
    landHa: farmer.land, landAcres,
    soilType: farmer.soilType, soc: farmer.soc,
    npk: { n: farmer.nitrogen, p: farmer.phosphorus, k: farmer.potassium },
    waterSource: farmer.waterAvail,
    cropHistory: cropHistoryArr,
    monocropFlag: uniqueCropCount <= 1,
    monocropNote: uniqueCropCount <= 1
      ? `${cropHistoryArr.length} consecutive seasons of ${cropHistoryArr[0]} — a textbook monocropping pattern`
      : `${uniqueCropCount} distinct crops across the last ${cropHistoryArr.length} recorded seasons`,
    drs,
  };

  // ── PART B — 5-Year Soil Health Restoration Roadmap (phase from SOC) ──
  const socPhase = farmer.soc < 0.35 ? 1 : farmer.soc < 0.55 ? 2 : 3;
  const PHASE_DATA = {
    1: { label:"Phase 1 — Stabilize", yearLabel:"Year 1", objective:"Stop further degradation without a yield cliff",
      actions:["Reduce chemical nitrogen by 25–30%","Introduce FYM/compost at 5–8 tonnes/acre","Seed-treat with biofertilizers (Rhizobium / PSB / Azotobacter as crop-appropriate)","Move to soil-test-based dosing instead of blanket dosing"],
      expectedYieldEffect:"Flat to ~5% below current chemical-intensive baseline" },
    2: { label:"Phase 2 — Rebuild", yearLabel:"Years 2–3", objective:"Rebuild soil biology and organic matter",
      actions:["Green manure with dhaincha or sunhemp before Kharif sowing","Integrate vermicompost","Include a legume in every rotation for biological N-fixation","Apply mycorrhizal inoculants","Retain crop residue instead of burning it"],
      expectedYieldEffect:"−5% to +5% vs baseline — the transition dip, only partially offset by early biological gains" },
    3: { label:"Phase 3 — Stabilize & Grow", yearLabel:"Years 4–5", objective:"Reduced input dependency with restored organic carbon",
      actions:["Target organic carbon 0.3–0.5% above original baseline","Cut chemical fertilizer to need-based top-up only","Run Integrated Nutrient Management (INM) as the steady-state approach"],
      expectedYieldEffect:"+5% to +15% above original degraded baseline, at lower input cost" },
  };
  const partB = {
    currentPhase: socPhase, ...PHASE_DATA[socPhase],
    currentSOC: farmer.soc,
    targetSOC: parseFloat((farmer.soc + (socPhase===1?0.05:socPhase===2?0.15:0.35)).toFixed(2)),
    agroforestrySpecies: ["Ber","Aonla","Khejri","Babool","Subabul"],
    nitrogenFixingPulses: ["Moong","Urad","Gram"],
    economicsWarning: "Phase 1–2 typically costs more (compost, biofertilizer, green-manure seed) while yield is flat or slightly down — this dip is shown explicitly in Part D/H, not averaged away.",
  };

  // ── PART C — Cropping System Redesign ──
  const partC = {
    floorCrop: { crop: floorCrop.crop, role:"Floor Crop (MSP-linked)", note:"Guaranteed procurement price / income floor; area right-sized down from current status quo, not eliminated." },
    legumeCrop: { crop: legumeCrop.crop, role:"Legume (Nitrogen-Fixing)", note:"Precedes the highest-nutrient-demand crop; direct biological input to Part B soil restoration." },
    growthCrop: { crop: growthCrop.crop, role:"Growth Crop (Market/Value-Linked)", note:"Diversified market outlet distinct from the floor crop's window." },
    diversificationRule: "No single crop should occupy more than ~50–60% of cultivable area in the redesign's first year, reduced further as diversification proves out.",
    boundaryPlanting: "Boundary/bund planting with fruit or fodder trees (Part B agroforestry species) adds a third, low-labour income stream without displacing main-plot area.",
  };

  // ── PART D — Economics & Profitability Model (A2 / A2+FL / C2, C2+50% gap) ──
  const partD = {
    floor: computeC2Economics(floorCrop.crop, farmer),
    legume: computeC2Economics(legumeCrop.crop, farmer),
    growth: computeC2Economics(growthCrop.crop, farmer),
    note: "Gap is computed against the realized Mandi price for this crop and land size — not the announced MSP — unless procurement is verified for this crop in this district.",
  };

  // ── PART E — Pest & Disease Risk Clusters (cross-indexed to growth stage) ──
  const partE = {
    overallRisk: pest,
    stages: [
      { stage:"Seedling / Early Vegetative", trigger:"Warm, high-humidity conditions after rain", clusterRisk:"Damping-off, seedling blight", action:"Seed treatment before sowing; avoid waterlogging; monitor within 5–7 days of any rain event." },
      { stage:"Vegetative Growth", trigger:"Extended dry, hot spell", clusterRisk:`Sucking pests — ${pest.pests.slice(0,2).join(", ")||"Aphids, Jassids, Whitefly"}`, action:"Yellow sticky traps as early-warning system; neem-based spray at threshold before escalating to chemical control." },
      { stage:"Flowering / Pod Formation", trigger:"Humid, cloudy, still-air days", clusterRisk:`Pod/fruit borer complex & fungal blights — ${pest.pests.slice(-2).join(", ")||"Pod Borer, Blight"}`, action:"Install pheromone traps two weeks before expected flowering; apply fungicide only when threshold is crossed." },
      { stage:"Grain Fill / Maturity", trigger:"Unseasonal rain near harvest", clusterRisk:"Grain mould, onset of storage pests", action:"Build harvest-timing flexibility into the Part C calendar; arrange drying and storage readiness ahead of time." },
    ],
  };

  // ── PART F — Weather Risk Matrix (dry/wet branching, from calcWeather Markov data) ──
  const sowMonths = weather.filter(w=>w.isSowing);
  const harvestMonths = weather.filter(w=>w.isHarvest);
  const avgWet = arr => arr.length ? parseFloat((arr.reduce((a,m)=>a+m.wetWeeks,0)/arr.length).toFixed(1)) : 0;
  const partF = {
    monthly: weather,
    stages: [
      { stage:"Sowing Window", currentLean: avgWet(sowMonths)>=2?"Wet-leaning":"Dry-leaning", ifDry:"Delay sowing within the agronomic window; pre-irrigate if borewell/pond available.", ifWet:"Keep drainage channels open; avoid sowing into waterlogged soil — delay 3–5 days instead." },
      { stage:"Vegetative Growth", currentLean:"Monitor weekly", ifDry:"Trigger irrigation at a defined soil-moisture threshold; mulch to conserve moisture.", ifWet:"Hold nitrogen top-dressing to avoid leaching loss; check for waterlogging stress and early fungal onset." },
      { stage:"Flowering", currentLean:"Most moisture-sensitive stage", ifDry:"Prioritize irrigation here over vegetative-stage watering.", ifWet:"Hold fungicide/pesticide spray if rain is expected within 24h — it washes off; reschedule for the next dry window." },
      { stage:"Grain Fill / Maturity", currentLean: avgWet(harvestMonths)>=2?"Wet-leaning — consider advancing harvest":"Dry-leaning", ifDry:"Apply light irrigation only if grain fill is visibly compromised; avoid over-watering this close to harvest.", ifWet:"Advance harvest if it can be done safely to reduce grain mould/lodging risk; arrange emergency drying capacity." },
    ],
    dataNote: "Derived from the Markov wet/dry week model (calcWeather), calibrated to this farm's water-access profile.",
  };

  // ── PART G — Market & Institutional Strategy (exiting the MSP trap) ──
  const partG = {
    steps: [
      { step:1, title:"Aggregate before diversifying", detail:"Join or form an FPO for collective input purchase and output sale — typically improves realized price by cutting out one or two middlemen layers." },
      { step:2, title:"Lock a floor before dropping MSP area", detail:`Only reduce ${floorCrop.crop} area once a contract-farming or FPO-aggregation arrangement for ${growthCrop.crop} is actually signed, not assumed.` },
      { step:3, title:"Add storage or primary processing", detail:"On-farm or FPO-level scientific storage — even basic — breaks the distress-sale-at-harvest pattern that depresses realized price below C2+50%." },
      { step:4, title:"Diversify sales channels", detail:"Mandi sale, FPO-aggregated sale, direct-to-retail/consumer where feasible, and contract farming for processing-grade produce. No single channel should carry all the risk." },
    ],
  };

  // ── PART H — Financial Projections, Insurance & Credit ──
  const fiveYear = projectFiveYearBaseline(farmer);
  const transitionCreditNeed = Math.round(4500 * landAcres);
  const partH = {
    fiveYearCashFlow: fiveYear,
    insurance: { scheme:"PMFBY (Pradhan Mantri Fasal Bima Yojana)", note:`Enrollment must be mapped to all Part C rotation crops (${floorCrop.crop}, ${legumeCrop.crop}, ${growthCrop.crop}) — coverage limited to the old monocrop leaves the new income streams unprotected against Part F weather risk.` },
    credit: { transitionCreditNeed, note:"Part B soil-restoration inputs (compost, biofertilizer, green-manure seed) need short-term credit before they pay back. Size Kisan Credit Card / FPO-linked credit against this transition cost, not just standard seasonal input cost." },
  };

  // ── PART I — Monitoring, Review & Adaptive Management Cycle ──
  const partI = {
    cycles: [
      { item:"Soil retest", cadence:"Every 2–3 years", feedsInto:"Part B phase progression", checks:"Organic carbon % and N-P-K trend" },
      { item:"Seasonal cost-benefit review", cadence:"End of each season", feedsInto:"Part D model recalibration", checks:"Actual A2/C2 cost vs projection; realized price vs C2+50%" },
      { item:"Pest & disease incidence log", cadence:"Continuous, reviewed monthly", feedsInto:"Part E cluster map refinement", checks:"Which risk-cluster predictions held vs missed" },
      { item:"Weather-trigger log", cadence:"Weekly during season", feedsInto:"Part F matrix refinement", checks:"Dry/wet week calls vs actual irrigation/spray decisions" },
      { item:"Market channel review", cadence:"After harvest each season", feedsInto:"Part G channel-mix adjustment", checks:"Realized price by channel (mandi, FPO, contract)" },
    ],
  };

  // ── PART J — One-Page Executive Summary ──
  const currentMonthIdx = new Date().getMonth();
  const thisMonthWeather = weather[currentMonthIdx];
  const partJ = {
    farmProfile: `${partA.location} · ${partA.landHa} Ha (${partA.landAcres} acres) · ${partA.soilType} · ${partA.waterSource}`,
    currentState: `${partA.monocropNote}; SOC ${partA.soc}% (${drs.grade} degradation risk, DRS ${drs.drs}/100)`,
    restorationPhase: `${partB.label} (${partB.yearLabel}) — ${partB.objective}`,
    seasonCropMix: `Floor: ${floorCrop.crop} · Growth: ${growthCrop.crop} · Legume: ${legumeCrop.crop}`,
    c2Gap: [partD.floor, partD.legume, partD.growth].map(d=>`${d.crop}: ${d.gap>=0?"+":""}₹${d.gap.toLocaleString()} vs C2+50% target`).join(" | "),
    topPestWindow: `${partE.stages[0].stage} — ${partE.stages[0].clusterRisk}`,
    weatherCallThisMonth: `${thisMonthWeather.month}: ${thisMonthWeather.wetWeeks}W/${thisMonthWeather.dryWeeks}D — ${thisMonthWeather.action}`,
    marketChannelPlan: "FPO aggregation primary, Squire Outlet cold storage for timing arbitrage, mandi as residual channel",
    nextReviewCheckpoint: "Season-end cost-benefit review (Part I) at next harvest close",
  };

  return {
    // ── legacy fields — Inputs Tab & Econometric Terminal read these directly, keep shape stable ──
    keyIssues: [
      farmer.soc<0.4?`Low Soil Organic Carbon (${farmer.soc}%) constrains yield ceiling`:null,
      drs.drs>=50?`Degradation Risk Score ${drs.drs}/100 (${drs.grade}) flags structural soil stress`:null,
      pest.pct>=40?`${pest.grade} pest pressure (${pest.pct}%) tied to ${lastCrop} monocrop history`:null,
      constrainedWater?"Constrained water access limits crop choice; cattle-boundary risk active":null,
    ].filter(Boolean),
    year1: {
      season1: floorCrop?{crop:floorCrop.crop, variety:"Regional certified seed line", sowMonth:"Oct-Nov", harvestMonth:"Feb-Mar", expectedYield:`~${getBaseYield(floorCrop.crop)} qtl/Ha baseline`, netProfit:`₹${floorCrop.net.toLocaleString()} projected`, soilBenefit:"Breaks historical monocrop pattern"}:null,
      season2: legumeCrop?{crop:legumeCrop.crop, variety:"Regional certified seed line", sowMonth:"Mar-Apr", harvestMonth:"Jun-Jul", expectedYield:`~${getBaseYield(legumeCrop.crop)} qtl/Ha baseline`, netProfit:`₹${legumeCrop.net.toLocaleString()} projected`, soilBenefit:"Nitrogen-fixing / SOC restorative rotation break"}:null,
    },
    year3Target: { socImprovement:"+0.40–0.50%", profitIncrease:"+45–60%", crops:year3Pool },
    year5Target: { socImprovement:"+0.85–1.00%", profitIncrease:"+95–120%", crops:year5Pool },
    fertilizerPrescription: {
      organic: "Vermicompost 2t/acre pre-sowing to lift Soil Organic Carbon",
      bio: "Rhizobium + PSB seed inoculant at sowing for legume rotation crop",
      chemical: farmer.nitrogen<200?"DAP 50kg/acre basal only; avoid urea top-dress this cycle":"Minimal chemical top-up; soil N reserves adequate",
      schedule: "Organic pre-sow, bio-inoculant at seed treatment, chemical basal only",
    },
    pestAlert: { riskLevel: pest.grade, likely: pest.pests, bioIntervention: "Neem oil 3ml/L at 30 DAS; monitor weekly through flowering" },
    weatherLogic: { sowingWindow:"Oct 15 – Nov 10 (regional Markov window)", irrigationSchedule: constrainedWater?"2x supplemental: flowering + pod-fill stage only":"Standard 3x: crown, flowering, pod-fill stages", harvestWindow:"Feb 15 – Mar 10" },
    mandiTiming: { bestMonth:"March–April (pre-monsoon peak demand)", expectedPrice:`₹${getMandiPricePerQtl(floorCrop.crop||lastCrop).toLocaleString()}/qtl regional benchmark`, recommendation:"Hold via Squire Outlet cold storage for 10-15% premium vs immediate sale" },
    inputShoppingList: [
      { item:`${floorCrop.crop||lastCrop} Seed`, qty:"2 kg/acre", cost:"220", source:"Squire Outlet" },
      { item:`${legumeCrop.crop||"Restorative Pulse"} Seed`, qty:"1.5 kg/acre", cost:"180", source:"Squire Outlet" },
      { item:"Vermicompost", qty:"2 t/acre", cost:"1800", source:"Squire Outlet" },
      { item:"DAP Fertilizer (basal)", qty:"50 kg/acre", cost:"1350", source:"Squire Outlet" },
      { item:"Bio-inoculant (Rhizobium/PSB)", qty:"1 pack/acre", cost:"220", source:"Squire Outlet" },
    ],
    // ── new: full 10-Part Restorative & Profitable Farming Plan ──
    partA, partB, partC, partD, partE, partF, partG, partH, partI, partJ,
  };
}

async function generateCropPlan(farmer) {
  // ── PHASE 1: Run our deterministic statistical core FIRST. ──
  // Every hard number, crop selection, and cost figure below comes from our
  // own hardcoded models (calcDRS, calcPest, calcProfit, projectFiveYearBaseline,
  // buildDeterministicBlueprint) — never from the AI. This runs regardless of
  // whether the AI call below succeeds, fails, or hallucinates.
  const drs = calcDRS(farmer);
  const pest = calcPest(farmer);
  const profitRows = calcProfit(farmer);
  const fiveYear = projectFiveYearBaseline(farmer);
  const blueprint = buildDeterministicBlueprint(farmer);
  const finalYearGate = fiveYear[4];
  const avgCushion = parseFloat((fiveYear.reduce((a,y)=>a+y.cushionRatio,0)/5).toFixed(2));
  const planScore = Math.max(0, Math.min(100, Math.round(50 + avgCushion*20 - (pest.pct*0.15))));

  // ── PHASE 2: Ask the AI ONLY to interpret this fixed dataset. ──
  const prompt = `You are Squire Digital Brain — an expert analytical assistant writing an Executive Briefing Note for an Agriculture Field Expert.

You will be provided with a complete set of deterministic statistical reports, soil risk metrics, and multi-year financial balance sheets calculated by our mathematical core engine.

YOUR ADVISORY MISSION:
Analyze these inputs to write a concise, highly clinical multi-paragraph executive summary. Do not synthesize or fake new numbers. Highlight why the farmer is structurally stuck under current patterns, point out hidden constraints in their soil/logistics matrices, and write expert recommendations on how the field manager should customize their physical restorative plan on the ground.

=== CALCULATED SOIL RISK PROFILE (Deterministic DRS Engine) ===
Degradation Risk Score: ${drs.drs}/100 (${drs.grade})
N-P-K: ${farmer.nitrogen}-${farmer.phosphorus}-${farmer.potassium} kg/ha | SOC: ${farmer.soc}% | Soil Type: ${farmer.soilType}

=== CALCULATED PEST RISK PROFILE (Stochastic Index Engine) ===
Infestation Probability: ${pest.pct}% (${pest.grade}) | Driven by: ${pest.lastCrop} monocrop history | Likely pests: ${pest.pests.join(", ")}

=== CALCULATED CROP HISTORY ECONOMICS (Mandi-Synced Engine) ===
${profitRows.map(r=>`${r.crop}: Yield ${r.yieldQtl} qtl, Gross ₹${r.grossRev.toLocaleString()}, Net ₹${r.netProfit.toLocaleString()}`).join("\n")}

=== CALCULATED 5-YEAR SWAMINATHAN C2 PROJECTION MATRIX ===
${fiveYear.map(y=>`Yr${y.yr}: SOC ${y.soc}% | Gross ₹${y.grossRealization.toLocaleString()} | C2 ₹${y.c2.toLocaleString()} | Net ₹${y.netProfit.toLocaleString()} | Cushion ${y.cushionRatio}x ${y.gatePassed?"(PASSES 1.5x gate)":"(below 1.5x gate)"}`).join("\n")}
Year 5 Verdict: Cushion Ratio ${finalYearGate.cushionRatio}x — ${finalYearGate.gatePassed?"structurally self-sustaining":"still short of the Swaminathan gate"}

=== DETERMINISTICALLY SELECTED ROTATION (already computed, do not alter) ===
Year 1 Season 1: ${blueprint.year1.season1?.crop || "N/A"}
Year 1 Season 2: ${blueprint.year1.season2?.crop || "N/A"}
Year 3 Target Mix: ${blueprint.year3Target.crops.join(", ")}
Year 5 Target Mix: ${blueprint.year5Target.crops.join(", ")}

Output your prescriptive analysis ONLY as a valid, single, compact JSON object matching the exact keys below. Do not wrap in markdown \`\`\`json blocks, do not include introductory notes, and do not append trailing explanation text.

{
  "soilHealthScore": 62,
  "soilHealthGrade": "Optimized via Engine",
  "planScore": 88,
  "executiveSummary": "Write your 3-4 sentence high-level clinical brief summarizing the computed data insights here.",
  "expertRecommendations": [
    "Specific field recommendation 1 based on data",
    "Specific field recommendation 2 based on data",
    "Specific field recommendation 3 based on data"
  ]
}`;

  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Server error ${res.status}`);
  if (!data.text) throw new Error("Empty response from server");

  const jsonMatch = data.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found in response: " + data.text.slice(0, 100));

  let aiNarrative;
  try {
    aiNarrative = JSON.parse(jsonMatch[0]);
  } catch (e) {
    throw new Error("JSON parse failed: " + e.message);
  }

  // ── PHASE 3: Merge. Numbers and crop-schedule fields below ALWAYS come
  // from our engine — even if the AI's JSON includes numeric keys, they are
  // discarded here by construction, not just by prompt instruction. ──
  return {
    soilHealthScore: drs.drs,
    soilHealthGrade: drs.grade,
    degradationRisk: drs.grade,
    planScore,
    profitabilityIndex: finalYearGate.gatePassed ? "C2+50% Free Market Premium" : "Below C2+50% Gate — Needs Extension",
    executiveSummary: aiNarrative.executiveSummary || "Executive summary unavailable — AI response malformed.",
    expertRecommendations: aiNarrative.expertRecommendations || [],
    keyIssues: blueprint.keyIssues,
    year1: blueprint.year1,
    year3Target: blueprint.year3Target,
    year5Target: blueprint.year5Target,
    fertilizerPrescription: blueprint.fertilizerPrescription,
    pestAlert: blueprint.pestAlert,
    weatherLogic: blueprint.weatherLogic,
    mandiTiming: blueprint.mandiTiming,
    inputShoppingList: blueprint.inputShoppingList,
    fiveYearBaseline: fiveYear,
    pestIndex: pest,
    // ── full 10-Part Restorative & Profitable Farming Plan (all deterministic) ──
    partA: blueprint.partA, partB: blueprint.partB, partC: blueprint.partC, partD: blueprint.partD,
    partE: blueprint.partE, partF: blueprint.partF, partG: blueprint.partG, partH: blueprint.partH,
    partI: blueprint.partI, partJ: blueprint.partJ,
  };
}

// ─── UI PRIMITIVES ───────────────────────────────────────────────
function Badge({ color, children }) {
  const map = { green:{bg:C.greenPale,text:C.green}, maroon:{bg:"#F8E8EE",text:C.maroon}, gold:{bg:"#FEF3D0",text:C.soil}, gray:{bg:"#F3F4F6",text:C.muted}, blue:{bg:"#EBF5FB",text:C.blue}, orange:{bg:"#FEF0E6",text:C.orange}, red:{bg:"#FDEDEC",text:C.red} };
  const s = map[color] || map.gray;
  return <span style={{ background:s.bg, color:s.text, borderRadius:999, padding:"2px 10px", fontSize:12, fontWeight:600 }}>{children}</span>;
}

// Consistent "PART X — Title" header used across the 10-Part Restorative Plan cards
function PartHeader({ letter, title, subtitle }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
      <div style={{ width:34, height:34, borderRadius:9, background:C.maroon, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:15, flexShrink:0, fontFamily:"monospace" }}>{letter}</div>
      <div>
        <div style={{ fontWeight:800, fontSize:15, color:C.charcoal }}>{title}</div>
        {subtitle && <div style={{ fontSize:11.5, color:C.muted, marginTop:1 }}>{subtitle}</div>}
      </div>
    </div>
  );
}

function Card({ children, style={}, onClick }) {
  return <div onClick={onClick} style={{ background:C.white, borderRadius:12, border:`1px solid ${C.border}`, padding:20, cursor:onClick?"pointer":"default", ...style }}>{children}</div>;
}

function Inp({ label, value, onChange, type="text", options, required, hint, disabled }) {
  return (
    <div style={{ marginBottom:14 }}>
      {label && <label style={{ display:"block", fontSize:13, fontWeight:600, color:C.charcoal, marginBottom:4 }}>{label}{required && <span style={{color:C.red}}> *</span>}</label>}
      {hint && <div style={{ fontSize:11, color:C.muted, marginBottom:4 }}>{hint}</div>}
      {options
        ? <select value={value} onChange={e=>onChange(e.target.value)} disabled={disabled} style={{ width:"100%", padding:"8px 12px", borderRadius:8, border:`1px solid ${C.border}`, fontSize:14, color:C.charcoal, background:disabled?"#f9f9f9":C.white, outline:"none" }}>
  <option value="">— Select —</option>
  {Array.isArray(options) 
    ? options.map(o => <option key={o} value={o}>{o}</option>)
    : Object.entries(options).map(([category, cropList]) => (
        <optgroup key={category} label={category} style={{ fontWeight: "700", color: C.maroon }}>
          {cropList.map(o => <option key={o} value={o} style={{ fontWeight: "400", color: C.charcoal }}>{o}</option>)}
        </optgroup>
      ))
  }
</select>
        : <input type={type} value={value} onChange={e=>onChange(e.target.value)} disabled={disabled} style={{ width:"100%", padding:"8px 12px", borderRadius:8, border:`1px solid ${C.border}`, fontSize:14, color:C.charcoal, background:disabled?"#f9f9f9":C.white, outline:"none", boxSizing:"border-box" }} />
      }
    </div>
  );
}

function Btn({ children, onClick, variant="primary", disabled, small, style={} }) {
  const base = { borderRadius:8, border:"none", cursor:disabled?"not-allowed":"pointer", fontWeight:600, fontSize:small?13:14, padding:small?"6px 14px":"10px 22px", opacity:disabled?0.55:1, ...style };
  const vs = { primary:{background:C.maroon,color:C.white}, green:{background:C.green,color:C.white}, gold:{background:C.gold,color:C.white}, ghost:{background:"transparent",color:C.maroon,border:`1.5px solid ${C.maroon}`}, blue:{background:C.blue,color:C.white} };
  return <button onClick={onClick} disabled={disabled} style={{...base,...(vs[variant]||vs.primary)}}>{children}</button>;
}

function SoilBar({ label, value, max, unit, color }) {
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:3 }}>
        <span style={{color:C.charcoal,fontWeight:500}}>{label}</span>
        <span style={{color:color||C.green,fontWeight:700}}>{value} {unit}</span>
      </div>
      <div style={{ height:8, background:C.border, borderRadius:99, overflow:"hidden" }}>
        <div style={{ width:`${Math.min((value/max)*100,100)}%`, height:"100%", background:color||C.green, borderRadius:99 }} />
      </div>
    </div>
  );
}

function StepBar({ current, steps }) {
  return (
    <div style={{ display:"flex", alignItems:"center", marginBottom:28, overflowX:"auto" }}>
      {steps.map((s,i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", flex:i<steps.length-1?1:"none" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", minWidth:70 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", background:i<current?C.green:i===current?C.maroon:C.border, color:i<=current?C.white:C.muted, fontWeight:700, fontSize:13, marginBottom:4 }}>
              {i<current?"✓":i+1}
            </div>
            <div style={{ fontSize:11, color:i===current?C.maroon:i<current?C.green:C.muted, fontWeight:i===current?700:400, textAlign:"center", lineHeight:1.2 }}>{s}</div>
          </div>
          {i<steps.length-1 && <div style={{ flex:1, height:2, background:i<current?C.green:C.border, marginBottom:20, minWidth:16 }} />}
        </div>
      ))}
    </div>
  );
}

// ─── QR CODE ─────────────────────────────────────────────────────
function QRDisplay({ data, size=120 }) {
  const hash = data.split("").reduce((a,c)=>((a<<5)-a+c.charCodeAt(0))|0,0);
  const cells=11, cell=size/cells, grid=[];
  for(let r=0;r<cells;r++) for(let c2=0;c2<cells;c2++) {
    const isCorner=(r<3&&c2<3)||(r<3&&c2>cells-4)||(r>cells-4&&c2<3);
    grid.push({r,c:c2,on:isCorner||(((hash^(r*17+c2*31))&1)===1&&!(r===1&&c2===1)&&!(r===1&&c2>cells-3)&&!(r>cells-3&&c2===1))});
  }
  return (
    <svg width={size} height={size} style={{ borderRadius:6, border:`2px solid ${C.border}` }}>
      <rect width={size} height={size} fill="white"/>
      {grid.map(({r,c:c2,on},i)=>on?<rect key={i} x={c2*cell} y={r*cell} width={cell-0.5} height={cell-0.5} fill={C.charcoal}/>:null)}
      {[[0,0],[0,cells-3],[cells-3,0]].map(([ry,cx],i)=>(
        <g key={i}>
          <rect x={cx*cell} y={ry*cell} width={3*cell} height={3*cell} fill={C.charcoal} rx={2}/>
          <rect x={cx*cell+cell*0.5} y={ry*cell+cell*0.5} width={2*cell} height={2*cell} fill="white" rx={1}/>
          <rect x={cx*cell+cell} y={ry*cell+cell} width={cell} height={cell} fill={C.charcoal} rx={1}/>
        </g>
      ))}
    </svg>
  );
}

function QRCard({ produce, farmer }) {
  const qrData = `SQUIRE-VERIFIED|ID:${produce.id}|FARMER:${farmer.id}|CROP:${produce.crop}|QTY:${produce.qty}kg|SOC:${farmer.soc}%|BUYER:${produce.buyer}|STATUS:${produce.stage}`;
  const [expanded, setExpanded] = useState(false);
  return (
    <Card style={{ marginBottom:12 }}>
      <div style={{ display:"flex", gap:16, alignItems:"flex-start", flexWrap:"wrap" }}>
        <QRDisplay data={qrData} size={100}/>
        <div style={{ flex:1, minWidth:180 }}>
          <div style={{ fontWeight:700, fontSize:15, color:C.charcoal, marginBottom:2 }}>{produce.crop}</div>
          <div style={{ fontSize:12, color:C.muted, marginBottom:8 }}>Batch #{produce.id} · {produce.qty} kg</div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
            <Badge color="green">✓ Squire Verified</Badge>
            <Badge color={produce.stage==="Sold"?"green":produce.stage==="Buyer Matched"?"blue":"gold"}>{produce.stage}</Badge>
          </div>
          <div style={{ fontSize:12, color:C.muted }}>Farmer: <strong style={{color:C.charcoal}}>{farmer.name}</strong></div>
          <div style={{ fontSize:12, color:C.muted }}>SOC: <strong style={{color:C.green}}>{farmer.soc}%</strong> · Buyer: <strong style={{color:C.charcoal}}>{produce.buyer||"—"}</strong></div>
          <button onClick={()=>setExpanded(!expanded)} style={{ background:"none", border:"none", color:C.maroon, fontSize:12, cursor:"pointer", fontWeight:600, padding:0, marginTop:6 }}>
            {expanded?"▲ Hide trace data":"▼ View QR trace data"}
          </button>
          {expanded && <div style={{ background:C.cream, borderRadius:6, padding:8, marginTop:6, fontSize:10, color:C.muted, fontFamily:"monospace", wordBreak:"break-all" }}>{qrData}</div>}
        </div>
      </div>
    </Card>
  );
}

// ─── RING GAUGE & SPARKLINE ──────────────────────────────────────
function RingGauge({ value, max, color, size=84 }) {
  const cx=size/2, cy=size/2, rO=size*0.42, rM=size*0.33, rI=size*0.25;
  const pct=Math.max(0,Math.min(1,value/max)), circ=2*Math.PI*rO, dash=circ*pct;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <circle cx={cx} cy={cy} r={rI} fill="none" stroke={color} strokeOpacity="0.12" strokeWidth="2"/>
      <circle cx={cx} cy={cy} r={rM} fill="none" stroke={color} strokeOpacity="0.18" strokeWidth="2"/>
      <circle cx={cx} cy={cy} r={rO} fill="none" stroke="#EDE6DA" strokeWidth="5"/>
      <circle cx={cx} cy={cy} r={rO} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeDasharray={`${dash} ${circ}`} transform={`rotate(-90 ${cx} ${cy})`}/>
      <text x={cx} y={cy+4} textAnchor="middle" fill={color} fontSize={size*0.18} fontWeight="700" fontFamily="monospace">{value}</text>
    </svg>
  );
}

function Sparkline({ points, color, w=74, h=34 }) {
  const mn=Math.min(...points), mx=Math.max(...points), rng=mx-mn||1;
  const pts=points.map((v,i)=>`${(i/(points.length-1))*w},${h-((v-mn)/rng)*(h-4)-2}`).join(" ");
  return <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h}><polyline points={pts} stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

// ─── STAT BAR & FORMULA CHIP ─────────────────────────────────────
function StatBar({ label, value, max, color, suffix="" }) {
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:3 }}>
        <span style={{color:C.charcoal}}>{label}</span>
        <span style={{fontWeight:700,color}}>{value}{suffix}</span>
      </div>
      <div style={{ height:7, background:C.border, borderRadius:99, overflow:"hidden" }}>
        <div style={{ width:`${Math.min(Math.round((value/max)*100),100)}%`, height:"100%", background:color, borderRadius:99 }}/>
      </div>
    </div>
  );
}

function FormulaChip({ text }) {
  return <div style={{ background:"#1A1A2E", color:"#A8D8A8", fontFamily:"monospace", fontSize:10, padding:"6px 10px", borderRadius:6, marginBottom:8, lineHeight:1.6, overflowX:"auto" }}>{text}</div>;
}

// ─── STATISTICAL MODELS ──────────────────────────────────────────
const SOIL_TYPE_PENALTY = { "Sandy Loam":0,"Clay Loam":-3,"Red Laterite":-8,"Black Cotton":-5,"Sandy":-12,"Clay":-6,"Silty Loam":2 };
function calcDRS(f) {
  const composite=(0.30*Math.min(f.nitrogen/400,1))+(0.20*Math.min(f.phosphorus/80,1))+(0.15*Math.min(f.potassium/400,1))+(0.35*Math.min(f.soc/1.2,1))+((SOIL_TYPE_PENALTY[f.soilType]||0)/100);
  const drs=Math.max(0,Math.min(100,Math.round((1-composite)*100)));
  return { drs, grade:drs>=70?"Critical":drs>=50?"High":drs>=30?"Moderate":"Low", color:drs>=70?C.red:drs>=50?C.orange:drs>=30?C.gold:C.green };
}

// ─── UNIFIED CROP NAME RESOLVER ──────────────────────────────────────
// AI Blueprint payloads may return regional/vernacular names, parenthetical
// translations, or minor phrasing drift (e.g. "Green Gram (Moong)" instead of
// our canonical "Green Gram" key). Both the Produce Tab and the Econometric
// Terminal price/yield lookups route through this single resolver so a name
// that's actually known never silently collapses to the generic fallback.
const CROP_ALIAS_MAP = {
  "moong": "Green Gram", "mung bean": "Green Gram", "green gram": "Green Gram",
  "urad": "Black Gram", "urad dal": "Black Gram", "black gram": "Black Gram",
  "chana": "Chickpea", "gram": "Chickpea", "kabuli chana": "Chickpea", "bengal gram": "Chickpea",
  "arhar": "Arhar (Pigeon Pea)", "tur": "Arhar (Pigeon Pea)", "toor": "Arhar (Pigeon Pea)",
  "toor dal": "Arhar (Pigeon Pea)", "pigeon pea": "Arhar (Pigeon Pea)", "red gram": "Arhar (Pigeon Pea)",
  "masoor": "Lentil", "masoor dal": "Lentil",
  "til": "Sesame", "sesame seed": "Sesame", "gingelly": "Sesame",
  "jowar": "Sorghum", "sorghum": "Sorghum",
  "bajra": "Pearl Millet", "pearl millet": "Pearl Millet",
  "makka": "Maize", "makkai": "Maize", "corn": "Maize", "sweet corn": "Sweet Corn",
  "sarson": "Mustard", "rai": "Mustard", "mustard": "Mustard",
  "aloo": "Potato", "batata": "Potato",
  "pyaz": "Onion", "kanda": "Onion",
  "lehsun": "Garlic", "garlic": "Garlic",
  "adrak": "Ginger", "haldi": "Turmeric",
  "mirchi": "Chilli", "mirch": "Chilli", "chili": "Chilli", "chile": "Chilli", "green chilli": "Chilli",
  "tamatar": "Tomato", "gehun": "Wheat", "gehu": "Wheat",
  "chawal": "Paddy", "rice": "Paddy", "dhaan": "Paddy",
  "soya": "Soybean", "soyabean": "Soybean",
  "moongfali": "Groundnut", "peanut": "Groundnut",
  "alsi": "Linseed", "flaxseed": "Linseed", "arandi": "Castor", "castor seed": "Castor",
  "pudina": "Mentha", "mint": "Mentha", "menthe": "Mentha", "lemon grass": "Lemongrass",
  "tulsi": "Tulsi", "holy basil": "Tulsi",
  "amla": "Aonla", "indian gooseberry": "Aonla",
  "genda": "Marigold", "genda phool": "Marigold", "gulab": "Rose",
};

function resolveCropKey(rawName) {
  if (!rawName) return null;
  const trimmed = String(rawName).trim();
  if (MANDI_PER_KG[trimmed] !== undefined) return trimmed; // 1. exact match, fast path

  const stripped = trimmed.replace(/\s*\([^)]*\)\s*/g, "").trim(); // strip "(Moong)" etc.
  if (MANDI_PER_KG[stripped] !== undefined) return stripped;

  const lower = trimmed.toLowerCase(), strippedLower = stripped.toLowerCase();
  const keys = Object.keys(MANDI_PER_KG);

  const ciMatch = keys.find(k => k.toLowerCase() === lower || k.toLowerCase() === strippedLower); // 2. case-insensitive
  if (ciMatch) return ciMatch;

  if (CROP_ALIAS_MAP[lower]) return CROP_ALIAS_MAP[lower]; // 3. vernacular/alias map
  if (CROP_ALIAS_MAP[strippedLower]) return CROP_ALIAS_MAP[strippedLower];
  const aliasHit = Object.keys(CROP_ALIAS_MAP).find(a => lower.includes(a));
  if (aliasHit) return CROP_ALIAS_MAP[aliasHit];

  const tokenMatch = keys.find(k => { // 4. substring/token overlap, last resort
    const kl = k.toLowerCase().replace(/\s*\([^)]*\)\s*/g, "").trim();
    return lower.includes(kl) || kl.includes(strippedLower);
  });
  if (tokenMatch) return tokenMatch;

  return null; // genuinely unresolved — caller applies its own generic fallback
}

// Dynamically converts per-kg wholesale pricing to per-quintal (x100) across all 148 crops
function getMandiPricePerQtl(crop) {
  const resolved = resolveCropKey(crop);
  return (resolved ? MANDI_PER_KG[resolved] : 30.00) * 100;
}

// Calibrated baseline yields (quintals/hectare) for Bundelkhand/Fatehpur clusters
function getBaseYield(rawCrop) {
  const crop = resolveCropKey(rawCrop) || rawCrop; // align to the same resolved identity as price lookup
  const yields = {
    "Wheat": 32, "Paddy": 28, "Maize": 35, "Barley": 26, "Oats": 24, "Oat": 24, "Bajra": 22, "Pearl Millet": 22, "Sorghum": 24,
    "Chickpea": 12, "Lentil": 9, "Field Pea": 11, "Green Gram": 8, "Black Gram": 7, "Cowpea": 8, "Lathyrus": 9,
    "Mustard": 14, "Rapeseed": 13, "Sesame": 6, "Groundnut": 18, "Soybean": 15, "Sunflower": 12, "Linseed": 8, "Castor": 10,
    "Sugarcane": 380, "Potato": 220, "Tomato": 180, "Chilli": 40, "Onion": 160, "Garlic": 50, "Ginger": 120, "Turmeric": 150,
    "Mentha": 15, "Lemongrass": 250, "Ashwagandha": 12, "Safed Musli": 8, "Moringa": 90,
    "Mango": 85, "Guava": 70, "Banana": 280, "Papaya": 150, "Pomegranate": 65, "Dragon Fruit": 90, "Strawberry": 45,
    "Button Mushroom": 120, "Milky Mushroom": 110, "Oyster Mushroom": 100, "Paddy Straw Mushroom": 90
  };
  
  if (yields[crop] !== undefined) return yields[crop];
  
  // Dynamic botanical type-matching fallbacks for unlisted varieties
  const lower = crop.toLowerCase();
  if (lower.includes("mushroom")) return 100;
  if (lower.includes("grass") || lower.includes("berseem") || lower.includes("lucerne")) return 300; 
  if (["mango", "guava", "banana", "papaya", "pomegranate", "lemon", "orange", "fruit", "ber", "bael", "lime"].some(f => lower.includes(f))) return 120; 
  if (["tomato", "brinjal", "cabbage", "cauliflower", "capsicum", "cucumber", "gourd", "pumpkin", "okra", "bean", "spinach"].some(v => lower.includes(v))) return 140; 
  return 15; 
}

const WATER_YIELD_MULT = { "Canal irrigation": 1.0, "Borewell (perennial)": 0.95, "Borewell (seasonal)": 0.80, "Check dam nearby": 0.75, "Drip irrigation": 1.05, "Rainfed only": 0.55 };

function calcProfit(f) {
  return (f.cropHistory || "Wheat").split(",").map(c => c.trim()).map(crop => {
    const baseYld = getBaseYield(crop);
    const priceQtl = getMandiPricePerQtl(crop);
    const yld = parseFloat((baseYld * (WATER_YIELD_MULT[f.waterAvail] || 0.7) * (f.soc < 0.3 ? 0.65 : f.soc < 0.5 ? 0.82 : 1.0) * (f.nitrogen < 150 ? 0.75 : f.nitrogen < 250 ? 0.90 : 1.0) * f.land).toFixed(1));
    const grossRev = Math.round(yld * priceQtl);
    const inputCost = Math.round(grossRev * 0.42);
    const netProfit = grossRev - inputCost;
    return { crop, yieldQtl: yld, price: priceQtl, grossRev, inputCost, netProfit, restorativeBonus: Math.round(netProfit * 0.18) };
  });
}

// Stochastic Pest Risk Indexing
function getPestIndex(crop) {
  const baseRisk = { "Wheat": 0.32, "Paddy": 0.48, "Mustard": 0.38, "Chickpea": 0.42, "Potato": 0.52, "Tomato": 0.55, "Chilli": 0.48, "Mentha": 0.25 };
  return baseRisk[crop] || 0.35;
}

function getPestCrops(crop) {
  const pests = {
    "Wheat": ["Aphids", "Yellow Rust", "Karnal Bunt"],
    "Paddy": ["Brown Planthopper", "Blast", "Stem Borer"],
    "Mustard": ["Aphids", "Alternaria Blight", "White Rust"],
    "Chickpea": ["Pod Borer", "Wilt", "Ascochyta Blight"],
    "Potato": ["Late Blight", "Early Blight", "Potato Tuber Moth"],
    "Tomato": ["Fruit Borer", "Early Blight", "Leaf Curl Virus"],
    "Chilli": ["Thrips", "Mites", "Anthracnose Fruit Rot"],
    "Mentha": ["Suckers", "Termites", "Leaf Roller"]
  };
  return pests[crop] || ["Aphids", "Whiteflies", "Leaf Spot"];
}

const WATER_PEST = { "Rainfed only": 0.7, "Borewell (seasonal)": 1.0, "Canal irrigation": 1.3, "Borewell (perennial)": 1.2, "Drip irrigation": 0.85, "Check dam nearby": 0.9 };

function calcPest(f) {
  const lastCrop = (f.cropHistory || "Wheat").split(",").map(c => c.trim()).pop() || "Wheat";
  const unique = new Set((f.cropHistory || "").split(",").map(c => c.trim())).size;
  const baseRisk = getPestIndex(lastCrop);
  const prob = Math.min(0.98, baseRisk * (WATER_PEST[f.waterAvail] || 1.0) * (unique <= 1 ? 1.6 : unique <= 2 ? 1.2 : 0.9) * (f.soc < 0.3 ? 1.3 : f.soc < 0.5 ? 1.1 : 0.85));
  const pct = Math.round(prob * 100);
  return { pct, prob, grade: pct >= 65 ? "High" : pct >= 40 ? "Moderate" : "Low", color: pct >= 65 ? C.red : pct >= 40 ? C.orange : C.green, pests: getPestCrops(lastCrop), lastCrop };
}

const WATER_TRANS = { "Canal irrigation":{ww:0.72,dd:0.78},"Borewell (perennial)":{ww:0.65,dd:0.80},"Borewell (seasonal)":{ww:0.55,dd:0.82},"Check dam nearby":{ww:0.50,dd:0.80},"Drip irrigation":{ww:0.60,dd:0.75},"Rainfed only":{ww:0.40,dd:0.90} };
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONSOON = [0.1,0.1,0.15,0.2,0.25,0.55,0.85,0.80,0.60,0.25,0.1,0.1];
function calcWeather(f) {
  const t = WATER_TRANS[f.waterAvail] || {ww:0.45,dd:0.85};
  return MONTHS.map((month,i) => {
    const pw = Math.min(0.95, MONSOON[i]*t.ww+(1-MONSOON[i])*(1-t.dd));
    const wetWeeks = Math.round(pw*4);
    return { month, wetWeeks, dryWeeks:4-wetWeeks, action:wetWeeks>=3?"Irrigate/Monitor":wetWeeks===2?"Normal ops":wetWeeks===1?"Supplement irrigation":"Drought alert", isSowing:[10,11,0].includes(i), isHarvest:[2,3,4].includes(i) };
  });
}

// ─── ONBOARD FORM ────────────────────────────────────────────────
function OnboardForm({ onSave, onCancel }) {
  const [step, setStep]=useState(0);
  const [form, setForm]=useState({name:"",village:"",district:"",land:"",economicProfile:"",cropHistory:"",soilType:"",nitrogen:"",phosphorus:"",potassium:"",soc:"",waterAvail:""});
  const set=k=>v=>setForm(f=>({...f,[k]:v}));
  const canNext=[form.name&&form.village&&form.district&&form.land&&form.economicProfile,!!form.cropHistory,form.soilType&&form.nitrogen&&form.phosphorus&&form.potassium&&form.soc&&form.waterAvail][step];
  const steps=["Farmer Identity","Crop History","Soil & Water"];
  const content=[
    <><Inp label="Farmer Name" value={form.name} onChange={set("name")} required/><Inp label="Village" value={form.village} onChange={set("village")} required/><Inp label="District" value={form.district} onChange={set("district")} options={DISTRICTS} required/><Inp label="Land (Ha)" value={form.land} onChange={set("land")} type="number" required hint="e.g. 1.5"/><Inp label="Economic Profile" value={form.economicProfile} onChange={set("economicProfile")} options={ECO_PROFILES} required/></>,
    <><Inp label="Crop History (last 3 seasons)" value={form.cropHistory} onChange={set("cropHistory")} required hint="e.g. Wheat, Wheat, Paddy"/></>,
    <><Inp label="Soil Type" value={form.soilType} onChange={set("soilType")} options={SOIL_TYPES} required/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Inp label="Nitrogen (kg/ha)" value={form.nitrogen} onChange={set("nitrogen")} type="number" required/><Inp label="Phosphorus (kg/ha)" value={form.phosphorus} onChange={set("phosphorus")} type="number" required/><Inp label="Potassium (kg/ha)" value={form.potassium} onChange={set("potassium")} type="number" required/><Inp label="SOC (%)" value={form.soc} onChange={set("soc")} type="number" required hint="Soil Organic Carbon"/></div><Inp label="Water Availability" value={form.waterAvail} onChange={set("waterAvail")} options={WATER_OPTIONS} required/></>
  ];
  return (
    <div>
      <StepBar current={step} steps={steps}/>
      <Card>
        <div style={{fontWeight:700,fontSize:17,color:C.maroon,marginBottom:18}}>Step {step+1}: {steps[step]}</div>
        {content[step]}
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
          {step>0&&<Btn variant="ghost" onClick={()=>setStep(s=>s-1)}>← Back</Btn>}
          <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
          {step<2?<Btn variant="primary" onClick={()=>setStep(s=>s+1)} disabled={!canNext}>Next →</Btn>
            :<Btn variant="green" onClick={()=>onSave({...form,id:"F"+Date.now().toString().slice(-4),land:parseFloat(form.land),nitrogen:parseFloat(form.nitrogen),phosphorus:parseFloat(form.phosphorus),potassium:parseFloat(form.potassium),soc:parseFloat(form.soc),status:"Soil Assessed",planGenerated:false,produce:[],plan:null})} disabled={!canNext}>✓ Save Farmer</Btn>}
        </div>
      </Card>
    </div>
  );
}

// ─── ECONOMICS TAB ───────────────────────────────────────────────
function EconomicsTab({ farmer, plan, machineryRentalCost }) {
  const [timeHorizon, setTimeHorizon] = useState(1); // 1, 3, or 5 years
  const [activeScenario, setActiveSection] = useState("base");
  const landAcres = parseFloat((farmer.land * 2.47).toFixed(1));

  // Extract seasonal metadata from the dynamic AI blueprint payload
  const s1 = plan?.year1?.season1;
  const s2 = plan?.year1?.season2;

  const cropS1 = s1?.crop || "Mustard";
  const cropS2 = s2?.crop || "Green Gram";

  // Safe string-parsing helper utilities to extract numeric boundaries
  const parseNumber = (str, defaultVal = 0) => {
    if (!str) return defaultVal;
    const clean = String(str).replace(/[^0-9.-]/g, "").split("-");
    const num = parseFloat(clean[0]);
    return isNaN(num) ? defaultVal : num;
  };

  // Convert raw pricing per kg from our synchronized master array
  const priceKgS1 = MANDI_PER_KG[resolveCropKey(cropS1)] || 30.00;
  const priceKgS2 = MANDI_PER_KG[resolveCropKey(cropS2)] || 30.00;

  // Baseline yield conversions (Convert qtl/acre strings to total kilograms for land size)
  const baseYieldAcreS1 = parseNumber(s1?.expectedYield, 8);
  const baseYieldAcreS2 = parseNumber(s2?.expectedYield, 4);

  const totalKgS1 = Math.round(baseYieldAcreS1 * 100 * landAcres);
  const totalKgS2 = Math.round(baseYieldAcreS2 * 100 * landAcres);

  // Crop-Wise Operational Investment Cost Breakdown (Per Kilogram of Output target)
  const buildCropLedger = (crop, priceKg, totalKg, seedCostShare) => {
    const totalGross = totalKg * priceKg;
    const structures = {
      sowing: 2200 * landAcres * seedCostShare,
      inputs: ((plan?.inputShoppingList || []).reduce((a, item) => a + parseNumber(item.cost), 0) * seedCostShare) || (1800 * landAcres * seedCostShare),
      labor: 4500 * landAcres * seedCostShare,
      machinery: (parseFloat(machineryRentalCost) / 2) || (1200 * landAcres * seedCostShare),
      logistics: 1500 * landAcres * seedCostShare
    };
    const totalC2 = structures.sowing + structures.inputs + structures.labor + structures.machinery + structures.logistics;
    return { name: crop, priceKg, totalKg, gross: totalGross, ...structures, totalC2 };
  };

  const ledgerS1 = buildCropLedger(cropS1, priceKgS1, totalKgS1, 0.6);
  const ledgerS2 = buildCropLedger(cropS2, priceKgS2, totalKgS2, 0.4);

  const totalYear1C2 = ledgerS1.totalC2 + ledgerS2.totalC2;
  const totalYear1Gross = ledgerS1.gross + ledgerS2.gross;

  // Multi-Year Compounding Matrix Engine
  const scenarios = {
    base: { yG: [1, 1.12, 1.25, 1.38, 1.55], cD: [1, 0.95, 0.90, 0.85, 0.78], label: "C2+50% Standard Strategy" },
    optimistic: { yG: [1, 1.18, 1.35, 1.60, 1.85], cD: [1, 0.90, 0.82, 0.74, 0.68], label: "High-Efficiency Horizon" },
    pessimistic: { yG: [1, 1.02, 1.04, 1.08, 1.12], cD: [1, 0.99, 0.96, 0.94, 0.91], label: "Climate/Market Strain" }
  };
  const mod = scenarios[activeScenario];

  const projectionYears = [1, 2, 3, 4, 5].map((yr, i) => {
    const gross = Math.round(totalYear1Gross * mod.yG[i]);
    const costs = Math.round(totalYear1C2 * mod.cD[i]);
    const net = gross - costs;
    const bonus = Math.round(net * 0.18);
    return { yr, gross, costs, net, bonus, totalComp: net + bonus, roi: costs > 0 ? ((net / costs) * 100) : 0 };
  });

  // Calculate dynamic data coordinates for the line graph
  const maxVal = Math.max(...projectionYears.map(y => y.gross), 1);
  const getLinePoints = (key) => {
    return projectionYears.map((y, i) => `${(i * 90) + 20},${110 - (y[key] / maxVal) * 90}`).join(" ");
  };

  // Compute active dataset values based on 1, 3, or 5 Year tab state
  const selectedYearData = projectionYears[timeHorizon - 1];
  const totalHorizonCost = projectionYears.slice(0, timeHorizon).reduce((a, y) => a + y.costs, 0);
  const totalHorizonNet = projectionYears.slice(0, timeHorizon).reduce((a, y) => a + y.net, 0);

  // SVG Pie Chart Slice Engine
  const totalPie = totalHorizonCost + totalHorizonNet;
  const costPct = totalPie > 0 ? (totalHorizonCost / totalPie) : 0.5;
  const costAngle = costPct * 360;
  const xEnd = 50 + 40 * Math.cos((costAngle - 90) * (Math.PI / 180));
  const yEnd = 50 + 40 * Math.sin((costAngle - 90) * (Math.PI / 180));
  const largeArcFlag = costPct > 0.5 ? 1 : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Configuration Header Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h3 style={{ fontWeight: 800, fontSize: 18, color: C.charcoal, margin: 0 }}>📊 Financial Ledger Optimization</h3>
          <p style={{ fontSize: 12, color: C.muted, margin: "2px 0 0" }}>Swaminathan C2 Production Ledger & Output Projections</p>
        </div>
        {/* Year Horizon Tabs Selector */}
        <div style={{ display: "flex", background: C.border, borderRadius: 8, padding: 3, gap: 2 }}>
          {[1, 3, 5].map(yr => (
            <button key={yr} onClick={() => setTimeHorizon(yr)} style={{ border: "none", padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer", background: timeHorizon === yr ? C.maroon : "transparent", color: timeHorizon === yr ? C.white : C.muted, transition: "all 0.2s" }}>
              {yr} Year Tab
            </button>
          ))}
        </div>
      </div>

      {/* Crop-Wise Ledger Breakdown Panels */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[ledgerS1, ledgerS2].map((ledger, idx) => (
          <Card key={idx} style={{ padding: 16 }}>
            <h4 style={{ fontWeight: 700, color: C.maroon, fontSize: 14, margin: "0 0 10px", borderBottom: `1px solid ${C.border}`, paddingBottom: 6 }}>
              Season {idx + 1}: {ledger.name} Ledger ({landAcres} Ac)
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12.5 }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: C.green, fontWeight: 700, background: C.greenPale, padding: "4px 8px", borderRadius: 4 }}>
                <span>Harvest Sale Price (SI Base):</span>
                <span>₹{ledger.priceKg.toFixed(2)} / kg</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0 4px" }}>
                <span style={{ color: C.muted }}>Total Yield Output volume:</span>
                <span style={{ fontWeight: 600 }}>{ledger.totalKg.toLocaleString()} kg</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0 4px", borderBottom: `1px solid ${C.border}`, paddingBottom: 6 }}>
                <span style={{ color: C.muted }}>Gross Market Realization:</span>
                <span style={{ fontWeight: 700, color: C.blue }}>₹{Math.round(ledger.gross).toLocaleString()}</span>
              </div>

              {[
                { l: "• Sowing & Seedbed Tillage Costs", v: ledger.sowing },
                { l: "• Input Seed & Bio-Fertilizers share", v: ledger.inputs },
                { l: "• Weeding & Interculture Labor costs", v: ledger.labor },
                { l: "• Custom Hiring (Squire Machinery Bay)", v: ledger.machinery },
                { l: "• Post-Harvest Logistics & Transport", v: ledger.logistics }
              ].map((cItem, cIdx) => (
                <div key={cIdx} style={{ display: "flex", justifyContent: "space-between", color: C.charcoal, padding: "0 4px" }}>
                  <span>{cItem.l}</span>
                  <span style={{ fontFamily: "monospace" }}>₹{Math.round(cItem.v).toLocaleString()}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, color: C.red, borderTop: `1px dashed ${C.border}`, paddingTop: 6, padding: "6px 4px 0" }}>
                <span>Total Comprehensive Cost (C2)</span>
                <span style={{ fontFamily: "monospace" }}>₹{Math.round(ledger.totalC2).toLocaleString()}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Analytics Visualization Panel: Line Graph + SVG Pie Chart */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16 }}>
        {/* Line Graph Row */}
        <Card style={{ padding: 16 }}>
          <h4 style={{ fontWeight: 700, color: C.maroon, fontSize: 13, marginBottom: 12 }}>📈 5-Year Comprehensive Growth Horizon (Line Graph)</h4>
          <svg viewBox="0 0 400 130" width="100%" style={{ overflow: "visible" }}>
            {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
              <line key={i} x1="20" y1={t * 90 + 20} x2="380" y2={t * 90 + 20} stroke="#EFE8DB" strokeWidth="1" strokeDasharray="3 3" />
            ))}
            <polyline points={getLinePoints("gross")} stroke={C.blue} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points={getLinePoints("costs")} stroke={C.red} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points={getLinePoints("net")} stroke={C.green} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {projectionYears.map((y, i) => (
              <text key={i} x={(i * 90) + 20} y="125" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.muted}>Yr {y.yr}</text>
            ))}
          </svg>
          <div style={{ display: "flex", gap: 12, fontSize: 10.5, color: C.muted, marginTop: 8, borderTop: `1px solid ${C.border}`, paddingTop: 6 }}>
            <span><span style={{ display: "inline-block", width: 8, height: 8, background: C.blue, marginRight: 4, borderRadius: 2 }} />Gross Sales</span>
            <span><span style={{ display: "inline-block", width: 8, height: 8, background: C.red, marginRight: 4, borderRadius: 2 }} />C2 Costs</span>
            <span><span style={{ display: "inline-block", width: 8, height: 8, background: C.green, marginRight: 4, borderRadius: 2 }} />Net Income</span>
          </div>
        </Card>

        {/* SVG Pie Chart Component */}
        <Card style={{ padding: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <h4 style={{ fontWeight: 700, color: C.maroon, fontSize: 13, marginBottom: 8, width: "100%", textAlign: "left" }}>
            🍩 Cumulative Capital Breakdown ({timeHorizon} Yr Horizon)
          </h4>
          <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%" }}>
            <svg viewBox="0 0 100 100" width="100" height="100" style={{ transform: "rotate(-90deg)", overflow: "visible" }}>
              <circle cx="50" cy="50" r="40" fill={C.green} />
              {costPct > 0 && (
                <path d={`M 50 50 L 50 10 A 40 40 0 ${largeArcFlag} 1 ${xEnd} ${yEnd} Z`} fill="#EDE6DA" />
              )}
              <circle cx="50" cy="50" r="22" fill={C.white} />
            </svg>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, fontSize: 11.5 }}>
              <div>
                <span style={{ display: "inline-block", width: 10, height: 10, background: "#EDE6DA", borderRadius: 2, marginRight: 6 }} />
                Total Investment (C2): <strong>₹{Math.round(totalHorizonCost).toLocaleString()}</strong>
              </div>
              <div>
                <span style={{ display: "inline-block", width: 10, height: 10, background: C.green, borderRadius: 2, marginRight: 6 }} />
                Net Retained Returns: <strong>₹{Math.round(totalHorizonNet).toLocaleString()}</strong>
              </div>
              <div style={{ background: C.cream, padding: "4px 8px", borderRadius: 4, fontWeight: 700, color: C.maroon, fontSize: 12, marginTop: 4, textAlign: "center" }}>
                Target ROI: {totalHorizonCost > 0 ? Math.round((totalHorizonNet / totalHorizonCost) * 100) : 0}%
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Comprehensive Tabular Balance Sheet Row */}
      <Card style={{ padding: 14 }}>
        <h4 style={{ fontWeight: 700, color: C.maroon, fontSize: 13, marginBottom: 10 }}>📋 Multi-Year Structural Balance Sheet Projections</h4>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: C.cream, borderBottom: `2px solid ${C.maroon}` }}>
                {["Financial Performance metric", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"].map((h, i) => (
                  <th key={i} style={{ padding: "6px 8px", textAlign: i === 0 ? "left" : "right", color: C.charcoal, fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Gross Market Valuation Output", key: "gross", color: C.blue, bold: false },
                { label: "Comprehensive Cost Ledger (C2)", key: "costs", color: C.red, bold: false },
                { label: "Net Operational Income P&L", key: "net", color: C.green, bold: true },
                { label: "Squire FPO Restorative Premium", key: "bonus", color: C.maroon, bold: false },
                { label: "Total Combined Capital Yield", key: "totalComp", color: C.green, bold: true },
                { label: "Return on Investment (ROI %)", key: "roi", color: C.charcoal, bold: false, suffix: "%" }
              ].map((row, idx) => (
                <tr key={idx} style={{ borderBottom: `1px solid ${C.border}`, background: row.bold ? "rgba(45,106,79,0.02)" : "transparent" }}>
                  <td style={{ padding: "8px", fontWeight: row.bold ? 700 : 400, color: C.charcoal }}>{row.label}</td>
                  {projectionYears.map((year, yIdx) => {
                    const value = year[row.key];
                    return (
                      <td key={yIdx} style={{ padding: "8px", textAlign: "right", fontWeight: row.bold ? 700 : 400, color: row.key === "net" || row.key === "totalComp" ? C.green : row.color, fontFamily: "monospace" }}>
                        {row.suffix ? `${parseFloat(value.toFixed(1))}%` : `₹${Math.round(value).toLocaleString()}`}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── MACHINERY TAB ───────────────────────────────────────────────
function MachineryTab({ farmer, rentals, onAddRental }) {
  const [booking, setBooking]=useState(null);
  const [form, setForm]=useState({startDate:"",endDate:"",hours:""});
  const set=k=>v=>setForm(f=>({...f,[k]:v}));
  const totalCost=booking?Math.round(booking.ratePerHour*(parseInt(form.hours)||0)):0;
  const handleConfirm=()=>{
    if(!form.startDate||!form.endDate||!form.hours) return;
    onAddRental({id:"R"+Date.now(),farmerId:farmer.id,farmerName:farmer.name,equipment:booking.name,startDate:form.startDate,endDate:form.endDate,hours:parseInt(form.hours),ratePerHour:booking.ratePerHour,totalCost,status:"Confirmed"});
    setBooking(null); setForm({startDate:"",endDate:"",hours:""});
  };
  return (
    <div>
      <div style={{fontWeight:700,color:C.charcoal,marginBottom:4}}>Machinery Rental Bay</div>
      <div style={{fontSize:13,color:C.muted,marginBottom:16}}>Rent specialized equipment by the hour.</div>
      {booking&&(
        <Card style={{marginBottom:16,background:C.soilLight,border:`1.5px solid ${C.gold}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontWeight:700,color:C.maroon,fontSize:15}}>{booking.icon} Book: {booking.name}</div>
            <button onClick={()=>setBooking(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:C.muted}}>✕</button>
          </div>
          <div style={{fontSize:13,color:C.muted,marginBottom:12}}>Rate: <strong style={{color:C.green}}>₹{booking.ratePerHour}/hr</strong></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            <Inp label="Start Date" value={form.startDate} onChange={set("startDate")} type="date" required/>
            <Inp label="End Date" value={form.endDate} onChange={set("endDate")} type="date" required/>
            <Inp label="Hours" value={form.hours} onChange={set("hours")} type="number" required/>
          </div>
          {form.hours&&<div style={{background:C.greenPale,borderRadius:8,padding:"10px 14px",marginBottom:12,fontSize:14}}>Estimated: <strong style={{color:C.green}}>₹{totalCost}</strong> ({form.hours}hrs × ₹{booking.ratePerHour})</div>}
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <Btn small variant="ghost" onClick={()=>setBooking(null)}>Cancel</Btn>
            <Btn small variant="green" onClick={handleConfirm} disabled={!form.startDate||!form.endDate||!form.hours}>Confirm Booking</Btn>
          </div>
        </Card>
      )}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
        {EQUIPMENT_LIST.map(eq=>(
          <Card key={eq.name} style={{padding:14,opacity:eq.available?1:0.6}}>
            <div style={{fontSize:26,marginBottom:6}}>{eq.icon}</div>
            <div style={{fontWeight:700,fontSize:13,color:C.charcoal,marginBottom:2}}>{eq.name}</div>
            <div style={{fontSize:11,color:C.muted,marginBottom:8,lineHeight:1.4}}>{eq.desc}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:13,fontWeight:700,color:C.green}}>₹{eq.ratePerHour}/hr</span>
              {eq.available?<Btn small variant="primary" onClick={()=>setBooking(eq)}>Book</Btn>:<Badge color="gray">Unavailable</Badge>}
            </div>
          </Card>
        ))}
      </div>
      <div style={{fontWeight:700,color:C.charcoal,marginBottom:10}}>Rental History</div>
      {rentals.length===0?<Card style={{textAlign:"center",padding:24}}><div style={{color:C.muted,fontSize:13}}>No rentals yet.</div></Card>:
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {rentals.map(r=>(
            <Card key={r.id} style={{padding:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                <div><div style={{fontWeight:700,fontSize:14}}>{r.equipment}</div><div style={{fontSize:12,color:C.muted}}>{r.startDate} → {r.endDate} · {r.hours}hrs</div></div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <span style={{fontWeight:700,color:C.green}}>₹{r.totalCost}</span>
                  <Badge color={r.status==="Completed"?"green":r.status==="Confirmed"?"blue":"gold"}>{r.status}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      }
    </div>
  );
}

// ─── FARMER DETAIL ───────────────────────────────────────────────
function FarmerDetail({ farmer, onBack, onUpdateFarmer, rentals, onAddRental }) {
  const [tab, setTab] = useState("soil");
  
  // ADD THIS LINE — Declares sub-routing state for the Economics Terminal toggle
  const [ecoSubTab, setEcoSubTab] = useState("terminal");
  
  const [plan, setPlan] = useState(farmer.plan || null);
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState(null);
  const [newProduce, setNewProduce] = useState({ crop: "", qty: "", stage: "", buyer: "", harvestDate: "" });
  const [addingProduce, setAddingProduce] = useState(false);

  const farmerRentals=rentals.filter(r=>r.farmerId===farmer.id);

  const inputItems=(plan?.inputShoppingList||[]).map(item=>{
    const rawCost=parseFloat(String(item.cost).replace(/[^0-9.]/g,""))||0;
    const isPerAcre=String(item.qty).toLowerCase().includes("acre");
    const landAcres=farmer.land*2.47;
    return {...item,unitCost:rawCost,totalCost:isPerAcre?Math.round(rawCost*landAcres):rawCost,isPerAcre,landAcres:Math.round(landAcres*10)/10};
  });
  const totalInputCost=inputItems.reduce((a,i)=>a+i.totalCost,0);

  const produceItems=farmer.produce.map(p=>{
    const pricePerKg=MANDI_PER_KG[resolveCropKey(p.crop)]||30, grossRevenue=Math.round((parseFloat(p.qty)||0)*pricePerKg);
    const commissionPct=p.buyer==="B2C Premium"?0.05:p.buyer==="B2B Buyer"?0.07:p.buyer==="FPO Aggregation"?0.06:0.10;
    const commission=Math.round(grossRevenue*commissionPct);
    return {...p,pricePerKg,grossRevenue,commission,commissionPct,netRevenue:grossRevenue-commission};
  });
  const totalGrossRevenue=produceItems.reduce((a,p)=>a+p.grossRevenue,0);
  const totalCommission=produceItems.reduce((a,p)=>a+p.commission,0);
  const totalNetRevenue=produceItems.reduce((a,p)=>a+p.netRevenue,0);
  const machineryRentalCost=farmerRentals.reduce((a,r)=>a+r.totalCost,0);
  const netPL=totalNetRevenue-(totalInputCost+machineryRentalCost);
  const restorativePremium=Math.round(totalNetRevenue*0.18);

  const handleGenerate=async()=>{
    setLoading(true); setError(null);
    try {
      const result=await generateCropPlan(farmer);
      setPlan(result);
      onUpdateFarmer({...farmer,plan:result,planGenerated:true,status:"Plan Generated"});
    } catch(e) { setError(e.message); }
    setLoading(false);
  };

  const handleAddProduce=()=>{
    if(!newProduce.crop||!newProduce.qty||!newProduce.stage) return;
    onUpdateFarmer({...farmer,produce:[...farmer.produce,{id:"P"+Date.now(),...newProduce,qrGenerated:true}]});
    setNewProduce({crop:"",qty:"",stage:"",buyer:"",harvestDate:""}); setAddingProduce(false);
  };

  const TABS=[{key:"soil",label:"🧪 Soil"},{key:"plan",label:"🧠 Blueprint"},{key:"inputs",label:"🛒 Inputs"},{key:"produce",label:"📦 Produce"},{key:"qr",label:"🏷 QR"},{key:"machinery",label:"🚜 Machinery"},{key:"economics",label:"💰 Economics"}];

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:C.muted}}>←</button>
        <div style={{flex:1}}>
          <div style={{fontWeight:800,fontSize:20,color:C.charcoal}}>{farmer.name}</div>
          <div style={{fontSize:13,color:C.muted}}>{farmer.village}, {farmer.district} · {farmer.land}Ha · {farmer.economicProfile}</div>
        </div>
        <Badge color={farmer.planGenerated?"green":"gold"}>{farmer.status}</Badge>
      </div>

      <div style={{display:"flex",gap:2,borderBottom:`2px solid ${C.border}`,marginBottom:20,overflowX:"auto"}}>
        {TABS.map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key)} style={{padding:"8px 12px",background:"none",border:"none",cursor:"pointer",fontWeight:tab===t.key?700:400,color:tab===t.key?C.maroon:C.muted,borderBottom:tab===t.key?`2px solid ${C.maroon}`:"2px solid transparent",marginBottom:-2,fontSize:12,whiteSpace:"nowrap"}}>
            {t.label}
          </button>
        ))}
      </div>

      {tab==="soil"&&(
        <div>
          <Card style={{marginBottom:14}}>
            <div style={{fontWeight:700,color:C.maroon,marginBottom:14,fontSize:15}}>🧪 Soil Health Metrics</div>
            <SoilBar label="Nitrogen (N)" value={farmer.nitrogen} max={400} unit="kg/ha" color={farmer.nitrogen<150?C.red:farmer.nitrogen<250?C.orange:C.green}/>
            <SoilBar label="Phosphorus (P)" value={farmer.phosphorus} max={80} unit="kg/ha" color={farmer.phosphorus<20?C.red:farmer.phosphorus<40?C.orange:C.green}/>
            <SoilBar label="Potassium (K)" value={farmer.potassium} max={400} unit="kg/ha" color={farmer.potassium<150?C.red:farmer.potassium<280?C.orange:C.green}/>
            <SoilBar label="Soil Organic Carbon" value={farmer.soc*10} max={10} unit="%" color={farmer.soc<0.3?C.red:farmer.soc<0.5?C.orange:C.green}/>
          </Card>
          <Card>
            <div style={{fontWeight:700,color:C.maroon,marginBottom:12,fontSize:15}}>🌾 Field Profile</div>
            {[["Soil Type",farmer.soilType],["Water Availability",farmer.waterAvail],["Crop History",farmer.cropHistory]].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.border}`,fontSize:14}}>
                <span style={{color:C.muted}}>{k}</span><span style={{color:C.charcoal,fontWeight:600,textAlign:"right",maxWidth:"60%"}}>{v}</span>
              </div>
            ))}
          </Card>
        </div>
      )}

      {tab === "plan" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {!plan && !loading && (
            <Card style={{ textAlign: "center", padding: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🧠</div>
              <div style={{ fontWeight: 700, fontSize: 18, color: C.charcoal, marginBottom: 8 }}>Generate AI Digital Brain Case File</div>
              <div style={{ color: C.muted, fontSize: 14, marginBottom: 20 }}>Our deterministic engine computes the DRS, pest index, and 5-year Swaminathan projection first — the AI then writes a clinical executive brief on top of those fixed numbers. It never invents the numbers itself.</div>
              {error && <div style={{ color: C.red, marginBottom: 14, fontSize: 13, background: "#FDEDEC", padding: "8px 12px", borderRadius: 6 }}>{error}</div>}
              <Btn variant="primary" onClick={handleGenerate}>🌱 Generate Case File</Btn>
            </Card>
          )}

          {loading && (
            <Card style={{ textAlign: "center", padding: 48 }}>
              <div style={{ fontSize: 42, marginBottom: 12 }}>⚙️</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: C.maroon }}>Digital Brain Processing…</div>
              <div style={{ color: C.muted, fontSize: 13, marginTop: 8 }}>Running deterministic DRS / pest / C2 engine, then drafting the clinical brief</div>
            </Card>
          )}

          {plan && !loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              
              {/* BRAND HEADER CONTAINER */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 24 }}>🧠</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 18, color: C.charcoal }}>AI Digital Brain · Executive Case File Summary</div>
                  <div style={{ fontSize: 12, color: C.muted }}>Every metric below is computed by our deterministic engine — the AI writes narrative interpretation only.</div>
                </div>
              </div>

              {/* THREE LAYER CORE RISK RING GAUGES */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <Card style={{ textAlign: "center" }}>
                  <RingGauge value={plan.soilHealthScore} max={100} color={plan.soilHealthScore > 60 ? C.green : plan.soilHealthScore > 35 ? C.orange : C.red} />
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>Soil Health Score</div>
                  <Badge color={plan.soilHealthScore > 60 ? "green" : plan.soilHealthScore > 35 ? "gold" : "red"}>{plan.soilHealthGrade}</Badge>
                </Card>
                <Card style={{ textAlign: "center" }}>
                  <RingGauge value={plan.planScore} max={100} color={C.maroon} />
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>Plan Score</div>
                  <Badge color="maroon">{plan.profitabilityIndex}</Badge>
                </Card>
                <Card style={{ textAlign: "center" }}>
                  <RingGauge value={plan.soilHealthScore} max={100} color={plan.degradationRisk === "Critical" ? C.red : plan.degradationRisk === "High" ? C.orange : plan.degradationRisk === "Moderate" ? C.gold : C.green} />
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>Degradation Risk</div>
                  <Badge color={plan.degradationRisk === "Critical" || plan.degradationRisk === "High" ? "red" : plan.degradationRisk === "Moderate" ? "gold" : "green"}>{plan.degradationRisk}</Badge>
                </Card>
              </div>

              {/* EXPERT SUMMARY BOX BLOCK */}
              <div style={{ background: "linear-gradient(135deg, #241509 0%, #3A2415 100%)", borderRadius: 14, padding: 22, border: `1px solid ${C.green}55` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 18 }}>📋</span>
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#E8C77E", letterSpacing: "0.03em" }}>CLINICAL EXECUTIVE SUMMARY FOR AGRICULTURE EXPERT</span>
                </div>
                <div style={{ fontSize: 13.5, color: "#F0E6D6", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{plan.executiveSummary}</div>
              </div>

              {/* EXPERT CASE STUDY RECOMMENDATIONS */}
              <Card>
                <div style={{ fontWeight: 700, color: C.maroon, fontSize: 14, marginBottom: 12 }}>🎯 Expert Recommendations for Field Approval</div>
                {(plan.expertRecommendations || []).map((rec, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, paddingBottom: 10, borderBottom: i < (plan.expertRecommendations.length - 1) ? `1px dashed ${C.border}` : "none" }}>
                    <span style={{ color: C.green, fontWeight: 800, fontSize: 14, flexShrink: 0 }}>▸</span>
                    <span style={{ fontSize: 13, color: C.charcoal, lineHeight: 1.5 }}>{rec}</span>
                  </div>
                ))}
              </Card>

              {/* PART A — Farm Diagnostic Profile & Baseline Assessment */}
              <Card>
                <PartHeader letter="A" title="Farm Diagnostic Profile & Baseline Assessment" subtitle="Every downstream recommendation is only as accurate as this baseline"/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:14}}>
                  <div><div style={{fontSize:11,color:C.muted,marginBottom:2}}>Location</div><div style={{fontWeight:700,fontSize:14}}>{plan.partA.location}</div></div>
                  <div><div style={{fontSize:11,color:C.muted,marginBottom:2}}>Land Holding</div><div style={{fontWeight:700,fontSize:14}}>{plan.partA.landHa} Ha ({plan.partA.landAcres} acres)</div></div>
                  <div><div style={{fontSize:11,color:C.muted,marginBottom:2}}>Soil Type</div><div style={{fontWeight:700,fontSize:14}}>{plan.partA.soilType}</div></div>
                  <div><div style={{fontSize:11,color:C.muted,marginBottom:2}}>Water Source</div><div style={{fontWeight:700,fontSize:14}}>{plan.partA.waterSource}</div></div>
                </div>
                <StatBar label="Soil Organic Carbon (SOC)" value={plan.partA.soc} max={1.2} color={plan.partA.soc<0.35?C.red:plan.partA.soc<0.55?C.orange:C.green} suffix="%"/>
                <StatBar label="Nitrogen (N)" value={plan.partA.npk.n} max={400} color={C.blue} suffix=" kg/ha"/>
                <StatBar label="Phosphorus (P)" value={plan.partA.npk.p} max={80} color={C.gold} suffix=" kg/ha"/>
                <StatBar label="Potassium (K)" value={plan.partA.npk.k} max={400} color={C.green} suffix=" kg/ha"/>
                <div style={{marginTop:12,padding:"10px 12px",background:plan.partA.monocropFlag?"#FDEDEC":C.greenPale,borderRadius:8,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                  <span style={{fontSize:12.5,color:C.charcoal}}><strong>Cropping History (last 3 seasons):</strong> {plan.partA.cropHistory.join(", ")}</span>
                  <Badge color={plan.partA.monocropFlag?"red":"green"}>{plan.partA.monocropNote}</Badge>
                </div>
                <div style={{marginTop:10,fontSize:12,color:C.muted}}>Degradation Risk Score: <strong style={{color:plan.partA.drs.color}}>{plan.partA.drs.drs}/100 ({plan.partA.drs.grade})</strong></div>
              </Card>

              {/* PART B — Soil Health Restoration Roadmap */}
              <Card>
                <PartHeader letter="B" title="Soil Health Restoration Roadmap" subtitle="5-Year Phased Plan — reversing degradation is a biological rebuild, not a single input swap"/>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,flexWrap:"wrap"}}>
                  <Badge color="maroon">{plan.partB.label}</Badge>
                  <span style={{fontSize:12,color:C.muted}}>{plan.partB.yearLabel} · Current SOC {plan.partB.currentSOC}% → Target {plan.partB.targetSOC}%</span>
                </div>
                <div style={{fontSize:12.5,color:C.charcoal,marginBottom:10}}><strong>Objective:</strong> {plan.partB.objective}</div>
                <div style={{fontSize:11.5,fontWeight:700,color:C.maroon,marginBottom:6}}>Key Actions This Phase</div>
                {plan.partB.actions.map((a,i)=>(<div key={i} style={{display:"flex",gap:8,marginBottom:5,fontSize:12.5}}><span style={{color:C.green}}>✓</span><span>{a}</span></div>))}
                <div style={{marginTop:10,padding:"8px 12px",background:C.soilLight,borderRadius:8,fontSize:12}}><strong>Expected Yield Effect:</strong> {plan.partB.expectedYieldEffect}</div>
                <div style={{marginTop:10,display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div><div style={{fontSize:11,color:C.muted,marginBottom:3}}>Agroforestry Species (boundary planting)</div><div style={{fontSize:12.5}}>{plan.partB.agroforestrySpecies.join(", ")}</div></div>
                  <div><div style={{fontSize:11,color:C.muted,marginBottom:3}}>Nitrogen-Fixing Pulses</div><div style={{fontSize:12.5}}>{plan.partB.nitrogenFixingPulses.join(", ")}</div></div>
                </div>
                <div style={{marginTop:12,padding:"10px 12px",background:"#FEF0E6",borderRadius:8,fontSize:11.5,color:C.orange,fontStyle:"italic"}}>⚠️ {plan.partB.economicsWarning}</div>
              </Card>

              {/* PART C — Cropping System Redesign */}
              <Card>
                <PartHeader letter="C" title="Cropping System Redesign" subtitle="Exiting monocropping — floor crop for cash-flow security, growth crop for income, legume for soil"/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:14}}>
                  {[["Floor Crop",plan.partC.floorCrop,C.blue],["Legume",plan.partC.legumeCrop,C.green],["Growth Crop",plan.partC.growthCrop,C.maroon]].map(([label,c,color])=>(
                    <div key={label} style={{border:`1.5px solid ${color}33`,borderRadius:10,padding:12,background:`${color}0A`}}>
                      <div style={{fontSize:10.5,fontWeight:700,color,textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:4}}>{label}</div>
                      <div style={{fontWeight:800,fontSize:15,color:C.charcoal,marginBottom:6}}>{c.crop}</div>
                      <div style={{fontSize:11,color:C.muted,lineHeight:1.4}}>{c.note}</div>
                    </div>
                  ))}
                </div>
                <div style={{fontSize:12,color:C.charcoal,marginBottom:6}}><strong>Diversification Discipline:</strong> {plan.partC.diversificationRule}</div>
                <div style={{fontSize:12,color:C.charcoal}}><strong>Boundary Planting:</strong> {plan.partC.boundaryPlanting}</div>
              </Card>

              {/* PART D — Economics & Profitability Model */}
              <Card>
                <PartHeader letter="D" title="Economics & Profitability Model" subtitle="A2 / A2+FL / C2 cost layers, benchmarked against Swaminathan C2+50% — not A2+50%"/>
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  {[["Floor",plan.partD.floor],["Legume",plan.partD.legume],["Growth",plan.partD.growth]].map(([label,d])=>(
                    <div key={label} style={{border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,flexWrap:"wrap",gap:6}}>
                        <span style={{fontWeight:700,fontSize:13.5}}>{label}: {d.crop}</span>
                        <Badge color={d.clearsGate?"green":"red"}>{d.clearsGate?"Clears C2+50%":"Below C2+50%"}</Badge>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,fontSize:11.5}}>
                        <div><span style={{color:C.muted}}>A2/acre: </span><strong>₹{Math.round(d.a2/plan.partA.landAcres).toLocaleString()}</strong></div>
                        <div><span style={{color:C.muted}}>A2+FL/acre: </span><strong>₹{Math.round(d.a2fl/plan.partA.landAcres).toLocaleString()}</strong></div>
                        <div><span style={{color:C.muted}}>C2/acre: </span><strong>₹{Math.round(d.c2/plan.partA.landAcres).toLocaleString()}</strong></div>
                        <div><span style={{color:C.muted}}>C2+50% target: </span><strong style={{color:C.maroon}}>₹{d.c2Target.toLocaleString()}</strong></div>
                        <div><span style={{color:C.muted}}>Realized (Mandi): </span><strong style={{color:C.blue}}>₹{d.grossRev.toLocaleString()}</strong></div>
                        <div><span style={{color:C.muted}}>Gap: </span><strong style={{color:d.gap>=0?C.green:C.red}}>{d.gap>=0?"+":""}₹{d.gap.toLocaleString()} ({d.gapPct}%)</strong></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:10,fontSize:11,color:C.muted,fontStyle:"italic"}}>{plan.partD.note}</div>
              </Card>

              {/* PART E — Pest & Disease Risk Clusters */}
              <Card>
                <PartHeader letter="E" title="Pest & Disease Risk Clusters" subtitle="Outbreaks cluster around growth stage + weather — this turns scouting anticipatory, not reactive"/>
                <div style={{marginBottom:12,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                  <Badge color={plan.partE.overallRisk.grade==="High"?"red":plan.partE.overallRisk.grade==="Moderate"?"gold":"green"}>{plan.partE.overallRisk.grade} Risk — {plan.partE.overallRisk.pct}%</Badge>
                  <span style={{fontSize:11.5,color:C.muted}}>Driven by {plan.partE.overallRisk.lastCrop} monocrop history</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  {plan.partE.stages.map((s,i)=>(
                    <div key={i} style={{border:`1px solid ${C.border}`,borderRadius:10,padding:12}}>
                      <div style={{fontWeight:700,fontSize:12.5,color:C.maroon,marginBottom:6}}>{s.stage}</div>
                      <div style={{fontSize:11,color:C.muted,marginBottom:4}}><strong>Trigger:</strong> {s.trigger}</div>
                      <div style={{fontSize:11,color:C.orange,marginBottom:4}}><strong>Cluster Risk:</strong> {s.clusterRisk}</div>
                      <div style={{fontSize:11,color:C.green}}><strong>Anticipatory Action:</strong> {s.action}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* PART F — Weather Risk Matrix (Dry/Wet Contingencies) */}
              <Card>
                <PartHeader letter="F" title="Weather Risk Matrix" subtitle="Dry-Week / Wet-Week branching contingencies — protects the C2+50% target from a single bad week"/>
                <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
                  {plan.partF.stages.map((s,i)=>(
                    <div key={i} style={{border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
                      <div style={{padding:"8px 12px",background:C.cream,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6}}>
                        <span style={{fontWeight:700,fontSize:12.5}}>{s.stage}</span>
                        <Badge color="gold">{s.currentLean}</Badge>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr"}}>
                        <div style={{padding:"10px 12px",borderRight:`1px solid ${C.border}`,background:"#FEF0E6"}}>
                          <div style={{fontSize:10.5,fontWeight:700,color:C.orange,marginBottom:4}}>☀️ IF DRY WEEK</div>
                          <div style={{fontSize:11.5,color:C.charcoal}}>{s.ifDry}</div>
                        </div>
                        <div style={{padding:"10px 12px",background:"#EBF5FB"}}>
                          <div style={{fontSize:10.5,fontWeight:700,color:C.blue,marginBottom:4}}>💧 IF WET WEEK</div>
                          <div style={{fontSize:11.5,color:C.charcoal}}>{s.ifWet}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{fontSize:11,color:C.muted,fontStyle:"italic",marginBottom:10}}>{plan.partF.dataNote}</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:6}}>
                  {plan.partF.monthly.map((m,i)=>(
                    <div key={i} style={{textAlign:"center",padding:"6px 4px",background:m.isSowing?C.greenPale:m.isHarvest?"#FEF3D0":C.cream,borderRadius:6}}>
                      <div style={{fontSize:10,fontWeight:700}}>{m.month}</div>
                      <div style={{fontSize:9,color:C.muted}}>{m.wetWeeks}W/{m.dryWeeks}D</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* PART G — Market & Institutional Strategy */}
              <Card>
                <PartHeader letter="G" title="Market & Institutional Strategy" subtitle="Exiting the MSP Trap — sequenced, not a request to abandon MSP without a substitute"/>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {plan.partG.steps.map((s)=>(
                    <div key={s.step} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                      <div style={{width:26,height:26,borderRadius:"50%",background:C.maroon,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12,flexShrink:0}}>{s.step}</div>
                      <div><div style={{fontWeight:700,fontSize:12.5,color:C.charcoal}}>{s.title}</div><div style={{fontSize:11.5,color:C.muted,marginTop:2}}>{s.detail}</div></div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* PART H — Financial Projections, Insurance & Credit */}
              <Card>
                <PartHeader letter="H" title="Financial Projections, Insurance & Credit" subtitle="5-Year cash flow shape — modeled year by year, not averaged"/>
                <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:14}}>
                  {plan.partH.fiveYearCashFlow.map((y)=>(
                    <div key={y.yr} style={{textAlign:"center",padding:"8px 6px",border:`1px solid ${C.border}`,borderRadius:8,background:y.gatePassed?C.greenPale:C.cream}}>
                      <div style={{fontSize:10.5,fontWeight:700,color:C.muted}}>Yr {y.yr}</div>
                      <div style={{fontSize:12,fontWeight:800,color:y.netProfit>=0?C.green:C.red}}>₹{Math.round(y.netProfit/1000)}K</div>
                      <div style={{fontSize:9.5,color:C.muted}}>{y.cushionRatio}x cushion</div>
                    </div>
                  ))}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div style={{padding:"10px 12px",background:C.soilLight,borderRadius:8}}>
                    <div style={{fontSize:11,fontWeight:700,color:C.soil,marginBottom:4}}>🛡 {plan.partH.insurance.scheme}</div>
                    <div style={{fontSize:11,color:C.charcoal}}>{plan.partH.insurance.note}</div>
                  </div>
                  <div style={{padding:"10px 12px",background:"#EBF5FB",borderRadius:8}}>
                    <div style={{fontSize:11,fontWeight:700,color:C.blue,marginBottom:4}}>💳 Transition Credit Need: ₹{plan.partH.credit.transitionCreditNeed.toLocaleString()}</div>
                    <div style={{fontSize:11,color:C.charcoal}}>{plan.partH.credit.note}</div>
                  </div>
                </div>
              </Card>

              {/* PART I — Monitoring, Review & Adaptive Management Cycle */}
              <Card>
                <PartHeader letter="I" title="Monitoring, Review & Adaptive Management" subtitle="A plan without a feedback loop is a document, not a system"/>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {plan.partI.cycles.map((c,i)=>(
                    <div key={i} style={{display:"grid",gridTemplateColumns:"1.3fr 1fr 1fr 1.4fr",gap:10,padding:"8px 0",borderBottom:i<plan.partI.cycles.length-1?`1px dashed ${C.border}`:"none",fontSize:11.5}}>
                      <span style={{fontWeight:700}}>{c.item}</span>
                      <span style={{color:C.muted}}>{c.cadence}</span>
                      <span style={{color:C.blue}}>→ {c.feedsInto}</span>
                      <span style={{color:C.charcoal}}>{c.checks}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* PART J — One-Page Executive Summary */}
              <Card style={{background:C.soilLight,border:`1.5px solid ${C.soil}44`}}>
                <PartHeader letter="J" title="One-Page Executive Summary" subtitle="Compressed for the farmer, a lender, FPO, or policy audience"/>
                <div style={{display:"flex",flexDirection:"column",gap:8,fontSize:12.5}}>
                  {[["Farm Profile",plan.partJ.farmProfile],["Current State",plan.partJ.currentState],["5-Yr Soil Restoration Phase",plan.partJ.restorationPhase],["This Season's Crop Mix",plan.partJ.seasonCropMix],["C2+50% Target vs Realized",plan.partJ.c2Gap],["Top Pest/Disease Risk Window",plan.partJ.topPestWindow],["This Month's Weather Call",plan.partJ.weatherCallThisMonth],["Market Channel Plan",plan.partJ.marketChannelPlan],["Next Review Checkpoint",plan.partJ.nextReviewCheckpoint]].map(([k,v])=>(
                    <div key={k} style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                      <span style={{fontWeight:700,color:C.maroon,minWidth:200,flexShrink:0}}>{k}:</span>
                      <span style={{color:C.charcoal}}>{v}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Btn variant="gold" onClick={handleGenerate} small style={{ alignSelf: "flex-start" }}>🔄 Regenerate Case File Summary</Btn>
            </div>
          )}
        </div>
      )}

      {tab==="inputs"&&(
        !plan?<Card style={{textAlign:"center",padding:32}}><div style={{color:C.muted,marginBottom:16}}>Generate AI Blueprint first.</div><Btn variant="primary" onClick={()=>setTab("plan")}>Go to Blueprint →</Btn></Card>:(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            <Card style={{textAlign:"center",padding:12,background:"#FEF0E6"}}><div style={{fontSize:20,fontWeight:800,color:C.orange}}>₹{totalInputCost.toLocaleString()}</div><div style={{fontSize:11,color:C.muted}}>Total Input Cost</div></Card>
            <Card style={{textAlign:"center",padding:12,background:C.soilLight}}><div style={{fontSize:20,fontWeight:800,color:C.soil}}>{(farmer.land*2.47).toFixed(1)}</div><div style={{fontSize:11,color:C.muted}}>Acres</div></Card>
            <Card style={{textAlign:"center",padding:12,background:C.greenPale}}><div style={{fontSize:20,fontWeight:800,color:C.green}}>₹{Math.round(totalInputCost/(farmer.land*2.47)).toLocaleString()}</div><div style={{fontSize:11,color:C.muted}}>Cost/Acre</div></Card>
          </div>
          <Card>
            <div style={{fontWeight:700,color:C.maroon,fontSize:14,marginBottom:12}}>🛒 Input Shopping List</div>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",gap:8,padding:"6px 0",borderBottom:`1px solid ${C.border}`,marginBottom:4}}>
              {["Item","Qty","Unit Cost","Total","Source"].map(h=><span key={h} style={{fontSize:10,fontWeight:700,color:C.muted}}>{h}</span>)}
            </div>
            {inputItems.map((item,i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",gap:8,padding:"9px 0",borderBottom:`1px solid ${C.border}`,fontSize:12,alignItems:"center"}}>
                <span style={{fontWeight:600}}>{item.item}</span>
                <span style={{color:C.muted}}>{item.qty}</span>
                <span>₹{item.unitCost}</span>
                <span style={{color:C.orange,fontWeight:700}}>₹{item.totalCost.toLocaleString()}{item.isPerAcre&&<div style={{fontSize:9,color:C.muted}}>×{item.landAcres}ac</div>}</span>
                <span style={{color:C.muted}}>{item.source}</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"flex-end",padding:"10px 0",borderTop:`2px solid ${C.maroon}`,marginTop:4}}><span style={{fontWeight:700,fontSize:14,color:C.maroon}}>Total: ₹{totalInputCost.toLocaleString()}</span></div>
          </Card>
          <Card>
            <div style={{fontWeight:700,color:C.maroon,fontSize:14,marginBottom:12}}>🧪 Fertilizer Prescription</div>
            {[["Organic",plan.fertilizerPrescription?.organic],["Bio",plan.fertilizerPrescription?.bio],["Chemical",plan.fertilizerPrescription?.chemical],["Schedule",plan.fertilizerPrescription?.schedule]].map(([k,v])=>(
              <div key={k} style={{marginBottom:10}}><div style={{fontSize:12,fontWeight:700,color:C.maroon}}>{k}</div><div style={{fontSize:13,color:C.charcoal}}>{v}</div></div>
            ))}
          </Card>
        </div>)
      )}

      {tab==="produce"&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontWeight:700,color:C.charcoal}}>Produce Entries</div>
            <Btn small variant="green" onClick={()=>setAddingProduce(true)}>+ Add Produce</Btn>
          </div>
          {farmer.produce.length>0&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
              <Card style={{textAlign:"center",padding:12,background:"#EBF5FB"}}><div style={{fontSize:18,fontWeight:800,color:C.blue}}>₹{totalGrossRevenue.toLocaleString()}</div><div style={{fontSize:11,color:C.muted}}>Gross Revenue</div></Card>
              <Card style={{textAlign:"center",padding:12,background:"#FEF0E6"}}><div style={{fontSize:18,fontWeight:800,color:C.orange}}>₹{totalCommission.toLocaleString()}</div><div style={{fontSize:11,color:C.muted}}>Commission</div></Card>
              <Card style={{textAlign:"center",padding:12,background:C.greenPale}}><div style={{fontSize:18,fontWeight:800,color:C.green}}>₹{totalNetRevenue.toLocaleString()}</div><div style={{fontSize:11,color:C.muted}}>Net to Farmer</div></Card>
            </div>
          )}
          {addingProduce&&(
            <Card style={{marginBottom:14,background:C.soilLight}}>
              <div style={{fontWeight:700,color:C.maroon,marginBottom:12}}>New Produce Entry</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <Inp label="Crop" value={newProduce.crop} onChange={v=>setNewProduce(p=>({...p,crop:v}))} options={CROP_OPTIONS} required/>
                <Inp label="Quantity (kg)" value={newProduce.qty} onChange={v=>setNewProduce(p=>({...p,qty:v}))} type="number" required/>
                <Inp label="Stage" value={newProduce.stage} onChange={v=>setNewProduce(p=>({...p,stage:v}))} options={PRODUCE_STAGES} required/>
                <Inp label="Buyer" value={newProduce.buyer} onChange={v=>setNewProduce(p=>({...p,buyer:v}))} options={BUYER_TYPES}/>
                <Inp label="Harvest Date" value={newProduce.harvestDate} onChange={v=>setNewProduce(p=>({...p,harvestDate:v}))} type="date"/>
              </div>
              {newProduce.crop&&newProduce.qty&&<div style={{background:C.greenPale,borderRadius:8,padding:"8px 12px",marginTop:4,marginBottom:10,fontSize:13}}>Est. Revenue: <strong style={{color:C.green}}>₹{Math.round((parseFloat(newProduce.qty)||0)*(MANDI_PER_KG[resolveCropKey(newProduce.crop)]||30)).toLocaleString()}</strong><span style={{color:C.muted,fontSize:11,marginLeft:8}}>@ ₹{MANDI_PER_KG[resolveCropKey(newProduce.crop)]||30}/kg</span></div>}
              <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                <Btn small variant="ghost" onClick={()=>setAddingProduce(false)}>Cancel</Btn>
                <Btn small variant="green" onClick={handleAddProduce}>Save + QR</Btn>
              </div>
            </Card>
          )}
          {farmer.produce.length===0&&!addingProduce?<Card style={{textAlign:"center",padding:32}}><div style={{fontSize:36,marginBottom:8}}>📦</div><div style={{color:C.muted}}>No produce entries yet.</div></Card>:(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {produceItems.map(p=>(
                <Card key={p.id}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8,marginBottom:10}}>
                    <div><div style={{fontWeight:700,fontSize:15}}>{p.crop}</div><div style={{fontSize:12,color:C.muted}}>{p.qty}kg · {p.buyer||"No buyer"}{p.harvestDate?` · ${p.harvestDate}`:""}</div></div>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>{p.qrGenerated&&<Badge color="green">🏷 QR</Badge>}<Badge color={p.stage==="Sold"?"green":p.stage==="Buyer Matched"?"blue":p.stage==="Cold Storage"?"maroon":"gold"}>{p.stage}</Badge></div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,background:C.cream,borderRadius:8,padding:"8px 10px"}}>
                    <div style={{textAlign:"center"}}><div style={{fontSize:13,fontWeight:700}}>₹{p.pricePerKg}</div><div style={{fontSize:10,color:C.muted}}>per kg</div></div>
                    <div style={{textAlign:"center"}}><div style={{fontSize:13,fontWeight:700,color:C.blue}}>₹{p.grossRevenue.toLocaleString()}</div><div style={{fontSize:10,color:C.muted}}>Gross</div></div>
                    <div style={{textAlign:"center"}}><div style={{fontSize:13,fontWeight:700,color:C.orange}}>₹{p.commission.toLocaleString()}</div><div style={{fontSize:10,color:C.muted}}>Commission</div></div>
                    <div style={{textAlign:"center"}}><div style={{fontSize:13,fontWeight:700,color:C.green}}>₹{p.netRevenue.toLocaleString()}</div><div style={{fontSize:10,color:C.muted}}>Net</div></div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {tab==="qr"&&(
        <div>
          <div style={{fontWeight:700,color:C.charcoal,marginBottom:4}}>Seed-to-Spoon QR Traceability</div>
          <div style={{fontSize:13,color:C.muted,marginBottom:16}}>Each batch gets a QR code encoding soil health, harvest data, and buyer info.</div>
          {farmer.produce.filter(p=>p.qrGenerated).length===0?<Card style={{textAlign:"center",padding:32}}><div style={{fontSize:36,marginBottom:8}}>🏷</div><div style={{color:C.muted}}>No QR tags yet.</div><Btn small variant="primary" style={{marginTop:12}} onClick={()=>setTab("produce")}>Go to Produce →</Btn></Card>:farmer.produce.filter(p=>p.qrGenerated).map(p=><QRCard key={p.id} produce={p} farmer={farmer}/>)}
          <Card style={{background:C.maroonDark,marginTop:14}}>
            <div style={{color:C.goldLight,fontWeight:700,fontSize:13,marginBottom:6}}>🔗 Squire Verified Standard</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.75)",lineHeight:1.6}}>Each QR tag encodes: Farmer ID · Crop · Batch weight · Harvest date · SOC at harvest · Buyer channel · Plan score.</div>
          </Card>
        </div>
      )}

      {tab==="machinery"&&<MachineryTab farmer={farmer} rentals={farmerRentals} onAddRental={onAddRental}/>}

      {tab === "economics" && (
        <div>
          {/* Sub-navigation Switcher inside the Economics Main Tab */}
          <div style={{ display: "flex", gap: 2, borderBottom: `2px solid ${C.border}`, marginBottom: 18 }}>
            {[
              ["quick", "💵 Quick Snapshot"],
              ["terminal", "📐 Econometric Terminal"]
            ].map(([k, l]) => (
              <button 
                key={k} 
                onClick={() => setEcoSubTab(k)} 
                style={{ 
                  padding: "8px 14px", background: "none", border: "none", cursor: "pointer", 
                  fontWeight: ecoSubTab === k ? 700 : 400, 
                  color: ecoSubTab === k ? C.maroon : C.muted, 
                  borderBottom: ecoSubTab === k ? `2px solid ${C.maroon}` : "2px solid transparent", 
                  marginBottom: -2, fontSize: 13 
                }}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Conditional Sub-View Router Outlet */}
          {ecoSubTab === "quick" && (
            <EconomicsTab 
              farmer={farmer} 
              plan={plan} 
              machineryRentalCost={machineryRentalCost} 
            />
          )}
          {ecoSubTab === "terminal" && (
            <EconometricProjectionTerminal 
              farmer={farmer} 
              plan={plan} 
              actualSeason={{ totalInputCost, totalGrossRevenue, totalNetRevenue, machineryRentalCost, netPL }}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ─── REPORTS ─────────────────────────────────────────────────────
function Reports({ farmers, rentals, onBack }) {
  const [tab, setTab]=useState("overview");
  const allProduce=farmers.flatMap(f=>f.produce);
  const assessed=farmers.filter(f=>f.planGenerated).length;
  const sold=allProduce.filter(p=>p.stage==="Sold").length;
  const totalRentalRevenue=rentals.filter(r=>r.status==="Completed").reduce((a,r)=>a+r.totalCost,0);
  const confirmedRentals=rentals.filter(r=>r.status==="Confirmed").length;
  const farmerStats=farmers.map(f=>({...f,drs:calcDRS(f),profit:calcProfit(f),pest:calcPest(f),weather:calcWeather(f)}));
  const avgDRS=Math.round(farmerStats.reduce((a,f)=>a+f.drs.drs,0)/Math.max(farmerStats.length,1));
  const avgPest=Math.round(farmerStats.reduce((a,f)=>a+f.pest.pct,0)/Math.max(farmerStats.length,1));
  const totalNP=farmerStats.reduce((a,f)=>a+f.profit.reduce((b,p)=>b+p.netProfit,0),0);
  const totalRB=farmerStats.reduce((a,f)=>a+f.profit.reduce((b,p)=>b+p.restorativeBonus,0),0);

  const TABS=[{key:"overview",label:"📊 Overview"},{key:"soil",label:"🌱 Soil Risk"},{key:"profit",label:"💰 Profitability"},{key:"pest",label:"🐛 Pest Index"},{key:"weather",label:"🌦 Weather"}];

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
        <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:C.muted}}>←</button>
        <div><div style={{fontWeight:800,fontSize:20,color:C.charcoal}}>Statistical Reports</div><div style={{fontSize:13,color:C.muted}}>Digital Brain · Kanpur / Bundelkhand Pilot</div></div>
      </div>
      <div style={{display:"flex",gap:2,borderBottom:`2px solid ${C.border}`,marginBottom:20,overflowX:"auto"}}>
        {TABS.map(t=><button key={t.key} onClick={()=>setTab(t.key)} style={{padding:"8px 12px",background:"none",border:"none",cursor:"pointer",fontWeight:tab===t.key?700:400,color:tab===t.key?C.maroon:C.muted,borderBottom:tab===t.key?`2px solid ${C.maroon}`:"2px solid transparent",marginBottom:-2,fontSize:12,whiteSpace:"nowrap"}}>{t.label}</button>)}
      </div>

      {tab==="overview"&&(
        <div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
            {[["👨‍🌾","Farmers",farmers.length,C.maroon],["🧠","Plans",assessed,C.green],["📈","Assessment %",`${Math.round((assessed/Math.max(farmers.length,1))*100)}%`,C.gold],["🌾","Land (Ha)",farmers.reduce((a,f)=>a+f.land,0).toFixed(1),C.green],["⚠️","Avg DRS",avgDRS,avgDRS>50?C.red:avgDRS>30?C.orange:C.green],["🐛","Avg Pest",`${avgPest}%`,avgPest>60?C.red:avgPest>40?C.orange:C.green],["📦","Produce",allProduce.length,C.blue],["✅","Sold",sold,C.green],["🌱","Rest. Uplift",`₹${(totalRB/1000).toFixed(1)}K`,C.green]].map(([icon,l,v,c])=>(
              <Card key={l} style={{padding:12,textAlign:"center"}}><div style={{fontSize:18}}>{icon}</div><div style={{fontSize:18,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:10,color:C.muted,lineHeight:1.3}}>{l}</div></Card>
            ))}
          </div>
          <Card style={{marginBottom:14}}>
            <div style={{fontWeight:700,color:C.maroon,fontSize:13,marginBottom:12}}>📦 Produce Pipeline</div>
            {[["Harvested",allProduce.filter(p=>p.stage==="Harvested").length,C.gold],["Cold Storage",allProduce.filter(p=>p.stage==="Cold Storage").length,C.blue],["Buyer Matched",allProduce.filter(p=>p.stage==="Buyer Matched").length,C.orange],["Sold",sold,C.green]].map(([l,count,color])=>(
              <StatBar key={l} label={l} value={count} max={Math.max(allProduce.length,1)} color={color} suffix={` batch${count!==1?"es":""}`}/>
            ))}
          </Card>
          <Card style={{background:C.maroonDark}}>
            <div style={{color:C.goldLight,fontWeight:700,fontSize:13,marginBottom:8}}>📋 Cluster Summary</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.85)",lineHeight:2}}>
              Avg DRS: <strong style={{color:C.goldLight}}>{avgDRS}/100</strong> · Avg Pest: <strong style={{color:C.goldLight}}>{avgPest}%</strong><br/>
              Net Profit: <strong style={{color:C.goldLight}}>₹{(totalNP/1000).toFixed(1)}K</strong> · Restorative Uplift: <strong style={{color:"#A8D8A8"}}>+₹{(totalRB/1000).toFixed(1)}K</strong><br/>
              Machinery Revenue: <strong style={{color:C.goldLight}}>₹{totalRentalRevenue}</strong> · Active Bookings: <strong style={{color:C.goldLight}}>{confirmedRentals}</strong>
            </div>
          </Card>
        </div>
      )}

      {tab==="soil"&&(
        <div>
          <Card style={{marginBottom:14,background:"#F0F4FF"}}>
            <div style={{fontWeight:700,color:C.maroon,fontSize:13,marginBottom:6}}>Model 1 — Soil Degradation Risk Score (DRS)</div>
            <FormulaChip text={"DRS = 100 − [0.30·(N/400) + 0.20·(P/80) + 0.15·(K/400) + 0.35·(SOC/1.2) + soil_adj] × 100"}/>
          </Card>
          {farmerStats.map(f=>(
            <Card key={f.id} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div><div style={{fontWeight:700,fontSize:14}}>{f.name}</div><div style={{fontSize:12,color:C.muted}}>{f.village} · {f.soilType} · SOC {f.soc}%</div></div>
                <div style={{textAlign:"right"}}><div style={{fontSize:28,fontWeight:800,color:f.drs.color}}>{f.drs.drs}</div><Badge color={f.drs.grade==="Critical"?"maroon":f.drs.grade==="High"?"orange":f.drs.grade==="Moderate"?"gold":"green"}>{f.drs.grade}</Badge></div>
              </div>
              <StatBar label="N" value={f.nitrogen} max={400} color={f.nitrogen<150?C.red:f.nitrogen<250?C.orange:C.green} suffix=" kg/ha"/>
              <StatBar label="P" value={f.phosphorus} max={80} color={f.phosphorus<20?C.red:f.phosphorus<40?C.orange:C.green} suffix=" kg/ha"/>
              <StatBar label="K" value={f.potassium} max={400} color={f.potassium<150?C.red:f.potassium<280?C.orange:C.green} suffix=" kg/ha"/>
              <StatBar label="SOC" value={f.soc*100} max={120} color={f.soc<0.3?C.red:f.soc<0.5?C.orange:C.green} suffix="%"/>
            </Card>
          ))}
        </div>
      )}

      {tab==="profit"&&(
        <div>
          <Card style={{marginBottom:14,background:"#F0F4FF"}}>
            <div style={{fontWeight:700,color:C.maroon,fontSize:13,marginBottom:6}}>Model 2 — Crop Profitability Forecast</div>
            <FormulaChip text={"Yield = BaseYield × WaterMult × SoilMult × NMult × Land\nGrossRev = Yield × MandiPrice (e-NAM Jun 2026)\nNetProfit = GrossRev − 42%\nRestorativeBonus = NetProfit × 18%"}/>
          </Card>
          {farmerStats.map(f=>(
            <Card key={f.id} style={{marginBottom:12}}>
              <div style={{fontWeight:700,fontSize:14,marginBottom:2}}>{f.name}</div>
              <div style={{fontSize:12,color:C.muted,marginBottom:10}}>{f.land}Ha · {f.waterAvail}</div>
              {f.profit.map((p,i)=>(
                <div key={i} style={{background:C.cream,borderRadius:8,padding:10,marginBottom:8}}>
                  <div style={{fontWeight:700,fontSize:13,color:C.green,marginBottom:6}}>{p.crop}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,fontSize:12}}>
                    <div><span style={{color:C.muted}}>Yield: </span><strong>{p.yieldQtl} qtl</strong></div>
                    <div><span style={{color:C.muted}}>Price: </span><strong>₹{p.price}/qtl</strong></div>
                    <div><span style={{color:C.muted}}>Gross: </span><strong style={{color:C.blue}}>₹{p.grossRev.toLocaleString()}</strong></div>
                    <div><span style={{color:C.muted}}>Net: </span><strong style={{color:C.green}}>₹{p.netProfit.toLocaleString()}</strong></div>
                  </div>
                </div>
              ))}
            </Card>
          ))}
          <Card style={{background:"#EBF8F0"}}>
            <div style={{fontWeight:700,color:C.green,fontSize:12,marginBottom:4}}>Cluster Totals</div>
            <div style={{fontSize:12}}>Net Profit: <strong>₹{totalNP.toLocaleString()}</strong> · With Premium: <strong style={{color:C.green}}>₹{(totalNP+totalRB).toLocaleString()}</strong></div>
          </Card>
        </div>
      )}

      {tab==="pest"&&(
        <div>
          <Card style={{marginBottom:14,background:"#F0F4FF"}}>
            <div style={{fontWeight:700,color:C.maroon,fontSize:13,marginBottom:6}}>Model 3 — Pest Infestation Risk Index (Stochastic)</div>
            <FormulaChip text={"P(infestation) = BaseRate × WaterMod × MonocropMod × SOCMod\nMonocrop: 1crop=1.6x, 2crops=1.2x, 3+crops=0.9x"}/>
          </Card>
          {farmerStats.map(f=>(
            <Card key={f.id} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div><div style={{fontWeight:700,fontSize:14}}>{f.name}</div><div style={{fontSize:12,color:C.muted}}>Last crop: {f.pest.lastCrop} · Pests: {f.pest.pests.join(", ")}</div></div>
                <div style={{textAlign:"right"}}><div style={{fontSize:28,fontWeight:800,color:f.pest.color}}>{f.pest.pct}%</div><Badge color={f.pest.grade==="High"?"maroon":f.pest.grade==="Moderate"?"gold":"green"}>{f.pest.grade} Risk</Badge></div>
              </div>
              <StatBar label="Infestation probability" value={f.pest.pct} max={100} color={f.pest.color} suffix="%"/>
            </Card>
          ))}
        </div>
      )}

      {tab==="weather"&&(
        <div>
          <Card style={{marginBottom:14,background:"#F0F4FF"}}>
            <div style={{fontWeight:700,color:C.maroon,fontSize:13,marginBottom:6}}>Model 4 — Wet/Dry Week Calendar (Markov Chain)</div>
            <FormulaChip text={"P(wet|wet) = ww_transition × base_monthly_wet_prob\nCalibrated per water source. Jul=85%, Aug=80%, Sep=60%"}/>
          </Card>
          {farmerStats.slice(0,1).map(f=>(
            <div key={f.id}>
              <div style={{fontWeight:700,color:C.charcoal,marginBottom:8,fontSize:13}}>{f.name} ({f.waterAvail})</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
                {f.weather.map((w,i)=>(
                  <Card key={i} style={{padding:10,background:w.isSowing?"#EBF8F0":w.isHarvest?"#FEF3D0":C.white,border:w.isSowing?`1.5px solid ${C.green}`:w.isHarvest?`1.5px solid ${C.gold}`:`1px solid ${C.border}`}}>
                    <div style={{fontWeight:700,fontSize:12,marginBottom:4}}>{w.month} {w.isSowing?"🌱":w.isHarvest?"🌾":""}</div>
                    <div style={{display:"flex",gap:6,marginBottom:4}}>
                      <span style={{fontSize:11,background:"#EBF5FB",color:C.blue,borderRadius:4,padding:"1px 6px"}}>💧{w.wetWeeks}W</span>
                      <span style={{fontSize:11,background:"#FEF3D0",color:C.soil,borderRadius:4,padding:"1px 6px"}}>☀️{w.dryWeeks}W</span>
                    </div>
                    <div style={{fontSize:10,color:C.muted,lineHeight:1.3}}>{w.action}</div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MACHINERY HUB ───────────────────────────────────────────────
function MachineryHub({ rentals, onBack, onAddRental, farmers }) {
  const [booking, setBooking]=useState(null);
  const [form, setForm]=useState({farmerId:"",startDate:"",endDate:"",hours:""});
  const set=k=>v=>setForm(f=>({...f,[k]:v}));
  const totalCost=booking?Math.round(booking.ratePerHour*(parseInt(form.hours)||0)):0;
  const sf=farmers.find(f=>f.id===form.farmerId);
  const handleConfirm=()=>{
    if(!form.farmerId||!form.startDate||!form.endDate||!form.hours) return;
    onAddRental({id:"R"+Date.now(),farmerId:form.farmerId,farmerName:sf?.name||"",equipment:booking.name,startDate:form.startDate,endDate:form.endDate,hours:parseInt(form.hours),ratePerHour:booking.ratePerHour,totalCost,status:"Confirmed"});
    setBooking(null); setForm({farmerId:"",startDate:"",endDate:"",hours:""});
  };
  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
        <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:C.muted}}>←</button>
        <div><div style={{fontWeight:800,fontSize:20,color:C.charcoal}}>Machinery Rental Hub</div><div style={{fontSize:13,color:C.muted}}>Squire Outlet — Jhansi Cluster</div></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:20}}>
        <Card style={{textAlign:"center",padding:14}}><div style={{fontSize:22,fontWeight:800,color:C.green}}>₹{rentals.filter(r=>r.status==="Completed").reduce((a,r)=>a+r.totalCost,0)}</div><div style={{fontSize:11,color:C.muted}}>Revenue Collected</div></Card>
        <Card style={{textAlign:"center",padding:14}}><div style={{fontSize:22,fontWeight:800,color:C.blue}}>{rentals.filter(r=>r.status==="Confirmed").length}</div><div style={{fontSize:11,color:C.muted}}>Active Bookings</div></Card>
        <Card style={{textAlign:"center",padding:14}}><div style={{fontSize:22,fontWeight:800,color:C.maroon}}>{EQUIPMENT_LIST.filter(e=>e.available).length}</div><div style={{fontSize:11,color:C.muted}}>Available Now</div></Card>
      </div>
      {booking&&(
        <Card style={{marginBottom:16,background:C.soilLight,border:`1.5px solid ${C.gold}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontWeight:700,color:C.maroon,fontSize:15}}>{booking.icon} Book: {booking.name}</div>
            <button onClick={()=>setBooking(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:C.muted}}>✕</button>
          </div>
          <Inp label="Select Farmer" value={form.farmerId} onChange={set("farmerId")} options={farmers.map(f=>f.id)} required hint={sf?sf.name:"Choose farmer"}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            <Inp label="Start Date" value={form.startDate} onChange={set("startDate")} type="date" required/>
            <Inp label="End Date" value={form.endDate} onChange={set("endDate")} type="date" required/>
            <Inp label="Hours" value={form.hours} onChange={set("hours")} type="number" required/>
          </div>
          {form.hours&&<div style={{background:C.greenPale,borderRadius:8,padding:"10px 14px",marginBottom:12,fontSize:14}}>Est: <strong style={{color:C.green}}>₹{totalCost}</strong></div>}
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}><Btn small variant="ghost" onClick={()=>setBooking(null)}>Cancel</Btn><Btn small variant="green" onClick={handleConfirm} disabled={!form.farmerId||!form.startDate||!form.endDate||!form.hours}>Confirm</Btn></div>
        </Card>
      )}
      <div style={{fontWeight:700,color:C.charcoal,fontSize:14,marginBottom:12}}>Available Equipment</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
        {EQUIPMENT_LIST.map(eq=>(
          <Card key={eq.name} style={{padding:14,opacity:eq.available?1:0.55}}>
            <div style={{fontSize:26,marginBottom:6}}>{eq.icon}</div>
            <div style={{fontWeight:700,fontSize:13,marginBottom:2}}>{eq.name}</div>
            <div style={{fontSize:11,color:C.muted,marginBottom:8,lineHeight:1.4}}>{eq.desc}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:13,fontWeight:700,color:C.green}}>₹{eq.ratePerHour}/hr</span>{eq.available?<Btn small variant="primary" onClick={()=>setBooking(eq)}>Book</Btn>:<Badge color="gray">Unavailable</Badge>}</div>
          </Card>
        ))}
      </div>
      <div style={{fontWeight:700,color:C.charcoal,fontSize:14,marginBottom:12}}>All Rentals</div>
      {rentals.length===0?<Card style={{textAlign:"center",padding:24}}><div style={{color:C.muted}}>No rentals yet.</div></Card>:
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {rentals.map(r=>(
            <Card key={r.id} style={{padding:14}}>
              <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                <div><div style={{fontWeight:700,fontSize:14}}>{r.equipment}</div><div style={{fontSize:12,color:C.muted}}>{r.farmerName} · {r.startDate} · {r.hours}hrs</div></div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontWeight:700,color:C.green}}>₹{r.totalCost}</span><Badge color={r.status==="Completed"?"green":r.status==="Confirmed"?"blue":"gold"}>{r.status}</Badge></div>
              </div>
            </Card>
          ))}
        </div>
      }
    </div>
  );
}

// ─── AGRICULTURAL SEASONS AND CROP CLASSIFICATION MATRIX ──────────
const SEASON_CROPS_MAP = {
  Kharif: {
    Cereals: ["Paddy", "Maize", "Pearl Millet", "Sorghum"],
    Pulses: ["Arhar (Pigeon Pea)", "Green Gram", "Black Gram", "Cowpea"],
    Oilseeds: ["Groundnut", "Sesame", "Soybean", "Castor"],
    Commercial: ["Sugarcane", "Sweet Corn", "Baby Corn", "Tobacco (limited)"],
    Vegetables: ["Tomato", "Chilli", "Capsicum", "Brinjal", "Cucumber", "Bottle Gourd", "Bitter Gourd", "Ridge Gourd", "Sponge Gourd", "Pumpkin", "Watermelon", "Muskmelon", "Okra", "Sweet Potato", "Elephant Foot Yam", "Colocasia"],
    Fruits: ["Papaya", "Pomegranate", "Dragon Fruit"],
    "Medicinal & Aromatic": ["Lemongrass", "Citronella", "Palmarosa", "Moringa", "Tulsi", "Aloe Vera"],
    Floriculture: ["Marigold", "Jasmine", "Crossandra"],
    Spices: ["Ginger", "Turmeric", "Chilli"]
  },
  Rabi: {
    Cereals: ["Wheat", "Barley", "Oats"],
    Pulses: ["Chickpea", "Lentil", "Field Pea", "Lathyrus"],
    Oilseeds: ["Mustard", "Rapeseed", "Linseed", "Sunflower"],
    Commercial: ["Potato", "Stevia"],
    Vegetables: ["Onion", "Garlic", "Cauliflower", "Cabbage", "Broccoli", "Knol Khol", "Radish", "Carrot", "Beetroot", "Turnip", "French Bean", "Cluster Bean", "Pea", "Spinach"],
    Fruits: ["Strawberry"],
    "Medicinal & Aromatic": ["Ashwagandha", "Safed Musli", "Kalmegh", "Isabgol", "Senna", "Brahmi"],
    Floriculture: ["Rose", "Gladiolus", "Tuberose", "Chrysanthemum", "Gerbera", "Carnation", "Lilium", "Orchid", "Gaillardia", "Dahlia", "Petunia", "Calendula", "Zinnia"],
    Spices: ["Coriander", "Fennel", "Fenugreek", "Cumin", "Garlic", "Chilli"]
  },
  Perennial: {
    Fruits: ["Mango", "Guava", "Lemon", "Sweet Lime", "Orange", "Ber", "Banana", "Jackfruit", "Mulberry", "Jamun", "Custard Apple", "Fig", "Bael", "Karonda", "Phalsa"],
    Commercial: ["Sugarcane", "Stevia"],
    "Medicinal & Aromatic": ["Mentha", "Aloe Vera", "Tulsi", "Moringa", "Brahmi"],
    Floriculture: ["Rose", "Jasmine", "Orchid"],
    Vegetables: ["Moringa", "Colocasia", "Elephant Foot Yam"]
  }
};

const generateHistoricalData = (crop, days = 30) => {
  const spot = (MANDI_PER_KG[resolveCropKey(crop)] || 30.00) * 100;
  const arr = [];
  const seed = crop.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  for (let i = 0; i < days; i++) {
    const factor = Math.sin(seed + i * 0.45) * 0.015 + 0.001; 
    const stepVal = i === 0 ? spot * 0.94 : arr[i - 1] * (1 + factor);
    arr.push(Math.round(stepVal));
  }
  arr[arr.length - 1] = Math.round(spot);
  return arr;
};

const getFallbackSpeculation = (crop, season) => {
  let risk = "Medium";
  let rec = "Store in Squire Cold Storage for 90-120 days";
  let score = 85;

  if (season === "Kharif") {
    risk = "High";
    rec = "Store in Squire hermetic bags & liquidate 40% post-Diwali";
    score = 82;
  } else if (season === "Rabi") {
    risk = "Low";
    rec = "Hold in dry warehouse; wait for off-season terminal price spikes";
    score = 89;
  } else {
    risk = "Medium";
    rec = "Establish direct retail linkage with Kanpur food processors";
    score = 86;
  }

  const paragraph1 = `Wholesale rates for ${crop} during the upcoming ${season} season across northern terminal corridors are being significantly impacted by macro-economic factors. Diesel prices at ₹94.5/L are escalating shipping and tillage rates by approximately 6-8%, which is creating a rigid price floor at local Mandis. Driven by a domestic food inflation rate of 5.4%, buyer demand remains highly robust, though centralized stock limits and state procurement targets may cap the peak price ceilings at urban markets like Kanpur and Azadpur.`;

  const paragraph2 = `Moisture patterns in the semi-arid Fatehpur belt suggest highly localized rainfall variance. Critical growth phases of ${crop} could face sudden moisture stress or thermal anomalies, raising the risk of pest indices. Production costs have also ticked upward due to a rise in the global DAP/Potash fertilizer index, squeezing the margin of smallholders who liquidate immediately at harvest time. Risk volatility for this crop cycle is categorized as ${risk}.`;

  const paragraph3 = `We strongly recommend that farmers avoid distress sales during the high-arrival peak harvest. Leveraging Squire's optimized storage facilities will enable farmers to wait out the transient supply glut. Our econometric algorithm suggests holding your ${crop} inventory for 90 to 120 days to capture off-season arbitrage premiums of up to 14-18%, easily offsetting the nominal warehousing and interest costs on your Kisan Credit Card (KCC) loans.`;

  return {
    speculativeSummary: `${paragraph1}\n\n${paragraph2}\n\n${paragraph3}`,
    riskRating: risk,
    recommendedAction: rec,
    confidenceScore: score,
    isLocalModel: true
  };
};

// ─── DASHBOARD TERMINAL MODULE ───────────────────────────────────
function Dashboard({ activeSection, farmers, onSelect, onNew, onViewReports, onViewMachinery }) {
  const [mandiRange, setMandiRange] = useState("7D");
  const [searchQ, setSearchQ] = useState("");
  
  // Mandi Interactive Matrix & Speculation State
  const [mandiSeason, setMandiSeason] = useState("Kharif");
  const [mandiCategory, setMandiCategory] = useState("Cereals");
  const [mandiCrop, setMandiCrop] = useState("Paddy");
  const [targetMandi, setTargetMandi] = useState(null);
  
  const [aiSpeculation, setAiSpeculation] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const handleSeasonChange = (season) => {
    setMandiSeason(season);
    const categories = Object.keys(SEASON_CROPS_MAP[season]);
    const firstCategory = categories[0];
    setMandiCategory(firstCategory);
    const crops = SEASON_CROPS_MAP[season][firstCategory];
    setMandiCrop(crops[0]);
    setTargetMandi(null);
  };

  const handleCategoryChange = (category) => {
    setMandiCategory(category);
    const crops = SEASON_CROPS_MAP[mandiSeason][category];
    setMandiCrop(crops[0]);
    setTargetMandi(null);
  };

  useEffect(() => {
    if (activeSection === "market" && mandiCrop) {
      let isCancelled = false;
      setAiLoading(true);
      setAiError(null);
      setAiSpeculation(null);

      const prompt = `You are the Squire Digital Brain. Analyze the commodity market outlook for the crop "${mandiCrop}" during the upcoming "${mandiSeason}" season for a farmer located in Fatehpur, Bundelkhand, Uttar Pradesh.

Consider the following agricultural and macro-economic factors:
1. Macro-Economics: Current food inflation at 5.4%, RBI repo rate (6.5%), KCC agri credits.
2. Production Costs: Diesel price at ₹94.5/litre (affects tillage and irrigation pumping), rising DAP/Potash fertilizer index.
3. Weather Outlook: Semi-arid Bundelkhand moisture patterns, temperature anomalies, monsoon progression.
4. Supply-Demand dynamics for this crop across Indian terminal markets (Azadpur, Kanpur, Vashi).

Write a highly expert, clinical, 3-paragraph market speculation and risk advisory report for the farmer:
- Paragraph 1: Price Outlook & Driving Forces (How fuel, weather, and macro inflation are pushing or capping prices).
- Paragraph 2: Risk and Volatility Assessment (Pest indices, weather spikes, moisture stress during critical growth stages).
- Paragraph 3: Actionable Storage and Liquidation Strategy (Should they sell spot at harvest, store in Squire cold storage for 3-5 months to arbitrage off-season premiums, or forward contract with FPOs).

Return ONLY a valid, raw JSON object matching this schema. Do not include markdown code fences, backticks, or any leading/trailing commentary. It must parse directly:
{
  "speculativeSummary": "Your expert 3-paragraph analysis here with double newlines (\\\\n\\\\n) separating paragraphs.",
  "riskRating": "Low" | "Medium" | "High",
  "recommendedAction": "e.g., Hold in Cold Storage for 90 days",
  "confidenceScore": 85
}`;

      fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Server error " + res.status);
          return res.json();
        })
        .then((data) => {
          if (isCancelled) return;
          if (!data.text) throw new Error("Empty response from server");
          
          const jsonMatch = data.text.match(/\\{[\\s\\S]*\\}/);
          if (!jsonMatch) throw new Error("No JSON found in response");
          
          const parsed = JSON.parse(jsonMatch[0]);
          setAiSpeculation(parsed);
          setAiLoading(false);
        })
        .catch((err) => {
          if (isCancelled) return;
          console.warn("Speculation API error (e.g. rate limits), activating offline expert model:", err);
          const fallback = getFallbackSpeculation(mandiCrop, mandiSeason);
          setAiSpeculation(fallback);
          setAiLoading(false);
        });

      return () => {
        isCancelled = true;
      };
    }
  }, [mandiCrop, mandiSeason, activeSection, refetchTrigger]);
  
  // Isolated state configuration to control sidebar visibility transitions smoothly on the front page
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const assessed = farmers.filter(f => f.planGenerated).length;
  const allProduce = farmers.flatMap(f => f.produce);

  const MANDI_DATA = {
    "7D": { labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], wheat: [2280, 2295, 2310, 2305, 2320, 2335, 2340], mustard: [5680, 5700, 5740, 5720, 5760, 5790, 5800], gram: [5020, 5035, 5060, 5045, 5070, 5090, 5100] },
    "30D": { labels: ["W1", "W2", "W3", "W4"], wheat: [2150, 2210, 2260, 2340], mustard: [5400, 5500, 5650, 5800], gram: [4800, 4900, 5000, 5100] },
    "90D": { labels: ["Apr", "May", "Jun"], wheat: [2080, 2190, 2310], mustard: [5150, 5420, 5720], gram: [4600, 4850, 5060] },
  };
  const md = MANDI_DATA[mandiRange];

  const NAV = [
    { id: "overview", icon: "▦", label: "Overview" },
    { id: "market", icon: "↗", label: "Mandi" },
    { id: "seed", icon: "🌱", label: "Seed & Inputs" },
    { id: "farmers", icon: "👥", label: "Farmer Network" },
    { id: "brain", icon: "🧠", label: "Digital Brain" },
    { id: "outlets", icon: "🏪", label: "Squire Outlets" }
  ];

  const TXN = [
    { name: "Ramesh Tiwari", crop: "Wheat", qty: "12 Qtl", price: "₹2,340", mandi: "Jhansi", status: "sold" },
    { name: "Meera Devi", crop: "Mustard", qty: "6 Qtl", price: "₹5,800", mandi: "Jhansi", status: "sold" },
    { name: "Vijay Kushwaha", crop: "Gram", qty: "9 Qtl", price: "₹5,050", mandi: "Banda", status: "transit" },
    { name: "Anita Rajput", crop: "Wheat", qty: "15 Qtl", price: "₹2,310", mandi: "Mahoba", status: "sold" },
    { name: "Mahendra Singh", crop: "Mustard", qty: "4 Qtl", price: "₹5,650", mandi: "Jhansi", status: "pending" },
    { name: "Suresh Yadav", crop: "Gram", qty: "7 Qtl", price: "₹4,980", mandi: "Banda", status: "sold" }
  ];

  const SEED_INV = [
    { name: "Wheat HD-3086", stock: 38, threshold: 25, max: 40, status: "healthy" },
    { name: "Gram Pusa-256", stock: 14, threshold: 15, max: 24, status: "low" },
    { name: "Mustard Pusa Bold", stock: 9, threshold: 12, max: 24, status: "critical" },
    { name: "Bajra HHB-67", stock: 22, threshold: 10, max: 24, status: "healthy" },
    { name: "Moong Pusa Vishal", stock: 11, threshold: 10, max: 15, status: "healthy" }
  ];

  const INV_C = { healthy: "#4A7C59", low: "#C8963E", critical: "#B2402F" };
  const SB_C = { sold: { bg: "#DCEEE1", color: "#2F6B45", label: "Sold" }, transit: { bg: "#DCEAF2", color: "#3B6E91", label: "In Transit" }, pending: { bg: "#F7E8C9", color: "#8A5A12", label: "Pending" } };
  const filteredTxn = TXN.filter(r => !searchQ || Object.values(r).join(" ").toLowerCase().includes(searchQ.toLowerCase()));
  const filteredFarmers = farmers.filter(f => !searchQ || `${f.name} ${f.village} ${f.district} ${f.cropHistory}`.toLowerCase().includes(searchQ.toLowerCase()));

  const scrollTo = (id) => { setActiveSection(id); };

  return (
    <div style={{ width: "100%", boxSizing: "border-box" }}>
        {/* Top Header Grid */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, marginBottom: 22, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8A7C6C", marginBottom: 4 }}>Bundelkhand Pilot · Jhansi Cluster</div>
            <h1 style={{ fontFamily: "serif", fontWeight: 600, fontSize: 28, color: "#2B211B" }}>Good morning, <em style={{ fontStyle: "italic", color: "#6B1E3B", fontWeight: 500 }}>Harshit</em></h1>
            <div style={{ fontSize: 13, color: "#8A7C6C", marginTop: 4 }}>Live Dashboard Terminal Hub · Isolated Workspace Viewports</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #E8DFD2", borderRadius: 10, padding: "8px 12px", minWidth: 220 }}>
              <span style={{ fontSize: 14, color: "#8A7C6C" }}>🔍</span>
              <input value={searchQ} onChange={e => setSearchQ(e.target.value)} type="text" placeholder="Search farmers, crops, Mandi…" style={{ border: "none", outline: "none", background: "transparent", fontSize: 13, width: "100%", color: "#2B211B" }} />
            </div>
          </div>
        </div>

        {/* 1. DASHBOARD PAGE VIEWPORT */}
        {activeSection === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            
            {/* Crop Season Timeline Progress Bar */}
            <div style={{ display: "flex", alignItems: "center", background: "#fff", border: "1px solid #E8DFD2", borderRadius: 12, padding: "14px 20px" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#8A7C6C", letterSpacing: "0.05em", textTransform: "uppercase", marginRight: 18, whiteSpace: "nowrap" }}>Crop Season</div>
              <div style={{ flex: 1, display: "flex", gap: 6, paddingTop: 22 }}>
                {[{ label: "Kharif • Jun–Oct", flex: 0.42, active: true }, { label: "Rabi • Oct–Mar", flex: 0.42, active: false }, { label: "Zaid • Mar–Jun", flex: 0.16, active: false }].map((seg, i) => (
                  <div key={i} style={{ flex: seg.flex, height: 8, borderRadius: 5, background: seg.active ? "linear-gradient(90deg,#C8963E 0%,#4A7C59 100%)" : "#E8DFD2", position: "relative" }}>
                    <span style={{ position: "absolute", top: -18, left: 0, fontSize: 10.5, fontWeight: 600, color: seg.active ? "#6B1E3B" : "#8A7C6C", whiteSpace: "nowrap" }}>{seg.label}</span>
                    {seg.active && <div style={{ position: "absolute", top: -4, left: "6%", width: 14, height: 14, borderRadius: "50%", background: "#6B1E3B", border: "2.5px solid #fff", boxShadow: "0 0 0 2px #6B1E3B" }} />}
                  </div>
                ))}
              </div>
            </div>

            {/* Live Warning Action Banner */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F7E8C9", color: "#8A5A12", border: "1px solid #EBD49C", borderRadius: 11, padding: "11px 16px", fontSize: 13, fontWeight: 500 }}>
              <span>⚠️ <strong>2 seed varieties</strong> below reorder threshold • <strong>1 Mandi price alert</strong> needs optimization review</span>
            </div>

            {/* Primary Metric Summary Cards Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {[{ label: "Active Farmers", value: `${farmers.length + 309}`, delta: "▲ 18 this month", up: true }, { label: "Outlet Revenue • MTD", value: "₹4.82L", delta: "▲ 12% vs last month", up: true }, { label: "Soil Health Index", value: "68/100", delta: "▲ 6 pts vs baseline", up: true }, { label: "Seed Stock Health", value: "82%", delta: "⚠️ 2 items low", up: false }].map((k, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #E8DFD2", borderRadius: 14, padding: "18px 20px" }}>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: "#8A7C6C", textTransform: "uppercase" }}>{k.label}</div>
                  <div style={{ fontFamily: "monospace", fontSize: 26, fontWeight: 600, color: "#2B211B", marginTop: 2 }}>{k.value}</div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11.5, fontWeight: 600, marginTop: 2, color: k.up ? "#2F6B45" : "#8A5A12" }}>{k.delta}</div>
                </div>
              ))}
            </div>

            {/* COMPREHENSIVE BALANCED GRID: Added Suggestion 2 & 3 Reactively */}
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1.4fr 1.2fr 1.6fr", gap: 18, alignItems: "stretch", width: "100%" }}>

              {/* BOX A — Village Cluster Snapshot */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", height: "100%", minHeight: 420 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#8A7C6C", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>👥 Village Cluster Snapshot</div>
                {Object.entries(farmers.reduce((acc, f) => { acc[f.village] = (acc[f.village] || 0) + 1; return acc; }, {})).slice(0, 4).map(([village, count]) => (
                  <div key={village} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px dashed ${C.border}`, fontSize: 12.5 }}>
                    <span style={{ color: "#2B211B" }}>{village}</span>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, color: C.maroon }}>{count} farmer{count > 1 ? "s" : ""}</span>
                  </div>
                ))}
              </div>

              {/* BOX B — Live Mandi Ticker */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", height: "100%", minHeight: 420 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#8A7C6C", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>📈 Live Mandi Ticker</div>
                {Object.entries(md).filter(([k]) => k !== "labels").map(([crop, priceArr]) => (
                  <div key={crop} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px dashed ${C.border}`, fontSize: 12.5 }}>
                    <span style={{ textTransform: "capitalize", color: "#2B211B" }}>{crop}</span>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, color: C.green }}>₹{priceArr[priceArr.length - 1].toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* BOX C — Optimized Unified Operational Alerts Column Stack */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, height: "100%", minHeight: 420, boxSizing: "border-box" }}>

                {/* Slot C.1: Soil Degradation Real-time Filter */}
                <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: "10px 14px", flexShrink: 0 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: "#8A7C6C", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>⚠️ Critical Soil Risk Tracker</div>
                  {farmers.filter(f => f.soc < 0.4).slice(0, 2).map(f => {
                    const d = calcDRS(f);
                    return (
                      <div key={f.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 8px", background: "#FDEDEC", borderRadius: 6, marginBottom: 4 }}>
                        <span style={{ fontSize: 11.5, fontWeight: 600, color: "#2B211B" }}>{f.name}</span>
                        <span style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 11.5, color: C.red }}>DRS {d.drs}/100</span>
                      </div>
                    );
                  })}
                </div>

                {/* Slot C.2: Village Champion Dynamic Activity Registry Log */}
                <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: 12, flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: "#8A7C6C", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>👤 Champion Activity Log</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, overflowY: "auto", flex: 1, paddingRight: 4 }}>
                    <div style={{ fontSize: 11, color: "#2B211B", lineHeight: 1.35, paddingBottom: 4, borderBottom: `1px dashed ${C.border}` }}>
                      <strong style={{ color: C.maroon }}>[Cluster 4]</strong> Champion Sonkar initialized soil diagnostic test vectors for Farmer Devi in Mauranipur, Jhansi.
                    </div>
                    <div style={{ fontSize: 11, color: "#2B211B", lineHeight: 1.35 }}>
                      <strong style={{ color: C.maroon }}>[Cluster 1]</strong> Live Onboarding: 12 smallholder registry slots logged this morning.
                    </div>
                  </div>
                </div>

                {/* Slot C.3: Adaptive Present-Month Weather Evaluation Core */}
                {(() => {
                  const sampleFarmer = farmers[0] || INITIAL_FARMERS[0];
                  const weatherArray = calcWeather(sampleFarmer);
                  const currentMonthName = MONTHS[new Date().getMonth()]; 
                  const activeWeather = weatherArray.find(m => m.month === currentMonthName) || weatherArray[6];
                  
                  return (
                    <div style={{ background: "#FFFBF2", border: `1px solid ${C.gold}55`, borderRadius: 14, padding: 10, flexShrink: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: C.soil, textTransform: "uppercase", letterSpacing: "0.05em" }}> 🌦 Present Month Weather Call</span>
                        <span style={{ fontSize: 9.5, background: "#FEF3D0", color: C.soil, padding: "1px 6px", borderRadius: 4, fontWeight: 700 }}>{activeWeather.month} 2026</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#2B211B", lineHeight: 1.4, fontWeight: 500 }}>
                        <strong>Direct:</strong> {activeWeather.action === "Irrigate/Monitor" 
                          ? "High soil moisture. Hold nitrogen top-dressing to prevent leaching losses." 
                          : `Proceed with ${activeWeather.action.toLowerCase()} adjustments.`}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* BOX D — Recent Transactions */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, display:"flex", flexDirection:"column", height:"100%", minHeight:420 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#8A7C6C", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>🧾 Recent Transactions</div>
                {TXN.slice(0, 8).map((r, i) => (
                  <div key={i} style={{ padding: "7px 0", borderBottom: `1px dashed ${C.border}`, fontSize: 11.5 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#2B211B", fontWeight: 600 }}>{r.name}</span>
                      <span style={{ fontFamily: "monospace", color: C.green, fontWeight: 700 }}>{r.price}</span>
                    </div>
                    <div style={{ color: "#8A7C6C", fontSize: 10.5 }}>{r.crop} · {r.qty}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* 2. MANDI INTELLIGENCE AND PRICE PREDICTION TERMINAL VIEWPORT */}
        {activeSection === "market" && (() => {
          const categories = Object.keys(SEASON_CROPS_MAP[mandiSeason]);
          const crops = SEASON_CROPS_MAP[mandiSeason][mandiCategory] || [];

          const resolvedCropKey = resolveCropKey(mandiCrop) || mandiCrop;
          const currentPricePerKg = MANDI_PER_KG[resolvedCropKey] || 30.00;
          const basePricePerQtl = currentPricePerKg * 100;

          const priceHistory = generateHistoricalData(mandiCrop, 30);
          const firstPrice = priceHistory[0];
          const lastPrice = priceHistory[priceHistory.length - 1];
          const priceDiff = lastPrice - firstPrice;
          const trendPct = ((priceDiff / firstPrice) * 100).toFixed(1);
          const isUpTrend = priceDiff >= 0;

          const mandisList = [
            { id: "fatehpur", name: "Fatehpur APMC (Local)", state: "Uttar Pradesh", dist: 5, mult: 0.95, transit: 15, arrivals: 680, trend: "Stable" },
            { id: "kanpur", name: "Kanpur APMC", state: "Uttar Pradesh", dist: 80, mult: 1.01, transit: 75, arrivals: 1450, trend: "Stable" },
            { id: "azadpur", name: "Azadpur APMC", state: "Delhi NCR", dist: 530, mult: 1.12, transit: 240, arrivals: 5100, trend: "Upward" },
            { id: "vashi", name: "Vashi APMC (Mumbai)", state: "Maharashtra", dist: 1350, mult: 1.19, transit: 480, arrivals: 3400, trend: "Upward" },
            { id: "indore", name: "Indore APMC", state: "Madhya Pradesh", dist: 640, mult: 1.04, transit: 290, arrivals: 1850, trend: "Stable" },
            { id: "gondal", name: "Gondal APMC", state: "Gujarat", dist: 1180, mult: 1.09, transit: 380, arrivals: 2200, trend: "Downward" }
          ].map(m => {
            const spotPrice = Math.round(basePricePerQtl * m.mult);
            const netRealizable = spotPrice - m.transit;
            return { ...m, spotPrice, netRealizable };
          });

          const bestMandi = mandisList.reduce((max, m) => m.netRealizable > max.netRealizable ? m : max, mandisList[0]);

          const inflationFactor = 0.054;
          const fuelFactor = 0.068;
          const weatherModifier = mandiSeason === "Kharif" ? 0.08 : -0.02;

          const specLowerLimit = Math.round(basePricePerQtl * (1 + inflationFactor + fuelFactor - 0.04));
          const specUpperLimit = Math.round(basePricePerQtl * (1 + inflationFactor + fuelFactor + weatherModifier + 0.05));
          const confidenceScore = Math.min(95, Math.round(82 + (priceHistory.length / 5) + (mandiSeason === "Rabi" ? 6 : 0)));

          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              
              {/* Hierarchical Crop Selection Matrix Section */}
              <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 22px" }}>
                <div style={{ marginBottom: 16 }}>
                  <h2 style={{ fontFamily: "serif", fontWeight: 600, fontSize: 20, color: C.charcoal, margin: 0 }}>🌾 Crop-Centric Price Discovery Terminal</h2>
                  <div style={{ fontSize: 12.5, color: C.muted, marginTop: 3 }}>Select season, crop category, and commodity to search wholesale markets and trace future projections</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 2.5fr", gap: 18, alignItems: "start" }}>
                  
                  {/* Step 1: Select Season */}
                  <div style={{ borderRight: `1px solid ${C.border}`, paddingRight: 18 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8A7C6C", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Step 1: Select Crop Season</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {["Kharif", "Rabi", "Perennial"].map(season => {
                        const isActive = mandiSeason === season;
                        return (
                          <button
                            key={season}
                            onClick={() => handleSeasonChange(season)}
                            style={{
                              padding: "10px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, textAlign: "left", cursor: "pointer", border: isActive ? `1.5px solid ${C.maroon}` : `1px solid ${C.border}`,
                              background: isActive ? C.cream : "#fff",
                              color: isActive ? C.maroon : C.charcoal,
                              transition: "all 0.15s ease", display: "flex", justifyContent: "space-between", alignItems: "center"
                            }}
                          >
                            <span>{season}</span>
                            <span style={{ fontSize: 11, color: isActive ? C.gold : C.muted }}>{season === "Kharif" ? "🌧 Monsoon" : season === "Rabi" ? "❄ Winter" : "🔄 Annual"}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2: Select Crop Category */}
                  <div style={{ borderRight: `1px solid ${C.border}`, paddingRight: 18 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8A7C6C", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Step 2: Crop Category</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 220, overflowY: "auto", paddingRight: 4 }}>
                      {categories.map(category => {
                        const isActive = mandiCategory === category;
                        return (
                          <button
                            key={category}
                            onClick={() => handleCategoryChange(category)}
                            style={{
                              padding: "9px 12px", borderRadius: 8, fontSize: 12.5, fontWeight: isActive ? 700 : 500, textAlign: "left", cursor: "pointer", border: isActive ? `1.5px solid ${C.maroon}` : `1px solid ${C.border}`,
                              background: isActive ? C.cream : "transparent",
                              color: isActive ? C.maroon : C.muted,
                              transition: "all 0.15s ease", display: "flex", justifyContent: "space-between", alignItems: "center"
                            }}
                          >
                            <span>{category}</span>
                            <span style={{ fontSize: 10, opacity: 0.7 }}>{SEASON_CROPS_MAP[mandiSeason][category]?.length || 0} items</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 3: Select Crop */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8A7C6C", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Step 3: Select Commodity</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxHeight: 220, overflowY: "auto", alignContent: "flex-start", paddingRight: 4 }}>
                      {crops.map(crop => {
                        const isActive = mandiCrop === crop;
                        return (
                          <button
                            key={crop}
                            onClick={() => { setMandiCrop(crop); setTargetMandi(null); }}
                            style={{
                              padding: "8px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer",
                              border: isActive ? `1.5px solid ${C.maroon}` : `1px solid ${C.border}`,
                              background: isActive ? C.maroon : "#fff",
                              color: isActive ? C.white : C.charcoal,
                              transition: "all 0.15s ease"
                            }}
                          >
                            {crop}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>

              {/* Live Price Statistics Block */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                <Card style={{ padding: 14 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>Benchmark Price (Kanpur)</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: C.charcoal, marginTop: 4, fontFamily: "monospace" }}>₹{Math.round(basePricePerQtl * 1.01).toLocaleString()}<span style={{ fontSize: 12, fontWeight: 500, color: C.muted }}>/Qtl</span></div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Based on e-NAM digital spot clearing index</div>
                </Card>
                <Card style={{ padding: 14 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>30D Historical Volatility</div>
                  <div style={{ display: "flex", alignItems: "center", justifyItems: "center", gap: 10, marginTop: 4 }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: isUpTrend ? C.green : C.red, fontFamily: "monospace" }}>
                      {isUpTrend ? "▲" : "▼"} {trendPct}%
                    </div>
                    <div style={{ flex: 1 }}>
                      <Sparkline points={priceHistory} color={isUpTrend ? C.green : C.red} w={100} h={26} />
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Price corridor delta over past 30 trading days</div>
                </Card>
                <Card style={{ padding: 14, background: "#FFFBF2", border: `1.5px solid ${C.gold}55` }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: C.soil, textTransform: "uppercase" }}>Squire Optimum Trade Routing</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: C.maroon, marginTop: 6 }}>{bestMandi.name}</div>
                  <div style={{ fontSize: 11.5, color: C.charcoal, marginTop: 2 }}>Net Realizable: <strong style={{ color: C.green, fontFamily: "monospace" }}>₹{bestMandi.netRealizable.toLocaleString()}/Qtl</strong></div>
                </Card>
              </div>

              {/* Two Column Board: Left (Mandi Comparison), Right (AI Speculation Engine) */}
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 18, alignItems: "start" }}>
                
                {/* Left Column: National Mandi Price & Logistics Comparison Table */}
                <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, borderBottom: `1.5px solid ${C.border}`, paddingBottom: 10 }}>
                    <div>
                      <h3 style={{ fontFamily: "serif", fontWeight: 600, fontSize: 17, color: C.charcoal, margin: 0 }}>📊 National APMC Price and Transit Ledger</h3>
                      <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>Realizable revenue model accounting for transport overheads from Fatehpur, Bundelkhand</div>
                    </div>
                    <span style={{ fontSize: 10.5, background: C.greenPale, color: C.green, padding: "3px 8px", borderRadius: 40, fontWeight: 700 }}>🟢 e-NAM Live Sync</span>
                  </div>

                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                      <thead>
                        <tr style={{ borderBottom: `1.5px solid ${C.border}`, textAlign: "left" }}>
                          <th style={{ padding: "8px 4px", color: C.muted, fontWeight: 600 }}>Mandi / Market</th>
                          <th style={{ padding: "8px 4px", color: C.muted, fontWeight: 600, textAlign: "right" }}>Spot Rate</th>
                          <th style={{ padding: "8px 4px", color: C.muted, fontWeight: 600, textAlign: "right" }}>Transit Cost</th>
                          <th style={{ padding: "8px 4px", color: C.muted, fontWeight: 600, textAlign: "right" }}>Net Realizable</th>
                          <th style={{ padding: "8px 4px", color: C.muted, fontWeight: 600, textAlign: "center" }}>Trade Route</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mandisList.map(m => {
                          const isBest = m.id === bestMandi.id;
                          const isTarget = targetMandi === m.id;
                          return (
                            <tr key={m.id} style={{ borderBottom: `1px solid ${C.border}`, background: isBest ? "#EBF8F044" : "transparent" }}>
                              <td style={{ padding: "11px 4px" }}>
                                <div style={{ fontWeight: 700, color: C.charcoal }}>{m.name}</div>
                                <div style={{ fontSize: 10.5, color: C.muted, marginTop: 2 }}>{m.state} · Dist: {m.dist} km · Vol: {m.arrivals} Qtl/d</div>
                              </td>
                              <td style={{ padding: "11px 4px", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>
                                ₹{m.spotPrice.toLocaleString()}
                              </td>
                              <td style={{ padding: "11px 4px", textAlign: "right", fontFamily: "monospace", color: C.red }}>
                                -₹{m.transit}
                              </td>
                              <td style={{ padding: "11px 4px", textAlign: "right", fontFamily: "monospace", fontWeight: 800, color: isBest ? C.green : C.charcoal }}>
                                ₹{m.netRealizable.toLocaleString()}
                                {isBest && <div style={{ fontSize: 9.5, fontWeight: 700, color: C.green, marginTop: 2 }}>🏆 Highest Net Profit</div>}
                              </td>
                              <td style={{ padding: "11px 4px", textAlign: "center" }}>
                                <button
                                  onClick={() => setTargetMandi(isTarget ? null : m.id)}
                                  style={{
                                    padding: "5px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer",
                                    border: "none",
                                    background: isTarget ? C.green : isBest ? C.maroon : "rgba(0,0,0,0.06)",
                                    color: isTarget || isBest ? C.white : C.charcoal,
                                    transition: "all 0.15s ease"
                                  }}
                                >
                                  {isTarget ? "✓ Routed" : "Set Route"}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {targetMandi && (() => {
                    const selectedM = mandisList.find(m => m.id === targetMandi);
                    return (
                      <div style={{ marginTop: 14, background: "#F0F4FF", border: `1px solid ${C.blue}55`, borderRadius: 8, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 12, color: C.charcoal }}>
                          🚚 <strong>Route active to {selectedM.name}:</strong> 2-Axle Truck logistics rates locked at ₹{selectedM.transit} per Qtl. Driver dispatch slot assigned.
                        </div>
                        <button onClick={() => setTargetMandi(null)} style={{ background: "none", border: "none", color: C.muted, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>×</button>
                      </div>
                    );
                  })()}

                </div>

                {/* Right Column: AI Speculation Engine & Macro-Economic Driver Factors */}
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  
                  {/* Speculative Pricing Ranges Card */}
                  <Card style={{ background: "linear-gradient(135deg, #1A0E05 0%, #301708 100%)", color: "#F5EFEB", border: "none" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.goldLight, textTransform: "uppercase", letterSpacing: "0.08em" }}>🎯 Econometric Speculation Model</div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#fff", marginTop: 4 }}>Upcoming {mandiSeason} Price Range</div>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 14, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)" }}>Projected Floor</div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: "monospace" }}>₹{specLowerLimit.toLocaleString()}</div>
                      </div>
                      <div style={{ fontSize: 18, color: "rgba(255,255,255,0.3)" }}>→</div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)" }}>Projected Ceiling</div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: C.goldLight, fontFamily: "monospace" }}>₹{specUpperLimit.toLocaleString()}</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, fontSize: 11.5 }}>
                      <span style={{ color: "rgba(255,255,255,0.65)" }}>Speculative Confidence Score:</span>
                      <strong style={{ color: "#90EE90", fontFamily: "monospace" }}>{confidenceScore}% (High)</strong>
                    </div>
                  </Card>

                  {/* Macro Drivers Dashboard Panel */}
                  <Card style={{ padding: 16 }}>
                    <h4 style={{ margin: 0, fontWeight: 700, fontSize: 13, color: C.charcoal, borderBottom: `1px solid ${C.border}`, paddingBottom: 8, marginBottom: 12 }}>📈 Macro-Economic Pricing Drivers</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: 11.5, fontWeight: 600, color: C.charcoal }}>Interest Rate Index (IR)</div>
                          <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>RBI repo rate affect stock-carrying costs</div>
                        </div>
                        <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: C.charcoal }}>6.50%</span>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: 11.5, fontWeight: 600, color: C.charcoal }}>Fuel Index (Diesel)</div>
                          <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>Tillage, water pump, and highway transport rates</div>
                        </div>
                        <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: C.red }}>₹94.5/L</span>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: 11.5, fontWeight: 600, color: C.charcoal }}>Climate Risk Coefficient</div>
                          <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>Monsoon rainfall anomaly projection matrix</div>
                        </div>
                        <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: C.blue }}>{mandiSeason === "Kharif" ? "+12.4% (Wet)" : "-4.2% (Dry)"}</span>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: 11.5, fontWeight: 600, color: C.charcoal }}>Fertilizer Index</div>
                          <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>Standard domestic DAP / Urea subsidy lines</div>
                        </div>
                        <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: C.green }}>Stable</span>
                      </div>

                    </div>
                  </Card>

                  {/* AI Speculation Section */}
                  <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.maroon, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>🧠</div>
                        <h4 style={{ margin: 0, fontWeight: 700, fontSize: 13.5, color: C.charcoal }}>Squire AI Speculative Outlook</h4>
                      </div>
                      {aiSpeculation && aiSpeculation.isLocalModel && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 9.5, fontWeight: 700, color: C.gold, background: "#FFF9E6", border: `1px solid ${C.gold}44`, padding: "2px 6px", borderRadius: 4 }}>Offline Mode</span>
                          <button
                            onClick={() => setRefetchTrigger(prev => prev + 1)}
                            style={{ background: "none", border: "none", color: C.blue, fontSize: 10.5, fontWeight: 700, textDecoration: "underline", cursor: "pointer", padding: 0 }}
                          >
                            Sync Live AI
                          </button>
                        </div>
                      )}
                    </div>

                    {aiLoading ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "10px 0" }}>
                        <div style={{ height: 12, background: "rgba(0,0,0,0.06)", borderRadius: 4, width: "100%" }}></div>
                        <div style={{ height: 12, background: "rgba(0,0,0,0.06)", borderRadius: 4, width: "90%" }}></div>
                        <div style={{ height: 12, background: "rgba(0,0,0,0.06)", borderRadius: 4, width: "95%" }}></div>
                        <div style={{ height: 12, background: "rgba(0,0,0,0.06)", borderRadius: 4, width: "60%" }}></div>
                      </div>
                    ) : aiError ? (
                      <div style={{ fontSize: 12, color: C.red, background: "#FDEDEC", padding: 10, borderRadius: 8 }}>
                        {aiError}. <button onClick={() => { setMandiCrop(String(mandiCrop)); }} style={{ background: "none", border: "none", color: C.blue, textDecoration: "underline", cursor: "pointer", fontWeight: 700 }}>Retry Analysis</button>
                      </div>
                    ) : aiSpeculation ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <div style={{ fontSize: 12, color: C.charcoal, lineHeight: 1.5, background: C.cream, padding: 12, borderRadius: 8, fontStyle: "italic", whiteSpace: "pre-line" }}>
                          {aiSpeculation.speculativeSummary}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 11 }}>
                          <div style={{ background: "#F5EFEB", padding: "8px 10px", borderRadius: 6 }}>
                            <span style={{ color: C.muted }}>Risk Rating:</span>
                            <strong style={{ display: "block", color: aiSpeculation.riskRating === "High" ? C.red : aiSpeculation.riskRating === "Medium" ? C.orange : C.green, fontSize: 12, marginTop: 2 }}>{aiSpeculation.riskRating || "Moderate"}</strong>
                          </div>
                          <div style={{ background: "#F5EFEB", padding: "8px 10px", borderRadius: 6 }}>
                            <span style={{ color: C.muted }}>Best Strategy:</span>
                            <strong style={{ display: "block", color: C.maroon, fontSize: 11, marginTop: 2 }}>{aiSpeculation.recommendedAction || "Store & Arbitrage"}</strong>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: 12.5, color: C.muted, fontStyle: "italic", textAlign: "center", padding: "12px 0" }}>
                        Waiting to dispatch analytical vectors...
                      </div>
                    )}
                  </div>

                </div>

              </div>

            </div>
          );
        })()}

        {/* 3. SEED & INPUTS PAGE VIEWPORT */}
        {activeSection === "seed" && (
          <div style={{ background: "#fff", border: "1px solid #E8DFD2", borderRadius: 14, padding: 20 }}>
            <h3 style={{ fontFamily: "serif", fontWeight: 600, fontSize: 16, marginBottom: 14 }}>Outlet Supply Inventory Ratios</h3>
            {SEED_INV.map(m => (
              <div key={m.name} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span>{m.name}</span><strong>{m.stock} Qtl MTD</strong>
                </div>
                <div style={{ height: 6, background: "#FAF6EF", borderRadius: 4, overflow: "hidden" }}><div style={{ width: `${(m.stock / m.max) * 100}%`, height: "100%", background: INV_C[m.status] }} /></div>
              </div>
            ))}
          </div>
        )}

        {/* 4. FARMER NETWORK PAGE VIEWPORT */}
        {activeSection === "farmers" && (
          <div style={{ background: "#fff", border: "1px solid #E8DFD2", borderRadius: 14, padding: 20 }}>
            <h3 style={{ fontFamily: "serif", fontWeight: 600, fontSize: 16, marginBottom: 14 }}>Village Cluster Champion Network Records</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filteredFarmers.map(f => (
                <div key={f.id} onClick={() => onSelect(f)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#FAF6EF", borderRadius: 10, cursor: "pointer", border: "1px solid #E8DFD2" }}>
                  <div><div style={{ fontWeight: 700, fontSize: 14, color: "#2B211B" }}>{f.name}</div><div style={{ fontSize: 12, color: "#8A7C6C" }}>{f.village}, {f.district} · {f.land}ha · {f.soilType}</div></div>
                  <span style={{ background: f.planGenerated ? "#DCEEE1" : "#F7E8C9", color: f.planGenerated ? "#2F6B45" : "#8A5A12", fontSize: 10.5, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>{f.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. DIGITAL BRAIN ADVISORY VIEWPORT */}
        {activeSection === "brain" && (
          <div style={{ background: "#fff", border: "1px solid #E8DFD2", borderRadius: 14, padding: 24 }}>
            <h3 style={{ fontFamily: "serif", fontWeight: 600, fontSize: 16, marginBottom: 14 }}>AI Digital Blueprint Constraints Parameters</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, textAlign: "center" }}>
              <div><div style={{ fontSize: 26, fontWeight: 800, color: C.maroon }}>{assessed}</div><div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Blueprints Issued</div></div>
              <div><div style={{ fontSize: 26, fontWeight: 800, color: C.green }}>298</div><div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Soil Profiles Mapped</div></div>
              <div><div style={{ fontSize: 26, fontWeight: 800, color: C.gold }}>14</div><div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Active Risk Advisories</div></div>
            </div>
          </div>
        )}

        {/* 6. SQUIRE OUTLETS PAGE VIEWPORT */}
        {activeSection === "outlets" && (
          <div style={{ background: "#fff", border: "1px solid #E8DFD2", borderRadius: 14, padding: 24 }}>
            <h3 style={{ fontFamily: "serif", fontWeight: 600, fontSize: 16, marginBottom: 14 }}>Squire Shared Logistics Infrastructure</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, fontSize: 13 }}>
              { [["Machinery Custom Hiring Bay", "2 of 2 deployed"], ["Cold Storage Occupancy matrix", "64% utilized occupancy"], ["Daily Outlet Active Footfall register", "37 champions registered today"]].map(([l, v]) => (
                <div key={l} style={{ padding: "10px 0", borderBottom: "1px dashed #E8DFD2" }}>
                  <div style={{ fontSize: 12, color: "#8A7C6C", marginBottom: 4 }}>{l}</div>
                  <strong style={{ fontFamily: "monospace", fontSize: 15 }}>{v}</strong>
                </div>
              )) }
            </div>
          </div>
        )}
      </div>
  );
}

// SQUIRE · 5-YEAR RISK-ADJUSTED ECONOMETRIC FARM PROJECTION TERMINAL
// Swaminathan C2 + 50% Cushion Engine · Digital Brain Integrated
// ═══════════════════════════════════════════════════════════════════

// ─── REGIONAL WAGE & CAPITAL CONSTANTS (Bundelkhand / Fatehpur belt) ──
const REGIONAL_WAGE_PER_DAY = 320;          // ₹/day, UP semi-arid agri wage benchmark
const FAMILY_LABOR_DAYS_PER_ACRE = 22;      // person-days/acre/season, smallholder avg
const LAND_RENT_PER_ACRE_YR = 6500;         // ₹/acre/yr, imputed opportunity cost
const FIXED_CAPITAL_BASE = 28000;           // ₹/acre, irrigation infra + implements asset base
const INTEREST_RATE_FIXED_CAPITAL = 0.09;   // 9% p.a., RBI KCC-linked bank benchmark

const PROFILE_CAPITAL_ACCESS = {
  "Marginal (<1ha)": 0.7, "Small (1–2ha)": 0.85,
  "Semi-medium (2–4ha)": 1.0, "Medium (4–10ha)": 1.15,
};

// ─── SVG CHART PRIMITIVES ─────────────────────────────────────────────
function DualMetricChart({ years, width = 640, height = 220 }) {
  const pad = { l: 54, r: 16, t: 20, b: 30 };
  const w = width - pad.l - pad.r, h = height - pad.t - pad.b;
  const allVals = years.flatMap(y => [y.c2, y.netProfit]);
  const maxV = Math.max(...allVals, 1) * 1.12;
  const minV = Math.min(0, ...allVals);
  const xFor = i => pad.l + (i / (years.length - 1)) * w;
  const yFor = v => pad.t + h - ((v - minV) / (maxV - minV)) * h;

  const c2Path = years.map((y, i) => `${i === 0 ? "M" : "L"}${xFor(i)},${yFor(y.c2)}`).join(" ");
  const npPath = years.map((y, i) => `${i === 0 ? "M" : "L"}${xFor(i)},${yFor(y.netProfit)}`).join(" ");
  const npArea = `${npPath} L${xFor(years.length - 1)},${yFor(0)} L${xFor(0)},${yFor(0)} Z`;

  const gridLines = 4;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", display: "block" }}>
      {/* Grid Y-Axis ticks */}
      {Array.from({ length: gridLines + 1 }).map((_, i) => {
        const v = minV + ((maxV - minV) / gridLines) * i;
        const y = yFor(v);
        return (
          <g key={i}>
            <line x1={pad.l} y1={y} x2={width - pad.r} y2={y} stroke={C.border} strokeWidth={1} />
            <text x={pad.l - 8} y={y + 3} fontSize="9" fill={C.muted} textAnchor="end" fontFamily="monospace">
              {v >= 100000 ? `${(v / 100000).toFixed(1)}L` : `${Math.round(v / 1000)}K`}
            </text>
          </g>
        );
      })}
      <line x1={pad.l} y1={yFor(0)} x2={width - pad.r} y2={yFor(0)} stroke={C.charcoal} strokeWidth={1} strokeOpacity={0.25} />

      {/* Area Shading & Vector Lines */}
      <path d={npArea} fill={C.green} fillOpacity={0.12} stroke="none" />
      <path d={c2Path} fill="none" stroke={C.red} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d={npPath} fill="none" stroke={C.green} strokeWidth={2.75} strokeLinecap="round" strokeLinejoin="round" />

      {/* Coordinate nodes */}
      {years.map((y, i) => (
        <g key={i}>
          <circle cx={xFor(i)} cy={yFor(y.c2)} r={3.5} fill={C.white} stroke={C.red} strokeWidth={2} />
          <circle cx={xFor(i)} cy={yFor(y.netProfit)} r={3.5} fill={C.white} stroke={C.green} strokeWidth={2} />
          <text x={xFor(i)} y={height - 8} fontSize="10" fill={C.charcoal} textAnchor="middle" fontWeight="600">Yr {y.yr}</text>
        </g>
      ))}
    </svg>
  );
}

function CushionGauge({ ratio, size = 76 }) {
  const pct = Math.min(ratio / 2.0, 1); 
  const r = size / 2 - 8, c = 2 * Math.PI * r;
  const dash = c * pct;
  const passed = ratio >= 1.5;
  const color = passed ? C.green : ratio >= 1.0 ? C.gold : C.red;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.border} strokeWidth={7} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={7}
        strokeDasharray={`${dash} ${c}`} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x="50%" y="47%" textAnchor="middle" fontSize="15" fontWeight="800" fill={color} fontFamily="monospace">
        {ratio.toFixed(2)}x
      </text>
      <text x="50%" y="64%" textAnchor="middle" fontSize="7" fill={C.muted} fontWeight="600">
        {passed ? "GATE PASSED" : "BELOW 1.5x"}
      </text>
    </svg>
  );
}

// ─── CALCULATION PROJECTION MATRIX TERMINAL ─────────────────────────
function EconometricProjectionTerminal({ farmer, plan, actualSeason }) {
  const [scenario, setScenario] = useState("base");

  const model = useMemo(() => {
    const landAcres = parseFloat((farmer.land * 2.47).toFixed(2)) || 1;
    const capitalAccess = PROFILE_CAPITAL_ACCESS[farmer.economicProfile] || 0.8;

    // Real Year-1 baseline: only trusted once actual produce revenue has been
    // logged this season. Until then Year 1 stays a modeled estimate like Yr2-5.
    const hasRealSeasonData = !!(actualSeason && actualSeason.totalGrossRevenue > 0);

    // Resolve the actual crop(s) driving each year's economics — falls back to
    // sensible regional defaults when the Digital Brain hasn't generated a plan yet.
    const cropsForYear = {
      1: [plan?.year1?.season1?.crop || (farmer.cropHistory?.split(",")[0]?.trim()) || "Wheat"],
      2: [plan?.year1?.season2?.crop || "Green Gram"],
      3: (plan?.year3Target?.crops?.length ? plan.year3Target.crops : ["Chickpea", "Mustard", "Sesame"]),
      4: (plan?.year5Target?.crops?.length ? plan.year5Target.crops : (plan?.year3Target?.crops?.length ? plan.year3Target.crops : ["Potato", "Onion", "Garlic"])),
      5: (plan?.year5Target?.crops?.length ? plan.year5Target.crops : ["Mustard", "Chickpea", "Sesame"]),
    };

    const rotationByYear = {
      1: plan?.year1?.season1?.crop || (farmer.cropHistory?.split(",")[0]?.trim()) || "Baseline Monocrop",
      2: plan?.year1?.season2?.crop ? `${plan.year1.season1?.crop} + ${plan.year1.season2.crop} rotation` : "Legume / Aromatic Rotation",
      3: plan?.year3Target?.crops?.join(" → ") || "Diversified Restorative Mix",
      4: `Storage-Arbitrage: ${cropsForYear[4].join(" → ")} (Squire Outlet)`,
      5: plan?.year5Target?.crops?.join(" → ") || "Optimized Equilibrium Mix",
    };

    const SCENARIOS = {
      base: { priceVol: 1.0, climateRisk: 1.0, label: "Base Case", color: C.maroon },
      optimistic: { priceVol: 1.12, climateRisk: 1.05, label: "Optimistic", color: C.green },
      conservative: { priceVol: 0.90, climateRisk: 0.92, label: "Conservative", color: C.orange },
    };
    const sc = SCENARIOS[scenario];
    const waterMult = WATER_YIELD_MULT[farmer.waterAvail] || 0.75;

    let socTrack = Math.max(farmer.soc, 0.15); 
    const years = [];

    for (let yr = 1; yr <= 5; yr++) {
      let yieldElasticity = 1.0;
      let chemInputMult = 1.0;
      let conditioningSurcharge = 0;
      let storageArbitrage = 0;

      if (yr === 1) {
        yieldElasticity = socTrack < 0.40 ? 0.75 : 0.90;
        conditioningSurcharge = socTrack < 0.40 ? Math.round(2400 * landAcres) : Math.round(900 * landAcres);
        socTrack = socTrack + 0.05;
      } else if (yr === 2) {
        chemInputMult = 0.85;
        yieldElasticity = 0.92;
        socTrack = socTrack + 0.13;
      } else if (yr === 3) {
        socTrack = socTrack + 0.14;
        yieldElasticity = socTrack >= 0.55 ? 1.12 : 1.0;
        chemInputMult = 0.80;
      } else if (yr === 4) {
        socTrack = socTrack + 0.12;
        yieldElasticity = 1.16;
        chemInputMult = 0.78;
        storageArbitrage = 1; 
      } else if (yr === 5) {
        socTrack = socTrack + 0.10;
        yieldElasticity = 1.22;
        chemInputMult = 0.74;
        storageArbitrage = 1;
      }
      socTrack = parseFloat(Math.min(socTrack, 1.6).toFixed(2));

      // Resolve real per-crop yield (qtl/Ha) and Mandi price (₹/qtl) across the
      // 148-crop matrix, averaged when a year runs a diversified multi-crop mix.
      const cropList = cropsForYear[yr];
      const avgYieldPerHa = cropList.reduce((a, c) => a + getBaseYield(c), 0) / cropList.length;
      const avgPricePerQtl = cropList.reduce((a, c) => a + getMandiPricePerQtl(c), 0) / cropList.length;
      const yieldQtl = parseFloat((avgYieldPerHa * farmer.land * waterMult * yieldElasticity * sc.climateRisk).toFixed(1));

      let grossRealization = Math.round(yieldQtl * avgPricePerQtl * sc.priceVol);
      let arbitrageNote = null;
      if (storageArbitrage) {
        const premiumPct = yr === 4 ? 0.19 : 0.24;
        const storageRentalFee = Math.round(yieldQtl * 38 * 4); 
        const premiumGain = Math.round(grossRealization * premiumPct);
        grossRealization = grossRealization + premiumGain - storageRentalFee;
        arbitrageNote = { premiumGain, storageRentalFee, premiumPct };
      }

      const seedBioInputBase = Math.round(3200 * landAcres * chemInputMult);
      const hiredLaborCost = Math.round(2600 * landAcres * (1 - capitalAccess * 0.15));
      const machineryFuelCost = Math.round(1800 * landAcres);
      let a2Cost = seedBioInputBase + hiredLaborCost + machineryFuelCost + conditioningSurcharge;

      // ── Live grounding: Year 1 anchors to what's actually been recorded ──
      // (Produce Tab realizations + logged input/machinery spend) instead of
      // the synthetic model estimate, whenever real season data exists.
      let groundedInYr1 = false;
      if (yr === 1 && hasRealSeasonData) {
        grossRealization = actualSeason.totalGrossRevenue;
        a2Cost = Math.round(actualSeason.totalInputCost + (actualSeason.machineryRentalCost || 0));
        groundedInYr1 = true;
      }

      const flCost = Math.round(FAMILY_LABOR_DAYS_PER_ACRE * landAcres * REGIONAL_WAGE_PER_DAY * capitalAccess);
      const imputedLandRent = Math.round(LAND_RENT_PER_ACRE_YR * landAcres);
      const interestFixedCapital = Math.round(FIXED_CAPITAL_BASE * landAcres * INTEREST_RATE_FIXED_CAPITAL);

      const c2 = a2Cost + flCost + imputedLandRent + interestFixedCapital;
      const netProfit = grossRealization - c2;
      const cushionRatio = c2 > 0 ? parseFloat((netProfit / c2).toFixed(2)) : 0;
      const gatePassed = cushionRatio >= 1.5;

      years.push({
        yr, crop: rotationByYear[yr], cropList, avgPricePerQtl: Math.round(avgPricePerQtl), soc: socTrack, yieldElasticity, yieldQtl,
        a2Cost, flCost, imputedLandRent, interestFixedCapital, c2,
        grossRealization, netProfit, cushionRatio, gatePassed, arbitrageNote,
        chemInputMult, groundedInYr1,
      });
    }
    return { years, sc, landAcres, hasRealSeasonData };
  }, [farmer, plan, scenario, actualSeason]);

  const { years, sc, landAcres, hasRealSeasonData } = model;
  const finalGate = years[4];
  const cumC2 = years.reduce((a, y) => a + y.c2, 0);
  const cumNetProfit = years.reduce((a, y) => a + y.netProfit, 0);
  const cumGross = years.reduce((a, y) => a + y.grossRealization, 0);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Tab Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 4 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 17, color: C.charcoal }}>📐 5-Year Econometric Projection Terminal</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Swaminathan C2 Cost Index Engine · {landAcres} acres · {farmer.waterAvail}</div>
          <div style={{ marginTop: 6 }}>
            <span style={{
              fontSize: 10.5, fontWeight: 700, padding: "2px 9px", borderRadius: 20,
              background: hasRealSeasonData ? C.greenPale : "#FEF3D0",
              color: hasRealSeasonData ? C.green : C.soil,
            }}>
              {hasRealSeasonData ? "✓ Year 1 grounded in live Produce/Input records" : "○ Year 1 is a modeled estimate — log produce sales to ground it in real data"}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[["base", "Base Case"], ["optimistic", "Optimistic"], ["conservative", "Conservative"]].map(([k, l]) => (
            <button key={k} onClick={() => setScenario(k)} style={{
              padding: "6px 13px", borderRadius: 20, fontSize: 11.5, fontWeight: 700, cursor: "pointer",
              border: `2px solid ${scenario === k ? sc.color : C.border}`,
              background: scenario === k ? sc.color : C.white, color: scenario === k ? C.white : C.muted,
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Threshold indicator banner */}
      <Card style={{ margin: "14px 0", background: C.maroonDark, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <CushionGauge ratio={finalGate.cushionRatio} />
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ color: C.goldLight, fontWeight: 700, fontSize: 13 }}>
            Year 5 Swaminathan Gate: {finalGate.gatePassed ? "✅ PASSED" : "⚠️ BELOW TARGET"}
          </div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 11.5, marginTop: 4, lineHeight: 1.5 }}>
            Net Profit ₹{finalGate.netProfit.toLocaleString()} vs C2 Cost ₹{finalGate.c2.toLocaleString()} required margin ≥1.5×.
            {finalGate.gatePassed
              ? " Natural soil fertility has self-subsidized production inputs — strategy is self-sustaining."
              : " Propose extending multi-crop diversification intervals or introducing higher value off-season warehouse storage arbitrage blocks."}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)" }}>Cumulative 5-Yr Net Profit</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#90EE90", fontFamily: "monospace" }}>₹{(cumNetProfit / 100000).toFixed(2)}L</div>
        </div>
      </Card>

      {/* Inline vector chart layout */}
      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontWeight: 700, color: C.maroon, fontSize: 13, marginBottom: 4 }}>C2 Cost vs Net Realized Profit Trajectory</div>
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 10 }}>Red Line: Comprehensive Cost Baseline ($C_2$) · Green Line: Net Profit Curve ($Surplus\text{ }Zone$)</div>
        <DualMetricChart years={years} />
      </Card>

      {/* Multi-Year Analytics grid row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 14 }}>
        {[
          ["Cum. Gross Returns", `₹${(cumGross / 100000).toFixed(2)}L`, C.blue],
          ["Cum. C2 Expenses", `₹${(cumC2 / 100000).toFixed(2)}L`, C.red],
          ["Cum. Saved Capital", `₹${(cumNetProfit / 100000).toFixed(2)}L`, C.green],
          ["Yr5 Cushion Ratio", `${finalGate.cushionRatio.toFixed(2)}×`, finalGate.gatePassed ? C.green : C.orange],
        ].map(([l, v, c]) => (
          <Card key={l} style={{ padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: c, fontFamily: "monospace" }}>{v}</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 2, lineHeight: 1.3 }}>{l}</div>
          </Card>
        ))}
      </div>

      {/* Full Sheet Data Grid Matrix */}
      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontWeight: 700, color: C.maroon, fontSize: 13, marginBottom: 4 }}>📋 Structural Multi-Year Balance Sheet</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5, minWidth: 760 }}>
            <thead>
              <tr style={{ background: C.cream }}>
                {["Year", "Rotation Strategy", "SOC %", "A2 (Out-of-Pocket)", "FL (Family Labor)", "Total C2", "Gross Realization", "Net Profit", "Cushion Ratio"].map(h => (
                  <th key={h} style={{ padding: "7px 8px", textAlign: h === "Year" || h === "Rotation Strategy" ? "left" : "right", color: C.muted, fontWeight: 700, fontSize: 10.5, borderBottom: `1.5px solid ${C.border}`, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {years.map(y => (
                <tr key={y.yr} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "8px", fontWeight: 700, color: C.charcoal }}>Yr {y.yr}{y.groundedInYr1 ? " 🔗" : ""}</td>
                  <td style={{ padding: "8px", color: C.charcoal, maxWidth: 180, whiteSpace: "normal" }}>{y.crop}</td>
                  <td style={{ padding: "8px", textAlign: "right", fontFamily: "monospace", color: y.soc >= 0.55 ? C.green : C.orange, fontWeight: 600 }}>{y.soc}%</td>
                  <td style={{ padding: "8px", textAlign: "right", fontFamily: "monospace" }}>₹{y.a2Cost.toLocaleString()}</td>
                  <td style={{ padding: "8px", textAlign: "right", fontFamily: "monospace" }}>₹{y.flCost.toLocaleString()}</td>
                  <td style={{ padding: "8px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: C.red }}>₹{y.c2.toLocaleString()}</td>
                  <td style={{ padding: "8px", textAlign: "right", fontFamily: "monospace", color: C.blue }}>₹{y.grossRealization.toLocaleString()}</td>
                  <td style={{ padding: "8px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: y.netProfit >= 0 ? C.green : C.red }}>₹{y.netProfit.toLocaleString()}</td>
                  <td style={{ padding: "8px", textAlign: "right" }}>
                    <span style={{
                      fontFamily: "monospace", fontWeight: 800, padding: "2px 8px", borderRadius: 20, fontSize: 11,
                      background: y.gatePassed ? C.greenPale : "#FEF3D0",
                      color: y.gatePassed ? C.green : C.soil,
                    }}>{y.cushionRatio.toFixed(2)}×{y.gatePassed ? " ✓" : ""}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mechanism logs */}
      <Card style={{ marginBottom: 14, background: "#F0F4FF" }}>
        <div style={{ fontWeight: 700, color: C.blue, fontSize: 12.5, marginBottom: 10 }}>🔬 Mechanism Notes — Structural Variable Adjustments</div>
        <div style={{ display: "grid", gap: 8, fontSize: 11.5, color: C.charcoal, lineHeight: 1.6 }}>
          <div><strong>Yr 1 — Degraded Baseline ({years[0].cropList.join(", ")}):</strong> SOC starts low. Yield elasticity capped at ×{years[0].yieldElasticity} against a resolved base yield/Mandi price of ₹{years[0].avgPricePerQtl.toLocaleString()}/qtl, with conditioning surcharges active to offset soil degradation elements.</div>
          <div><strong>Yr 2 — Rotation Effect ({years[1].cropList.join(", ")}):</strong> Diversified systems lower out-of-pocket spending on synthetic chemicals by 15%. Boundaries are shielded via unpalatable crops like Mentha/lemongrass to offset stray cattle risks.</div>
          <div><strong>Yr 3 — Soil Inflection Point ({years[2].cropList.join(", ")}):</strong> SOC crosses the 0.55% threshold line. Elasticity multiplier scales upward to ×{years[2].yieldElasticity} at a blended Mandi price of ₹{years[2].avgPricePerQtl.toLocaleString()}/qtl across the diversified mix.</div>
          <div><strong>Yr 4 — Time Arbitrage Block ({years[3].cropList.join(", ")}):</strong> Squire Outlets defer harvest liquidation. Sales utilize a 3-5 month post-harvest hold cycle to capture off-season premiums (+{Math.round((years[3].arbitrageNote?.premiumPct || 0) * 100)}%) net of ₹{years[3].arbitrageNote?.storageRentalFee?.toLocaleString()} storage rental.</div>
          <div><strong>Yr 5 — Optimized Equilibrium ({years[4].cropList.join(", ")}):</strong> Cushion Ratio reaches {years[4].cushionRatio.toFixed(2)}× at ₹{years[4].avgPricePerQtl.toLocaleString()}/qtl blended realization. Natural biological renewal self-subsidizes production requirements.</div>
        </div>
      </Card>
    </div>
  );
}

// ─── MAIN APP SYSTEM CORE WRAPPER LAYOUT ─────────────────────────
export default function App() {
  const [view, setView] = useState("dashboard"); 
  const [dashboardTab, setDashboardTab] = useState("overview"); // Handles main menu state changes cleanly
  const [farmers, setFarmers] = useState(INITIAL_FARMERS);
  const [selected, setSelected] = useState(null);
  const [rentals, setRentals] = useState(INITIAL_RENTALS);
  
  // Sidebar persistent toggle state configuration matrix
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSaveFarmer = f => { setFarmers(prev => [...prev, f]); setView("dashboard"); setDashboardTab("farmers"); };
  const handleUpdateFarmer = u => { setFarmers(prev => prev.map(f => f.id === u.id ? u : f)); setSelected(u); };
  const handleSelectFarmer = f => { setSelected(f); setView("detail"); };
  const handleAddRental = r => setRentals(prev => [...prev, r]);
  const liveSelected = selected ? farmers.find(f => f.id === selected.id) || selected : null;

  const NAV_ITEMS = [
    { id: "overview", icon: "▦", label: "Dashboard" },
    { id: "market", icon: "↗", label: "Mandi Sales" },
    { id: "seed", icon: "🌱", label: "Seed & Inputs" },
    { id: "farmers", icon: "👥", label: "Farmer Network" },
    { id: "brain", icon: "🧠", label: "Digital Brain" },
    { id: "outlets", icon: "🏪", label: "Squire Outlets" }
  ];

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: C.cream, minHeight: "100vh", display: "flex" }}>
      
      {/* Global Application Navigation Sidebar Panel (Locked persistently across view transitions) */}
      <aside style={{ 
        width: sidebarOpen ? 248 : 0, 
        opacity: sidebarOpen ? 1 : 0,
        background: "linear-gradient(180deg,#241509 0%,#1A0E05 100%)", 
        color: "#E9DFD2", 
        position: "fixed", top: 0, left: 0, bottom: 0, 
        display: "flex", flexDirection: "column", 
        padding: sidebarOpen ? "28px 18px" : "28px 0px", 
        zIndex: 90, transition: "all 0.22s ease-in-out", 
        overflowX: "hidden", overflowY: "auto" 
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 24, borderBottom: "1px solid rgba(255,255,255,.08)", marginBottom: 22, minWidth: 212 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#C8963E 0%,#6B1E3B 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: 18 }}>S</div>
          <div><div style={{ fontWeight: 600, fontSize: 17, color: "#fff", fontFamily: "serif" }}>Squire</div><div style={{ fontSize: 10, color: "#E8C77E", letterSpacing: "0.06em", textTransform: "uppercase" }}>Digital Brain</div></div>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 212 }}>
          {NAV_ITEMS.map(n => (
            <button key={n.id} onClick={() => { setView("dashboard"); setDashboardTab(n.id); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 9, background: (view === "dashboard" && dashboardTab === n.id) ? "rgba(200,150,62,.16)" : "transparent", color: (view === "dashboard" && dashboardTab === n.id) ? "#E8C77E" : "#C9B8A8", fontSize: 13.5, fontWeight: 500, border: "none", cursor: "pointer", textAlign: "left", position: "relative" }}>
              <span style={{ fontSize: 14 }}>{n.icon}</span>{n.label}
              {view === "dashboard" && dashboardTab === n.id && <span style={{ position: "absolute", left: -18, top: "50%", transform: "translateY(-50%)", width: 3, height: 18, background: "#C8963E", borderRadius: "0 3px 3px 0" }} />}
            </button>
          ))}
        </nav>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "20px 0", minWidth: 212 }}>
          <button onClick={() => setView("onboard")} style={{ background: C.maroon, color: "#fff", border: "none", borderRadius: 8, padding: "9px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left" }}>+ Onboard Farmer</button>
          <button onClick={() => setView("reports")} style={{ background: "rgba(255,255,255,.07)", color: "#E9DFD2", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "9px 14px", fontSize: 13, fontWeight: 500, cursor: "pointer", textAlign: "left" }}>📊 Statistical Reports</button>
          <button onClick={() => setView("machinery")} style={{ background: "rgba(255,255,255,.07)", color: "#E9DFD2", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "9px 14px", fontSize: 13, fontWeight: 500, cursor: "pointer", textAlign: "left" }}>🚜 Machinery Hub</button>
        </div>
        <div style={{ marginTop: "auto", paddingTop: 18, borderTop: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", gap: 10, minWidth: 212 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#6B1E3B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#fff" }}>HV</div>
          <div><div style={{ fontSize: 12.5, fontWeight: 600, color: "#F0E6D6" }}>Harshit Vimal</div><div style={{ fontSize: 10.5, color: "#9C8C7A" }}>Field Operations</div></div>
        </div>
      </aside>

      {/* Main Framework Layout Container Panel Workspace */}
      <div style={{ flex: 1, marginLeft: sidebarOpen ? 248 : 0, transition: "margin-left 0.22s ease-in-out", display: "flex", flexDirection: "column", minWidth: 0 }}>
        
        {/* Persistent Workspace Top Header Bar — Houses the Open/Close sidebar layout action cleanly */}
        <header style={{ height: 56, background: "#241509", padding: "0 24px", display: "flex", alignItems: "center", gap: 16, color: C.white, zIndex: 40, borderBottom: `1px solid ${C.border}` }}>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, width: 34, height: 34, color: C.white, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", outline: "none" }}
            title={sidebarOpen ? "Hide Navigation Drawer Menu" : "Show Navigation Drawer Menu"}
          >
            ☰
          </button>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>Squire System Pilot Control Dashboard</div>
        </header>

        {/* Render Engine Content Outlet */}
        <main style={{ padding: "30px 38px 60px", width: "100%", boxSizing: "border-box" }}>
          {view === "dashboard" && (
            <Dashboard farmers={farmers} activeSection={dashboardTab} onSelect={handleSelectFarmer} onNew={() => setView("onboard")} onViewReports={() => setView("reports")} onViewMachinery={() => setView("machinery")} />
          )}
          {view === "onboard" && (
            <><div style={{ fontWeight: 800, fontSize: 20, color: C.charcoal, marginBottom: 20 }}>Onboard New Farmer Champion</div><OnboardForm onSave={handleSaveFarmer} onCancel={() => setView("dashboard")} /></>
          )}
          {view === "detail" && liveSelected && (
            <FarmerDetail farmer={liveSelected} onBack={() => setView("dashboard")} onUpdateFarmer={handleUpdateFarmer} rentals={rentals} onAddRental={handleAddRental} />
          )}
          {view === "reports" && (
            <Reports farmers={farmers} rentals={rentals} onBack={() => setView("dashboard")} />
          )}
          {view === "machinery" && (
            <MachineryHub rentals={rentals} onBack={() => setView("dashboard")} onAddRental={handleAddRental} farmers={farmers} />
          )}
        </main>
      </div>
    </div>
  );
}