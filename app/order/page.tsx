'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, Bike, Clock3, ShoppingBag, Utensils } from 'lucide-react'
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
    detail: 'Food ready for your dine-in visit at Mango.',
    href: '/menu?mode=order&type=dine-in',
    Icon: Utensils,
  },
  {
    type: 'takeaway',
    title: 'Pickup',
    subtitle: 'Packed and ready to collect.',
    detail: 'Skip waiting and collect your order from the restaurant.',
    href: '/menu?mode=order&type=takeaway',
    Icon: ShoppingBag,
  },
]

export default function OrderTypePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[430px] bg-gradient-to-b from-[#fff9ea] via-white to-[#fff1d2] px-3 pb-10 pt-[max(0.75rem,env(safe-area-inset-top))] text-slate-900">
      <div className="w-full">
        <section className="overflow-hidden rounded-[28px] border border-amber-200/80 bg-white shadow-[0_16px_38px_rgba(120,53,15,0.12)]">
          <div className="h-2 bg-gradient-to-r from-[#E23744] via-[#F7A928] to-[#215941]" />
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
              Dine/Pickup
            </h1>
            <span className="z-10 h-10 w-10" aria-hidden />
          </div>

          <p className="mx-auto mt-2 max-w-[290px] px-2 text-center text-[12px] font-semibold leading-5 text-slate-600">
            Choose how you want Mango to prepare your order.
          </p>
          </div>
        </section>

        <section className="mt-3 grid gap-3">
          {dinePickupModes.map(({ type, title, subtitle, detail, href, Icon }) => (
            <Link
              key={type}
              href={href}
              onClick={() => writeOrderType(type)}
              className="group overflow-hidden rounded-[28px] border border-slate-200/90 bg-white shadow-[0_14px_32px_rgba(15,23,42,0.10)] transition-transform active:scale-[0.985]"
            >
              <div
                className={`h-16 border-b ${
                  type === 'dine-in'
                    ? 'border-amber-200/80 bg-[radial-gradient(circle_at_18%_20%,rgba(251,191,36,0.42),transparent_35%),linear-gradient(135deg,#fff8e3,#fff,#fef3c7)]'
                    : 'border-teal-200/80 bg-[radial-gradient(circle_at_18%_20%,rgba(20,184,166,0.28),transparent_35%),linear-gradient(135deg,#ecfdf5,#fff,#e0f2fe)]'
                }`}
              />
              <div className="flex items-center gap-3 p-3.5">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] ring-1 ${
                    type === 'dine-in'
                      ? 'bg-amber-50 text-amber-700 ring-amber-200'
                      : 'bg-teal-50 text-teal-700 ring-teal-200'
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.4} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[17px] font-extrabold leading-tight text-slate-950">{title}</span>
                  <span className="mt-0.5 block text-[12px] font-bold leading-4 text-slate-600">{subtitle}</span>
                  <span className="mt-1 block text-[11px] font-medium leading-4 text-slate-500">{detail}</span>
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors group-active:bg-[#fff3f6] group-active:text-[#E23744]">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </section>

        <section className="mt-3 rounded-[24px] border border-slate-200/90 bg-white/95 p-3 shadow-[0_10px_24px_rgba(15,23,42,0.07)]">
          <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500">
            <Clock3 className="h-4 w-4 text-[#215941]" />
            Want regular delivery instead?
          </div>
          <Link
            href="/menu?mode=order&type=online"
            onClick={() => writeOrderType('online')}
            className="mt-2 flex h-11 items-center justify-center gap-2 rounded-full bg-[#215941] px-4 text-[14px] font-extrabold text-white shadow-[0_10px_20px_rgba(33,89,65,0.22)] active:scale-[0.98]"
          >
            Switch to Online Order
            <Bike className="h-4 w-4" strokeWidth={2.35} />
          </Link>
        </section>
      </div>
    </main>
  )
}
