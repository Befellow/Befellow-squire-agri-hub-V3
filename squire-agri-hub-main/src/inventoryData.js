// Squire Integrated Agricultural Input Database & Sales History
// Consolidates 148+ crops as seeds and all standard inputs (fertilizers, crop protection, tools)

export const CROP_OPTIONS = {
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

// Compile 148 seed items from CROP_OPTIONS
const SEASON_CROPS_MAP_LOCAL = {
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

function getMandiClassification(cropName) {
  // 1. Try exact match
  for (const [season, categories] of Object.entries(SEASON_CROPS_MAP_LOCAL)) {
    for (const [category, crops] of Object.entries(categories)) {
      if (crops.includes(cropName)) {
        return { season, category };
      }
    }
  }

  // 2. Try substring match (case-insensitive)
  const lowerName = cropName.toLowerCase();
  for (const [season, categories] of Object.entries(SEASON_CROPS_MAP_LOCAL)) {
    for (const [category, crops] of Object.entries(categories)) {
      for (const crop of crops) {
        const lowerCrop = crop.toLowerCase();
        if (lowerName.includes(lowerCrop) || lowerCrop.includes(lowerName)) {
          return { season, category };
        }
      }
    }
  }

  // 3. Fallbacks based on common keywords
  if (lowerName.includes("flower") || lowerName.includes("rose") || lowerName.includes("marigold") || lowerName.includes("jasmine") || lowerName.includes("zinnia") || lowerName.includes("petunia") || lowerName.includes("dahlia") || lowerName.includes("gerbera") || lowerName.includes("lily") || lowerName.includes("lilium") || lowerName.includes("gladiolus") || lowerName.includes("carnation") || lowerName.includes("tuberose")) {
    return { season: "Rabi", category: "Floriculture" };
  }
  if (lowerName.includes("grass") || lowerName.includes("tulsi") || lowerName.includes("mint") || lowerName.includes("moringa") || lowerName.includes("aloe") || lowerName.includes("ashwagandha") || lowerName.includes("stevia")) {
    return { season: "Kharif", category: "Medicinal & Aromatic" };
  }
  if (lowerName.includes("bean") || lowerName.includes("gourd") || lowerName.includes("melon") || lowerName.includes("potato") || lowerName.includes("tomato") || lowerName.includes("chilli") || lowerName.includes("brinjal") || lowerName.includes("cabbage") || lowerName.includes("cauliflower") || lowerName.includes("okra") || lowerName.includes("spinach")) {
    return { season: "Kharif", category: "Vegetables" };
  }
  if (lowerName.includes("gram") || lowerName.includes("pea") || lowerName.includes("lentil") || lowerName.includes("arhar") || lowerName.includes("chickpea")) {
    return { season: "Kharif", category: "Pulses" };
  }
  if (lowerName.includes("mustard") || lowerName.includes("groundnut") || lowerName.includes("soybean") || lowerName.includes("sunflower") || lowerName.includes("sesame") || lowerName.includes("castor") || lowerName.includes("linseed")) {
    return { season: "Kharif", category: "Oilseeds" };
  }
  if (lowerName.includes("ginger") || lowerName.includes("turmeric") || lowerName.includes("garlic") || lowerName.includes("coriander") || lowerName.includes("cumin") || lowerName.includes("fennel")) {
    return { season: "Rabi", category: "Spices" };
  }
  
  // Final default
  return { season: "Kharif", category: "Cereals" };
}

const seedProducts = [];
let seedIdCounter = 1;

Object.entries(CROP_OPTIONS).forEach(([subCategory, crops]) => {
  crops.forEach((crop) => {
    // Generate realistic seed varieties or names
    let suffix = "Hybrid Seed";
    let unit = "kg";
    let pricePerUnit = 240;
    let max = 150;
    
    if (subCategory.includes("Cash Engines") || subCategory.includes("Medicinal")) {
      suffix = "Tissue Culture Plantlets" ;
      unit = "Units";
      pricePerUnit = 15;
      max = 500;
      
      if (crop.includes("Mushroom")) {
        suffix = "Spawn Bag";
        unit = "Bags";
        pricePerUnit = 180;
        max = 100;
      } else if (crop.includes("Potato") || crop.includes("Sugarcane")) {
        suffix = "Certified Seed Tubers/Sets";
        unit = "Qtl";
        pricePerUnit = 1250;
        max = 50;
      }
    } else if (subCategory.includes("Core Grains")) {
      suffix = "HYV Certified Seed";
      unit = "Qtl";
      pricePerUnit = 2200;
      max = 60;
      
      if (crop === "Paddy") {
        suffix = "Pusa Basmati Seed";
        pricePerUnit = 3200;
      } else if (crop === "Wheat") {
        suffix = "Wheat HD-3086 Seed";
        pricePerUnit = 2450;
      } else if (crop === "Mustard") {
        suffix = "Mustard Pusa Bold Seed";
        pricePerUnit = 5800;
        unit = "Qtl";
      }
    } else if (subCategory.includes("Restorative")) {
      suffix = "N-Fixing Certified Seed";
      unit = "kg";
      pricePerUnit = 160;
      max = 120;
      
      if (crop === "Chickpea") {
        suffix = "Gram Pusa-256 Seed";
        unit = "Qtl";
        pricePerUnit = 5050;
      } else if (crop === "Moong") {
        suffix = "Moong Pusa Vishal Seed";
        unit = "Qtl";
        pricePerUnit = 7200;
      } else if (crop === "Bajra") {
        suffix = "Bajra HHB-67 Seed";
        unit = "Qtl";
        pricePerUnit = 1800;
      }
    } else if (subCategory.includes("Aromatic") || crop.includes("Rose") || crop.includes("Jasmine")) {
      suffix = "High-Yield Rooted Saplings";
      unit = "Units";
      pricePerUnit = 12;
      max = 800;
    }

    // Deterministic random stock levels based on charCodes of crop name to look organic
    const seedCode = crop.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const stock = Math.round((seedCode % (max - 10)) + 10);
    const threshold = Math.round(max * 0.25);
    const status = stock <= threshold / 2 ? "critical" : stock <= threshold ? "low" : "healthy";

    const classification = getMandiClassification(crop);

    seedProducts.push({
      id: `S${seedIdCounter++}`,
      name: `${crop} (${suffix})`,
      cropName: crop,
      category: "Seed",
      subCategory: subCategory,
      mandiSeason: classification.season,
      mandiCategory: classification.category,
      stock: stock,
      max: max,
      threshold: threshold,
      unit: unit,
      pricePerUnit: pricePerUnit,
      status: status
    });
  });
});

// Rich Fertilizers Database
const fertilizerProducts = [
  { id: "F1", name: "IFFCO Urea (N 46%)", category: "Fertilizer", subCategory: "Chemical Fertilizer", stock: 180, threshold: 40, max: 250, unit: "Bags", pricePerUnit: 266, status: "healthy" },
  { id: "F2", name: "IFFCO DAP (18:46:0)", category: "Fertilizer", subCategory: "Chemical Fertilizer", stock: 85, threshold: 30, max: 150, unit: "Bags", pricePerUnit: 1350, status: "healthy" },
  { id: "F3", name: "KRIBHCO MOP (Muriate of Potash)", category: "Fertilizer", subCategory: "Chemical Fertilizer", stock: 45, threshold: 20, max: 100, unit: "Bags", pricePerUnit: 1700, status: "healthy" },
  { id: "F4", name: "Single Super Phosphate (SSP)", category: "Fertilizer", subCategory: "Chemical Fertilizer", stock: 120, threshold: 30, max: 200, unit: "Bags", pricePerUnit: 480, status: "healthy" },
  { id: "F5", name: "NPK 12:32:16 Complex", category: "Fertilizer", subCategory: "Chemical Fertilizer", stock: 12, threshold: 25, max: 120, unit: "Bags", pricePerUnit: 1470, status: "critical" },
  { id: "F6", name: "Ammonium Sulphate", category: "Fertilizer", subCategory: "Chemical Fertilizer", stock: 35, threshold: 15, max: 80, unit: "Bags", pricePerUnit: 950, status: "healthy" },
  { id: "F7", name: "Premium Vermicompost (Organic)", category: "Fertilizer", subCategory: "Organic Fertilizer", stock: 160, threshold: 50, max: 300, unit: "Bags", pricePerUnit: 350, status: "healthy" },
  { id: "F8", name: "Neem Cake Organic Manure", category: "Fertilizer", subCategory: "Organic Fertilizer", stock: 8, threshold: 20, max: 80, unit: "Bags", pricePerUnit: 650, status: "critical" },
  { id: "F9", name: "Castor Cake Organic Fertilizer", category: "Fertilizer", subCategory: "Organic Fertilizer", stock: 24, threshold: 15, max: 60, unit: "Bags", pricePerUnit: 520, status: "healthy" },
  { id: "F10", name: "Liquid Seaweed Extract Bio-stimulant", category: "Fertilizer", subCategory: "Organic Fertilizer", stock: 40, threshold: 15, max: 100, unit: "Litre", pricePerUnit: 380, status: "healthy" },
  { id: "F11", name: "Zinc Sulphate Heptahydrate", category: "Fertilizer", subCategory: "Micronutrient", stock: 28, threshold: 10, max: 50, unit: "kg", pricePerUnit: 85, status: "healthy" },
  { id: "F12", name: "Boron 20% Disodium Octaborate", category: "Fertilizer", subCategory: "Micronutrient", stock: 14, threshold: 10, max: 40, unit: "kg", pricePerUnit: 280, status: "low" }
];

// Rich Bio-Inputs Database
const bioInputsProducts = [
  { id: "B1", name: "Bio-NPK Liquid Consortia", category: "Bio-Inputs", subCategory: "Bio-Fertilizer", stock: 45, threshold: 20, max: 100, unit: "Litre", pricePerUnit: 280, status: "healthy" },
  { id: "B2", name: "Rhizobium Culture Carrier-based", category: "Bio-Inputs", subCategory: "Bio-Fertilizer", stock: 30, threshold: 15, max: 80, unit: "Pack", pricePerUnit: 50, status: "healthy" },
  { id: "B3", name: "Azotobacter Soil Inoculant", category: "Bio-Inputs", subCategory: "Bio-Fertilizer", stock: 22, threshold: 10, max: 60, unit: "Pack", pricePerUnit: 55, status: "healthy" },
  { id: "B4", name: "Phosphate Solubilizing Bacteria (PSB)", category: "Bio-Inputs", subCategory: "Bio-Fertilizer", stock: 12, threshold: 15, max: 65, unit: "Pack", pricePerUnit: 60, status: "low" },
  { id: "B5", name: "Mycorrhizal Biofertilizer (VAM)", category: "Bio-Inputs", subCategory: "Bio-Fertilizer", stock: 18, threshold: 15, max: 50, unit: "kg", pricePerUnit: 120, status: "healthy" },
  { id: "B6", name: "Trichoderma Viride Bio-fungicide", category: "Bio-Inputs", subCategory: "Bio-Control", stock: 55, threshold: 20, max: 100, unit: "kg", pricePerUnit: 140, status: "healthy" },
  { id: "B7", name: "Pseudomonas Fluorescens Bio-bactericide", category: "Bio-Inputs", subCategory: "Bio-Control", stock: 26, threshold: 15, max: 70, unit: "kg", pricePerUnit: 150, status: "healthy" },
  { id: "B8", name: "Beauveria Bassiana Bio-insecticide", category: "Bio-Inputs", subCategory: "Bio-Control", stock: 9, threshold: 12, max: 50, unit: "kg", pricePerUnit: 175, status: "critical" }
];

// Rich Crop Protection (Pest & Disease Management) Database
const cropProtectionProducts = [
  { id: "P1", name: "Cold-Pressed Pure Neem Oil (10000 ppm)", category: "Crop Protection", subCategory: "Bio-Pesticide", stock: 34, threshold: 15, max: 80, unit: "Litre", pricePerUnit: 420, status: "healthy" },
  { id: "P2", name: "Saaf Fungicide (Carbendazim 12% + Mancozeb 63%)", category: "Crop Protection", subCategory: "Chemical Fungicide", stock: 68, threshold: 20, max: 120, unit: "kg", pricePerUnit: 680, status: "healthy" },
  { id: "P3", name: "Tata Mida (Imidacloprid 17.8% SL)", category: "Crop Protection", subCategory: "Chemical Insecticide", stock: 12, threshold: 15, max: 50, unit: "Litre", pricePerUnit: 950, status: "critical" },
  { id: "P4", name: "Spinosad 45% SC Naturalyte", category: "Crop Protection", subCategory: "Bio-Insecticide", stock: 15, threshold: 8, max: 30, unit: "Litre", pricePerUnit: 3400, status: "healthy" },
  { id: "P5", name: "Yellow Sticky Insect Traps", category: "Crop Protection", subCategory: "Physical Control", stock: 120, threshold: 50, max: 300, unit: "Units", pricePerUnit: 12, status: "healthy" },
  { id: "P6", name: "Pheromone Melon Fly Traps + Lures", category: "Crop Protection", subCategory: "Physical Control", stock: 45, threshold: 20, max: 100, unit: "Units", pricePerUnit: 85, status: "healthy" },
  { id: "P7", name: "Blitox Copper Oxychloride Fungicide", category: "Crop Protection", subCategory: "Chemical Fungicide", stock: 32, threshold: 10, max: 50, unit: "kg", pricePerUnit: 380, status: "healthy" },
  { id: "P8", name: "Glyphosate 41% SL Weedicide", category: "Crop Protection", subCategory: "Chemical Herbicide", stock: 3, threshold: 15, max: 60, unit: "Litre", pricePerUnit: 460, status: "critical" },
  { id: "P9", name: "Pendimethalin 30% EC Pre-emergence", category: "Crop Protection", subCategory: "Chemical Herbicide", stock: 24, threshold: 10, max: 50, unit: "Litre", pricePerUnit: 390, status: "healthy" },
  { id: "P10", name: "Bavistin Systemic Fungicide", category: "Crop Protection", subCategory: "Chemical Fungicide", stock: 18, threshold: 12, max: 40, unit: "kg", pricePerUnit: 740, status: "healthy" }
];

// Rich Farm Tools & Accessories Database
const farmToolsProducts = [
  { id: "T1", name: "Manual Knapsack Sprayer (16L)", category: "Farm Tools", subCategory: "Sprayers", stock: 15, threshold: 5, max: 25, unit: "Units", pricePerUnit: 1100, status: "healthy" },
  { id: "T2", name: "2-in-1 Battery Operated Knapsack Sprayer (16L)", category: "Farm Tools", subCategory: "Sprayers", stock: 8, threshold: 4, max: 15, unit: "Units", pricePerUnit: 2350, status: "healthy" },
  { id: "T3", name: "Heavy Duty Tarpaulin Sheet (24x18 ft)", category: "Farm Tools", subCategory: "Post-Harvest Gear", stock: 30, threshold: 10, max: 50, unit: "Units", pricePerUnit: 1650, status: "healthy" },
  { id: "T4", name: "Digital Soil NPK & pH Testing Kit", category: "Farm Tools", subCategory: "Sensor Tools", stock: 12, threshold: 5, max: 20, unit: "Units", pricePerUnit: 850, status: "healthy" },
  { id: "T5", name: "Drip Irrigation 16mm Lateral Pipes (Roll)", category: "Farm Tools", subCategory: "Irrigation Gear", stock: 18, threshold: 5, max: 30, unit: "Units", pricePerUnit: 1450, status: "healthy" },
  { id: "T6", name: "Silver-Black Mulching Sheet (25 Micron)", category: "Farm Tools", subCategory: "Soil Covers", stock: 35, threshold: 10, max: 60, unit: "Units", pricePerUnit: 1800, status: "healthy" },
  { id: "T7", name: "98-Cavity Plastic Seedling Trays", category: "Farm Tools", subCategory: "Nurseries", stock: 250, threshold: 50, max: 500, unit: "Units", pricePerUnit: 18, status: "healthy" },
  { id: "T8", name: "Ergonomic bypass pruning shears", category: "Farm Tools", subCategory: "Garden Tools", stock: 2, threshold: 6, max: 20, unit: "Units", pricePerUnit: 320, status: "critical" }
];

// Combine all items into one single array containing 148+ crops (as seeds) and all other categories
export const ALL_INVENTORY_ITEMS = [
  ...seedProducts,
  ...fertilizerProducts,
  ...bioInputsProducts,
  ...cropProtectionProducts,
  ...farmToolsProducts
];

// Helper: Get item count stats
export const INVENTORY_STATS = {
  totalSeeds: seedProducts.length,
  totalFertilizers: fertilizerProducts.length,
  totalBioInputs: bioInputsProducts.length,
  totalCropProtection: cropProtectionProducts.length,
  totalFarmTools: farmToolsProducts.length,
  totalAllItems: ALL_INVENTORY_ITEMS.length
};

// --- MOCK REVENUE HISTORY FOR THE SALES & GROWTH PAGE ---
// 30 days of daily sales records for professional chart visualization
export const generateDailySalesHistory = () => {
  const dates = [];
  const seedSales = [];
  const fertilizerSales = [];
  const protectionSales = [];
  const otherSales = [];
  const totalSales = [];
  
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toLocaleDateString([], { month: "short", day: "numeric" });
    dates.push(dateStr);
    
    // Create realistic cyclic sales with some weekend dips
    const dayOfWeek = d.getDay(); // 0 = Sun, 6 = Sat
    const multiplier = dayOfWeek === 0 ? 0.35 : dayOfWeek === 6 ? 0.75 : 1.0;
    
    const seedVal = Math.round((4500 + Math.sin(i * 0.5) * 1800 + Math.random() * 800) * multiplier);
    const fertVal = Math.round((6000 + Math.cos(i * 0.6) * 2200 + Math.random() * 1000) * multiplier);
    const protVal = Math.round((2500 + Math.sin(i * 0.8) * 1200 + Math.random() * 500) * multiplier);
    const otherVal = Math.round((1800 + Math.cos(i * 0.3) * 800 + Math.random() * 400) * multiplier);
    
    seedSales.push(seedVal);
    fertilizerSales.push(fertVal);
    protectionSales.push(protVal);
    otherSales.push(otherVal);
    
    totalSales.push(seedVal + fertVal + protVal + otherVal);
  }
  
  const transactionsList = [
    { id: "TXN-9021", date: "2026-07-19", farmerName: "Ramesh Yadav", itemName: "Wheat (Wheat HD-3086 Seed)", category: "Seed", quantity: 4, unit: "Qtl", amount: 9800, paymentMode: "Direct Cash Settlement", status: "Completed" },
    { id: "TXN-9020", date: "2026-07-19", farmerName: "Sita Devi", itemName: "IFFCO DAP (18:46:0)", category: "Fertilizer", quantity: 6, unit: "Bags", amount: 8100, paymentMode: "UPI / Online Transfer", status: "Completed" },
    { id: "TXN-9019", date: "2026-07-18", farmerName: "Mohan Patel", itemName: "Cold-Pressed Pure Neem Oil (10000 ppm)", category: "Crop Protection", quantity: 2, unit: "Litre", amount: 840, paymentMode: "KCC Credit Limit", status: "Completed" },
    { id: "TXN-9018", date: "2026-07-18", farmerName: "Ramesh Yadav", itemName: "Manual Knapsack Sprayer (16L)", category: "Farm Tools", quantity: 1, unit: "Units", amount: 1100, paymentMode: "Direct Cash Settlement", status: "Completed" },
    { id: "TXN-9017", date: "2026-07-17", farmerName: "Sita Devi", itemName: "Bio-NPK Liquid Consortia", category: "Bio-Inputs", quantity: 5, unit: "Litre", amount: 1400, paymentMode: "Cooperative Wallet Subsidy", status: "Completed" },
    { id: "TXN-9016", date: "2026-07-17", farmerName: "Mohan Patel", itemName: "Paddy (Pusa Basmati Seed)", category: "Seed", quantity: 8, unit: "Qtl", amount: 25600, paymentMode: "KCC Credit Limit", status: "Completed" },
    { id: "TXN-9015", date: "2026-07-16", farmerName: "Ramesh Yadav", itemName: "IFFCO Urea (N 46%)", category: "Fertilizer", quantity: 10, unit: "Bags", amount: 2660, paymentMode: "Direct Cash Settlement", status: "Completed" },
    { id: "TXN-9014", date: "2026-07-15", farmerName: "Sita Devi", itemName: "Tomato (Hybrid Seed)", category: "Seed", quantity: 2, unit: "kg", amount: 480, paymentMode: "UPI / Online Transfer", status: "Completed" },
    { id: "TXN-9013", date: "2026-07-14", farmerName: "Mohan Patel", itemName: "Heavy Duty Tarpaulin Sheet (24x18 ft)", category: "Farm Tools", quantity: 2, unit: "Units", amount: 3300, paymentMode: "Direct Cash Settlement", status: "Completed" },
    { id: "TXN-9012", date: "2026-07-14", farmerName: "Ramesh Yadav", itemName: "Trichoderma Viride Bio-fungicide", category: "Bio-Inputs", quantity: 3, unit: "kg", amount: 420, paymentMode: "Cooperative Wallet Subsidy", status: "Completed" }
  ];

  return {
    dates,
    seedSales,
    fertilizerSales,
    protectionSales,
    otherSales,
    totalSales,
    transactionsList
  };
};

export const MOCK_DAILY_SALES = generateDailySalesHistory();
