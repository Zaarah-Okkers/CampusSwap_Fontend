// src/services/mockData.js
//
// Front-end-only dummy data, used when the backend is not running.
// Toggle it from src/services/api.js via `USE_MOCK`.
//
// ONE source of truth for listings. `listings` below is canonical and uses
// camelCase, because that is the shape ProductCard / MarketplaceView read.
// HomeView expects snake_case instead, so `featuredProducts` is DERIVED from
// the same list by toHomeShape() rather than being a second hand-kept list —
// otherwise the two screens drift apart and show different items.

const IMG = (text, bg = "6C5CE7", fg = "FFFFFF") =>
  `https://placehold.co/600x400/${bg}/${fg}?text=${encodeURIComponent(text)}`;

// ------------------------------------------------------------
// LISTINGS — the single master list, camelCase
// ------------------------------------------------------------
// conditionClass drives the badge colour on ProductCard:
// 'fair' = amber badge, anything else (undefined) = mint green badge.
export const listings = [
  {
    id: 1,
    name: "Organic Chemistry Lecture Notes",
    price: 65,
    rating: 4.8,
    condition: "Like New",
    listingType: "sell",
    sellerName: "Aisha K.",
    sellerRating: 4.8,
    university: "University of Cape Town",
    category: "sell",
    image: IMG("Chemistry Notes"),
  },
  {
    id: 2,
    name: "Scientific Calculator",
    price: 240,
    rating: 4.6,
    condition: "Used: Like New",
    listingType: "sell",
    sellerName: "Sipho D.",
    sellerRating: 4.6,
    university: "University of Cape Town",
    category: "sell",
    image: IMG("Calculator", "E8B54D"),
  },
  {
    id: 3,
    name: "Calculus Textbook",
    price: 40,
    rating: 4.9,
    condition: "Fair Condition",
    conditionClass: "fair",
    listingType: "rent",
    rentPeriod: "week",
    sellerName: "Naledi S.",
    sellerRating: 4.9,
    university: "University of Cape Town",
    category: "rent",
    image: IMG("Calculus", "4ADE80", "0A0E27"),
  },
  {
    id: 4,
    name: "LED Study Desk Lamp",
    price: 180,
    rating: 4.7,
    condition: "Like New",
    listingType: "sell",
    sellerName: "Thabo M.",
    sellerRating: 4.7,
    university: "Stellenbosch University",
    category: "sell",
    image: IMG("Study Lamp", "6FA8FF", "0A0E27"),
  },
  {
    id: 5,
    name: "Mini Fridge for Residence",
    price: 125,
    rating: 4.5,
    condition: "Good",
    listingType: "rent",
    rentPeriod: "month",
    sellerName: "Lerato M.",
    sellerRating: 4.5,
    university: "University of the Western Cape",
    category: "furniture",
    image: IMG("Mini Fridge", "FF8577"),
  },
  {
    id: 6,
    name: "Noise-cancelling Headphones",
    price: 450,
    rating: 4.9,
    condition: "Like New",
    listingType: "sell",
    sellerName: "Karabo N.",
    sellerRating: 4.9,
    university: "University of Pretoria",
    category: "sell",
    image: IMG("Headphones", "9B59B6"),
  },
  {
    id: 7,
    name: "Dorm Storage Crates",
    price: 80,
    rating: 4.4,
    condition: "Good",
    listingType: "swap",
    swapFor: "A desk lamp or stationery",
    sellerName: "Mia D.",
    sellerRating: 4.4,
    university: "University of Johannesburg",
    category: "furniture",
    image: IMG("Storage Crates", "2E7D5A"),
  },
  {
    id: 8,
    name: "Engineering Drawing Set",
    price: 95,
    rating: 4.8,
    condition: "Good",
    listingType: "sell",
    sellerName: "Sibusiso K.",
    sellerRating: 4.8,
    university: "Cape Peninsula University of Technology",
    category: "sell",
    image: IMG("Drawing Set", "EF8354"),
  },
  {
    id: 9,
    name: "Graphic Design Textbook",
    price: 55,
    rating: 4.6,
    condition: "Fair Condition",
    conditionClass: "fair",
    listingType: "swap",
    swapFor: "Any photography textbook",
    sellerName: "Zanele P.",
    sellerRating: 4.6,
    university: "University of the Witwatersrand",
    category: "swap",
    image: IMG("Design Book", "3D5A80"),
  },
  {
    id: 10,
    name: "Portable Clothes Rail",
    price: 110,
    rating: 4.3,
    condition: "Good",
    listingType: "rent",
    rentPeriod: "semester",
    sellerName: "Amahle R.",
    sellerRating: 4.3,
    university: "University of KwaZulu-Natal",
    category: "furniture",
    image: IMG("Clothes Rail", "7B2CBF"),
  },
  {
    id: 11,
    name: "Compact Study Desk",
    price: 350,
    rating: 4.8,
    condition: "Like New",
    listingType: "sell",
    sellerName: "Nandi M.",
    sellerRating: 4.8,
    university: "University of Cape Town",
    category: "furniture",
    image: IMG("Study Desk", "8B5E3C"),
  },
  {
    id: 12,
    name: "Dorm Room Wall Prints Set",
    price: 75,
    rating: 4.7,
    condition: "New",
    listingType: "sell",
    sellerName: "Jade L.",
    sellerRating: 4.7,
    university: "Rhodes University",
    category: "furniture",
    image: IMG("Wall Prints", "D26A8D"),
  },
  {
    id: 13,
    name: "Bedside Storage Unit",
    price: 140,
    rating: 4.5,
    condition: "Good",
    listingType: "swap",
    swapFor: "A study chair",
    sellerName: "Neo T.",
    sellerRating: 4.5,
    university: "University of Pretoria",
    category: "furniture",
    image: IMG("Bedside Unit", "4F772D"),
  },
];

// Marketplace grid reads this directly.
export const marketplaceListings = listings;

/**
 * Map one canonical listing to the snake_case shape HomeView renders.
 * HomeView reads listing_type / rent_period / condition_label, so translating
 * here keeps a single list authoritative for both screens.
 */
function toHomeShape(item) {
  return {
    id: item.id,
    name: item.name,
    price: item.price,
    image: item.image,
    listing_type: item.listingType,
    rent_period: item.rentPeriod,
    condition_label: item.condition,
    seller_name: item.sellerName,
    university: item.university,
  };
}

// The homepage highlights the first 8 listings from the same master list.
export const featuredProducts = listings.slice(0, 8).map(toHomeShape);

export const categories = [
  { id: "all", label: "All" },
  { id: "sell", label: "For Sale" },
  { id: "rent", label: "For Rent" },
  { id: "swap", label: "Swap" },
  { id: "furniture", label: "Residence" },
];

export const universities = [
  "University of Cape Town (UCT)",
  "University of the Witwatersrand (Wits)",
  "Stellenbosch University",
  "University of Pretoria",
  "University of Johannesburg",
  "University of KwaZulu-Natal",
  "Rhodes University",
];

// ------------------------------------------------------------
// STUDENT DASHBOARD
// ------------------------------------------------------------
export const studentDashboard = {
  mylistings: [
    {
      id: 201,
      name: "Introduction to Law Textbook",
      price: 310,
      listing_type: "sell",
      condition_label: "Like New",
      status: "Active",
      image: IMG("Law Textbook", "3D5A80"),
    },
    {
      id: 202,
      name: "Desk Fan",
      price: 90,
      listing_type: "rent",
      rent_period: "month",
      condition_label: "Good",
      status: "Active",
      image: IMG("Desk Fan", "4F772D"),
    },
    {
      id: 203,
      name: "Statistics Study Guide",
      price: 45,
      listing_type: "sell",
      condition_label: "Fair Condition",
      status: "Sold",
      image: IMG("Stats Guide", "D26A8D"),
    },
  ],
  myOrders: [
    {
      id: "ORD-1001",
      item_name: "Scientific Calculator",
      total: 240,
      status: "Escrow held",
      created_at: "2026-02-14T09:24:00.000Z",
    },
    {
      id: "ORD-1002",
      item_name: "Calculus Textbook",
      total: 40,
      status: "Released",
      created_at: "2026-02-09T16:02:00.000Z",
    },
  ],
};

// ------------------------------------------------------------
// RESIDENCE MANAGER DASHBOARD
// ------------------------------------------------------------
export const resManagerDashboard = {
  maintenanceRequests: [
    {
      id: "MR-301",
      student_name: "Thabo M.",
      room: "Smuts Hall 214",
      issue: "Leaking shower head",
      priority: "High",
      status: "Open",
      logged_at: "2026-02-16T07:10:00.000Z",
    },
    {
      id: "MR-302",
      student_name: "Aisha K.",
      room: "Smuts Hall 108",
      issue: "Broken window latch",
      priority: "Medium",
      status: "In progress",
      logged_at: "2026-02-15T13:45:00.000Z",
    },
    {
      id: "MR-303",
      student_name: "Sipho D.",
      room: "Smuts Hall 302",
      issue: "Faulty plug point",
      priority: "High",
      status: "Open",
      logged_at: "2026-02-15T08:30:00.000Z",
    },
    {
      id: "MR-304",
      student_name: "Naledi S.",
      room: "Smuts Hall 121",
      issue: "Cupboard door came off",
      priority: "Low",
      status: "Resolved",
      logged_at: "2026-02-11T11:05:00.000Z",
    },
  ],
};

// ------------------------------------------------------------
// ADMIN DASHBOARD
// ------------------------------------------------------------
export const adminDashboard = {
  stats: {
    totalUsers: 9,
    premiumUsers: 3,
    activeListings: listings.length,
    openReports: 2,
  },
  recentListings: listings.slice(0, 5),
  reports: [
    {
      id: "RP-1",
      reporter: "Thabo M.",
      reported: "Unknown Seller",
      reason: "Item not as described",
      status: "Open",
    },
    {
      id: "RP-2",
      reporter: "Aisha K.",
      reported: "Sipho D.",
      reason: "No response after payment",
      status: "Open",
    },
  ],
};

// ------------------------------------------------------------
// PROVIDER DASHBOARD
// ------------------------------------------------------------
export const providerDashboard = {
  activeJobs: [
    {
      id: "JOB-401",
      title: "Residence room deep clean",
      student_name: "Naledi S.",
      location: "Smuts Hall",
      budget: 350,
      status: "In progress",
    },
    {
      id: "JOB-402",
      title: "Fix desk drawer",
      student_name: "Liam P.",
      location: "Rondebosch",
      budget: 180,
      status: "Scheduled",
    },
  ],
  availableJobs: [
    {
      id: "JOB-403",
      title: "Assemble flat-pack bookshelf",
      student_name: "Karabo N.",
      location: "Observatory",
      budget: 220,
    },
    {
      id: "JOB-404",
      title: "Geyser repair",
      student_name: "Zanele P.",
      location: "Mowbray",
      budget: 600,
    },
    {
      id: "JOB-405",
      title: "Weekly room cleaning",
      student_name: "Neo T.",
      location: "Smuts Hall",
      budget: 300,
    },
  ],
};

// ------------------------------------------------------------
// AUTH — accept any credentials so you can get in without the API
// ------------------------------------------------------------
const ROLE_NAMES = {
  student: "Zaarah K.",
  service_provider: "ServicePro SA",
  admin: "Admin User",
  res_manager: "Residence Manager",
};

export function mockUser(email, role) {
  const backendRole = role || "student";
  const displayRole =
    backendRole === "service_provider" ? "provider" : backendRole;
  return {
    id: 1,
    name: ROLE_NAMES[backendRole] || "Zaarah K.",
    full_name: ROLE_NAMES[backendRole] || "Zaarah K.",
    email: email || "zaarah@campus.co.za",
    role: backendRole,
    displayRole,
    avatar: "https://placehold.co/100x100/6C5CE7/FFFFFF?text=CS",
    university: "University of Cape Town (UCT)",
    verified: true,
    online: true,
    isPremium: false,
  };
}