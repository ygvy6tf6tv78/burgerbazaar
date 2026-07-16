'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { shopConfig } from '../config'
import { getTelLink } from '../../../lib/phone'

export default function ContactCard() {
  const sectionRef = useRef<HTMLElement | null>(null)

  const openMap = () => {
    window.open(`https://www.google.com/maps?q=${encodeURIComponent(shopConfig.contact.mapQuery)}`, '_blank')
  }

  const openOnlineOrder = () => {
    window.location.href = '/menu?mode=order&type=online'
  }

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto py-6"
    >
      <div className="bg-gradient-to-br from-mango-green to-mango-greenSoft backdrop-blur-md rounded-3xl p-6 shadow-lg border border-mango-green/30">
        <div className="section-title-accent mb-5">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-left tracking-tight">
            Get in Touch
          </h2>
        </div>

      <div className="space-y-3">
        {/* Phone - Premium FBEC89 + white card */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.05, duration: 0.3, ease: 'easeOut' }}
          className="rounded-2xl p-4 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
          style={{
            willChange: 'opacity',
            background: 'linear-gradient(135deg, #FBE9E9 0%, #FFF9F4 35%, #ffffff 70%, #FFF9F4 100%)',
            border: '1px solid rgba(209, 35, 37, 0.28)',
            boxShadow: '0 8px 24px rgba(209, 35, 37, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
          }}
        >
          <div className="absolute inset-x-0 top-0 h-1/2 rounded-t-2xl pointer-events-none opacity-60" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)' }} />
          <div className="flex items-start gap-3 mb-3 relative z-10">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border border-[#D12325]/25" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, #FBE9E9 100%)', boxShadow: '0 2px 8px rgba(209, 35, 37, 0.18)' }}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-800" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-800 mb-1 text-base">Order Helpline</h3>
              <p className="mb-2 text-xs text-slate-600">Call Burger Bazaar for order-related assistance.</p>
              <div className="space-y-2">
                {shopConfig.contactPersons.map((person) => (
                  <div key={person.label} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{person.label}</div>
                      <div className="text-xs text-slate-600">{person.phoneDisplay}</div>
                    </div>
                    <Button
                      onClick={() => window.location.href = getTelLink(person.phoneE164)}
                      className="h-8 px-3 bg-mango-green hover:bg-mango-greenSoft text-white text-xs font-semibold rounded-full border-0 shadow-md"
                    >
                      Call Now
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Direct online order */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.08, duration: 0.3, ease: 'easeOut' }}
          className="rounded-2xl p-4 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #FBE9E9 0%, #FFF9F4 42%, #ffffff 100%)',
            border: '1px solid rgba(209,35,37,0.28)',
            boxShadow: '0 8px 24px rgba(209,35,37,0.12), 0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <div className="flex items-start gap-3 relative z-10">
            <div className="relative w-11 h-11 rounded-full flex-shrink-0 overflow-hidden border-2 border-white bg-white shadow-[0_8px_18px_rgba(209,35,37,0.22)]">
              <Image src="/burger-bazaar-logo.jpg" alt="Burger Bazaar" fill className="object-cover" sizes="44px" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-slate-800 mb-1 text-base">Order Place</h3>
              <p className="text-sm text-slate-600">Choose your Burger Bazaar favourites and place the order online.</p>
            </div>
          </div>
          <Button
            onClick={openOnlineOrder}
            className="mt-3 w-full h-10 bg-[#151515] hover:bg-black text-white font-semibold rounded-xl border-0 shadow-md"
          >
            Place Order
          </Button>
        </motion.div>

        {/* Instagram - Premium card */}
        {shopConfig.social?.instagram && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1, duration: 0.3, ease: 'easeOut' }}
            className="rounded-2xl p-4 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            style={{
              willChange: 'opacity',
              background: 'linear-gradient(135deg, #FBE9E9 0%, #FFF9F4 35%, #ffffff 70%, #FFF9F4 100%)',
              border: '1px solid rgba(209, 35, 37, 0.28)',
              boxShadow: '0 8px 24px rgba(209, 35, 37, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            }}
          >
            <div className="absolute inset-x-0 top-0 h-1/2 rounded-t-2xl pointer-events-none opacity-60" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)' }} />
            <div className="flex items-start gap-3 mb-3 relative z-10">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border border-[#D12325]/25" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, #FBE9E9 100%)', boxShadow: '0 2px 8px rgba(209, 35, 37, 0.18)' }}>
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-800" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 mb-1.5 text-base">Instagram</h3>
                <p className="text-sm text-slate-600 break-all">
                  @burgerbazaarjammu
                </p>
              </div>
            </div>
            <Button
              onClick={() => window.open(shopConfig.social.instagram, '_blank', 'noopener,noreferrer')}
              className="w-full h-10 bg-mango-green hover:bg-mango-greenSoft text-white font-semibold rounded-xl border-0 shadow-md"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2 shrink-0" aria-hidden>
                <defs>
                  <linearGradient id="contact-card-insta-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#833AB4" />
                    <stop offset="50%" stopColor="#FD1D1D" />
                    <stop offset="100%" stopColor="#FCB045" />
                  </linearGradient>
                </defs>
                <path fill="url(#contact-card-insta-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Follow Burger Bazaar
            </Button>
          </motion.div>
        )}

        {/* Address with Map - Premium card */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.15, duration: 0.3, ease: 'easeOut' }}
          className="rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 relative"
          style={{
            willChange: 'opacity',
            background: 'linear-gradient(135deg, #FBE9E9 0%, #FFF9F4 35%, #ffffff 70%, #FFF9F4 100%)',
            border: '1px solid rgba(209, 35, 37, 0.28)',
            boxShadow: '0 8px 24px rgba(209, 35, 37, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
          }}
        >
          <div className="absolute inset-x-0 top-0 h-20 rounded-t-2xl pointer-events-none opacity-60 z-10" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)' }} />
          <div className="p-4 relative z-10">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border border-[#D12325]/25" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, #FBE9E9 100%)', boxShadow: '0 2px 8px rgba(209, 35, 37, 0.18)' }}>
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-800" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 mb-1.5 text-base">Pickup Location</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  {shopConfig.contact.address}
                </p>
              </div>
            </div>
            <Button
              onClick={openMap}
              className="w-full h-10 bg-mango-green hover:bg-mango-greenSoft text-white font-semibold rounded-xl border-0 shadow-md"
            >
              <MapPin className="w-4 h-4 mr-2 text-white" />
              Open in Maps
            </Button>
          </div>

          {/* Embedded Map */}
          <div className="h-48 bg-slate-800/50 backdrop-blur-sm">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(shopConfig.contact.mapQuery)}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </motion.div>

      </div>
      </div>
    </motion.section>
  )
}
