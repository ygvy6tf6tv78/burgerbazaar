// Shop Configuration for Burger Bazaar
// All shop-specific data lives here

export type ContactPersonLabel = "Burger Bazaar"

export interface ContactPerson {
  label: ContactPersonLabel
  phoneE164: string
  phoneDisplay: string
  whatsappE164: string
}

export const shopConfig = {
  name: "Burger Bazaar",
  tagline: "Big bites. Bold flavours. Built fresh.",
  taglineShort: "Burgers worth getting messy for.",
  url: "https://burgerbazaar.onelink.cards",
  cardType: "B2C" as const,
  keywordBadges: ["4.4 ★ Delivery Rating", "Smash Burgers", "Loaded Fries"] as string[],

  contact: {
    phones: ["9266855210"],
    email: "",
    address: "Sector 4, Rajma, opposite Peerah Walle, Channi Himmat, Jammu, Jammu and Kashmir 180015",
    locationLine: "Delivery kitchen in Channi Himmat, Jammu, serving smash burgers, fried chicken burgers, loaded fries and desserts.",
    mapQuery: "Burger Bazaar, Sector 4, Rajma, opposite Peerah Walle, Channi Himmat, Jammu, Jammu and Kashmir 180015",
    storeHours: "Delivery-only outlet in Channi Himmat, Jammu.",
    storeHoursStatus: "Delivery only",
    officePhone: "9266855210",
  },

  contactPersons: [
    {
      label: "Burger Bazaar" as ContactPersonLabel,
      phoneE164: "919266855210",
      phoneDisplay: "092668 55210",
      whatsappE164: "919266855210",
    },
  ] as ContactPerson[],

  whatsapp: {
    defaultPhone: "9266855210",
    defaultMessage: "Hi Burger Bazaar, I want to order online: https://burgerbazaar.onelink.cards/menu?mode=order&type=online Please confirm today's availability and final price.",
    showSelector: false,
    selectorPersons: ["Burger Bazaar"] as ContactPersonLabel[],
  },

  social: {
    facebook: "",
    instagram: "https://www.instagram.com/burgerbazaarjammu/",
    instagramJammu: "https://www.instagram.com/burgerbazaarjammu/",
    twitter: "",
    linkedin: "",
    swiggy: "https://www.swiggy.com/search?query=Burger%20Bazaar",
    zomato: "https://link.zomato.com/xqzv/rshare?id=143279158ccab9d31",
  },

  instagramFeed: {
    title: "Follow the Chaos",
    subtitle: "New drops, loaded burgers, kitchen moments and offers from Burger Bazaar Jammu.",
    profileHandle: "@burgerbazaarjammu",
    posts: [
      {
        id: "burger-bazaar-kitchen",
        image: "/burger-bazaar-brand-3.jpg",
        caption: "Freshly packed and ready to pass the chaos.",
        mediaType: "post",
        pinned: true,
        href: "https://www.instagram.com/burgerbazaarjammu/",
      },
      {
        id: "burger-bazaar-smash",
        image: "/burger-bazaar-brand-2.jpg",
        caption: "Smash burgers, loaded sides and bold drops from Burger Bazaar.",
        mediaType: "reel",
        href: "https://www.instagram.com/burgerbazaarjammu/",
      },
      {
        id: "burger-bazaar-buns",
        image: "/burger-bazaar-brand-1.jpg",
        caption: "Housemade buns, signature sauces and serious cravings.",
        mediaType: "post",
        href: "https://www.instagram.com/burgerbazaarjammu/",
      },
      {
        id: "burger-bazaar-orders",
        image: "/burger-bazaar-brand-4.jpg",
        caption: "Burger Bazaar orders packed carefully for delivery across Jammu.",
        mediaType: "post",
        href: "https://www.instagram.com/burgerbazaarjammu/",
      },
    ] as Array<{ id: string; image: string; caption: string; mediaType: "post" | "reel"; pinned?: boolean; href: string }>,
  },

  trustBadges: ["Freshly Smashed", "Housemade Buns", "Veg & Non-Veg", "Delivery & Takeaway"] as string[],

  brands: [
    { name: "Fresh Kitchen", tagline: "", logo: "" },
    { name: "Housemade Buns", tagline: "", logo: "" },
    { name: "Packed to Travel", tagline: "", logo: "" },
    { name: "Order Online", tagline: "", logo: "" },
    { name: "Made After Order", tagline: "", logo: "" },
  ],

  about: {
    title: "Welcome to Burger Bazaar",
    shortDescription: "Freshly smashed burgers, housemade buns and bold flavours made for serious cravings. Every order is prepared fresh and packed carefully for delivery or takeaway across Jammu.",
  },
  menuUrl: "/menu",
  menuPdfUrl: "/burger-bazaar-menu.pdf",

  delivery: {
    restaurantLat: 32.6806,
    restaurantLng: 74.8708,
    radiusKm: 5,
    label: "Burger Bazaar, Channi Himmat, Jammu",
  },

  ordering: {
    opensAt: "Check live availability",
    closesAt: "on Zomato or Swiggy",
  },

  payment: {
    upiId: "",
    upiName: "Burger Bazaar",
    upiQrImageUrl: "",
    scannerImage: "",
    bank: {
      bankName: "",
      accountNumberMasked: "",
      ifsc: "",
      accountHolder: "",
      branchName: ""
    },
    showScanner: false,
    showDownloadQR: false,
  },

  google: {
    placeId: "",
    mapsUrl: "https://share.google/QEt26ANZfyz8KgjC2",
    reviewsUrl: "https://link.zomato.com/xqzv/rshare?id=143279158ccab9d31",
    fallbackRating: 0,
    fallbackReviewCount: 0,
  },

  seo: {
    title: "Burger Bazaar Jammu | Smash Burgers, Loaded Fries & Delivery",
    description: "Burger Bazaar OneLink for smash burgers, fried chicken burgers, loaded fries, desserts, delivery and takeaway in Channi Himmat, Jammu.",
    keywords: "Burger Bazaar, Burger Bazaar Jammu, Burger Bazaar Channi Himmat, smash burgers Jammu, fried chicken burgers Jammu, loaded fries Jammu, burger delivery Jammu",
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
    logo: "/burger-bazaar-logo-red.png",
    gallery: "/shops/honeys-fresh-n-frozen/assets/gallery/",
    qr: "",
  },

  catalog: [] as Array<{ id: string; title: string; description: string; logo: string; details: string; images: string[] }>,
  brochures: [] as Array<{ href: string; title: string }>,
}

export type ShopConfig = typeof shopConfig
