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

      <div className="relative flex h-[430px] w-full max-w-[390px] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, x: '-50%', y: -44, scale: 0.84 }}
          animate={{ opacity: [0, 1, 1, 0], x: '-50%', y: [-44, -10, -10, -22], scale: [0.84, 1, 1, 0.96] }}
          transition={{ duration: 1.72, times: [0, 0.28, 0.70, 1], ease: [0.22, 0.61, 0.36, 1] }}
          className="absolute left-1/2 top-[42px] h-[190px] w-[260px] -translate-x-1/2"
        >
          <Image src="/burger-loader-top.png" alt="" fill priority className="object-contain" sizes="260px" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: '-50%', y: 44, scale: 0.84 }}
          animate={{ opacity: [0, 1, 1, 0], x: '-50%', y: [44, 10, 10, 22], scale: [0.84, 1, 1, 0.96] }}
          transition={{ delay: 0.14, duration: 1.58, times: [0, 0.28, 0.68, 1], ease: [0.22, 0.61, 0.36, 1] }}
          className="absolute bottom-[96px] left-1/2 h-[150px] w-[270px] -translate-x-1/2"
        >
          <Image src="/burger-loader-bottom.png" alt="" fill priority className="object-contain" sizes="270px" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.64, rotate: -4 }}
          animate={{ opacity: [0, 0, 1, 1, 1], scale: [0.64, 0.72, 1, 1.18, 1.08], rotate: [-4, -4, 0, 2.5, 0] }}
          transition={{ duration: 2.35, times: [0, 0.27, 0.48, 0.76, 1], ease: [0.22, 0.61, 0.36, 1] }}
          className="relative z-10 h-[170px] w-[310px] drop-shadow-[0_22px_42px_rgba(0,0,0,0.55)]"
        >
          <Image src="/burger-loader-wordmark.png" alt="Burger Bazaar" fill priority className="object-contain" sizes="310px" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: [0, 0, 1, 1], y: [8, 8, 0, 0] }}
          transition={{ duration: 2.35, times: [0, 0.45, 0.64, 1] }}
          className="absolute bottom-1 left-0 right-0 text-center"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/45">Welcoming you to</p>
          <p className="mt-1 text-[14px] font-extrabold tracking-[0.08em] text-white">Burger Bazaar</p>
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
