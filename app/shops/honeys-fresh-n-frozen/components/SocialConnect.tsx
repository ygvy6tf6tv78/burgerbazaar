'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { shopConfig } from '../config'

export default function SocialConnect() {
  if (!shopConfig.social?.instagram) {
    return null
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full max-w-md mx-auto py-6"
    >
      <div className="section-shell section-shell-light">
        <div className="section-shell-inner p-6 text-center">
          <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[#D12325]/20 blur-3xl" />

          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-20 h-20 bg-white rounded-[22px] flex items-center justify-center shadow-[0_18px_34px_rgba(15,23,42,0.1)] border border-[#D12325]/25 overflow-hidden">
              <Image
                src={shopConfig.assets.logo}
                alt={shopConfig.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden shadow-[0_14px_30px_rgba(0,0,0,0.12)] border border-white/70"
              style={{ boxShadow: 'inset 0 0 0 2px white, 0 14px 30px rgba(0,0,0,0.12)' }}
            >
              <Image
                src="/instagram-official.png"
                alt="Instagram"
                width={64}
                height={64}
                className="w-full h-full object-contain p-2"
              />
            </div>
          </div>

          <div className="space-y-3">
            {shopConfig.social?.instagram && (
              <motion.button
                onClick={() => {
                  window.open(shopConfig.social.instagram, '_blank', 'noopener,noreferrer')
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white font-semibold rounded-2xl h-12 px-6 shadow-lg transition-all duration-200 flex items-center justify-center gap-2.5 ring-1 ring-white/20"
                style={{
                  boxShadow: '0 12px 26px rgba(139, 92, 246, 0.26), 0 6px 14px rgba(236, 72, 153, 0.16)',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white p-1.5 shadow-sm">
                  <Image src="/instagram-official.png" alt="Instagram" width={22} height={22} className="h-full w-full object-contain" />
                </span>
                <span className="text-[15px] font-semibold tracking-tight">Follow @burgerbazaarjammu</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
