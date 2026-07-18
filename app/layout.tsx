import type { Metadata, Viewport } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { siteConfig } from './data/site'
import { LanguageProvider } from './contexts/LanguageContext'
import { CartProvider } from './contexts/CartContext'

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.seo.title,
    template: `%s | ${siteConfig.name} Jammu`,
  },
  description: siteConfig.seo.description,
  keywords: siteConfig.seo.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.credits.designer,
  publisher: siteConfig.name,
  applicationName: `${siteConfig.name} Onelink`,
  category: 'restaurant',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteConfig.url,
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    siteName: siteConfig.name,
    images: [
      {
        url: 'shareImage' in siteConfig.seo ? siteConfig.seo.shareImage : '/components/fff.png',
        width: 1254,
        height: 1254,
        alt: `${siteConfig.name} — Big bites, bold flavours`,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: ['shareImage' in siteConfig.seo ? siteConfig.seo.shareImage : '/components/fff.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // JSON-LD structured data for local SEO.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['Restaurant', 'CafeOrCoffeeShop', 'Bakery'],
    '@id': `${siteConfig.url}/#burger-bazaar`,
    name: siteConfig.name,
    alternateName: ['Burger Bazaar Jammu', 'Burger Bazaar Channi Himmat'],
    description: siteConfig.seo.description,
    url: siteConfig.url,
    image: `${siteConfig.url}/burger-bazaar-header.jpg`,
    logo: `${siteConfig.url}/burger-bazaar-logo-red.png`,
    telephone: `+91${siteConfig.contact.phones[0]}`,
    email: siteConfig.contact.email,
    priceRange: '₹₹',
    servesCuisine: ['Burgers', 'Fast Food', 'Street Food', 'Desserts'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.contact.address,
      addressLocality: 'Jammu',
      addressRegion: 'Jammu and Kashmir',
      addressCountry: 'IN',
    },
    areaServed: ['Channi Himmat', 'Jammu', 'Jammu and Kashmir'],
    hasMap: siteConfig.google.mapsUrl,
    menu: `${siteConfig.url}/menu`,
    sameAs: [
      siteConfig.social.facebook,
      siteConfig.social.instagram,
      siteConfig.social.twitter,
      siteConfig.social.linkedin,
    ].filter(Boolean),
  }

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <style dangerouslySetInnerHTML={{ __html: `
          html, body { 
            background-color: #1a1a1a;
          }
        ` }} />
      </head>
      <body className={`${poppins.className} antialiased min-h-screen`} style={{ 
        backgroundColor: '#1a1a1a'
      }}>
        <LanguageProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
