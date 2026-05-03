'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, MapPin, Minus, Plus, AlertCircle, CheckCircle2 } from 'lucide-react'
import { type CartItem, generateWhatsAppCartMessage } from '../shops/honeys-fresh-n-frozen/menu'
import { shopConfig } from '../shops/honeys-fresh-n-frozen/config'
import { getWhatsAppLink } from '../lib/phone'
import { distanceKm } from '../lib/distance'

type DeliveryZone = 'unset' | 'inside' | 'outside'

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [mappedAddress, setMappedAddress] = useState('')
  const [flatHouse, setFlatHouse] = useState('')
  const [landmark, setLandmark] = useState('')
  const [userLat, setUserLat] = useState<number | null>(null)
  const [userLng, setUserLng] = useState<number | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [locationStatus, setLocationStatus] = useState('')

  const delivery = shopConfig.delivery
  const radiusKm = delivery.radiusKm

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

  const total = useMemo(() => {
    return cart.reduce((sum, item) => {
      const numeric = parseFloat(item.price.replace('₹', '').replace(',', '').split('/')[0].trim())
      return sum + (isNaN(numeric) ? 0 : numeric * item.cartQuantity)
    }, 0)
  }, [cart])
  const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.cartQuantity, 0), [cart])

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
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, cartQuantity: qty } : i))
  }

  const orderNow = () => {
    if (!name.trim() || !mobile.trim() || cart.length === 0) return
    if (!mappedAddress.trim() || userLat == null || userLng == null || deliveryZone !== 'inside') return
    const phone = shopConfig.contact.phones[0]?.replace(/\D/g, '') || '9419532222'
    const e164 = phone.length === 10 ? `91${phone}` : phone
    const base = generateWhatsAppCartMessage(cart, total)
    const customer =
      `\n\nCustomer Details:\nName: ${name}\nCall this number: ${mobile}\n\n${fullAddressBlock}` +
      `\n\n(Map distance ~${distanceFromRestaurant?.toFixed(1)} km from restaurant)` +
      `\n\nPlease confirm this order.`
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
    name.trim() &&
    mobile.trim() &&
    mappedAddress.trim() &&
    userLat != null &&
    userLng != null &&
    deliveryZone === 'inside'

  /** Short hint on the bar when something’s still missing */
  const barHint = useMemo(() => {
    if (cart.length === 0) return 'Add items'
    if (userLat == null || userLng == null) return 'Location'
    if (deliveryZone === 'outside') return 'Outside zone'
    if (!mappedAddress.trim()) return 'Address'
    if (!name.trim()) return 'Name'
    if (!mobile.trim()) return 'Mobile'
    return 'Place order'
  }, [cart.length, userLat, userLng, deliveryZone, mappedAddress, name, mobile])

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[430px] overflow-x-hidden">
      <main className="min-h-screen w-full max-w-full bg-gradient-to-b from-[#fff8f9] via-[#f8f9fb] to-[#f3f4f7] pb-[calc(5.5rem+env(safe-area-inset-bottom))] pl-[max(0.25rem,env(safe-area-inset-left))] pr-[max(0.25rem,env(safe-area-inset-right))]">
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
              className="mt-3 inline-flex min-h-[44px] items-center rounded-full border border-[#f3b5c0] bg-[#fff3f6] px-4 py-2.5 text-[14px] font-semibold text-[#E23744]"
            >
              + Add more items
            </Link>
          </section>

          <section className="mt-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_12px_24px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-[15px] font-bold text-slate-900">Delivery</h2>
              <span className="text-[11px] font-medium text-slate-500">Within {radiusKm} km</span>
            </div>

            <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50/90 p-3">
              <p className="text-[12px] font-semibold text-slate-800">Location</p>
              <p className="mt-1 text-[12px] leading-snug text-slate-600">
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
                className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#F25269]/35 bg-white text-sm font-semibold text-[#F25269] shadow-sm transition-all hover:bg-rose-50/80 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <MapPin className="h-4 w-4 shrink-0" />
                {isLocating ? 'Getting location…' : 'Use current location'}
              </button>

              {deliveryZone === 'inside' && userLat != null && (
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50 px-3 py-2 text-[12px] text-emerald-900">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  We deliver here.
                </div>
              )}

              {deliveryZone === 'outside' && userLat != null && (
                <div className="mt-2 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[12px] leading-snug text-amber-950">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    Sorry — we don’t deliver here yet (only within {radiusKm} km of our restaurant).
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-[12px] font-semibold text-slate-800">Address</label>
              <textarea
                value={mappedAddress}
                onChange={(e) => setMappedAddress(e.target.value)}
                placeholder="From location, or type your area"
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f6c7cf]"
              />
            </div>

            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="mb-2 text-[12px] font-semibold text-slate-800">Extra details <span className="font-normal text-slate-400">· optional</span></p>
              <div className="grid gap-2">
                <input
                  value={flatHouse}
                  onChange={(e) => setFlatHouse(e.target.value)}
                  placeholder="Flat / floor (optional)"
                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f6c7cf]"
                />
                <input
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="Landmark (optional)"
                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f6c7cf]"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4">
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold text-slate-800">Your name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f6c7cf]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold text-slate-800">Mobile</label>
                <input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Mobile number"
                  inputMode="tel"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f6c7cf]"
                />
              </div>
            </div>

            {locationStatus && <p className="mt-3 text-xs leading-relaxed text-slate-600">{locationStatus}</p>}
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
          onClick={() => {
            if (canPlaceOrder) orderNow()
          }}
          aria-disabled={!canPlaceOrder}
          className={`pointer-events-auto flex h-[60px] w-full max-w-[430px] items-center justify-between rounded-full border border-white/25 bg-[#F25269] px-4 text-white shadow-[0_14px_28px_rgba(226,55,68,0.32)] ${
            canPlaceOrder ? 'cursor-pointer active:scale-[0.99]' : 'cursor-not-allowed'
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
            <span className="max-w-[46%] shrink-0 pl-1 text-right text-[14px] font-bold leading-tight text-white drop-shadow-sm">
              {barHint}
            </span>
        </button>
      </div>
    </div>
  )
}
