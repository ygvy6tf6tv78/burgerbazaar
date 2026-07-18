'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.025, transition: { duration: 0.28, ease: 'easeInOut' } }}
      className="fixed inset-0 z-[9999] flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#0D0D0D] px-6"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D12325]/16 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(255,255,255,0.055),transparent_48%)]" />
      </div>

      <div className="relative flex h-[390px] w-full max-w-[390px] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, x: '-50%', y: 0, scale: 0.9 }}
          animate={{ opacity: [0, 1, 1, 1, 1, 0], x: '-50%', y: [0, 0, 0, -64, -82, -90], scale: [0.9, 1, 1, 1, 0.98, 0.95] }}
          transition={{ duration: 2.35, times: [0, 0.12, 0.40, 0.62, 0.78, 1], ease: [0.22, 0.61, 0.36, 1] }}
          className="absolute left-1/2 top-[16px] z-10 h-[225px] w-[330px]"
        >
          <Image src="/burger-loader-top.png" alt="" fill priority className="object-contain" sizes="330px" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: '-50%', y: 0, scale: 0.9 }}
          animate={{ opacity: [0, 1, 1, 1, 1, 0], x: '-50%', y: [0, 0, 0, 64, 82, 90], scale: [0.9, 1, 1, 1, 0.98, 0.95] }}
          transition={{ delay: 0.04, duration: 2.3, times: [0, 0.12, 0.39, 0.61, 0.78, 1], ease: [0.22, 0.61, 0.36, 1] }}
          className="absolute left-1/2 top-[108px] z-10 h-[210px] w-[380px]"
        >
          <Image src="/burger-loader-bottom.png" alt="" fill priority className="object-contain" sizes="380px" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.54, rotate: -2 }}
          animate={{ opacity: [0, 0, 0, 1, 1, 1], scale: [0.54, 0.54, 0.68, 1, 1.12, 1.08], rotate: [-2, -2, -2, 0, 1.2, 0] }}
          transition={{ duration: 2.35, times: [0, 0.60, 0.68, 0.78, 0.90, 1], ease: [0.22, 0.61, 0.36, 1] }}
          className="relative z-0 h-[184px] w-[326px] drop-shadow-[0_22px_42px_rgba(0,0,0,0.55)]"
        >
          <Image src="/burger-loader-wordmark.png" alt="Burger Bazaar" fill priority className="object-contain" sizes="320px" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: [0, 0, 1, 1], y: [8, 8, 0, 0] }}
          transition={{ duration: 2.35, times: [0, 0.76, 0.86, 1] }}
          className="absolute bottom-1 left-0 right-0 z-20 text-center"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/70">Loading the chaos</p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">Powered by OneLink</p>
          <div className="mt-4 flex items-center justify-center gap-1.5" aria-label="Loading">
            {[0, 1, 2].map((dot) => (
              <motion.span
                key={dot}
                className="h-1.5 w-1.5 rounded-full bg-[#D12325]"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 0.75, repeat: Infinity, delay: dot * 0.14 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
