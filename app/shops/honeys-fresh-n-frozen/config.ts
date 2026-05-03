// Shop Configuration for Mango – Pure Vegetarian Restaurant
// All shop-specific data lives here

export type ContactPersonLabel = "Mango"

export interface ContactPerson {
  label: ContactPersonLabel
  phoneE164: string // Full number with country code: 919419532222
  phoneDisplay: string // Formatted for display: 94191 41495
  whatsappE164: string // Same as phoneE164 for WhatsApp
}

export const shopConfig = {
  // Basic Info (Hero / first card: Mango Bahu Plaza)
  name: "MANGO",
  tagline: "Pure Vegetarian • Budget Friendly • Bahu Plaza, Jammu",
  taglineShort: "Authentic Taste. Everyday Prices.",
  url: "https://mango.onelink.cards",
  cardType: "B2C" as const,
  keywordBadges: ["4.1 ★ Google Rating", "₹200–400 per person", "Pure Vegetarian", "Bahu Plaza Location"] as string[],

  // Contact Information (Mango Bahu Plaza)
  contact: {
    phones: ["9419532222"],
    email: "honeyfish.jmu@gmail.com",
    address: "Shop No 32, B2 South Block, Vidhata Nagar, Bahu Plaza, Gandhi Nagar, Jammu, 180004",
    locationLine: "Located inside Bahu Plaza, South Block at Vidhata Nagar. 7 minutes from central Gandhi Nagar area.",
    mapQuery: "Mango Bahu Plaza Vidhata Nagar Gandhi Nagar Jammu",
    storeHours: "Monday – Saturday: 10:30 AM – 9:30 PM. Sunday: 11:00 AM – 9:30 PM.",
    storeHoursStatus: "Open Now",
    officePhone: "9419532222",
  },
  
  // Contact (single Mango number)
  contactPersons: [
    {
      label: "Mango" as ContactPersonLabel,
      phoneE164: "919419532222",
      phoneDisplay: "94195 32222",
      whatsappE164: "919419532222",
    },
  ] as ContactPerson[],
  
  // WhatsApp Configuration
  whatsapp: {
    defaultPhone: "9419532222",
    defaultMessage: "Hi Mango, I would like to place an order. Please share today's availability and rates.",
    showSelector: false,
    selectorPersons: ["Mango"] as ContactPersonLabel[],
  },
  
  // Social Media Links
  social: {
    facebook: "https://www.facebook.com/share/198avg1doq/",
    instagram: "https://www.instagram.com/mangojammu/?hl=en",
    instagramJammu: "https://www.instagram.com/mangojammu/?hl=en",
    twitter: "",
    linkedin: "",
    swiggy: "https://www.swiggy.com/menu/105228?source=sharing",
    zomato: "https://zomato.onelink.me/xqzv/fag7tcfj",
  },

  instagramFeed: {
    title: "Latest on Instagram",
    subtitle: "Fresh drops, reels and cafe vibes from Mango",
    profileHandle: "@mangojammu",
    posts: [
      {
        id: "ig-1",
        image: "/gallery/unnamed.webp",
        caption: "Signature bites, fresh plating and peak Mango mood.",
        mediaType: "post" as const,
        pinned: true,
        href: "https://www.instagram.com/mangojammu/?hl=en",
      },
      {
        id: "ig-2",
        image: "/gallery/unnamed (1).webp",
        caption: "Cafe table moments worth sharing with the group.",
        mediaType: "reel" as const,
        pinned: true,
        href: "https://www.instagram.com/mangojammu/?hl=en",
      },
      {
        id: "ig-3",
        image: "/gallery/unnamed (2).webp",
        caption: "Fast comfort food with a cleaner, premium vibe.",
        mediaType: "post" as const,
        href: "https://www.instagram.com/mangojammu/?hl=en",
      },
      {
        id: "ig-4",
        image: "/gallery/unnamed (3).webp",
        caption: "Fresh vegetarian cravings, ready for the next order.",
        mediaType: "reel" as const,
        href: "https://www.instagram.com/mangojammu/?hl=en",
      },
      {
        id: "ig-5",
        image: "/gallery/unnamed (4).webp",
        caption: "Everyday budget-friendly food that still feels special.",
        mediaType: "post" as const,
        href: "https://www.instagram.com/mangojammu/?hl=en",
      },
      {
        id: "ig-6",
        image: "/gallery/unnamed (5).webp",
        caption: "Bring your friends, save the reel, plan the visit.",
        mediaType: "reel" as const,
        href: "https://www.instagram.com/mangojammu/?hl=en",
      },
    ],
  },
  
  // Trust Badges
  trustBadges: [
    "Pure Vegetarian",
    "4.1★ Google Rating",
    "Dine-In & Takeaway"
  ] as string[],
  
  // Brand Information (services for flip card)
  brands: [
    { name: "Pure Vegetarian Restaurant", tagline: "", logo: "" },
    { name: "Dine-In Available", tagline: "", logo: "" },
    { name: "Takeaway Available", tagline: "", logo: "" },
    { name: "Budget Friendly Dining", tagline: "", logo: "" },
    { name: "North Indian & Chinese Cuisine", tagline: "", logo: "" },
  ],

  // About Section (Welcome to Mango)
  about: {
    title: "Welcome to Mango",
    shortDescription: "Located in the heart of Bahu Plaza, Mango is a pure vegetarian restaurant serving authentic North Indian and Chinese flavours. We focus on clean preparation, quality ingredients, and a welcoming dining experience for families and friends.",
  },
  menuUrl: "/menu",

  /** Delivery area: distance from this pin (Mango @ Bahu Plaza). Update lat/lng from Google Maps if needed. */
  delivery: {
    restaurantLat: 32.7249,
    restaurantLng: 74.8568,
    radiusKm: 5,
    label: "Mango, Bahu Plaza, Jammu",
  },
  
  // Payment Configuration
  payment: {
    upiId: "9419197204.ibz@icici",
    upiName: "Mango Restaurant",
    // Leave empty to auto-generate QR directly from UPI ID
    upiQrImageUrl: "",
    scannerImage: "/shops/honeys-fresh-n-frozen/assets/qr/scan.png",
    bank: {
      bankName: "Jammu and Kashmir Bank",
      accountNumberMasked: "0045010100002437",
      ifsc: "JAKA0TARGET",
      accountHolder: "HONEY S FRESH N FROZEN PROP SHIVANI MAHAJAN",
      branchName: "CHANDNAGAR JAMMU"
    },
    // Payment page: include Pay via Scanner with download and save scanner image option
    showScanner: true,
    showDownloadQR: true,
  },
  
  // Google Reviews
  google: {
    placeId: "ChIJx172t6WFHjkRO5-dx4NQ9Jc",
    mapsUrl: "https://www.google.com/maps/place/?q=place_id:ChIJx172t6WFHjkRO5-dx4NQ9Jc",
    reviewsUrl: "https://search.google.com/local/writereview?placeid=ChIJx172t6WFHjkRO5-dx4NQ9Jc",
  },
  
  // SEO
  seo: {
    title: "MANGO - Pure Vegetarian Restaurant | Bahu Plaza Jammu",
    description: "Mango Bahu Plaza Jammu - Pure vegetarian restaurant. North Indian & Chinese cuisine, budget friendly dining, dine-in & takeaway. Authentic taste, everyday prices.",
    keywords: "Mango Bahu Plaza Jammu, Vegetarian Restaurant in Bahu Plaza, North Indian Restaurant Jammu, Chinese Food Bahu Plaza, Budget Friendly Restaurant Jammu",
  },
  
  // Credits
  credits: {
    designer: "RepixelX Studio",
    designerUrl: "https://repixelx.com",
  },
  
  // Section Toggles (for enabling/disabling sections)
  sections: {
    showAbout: true,
    showMenu: true,
    showServices: true,
    showGallery: true,
    showInstagramFeed: true,
    showReviews: true,
    showSocialConnect: true,
    showContactCard: true,
    showFooter: true,
  },
  
  // Assets Paths (relative to public folder)
  // Logo: put your logo at public/components/fff.png (copy from components/fff.png when you update it)
  assets: {
    logo: "/components/fff.png",
    gallery: "/shops/honeys-fresh-n-frozen/assets/gallery/",
    qr: "/shops/honeys-fresh-n-frozen/assets/qr/scan.png",
  },
  
  // Catalog (empty for now, can be populated later)
  catalog: [] as Array<{ id: string; title: string; description: string; logo: string; details: string; images: string[] }>,
  
  // Brochures (empty for now)
  brochures: [] as Array<{ href: string; title: string }>,
  
  // Menu data is in menu.ts file in same folder
  // Import: import { menuCategories } from './menu'
}

export type ShopConfig = typeof shopConfig
