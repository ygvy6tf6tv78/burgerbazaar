'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, Bike, PackageCheck } from 'lucide-react'
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
        <section className="overflow-hidden rounded-[28px] border border-[#E8D7D2] bg-white shadow-[0_16px_38px_rgba(21,21,21,0.10)]">
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
                Takeaway
              </h1>
              <span className="z-10 h-10 w-10" aria-hidden />
            </div>

            <p className="mx-auto mt-2 max-w-[290px] px-2 text-center text-[12px] font-semibold leading-5 text-slate-600">
              Choose your items and collect the order once Burger Bazaar confirms it.
            </p>
          </div>
        </section>

        <section className="mt-3 grid gap-3">
          {dinePickupModes.map(({ type, title, subtitle, detail, href, Icon }) => (
            <Link
              key={type}
              href={href}
              onClick={() => writeOrderType(type)}
              className="group overflow-hidden rounded-[28px] border border-[#E8D7D2] bg-[linear-gradient(145deg,#ffffff_0%,#FFF9F5_58%,#FBE8E8_100%)] shadow-[0_14px_32px_rgba(21,21,21,0.10)] transition-transform active:scale-[0.985]"
            >
              <div className="border-b border-[#E8D7D2] px-3.5 py-3">
                <div className="flex items-center gap-3">
                  <span className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl border border-[#E8D7D2] bg-[#FBE8E8] shadow-[0_8px_18px_rgba(21,21,21,0.10)]">
                    <Image
                      src="/burger-bazaar-logo.jpg"
                      alt="Burger Bazaar"
                      fill
                      className="object-cover"
                      sizes="48px"
                      priority={type === 'online'}
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-extrabold uppercase tracking-wide text-[#D12325]">
                      {type === 'online' ? 'Order direct' : 'Quick pickup'}
                    </span>
                    <span className="mt-0.5 block text-[13px] font-semibold leading-4 text-slate-600">
                      Availability and live price confirmed on order
                    </span>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3.5">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] ring-1 ${
                    type === 'online'
                      ? 'bg-[#FBE9E9] text-[#D12325] ring-[#D12325]/25'
                      : 'bg-[#FFF9F4] text-[#D12325] ring-[#D12325]/25'
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.4} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[17px] font-extrabold leading-tight text-slate-950">{title}</span>
                  <span className="mt-0.5 block text-[12px] font-bold leading-4 text-slate-600">{subtitle}</span>
                  <span className="mt-1 block text-[11px] font-medium leading-4 text-slate-500">{detail}</span>
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FBE8E8] text-[#D12325] transition-colors group-active:bg-[#D12325] group-active:text-white">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </section>

      </div>
    </main>
  )
}
