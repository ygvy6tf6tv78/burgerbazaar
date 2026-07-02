'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { siteConfig } from '../data/site'
import { shopConfig } from '../shops/honeys-fresh-n-frozen/config'

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, #0a0a0a 0%, #111111 100%)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: '100vh',
        width: '100vw'
      }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B07A49]/12 blur-3xl" />
      </div>

      <div className="flex flex-col items-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
          className="relative mb-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 0.61, 0.36, 1] }}
            className="relative w-[164px] h-[164px] rounded-[24px] bg-[#f5f7fb] shadow-[0_20px_44px_rgba(0,0,0,0.22)] flex items-center justify-center overflow-hidden border border-white/45"
          >
            <div className="absolute inset-x-6 top-3 h-7 rounded-full bg-white/75 blur-lg" />

            <div className="absolute inset-[7px] z-10 rounded-[20px] overflow-hidden bg-mango-green shadow-[0_18px_34px_rgba(0,0,0,0.2)]">
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={shopConfig.assets.logo}
                  alt={`${shopConfig.name} Logo`}
                  width={144}
                  height={144}
                  className="w-full h-full object-contain scale-[1.3]"
                  priority
                />
                <motion.div
                  className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D8C3A5] to-transparent pointer-events-none"
                  initial={{ top: '8%' }}
                  animate={{ top: '88%' }}
                  transition={{
                    duration: 1.45,
                    repeat: Infinity,
                    ease: 'linear',
                    repeatDelay: 0.2
                  }}
                  style={{
                    boxShadow: '0 0 14px rgba(216, 195, 165, 0.75), 0 0 26px rgba(216, 195, 165, 0.35)'
                  }}
                />
              </div>
            </div>

            <motion.div
              className="absolute top-[5px] left-[5px] w-8 h-8 border-t-[3px] border-l-[3px] border-[#D8C3A5] rounded-tl-[22px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />
            <motion.div
              className="absolute top-[5px] right-[5px] w-8 h-8 border-t-[3px] border-r-[3px] border-[#D8C3A5] rounded-tr-[22px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />
            <motion.div
              className="absolute bottom-[5px] left-[5px] w-8 h-8 border-b-[3px] border-l-[3px] border-[#D8C3A5] rounded-bl-[22px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />
            <motion.div
              className="absolute bottom-[5px] right-[5px] w-8 h-8 border-b-[3px] border-r-[3px] border-[#D8C3A5] rounded-br-[22px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-1"
        >
          <p className="text-[11px] text-slate-400 mb-2 tracking-[0.18em] uppercase">
            Welcome to
          </p>
          <p className="text-[28px] leading-none font-bold text-white tracking-tight">
            {siteConfig.name}
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
