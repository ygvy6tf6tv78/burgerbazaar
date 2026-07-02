'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, Bike, Clock3, PackageCheck, UtensilsCrossed } from 'lucide-react'
import { writeOrderType, type MangoOrderType } from '../lib/cart-session'

const dinePickupModes: Array<{
  type: MangoOrderType
  title: string
  subtitle: string
  detail: string
  href: string
  Icon: typeof Bike
}> = [
  {
    type: 'dine-in',
    title: 'Dine In',
    subtitle: 'Pre-order before you arrive.',
    detail: 'Fresh food ready for your dine-in visit at The Sonnet Cafe.',
    href: '/menu?mode=order&type=dine-in',
    Icon: UtensilsCrossed,
  },
  {
    type: 'takeaway',
    title: 'Pickup',
    subtitle: 'Packed and ready to collect.',
    detail: 'Skip waiting and collect your order from the restaurant.',
    href: '/menu?mode=order&type=takeaway',
    Icon: PackageCheck,
  },
]

export default function OrderTypePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[430px] bg-white px-3 pb-10 pt-[max(0.75rem,env(safe-area-inset-top))] text-slate-900">
      <div className="w-full">
        <section className="overflow-hidden rounded-[28px] border border-[#D8C3A5]/70 bg-white shadow-[0_16px_38px_rgba(73,46,26,0.10)]">
          <div className="p-3">
            <div className="relative flex items-center justify-between">
              <Link
                href="/"
                className="z-10 inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full bg-slate-50 text-slate-950 transition-colors hover:bg-slate-100 active:scale-95"
                aria-label="Back"
              >
                <ArrowLeft className="h-[18px] w-[18px] text-slate-900" />
              </Link>
              <h1 className="absolute left-0 right-0 px-12 text-center text-[20px] font-extrabold tracking-tight text-slate-950">
                Order Type
              </h1>
              <span className="z-10 h-10 w-10" aria-hidden />
            </div>

            <p className="mx-auto mt-2 max-w-[290px] px-2 text-center text-[12px] font-semibold leading-5 text-slate-600">
              Pick dine-in pre-order or packed pickup.
            </p>
          </div>
        </section>

        <section className="mt-3 grid gap-3">
          {dinePickupModes.map(({ type, title, subtitle, detail, href, Icon }) => (
            <Link
              key={type}
              href={href}
              onClick={() => writeOrderType(type)}
              className="group overflow-hidden rounded-[28px] border border-[#D8C3A5]/70 bg-[linear-gradient(145deg,#ffffff_0%,#fffaf1_58%,#ffffff_100%)] shadow-[0_14px_32px_rgba(73,46,26,0.10)] transition-transform active:scale-[0.985]"
            >
              <div className="border-b border-[#D8C3A5]/45 px-3.5 py-3">
                <div className="flex items-center gap-3">
                  <span className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl border border-[#D8C3A5] bg-[#F4E9DC] shadow-[0_8px_18px_rgba(73,46,26,0.10)]">
                    <Image
                      src="/sonnet-logo.png"
                      alt="The Sonnet Cafe"
                      fill
                      className="object-cover"
                      sizes="48px"
                      priority={type === 'dine-in'}
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-extrabold uppercase tracking-wide text-[#7B4A2D]">
                      {type === 'dine-in' ? 'Dine at Sonnet' : 'Quick pickup'}
                    </span>
                    <span className="mt-0.5 block text-[13px] font-semibold leading-4 text-slate-600">
                      Fresh kitchen orders from 12 PM to 10 PM
                    </span>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3.5">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] ring-1 ${
                    type === 'dine-in'
                      ? 'bg-[#F4E9DC] text-[#7B4A2D] ring-[#D8C3A5]'
                      : 'bg-[#FAF5EF] text-[#7B4A2D] ring-[#D8C3A5]'
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.4} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[17px] font-extrabold leading-tight text-slate-950">{title}</span>
                  <span className="mt-0.5 block text-[12px] font-bold leading-4 text-slate-600">{subtitle}</span>
                  <span className="mt-1 block text-[11px] font-medium leading-4 text-slate-500">{detail}</span>
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4E9DC] text-[#7B4A2D] transition-colors group-active:bg-[#D8C3A5] group-active:text-[#4A2E1A]">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </section>

        <section className="mt-3 rounded-[24px] border border-[#D8C3A5]/70 bg-white p-3 shadow-[0_10px_24px_rgba(73,46,26,0.08)]">
          <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500">
            <Clock3 className="h-4 w-4 text-[#7B4A2D]" />
            Want regular delivery instead?
          </div>
          <Link
            href="/menu?mode=order&type=online"
            onClick={() => writeOrderType('online')}
            className="mt-2 flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7B4A2D] via-[#9A6A43] to-[#B07A49] px-4 text-[14px] font-extrabold text-white shadow-[0_10px_20px_rgba(122,74,45,0.24)] active:scale-[0.98]"
          >
            Switch to Online Order
            <Bike className="h-4 w-4" strokeWidth={2.35} />
          </Link>
        </section>
      </div>
    </main>
  )
}
