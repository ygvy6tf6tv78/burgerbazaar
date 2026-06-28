'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, Bike, ShoppingBag, Utensils } from 'lucide-react'
import { writeOrderType, type MangoOrderType } from '../lib/cart-session'

const orderModes: Array<{
  type: MangoOrderType
  title: string
  subtitle: string
  href: string
  Icon: typeof Bike
}> = [
  {
    type: 'online',
    title: 'Order Online',
    subtitle: 'Delivery order with current checkout flow.',
    href: '/menu?mode=order&type=online',
    Icon: Bike,
  },
  {
    type: 'dine-in',
    title: 'Dine In',
    subtitle: 'Pre-order before you arrive to dine here.',
    href: '/menu?mode=order&type=dine-in',
    Icon: Utensils,
  },
  {
    type: 'takeaway',
    title: 'Takeaway',
    subtitle: 'Place order now and pick it up packed.',
    href: '/menu?mode=order&type=takeaway',
    Icon: ShoppingBag,
  },
]

export default function OrderTypePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[430px] bg-gradient-to-b from-[#fff8e8] via-white to-[#fef2d7] px-3 pb-10 pt-[max(0.75rem,env(safe-area-inset-top))] text-slate-900">
      <div className="w-full">
        <section className="rounded-[26px] border border-amber-200/80 bg-white/95 p-2.5 shadow-[0_14px_34px_rgba(120,53,15,0.10)]">
          <div className="relative flex items-center justify-between">
            <Link
              href="/"
              className="z-10 inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full bg-slate-50 transition-colors hover:bg-slate-100 active:scale-95"
              aria-label="Back"
            >
              <ArrowLeft className="h-[18px] w-[18px] text-slate-900" />
            </Link>
            <h1 className="absolute left-0 right-0 px-12 text-center text-[20px] font-extrabold tracking-tight">
              Order Now
            </h1>
            <span className="z-10 h-10 w-10" aria-hidden />
          </div>

          <p className="mx-auto mt-2 max-w-[300px] px-2 text-center text-[12px] font-semibold leading-5 text-slate-600">
            Select delivery, dine-in pre-order, or packed pickup.
          </p>
        </section>

        <section className="mt-3 grid gap-2.5">
          {orderModes.map(({ type, title, subtitle, href, Icon }) => (
            <Link
              key={type}
              href={href}
              onClick={() => writeOrderType(type)}
              className="group flex items-center gap-3 rounded-[24px] border border-slate-200/90 bg-white p-3 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-transform active:scale-[0.98]"
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] ring-1 ${
                  type === 'online'
                    ? 'bg-[#fff3f6] text-[#E23744] ring-[#f3b5c0]'
                    : type === 'dine-in'
                      ? 'bg-amber-50 text-amber-700 ring-amber-200'
                      : 'bg-teal-50 text-teal-700 ring-teal-200'
                }`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={2.4} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[16px] font-extrabold leading-tight text-slate-950">{title}</span>
                <span className="mt-0.5 block text-[12px] font-semibold leading-5 text-slate-500">{subtitle}</span>
              </span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors group-active:bg-[#fff3f6] group-active:text-[#E23744]">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </section>
      </div>
    </main>
  )
}
