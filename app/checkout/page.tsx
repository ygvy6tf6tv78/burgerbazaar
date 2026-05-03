'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, MapPin, Minus, Plus, AlertCircle, CheckCircle2, X } from 'lucide-react'
import { type CartItem, generateWhatsAppCartMessage } from '../shops/honeys-fresh-n-frozen/menu'
import { shopConfig } from '../shops/honeys-fresh-n-frozen/config'
import { getWhatsAppLink } from '../lib/phone'
import { distanceKm } from '../lib/distance'

type DeliveryZone = 'unset' | 'inside' | 'outside'

const MOBILE_DIGITS = 10

function digitsOnly(s: string) {
  return s.replace(/\D/g, '')
}

/** 16px on inputs stops iOS zoom-on-focus; keep compact h-11 like original layout */
const fieldText = 'text-[16px] leading-snug'

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [mobile, setMobile] = useState('')
  const [mappedAddress, setMappedAddress] = useState('')
  const [flatHouse, setFlatHouse] = useState('')
  const [landmark, setLandmark] = useState('')
  const [userLat, setUserLat] = useState<number | null>(null)
  const [userLng, setUserLng] = useState<number | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [locationStatus, setLocationStatus] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  const locationBlockRef = useRef<HTMLDivElement>(null)
  const addressRef = useRef<HTMLTextAreaElement>(null)
  const mobileBlockRef = useRef<HTMLDivElement>(null)

  const delivery = shopConfig.delivery
  const radiusKm = delivery.radiusKm
  const paymentPageUrl = `${shopConfig.url}?pay=1`

  const distanceFromRestaurant = useMemo(() => {
    if (userLat == null || userLng == null) return null
    return distanceKm(userLat, userLng, delivery.restaurantLat, delivery.restaurantLng)
  }, [userLat, userLng, delivery.restaurantLat, delivery.restaurantLng])

  const deliveryZone: DeliveryZone = useMemo(() => {
    if (userLat == null || userLng == null || distanceFromRestaurant == null) return 'unset'
    return distanceFromRestaurant <= radiusKm ? 'inside' : 'outside'
  }, [userLat, userLng, distanceFromRestaurant, radiusKm])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = window.sessionStorage.getItem('mango_checkout_cart')
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as CartItem[]
      setCart(parsed)
    } catch {
      setCart([])
    }
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 4500)
    return () => window.clearTimeout(t)
  }, [toast])

  const total = useMemo(() => {
    return cart.reduce((sum, item) => {
      const numeric = parseFloat(item.price.replace('₹', '').replace(',', '').split('/')[0].trim())
      return sum + (isNaN(numeric) ? 0 : numeric * item.cartQuantity)
    }, 0)
  }, [cart])
  const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.cartQuantity, 0), [cart])

  const mobileDigits = useMemo(() => digitsOnly(mobile).slice(0, MOBILE_DIGITS), [mobile])

  const fullAddressBlock = useMemo(() => {
    const lines: string[] = []
    if (mappedAddress.trim()) lines.push(`Delivery pin: ${mappedAddress.trim()}`)
    if (flatHouse.trim()) lines.push(`Flat / house / floor: ${flatHouse.trim()}`)
    if (landmark.trim()) lines.push(`Nearby landmark: ${landmark.trim()}`)
    return lines.join('\n')
  }, [mappedAddress, flatHouse, landmark])

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.id !== id))
      return
    }
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, cartQuantity: qty } : i)))
  }

  const orderNow = () => {
    if (cart.length === 0) return
    if (!mappedAddress.trim() || userLat == null || userLng == null || deliveryZone !== 'inside') return
    if (mobileDigits.length < MOBILE_DIGITS) return
    const phone = shopConfig.contact.phones[0]?.replace(/\D/g, '') || '9419532222'
    const e164 = phone.length === 10 ? `91${phone}` : phone
    const base = generateWhatsAppCartMessage(cart, total)
    const customer =
      `\n\nCustomer Details:\nCall this number: +91 ${mobileDigits}\n\n${fullAddressBlock}` +
      `\n\n(Map distance ~${distanceFromRestaurant?.toFixed(1)} km from restaurant)` +
      `\n\nPlease confirm this order.` +
      `\n\n---\nFor customer: After order confirmation, please pay here:\n${paymentPageUrl}`
    window.open(getWhatsAppLink(e164, `${base}${customer}`), '_blank')
  }

  const useCurrentLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationStatus('Location is not supported on this device.')
      return
    }

    setIsLocating(true)
    setLocationStatus('Getting location…')

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          setUserLat(latitude)
          setUserLng(longitude)
          const response = await fetch(`/api/current-location?lat=${latitude}&lng=${longitude}`)
          if (!response.ok) {
            throw new Error('Could not fetch address')
          }
          const data = await response.json()
          if (data?.address) {
            setMappedAddress(data.address)
            const d = distanceKm(latitude, longitude, delivery.restaurantLat, delivery.restaurantLng)
            setLocationStatus(
              d <= radiusKm
                ? `You’re within our delivery zone (~${d.toFixed(1)} km).`
                : `This pin is ~${d.toFixed(1)} km away — outside our ${radiusKm} km delivery area.`
            )
          } else {
            setMappedAddress(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`)
            const d = distanceKm(latitude, longitude, delivery.restaurantLat, delivery.restaurantLng)
            setLocationStatus(
              d <= radiusKm
                ? `Location saved (~${d.toFixed(1)} km). Add details below.`
                : `Outside ${radiusKm} km delivery (~${d.toFixed(1)} km).`
            )
          }
        } catch {
          setLocationStatus('Could not load address — location still saved.')
          const { latitude, longitude } = position.coords
          setMappedAddress(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`)
        } finally {
          setIsLocating(false)
        }
      },
      () => {
        setIsLocating(false)
        setLocationStatus('Location blocked — allow access to continue.')
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    )
  }

  const canPlaceOrder =
    cart.length > 0 &&
    mobileDigits.length === MOBILE_DIGITS &&
    mappedAddress.trim() &&
    userLat != null &&
    userLng != null &&
    deliveryZone === 'inside'

  const validationMessage = (): string | null => {
    if (cart.length === 0) return 'Your cart is empty — add items from the menu first.'
    if (userLat == null || userLng == null) {
      return 'Tap “Use current location” and allow location when your browser asks.'
    }
    if (deliveryZone === 'outside') return 'We don’t deliver to this pin — it’s outside our zone.'
    if (!mappedAddress.trim()) return 'Add your delivery address in the box above.'
    if (mobileDigits.length < MOBILE_DIGITS) return 'Enter your 10-digit mobile number.'
    return null
  }

  const scrollFieldIntoView = (el: HTMLElement | null) => {
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }

  const handlePrimaryAction = () => {
    const msg = validationMessage()
    if (msg) {
      setToast(msg)
      if (cart.length === 0) return
      if (userLat == null || userLng == null) scrollFieldIntoView(locationBlockRef.current)
      else if (!mappedAddress.trim()) scrollFieldIntoView(addressRef.current)
      else if (mobileDigits.length < MOBILE_DIGITS) scrollFieldIntoView(mobileBlockRef.current)
      return
    }
    orderNow()
  }

  const focusScroll = (el: HTMLElement) => {
    el.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[430px] overflow-x-hidden bg-[#F25269]">
      {toast && (
        <div
          className="fixed left-0 right-0 top-0 z-[10001] flex justify-center px-3 pt-[max(0.5rem,env(safe-area-inset-top))]"
          role="alert"
        >
          <div className="flex max-w-md items-start gap-2 rounded-b-2xl border border-slate-700/80 bg-slate-900 px-4 py-3 text-left text-[13px] leading-snug text-white shadow-xl">
            <span className="min-w-0 flex-1">{toast}</span>
            <button
              type="button"
              className="shrink-0 rounded-lg p-1 text-white/80 hover:bg-white/10 hover:text-white"
              aria-label="Dismiss"
              onClick={() => setToast(null)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <main
        className="min-h-screen w-full max-w-full pb-[calc(5.5rem+env(safe-area-inset-bottom))] pl-[max(0.25rem,env(safe-area-inset-left))] pr-[max(0.25rem,env(safe-area-inset-right))]"
        style={{
          background:
            'linear-gradient(to bottom, #fff8f9 0%, #fef5f7 58%, rgba(255, 248, 249, 0) 100%)',
        }}
      >
        <div className="mx-auto w-full max-w-md px-3 pt-3">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-4 shadow-[0_14px_32px_rgba(15,23,42,0.08)]">
            <Link
              href="/menu?mode=order"
              className="-ml-1 inline-flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-xl px-2 py-2 text-[15px] font-semibold text-slate-800 hover:bg-slate-50 active:bg-slate-100"
            >
              <ArrowLeft className="h-5 w-5 shrink-0" strokeWidth={2.25} aria-hidden />
              <span>Back</span>
            </Link>
            <p className="mt-1 text-lg font-extrabold tracking-tight text-slate-900">Checkout</p>
            <p className="mt-0.5 text-xs text-slate-500">{totalItems} items</p>
          </div>

          <section className="mt-3 rounded-3xl border border-slate-200 bg-white p-3.5 shadow-[0_12px_24px_rgba(15,23,42,0.06)]">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Your items</h2>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{totalItems} items</span>
            </div>
            <div className="space-y-3">
              {cart.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-slate-300 p-3 text-sm text-slate-500">Your cart is empty.</p>
              ) : (
                cart.map((item) => {
                  const unitPrice = parseFloat(item.price.replace('₹', '').replace(',', '').split('/')[0].trim())
                  const lineTotal = (isNaN(unitPrice) ? 0 : unitPrice) * item.cartQuantity
                  return (
                    <div key={item.id} className="flex items-start justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-2.5">
                      <div className="min-w-0">
                        <p className="text-[15px] font-semibold leading-tight text-slate-900">{item.name}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{item.price}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="inline-flex h-9 items-center rounded-xl border border-[#f3b5c0] bg-[#fff3f6] px-2">
                          <button type="button" onClick={() => updateQty(item.id, item.cartQuantity - 1)} className="flex h-5 w-5 items-center justify-center rounded-full text-[#E23744]">
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-7 text-center text-sm font-bold text-[#E23744]">{item.cartQuantity}</span>
                          <button type="button" onClick={() => updateQty(item.id, item.cartQuantity + 1)} className="flex h-5 w-5 items-center justify-center rounded-full text-[#E23744]">
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="mt-1 text-sm font-semibold text-slate-800">₹{lineTotal.toFixed(0)}</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            <Link
              href="/menu?mode=order"
              className="mt-2.5 inline-flex items-center rounded-full border border-[#f3b5c0] bg-[#fff3f6] px-3 py-1.5 text-[13px] font-semibold leading-none text-[#E23744] active:scale-[0.98]"
            >
              + Add more items
            </Link>
          </section>

          <section className="mt-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_12px_24px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-[15px] font-bold text-slate-900">Delivery</h2>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">Within {radiusKm} km</span>
            </div>

            <div ref={locationBlockRef} className="mt-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 p-2.5">
              <p className="text-[12px] font-semibold text-slate-800">Location</p>
              <p className="mt-0.5 text-[11px] leading-snug text-slate-600">
                {userLat != null && userLng != null ? (
                  <>
                    Saved
                    {distanceFromRestaurant != null && (
                      <span className="text-slate-500"> · ~{distanceFromRestaurant.toFixed(1)} km</span>
                    )}
                  </>
                ) : (
                  <span>Tap the button below.</span>
                )}
              </p>

              <button
                type="button"
                onClick={useCurrentLocation}
                disabled={isLocating}
                className="mt-2 flex h-11 w-full min-w-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <MapPin className="h-4 w-4 shrink-0 text-slate-600" />
                <span className="truncate">{isLocating ? 'Getting location…' : 'Use current location'}</span>
              </button>

              {deliveryZone === 'inside' && userLat != null && (
                <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-emerald-200/80 bg-emerald-50 px-2.5 py-1.5 text-[11px] text-emerald-900">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  We deliver here.
                </div>
              )}

              {deliveryZone === 'outside' && userLat != null && (
                <div className="mt-1.5 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-2 text-[11px] leading-snug text-amber-950">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>Sorry — outside our {radiusKm} km area.</span>
                </div>
              )}
            </div>

            <div className="mt-3">
              <label htmlFor="checkout-address" className="mb-1 block text-[12px] font-semibold text-slate-800">
                Address
              </label>
              <textarea
                id="checkout-address"
                ref={addressRef}
                value={mappedAddress}
                onChange={(e) => setMappedAddress(e.target.value)}
                onFocus={(e) => focusScroll(e.target)}
                placeholder="From location, or type your area"
                rows={3}
                className={`w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300/80 ${fieldText}`}
              />
            </div>

            <div ref={mobileBlockRef} className="mt-3 border-t border-slate-200 pt-3">
              <label htmlFor="checkout-mobile" className="mb-1 block text-[12px] font-semibold text-slate-800">
                Mobile number
              </label>
              <div className="flex h-11 min-w-0 items-stretch overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm focus-within:border-slate-300 focus-within:ring-2 focus-within:ring-slate-300/80">
                <span
                  className="flex shrink-0 items-center gap-1.5 border-r border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100/90 px-2 sm:px-2.5"
                  aria-label="India, country code +91"
                >
                  <span className="select-none text-[18px] leading-none" aria-hidden title="India">
                    🇮🇳
                  </span>
                  <span className="text-[13px] font-bold tabular-nums tracking-tight text-slate-800">+91</span>
                </span>
                <input
                  id="checkout-mobile"
                  value={mobileDigits}
                  onChange={(e) => setMobile(digitsOnly(e.target.value).slice(0, MOBILE_DIGITS))}
                  onFocus={(e) => focusScroll(e.target)}
                  placeholder="98765 43210"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={MOBILE_DIGITS}
                  className={`min-w-0 flex-1 bg-white px-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none ${fieldText}`}
                />
              </div>
            </div>

            <div className="mt-3 border-t border-slate-200 pt-3">
              <p className="mb-2 text-[12px] font-semibold text-slate-800">
                Extra address details <span className="font-normal text-slate-400">· optional</span>
              </p>
              <div className="grid gap-2">
                <input
                  value={flatHouse}
                  onChange={(e) => setFlatHouse(e.target.value)}
                  onFocus={(e) => focusScroll(e.target)}
                  placeholder="Flat / floor (optional)"
                  className={`h-11 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300/80 ${fieldText}`}
                />
                <input
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  onFocus={(e) => focusScroll(e.target)}
                  placeholder="Landmark (optional)"
                  className={`h-11 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300/80 ${fieldText}`}
                />
              </div>
            </div>

            {locationStatus && (
              <p className="mt-2.5 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs leading-relaxed text-slate-600">{locationStatus}</p>
            )}
          </section>
        </div>
      </main>

      <div
        className="pointer-events-none fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[9999] flex justify-center"
        style={{
          paddingLeft: 'max(1.25rem, env(safe-area-inset-left))',
          paddingRight: 'max(1.25rem, env(safe-area-inset-right))',
        }}
      >
        <button
          type="button"
          onClick={handlePrimaryAction}
          className={`pointer-events-auto flex h-[60px] w-full max-w-[430px] items-center justify-between rounded-full border border-white/25 bg-[#F25269] px-4 text-white shadow-[0_14px_28px_rgba(226,55,68,0.32)] ${
            canPlaceOrder ? 'cursor-pointer active:scale-[0.99]' : 'cursor-pointer'
          }`}
        >
          <span className="flex min-w-0 flex-1 items-center gap-2.5">
            <span className="flex shrink-0 -space-x-2">
              <span className="h-7 w-7 overflow-hidden rounded-full border border-white/80 bg-white">
                <Image
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=120&q=60"
                  alt=""
                  width={28}
                  height={28}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </span>
              <span className="h-7 w-7 overflow-hidden rounded-full border border-white/80 bg-white">
                <Image
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=120&q=60"
                  alt=""
                  width={28}
                  height={28}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </span>
            </span>
            <span className="min-w-0 text-left text-[16px] font-semibold leading-tight text-white drop-shadow-sm">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} · ₹{total.toFixed(0)}
            </span>
          </span>
          <span className="shrink-0 pl-1 text-right leading-tight">
            <span className="block text-[15px] font-bold text-white">Place order</span>
            <span className="mt-0.5 block text-[11px] font-medium text-white/90">Pay by UPI</span>
          </span>
        </button>
      </div>
    </div>
  )
}
