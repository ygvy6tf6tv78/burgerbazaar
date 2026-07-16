'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ChevronDown, MapPin, Minus, Plus, CheckCircle2, X } from 'lucide-react'
import { type CartItem, generateWhatsAppCartMessage } from '../shops/honeys-fresh-n-frozen/menu'
import { shopConfig } from '../shops/honeys-fresh-n-frozen/config'
import { getWhatsAppLink } from '../lib/phone'
import {
  MANGO_CART_KEY,
  MANGO_HANDOFF_TO_CHECKOUT,
  MANGO_CHECKOUT_SESSION,
  readOrderType,
  clearCheckoutSession,
  writeHandoffToMenuFromCheckout,
  type MangoOrderType,
} from '../lib/cart-session'
import { getOrderWindowState, type OrderWindowState } from '../lib/order-hours'

type DeliveryZone = 'unset' | 'inside' | 'outside'
type TimeOption = '15 minutes' | '30 minutes' | '45 minutes' | '1 hour' | 'Custom time'

const dineInArrivalOptions: TimeOption[] = ['15 minutes', '30 minutes', '45 minutes', '1 hour', 'Custom time']
const takeawayPickupOptions = ['10 minutes', '15 minutes', '20 minutes', '30 minutes', '45 minutes', 'Custom time']
const MOBILE_DIGITS = 10

function digitsOnly(s: string) {
  return s.replace(/\D/g, '')
}

function locationAddressText(address: string | undefined, mapUrl: string | undefined) {
  const cleanAddress = address?.trim()
  const cleanMapUrl = mapUrl?.trim()
  if (cleanAddress) return cleanAddress
  if (cleanMapUrl) return 'Pinned location from phone GPS. Please add house, area and landmark details.'
  return 'Pinned location from phone GPS. Please add house, area and landmark details.'
}

function mapsUrlForCoords(latitude: number, longitude: number) {
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
}

/** 16px on inputs stops iOS zoom-on-focus; keep compact h-11 like original layout */
const fieldText = 'text-[16px] leading-snug'

export default function CheckoutPage() {
  const [checkoutStorageReady, setCheckoutStorageReady] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [orderType, setOrderType] = useState<MangoOrderType>('online')
  const [mobile, setMobile] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [arrivalTime, setArrivalTime] = useState('15 minutes')
  const [arrivalCustomTime, setArrivalCustomTime] = useState('')
  const [preferredSeating, setPreferredSeating] = useState('')
  const [pickupTime, setPickupTime] = useState('10 minutes')
  const [pickupCustomTime, setPickupCustomTime] = useState('')
  const [orderNotes, setOrderNotes] = useState('')
  const [mappedAddress, setMappedAddress] = useState('')
  const [mappedMapUrl, setMappedMapUrl] = useState('')
  const [flatHouse, setFlatHouse] = useState('')
  const [landmark, setLandmark] = useState('')
  const [userLat, setUserLat] = useState<number | null>(null)
  const [userLng, setUserLng] = useState<number | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [locationStatus, setLocationStatus] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const [orderWindow, setOrderWindow] = useState<OrderWindowState>(() => getOrderWindowState())

  const locationBlockRef = useRef<HTMLDivElement>(null)
  const addressRef = useRef<HTMLTextAreaElement>(null)
  const mobileBlockRef = useRef<HTMLDivElement>(null)

  const isOnlineOrder = orderType === 'online'
  const isDineInOrder = orderType === 'dine-in'
  const isTakeawayOrder = orderType === 'takeaway'
  const orderHeading =
    isDineInOrder ? 'Dine In Checkout' : isTakeawayOrder ? 'Takeaway Checkout' : 'Checkout'
  const menuOrderHref =
    orderType === 'online' ? '/menu?mode=order' : `/menu?mode=order&type=${orderType}`

  const deliveryZone: DeliveryZone = useMemo(() => {
    if (userLat == null || userLng == null) return 'unset'
    return 'inside'
  }, [userLat, userLng])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handoff = window.sessionStorage.getItem(MANGO_HANDOFF_TO_CHECKOUT) === '1'
    window.sessionStorage.removeItem(MANGO_HANDOFF_TO_CHECKOUT)
    const sessionActive = window.sessionStorage.getItem(MANGO_CHECKOUT_SESSION) === '1'
    const raw = window.sessionStorage.getItem(MANGO_CART_KEY)
    setOrderType(readOrderType())

    let next: CartItem[] = []
    if (handoff || sessionActive || raw) {
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as CartItem[]
          if (Array.isArray(parsed)) next = parsed
        } catch {
          next = []
        }
      }
      window.sessionStorage.setItem(MANGO_CHECKOUT_SESSION, '1')
    } else {
      window.sessionStorage.removeItem(MANGO_CART_KEY)
      window.sessionStorage.removeItem(MANGO_CHECKOUT_SESSION)
    }
    setCart(next)
    setCheckoutStorageReady(true)
  }, [])

  useEffect(() => {
    setOrderWindow(getOrderWindowState())
    const interval = window.setInterval(() => setOrderWindow(getOrderWindowState()), 60000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !checkoutStorageReady) return
    window.sessionStorage.setItem(MANGO_CART_KEY, JSON.stringify(cart))
    window.sessionStorage.setItem(MANGO_CHECKOUT_SESSION, '1')
  }, [cart, checkoutStorageReady])

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
  const payableTotal = total

  const mobileDigits = useMemo(() => digitsOnly(mobile).slice(0, MOBILE_DIGITS), [mobile])
  const arrivalDisplayTime = arrivalTime === 'Custom time' ? arrivalCustomTime.trim() : arrivalTime
  const pickupDisplayTime = pickupTime === 'Custom time' ? pickupCustomTime.trim() : pickupTime

  const fullAddressBlock = useMemo(() => {
    const lines: string[] = []
    if (mappedAddress.trim()) lines.push(`Delivery address: ${mappedAddress.trim()}`)
    if (mappedMapUrl.trim()) lines.push(`Google Maps: ${mappedMapUrl.trim()}`)
    if (flatHouse.trim()) lines.push(`Flat / house / floor: ${flatHouse.trim()}`)
    if (landmark.trim()) lines.push(`Nearby landmark: ${landmark.trim()}`)
    return lines.join('\n')
  }, [mappedAddress, mappedMapUrl, flatHouse, landmark])

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.id !== id))
      return
    }
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, cartQuantity: qty } : i)))
  }

  const formatOrderItems = () =>
    cart
      .map((item) => {
        const unitPrice = parseFloat(item.price.replace('₹', '').replace(',', '').split('/')[0].trim())
        const priceLine = isNaN(unitPrice) ? 'Live price to be confirmed' : `₹${(unitPrice * item.cartQuantity).toFixed(0)}`
        return `• ${item.name}\n  Quantity: ${item.cartQuantity} · ${priceLine}`
      })
      .join('\n\n')

  const placeDineInOrTakeawayOrder = () => {
    if (cart.length === 0) return
    if (!customerName.trim() || mobileDigits.length < MOBILE_DIGITS) return
    if (isDineInOrder && !arrivalDisplayTime) return
    if (isTakeawayOrder && !pickupDisplayTime) return

    const phone = shopConfig.contact.phones[0]?.replace(/\D/g, '') || '9266855210'
    const e164 = phone.length === 10 ? `91${phone}` : phone
    const orderItems = formatOrderItems()
    const message = isDineInOrder
      ? `Hi Burger Bazaar, I want to place a Dine In pre-order.

Name: ${customerName.trim()}
Phone: +91 ${mobileDigits}
Arrival Time: ${arrivalDisplayTime}
Preferred Seating: ${preferredSeating.trim() || 'N/A'}
Order Items:
${orderItems}
Final price: Please confirm
Notes: ${orderNotes.trim() || 'N/A'}

Please confirm my order.`
      : `Hi Burger Bazaar, I want to place a Takeaway order.

Name: ${customerName.trim()}
Phone: +91 ${mobileDigits}
Pickup Time: ${pickupDisplayTime}
Order Items:
${orderItems}
Final price: Please confirm
Notes: ${orderNotes.trim() || 'N/A'}

Please confirm my order.`

    window.open(getWhatsAppLink(e164, message), '_blank')
    clearCheckoutSession()
    setCart([])
  }

  const orderNow = () => {
    if (cart.length === 0) return
    if (!mappedAddress.trim()) return
    if (mobileDigits.length < MOBILE_DIGITS) return
    const phone = shopConfig.contact.phones[0]?.replace(/\D/g, '') || '9266855210'
    const e164 = phone.length === 10 ? `91${phone}` : phone
    const base = generateWhatsAppCartMessage(cart, payableTotal)
    const customer =
      `\n\nCustomer Details:\nCall this number: +91 ${mobileDigits}\n\n${fullAddressBlock}` +
      `\n\nPlease confirm delivery availability and the final price for this order.`
    window.open(getWhatsAppLink(e164, `${base}${customer}`), '_blank')
    clearCheckoutSession()
    setCart([])
  }

  const useCurrentLocation = () => {
    if (typeof window === 'undefined') return

    if (!window.isSecureContext) {
      setLocationStatus(
        'Location requires HTTPS. You can type your delivery address below when GPS is unavailable.'
      )
      return
    }

    if (!navigator.geolocation) {
      setLocationStatus('Location is not available in this browser. Please try again in Chrome or Safari.')
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
          if (data?.address || data?.mapUrl) {
            setMappedAddress(locationAddressText(data?.address, data?.mapUrl))
            setMappedMapUrl(typeof data?.mapUrl === 'string' ? data.mapUrl : mapsUrlForCoords(latitude, longitude))
            setLocationStatus('Location saved. Burger Bazaar will confirm delivery availability on WhatsApp.')
          } else {
            setMappedAddress(locationAddressText(undefined, mapsUrlForCoords(latitude, longitude)))
            setMappedMapUrl(mapsUrlForCoords(latitude, longitude))
            setLocationStatus('Location saved. Add your complete address below.')
          }
        } catch {
          setLocationStatus('Could not load full address — GPS pin is still saved.')
          const { latitude, longitude } = position.coords
          setMappedAddress(locationAddressText(undefined, mapsUrlForCoords(latitude, longitude)))
          setMappedMapUrl(mapsUrlForCoords(latitude, longitude))
        } finally {
          setIsLocating(false)
        }
      },
      (err: GeolocationPositionError) => {
        setIsLocating(false)
        if (err.code === err.PERMISSION_DENIED) {
          setLocationStatus(
            'Location permission is off. Open browser settings, allow location for this site, then tap “Use current location” again.'
          )
          setToast(
            'Location is blocked. Allow location in browser or phone settings, then tap the button again.'
          )
        } else if (err.code === err.TIMEOUT) {
          setLocationStatus(
            'Location timed out. Please check that GPS is on and tap the button again.'
          )
        } else {
          setLocationStatus(
            'Location could not be detected. Please turn on location services and try again.'
          )
        }
      },
      { enableHighAccuracy: true, timeout: 22000, maximumAge: 120000 }
    )
  }

  const canPlaceOrder =
    orderWindow.isOpen &&
    (isOnlineOrder
      ? cart.length > 0 &&
        mobileDigits.length === MOBILE_DIGITS &&
        mappedAddress.trim()
      : cart.length > 0 &&
        customerName.trim().length > 1 &&
        mobileDigits.length === MOBILE_DIGITS &&
        (isDineInOrder ? Boolean(arrivalDisplayTime) : Boolean(pickupDisplayTime)))

  const validationMessage = (): string | null => {
    if (cart.length === 0) return 'Your cart is empty — add items from the menu first.'
    if (!orderWindow.isOpen) return `${orderWindow.message} Window: ${orderWindow.label}.`
    if (!isOnlineOrder) {
      if (customerName.trim().length < 2) return 'Enter your name.'
      if (mobileDigits.length < MOBILE_DIGITS) return 'Enter your 10-digit mobile number.'
      if (isDineInOrder && !arrivalDisplayTime) return 'Select arrival time.'
      if (isTakeawayOrder && !pickupDisplayTime) return 'Select pickup time.'
      return null
    }
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
      if (!isOnlineOrder) {
        if (mobileDigits.length < MOBILE_DIGITS) scrollFieldIntoView(mobileBlockRef.current)
      } else if (!mappedAddress.trim()) scrollFieldIntoView(addressRef.current)
      else if (mobileDigits.length < MOBILE_DIGITS) scrollFieldIntoView(mobileBlockRef.current)
      return
    }
    if (isOnlineOrder) orderNow()
    else placeDineInOrTakeawayOrder()
  }

  const focusScroll = (el: HTMLElement) => {
    el.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[430px] overflow-x-hidden bg-[#151515]">
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
              href={menuOrderHref}
              onClick={() => clearCheckoutSession()}
              className="-ml-1 inline-flex min-h-[48px] min-w-[48px] touch-manipulation items-center gap-2 rounded-xl px-2 py-2 text-[15px] font-semibold text-slate-800 hover:bg-slate-50 active:bg-slate-100"
            >
              <ArrowLeft className="h-5 w-5 shrink-0" strokeWidth={2.25} aria-hidden />
              <span>Back</span>
            </Link>
            <p className="mt-1 text-lg font-extrabold tracking-tight text-slate-900">{orderHeading}</p>
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
                        <div className="inline-flex h-9 items-center rounded-xl border border-[#E8D7D2] bg-[#FFF9F5] px-2">
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, item.cartQuantity - 1)}
                            className="flex h-5 w-5 touch-manipulation items-center justify-center rounded-full text-[#D12325] active:opacity-70"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-7 text-center text-sm font-bold text-[#D12325]">{item.cartQuantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, item.cartQuantity + 1)}
                            className="flex h-5 w-5 touch-manipulation items-center justify-center rounded-full text-[#D12325] active:opacity-70"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="mt-1 text-sm font-semibold text-slate-800">{isNaN(unitPrice) ? 'Live price' : `₹${lineTotal.toFixed(0)}`}</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            <Link
              href={menuOrderHref}
              onClick={() => writeHandoffToMenuFromCheckout(cart, orderType)}
              className="mt-2.5 inline-flex touch-manipulation items-center rounded-full border border-[#E8D7D2] bg-[#FFF9F5] px-3 py-1.5 text-[13px] font-semibold leading-none text-[#D12325] active:scale-[0.98]"
            >
              + Add more items
            </Link>
          </section>

          <section
            className={`mt-3 rounded-3xl border p-3.5 text-[12px] font-semibold leading-snug shadow-[0_12px_24px_rgba(15,23,42,0.05)] ${
              orderWindow.isOpen
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-amber-200 bg-amber-50 text-amber-900'
            }`}
          >
            {orderWindow.message} Window: {orderWindow.label}.
          </section>

          {isOnlineOrder ? (
          <section className="mt-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_12px_24px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-[15px] font-bold text-slate-900">Delivery</h2>
              <span className="rounded-full bg-[#FBE8E8] px-2.5 py-0.5 text-[11px] font-semibold text-[#991B1E]">Confirm on WhatsApp</span>
            </div>

            <div ref={locationBlockRef} className="mt-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 p-2.5">
              <p className="text-[12px] font-semibold text-slate-800">Location</p>
              <p className="mt-0.5 text-[11px] leading-snug text-slate-600">
                {userLat != null && userLng != null ? (
                  <>
                    Saved
                  </>
                ) : (
                  <span>Tap the button below.</span>
                )}
              </p>

              <button
                type="button"
                onClick={useCurrentLocation}
                disabled={isLocating}
                className="relative z-10 mt-2 flex min-h-[52px] w-full min-w-0 touch-manipulation items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 shadow-sm transition-all hover:bg-slate-50 active:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <MapPin className="h-4 w-4 shrink-0 text-slate-600" />
                <span className="truncate">{isLocating ? 'Getting location…' : 'Use current location'}</span>
              </button>

              {deliveryZone === 'inside' && userLat != null && (
                <div className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-emerald-200/90 bg-gradient-to-b from-emerald-50 to-emerald-100/80 px-3 py-2 text-center text-[11px] font-medium text-emerald-900 shadow-sm">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  <span>Location saved</span>
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
          ) : (
          <section className="mt-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_12px_24px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-[15px] font-bold text-slate-900">
                {isDineInOrder ? 'Dine In Details' : 'Takeaway Details'}
              </h2>
              <Link href="/order" className="text-[12px] font-semibold text-[#D12325]">
                Change Order Type
              </Link>
            </div>

            <div className="mt-3 grid gap-3">
              <div>
                <label htmlFor="customer-name" className="mb-1 block text-[12px] font-semibold text-slate-800">
                  Name
                </label>
                <input
                  id="customer-name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  onFocus={(e) => focusScroll(e.target)}
                  placeholder="Your name"
                  className={`h-11 min-w-0 w-full rounded-xl border border-slate-200 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300/80 ${fieldText}`}
                />
              </div>

              <div ref={mobileBlockRef}>
                <label htmlFor="checkout-mobile" className="mb-1 block text-[12px] font-semibold text-slate-800">
                  Phone
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

              {isDineInOrder ? (
                <>
                  <div>
                    <label htmlFor="arrival-time" className="mb-1 block text-[12px] font-semibold text-slate-800">
                      Arrival Time
                    </label>
                    <div className="relative">
                      <select
                        id="arrival-time"
                        value={arrivalTime}
                        onChange={(e) => setArrivalTime(e.target.value)}
                        className={`h-11 min-w-0 w-full appearance-none rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 px-3 pr-10 font-semibold text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300/80 ${fieldText}`}
                      >
                        {dineInArrivalOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    </div>
                  </div>
                  {arrivalTime === 'Custom time' && (
                    <input
                      value={arrivalCustomTime}
                      onChange={(e) => setArrivalCustomTime(e.target.value)}
                      onFocus={(e) => focusScroll(e.target)}
                      placeholder="Enter arrival time"
                      className={`h-11 min-w-0 w-full rounded-xl border border-slate-200 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300/80 ${fieldText}`}
                    />
                  )}
                  <input
                    value={preferredSeating}
                    onChange={(e) => setPreferredSeating(e.target.value)}
                    onFocus={(e) => focusScroll(e.target)}
                    placeholder="Preferred seating / table (optional)"
                    className={`h-11 min-w-0 w-full rounded-xl border border-slate-200 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300/80 ${fieldText}`}
                  />
                </>
              ) : (
                <>
                  <div>
                    <label htmlFor="pickup-time" className="mb-1 block text-[12px] font-semibold text-slate-800">
                      Pickup Time
                    </label>
                    <div className="relative">
                      <select
                        id="pickup-time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className={`h-11 min-w-0 w-full appearance-none rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 px-3 pr-10 font-semibold text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300/80 ${fieldText}`}
                      >
                        {takeawayPickupOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    </div>
                  </div>
                  {pickupTime === 'Custom time' && (
                    <input
                      value={pickupCustomTime}
                      onChange={(e) => setPickupCustomTime(e.target.value)}
                      onFocus={(e) => focusScroll(e.target)}
                      placeholder="Enter pickup time"
                      className={`h-11 min-w-0 w-full rounded-xl border border-slate-200 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300/80 ${fieldText}`}
                    />
                  )}
                </>
              )}

              <textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                onFocus={(e) => focusScroll(e.target)}
                placeholder="Notes (optional)"
                rows={3}
                className={`w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300/80 ${fieldText}`}
              />
            </div>
          </section>
          )}
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
          className={`pointer-events-auto flex min-h-[60px] w-full max-w-[430px] touch-manipulation items-center justify-between rounded-full border border-white/20 bg-[#D12325] px-4 py-2 text-white shadow-[0_14px_28px_rgba(209,35,37,0.30)] active:bg-[#991B1E] ${
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
              {totalItems} {totalItems === 1 ? 'item' : 'items'} · Live price
            </span>
          </span>
          <span className="shrink-0 pl-1 text-right leading-tight">
            <span className="block text-[15px] font-bold text-white">Place order</span>
            <span className="mt-0.5 block text-[11px] font-medium text-white/90">
              {isOnlineOrder ? 'Pay by UPI' : 'Send on WhatsApp'}
            </span>
          </span>
        </button>
      </div>
    </div>
  )
}
