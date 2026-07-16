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
  const [showPreviewGate, setShowPreviewGate] = useState(true)

  useEffect(() => {
    // The client sees the preview gate once per tab. Returning from an inner
    // page keeps them inside the demo instead of interrupting the journey.
    if (typeof window !== 'undefined') {
      const fromGallery = sessionStorage.getItem('fromGallery')
      const fromMenu = sessionStorage.getItem('fromMenu')
      const fromReviews = sessionStorage.getItem('fromReviews')
      const hasEnteredPreview = sessionStorage.getItem('burgerBazaarPreviewEntered') === 'true'

      if (hasEnteredPreview || fromGallery === 'true' || fromMenu === 'true' || fromReviews === 'true') {
        sessionStorage.setItem('burgerBazaarPreviewEntered', 'true')
        setShowPreviewGate(false)
        sessionStorage.removeItem('fromGallery')
        sessionStorage.removeItem('fromMenu')
        sessionStorage.removeItem('fromReviews')

        setTimeout(() => {
          if (window.location.hash) {
            window.history.replaceState(null, '', window.location.pathname)
          }
          window.scrollTo(0, 0)
        }, 50)
      }
    }
  }, [])

  const handleEnterPreview = () => {
    sessionStorage.setItem('burgerBazaarPreviewEntered', 'true')
    setShowPreviewGate(false)
  }

  // Handle hash navigation after entering the preview.
  useEffect(() => {
    if (!showPreviewGate && typeof window !== 'undefined') {
      if (window.location.hash === '#gallery' || window.location.hash === '#menu' || window.location.hash === '#reviews') {
        window.history.replaceState(null, '', window.location.pathname)
        window.scrollTo(0, 0)
      }
    }
  }, [showPreviewGate])

  return (
    <>
      <AnimatePresence>
        {showPreviewGate && (
          <LoadingScreen key="preview-gate" onEnter={handleEnterPreview} />
        )}
      </AnimatePresence>
      {!showPreviewGate && (
        <>
          {/* Keep the original Sonnet depth behind the Burger Bazaar sections. */}
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
