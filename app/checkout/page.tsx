'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ChevronDown, MapPin, Minus, Plus, CheckCircle2, PackageCheck, ShoppingBag, X } from 'lucide-react'
import { type CartItem, generateWhatsAppCartMessage } from '../shops/honeys-fresh-n-frozen/menu'
import { shopConfig } from '../shops/honeys-fresh-n-frozen/config'
import { getWhatsAppLink } from '../lib/phone'
import {
  MANGO_CART_KEY,
  MANGO_HANDOFF_TO_CHECKOUT,
  MANGO_CHECKOUT_SESSION,
  readOrderType,
  writeOrderType,
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
const COUPON_CODE = 'BAZAAR10'

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRadians = (value: number) => (value * Math.PI) / 180
  const earthRadiusKm = 6371
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function digitsOnly(s: string) {
  return s.replace(/\D/g, '')
}

function locationAddressText(address: string | undefined, latitude: number, longitude: number) {
  const cleanAddress = address?.trim()
  if (cleanAddress) return cleanAddress
  return `GPS location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
}

function mapsUrlForCoords(latitude: number, longitude: number) {
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
}

function getBrowserPosition(options: PositionOptions) {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  })
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
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponMessage, setCouponMessage] = useState('')
  const [mappedAddress, setMappedAddress] = useState('')
  const [mappedMapUrl, setMappedMapUrl] = useState('')
  const [flatHouse, setFlatHouse] = useState('')
  const [landmark, setLandmark] = useState('')
  const [userLat, setUserLat] = useState<number | null>(null)
  const [userLng, setUserLng] = useState<number | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [locationStatus, setLocationStatus] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const [showOrderTypeMenu, setShowOrderTypeMenu] = useState(false)
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
    const km = distanceKm(userLat, userLng, shopConfig.delivery.restaurantLat, shopConfig.delivery.restaurantLng)
    return km <= shopConfig.delivery.radiusKm ? 'inside' : 'outside'
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
  const couponDiscount = useMemo(
    () => (appliedCoupon === COUPON_CODE ? Math.min(Math.round(total * 0.1), 150) : 0),
    [appliedCoupon, total]
  )
  const payableTotal = Math.max(0, total - couponDiscount)

  const applyCoupon = () => {
    const normalized = couponInput.trim().toUpperCase()
    if (normalized === COUPON_CODE) {
      setAppliedCoupon(COUPON_CODE)
      setCouponInput(COUPON_CODE)
      setCouponMessage('Coupon applied — 10% off, up to ₹150.')
      return
    }
    setAppliedCoupon(null)
    setCouponMessage('This coupon code is not valid.')
  }

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
Menu total: ₹${payableTotal}
${appliedCoupon ? `Coupon: ${appliedCoupon} (-₹${couponDiscount})` : 'Coupon: N/A'}
Notes: ${orderNotes.trim() || 'N/A'}

Please confirm my order.`
      : `Hi Burger Bazaar, I want to place a Takeaway order.

Name: ${customerName.trim()}
Phone: +91 ${mobileDigits}
Pickup Time: ${pickupDisplayTime}
Order Items:
${orderItems}
Menu total: ₹${payableTotal}
${appliedCoupon ? `Coupon: ${appliedCoupon} (-₹${couponDiscount})` : 'Coupon: N/A'}
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
      `\n\nSubtotal: ₹${total}` +
      (appliedCoupon ? `\nCoupon: ${appliedCoupon}\nDiscount: -₹${couponDiscount}` : '') +
      `\nTotal payable: ₹${payableTotal}.`
    window.open(getWhatsAppLink(e164, `${base}${customer}`), '_blank')
    clearCheckoutSession()
    setCart([])
  }

  const useCurrentLocation = async () => {
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
    setLocationStatus('Finding your GPS pin…')

    try {
      let position: GeolocationPosition
      try {
        position = await getBrowserPosition({ enableHighAccuracy: false, timeout: 9000, maximumAge: 300000 })
      } catch (firstError) {
        const error = firstError as GeolocationPositionError
        if (error.code === error.PERMISSION_DENIED) throw error
        setLocationStatus('Getting a more accurate GPS fix…')
        position = await getBrowserPosition({ enableHighAccuracy: true, timeout: 16000, maximumAge: 0 })
      }

      const { latitude, longitude, accuracy } = position.coords
      const mapUrl = mapsUrlForCoords(latitude, longitude)
      const km = distanceKm(latitude, longitude, shopConfig.delivery.restaurantLat, shopConfig.delivery.restaurantLng)

      // Save the GPS pin immediately. Reverse geocoding is an optional enhancement
      // and must never make a valid phone location look like a failure.
      setUserLat(latitude)
      setUserLng(longitude)
      setMappedAddress(locationAddressText(undefined, latitude, longitude))
      setMappedMapUrl(mapUrl)
      setLocationStatus(
        km <= shopConfig.delivery.radiusKm
          ? `Location saved — ${km.toFixed(1)} km away, within our delivery radius${Number.isFinite(accuracy) ? ` (GPS accuracy ~${Math.round(accuracy)} m)` : ''}.`
          : `Location saved — ${km.toFixed(1)} km away, outside our ${shopConfig.delivery.radiusKm} km delivery radius.`
      )

      try {
        const controller = new AbortController()
        const timeout = window.setTimeout(() => controller.abort(), 7000)
        const response = await fetch(`/api/current-location?lat=${latitude}&lng=${longitude}`, {
          cache: 'no-store',
          signal: controller.signal,
        })
        window.clearTimeout(timeout)
        if (response.ok) {
          const data = await response.json()
          if (typeof data?.address === 'string' && data.address.trim()) setMappedAddress(data.address.trim())
          if (typeof data?.mapUrl === 'string' && data.mapUrl.trim()) setMappedMapUrl(data.mapUrl.trim())
        }
      } catch {
        // GPS coordinates and map link are already saved above.
      }
    } catch (positionError) {
      const error = positionError as GeolocationPositionError
      if (error.code === error.PERMISSION_DENIED) {
        setLocationStatus('Location permission is blocked. Allow location for this site in browser settings, then try again.')
        setToast('Allow location access in browser or phone settings, then tap “Use current location” again.')
      } else if (error.code === error.TIMEOUT) {
        setLocationStatus('GPS timed out. Turn on phone Location, move near a window, and try again.')
      } else {
        setLocationStatus('GPS is unavailable right now. Turn on phone Location and try again, or enter your address manually.')
      }
    } finally {
      setIsLocating(false)
    }
  }

  const canPlaceOrder =
    orderWindow.isOpen &&
    (isOnlineOrder
      ? cart.length > 0 &&
        mobileDigits.length === MOBILE_DIGITS &&
        mappedAddress.trim() &&
        deliveryZone === 'inside'
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
    if (userLat == null || userLng == null) return 'Tap “Use current location” to verify the 5 km delivery radius.'
    if (deliveryZone === 'outside') return 'This location is outside Burger Bazaar’s 5 km delivery radius.'
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

  const changeOrderType = (nextOrderType: 'online' | 'takeaway') => {
    setOrderType(nextOrderType)
    writeOrderType(nextOrderType)
    setShowOrderTypeMenu(false)
    setToast(null)
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
              className="shrink-0 rounded-lg bg-[#FBE8E8] p-1.5 text-[#D12325] hover:bg-white"
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
                        <div className="inline-flex h-11 items-center rounded-[14px] border border-[#D12325]/25 bg-[#FFF9F5] p-1">
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, item.cartQuantity - 1)}
                            className="flex h-8 w-9 touch-manipulation items-center justify-center rounded-[10px] bg-[#FBE8E8] text-[#D12325] active:opacity-70"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-extrabold text-[#D12325]">{item.cartQuantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, item.cartQuantity + 1)}
                            className="flex h-8 w-9 touch-manipulation items-center justify-center rounded-[10px] bg-[#D12325] text-white active:opacity-70"
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

          {isOnlineOrder ? (
          <section className="mt-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_12px_24px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-[15px] font-bold text-slate-900">Delivery</h2>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <span className="rounded-full bg-[#FBE8E8] px-2.5 py-0.5 text-[11px] font-semibold text-[#991B1E]">5 km delivery radius</span>
                <button type="button" onClick={() => setShowOrderTypeMenu(true)} className="text-[12px] font-semibold text-[#D12325]">
                  Change Order Type
                </button>
              </div>
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
                  <span>Inside the {shopConfig.delivery.radiusKm} km delivery radius</span>
                </div>
              )}
              {deliveryZone === 'outside' && userLat != null && (
                <div className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-center text-[11px] font-semibold text-red-800">
                  Outside the {shopConfig.delivery.radiusKm} km delivery radius
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
            {mappedMapUrl && userLat != null && userLng != null && (
              <a
                href={mappedMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2.5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#D12325]/25 bg-[#FFF9F5] px-3 text-[12px] font-extrabold text-[#D12325] active:bg-[#FBE8E8]"
              >
                <MapPin className="h-4 w-4" />
                Open detected location in Google Maps
              </a>
            )}
          </section>
          ) : (
          <section className="mt-3 w-full min-w-0 max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 sm:p-4 shadow-[0_12px_24px_rgba(15,23,42,0.06)]">
            <div className="flex min-w-0 items-start justify-between gap-2">
              <h2 className="min-w-0 text-[15px] font-bold text-slate-900">
                {isDineInOrder ? 'Dine In Details' : 'Takeaway Details'}
              </h2>
              <button type="button" onClick={() => setShowOrderTypeMenu(true)} className="shrink-0 text-right text-[12px] font-semibold leading-tight text-[#D12325]">
                Change Order Type
              </button>
            </div>

            <div className="mt-3 grid w-full min-w-0 max-w-full gap-3">
              <div className="min-w-0 max-w-full">
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

              <div ref={mobileBlockRef} className="min-w-0 max-w-full">
                <label htmlFor="checkout-mobile" className="mb-1 block text-[12px] font-semibold text-slate-800">
                  Phone
                </label>
                <div className="flex h-11 w-full min-w-0 max-w-full items-stretch overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm focus-within:border-slate-300 focus-within:ring-2 focus-within:ring-slate-300/80">
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
                  <div className="min-w-0 max-w-full">
                    <label htmlFor="arrival-time" className="mb-1 block text-[12px] font-semibold text-slate-800">
                      Arrival Time
                    </label>
                    <div className="relative w-full min-w-0 max-w-full">
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
                  <div className="min-w-0 max-w-full">
                    <label htmlFor="pickup-time" className="mb-1 block text-[12px] font-semibold text-slate-800">
                      Pickup Time
                    </label>
                    <div className="relative w-full min-w-0 max-w-full">
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
                className={`w-full min-w-0 max-w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300/80 ${fieldText}`}
              />
            </div>
          </section>
          )}

          <section className="mt-3 rounded-3xl border border-[#D12325]/20 bg-[#FFF9F5] p-4 shadow-[0_12px_24px_rgba(209,35,37,0.07)]">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[14px] font-extrabold text-slate-900">Apply coupon</p>
                <p className="text-[11px] font-semibold text-[#D12325]">BAZAAR10 · 10% off up to ₹150</p>
              </div>
              {appliedCoupon && <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-extrabold text-emerald-700">APPLIED</span>}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                className="h-11 min-w-0 flex-1 rounded-xl border border-[#E8D7D2] bg-white px-3 text-[14px] font-bold uppercase tracking-wide text-slate-900 outline-none focus:border-[#D12325]"
              />
              <button type="button" onClick={applyCoupon} className="h-11 shrink-0 rounded-xl bg-[#151515] px-4 text-[12px] font-extrabold text-white active:scale-[0.98]">
                Apply
              </button>
            </div>
            {couponMessage && <p className={`mt-2 text-[11px] font-semibold ${appliedCoupon ? 'text-emerald-700' : 'text-[#D12325]'}`}>{couponMessage}</p>}
            {couponDiscount > 0 && (
              <div className="mt-3 flex items-center justify-between border-t border-[#E8D7D2] pt-3 text-[12px] font-bold">
                <span className="text-slate-500">You save</span>
                <span className="text-emerald-700">-₹{couponDiscount}</span>
              </div>
            )}
          </section>
        </div>
      </main>

      <AnimatePresence>
        {showOrderTypeMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10020] flex items-end justify-center bg-black/55 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-[2px]"
            onClick={() => setShowOrderTypeMenu(false)}
          >
            <motion.div
              initial={{ y: 48, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 48, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 430, damping: 34 }}
              className="w-full max-w-[406px] rounded-[28px] border border-[#E8D7D2] bg-[#FFF9F5] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.34)]"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="checkout-order-type-title"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p id="checkout-order-type-title" className="text-[18px] font-black tracking-tight text-[#151515]">Change Order Type</p>
                  <p className="mt-0.5 text-[12px] font-medium text-slate-500">How would you like your Burger Bazaar order?</p>
                </div>
                <button type="button" onClick={() => setShowOrderTypeMenu(false)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E8D7D2] bg-white text-[#D12325]" aria-label="Close order type menu">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => changeOrderType('online')}
                  className={`flex min-h-[104px] min-w-0 flex-col items-start justify-between rounded-2xl border p-3.5 text-left transition active:scale-[0.98] ${isOnlineOrder ? 'border-[#D12325] bg-[#D12325] text-white shadow-[0_12px_26px_rgba(209,35,37,0.24)]' : 'border-[#E8D7D2] bg-white text-[#151515]'}`}
                >
                  <ShoppingBag className="h-6 w-6" />
                  <span>
                    <span className="block text-[14px] font-extrabold">Order Online</span>
                    <span className={`mt-0.5 block text-[10px] font-semibold ${isOnlineOrder ? 'text-white/80' : 'text-slate-500'}`}>Delivered to you</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => changeOrderType('takeaway')}
                  className={`flex min-h-[104px] min-w-0 flex-col items-start justify-between rounded-2xl border p-3.5 text-left transition active:scale-[0.98] ${isTakeawayOrder ? 'border-[#D12325] bg-[#D12325] text-white shadow-[0_12px_26px_rgba(209,35,37,0.24)]' : 'border-[#E8D7D2] bg-white text-[#151515]'}`}
                >
                  <PackageCheck className="h-6 w-6" />
                  <span>
                    <span className="block text-[14px] font-extrabold">Takeaway</span>
                    <span className={`mt-0.5 block text-[10px] font-semibold ${isTakeawayOrder ? 'text-white/80' : 'text-slate-500'}`}>Collect from us</span>
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                  src="/burger-bazaar-menu-smash.jpeg"
                  alt=""
                  width={28}
                  height={28}
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="h-7 w-7 overflow-hidden rounded-full border border-white/80 bg-white">
                <Image
                  src="/burger-bazaar-menu-fries.jpeg"
                  alt=""
                  width={28}
                  height={28}
                  className="h-full w-full object-cover"
                />
              </span>
            </span>
            <span className="min-w-0 text-left text-[16px] font-semibold leading-tight text-white drop-shadow-sm">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} · ₹{payableTotal}
            </span>
          </span>
          <span className="shrink-0 pl-1 text-right leading-tight">
            <span className="block text-[15px] font-bold text-white">Place order</span>
            <span className="mt-0.5 block text-[11px] font-medium text-white/90">
              Send on WhatsApp
            </span>
          </span>
        </button>
      </div>
    </div>
  )
}
