// Contact Person Type
export type ContactPersonLabel = "Burger Bazaar"

export interface ContactPerson {
  label: ContactPersonLabel
  phoneE164: string
  phoneDisplay: string
  whatsappE164: string
}

export const siteConfig = {
  name: "Burger Bazaar",
  tagline: "Big bites. Bold flavours. Built fresh.",
  url: "https://burgerbazaar.onelink.cards",

  contact: {
    phones: ["9266855210"],
    email: "",
    address: "CHC, Door 10040, 1st Floor, Street 101, Ward 50, Sector 4, Zone 3, Channi Himmat, Jammu",
    mapQuery: "Burger Bazaar Channi Himmat Jammu",
    storeHours: "Check Zomato or Swiggy for current order availability.",
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
  },

  trustBadges: ["Freshly Smashed", "Housemade Buns", "Delivery & Takeaway"] as string[],

  brands: [
    { name: "Fresh Kitchen", tagline: "Channi Himmat", logo: "" },
    { name: "Packed to Travel", tagline: "Jammu", logo: "" },
    { name: "Order Online", tagline: "Check live availability", logo: "" },
    { name: "Takeaway", tagline: "Order ahead", logo: "" },
  ],

  about: {
    title: "Welcome to Burger Bazaar",
    shortDescription: "Freshly smashed burgers, housemade buns and bold flavours made for serious cravings.",
    fullDescription: "Freshly smashed burgers, housemade buns and bold flavours made for serious cravings. Every order is prepared fresh and packed carefully for delivery or takeaway across Jammu.",
  },

  catalog: [] as Array<{ id: string; title: string; description: string; logo: string; details: string; images: string[] }>,
  brochures: [] as Array<{ href: string; title: string }>,

  social: {
    facebook: "",
    instagram: "https://www.instagram.com/burgerbazaarjammu/",
    twitter: "",
    linkedin: "",
  },

  seo: {
    title: "Burger Bazaar Jammu | Smash Burgers & Delivery",
    description: "Burger Bazaar OneLink for smash burgers, fried chicken burgers, loaded fries, desserts and delivery in Channi Himmat, Jammu.",
    keywords: "Burger Bazaar, Burger Bazaar Jammu, Burger Bazaar Channi Himmat, smash burgers Jammu, loaded fries Jammu",
    shareImage: "/burger-bazaar-header.jpg",
  },

  credits: {
    designer: "RepixelX Studio",
    designerUrl: "https://repixelx.com",
  },

  google: {
    placeId: "",
    mapsUrl: "https://www.google.com/maps?um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=Kd-4NdndnR45MeSWjVCRNIEH&daddr=Sector+4,+rajma,+opposite+peerah+walle,+Channi+Himat,+Jammu,+Jammu+and+Kashmir+180015",
    reviewsUrl: "https://www.zomato.com/jammu/burger-bazaar-channi-himmat",
  },
}

export type SiteConfig = typeof siteConfig
