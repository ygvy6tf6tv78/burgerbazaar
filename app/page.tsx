'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
// Shop-specific components
import Hero from './shops/honeys-fresh-n-frozen/components/Hero'
import About from './shops/honeys-fresh-n-frozen/components/About'
import MenuPreview from './shops/honeys-fresh-n-frozen/components/MenuPreview'
import Services from './shops/honeys-fresh-n-frozen/components/Services'
import ContactCard from './shops/honeys-fresh-n-frozen/components/ContactCard'
// Shop-specific components (Gallery and Reviews)
import Gallery from './shops/honeys-fresh-n-frozen/components/Gallery'
import InstagramFeed from './shops/honeys-fresh-n-frozen/components/InstagramFeed'
import GoogleReviews from './shops/honeys-fresh-n-frozen/components/GoogleReviews'
// Shared components
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import LoadingScreen from './components/LoadingScreen'
import { shopConfig } from './shops/honeys-fresh-n-frozen/config'

export default function Home() {
  const [showLoading, setShowLoading] = useState(true)

  useEffect(() => {
    // Show the branded loading screen only on the first landing-page entry per tab.
    if (typeof window !== 'undefined' && sessionStorage.getItem('mangoLandingLoaded') === 'true') {
      setShowLoading(false)
      return
    }

    // Check if coming from any inner page - skip loading screen and return to the main card
    if (typeof window !== 'undefined') {
      const fromGallery = sessionStorage.getItem('fromGallery')
      const fromMenu = sessionStorage.getItem('fromMenu')
      const fromReviews = sessionStorage.getItem('fromReviews')

      if (fromGallery === 'true' || fromMenu === 'true' || fromReviews === 'true') {
        sessionStorage.setItem('mangoLandingLoaded', 'true')
        setShowLoading(false)
        sessionStorage.removeItem('fromGallery')
        sessionStorage.removeItem('fromMenu')
        sessionStorage.removeItem('fromReviews')

        setTimeout(() => {
          if (window.location.hash) {
            window.history.replaceState(null, '', window.location.pathname)
          }
          window.scrollTo(0, 0)
        }, 50)
        return
      }
    }

    // Show loading screen on every page load/refresh for a short branded moment
    const timer = setTimeout(() => {
      sessionStorage.setItem('mangoLandingLoaded', 'true')
      setShowLoading(false)
    }, 1800)

    // Fallback: ensure loading screen always disappears quickly
    const fallbackTimer = setTimeout(() => {
      sessionStorage.setItem('mangoLandingLoaded', 'true')
      setShowLoading(false)
    }, 2600)

    return () => {
      clearTimeout(timer)
      clearTimeout(fallbackTimer)
    }
  }, [])

  // Handle hash navigation after loading
  useEffect(() => {
    if (!showLoading && typeof window !== 'undefined') {
      if (window.location.hash === '#gallery' || window.location.hash === '#menu' || window.location.hash === '#reviews') {
        window.history.replaceState(null, '', window.location.pathname)
        window.scrollTo(0, 0)
      }
    }
  }, [showLoading])

  return (
    <>
      <AnimatePresence>
        {showLoading && (
          <LoadingScreen key="loading" />
        )}
      </AnimatePresence>
      {!showLoading && (
        <>
          {/* Fixed viewport glows — avoids repainting huge blurs on every scroll tick */}
          <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
            <div className="absolute -top-16 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#7B4A2D]/18 blur-3xl" />
            <div className="absolute top-[28vh] -left-20 h-64 w-64 rounded-full bg-[#B07A49]/16 blur-3xl" />
            <div className="absolute bottom-[15vh] right-[-5rem] h-72 w-72 rounded-full bg-[#EAD0B1]/42 blur-3xl" />
          </div>
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="min-h-screen pb-16 relative z-10 overflow-x-hidden pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]"
          style={{ backgroundColor: '#1a1a1a' }}
        >
          <div className="relative z-10">
            <Hero />
            <About />
            <MenuPreview />
            <Services />
            <GoogleReviews />
            <Gallery />
            {shopConfig.sections.showInstagramFeed && <InstagramFeed />}
            <ContactCard />
            <Footer />
            <BackToTop />
          </div>
        </motion.main>
        </>
      )}
    </>
  )
}
