'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowRight, Eye, Sparkles } from 'lucide-react'

type PreviewGateProps = {
  onEnter: () => void
}

export default function LoadingScreen({ onEnter }: PreviewGateProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.015, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } }}
      className="fixed inset-0 z-[9999] flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#151515] px-5 py-8"
    >
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/burger-bazaar-logo-red.png"
          alt=""
          fill
          priority
          className="scale-110 object-cover opacity-[0.28] blur-[12px]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,8,0.58)_0%,rgba(15,15,15,0.88)_56%,#111_100%)]" />
        <div className="absolute left-1/2 top-[18%] h-80 w-80 -translate-x-1/2 rounded-full bg-[#D12325]/20 blur-[90px]" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <motion.main
        initial={{ opacity: 0, y: 18, scale: 0.975 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 0.61, 0.36, 1] }}
        className="relative w-full max-w-[420px] overflow-hidden rounded-[32px] border border-white/15 bg-black/70 shadow-[0_32px_90px_rgba(0,0,0,0.58),0_12px_42px_rgba(209,35,37,0.28)] backdrop-blur-2xl"
      >
        <div className="relative h-[215px] overflow-hidden bg-[#D12325]">
          <Image
            src="/burger-bazaar-logo-red.png"
            alt="Burger Bazaar preview"
            fill
            priority
            className="object-cover scale-[1.03]"
            sizes="420px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-black/20" />
          <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/35 px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white backdrop-blur-md">
            <Eye className="h-3.5 w-3.5" />
            Preview mode
          </div>
        </div>

        <div className="relative px-6 pb-6 pt-6 sm:px-7 sm:pb-7">

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.45 }}
          >
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-white">
              <Sparkles className="h-3.5 w-3.5" />
              Interactive concept
            </div>

            <h1 className="max-w-[340px] text-[30px] font-black leading-[1.06] tracking-[-0.035em] text-white sm:text-[34px]">
              This experience is in preview mode.
            </h1>
            <p className="mt-4 text-[15px] font-medium leading-relaxed text-white/65">
              Explore a live demo of the Burger Bazaar OneLink experience—built to show how the final customer journey can look and feel.
            </p>

            <button
              type="button"
              onClick={onEnter}
              className="group mt-6 flex min-h-[56px] w-full items-center justify-between rounded-2xl bg-[#D12325] px-5 text-left text-white shadow-[0_16px_34px_rgba(209,35,37,0.30)] transition-all hover:bg-[#B91F22] hover:shadow-[0_20px_40px_rgba(209,35,37,0.36)] active:scale-[0.985]"
            >
              <span>
                <span className="block text-[15px] font-extrabold">Enter Live Demo</span>
                <span className="block text-[11px] font-semibold text-white/75">Click to view the OneLink</span>
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#D12325] shadow-sm transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight className="h-4.5 w-4.5" strokeWidth={2.4} />
              </span>
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.13em] text-white/45">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D12325]" />
              Preview only • Demo content
            </div>
          </motion.div>
        </div>
      </motion.main>
    </motion.div>
  )
}
