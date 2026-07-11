import { useState } from "react";

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
async function generateCropPlan(farmer) {
  // Compile the complete categorized crop matrix to feed directly into the AI context window
  const allowedCropsContext = Object.entries(CROP_OPTIONS)
    .map(([category, list]) => `[${category}]: ${list.join(", ")}`)
    .join("\n");

  const prompt = `You are Squire Digital Brain — an enterprise agronomist and financial optimization engine calibrated for semi-arid India (Bundelkhand/Central UP).

FARMER INPUT METRICS:
* Name: ${farmer.name} | Village: ${farmer.village} | District: ${farmer.district}
* Land Area: ${farmer.land} Ha | Soil Type: ${farmer.soilType}
* Measured N-P-K Levels: ${farmer.nitrogen} - ${farmer.phosphorus} - ${farmer.potassium} kg/ha
* Soil Organic Carbon (SOC): ${farmer.soc}%
* Water Access Profile: ${farmer.waterAvail}
* Monoculture History: ${farmer.cropHistory}
* Financial Tier: ${farmer.economicProfile}

YOUR CORE ADVISORY MISSION:
1. Rebuild Soil Health: Move the Soil Organic Carbon (SOC) boundary upward, breaking destructive monoculture loops.
2. Break MSP-Dependence via the Swaminathan C2+50% Formula: You must explicitly select high-value alternatives where Net Returns exceed the Comprehensive Cost of Production (C2) by at least 50% (Net Profit >= 1.5 x Total Input/Operational Costs). 

CROP SELECTION CATALOG (Select ONLY from this regional matrix):
${allowedCropsContext}

MANDATORY STEP-BY-STEP OPTIMIZATION REASONING PROCESS:
Before generating the plan arrays, mentally execute these calculation filters:
* Step 1 [Soil Check]: Based on the farmer's low SOC and N-P-K deficits, select at least one restorative nitrogen-fixing pulse, green bioenergy crop, or deep-rooting variety to clear soil toxicity and break the historical rotation.
* Step 2 [Stray Cattle Mitigation]: In Bundelkhand, stray cattle destroy standard open crops. If water is constrained, prioritize unpalatable aromatic/medicinal crops (like Mentha, Lemongrass, Ashwagandha) or agro-forestry boundaries to protect margins.
* Step 3 [C2+50% Economic Filter]: Do not default to traditional grain commodities. Evaluate horticulture, spices (Garlic, Chilli), floriculture, or protected options. Calculate: Projected Gross Revenue minus (Input Seeds + Fertilizer + Squire Machinery Rental). Ensure Net Returns clear the C2+50% formula to guarantee an MSP-free premium threshold.

Output your prescriptive analysis ONLY as a valid, single, compact JSON object matching the exact keys below. Do not wrap in markdown \`\`\`json blocks, do not include introductory notes, and do not append trailing explanation text. Keep string metrics explicit and under 60 characters.

{
  "soilHealthScore": 62,
  "soilHealthGrade": "Optimized",
  "degradationRisk": "Moderate",
  "keyIssues": ["Type short issues array matching farmer metrics"],
  "year1": {
    "season1": {
      "crop": "Write Selected Crop Name Exactly from Category List",
      "variety": "Provide high-yielding regional variety seed name",
      "sowMonth": "Oct-Nov",
      "harvestMonth": "Feb-Mar",
      "expectedYield": "Expected output metric per acre",
      "netProfit": "Calculate targeted C2+50 percent profit range in INR",
      "soilBenefit": "Explicit restorative/biomass contribution statement"
    },
    "season2": {
      "crop": "Write Selected Crop Name Exactly from Category List",
      "variety": "Provide high-yielding regional variety seed name",
      "sowMonth": "Mar-Apr",
      "harvestMonth": "Jun-Jul",
      "expectedYield": "Expected output metric per acre",
      "netProfit": "Calculate targeted C2+50 percent profit range in INR",
      "soilBenefit": "Explicit restorative/biomass contribution statement"
    }
  },
  "year3Target": {
    "socImprovement": "+0.45%",
    "profitIncrease": "+55%",
    "crops": ["Crop1", "Crop2", "Crop3"]
  },
  "year5Target": {
    "socImprovement": "+0.90%",
    "profitIncrease": "+110%",
    "crops": ["Crop1", "Crop2", "Agroforestry/Asset"]
  },
  "fertilizerPrescription": {
    "organic": "Specific bio-rematerialization input instructions",
    "bio": "Rhizobium/Azotobacter seed inoculant specifics",
    "chemical": "Targeted mineral supplementation constraints",
    "schedule": "Efficient localized placement schedule"
  },
  "pestAlert": {
    "riskLevel": "Low-Moderate",
    "likely": ["List targeted pathogene variants"],
    "bioIntervention": "Botanical/Neem/Pheromone efficient practice rule"
  },
  "weatherLogic": {
    "sowingWindow": "Precision local window constraints",
    "irrigationSchedule": "Water-saving crop growth stage timings",
    "harvestWindow": "Low-loss harvest target window"
  },
  "mandiTiming": {
    "bestMonth": "Optimal commercial off-season month",
    "expectedPrice": "Premium localized direct-buyer price projection",
    "recommendation": "Squire FPO aggregation / Direct premium marketplace advice"
  },
  "inputShoppingList": [
    { "item": "Seed/Input name", "qty": "Per acre volume", "cost": "Estimated cost", "source": "Squire Outlet" }
  ],
  "planScore": 88,
  "profitabilityIndex": "C2+50% Free Market Premium"
}

Ensure all generated crop fields map explicitly to the selected varieties in the verified catalog text array. Do not use generic placeholders.`;

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

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    throw new Error("JSON parse failed: " + e.message);
  }
}

// ─── UI PRIMITIVES ───────────────────────────────────────────────
function Badge({ color, children }) {
  const map = { green:{bg:C.greenPale,text:C.green}, maroon:{bg:"#F8E8EE",text:C.maroon}, gold:{bg:"#FEF3D0",text:C.soil}, gray:{bg:"#F3F4F6",text:C.muted}, blue:{bg:"#EBF5FB",text:C.blue}, orange:{bg:"#FEF0E6",text:C.orange}, red:{bg:"#FDEDEC",text:C.red} };
  const s = map[color] || map.gray;
  return <span style={{ background:s.bg, color:s.text, borderRadius:999, padding:"2px 10px", fontSize:12, fontWeight:600 }}>{children}</span>;
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

// Dynamically converts per-kg wholesale pricing to per-quintal (x100) across all 148 crops
function getMandiPricePerQtl(crop) {
  return (MANDI_PER_KG[crop] || 30.00) * 100;
}

// Calibrated baseline yields (quintals/hectare) for Bundelkhand/Fatehpur clusters
function getBaseYield(crop) {
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
function EconomicsTab({ farmer, plan, rentals }) {
  const [scenario, setScenario] = useState("base");
  const landAcres = parseFloat((farmer.land * 2.47).toFixed(1));

  // 1. EXTRACT REAL VALUES FROM AI BLUEPRINT OR APPLY LOCAL C2 BASELINES
  const s1 = plan?.year1?.season1;
  const s2 = plan?.year1?.season2;

  // Extract explicit numeric profit values from AI strings (e.g., "18000-22000" -> 20000)
  const parseAIProfit = (str) => {
    if (!str) return 0;
    const numbers = String(str).replace(/[^0-9-]/g, "").split("-");
    if (numbers.length === 2) return (parseInt(numbers[0]) + parseInt(numbers[1])) / 2;
    return parseInt(numbers[0]) || 0;
  };

  const aiNetProfitS1 = parseAIProfit(s1?.netProfit) * landAcres;
  const aiNetProfitS2 = parseAIProfit(s2?.netProfit) * landAcres;
  const totalTargetNetProfit = aiNetProfitS1 + aiNetProfitS2;

  // 2. DETAILED C2 COMPREHENSIVE COST BREAKDOWN (Per Acre Baseline)
  const costStructure = {
    sowing: 2200 * landAcres,      // Tillage, seedbed prep, sowing labor
    inputs: (plan?.inputShoppingList || []).reduce((acc, item) => {
      const cost = parseFloat(String(item.cost).replace(/[^0-9.]/g, "")) || 0;
      return acc + (String(item.qty).toLowerCase().includes("acre") ? cost * landAcres : cost);
    }, 0),
    labor: 4500 * landAcres,       // Interculture, weeding, spraying, harvesting labor
    machinery: rentals.filter(r => r.farmerId === farmer.id).reduce((a, r) => a + r.totalCost, 0) || (1200 * landAcres),
    postHarvest: 1500 * landAcres  // Threshing, bagging, transport, aggregation logistics
  };

  const totalC2CostCurrent = costStructure.sowing + costStructure.inputs + costStructure.labor + costStructure.machinery + costStructure.postHarvest;
  
  // Enforce Swaminathan C2+50% boundary: Gross revenue must yield at least a 50% net return cushion over C2 costs
  const calculatedGrossCurrent = totalTargetNetProfit > 0 ? (totalC2CostCurrent + totalTargetNetProfit) : (totalC2CostCurrent * 1.65);
  const netPLCurrent = calculatedGrossCurrent - totalC2CostCurrent;
  const restBonusCurrent = Math.round(netPLCurrent * 0.18);

  // 3. MULTI-YEAR SCENARIO MODELING (Swaminathan C2+50% Growth Projection Engine)
  const modifiers = {
    base: { yG: [1, 1.10, 1.22, 1.35, 1.50], cD: [1, 0.96, 0.91, 0.86, 0.80], label: "C2 + 50% Standard", color: C.maroon },
    optimistic: { yG: [1, 1.16, 1.32, 1.55, 1.80], cD: [1, 0.92, 0.85, 0.78, 0.70], label: "High Efficiency (Optimistic)", color: C.green },
    pessimistic: { yG: [1, 1.02, 1.05, 1.10, 1.15], cD: [1, 0.99, 0.97, 0.95, 0.92], label: "Climate Stress (Pessimistic)", color: C.orange }
  };
  const mod = modifiers[scenario];

  const projectionYears = [1, 2, 3, 4, 5].map((yr, i) => {
    const gross = Math.round(calculatedGrossCurrent * mod.yG[i]);
    const operationalCost = Math.round(totalC2CostCurrent * mod.cD[i]);
    const netProfit = gross - operationalCost;
    const premiumBonus = i >= 1 ? Math.round(netProfit * 0.18) : restBonusCurrent;
    return {
      yr,
      gross,
      costs: operationalCost,
      net: netProfit,
      bonus: premiumBonus,
      totalComp: netProfit + premiumBonus,
      soc: parseFloat(Math.min(farmer.soc + i * 0.14, 1.6).toFixed(2)),
      roi: parseFloat(((netProfit / operationalCost) * 100).toFixed(1))
    };
  });

  const cumulativeGross = projectionYears.reduce((a, y) => a + y.gross, 0);
  const cumulativeNet = projectionYears.reduce((a, y) => a + y.net, 0);
  const cumulativeInvestment = projectionYears.reduce((a, y) => a + y.costs, 0);
  const chartMax = Math.max(...projectionYears.map(y => y.gross), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h3 style={{ fontWeight: 800, fontSize: 18, color: C.charcoal, margin: 0 }}>💰 Comprehensive Operational Ledger</h3>
        <p style={{ fontSize: 12, color: C.muted, margin: "2px 0 0" }}>Swaminathan C2 Costs + Free Market Premium Breakdown ({landAcres} Acres)</p>
      </div>

      {/* Scenario Filter Toggles */}
      <div style={{ display: "flex", gap: 8 }}>
        {Object.entries(modifiers).map(([key, s]) => (
          <button key={key} onClick={() => setScenario(key)} style={{ padding: "6px 14px", borderRadius: 20, border: `2px solid ${scenario === key ? s.color : C.border}`, background: scenario === key ? s.color : C.white, color: scenario === key ? C.white : C.muted, fontWeight: 700, fontSize: 12, cursor: "pointer", transition: "all 0.2s" }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Current Season Step-by-Step Ledger Card */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16, alignItems: "start" }}>
        <Card style={{ padding: 18 }}>
          <h4 style={{ fontWeight: 700, color: C.maroon, fontSize: 14, marginBottom: 12, borderBottom: `1px solid ${C.border}`, paddingBottom: 6 }}>📋 Seasonal Production Cost Breakdown (C2)</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "1. Sowing & Land Prep (Tillage, Bed formation)", val: costStructure.sowing },
              { label: "2. Seed & Fertilizer Inputs (Shopping List)", val: costStructure.inputs },
              { label: "3. Operational Labor (Weeding, Harvesting)", val: costStructure.labor },
              { label: "4. Custom Hiring (Squire Machinery Bay)", val: costStructure.machinery },
              { label: "5. Post-Harvest Logistics (Threshing, Transport)", val: costStructure.postHarvest }
            ].map((item, index) => (
              <div key={index} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, borderBottom: `1px dashed ${C.border}`, paddingBottom: 6 }}>
                <span style={{ color: C.charcoal }}>{item.label}</span>
                <span style={{ fontFamily: "monospace", fontWeight: 600 }}>₹{Math.round(item.val).toLocaleString()}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700, color: C.red, paddingTop: 6 }}>
              <span>Total Comprehensive Production Cost (C2)</span>
              <span style={{ fontFamily: "monospace" }}>== ₹{Math.round(totalC2CostCurrent).toLocaleString()}</span>
            </div>
          </div>
        </Card>

        {/* C2+50 Execution Yield Outcomes */}
        <Card style={{ background: C.maroonDark, color: C.white, padding: 18 }}>
          <h4 style={{ fontWeight: 700, color: C.goldLight, fontSize: 14, marginBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.15)", paddingBottom: 6 }}>🎯 C2 + 50% Profit Realization Index</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Projected Gross Market Sales:</span>
              <span style={{ fontSize: 18, fontWeight: 800, fontFamily: "monospace", color: C.goldLight }}>城乡 ₹{Math.round(calculatedGrossCurrent).toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Net Farmer Return Cushion:</span>
              <span style={{ fontSize: 18, fontWeight: 800, fontFamily: "monospace", color: "#90EE90" }}>₹{Math.round(netPLCurrent).toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed rgba(255,255,255,0.15)", paddingBottom: 10 }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Squire FPO Restorative Premium:</span>
              <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "monospace", color: "#90EE90" }}>+₹{Math.round(restBonusCurrent).toLocaleString()}</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.06)", padding: 10, borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 0.5 }}>Actual Margin Cushion Score</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: C.goldLight, marginTop: 2, fontFamily: "monospace" }}>
                {totalC2CostCurrent > 0 ? Math.round((netPLCurrent / totalC2CostCurrent) * 100) : 0}% Above C2
              </div>
              <div style={{ fontSize: 10, color: "#90EE90", marginTop: 2 }}>✓ Exceeds Swaminathan 50% Minimum Net Margin Gate</div>
            </div>
          </div>
        </Card>
      </div>

      {/* 5-Year Capital Accumulation Analytics Rows */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        {[
          { icon: "📈", label: "5-Year Cumulative Sales", val: `₹${(cumulativeGross / 100000).toFixed(2)}L`, color: C.blue },
          { icon: "💵", label: "5-Year Net Pocket Returns", val: `₹${(cumulativeNet / 100000).toFixed(2)}L`, color: C.green },
          { icon: "🔬", label: "Avg Return on Investment / Year", val: `${parseFloat((projectionYears.reduce((a, y) => a + y.roi, 0) / 5).toFixed(1))}%`, color: C.maroon }
        ].map((stat, idx) => (
          <Card key={idx} style={{ padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 18 }}>{stat.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: stat.color, marginTop: 4 }}>{stat.val}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Graphical Growth Projections Grid */}
      <Card style={{ padding: 18 }}>
        <h4 style={{ fontWeight: 700, color: C.maroon, fontSize: 14, marginBottom: 14 }}>📊 5-Year Financial Horizon Engine ({mod.label})</h4>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 130, marginBottom: 10, paddingTop: 10 }}>
          {projectionYears.map((y, i) => {
            const grossHeight = Math.round((y.gross / chartMax) * 90);
            const costHeight = Math.round((y.costs / chartMax) * 90);
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ fontSize: 10, color: C.green, fontWeight: 700 }}>₹{Math.round(y.gross / 1000)}K</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 90, width: "100%", justifyContent: "center" }}>
                  <div style={{ width: 16, height: `${grossHeight}%`, background: mod.color, borderRadius: "3px 3px 0 0", position: "relative" }} title="Gross revenue output" />
                  <div style={{ width: 16, height: `${costHeight}%`, background: C.border, borderRadius: "3px 3px 0 0" }} title="Production input cost" />
                </div>
                <div style={{ fontSize: 11, color: C.charcoal, fontWeight: 700 }}>Yr {y.yr}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 11, color: C.muted, borderTop: `1px solid ${C.border}`, paddingTop: 8 }}>
          <span><span style={{ display: "inline-block", width: 10, height: 10, background: mod.color, borderRadius: 2, marginRight:4 }} />Projected Gross Sales Valuation</span>
          <span><span style={{ display: "inline-block", width: 10, height: 10, background: C.border, borderRadius: 2, marginRight: 4 }} />Comprehensive C2 Cost Ledger</span>
        </div>
      </Card>

      {/* Detailed Multi-Year Tabular Matrix Ledger */}
      <Card style={{ padding: 16 }}>
        <h4 style={{ fontWeight: 700, color: C.maroon, fontSize: 14, marginBottom: 12 }}>📋 Multi-Year Structural P&L Balance Sheet</h4>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: C.cream, borderBottom: `2px solid ${C.maroon}` }}>
                {["Financial Performance Track", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"].map((h, i) => (
                  <th key={i} style={{ padding: "8px 10px", textAlign: i === 0 ? "left" : "right", color: C.charcoal, fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Gross Market Valuation", key: "gross", color: C.blue, bold: false },
                { label: "Comprehensive Cost Ledger (C2)", key: "costs", color: C.red, bold: false },
                { label: "Net Operational Income P&L", key: "net", color: C.green, bold: true },
                { label: "Squire Restorative Premium", key: "bonus", color: C.maroon, bold: false },
                { label: "Total Combined Capital Yield", key: "totalComp", color: C.green, bold: true },
                { label: "Return on Investment (ROI %)", key: "roi", color: C.charcoal, bold: false, raw: true },
                { label: "Remediated Soil Health (SOC %)", key: "soc", color: C.green, bold: false, raw: true }
              ].map((row, idx) => (
                <tr key={idx} style={{ borderBottom: `1px solid ${C.border}`, background: row.bold ? "#FDFDFD" : "transparent" }}>
                  <td style={{ padding: "9px 10px", fontWeight: row.bold ? 700 : 400, color: C.charcoal }}>{row.label}</td>
                  {projectionYears.map((year, yIdx) => {
                    const value = year[row.key];
                    const displayVal = row.raw ? (row.key === "roi" ? `${value}%` : `${value}% SOC`) : `₹${Math.round(value).toLocaleString()}`;
                    return (
                      <td key={yIdx} style={{ padding: "9px 10px", textAlign: "right", fontWeight: row.bold ? 700 : 400, color: row.key === "net" || row.key === "totalComp" ? C.green : row.color, fontFamily: "monospace" }}>
                        {displayVal}
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
  const [tab, setTab]=useState("soil");
  const [plan, setPlan]=useState(farmer.plan||null);
  const [loading, setLoading]=useState(false);
  const [error, setError]=useState(null);
  const [newProduce, setNewProduce]=useState({crop:"",qty:"",stage:"",buyer:"",harvestDate:""});
  const [addingProduce, setAddingProduce]=useState(false);

  const farmerRentals=rentals.filter(r=>r.farmerId===farmer.id);

  const inputItems=(plan?.inputShoppingList||[]).map(item=>{
    const rawCost=parseFloat(String(item.cost).replace(/[^0-9.]/g,""))||0;
    const isPerAcre=String(item.qty).toLowerCase().includes("acre");
    const landAcres=farmer.land*2.47;
    return {...item,unitCost:rawCost,totalCost:isPerAcre?Math.round(rawCost*landAcres):rawCost,isPerAcre,landAcres:Math.round(landAcres*10)/10};
  });
  const totalInputCost=inputItems.reduce((a,i)=>a+i.totalCost,0);

  const produceItems=farmer.produce.map(p=>{
    const pricePerKg=MANDI_PER_KG[p.crop]||30, grossRevenue=Math.round((parseFloat(p.qty)||0)*pricePerKg);
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

      {tab==="plan"&&(
        <div>
          {!plan&&!loading&&(
            <Card style={{textAlign:"center",padding:40}}>
              <div style={{fontSize:48,marginBottom:12}}>🧠</div>
              <div style={{fontWeight:700,fontSize:18,color:C.charcoal,marginBottom:8}}>Generate AI Crop Blueprint</div>
              <div style={{color:C.muted,fontSize:14,marginBottom:20}}>Analyses soil, water, crop history & economics to generate a 1/3/5-year restorative plan.</div>
              {error&&<div style={{color:C.red,marginBottom:14,fontSize:13,background:"#FDEDEC",padding:"8px 12px",borderRadius:6}}>{error}</div>}
              <Btn variant="primary" onClick={handleGenerate}>🌱 Generate Plan with AI</Btn>
            </Card>
          )}
          {loading&&(
            <Card style={{textAlign:"center",padding:48}}>
              <div style={{fontSize:42,marginBottom:12}}>⚙️</div>
              <div style={{fontWeight:700,fontSize:16,color:C.maroon}}>Digital Brain Processing…</div>
              <div style={{color:C.muted,fontSize:13,marginTop:8}}>Analysing soil, water, crop history & market data</div>
            </Card>
          )}
          {plan&&!loading&&(
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                <Card style={{textAlign:"center"}}><div style={{fontSize:32,fontWeight:800,color:plan.soilHealthScore>60?C.green:plan.soilHealthScore>35?C.orange:C.red}}>{plan.soilHealthScore}</div><div style={{fontSize:11,color:C.muted}}>Soil Health Score</div><Badge color={plan.soilHealthGrade==="Good"||plan.soilHealthGrade==="Excellent"?"green":"gold"}>{plan.soilHealthGrade}</Badge></Card>
                <Card style={{textAlign:"center"}}><div style={{fontSize:32,fontWeight:800,color:C.maroon}}>{plan.planScore}</div><div style={{fontSize:11,color:C.muted}}>Plan Score</div><Badge color="maroon">{plan.profitabilityIndex}</Badge></Card>
                <Card style={{textAlign:"center"}}><div style={{fontSize:22,fontWeight:800,color:plan.degradationRisk==="High"?C.red:plan.degradationRisk==="Medium"?C.orange:C.green}}>{plan.degradationRisk}</div><div style={{fontSize:11,color:C.muted}}>Degradation Risk</div></Card>
              </div>
              <Card><div style={{fontWeight:700,color:C.maroon,marginBottom:10,fontSize:14}}>⚠️ Key Issues</div>{plan.keyIssues?.map((issue,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:6,fontSize:13}}><span style={{color:C.orange}}>•</span><span>{issue}</span></div>)}</Card>
              <Card>
                <div style={{fontWeight:700,color:C.maroon,marginBottom:12,fontSize:14}}>📅 Year 1 Crop Rotation</div>
                {[plan.year1?.season1,plan.year1?.season2].filter(Boolean).map((s,i)=>(
                  <div key={i} style={{background:C.cream,borderRadius:10,padding:14,marginBottom:10}}>
                    <div style={{fontWeight:700,fontSize:14,color:C.green,marginBottom:6}}>Season {i+1}: {s.crop} ({s.variety})</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,fontSize:12}}>
                      {[["Sow",s.sowMonth],["Harvest",s.harvestMonth],["Yield",s.expectedYield],["Profit",s.netProfit]].map(([k,v])=><div key={k}><span style={{color:C.muted}}>{k}: </span><span style={{fontWeight:600}}>{v}</span></div>)}
                    </div>
                    <div style={{marginTop:8,fontSize:12,color:C.green}}><strong>Soil:</strong> {s.soilBenefit}</div>
                  </div>
                ))}
              </Card>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[["3-Year",plan.year3Target],["5-Year",plan.year5Target]].map(([label,t])=>t&&(
                  <Card key={label}><div style={{fontWeight:700,color:C.maroon,fontSize:13,marginBottom:8}}>{label} Target</div><div style={{fontSize:12,color:C.muted}}>SOC: <strong style={{color:C.green}}>{t.socImprovement}</strong></div><div style={{fontSize:12,color:C.muted}}>Profit: <strong style={{color:C.green}}>{t.profitIncrease}</strong></div><div style={{fontSize:11,color:C.charcoal,marginTop:4}}>{t.crops?.join(" → ")}</div></Card>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <Card><div style={{fontWeight:700,color:C.maroon,fontSize:13,marginBottom:8}}>🌦 Weather Logic</div><div style={{fontSize:12,color:C.muted}}>Sowing: <strong>{plan.weatherLogic?.sowingWindow}</strong></div><div style={{fontSize:12,color:C.muted,marginTop:4}}>Irrigation: <strong>{plan.weatherLogic?.irrigationSchedule}</strong></div><div style={{fontSize:12,color:C.muted,marginTop:4}}>Harvest: <strong>{plan.weatherLogic?.harvestWindow}</strong></div></Card>
                <Card><div style={{fontWeight:700,color:C.maroon,fontSize:13,marginBottom:8}}>📊 Mandi Intelligence</div><div style={{fontSize:12,color:C.muted}}>Best Month: <strong>{plan.mandiTiming?.bestMonth}</strong></div><div style={{fontSize:12,color:C.muted,marginTop:4}}>Price: <strong style={{color:C.green}}>{plan.mandiTiming?.expectedPrice}</strong></div><div style={{fontSize:12,color:C.muted,marginTop:4}}>{plan.mandiTiming?.recommendation}</div></Card>
              </div>
              <Card><div style={{fontWeight:700,color:C.maroon,fontSize:13,marginBottom:8}}>🐛 Pest Alert</div><div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}><Badge color={plan.pestAlert?.riskLevel==="High"?"maroon":plan.pestAlert?.riskLevel==="Medium"?"gold":"green"}>{plan.pestAlert?.riskLevel} Risk</Badge><span style={{fontSize:12,color:C.muted}}>{plan.pestAlert?.likely?.join(", ")}</span></div><div style={{fontSize:12}}><strong>Bio-intervention:</strong> {plan.pestAlert?.bioIntervention}</div></Card>
              <Btn variant="gold" onClick={handleGenerate} small style={{alignSelf:"flex-start"}}>🔄 Regenerate</Btn>
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
              {newProduce.crop&&newProduce.qty&&<div style={{background:C.greenPale,borderRadius:8,padding:"8px 12px",marginTop:4,marginBottom:10,fontSize:13}}>Est. Revenue: <strong style={{color:C.green}}>₹{Math.round((parseFloat(newProduce.qty)||0)*(MANDI_PER_KG[newProduce.crop]||30)).toLocaleString()}</strong><span style={{color:C.muted,fontSize:11,marginLeft:8}}>@ ₹{MANDI_PER_KG[newProduce.crop]||30}/kg</span></div>}
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

      {tab==="economics"&&<EconomicsTab farmer={farmer} plan={plan} totalInputCost={totalInputCost} totalNetRevenue={totalNetRevenue} totalGrossRevenue={totalGrossRevenue} totalCommission={totalCommission} machineryRentalCost={machineryRentalCost} machineryPending={0} netPL={netPL} restorativePremium={restorativePremium} totalCosts={totalInputCost+machineryRentalCost}/>}
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

// ─── DASHBOARD ───────────────────────────────────────────────────
function Dashboard({ farmers, onSelect, onNew, onViewReports, onViewMachinery }) {
  const [activeSection, setActiveSection]=useState("overview");
  const [mandiRange, setMandiRange]=useState("7D");
  const [searchQ, setSearchQ]=useState("");

  const assessed=farmers.filter(f=>f.planGenerated).length;
  const allProduce=farmers.flatMap(f=>f.produce);

  const MANDI_DATA={
    "7D":{labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],wheat:[2280,2295,2310,2305,2320,2335,2340],mustard:[5680,5700,5740,5720,5760,5790,5800],gram:[5020,5035,5060,5045,5070,5090,5100]},
    "30D":{labels:["W1","W2","W3","W4"],wheat:[2150,2210,2260,2340],mustard:[5400,5500,5650,5800],gram:[4800,4900,5000,5100]},
    "90D":{labels:["Apr","May","Jun"],wheat:[2080,2190,2310],mustard:[5150,5420,5720],gram:[4600,4850,5060]},
  };
  const md=MANDI_DATA[mandiRange];

  const NAV=[{id:"overview",icon:"▦",label:"Overview"},{id:"market",icon:"↗",label:"Market Sales"},{id:"seed",icon:"🌱",label:"Seed & Inputs"},{id:"farmers",icon:"👥",label:"Farmer Network"},{id:"brain",icon:"🧠",label:"Digital Brain"},{id:"outlets",icon:"🏪",label:"Squire Outlets"}];
  const TXN=[{name:"Ramesh Tiwari",crop:"Wheat",qty:"12 Qtl",price:"₹2,340",mandi:"Jhansi",status:"sold"},{name:"Meera Devi",crop:"Mustard",qty:"6 Qtl",price:"₹5,800",mandi:"Jhansi",status:"sold"},{name:"Vijay Kushwaha",crop:"Gram",qty:"9 Qtl",price:"₹5,050",mandi:"Banda",status:"transit"},{name:"Anita Rajput",crop:"Wheat",qty:"15 Qtl",price:"₹2,310",mandi:"Mahoba",status:"sold"},{name:"Mahendra Singh",crop:"Mustard",qty:"4 Qtl",price:"₹5,650",mandi:"Jhansi",status:"pending"},{name:"Suresh Yadav",crop:"Gram",qty:"7 Qtl",price:"₹4,980",mandi:"Banda",status:"sold"}];
  const SEED_INV=[{name:"Wheat HD-3086",stock:38,threshold:25,max:40,status:"healthy"},{name:"Gram Pusa-256",stock:14,threshold:15,max:24,status:"low"},{name:"Mustard Pusa Bold",stock:9,threshold:12,max:24,status:"critical"},{name:"Bajra HHB-67",stock:22,threshold:10,max:24,status:"healthy"},{name:"Moong Pusa Vishal",stock:11,threshold:10,max:15,status:"healthy"}];
  const INV_C={healthy:"#4A7C59",low:"#C8963E",critical:"#B2402F"};
  const SB_C={sold:{bg:"#DCEEE1",color:"#2F6B45",label:"Sold"},transit:{bg:"#DCEAF2",color:"#3B6E91",label:"In Transit"},pending:{bg:"#F7E8C9",color:"#8A5A12",label:"Pending"}};
  const REV_DATA=[{crop:"Wheat",rev:182000,color:"#6B1E3B"},{crop:"Mustard",rev:134000,color:"#C8963E"},{crop:"Gram",rev:96000,color:"#4A7C59"},{crop:"Moong",rev:52000,color:"#3B6E91"},{crop:"Bajra",rev:38000,color:"#8A7C6C"}];
  const revMax=Math.max(...REV_DATA.map(d=>d.rev));
  const INPUT_MIX=[{label:"Seeds",pct:45,color:"#6B1E3B"},{label:"Fertilizer & Bio",pct:30,color:"#C8963E"},{label:"Machinery Rental",pct:15,color:"#4A7C59"},{label:"Cold Storage",pct:10,color:"#3B6E91"}];

  const filteredTxn=TXN.filter(r=>!searchQ||Object.values(r).join(" ").toLowerCase().includes(searchQ.toLowerCase()));
  const filteredFarmers=farmers.filter(f=>!searchQ||`${f.name} ${f.village} ${f.district} ${f.cropHistory}`.toLowerCase().includes(searchQ.toLowerCase()));

  const scrollTo=(id)=>{ setActiveSection(id); document.getElementById("dash-"+id)?.scrollIntoView({behavior:"smooth",block:"start"}); };

  return (
    <div style={{display:"flex",minHeight:"100vh",fontFamily:"'Inter',sans-serif"}}>
      {/* Sidebar */}
      <aside style={{width:248,background:"linear-gradient(180deg,#241509 0%,#1A0E05 100%)",color:"#E9DFD2",position:"fixed",top:0,left:0,bottom:0,display:"flex",flexDirection:"column",padding:"28px 18px",zIndex:20,overflowY:"auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,paddingBottom:24,borderBottom:"1px solid rgba(255,255,255,.08)",marginBottom:22}}>
          <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#C8963E 0%,#6B1E3B 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:"#fff",fontSize:18}}>S</div>
          <div><div style={{fontWeight:600,fontSize:17,color:"#fff",fontFamily:"serif"}}>Squire</div><div style={{fontSize:10,color:"#E8C77E",letterSpacing:"0.06em",textTransform:"uppercase"}}>Digital Brain</div></div>
        </div>
        <nav style={{display:"flex",flexDirection:"column",gap:2}}>
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>scrollTo(n.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderRadius:9,background:activeSection===n.id?"rgba(200,150,62,.16)":"transparent",color:activeSection===n.id?"#E8C77E":"#C9B8A8",fontSize:13.5,fontWeight:500,border:"none",cursor:"pointer",textAlign:"left",position:"relative"}}>
              <span style={{fontSize:14}}>{n.icon}</span>{n.label}
              {activeSection===n.id&&<span style={{position:"absolute",left:-18,top:"50%",transform:"translateY(-50%)",width:3,height:18,background:"#C8963E",borderRadius:"0 3px 3px 0"}}/>}
            </button>
          ))}
        </nav>
        <div style={{display:"flex",flexDirection:"column",gap:8,margin:"20px 0"}}>
          <button onClick={onNew} style={{background:"#6B1E3B",color:"#fff",border:"none",borderRadius:8,padding:"9px 14px",fontSize:13,fontWeight:600,cursor:"pointer",textAlign:"left"}}>+ Onboard Farmer</button>
          <button onClick={onViewReports} style={{background:"rgba(255,255,255,.07)",color:"#E9DFD2",border:"1px solid rgba(255,255,255,.12)",borderRadius:8,padding:"9px 14px",fontSize:13,fontWeight:500,cursor:"pointer",textAlign:"left"}}>📊 Statistical Reports</button>
          <button onClick={onViewMachinery} style={{background:"rgba(255,255,255,.07)",color:"#E9DFD2",border:"1px solid rgba(255,255,255,.12)",borderRadius:8,padding:"9px 14px",fontSize:13,fontWeight:500,cursor:"pointer",textAlign:"left"}}>🚜 Machinery Hub</button>
        </div>
        <div style={{marginTop:"auto",paddingTop:18,borderTop:"1px solid rgba(255,255,255,.08)",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:"50%",background:"#6B1E3B",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,color:"#fff"}}>HV</div>
          <div><div style={{fontSize:12.5,fontWeight:600,color:"#F0E6D6"}}>Harshit Vimal</div><div style={{fontSize:10.5,color:"#9C8C7A"}}>Field Operations</div></div>
        </div>
      </aside>

      {/* Main */}
      <main style={{marginLeft:248,flex:1,padding:"30px 38px 60px",maxWidth:1080}}>
        {/* Topbar */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:24,marginBottom:22,flexWrap:"wrap"}}>
          <div>
            <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:"#8A7C6C",marginBottom:4}}>Bundelkhand Pilot · Jhansi Cluster</div>
            <h1 style={{fontFamily:"serif",fontWeight:600,fontSize:28,color:"#2B211B"}}>Good morning, <em style={{fontStyle:"italic",color:"#6B1E3B",fontWeight:500}}>Harshit</em></h1>
            <div style={{fontSize:13,color:"#8A7C6C",marginTop:4}}>Friday, 27 June 2026 · Here's how the outlet is performing</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:8,background:"#fff",border:"1px solid #E8DFD2",borderRadius:10,padding:"8px 12px",minWidth:220}}>
              <span style={{fontSize:14,color:"#8A7C6C"}}>🔍</span>
              <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} type="text" placeholder="Search farmers, crops, Mandi…" style={{border:"none",outline:"none",background:"transparent",fontSize:13,width:"100%",color:"#2B211B"}}/>
            </div>
          </div>
        </div>

        {/* Season strip */}
        <div style={{display:"flex",alignItems:"center",marginBottom:22,background:"#fff",border:"1px solid #E8DFD2",borderRadius:12,padding:"14px 20px"}}>
          <div style={{fontSize:11,fontWeight:600,color:"#8A7C6C",letterSpacing:"0.05em",textTransform:"uppercase",marginRight:18,whiteSpace:"nowrap"}}>Crop Season</div>
          <div style={{flex:1,display:"flex",gap:6,paddingTop:22}}>
            {[{label:"Kharif · Jun–Oct",flex:0.42,active:true},{label:"Rabi · Oct–Mar",flex:0.42,active:false},{label:"Zaid · Mar–Jun",flex:0.16,active:false}].map((seg,i)=>(
              <div key={i} style={{flex:seg.flex,height:8,borderRadius:5,background:seg.active?"linear-gradient(90deg,#C8963E 0%,#4A7C59 100%)":"#E8DFD2",position:"relative"}}>
                <span style={{position:"absolute",top:-18,left:0,fontSize:10.5,fontWeight:600,color:seg.active?"#6B1E3B":"#8A7C6C",whiteSpace:"nowrap"}}>{seg.label}</span>
                {seg.active&&<div style={{position:"absolute",top:-4,left:"6%",width:14,height:14,borderRadius:"50%",background:"#6B1E3B",border:"2.5px solid #fff",boxShadow:"0 0 0 2px #6B1E3B"}}/>}
              </div>
            ))}
          </div>
        </div>

        {/* Alert */}
        <div style={{display:"flex",alignItems:"center",gap:10,background:"#F7E8C9",color:"#8A5A12",border:"1px solid #EBD49C",borderRadius:11,padding:"11px 16px",marginBottom:26,fontSize:13,fontWeight:500}}>
          ⚠️ <span><strong>2 seed varieties</strong> below reorder threshold · <strong>1 Mandi price alert</strong> needs review</span>
        </div>

        {/* OVERVIEW */}
        <section id="dash-overview" style={{marginBottom:40,scrollMarginTop:24}}>
          <span style={{display:"inline-block",fontSize:10.5,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"#6B1E3B",background:"#F4E2EA",padding:"3px 10px",borderRadius:20,marginBottom:8}}>Overview</span>
          <h2 style={{fontFamily:"serif",fontWeight:600,fontSize:23,color:"#2B211B",marginBottom:16}}>Outlet at a Glance</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
            {[{label:"Active Farmers",value:`${farmers.length+309}`,delta:"▲ 18 this month",up:true,spark:[200,210,220,230,240,255,farmers.length+309],color:"#4A7C59"},{label:"Outlet Revenue · MTD",value:"₹4.82L",delta:"▲ 12% vs last month",up:true,spark:[340000,360000,380000,400000,430000,460000,482000],color:"#C8963E"},{label:"Soil Health Index",value:null,delta:"▲ 6 pts vs baseline",up:true,ring:{value:68,max:100,color:"#4A7C59"}},{label:"Seed Stock Health",value:null,delta:"⚠ 2 items low",up:false,ring:{value:82,max:100,color:"#C8963E"}}].map((k,i)=>(
              <div key={i} style={{background:"#fff",border:"1px solid #E8DFD2",borderRadius:14,padding:"18px 20px",boxShadow:"0 1px 2px rgba(43,33,27,.04),0 6px 18px rgba(43,33,27,.06)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11.5,fontWeight:600,color:"#8A7C6C",textTransform:"uppercase",letterSpacing:"0.04em"}}>{k.label}</div>
                    {k.value&&<div style={{fontFamily:"monospace",fontSize:26,fontWeight:600,color:"#2B211B",marginTop:2}}>{k.value}</div>}
                    {k.ring&&<div style={{fontFamily:"monospace",fontSize:26,fontWeight:600,color:"#2B211B",marginTop:2}}>{k.ring.value}<span style={{fontSize:14,color:"#8A7C6C"}}>{k.ring.value===68?"/100":"%"}</span></div>}
                    <div style={{display:"inline-flex",alignItems:"center",gap:3,fontSize:11.5,fontWeight:600,marginTop:2,color:k.up?"#2F6B45":"#8A5A12"}}>{k.delta}</div>
                  </div>
                  {k.spark&&<Sparkline points={k.spark} color={k.color}/>}
                  {k.ring&&<RingGauge value={k.ring.value} max={k.ring.max} color={k.ring.color} size={58}/>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MARKET SALES */}
        <section id="dash-market" style={{marginBottom:40,scrollMarginTop:24}}>
          <span style={{display:"inline-block",fontSize:10.5,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"#6B1E3B",background:"#F4E2EA",padding:"3px 10px",borderRadius:20,marginBottom:8}}>Market Sales</span>
          <h2 style={{fontFamily:"serif",fontWeight:600,fontSize:23,color:"#2B211B",marginBottom:16}}>Mandi Prices & Transactions</h2>
          <div style={{display:"grid",gridTemplateColumns:"1.55fr 1fr",gap:18,marginBottom:18}}>
            <div style={{background:"#fff",border:"1px solid #E8DFD2",borderRadius:14,padding:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <h3 style={{fontFamily:"serif",fontWeight:600,fontSize:16}}>Mandi Price Trend (₹/Qtl)</h3>
                <div style={{display:"flex",background:"#FAF6EF",border:"1px solid #E8DFD2",borderRadius:8,padding:3,gap:2}}>
                  {["7D","30D","90D"].map(r=><button key={r} onClick={()=>setMandiRange(r)} style={{border:"none",padding:"5px 11px",borderRadius:6,fontSize:11.5,fontWeight:600,cursor:"pointer",background:mandiRange===r?"#6B1E3B":"transparent",color:mandiRange===r?"#fff":"#8A7C6C"}}>{r}</button>)}
                </div>
              </div>
              <div style={{display:"flex",gap:12,marginBottom:10}}>
                {[["Wheat","#6B1E3B"],["Mustard","#C8963E"],["Gram","#4A7C59"]].map(([label,color])=>(
                  <span key={label} style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:11.5,fontWeight:600,color:"#8A7C6C",border:"1px solid #E8DFD2",padding:"4px 10px",borderRadius:20,background:"#fff"}}>
                    <span style={{width:9,height:9,borderRadius:"50%",background:color,display:"inline-block"}}/>{label}
                  </span>
                ))}
              </div>
              <svg viewBox="0 0 400 130" width="100%" style={{overflow:"visible"}}>
                {[0,0.25,0.5,0.75,1].map((t,i)=><line key={i} x1="0" y1={t*100+10} x2="400" y2={t*100+10} stroke="#EFE8DB" strokeWidth="1"/>)}
                {[{data:md.wheat,color:"#6B1E3B",min:2000,max:2500},{data:md.mustard,color:"#C8963E",min:5000,max:6000},{data:md.gram,color:"#4A7C59",min:4500,max:5500}].map(({data,color,min,max})=>{
                  const n=data.length;
                  const pts=data.map((v,i)=>`${(i/(n-1))*380+10},${110-((v-min)/(max-min))*90}`).join(" ");
                  return <polyline key={color} points={pts} stroke={color} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>;
                })}
                {md.labels.map((lbl,i)=><text key={i} x={(i/(md.labels.length-1))*380+10} y="128" textAnchor="middle" fontSize="9" fill="#8A7C6C">{lbl}</text>)}
              </svg>
            </div>
            <div style={{background:"#fff",border:"1px solid #E8DFD2",borderRadius:14,padding:20}}>
              <h3 style={{fontFamily:"serif",fontWeight:600,fontSize:16,marginBottom:14}}>This Week's Snapshot</h3>
              {[["Avg. Wheat Price","₹2,340"],["Avg. Mustard Price","₹5,800"],["Avg. Gram Price","₹5,100"],["Total Volume Sold","186 Qtl"],["Top Mandi","Jhansi Mandi"],["Best Buyer","Bundeli Agro Traders"]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px dashed #E8DFD2"}}>
                  <span style={{fontSize:12.5,color:"#8A7C6C"}}>{l}</span><span style={{fontFamily:"monospace",fontSize:15,fontWeight:600,color:"#6B1E3B"}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1.2fr",gap:18}}>
            <div style={{background:"#fff",border:"1px solid #E8DFD2",borderRadius:14,padding:20}}>
              <h3 style={{fontFamily:"serif",fontWeight:600,fontSize:16,marginBottom:14}}>Revenue by Crop · This Month</h3>
              {REV_DATA.map(d=>(
                <div key={d.crop} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{fontWeight:600}}>{d.crop}</span><span style={{fontFamily:"monospace",color:"#8A7C6C"}}>₹{(d.rev/1000).toFixed(0)}K</span></div>
                  <div style={{height:22,background:"#FAF6EF",borderRadius:6,overflow:"hidden"}}><div style={{width:`${Math.round((d.rev/revMax)*100)}%`,height:"100%",background:d.color,borderRadius:6}}/></div>
                </div>
              ))}
            </div>
            <div style={{background:"#fff",border:"1px solid #E8DFD2",borderRadius:14,padding:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <h3 style={{fontFamily:"serif",fontWeight:600,fontSize:16}}>Recent Transactions</h3>
                <span style={{fontSize:11,color:"#8A7C6C"}}>{filteredTxn.length} records</span>
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12.5}}>
                  <thead><tr>{["Farmer","Crop","Qty","₹/Qtl","Mandi","Status"].map(h=><th key={h} style={{textAlign:"left",fontSize:10.5,fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase",color:"#8A7C6C",padding:"0 8px 8px",borderBottom:"1.5px solid #E8DFD2"}}>{h}</th>)}</tr></thead>
                  <tbody>
                    {filteredTxn.map((r,i)=>{const b=SB_C[r.status]||SB_C.pending; return <tr key={i} style={{borderBottom:"1px solid #E8DFD2"}}><td style={{padding:"9px 8px"}}>{r.name}</td><td style={{padding:"9px 8px"}}>{r.crop}</td><td style={{padding:"9px 8px",fontFamily:"monospace"}}>{r.qty}</td><td style={{padding:"9px 8px",fontFamily:"monospace"}}>{r.price}</td><td style={{padding:"9px 8px"}}>{r.mandi}</td><td style={{padding:"9px 8px"}}><span style={{background:b.bg,color:b.color,fontSize:10.5,fontWeight:700,padding:"3px 9px",borderRadius:20}}>{b.label}</span></td></tr>;})}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* SEED & INPUT SALES */}
        <section id="dash-seed" style={{marginBottom:40,scrollMarginTop:24}}>
          <span style={{display:"inline-block",fontSize:10.5,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"#6B1E3B",background:"#F4E2EA",padding:"3px 10px",borderRadius:20,marginBottom:8}}>Seed & Input Sales</span>
          <h2 style={{fontFamily:"serif",fontWeight:600,fontSize:23,color:"#2B211B",marginBottom:16}}>Inventory & Sell-Through</h2>
          <div style={{display:"grid",gridTemplateColumns:"1.55fr 1fr",gap:18,marginBottom:18}}>
            <div style={{background:"#fff",border:"1px solid #E8DFD2",borderRadius:14,padding:20}}>
              <h3 style={{fontFamily:"serif",fontWeight:600,fontSize:16,marginBottom:16}}>Seed Inventory Levels</h3>
              {SEED_INV.map(s=>(
                <div key={s.name} style={{marginBottom:16}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6}}>
                    <span style={{fontSize:13,fontWeight:600}}><span style={{display:"inline-block",width:7,height:7,borderRadius:"50%",background:INV_C[s.status],marginRight:6}}/>{s.name}</span>
                    <span style={{fontFamily:"monospace",fontSize:11.5,color:"#8A7C6C"}}>{s.stock}/{s.threshold} Qtl</span>
                  </div>
                  <div style={{position:"relative",height:9,background:"#FAF6EF",borderRadius:6}}>
                    <div style={{width:`${Math.round((s.stock/s.max)*100)}%`,height:"100%",background:INV_C[s.status],borderRadius:6}}/>
                    <div style={{position:"absolute",top:-3,left:`${Math.round((s.threshold/s.max)*100)}%`,width:2,height:15,background:"#2B211B",opacity:0.35}}/>
                  </div>
                </div>
              ))}
            </div>
            <div style={{background:"#fff",border:"1px solid #E8DFD2",borderRadius:14,padding:20}}>
              <h3 style={{fontFamily:"serif",fontWeight:600,fontSize:16,marginBottom:12}}>Low Stock Alerts</h3>
              {[{text:<><strong>Mustard Pusa Bold</strong> — 9 Qtl, below 12 Qtl threshold. Reorder in 3 days.</>,critical:true},{text:<><strong>Gram Pusa-256</strong> — 14 Qtl, nearing threshold. Monitor demand.</>,critical:false}].map((a,i)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 12px",borderRadius:9,background:a.critical?"#F6DCD7":"#F7E8C9",marginBottom:8}}>
                  <span style={{fontSize:15,marginTop:1}}>{a.critical?"🔴":"🟡"}</span>
                  <div style={{fontSize:12,fontWeight:500,color:"#2B211B"}}>{a.text}</div>
                </div>
              ))}
              <h3 style={{fontFamily:"serif",fontWeight:600,fontSize:16,marginTop:20,marginBottom:12}}>Input Sales Mix</h3>
              {INPUT_MIX.map(m=>(
                <div key={m.label} style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}>
                    <span style={{display:"flex",alignItems:"center",gap:6}}><span style={{width:9,height:9,borderRadius:"50%",background:m.color,display:"inline-block"}}/>{m.label}</span>
                    <span style={{fontFamily:"monospace",fontWeight:600}}>{m.pct}%</span>
                  </div>
                  <div style={{height:6,background:"#FAF6EF",borderRadius:4,overflow:"hidden"}}><div style={{width:`${m.pct}%`,height:"100%",background:m.color,borderRadius:4}}/></div>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1.2fr",gap:18}}>
            <div style={{background:"#fff",border:"1px solid #E8DFD2",borderRadius:14,padding:20}}>
              <h3 style={{fontFamily:"serif",fontWeight:600,fontSize:16,marginBottom:14}}>Top Selling Varieties · This Month</h3>
              {[["Wheat HD-3086",34],["Mustard Pusa Bold",24],["Gram Pusa-256",19],["Moong Pusa Vishal",14],["Bajra HHB-67",9]].map(([name,pct],i)=>(
                <div key={name} style={{display:"flex",alignItems:"center",gap:12,marginBottom:13}}>
                  <div style={{width:22,height:22,borderRadius:6,background:"#FAF6EF",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"monospace",fontSize:11,fontWeight:700,color:"#6B1E3B",flexShrink:0}}>{i+1}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12.5,marginBottom:5}}><span style={{fontWeight:600}}>{name}</span><span style={{fontFamily:"monospace",color:"#8A7C6C"}}>{pct}%</span></div>
                    <div style={{height:6,background:"#FAF6EF",borderRadius:4,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:"linear-gradient(90deg,#C8963E 0%,#6B1E3B 100%)",borderRadius:4}}/></div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{background:"#fff",border:"1px solid #E8DFD2",borderRadius:14,padding:20}}>
              <h3 style={{fontFamily:"serif",fontWeight:600,fontSize:16,marginBottom:14}}>Seed Sales Summary</h3>
              {[["Total Seed Revenue · MTD","₹1.46L"],["Units Sold This Month","94 Qtl"],["Avg. Margin","17.5%"],["Farmers Served (Inputs)","211"],["Active Vendor Partners","3"],["Next Restock ETA","24 Jun 2026"]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px dashed #E8DFD2"}}>
                  <span style={{fontSize:12.5,color:"#8A7C6C"}}>{l}</span><span style={{fontFamily:"monospace",fontSize:15,fontWeight:600}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FARMER NETWORK */}
        <section id="dash-farmers" style={{marginBottom:40,scrollMarginTop:24}}>
          <span style={{display:"inline-block",fontSize:10.5,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"#6B1E3B",background:"#F4E2EA",padding:"3px 10px",borderRadius:20,marginBottom:8}}>Farmer Network</span>
          <h2 style={{fontFamily:"serif",fontWeight:600,fontSize:23,color:"#2B211B",marginBottom:16}}>Village Clusters & Champions</h2>
          <div style={{background:"#fff",border:"1px solid #E8DFD2",borderRadius:14,padding:20,marginBottom:16}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
              {[["Babina","Suresh Yadav",88],["Moth","Meera Devi",76],["Mauranipur","Vijay Kushwaha",84],["Garautha","Anita Rajput",64]].map(([name,champ,n])=>(
                <div key={name} style={{background:"#FAF6EF",border:"1px solid #E8DFD2",borderRadius:11,padding:14}}>
                  <div style={{fontWeight:700,fontSize:13.5,marginBottom:2}}>{name}</div>
                  <div style={{fontSize:11,color:"#8A7C6C",marginBottom:10}}>Champion: {champ}</div>
                  <div style={{fontFamily:"monospace",fontSize:20,fontWeight:600,color:"#6B1E3B"}}>{n}</div>
                  <div style={{fontSize:10.5,color:"#8A7C6C",textTransform:"uppercase",letterSpacing:"0.04em"}}>Farmers</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{background:"#fff",border:"1px solid #E8DFD2",borderRadius:14,padding:20}}>
            <h3 style={{fontFamily:"serif",fontWeight:600,fontSize:16,marginBottom:14}}>Live Farmer Records</h3>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {filteredFarmers.map(f=>(
                <div key={f.id} onClick={()=>onSelect(f)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:"#FAF6EF",borderRadius:10,cursor:"pointer",border:"1px solid #E8DFD2",flexWrap:"wrap",gap:8}}>
                  <div><div style={{fontWeight:700,fontSize:14,color:"#2B211B"}}>{f.name}</div><div style={{fontSize:12,color:"#8A7C6C"}}>{f.village}, {f.district} · {f.land}ha · {f.soilType}</div></div>
                  <div style={{display:"flex",gap:6}}>
                    <span style={{background:f.planGenerated?"#DCEEE1":"#F7E8C9",color:f.planGenerated?"#2F6B45":"#8A5A12",fontSize:10.5,fontWeight:700,padding:"3px 9px",borderRadius:20}}>{f.status}</span>
                    {f.produce.length>0&&<span style={{background:"#DCEAF2",color:"#3B6E91",fontSize:10.5,fontWeight:700,padding:"3px 9px",borderRadius:20}}>{f.produce.length} batch{f.produce.length>1?"es":""}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DIGITAL BRAIN */}
        <section id="dash-brain" style={{marginBottom:40,scrollMarginTop:24}}>
          <span style={{display:"inline-block",fontSize:10.5,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"#6B1E3B",background:"#F4E2EA",padding:"3px 10px",borderRadius:20,marginBottom:8}}>Digital Brain</span>
          <h2 style={{fontFamily:"serif",fontWeight:600,fontSize:23,color:"#2B211B",marginBottom:16}}>AI Blueprint Status</h2>
          <div style={{background:"#fff",border:"1px solid #E8DFD2",borderRadius:14,padding:24}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
              {[{value:Math.round((assessed/Math.max(farmers.length,1))*100),max:100,color:"#6B1E3B",label:"Blueprints Issued",sub:`${assessed} of ${farmers.length} farmers`},{value:96,max:100,color:"#4A7C59",label:"Soil Tests Completed",sub:"298 of 312 farms"},{value:78,max:100,color:"#C8963E",label:"Pest Alerts Active",sub:"14 advisories sent"}].map((b,i)=>(
                <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,textAlign:"center",padding:8}}>
                  <RingGauge value={b.value} max={b.max} color={b.color} size={84}/>
                  <div style={{fontSize:12,fontWeight:600,marginTop:2}}>{b.label}</div>
                  <div style={{fontSize:10.5,color:"#8A7C6C"}}>{b.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OUTLETS */}
        <section id="dash-outlets" style={{marginBottom:40,scrollMarginTop:24}}>
          <span style={{display:"inline-block",fontSize:10.5,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"#6B1E3B",background:"#F4E2EA",padding:"3px 10px",borderRadius:20,marginBottom:8}}>Squire Outlets</span>
          <h2 style={{fontFamily:"serif",fontWeight:600,fontSize:23,color:"#2B211B",marginBottom:16}}>Outlet Operations</h2>
          <div style={{background:"#fff",border:"1px solid #E8DFD2",borderRadius:14,padding:24}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>
              {[["Machinery Rental Bay","2 of 2 in use"],["Cold Storage Occupancy","64%"],["Outlet Footfall Today","37 farmers"],["Avg. Soil Health",`${Math.round((farmers.reduce((a,f)=>a+f.soc,0)/Math.max(farmers.length,1))*100)}pts`],["Active Machinery Bookings","2 confirmed"],["Produce in Cold Storage",`${allProduce.filter(p=>p.stage==="Cold Storage").length} batches`]].map(([l,v])=>(
                <div key={l} style={{padding:"14px 0",borderBottom:"1px dashed #E8DFD2"}}>
                  <div style={{fontSize:12,color:"#8A7C6C",marginBottom:4}}>{l}</div>
                  <div style={{fontFamily:"monospace",fontSize:18,fontWeight:600}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div style={{marginTop:50,paddingTop:20,borderTop:"1px solid #E8DFD2",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
          <p style={{fontSize:11,color:"#8A7C6C"}}>Squire Digital Brain · Internal Operations Dashboard · Bundelkhand Pilot</p>
          <span style={{fontSize:10,fontWeight:700,color:"#8A7C6C",background:"#FAF6EF",border:"1px solid #E8DFD2",padding:"3px 9px",borderRadius:20}}>Live data from app</span>
        </div>
      </main>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────
export default function App() {
  const [view, setView]=useState("dashboard");
  const [farmers, setFarmers]=useState(INITIAL_FARMERS);
  const [selected, setSelected]=useState(null);
  const [rentals, setRentals]=useState(INITIAL_RENTALS);

  const handleSaveFarmer=f=>{ setFarmers(prev=>[...prev,f]); setView("dashboard"); };
  const handleUpdateFarmer=u=>{ setFarmers(prev=>prev.map(f=>f.id===u.id?u:f)); setSelected(u); };
  const handleSelectFarmer=f=>{ setSelected(f); setView("detail"); };
  const handleAddRental=r=>setRentals(prev=>[...prev,r]);
  const liveSelected=selected?farmers.find(f=>f.id===selected.id)||selected:null;
  const breadcrumb={onboard:"Onboard Farmer",detail:liveSelected?.name||"",reports:"Reports",machinery:"Machinery Hub"};

  return (
    <div style={{fontFamily:"'Inter',system-ui,sans-serif",background:C.cream,minHeight:"100vh"}}>

      {/* Top header bar — only shown on non-dashboard views */}
      {view!=="dashboard"&&(
        <div style={{background:C.maroonDark,padding:"0 20px"}}>
          <div style={{maxWidth:820,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:56}}>
            <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setView("dashboard")}>
              <div style={{width:32,height:32,borderRadius:8,background:C.gold,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:C.white,fontSize:16}}>S</div>
              <div><div style={{color:C.white,fontWeight:800,fontSize:16,lineHeight:1}}>Squire</div><div style={{color:C.goldLight,fontSize:10,letterSpacing:1}}>DIGITAL BRAIN</div></div>
            </div>
            <div style={{display:"flex",gap:6}}>
              {["reports","machinery"].map(v=>(
                <button key={v} onClick={()=>setView(v)} style={{background:view===v?"rgba(255,255,255,0.15)":"none",border:"1px solid rgba(255,255,255,0.2)",borderRadius:6,color:C.white,fontSize:12,cursor:"pointer",padding:"4px 10px",fontWeight:500}}>
                  {v==="reports"?"📊 Reports":"🚜 Machinery"}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      {view!=="dashboard"&&(
        <div style={{background:C.soilLight,borderBottom:`1px solid ${C.border}`,padding:"8px 20px"}}>
          <div style={{maxWidth:820,margin:"0 auto",fontSize:13,color:C.muted}}>
            <span style={{cursor:"pointer",color:C.maroon}} onClick={()=>setView("dashboard")}>← Dashboard</span>
            {" › "}<span style={{color:C.charcoal}}>{breadcrumb[view]}</span>
          </div>
        </div>
      )}

      {/* Dashboard — full layout with sidebar */}
      {view==="dashboard"&&(
        <Dashboard farmers={farmers} onSelect={handleSelectFarmer} onNew={()=>setView("onboard")} onViewReports={()=>setView("reports")} onViewMachinery={()=>setView("machinery")}/>
      )}

      {/* Other views — constrained width */}
      {view!=="dashboard"&&(
        <div style={{maxWidth:820,margin:"0 auto",padding:"24px 16px"}}>
          {view==="onboard"&&(
            <><div style={{fontWeight:800,fontSize:20,color:C.charcoal,marginBottom:20}}>Onboard New Farmer</div><OnboardForm onSave={handleSaveFarmer} onCancel={()=>setView("dashboard")}/></>
          )}
          {view==="detail"&&liveSelected&&(
            <FarmerDetail farmer={liveSelected} onBack={()=>setView("dashboard")} onUpdateFarmer={handleUpdateFarmer} rentals={rentals} onAddRental={handleAddRental}/>
          )}
          {view==="reports"&&(
            <Reports farmers={farmers} rentals={rentals} onBack={()=>setView("dashboard")}/>
          )}
          {view==="machinery"&&(
            <MachineryHub rentals={rentals} onBack={()=>setView("dashboard")} onAddRental={handleAddRental} farmers={farmers}/>
          )}
        </div>
      )}
    </div>
  );
}