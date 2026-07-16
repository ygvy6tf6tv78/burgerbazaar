'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BadgePercent } from 'lucide-react'

export default function GoogleReviews() {
  return (
    <section id="order-your-way" className="w-full max-w-md mx-auto pt-8 pb-6">
      <div className="mb-5">
        <div className="section-title-accent mb-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-left">
            Order Your Way
          </h2>
        </div>
        <p className="whitespace-nowrap text-sm sm:text-base text-slate-300/90 tracking-tight">
          Direct ordering • simple • quick • personal.
        </p>
      </div>

      <motion.article
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative min-h-[300px] overflow-hidden rounded-[28px] border border-white/15 shadow-[0_22px_48px_rgba(0,0,0,0.30)]"
      >
        <Image
          src="/burger-bazaar-header.jpg"
          alt="Burger Bazaar direct ordering"
          fill
          className="scale-110 object-cover blur-[2px]"
          sizes="(max-width: 448px) 100vw, 448px"
        />
        <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(21,21,21,0.66)_0%,rgba(120,18,21,0.62)_52%,rgba(209,35,37,0.70)_100%)]" />
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/12 blur-3xl" />
        <div className="absolute inset-[1px] rounded-[27px] border border-white/10" />

        <div className="relative z-10 flex min-h-[300px] flex-col justify-end p-5 sm:p-6">
          <span className="mb-auto w-fit rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-white backdrop-blur-md">
            Direct from us
          </span>
          <h3 className="text-2xl font-extrabold tracking-tight text-white">Direct Order</h3>
          <p className="mt-1.5 max-w-[330px] text-sm font-medium leading-relaxed text-white/85">
            View the menu and place your order directly with Burger Bazaar.
          </p>
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/[0.94] px-3.5 py-3 text-xs font-semibold text-[#151515] shadow-[0_12px_26px_rgba(0,0,0,0.20)] backdrop-blur-md">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FBE8E8] text-[#D12325]">
              <BadgePercent className="h-5 w-5" strokeWidth={2.25} />
            </span>
            <span><span className="block text-[10px] font-black uppercase tracking-[0.13em] text-[#D12325]">Coupon saving</span>Have a code? Mention it with your order to save extra.</span>
          </div>
          <Link
            href="/menu?mode=order&type=online"
            className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-[#070707] px-4 text-sm font-extrabold text-white shadow-[0_18px_34px_rgba(0,0,0,0.42)] transition-all hover:bg-black active:scale-[0.985]"
          >
            Order Directly From Us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.article>
    </section>
  )
}
