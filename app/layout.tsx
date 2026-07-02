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
    template: `%s | ${siteConfig.name} Rajbagh Srinagar`,
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
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Scan to pay`,
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
    '@id': `${siteConfig.url}/#the-sonnet-cafe`,
    name: siteConfig.name,
    alternateName: ['Sonnet Cafe', 'The Sonnet Onelink', 'Sonnet Onelink'],
    description: siteConfig.seo.description,
    url: siteConfig.url,
    image: `${siteConfig.url}/sonnet-logo.jpeg`,
    logo: `${siteConfig.url}/sonnet-logo.jpeg`,
    telephone: `+91${siteConfig.contact.phones[0]}`,
    email: siteConfig.contact.email,
    priceRange: '₹200-₹1400',
    servesCuisine: ['Cafe', 'Bakery', 'Fast Food', 'Coffee', 'Desserts'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.contact.address,
      addressLocality: 'Srinagar',
      addressRegion: 'Jammu and Kashmir',
      postalCode: '190008',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 34.0669,
      longitude: 74.8196,
    },
    areaServed: ['Rajbagh', 'Srinagar', 'Jammu and Kashmir'],
    hasMap: siteConfig.google.mapsUrl,
    menu: `${siteConfig.url}/menu`,
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '12:00',
      closes: '22:00',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '46',
      bestRating: '5',
      worstRating: '1',
    },
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
