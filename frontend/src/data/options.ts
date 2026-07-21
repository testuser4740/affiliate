// Reference/option arrays for UI dropdowns — NOT entity mock data.

export const states = ["All States", "Delhi", "Maharashtra", "Tamil Nadu", "Karnataka", "Telangana", "West Bengal", "Rajasthan", "Uttar Pradesh", "Gujarat"];
export const cities = ["All Cities", "Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Pune", "Vellore", "Pilani", "Trichy"];

export const colleges = [
  "Delhi University", "IIT Bombay", "IIT Delhi", "IIT Madras", "IIT Hyderabad",
  "VIT Vellore", "BITS Pilani", "NIT Trichy", "St. Xavier's College", "Jadavpur University",
  "Pune University", "Anna University", "IIM Bangalore", "DTU Delhi", "SRM University",
];

export const tiers = [
  {
    name: "Bronze",
    min: 0,
    max: 50000,
    color: "#B5651D",
    bg: "bg-[#FBE3C8]",
    ring: "ring-[#B5651D]",
    icon: "🥉",
    commission: "8%",
    perks: [
      "8% commission on all orders",
      "Access to ambassador community",
      "Monthly newsletter & tips",
      "Welcome digital kit",
    ],
  },
  {
    name: "Silver",
    min: 50000,
    max: 150000,
    color: "#7B8794",
    bg: "bg-[#E5E8EB]",
    ring: "ring-[#7B8794]",
    icon: "🥈",
    commission: "10%",
    perks: [
      "10% commission on all orders",
      "Monthly performance bonus eligibility",
      "Exclusive task pool access",
      "Quarterly swag drops",
    ],
  },
  {
    name: "Gold",
    min: 150000,
    max: 400000,
    color: "#D69E2E",
    bg: "bg-[#FFF1C2]",
    ring: "ring-[#D69E2E]",
    icon: "🥇",
    commission: "12%",
    perks: [
      "12% commission on all orders",
      "Priority bi-weekly payouts",
      "Premium swag box (₹2K value)",
      "Early access to new products",
      "Featured on Gajab Insta Spotlight",
    ],
  },
  {
    name: "Platinum",
    min: 400000,
    max: 999999999,
    color: "#5B21B6",
    bg: "bg-[#E9D5FF]",
    ring: "ring-[#5B21B6]",
    icon: "💎",
    commission: "15%",
    perks: [
      "15% commission on all orders",
      "Weekly payouts (no minimum)",
      "Dedicated ambassador manager",
      "Quarterly cash bonuses (up to ₹25K)",
      "All-expenses-paid Gajab HQ trip",
      "Co-branding opportunities",
    ],
  },
];
