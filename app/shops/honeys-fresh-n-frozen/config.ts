// Shop Configuration for The Sonnet Cafe
// All shop-specific data lives here

export type ContactPersonLabel = "The Sonnet Cafe"

export interface ContactPerson {
  label: ContactPersonLabel
  phoneE164: string
  phoneDisplay: string
  whatsappE164: string
}

export const shopConfig = {
  name: "The Sonnet Cafe",
  tagline: "Fresh kitchen • Cafe plates • Bakery",
  taglineShort: "Fresh food, made with care.",
  url: "https://sonnet.onelink.cards",
  cardType: "B2C" as const,
  keywordBadges: ["4.8 ★ Google Rating", "46 Google reviews", "Fresh kitchen", "Orders 12 PM–10 PM"] as string[],

  contact: {
    phones: ["9596019296"],
    email: "",
    address: "The Qureshies, 160, Rajbagh, Srinagar, Jammu and Kashmir 190008",
    locationLine: "Located at The Qureshies, Rajbagh, Srinagar. Fresh orders are open from 12:00 PM to 10:00 PM.",
    mapQuery: "The Sonnet Cafe The Qureshies 160 Rajbagh Srinagar 190008",
    storeHours: "Open daily from 12:00 PM. Delivery orders close at 10:00 PM.",
    storeHoursStatus: "Opens 12 PM",
    officePhone: "9596019296",
  },

  contactPersons: [
    {
      label: "The Sonnet Cafe" as ContactPersonLabel,
      phoneE164: "919596019296",
      phoneDisplay: "095960 19296",
      whatsappE164: "919596019296",
    },
  ] as ContactPerson[],

  whatsapp: {
    defaultPhone: "9596019296",
    defaultMessage: "Hi The Sonnet Cafe, I would like to place an order. Please share today's fresh availability.",
    showSelector: false,
    selectorPersons: ["The Sonnet Cafe"] as ContactPersonLabel[],
  },

  social: {
    facebook: "",
    instagram: "https://www.instagram.com/the.sonnet.cafe/",
    instagramJammu: "https://www.instagram.com/the.sonnet.cafe/",
    twitter: "",
    linkedin: "",
    swiggy: "https://www.swiggy.com/restaurants/the-sonnet-rajbagh-srinagar-1328663/dineout?is_retargeting=true&media_source=GoogleReserve&utm_campaign=GoogleMap&utm_source=GoogleReserve",
    zomato: "https://www.zomato.com/srinagar/restaurants?q=The%20Sonnet%20Cafe",
  },

  instagramFeed: {
    title: "Follow on Instagram",
    subtitle: "Fresh kitchen moments, bakery drops and cafe updates from Rajbagh.",
    profileHandle: "@the.sonnet.cafe",
    posts: [
      {
        id: "sonnet-kitchen",
        image: "/gallery/unnamed.webp",
        caption: "Fresh cafe plates and bakery moments from The Sonnet Cafe.",
        mediaType: "post",
        pinned: true,
        href: "https://www.instagram.com/the.sonnet.cafe/",
      },
      {
        id: "sonnet-bakery",
        image: "/gallery/unnamed (1).webp",
        caption: "Warm bakery, desserts and daily fresh prep.",
        mediaType: "reel",
        href: "https://www.instagram.com/the.sonnet.cafe/",
      },
      {
        id: "sonnet-cafe",
        image: "/gallery/unnamed (2).webp",
        caption: "Cafe, bakery and comfort food from Rajbagh.",
        mediaType: "post",
        href: "https://www.instagram.com/the.sonnet.cafe/",
      },
      {
        id: "sonnet-orders",
        image: "/gallery/unnamed (3).webp",
        caption: "Made close to order time, packed fresh.",
        mediaType: "post",
        href: "https://www.instagram.com/the.sonnet.cafe/",
      },
    ] as Array<{ id: string; image: string; caption: string; mediaType: "post" | "reel"; pinned?: boolean; href: string }>,
  },

  trustBadges: [
    "4.8★ Google Rating",
    "Fresh Kitchen",
    "Fresh Chicken Daily",
    "Dine-In, Delivery & Takeaway"
  ] as string[],

  brands: [
    { name: "Fresh Kitchen", tagline: "", logo: "" },
    { name: "Google Rated 4.8", tagline: "", logo: "" },
    { name: "Dine-In Reservations", tagline: "", logo: "" },
    { name: "Order Online", tagline: "", logo: "" },
    { name: "Made After Order", tagline: "", logo: "" },
  ],

  about: {
    title: "Welcome to The Sonnet Cafe",
    shortDescription: "A Rajbagh cafe and bakery built around fresh kitchen prep, fresh chicken, warm bakery desserts, coffee, shakes and comfort plates made close to order time.",
  },
  menuUrl: "/menu",
  menuPdfUrl: "/sonnet-menu.pdf",

  delivery: {
    restaurantLat: 34.0669,
    restaurantLng: 74.8196,
    radiusKm: 3.5,
    label: "The Sonnet Cafe, Rajbagh, Srinagar",
  },

  ordering: {
    opensAt: "12:00 PM",
    closesAt: "10:00 PM",
  },

  payment: {
    upiId: "aliamurtza-1@okicici",
    upiName: "The Sonnet Cafe",
    upiQrImageUrl: "/payments/sonnet-upi-qr.png",
    scannerImage: "/payments/sonnet-upi-qr.png",
    bank: {
      bankName: "",
      accountNumberMasked: "",
      ifsc: "",
      accountHolder: "",
      branchName: ""
    },
    showScanner: true,
    showDownloadQR: true,
  },

  google: {
    placeId: "ChIJNV8GIZmP4TgRY4lEDqVd8BA",
    mapsUrl: "https://www.google.com/maps/place/?q=place_id:ChIJNV8GIZmP4TgRY4lEDqVd8BA",
    reviewsUrl: "https://search.google.com/local/writereview?placeid=ChIJNV8GIZmP4TgRY4lEDqVd8BA",
    fallbackRating: 4.8,
    fallbackReviewCount: 46,
  },

  seo: {
    title: "The Sonnet Cafe Rajbagh Srinagar | Sonnet Onelink Menu, Orders & Reviews",
    description: "The Sonnet Cafe Onelink - 4.8 rated cafe and bakery in Rajbagh, Srinagar. View menu, order online, call, get directions, Zomato, Google reviews and fresh kitchen updates.",
    keywords: "The Sonnet, the sonnet, The Sonnet Cafe, the sonnet cafe, Sonnet, sonnet, The Sonnet Cafe Srinagar, The Sonnet Cafe Rajbagh, Sonnet Cafe Srinagar, Sonnet Cafe Rajbagh, Sonnet Onelink, The Sonnet Onelink, sonnet.onelink.cards, Rajbagh cafe, Srinagar cafe, Srinagar bakery, cafe bakery Rajbagh, fresh kitchen Srinagar, The Qureshies Rajbagh cafe, Sonnet Cafe menu, Sonnet Cafe order online, Sonnet Cafe Google reviews",
  },

  credits: {
    designer: "RepixelX Studio",
    designerUrl: "https://repixelx.com",
  },

  sections: {
    showAbout: true,
    showMenu: true,
    showServices: true,
    showGallery: true,
    showInstagramFeed: true,
    showReviews: true,
    showSocialConnect: false,
    showContactCard: true,
    showFooter: true,
  },

  assets: {
    logo: "/sonnet-logo.png",
    gallery: "/shops/honeys-fresh-n-frozen/assets/gallery/",
    qr: "",
  },

  catalog: [] as Array<{ id: string; title: string; description: string; logo: string; details: string; images: string[] }>,
  brochures: [{ href: "/sonnet-menu.pdf", title: "Full Menu PDF" }] as Array<{ href: string; title: string }>,
}

export type ShopConfig = typeof shopConfig
