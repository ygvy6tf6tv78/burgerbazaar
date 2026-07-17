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
      <div className="bg-gradient-to-br from-mango-green to-mango-greenSoft backdrop-blur-md rounded-[30px] p-6 shadow-lg border border-mango-green/30">
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
          className="rounded-[22px] p-4 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
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
              <h3 className="font-semibold text-slate-800 mb-1 text-base">Call & Order</h3>
              <p className="mb-2 text-xs text-slate-600">Speak directly with Burger Bazaar to place or discuss your order.</p>
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
          className="rounded-[22px] p-4 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #FBE9E9 0%, #FFF9F4 42%, #ffffff 100%)',
            border: '1px solid rgba(209,35,37,0.28)',
            boxShadow: '0 8px 24px rgba(209,35,37,0.12), 0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <div className="flex items-start gap-3 relative z-10">
            <div className="relative w-11 h-11 rounded-full flex-shrink-0 overflow-hidden border-2 border-white bg-white shadow-[0_8px_18px_rgba(209,35,37,0.22)]">
              <Image src="/burger-bazaar-logo-red.png" alt="Burger Bazaar" fill className="object-cover" sizes="44px" />
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
            className="rounded-[22px] p-4 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            style={{
              willChange: 'opacity',
              background: 'linear-gradient(135deg, #FBE9E9 0%, #FFF9F4 35%, #ffffff 70%, #FFF9F4 100%)',
              border: '1px solid rgba(209, 35, 37, 0.28)',
              boxShadow: '0 8px 24px rgba(209, 35, 37, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            }}
          >
            <div className="absolute inset-x-0 top-0 h-1/2 rounded-t-2xl pointer-events-none opacity-60" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)' }} />
            <div className="flex items-start gap-3 mb-3 relative z-10">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border border-white bg-white p-2 shadow-[0_6px_16px_rgba(209,35,37,0.18)]">
                <Image src="/instagram-official.png" alt="Instagram" width={24} height={24} className="h-full w-full object-contain" />
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
              <span className="mr-2 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white p-1">
                <Image src="/instagram-official.png" alt="" width={18} height={18} className="h-full w-full object-contain" aria-hidden />
              </span>
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
          className="rounded-[22px] overflow-hidden hover:shadow-xl transition-all duration-300 relative"
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
            <a
              href={shopConfig.google.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 w-full items-center justify-center rounded-xl border-0 bg-mango-green font-semibold text-white shadow-md hover:bg-mango-greenSoft"
            >
              <MapPin className="w-4 h-4 mr-2 text-white" />
              Open in Maps
            </a>
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
