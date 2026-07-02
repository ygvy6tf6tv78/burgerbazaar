// Contact Person Type
export type ContactPersonLabel = "The Sonnet Cafe"

export interface ContactPerson {
  label: ContactPersonLabel
  phoneE164: string
  phoneDisplay: string
  whatsappE164: string
}

export const siteConfig = {
  name: "The Sonnet Cafe",
  tagline: "Fresh kitchen • Cafe plates • Bakery",
  url: "https://sonnet.onelink.cards",

  contact: {
    phones: ["9596019296"],
    email: "",
    address: "The Qureshies, 160, Rajbagh, Srinagar, Jammu and Kashmir 190008",
    mapQuery: "The Sonnet Cafe The Qureshies 160 Rajbagh Srinagar 190008",
    storeHours: "Open daily from 12:00 PM. Delivery orders close at 10:00 PM.",
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
  },

  trustBadges: ["4.8★ Google Rating", "Fresh Kitchen", "Fresh Chicken Daily"] as string[],

  brands: [
    { name: "Fresh Kitchen", tagline: "Rajbagh", logo: "" },
    { name: "Google Rated 4.8", tagline: "46 reviews", logo: "" },
    { name: "Order Online", tagline: "12 PM - 10 PM", logo: "" },
    { name: "Reservations", tagline: "Dine-in", logo: "" },
  ],

  about: {
    title: "Welcome to The Sonnet Cafe",
    shortDescription: "A Rajbagh cafe and bakery built around fresh kitchen prep, fresh chicken, warm bakery desserts, coffee, shakes and comfort plates made close to order time.",
    fullDescription: "A Rajbagh cafe and bakery built around fresh kitchen prep, fresh chicken, warm bakery desserts, coffee, shakes and comfort plates made close to order time.",
  },

  catalog: [] as Array<{ id: string; title: string; description: string; logo: string; details: string; images: string[] }>,
  brochures: [{ href: "/sonnet-menu.pdf", title: "Full Menu PDF" }] as Array<{ href: string; title: string }>,

  social: {
    facebook: "",
    instagram: "https://www.instagram.com/sonne7/",
    twitter: "",
    linkedin: "",
  },

  seo: {
    title: "The Sonnet Cafe Rajbagh Srinagar | Sonnet Onelink Menu, Orders & Reviews",
    description: "The Sonnet Cafe Onelink - 4.8 rated cafe and bakery in Rajbagh, Srinagar. View menu, order online, call, get directions, Zomato, Google reviews and fresh kitchen updates.",
    keywords: "The Sonnet, the sonnet, The Sonnet Cafe, the sonnet cafe, Sonnet, sonnet, The Sonnet Cafe Srinagar, The Sonnet Cafe Rajbagh, Sonnet Cafe Srinagar, Sonnet Cafe Rajbagh, Sonnet Onelink, The Sonnet Onelink, sonnet.onelink.cards, Rajbagh cafe, Srinagar cafe, Srinagar bakery, cafe bakery Rajbagh, fresh kitchen Srinagar, The Qureshies Rajbagh cafe, Sonnet Cafe menu, Sonnet Cafe order online, Sonnet Cafe Google reviews",
    shareImage: "/sonnet-logo.jpeg",
  },

  credits: {
    designer: "RepixelX Studio",
    designerUrl: "https://repixelx.com",
  },

  google: {
    placeId: "ChIJNV8GIZmP4TgRY4lEDqVd8BA",
    mapsUrl: "https://www.google.com/maps/place/?q=place_id:ChIJNV8GIZmP4TgRY4lEDqVd8BA",
    reviewsUrl: "https://search.google.com/local/writereview?placeid=ChIJNV8GIZmP4TgRY4lEDqVd8BA",
  },
}

export type SiteConfig = typeof siteConfig
