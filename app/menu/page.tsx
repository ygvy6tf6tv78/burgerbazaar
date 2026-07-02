'use client'

import { useState, useEffect, Suspense, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, Moon, Sun, ChevronsLeftRight, BookOpenText, Plus, Minus, Check, List, X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { menuCategories, type CartItem, type MenuItem } from '../shops/honeys-fresh-n-frozen/menu'
import { shopConfig } from '../shops/honeys-fresh-n-frozen/config'
import { getWhatsAppLink } from '../lib/phone'
import {
  MANGO_CART_KEY,
  MANGO_HANDOFF_TO_MENU,
  MANGO_CHECKOUT_SESSION,
  writeHandoffToCheckout,
  writeOrderType,
  type MangoOrderType,
} from '../lib/cart-session'
import { getOrderWindowState, type OrderWindowState } from '../lib/order-hours'

type MenuCategoryKey = keyof typeof menuCategories

const categoryKeys: MenuCategoryKey[] = [
  'sandwichSalad',
  'momos',
  'burgerPizza',
  'pastaMaggiFries',
  'healthyDrinks',
  'wraps',
  'mojitosSmoothies',
  'shakesIceCream',
  'starters',
  'hotBeverages',
  'riceNoodlesSoups',
  'combos',
  'mainCourse',
  'thali',
  'desserts',
  'icedCoffee',
  'shakes',
  'coolers',
  'signatureDrinks',
  'healthyBlends',
  'icedTea',
  'teaKehwa',
]

// PDF menu in public – opens in phone preview / browser
const MENU_PDF_URL = '/sonnet-menu.pdf'
const defaultOrderMessage = "Hi The Sonnet Cafe, I'd like to order from the menu. Please share today's fresh availability."

/** Document scroll — same pattern as /reviews (no nested 100dvh scroller; avoids mobile “half cut” viewport). */
function scrollElementTopOnPage(element: HTMLElement, paddingTop = 8, behavior: ScrollBehavior = 'auto') {
  const eRect = element.getBoundingClientRect()
  const y = window.scrollY + eRect.top - paddingTop
  const top = Math.max(0, y)
  if (!Number.isFinite(top)) return
  window.scrollTo({ top, behavior })
}

function MenuPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const catParam = searchParams.get('cat') as MenuCategoryKey | null
  const mode = searchParams.get('mode')
  const typeParam = searchParams.get('type')
  const isOrderMode = mode === 'order'
  const orderType: MangoOrderType =
    typeParam === 'dine-in' || typeParam === 'takeaway' ? typeParam : 'online'
  const orderTitle =
    orderType === 'dine-in' ? 'Dine In Order' : orderType === 'takeaway' ? 'Takeaway Order' : 'Order Online'
  const initialCat = (catParam && categoryKeys.includes(catParam)) ? catParam : categoryKeys[0]
  const [activeCategory, setActiveCategory] = useState<MenuCategoryKey>(initialCat)
  const [isLightMode, setIsLightMode] = useState(true)
  const [showSlideHint, setShowSlideHint] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartStorageReady, setCartStorageReady] = useState(false)
  const [lastAddedItemId, setLastAddedItemId] = useState<string | null>(null)
  const [cartBarPulse, setCartBarPulse] = useState(false)
  const [showCategoryMenu, setShowCategoryMenu] = useState(false)
  const [expandedOrderCategory, setExpandedOrderCategory] = useState<MenuCategoryKey | null>(initialCat)
  const [activeFilter, setActiveFilter] = useState<'all' | 'under150' | 'under300' | 'quickBites' | 'meals' | 'drinks' | 'desserts' | 'combos'>('all')
  const [orderWindow, setOrderWindow] = useState<OrderWindowState>(() => getOrderWindowState())
  const categoryScrollerRef = useRef<HTMLDivElement | null>(null)
  const categoryRefs = useRef<Partial<Record<MenuCategoryKey, HTMLButtonElement | null>>>({})
  const orderSectionRefs = useRef<Partial<Record<MenuCategoryKey, HTMLElement | null>>>({})
  /** Accordion header row — scroll target so the category title bar lands under the header, not the section bottom. */
  const orderHeaderRefs = useRef<Partial<Record<MenuCategoryKey, HTMLButtonElement | null>>>({})
  const pendingOrderCategoryJump = useRef<MenuCategoryKey | null>(null)
  /** Only scroll order-mode category pills after first paint (skip land / enter). */
  const skipInitialOrderCategoryPillScroll = useRef(true)
  /** Scroll after filter change only, not on first load. */
  const prevOrderActiveFilter = useRef<string | null>(null)

  useEffect(() => {
    if (catParam && categoryKeys.includes(catParam)) {
      setActiveCategory(catParam)
      setExpandedOrderCategory(catParam)
    }
  }, [catParam])

  useEffect(() => {
    if (isOrderMode) setIsLightMode(true)
  }, [isOrderMode])

  useEffect(() => {
    if (!isOrderMode) return
    writeOrderType(orderType)
  }, [isOrderMode, orderType])

  // Restore cart in order mode so refresh keeps selected items until checkout/order clear.
  useEffect(() => {
    if (!isOrderMode || typeof window === 'undefined') {
      setCartStorageReady(true)
      return
    }
    window.sessionStorage.removeItem(MANGO_HANDOFF_TO_MENU)
    const raw = window.sessionStorage.getItem(MANGO_CART_KEY)
    if (!raw) {
      setCart([])
      window.sessionStorage.removeItem(MANGO_CHECKOUT_SESSION)
      setCartStorageReady(true)
      return
    }
    try {
      const parsed = JSON.parse(raw) as CartItem[]
      setCart(Array.isArray(parsed) ? parsed : [])
    } catch {
      setCart([])
    }
    window.sessionStorage.removeItem(MANGO_CHECKOUT_SESSION)
    setCartStorageReady(true)
  }, [isOrderMode])

  useEffect(() => {
    if (!isOrderMode || typeof window === 'undefined' || !cartStorageReady) return
    if (cart.length === 0) {
      window.sessionStorage.removeItem(MANGO_CART_KEY)
      return
    }
    window.sessionStorage.setItem(MANGO_CART_KEY, JSON.stringify(cart))
  }, [cart, cartStorageReady, isOrderMode])

  useEffect(() => {
    const el = categoryRefs.current[activeCategory]
    if (!el) return
    if (skipInitialOrderCategoryPillScroll.current) {
      skipInitialOrderCategoryPillScroll.current = false
      if (isOrderMode) return
    }
    el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [activeCategory, isOrderMode])

  // Hint: show when user lands on menu page → auto-remove after 1 sec (or on scroll); next visit = show again
  useEffect(() => {
    if (typeof window === 'undefined') return
    setShowSlideHint(true)
    const hideAfter = setTimeout(() => setShowSlideHint(false), 1500)
    const onScroll = () => setShowSlideHint(false)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(hideAfter)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    setOrderWindow(getOrderWindowState())
    const interval = window.setInterval(() => setOrderWindow(getOrderWindowState()), 60000)
    return () => window.clearInterval(interval)
  }, [])

  const currentCategory = menuCategories[activeCategory]
  const currentItemCount = currentCategory.items.length

  const openWhatsApp = () => {
    const phone = shopConfig.contact.phones[0]?.replace(/\D/g, '') || '9596019296'
    const e164 = phone.length === 10 ? `91${phone}` : phone
    window.open(getWhatsAppLink(e164, defaultOrderMessage), '_blank')
  }

  const addToCart = (menuItem: MenuItem) => {
    if (!orderWindow.isOpen) {
      alert(orderWindow.message)
      return
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.id === menuItem.id)
      if (existing) return prev.map((item) => item.id === menuItem.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item)
      return [...prev, { ...menuItem, cartQuantity: 1 }]
    })
    setLastAddedItemId(menuItem.id)
    setCartBarPulse(true)
    window.setTimeout(() => setLastAddedItemId(null), 550)
    window.setTimeout(() => setCartBarPulse(false), 320)
  }

  const updateCartQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== itemId))
      return
    }
    setCart((prev) => prev.map((item) => item.id === itemId ? { ...item, cartQuantity: qty } : item))
    setCartBarPulse(true)
    window.setTimeout(() => setCartBarPulse(false), 320)
  }

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.cartQuantity, 0)
  const getItemNumericPrice = (price: string) => {
    const numeric = parseFloat(price.replace('₹', '').replace(',', '').split('/')[0].trim())
    return isNaN(numeric) ? 0 : numeric
  }
  const getTotalPrice = () =>
    cart.reduce((sum, item) => {
      const numeric = getItemNumericPrice(item.price)
      return sum + numeric * item.cartQuantity
    }, 0)

  const filteredOrderCategories = useMemo(() => {
    return categoryKeys
      .map((key) => {
        const cat = menuCategories[key]
        const items = cat.items.filter((item) => {
          const price = getItemNumericPrice(item.price)
          if (activeFilter === 'all') return true
          if (activeFilter === 'under150') return price > 0 && price <= 150
          if (activeFilter === 'under300') return price > 0 && price <= 300
          if (activeFilter === 'quickBites') return ['burgerPizza', 'sandwichSalad', 'momos', 'pastaMaggiFries', 'wraps', 'starters', 'mojitosSmoothies'].includes(key)
          if (activeFilter === 'meals') return ['mainCourse', 'riceNoodlesSoups', 'thali', 'combos', 'healthyDrinks', 'shakesIceCream'].includes(key)
          if (activeFilter === 'drinks') return ['desserts', 'icedCoffee', 'shakes', 'coolers', 'signatureDrinks', 'healthyBlends', 'icedTea', 'teaKehwa'].includes(key)
          if (activeFilter === 'desserts') return ['hotBeverages'].includes(key)
          if (activeFilter === 'combos') return ['combos'].includes(key)
          return true
        })
        return { key, cat, items }
      })
      .filter((entry) => entry.items.length > 0)
  }, [activeFilter])

  const scrollToCategorySection = (key: MenuCategoryKey) => {
    const header = orderHeaderRefs.current[key]
    const section = orderSectionRefs.current[key]
    const target = header ?? section
    if (target) {
      scrollElementTopOnPage(target, 8, 'auto')
      return
    }
    section?.scrollIntoView({ behavior: 'auto', block: 'start' })
  }

  const scrollCategoryStrip = (direction: 'left' | 'right') => {
    const scroller = categoryScrollerRef.current
    if (!scroller) return
    const amount = Math.max(160, Math.round(scroller.clientWidth * 0.72))
    scroller.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  /** After accordion opens (~200ms transition), snap scroll to category header (instant, not smooth). */
  const scheduleScrollToOrderSection = (key: MenuCategoryKey) => {
    window.requestAnimationFrame(() => {
      window.setTimeout(() => scrollToCategorySection(key), 200)
    })
  }

  useEffect(() => {
    if (!isOrderMode) return
    const pending = pendingOrderCategoryJump.current
    if (pending) {
      pendingOrderCategoryJump.current = null
      setActiveCategory(pending)
      setExpandedOrderCategory(pending)
      window.setTimeout(() => scrollToCategorySection(pending), 200)
      return
    }
    const first = filteredOrderCategories[0]
    if (!first) {
      setExpandedOrderCategory(null)
      prevOrderActiveFilter.current = activeFilter
      return
    }
    setExpandedOrderCategory(first.key)
    setActiveCategory(first.key)
    const filterChanged =
      prevOrderActiveFilter.current !== null && prevOrderActiveFilter.current !== activeFilter
    prevOrderActiveFilter.current = activeFilter
    if (filterChanged) {
      window.setTimeout(() => scrollToCategorySection(first.key), 200)
    }
  }, [activeFilter, isOrderMode, filteredOrderCategories])

  const goToCheckout = () => {
    if (!orderWindow.isOpen) {
      alert(orderWindow.message)
      return
    }
    writeHandoffToCheckout(cart, orderType)
    router.push('/checkout')
  }

  const jumpToOrderCategory = (key: MenuCategoryKey) => {
    const hasSection = filteredOrderCategories.some((e) => e.key === key)
    if (!hasSection) {
      pendingOrderCategoryJump.current = key
      setActiveFilter('all')
      return
    }
    setActiveCategory(key)
    setExpandedOrderCategory(key)
    scheduleScrollToOrderSection(key)
  }

  return (
    <div className={`relative mx-auto min-h-screen w-full max-w-[430px] overflow-x-hidden ${isLightMode ? 'bg-white' : 'bg-[#1a1a1a]'}`}>
      <main
        className={`relative min-h-screen ${isOrderMode ? (cart.length > 0 ? 'pb-[calc(9rem+env(safe-area-inset-bottom))]' : 'pb-[calc(5.5rem+env(safe-area-inset-bottom))]') : 'pb-24'} transition-colors duration-300 w-full max-w-full pl-[max(0.25rem,env(safe-area-inset-left))] pr-[max(0.25rem,env(safe-area-inset-right))] ${
          isLightMode
            ? 'bg-gradient-to-b from-white via-[#fffaf1] to-white text-slate-900'
            : 'bg-[radial-gradient(circle_at_top,rgba(176,122,73,0.16),transparent_20rem),linear-gradient(180deg,#111111_0%,#1a1a1a_42%,#0f0f0f_100%)] text-white'
        }`}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className={`absolute -top-14 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl ${isLightMode ? 'bg-[#D8C3A5]/20' : 'bg-[#D8C3A5]/10'}`} />
          <div className={`absolute top-[22rem] -left-20 h-64 w-64 rounded-full blur-3xl ${isLightMode ? 'bg-[#B07A49]/12' : 'bg-[#E9C46A]/10'}`} />
          <div className={`absolute bottom-[18rem] right-[-5rem] h-72 w-72 rounded-full blur-3xl ${isLightMode ? 'bg-[#D8C3A5]/15' : 'bg-white/[0.05]'}`} />
        </div>

        <div
          className={`relative z-20 transition-colors duration-300 ${isLightMode ? 'bg-white' : 'bg-[#121212]/95 backdrop-blur-xl'}`}
          style={{
            paddingTop: 'max(0.4rem, env(safe-area-inset-top))',
          }}
        >
          <div className={`w-full max-w-md mx-auto px-2 sm:px-3 ${isOrderMode ? 'pb-2' : 'pb-3'}`}>
            <div
              className={`rounded-[28px] px-2.5 sm:px-3 py-3 border transition-colors duration-300 ${
                isLightMode ? 'border-amber-200/70 bg-white shadow-sm' : 'border-[#B07A49]/25 bg-white/[0.07] shadow-[0_18px_40px_rgba(0,0,0,0.28)]'
              }`}
            >
              <div className="flex items-center justify-between relative">
                <Link
                  href="/"
                  className={`z-10 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full transition-colors active:scale-95 ${
                    isLightMode ? 'hover:bg-slate-100' : 'hover:bg-white/5'
                  }`}
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      sessionStorage.setItem('fromMenu', 'true')
                    }
                  }}
                >
                  <ArrowLeft className={`w-5 h-5 ${isLightMode ? 'text-slate-900' : 'text-white'}`} />
                </Link>
                <h1
                  className={`absolute left-0 right-0 text-center pointer-events-none px-12 ${
                    isLightMode ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  {isOrderMode ? (
                    <span className="text-lg sm:text-xl font-bold tracking-tight leading-tight">{orderTitle}</span>
                  ) : (
                    <span className="text-xl sm:text-2xl font-bold tracking-tight">Our Menu</span>
                  )}
                </h1>
                {isOrderMode ? (
                  <div className="z-10 h-8 w-8 shrink-0" aria-hidden />
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsLightMode((v) => !v)}
                      className={`z-10 relative inline-flex h-8 w-14 items-center rounded-full border transition-colors touch-manipulation ${
                      isLightMode
                        ? 'border-[#D8C3A5] bg-slate-100 shadow-[0_6px_16px_rgba(73,46,26,0.10)]'
                        : 'border-white/15 bg-slate-800 shadow-[0_10px_24px_rgba(0,0,0,0.35)]'
                    }`}
                    aria-label={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
                  >
                    <span
                      className={`absolute left-1.5 flex items-center justify-center ${
                        isLightMode ? 'text-amber-500' : 'text-slate-400'
                      }`}
                    >
                      <Sun className="h-3.5 w-3.5" />
                    </span>
                    <span
                      className={`absolute right-1.5 flex items-center justify-center ${
                        !isLightMode ? 'text-slate-100' : 'text-slate-400'
                      }`}
                    >
                      <Moon className="h-3.5 w-3.5" />
                    </span>
                    <span
                      className={`relative z-10 inline-flex h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                        isLightMode ? 'translate-x-1' : 'translate-x-[26px]'
                      }`}
                    />
                  </button>
                )}
              </div>

              {!isOrderMode && <div className="mt-4">
                <a
                  href={MENU_PDF_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl font-medium text-sm transition-colors border ${
                    isLightMode
                      ? 'bg-slate-900 text-white border-slate-900/10 hover:bg-slate-800 shadow-[0_16px_30px_rgba(15,23,42,0.14)]'
                      : 'bg-white/[0.08] text-white border-white/[0.1] hover:bg-white/[0.12] shadow-[0_18px_34px_rgba(0,0,0,0.28)]'
                  }`}
                >
                  <BookOpenText className="w-4 h-4 shrink-0" />
                  View PDF Menu
                </a>
              </div>}

              <div className="mt-4">
                {isOrderMode && (
                  <>
                    <Link
                      href="/order"
                      className="mb-3 inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-semibold leading-none text-slate-700 shadow-sm active:scale-[0.98]"
                    >
                      Change Order Type
                    </Link>
                    <div
                      className={`mb-3 rounded-2xl border px-3 py-2 text-[12px] font-semibold leading-snug ${
                        orderWindow.isOpen
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                          : 'border-amber-200 bg-amber-50 text-amber-900'
                      }`}
                    >
                      {orderWindow.message} Window: {orderWindow.label}.
                    </div>
                  </>
                )}
                <AnimatePresence>
                  {!isOrderMode && showSlideHint && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-center justify-center gap-2 mb-3 py-2 px-3 rounded-xl text-sm font-medium"
                      style={{
                        background: isLightMode ? 'rgba(122, 74, 45, 0.08)' : 'rgba(176,122,73,0.12)',
                        border: `1px solid ${isLightMode ? 'rgba(122, 74, 45, 0.2)' : 'rgba(176,122,73,0.24)'}`,
                        color: isLightMode ? '#7B4A2D' : 'rgba(255,255,255,0.95)',
                      }}
                    >
                      <ChevronsLeftRight className="w-4 h-4 shrink-0" aria-hidden />
                      <span>Slide to view categories</span>
                      <ChevronsLeftRight className="w-4 h-4 shrink-0" aria-hidden />
                    </motion.div>
                  )}
                </AnimatePresence>
	                {!isOrderMode && (
	                  <div className="mb-2.5 flex items-center justify-between gap-2 px-0.5">
	                    <p className={`text-[11px] font-semibold uppercase tracking-wide ${isLightMode ? 'text-slate-600' : 'text-white/70'}`}>
	                      Browse Categories
	                    </p>
	                    <div className="flex shrink-0 items-center gap-1.5">
	                      <button
	                        type="button"
	                        onClick={() => scrollCategoryStrip('left')}
	                        className={`inline-flex h-7 items-center gap-1 rounded-full border px-2 text-[10px] font-extrabold uppercase tracking-wide transition-colors ${
	                          isLightMode
	                            ? 'border-[#D8C3A5] bg-white text-[#7B4A2D] shadow-sm hover:bg-[#FFF7E8]'
	                            : 'border-[#E9C46A]/35 bg-white/[0.08] text-[#F8E08E] hover:bg-white/[0.12]'
	                        }`}
	                        aria-label="Scroll categories left"
	                      >
	                        <ChevronLeft className="h-3.5 w-3.5" />
	                        Left
	                      </button>
	                      <button
	                        type="button"
	                        onClick={() => scrollCategoryStrip('right')}
	                        className={`inline-flex h-7 items-center gap-1 rounded-full border px-2 text-[10px] font-extrabold uppercase tracking-wide transition-colors ${
	                          isLightMode
	                            ? 'border-[#D8C3A5] bg-white text-[#7B4A2D] shadow-sm hover:bg-[#FFF7E8]'
	                            : 'border-[#E9C46A]/35 bg-white/[0.08] text-[#F8E08E] hover:bg-white/[0.12]'
	                        }`}
	                        aria-label="Scroll categories right"
	                      >
	                        Right
	                        <ChevronRight className="h-3.5 w-3.5" />
	                      </button>
	                    </div>
	                  </div>
	                )}
                {isOrderMode && (
                  <p className={`mb-2.5 px-0.5 text-[11px] font-semibold uppercase tracking-wide ${isLightMode ? 'text-slate-600' : 'text-white/70'}`}>
                    Browse filters
                  </p>
	                )}
	                {!isOrderMode && (
		                  <div ref={categoryScrollerRef} className="flex min-w-0 gap-2.5 overflow-x-auto scrollbar-hide pb-1 pt-0.5 px-0.5">
	                      {categoryKeys.map((key) => {
	                        const cat = menuCategories[key]
	                        const isActive = activeCategory === key
	                        return (
	                          <motion.button
	                            key={key}
	                            ref={(el) => { categoryRefs.current[key] = el }}
	                            onClick={() => setActiveCategory(key)}
	                            whileTap={{ scale: 0.97 }}
	                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full font-semibold whitespace-nowrap shrink-0 text-[13px] leading-tight transition-all border ${
	                              isActive
	                                ? 'bg-[#B07A49] text-white border-[#E9C46A] shadow-[0_8px_22px_rgba(176,122,73,0.34)] ring-1 ring-[#E9C46A]/35'
	                                : isLightMode
	                                  ? 'bg-white text-slate-800 border-slate-200/95 shadow-[0_4px_14px_rgba(15,23,42,0.08)] hover:border-slate-300 hover:shadow-[0_6px_16px_rgba(15,23,42,0.1)]'
	                                  : 'bg-white/[0.08] text-white/92 border-white/[0.14] hover:bg-white/[0.12] shadow-[0_6px_18px_rgba(0,0,0,0.35)]'
	                            }`}
	                          >
	                            <span
	                              className={`relative h-[26px] w-[26px] shrink-0 overflow-hidden rounded-full ring-1 ${
	                                isLightMode ? 'ring-black/10' : 'ring-white/25'
	                              }`}
	                            >
	                              <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="26px" unoptimized />
	                            </span>
	                            <span className="leading-tight">{cat.name}</span>
	                          </motion.button>
	                        )
	                      })}
		                  </div>
		                )}
                {isOrderMode && (
                  <>
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 pt-0.5 -mx-0.5 px-0.5">
                      {[
                        { id: 'all', label: 'All' },
                        { id: 'under150', label: 'Under ₹150' },
                        { id: 'under300', label: 'Under ₹300' },
                        { id: 'quickBites', label: 'Quick Bites' },
                        { id: 'meals', label: 'Meals' },
                        { id: 'drinks', label: 'Drinks' },
                        { id: 'desserts', label: 'Desserts' },
                        { id: 'combos', label: 'Combos' },
                      ].map((filter) => (
                        <button
                          key={filter.id}
                          type="button"
                          onClick={() => setActiveFilter(filter.id as typeof activeFilter)}
                          className={`h-9 shrink-0 px-3.5 rounded-full text-sm font-semibold whitespace-nowrap border transition-colors touch-manipulation ${
                            activeFilter === filter.id
                              ? 'bg-[#B07A49] text-white border-[#E9C46A] shadow-[0_8px_22px_rgba(176,122,73,0.30)]'
                              : isLightMode
                                ? 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-white'
                                : 'bg-white/[0.08] text-white/90 border-white/[0.15] hover:bg-white/[0.12]'
                          }`}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
	                    <div className="mb-2.5 mt-4 flex items-center justify-between gap-2 px-0.5">
	                      <p className={`text-[11px] font-semibold uppercase tracking-wide ${isLightMode ? 'text-slate-600' : 'text-white/70'}`}>
	                        Browse Categories
	                      </p>
	                      <div className="flex shrink-0 items-center gap-1.5">
	                        <button
	                          type="button"
	                          onClick={() => scrollCategoryStrip('left')}
	                          className="inline-flex h-7 items-center gap-1 rounded-full border border-[#D8C3A5] bg-white px-2 text-[10px] font-extrabold uppercase tracking-wide text-[#7B4A2D] shadow-sm transition-colors hover:bg-[#FFF7E8]"
	                          aria-label="Scroll categories left"
	                        >
	                          <ChevronLeft className="h-3.5 w-3.5" />
	                          Left
	                        </button>
	                        <button
	                          type="button"
	                          onClick={() => scrollCategoryStrip('right')}
	                          className="inline-flex h-7 items-center gap-1 rounded-full border border-[#D8C3A5] bg-white px-2 text-[10px] font-extrabold uppercase tracking-wide text-[#7B4A2D] shadow-sm transition-colors hover:bg-[#FFF7E8]"
	                          aria-label="Scroll categories right"
	                        >
	                          Right
	                          <ChevronRight className="h-3.5 w-3.5" />
	                        </button>
	                      </div>
	                    </div>
		                    <div ref={categoryScrollerRef} className="flex min-w-0 gap-2.5 overflow-x-auto scrollbar-hide pb-1 pt-0.5 px-0.5">
	                        {categoryKeys.map((key) => {
	                          const cat = menuCategories[key]
	                          const isActive = activeCategory === key
	                          return (
	                            <motion.button
	                              key={`order-cat-${key}`}
	                              ref={(el) => { categoryRefs.current[key] = el }}
	                              type="button"
	                              onClick={() => jumpToOrderCategory(key)}
	                              whileTap={{ scale: 0.97 }}
	                              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full font-semibold whitespace-nowrap shrink-0 text-[13px] leading-tight transition-all border ${
	                                isActive
	                                  ? 'bg-[#B07A49] text-white border-[#E9C46A] shadow-[0_8px_22px_rgba(176,122,73,0.34)] ring-1 ring-[#E9C46A]/35'
	                                  : 'bg-white text-slate-800 border-slate-200/95 shadow-[0_4px_14px_rgba(15,23,42,0.08)] hover:border-slate-300 hover:shadow-[0_6px_16px_rgba(15,23,42,0.1)]'
	                              }`}
	                            >
	                              <span className="relative h-[26px] w-[26px] shrink-0 overflow-hidden rounded-full ring-1 ring-black/10">
	                                <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="26px" unoptimized />
	                              </span>
	                              <span className="leading-tight">{cat.name}</span>
	                            </motion.button>
	                          )
	                        })}
		                    </div>
	                  </>
	                )}
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          {!isOrderMode && (
            <div className="w-full max-w-md mx-auto px-2 sm:px-3 pt-3 pb-2">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0.96 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 ${
                  isLightMode
                    ? 'border-slate-200/90 bg-slate-50/90'
                    : 'border-white/[0.1] bg-white/[0.06]'
                }`}
              >
                <span
                  className={`relative h-10 w-10 shrink-0 overflow-hidden rounded-xl ring-1 ${
                    isLightMode ? 'bg-white/90 ring-black/10' : 'bg-white/10 ring-white/25'
                  }`}
                >
                  <Image src={currentCategory.image} alt="" fill className="object-cover" sizes="40px" unoptimized />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-[15px] font-semibold tracking-tight ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
                    {currentCategory.name}
                  </p>
                  <p className={`mt-0.5 text-[12px] ${isLightMode ? 'text-slate-500' : 'text-white/60'}`}>
                    {currentItemCount} {currentItemCount === 1 ? 'item' : 'items'}
                    <span className="mx-1.5 opacity-40">·</span>
                    Fresh kitchen
                  </p>
                </div>
              </motion.div>
            </div>
          )}

          <div className="w-full max-w-md mx-auto px-2 sm:px-3 pt-3 pb-8">
            {isOrderMode ? (
              <div className="space-y-2.5">
                {filteredOrderCategories.length === 0 ? (
                  <div
                    className={`rounded-2xl border border-dashed px-4 py-8 text-center text-sm font-medium ${
                      isLightMode ? 'border-slate-300 bg-white text-slate-500' : 'border-white/20 bg-white/[0.06] text-white/65'
                    }`}
                  >
                    No items found in this filter.
                  </div>
                ) : filteredOrderCategories.map(({ key, cat, items: filteredItems }) => {
                  const isOpen = expandedOrderCategory === key
                  return (
                    <section
                      ref={(el) => { orderSectionRefs.current[key] = el }}
                      key={`order-section-${key}`}
                      className={`w-full overflow-hidden rounded-[28px] border transition-all duration-200 ${
                        isLightMode
                          ? isOpen
                            ? 'border-[#B07A49]/45 bg-white shadow-[0_18px_40px_rgba(122,74,45,0.14)] ring-1 ring-[#E9C46A]/30'
                            : 'border-[#D8C3A5]/70 bg-white shadow-[0_10px_24px_rgba(73,46,26,0.08)] hover:border-[#B07A49]/45'
                          : isOpen
                            ? 'border-white/20 bg-white/[0.08] shadow-lg ring-1 ring-white/10'
                            : 'border-white/10 bg-white/[0.06] hover:bg-white/[0.08]'
                      }`}
                    >
                      <button
                        ref={(el) => {
                          orderHeaderRefs.current[key] = el
                        }}
                        type="button"
                        onClick={() => {
                          if (isOpen) {
                            setExpandedOrderCategory(null)
                            return
                          }
                          setExpandedOrderCategory(key)
                          setActiveCategory(key)
                          scheduleScrollToOrderSection(key)
                        }}
                        className={`flex w-full items-center gap-3 px-4 py-4 text-left touch-manipulation active:bg-slate-50/80 ${
	                          isLightMode ? 'bg-[#FFFCF7] hover:bg-[#FFF7E8]' : 'bg-white/[0.04] hover:bg-white/[0.07]'
                        }`}
                      >
	                        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-white shadow-[0_8px_18px_rgba(73,46,26,0.14)] ring-1 ring-[#D8C3A5]/70">
                          <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="56px" unoptimized />
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className={`block truncate text-[17px] font-extrabold leading-tight ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
                            {cat.name}
                          </span>
                          <span className={`mt-1 block text-[13px] font-medium ${isLightMode ? 'text-slate-500' : 'text-white/60'}`}>
                            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
                            <span className="opacity-40"> · </span>
                            {isOpen ? 'Tap header to close' : 'Tap to view & add'}
                          </span>
                        </div>
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                            isLightMode
                              ? isOpen
	                                ? 'bg-[#7B4A2D] text-white'
	                                : 'bg-white text-[#7B4A2D] shadow-sm ring-1 ring-[#D8C3A5]/80'
                              : isOpen
                                ? 'bg-white/25 text-white'
                                : 'bg-white/10 text-white'
                          }`}
                        >
                          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                            className={`overflow-hidden border-t ${isLightMode ? 'border-slate-100' : 'border-white/10'}`}
                          >
                            <div className="p-3 space-y-3.5">
                              {filteredItems.map((item, index) => {
                                const inCartQty = cart.find((c) => c.id === item.id)?.cartQuantity || 0
                                return (
                                  <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: Math.min(index * 0.02, 0.15) }}
                                    className="group overflow-hidden rounded-[26px] border transition-all duration-300 relative min-h-[166px]"
                                    style={
                                      isLightMode
                                        ? {
	                                            background: 'linear-gradient(145deg, #ffffff 0%, #fffaf1 58%, #ffffff 100%)',
	                                            border: '1px solid rgba(216, 195, 165, 0.72)',
	                                            boxShadow: '0 14px 30px rgba(73, 46, 26, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.96)',
                                          }
                                        : {
                                            background: 'radial-gradient(circle at 100% 0%, rgba(176,122,73,0.16), transparent 9rem), linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.045))',
                                            border: '1px solid rgba(233,196,106,0.18)',
                                            boxShadow: '0 14px 34px rgba(0,0,0,0.42)',
                                          }
                                    }
                                  >
                                    <div className="p-4 relative z-10">
                                      <h3 className={`text-[15px] font-bold leading-tight ${isLightMode ? 'text-slate-900' : 'text-white'}`}>{item.name}</h3>
                                      <p className={`text-sm font-semibold mt-1 ${isLightMode ? 'text-slate-700' : 'text-white/85'}`}>{item.price}</p>
                                      {item.quantity && item.quantity !== '1 portion' && (
                                        <p className={`text-xs mt-1 ${isLightMode ? 'text-slate-500' : 'text-white/55'}`}>{item.quantity}</p>
                                      )}
                                      <div className="mt-3 flex justify-end">
                                        {inCartQty > 0 ? (
                                          <div className={`h-10 min-w-[120px] rounded-xl flex items-center justify-between px-3 transition-transform ${lastAddedItemId === item.id ? 'scale-[1.03]' : ''}`} style={{ background: 'linear-gradient(135deg,#B07A49,#7B4A2D)', color: '#FFFFFF' }}>
                                            <button type="button" onClick={() => updateCartQuantity(item.id, inCartQty - 1)} className="w-6 h-6 rounded-full flex items-center justify-center text-white">
                                              <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="text-sm font-bold tabular-nums">{inCartQty}</span>
                                            <button type="button" onClick={() => addToCart(item)} className="w-6 h-6 rounded-full flex items-center justify-center text-white">
                                              <Plus className="w-4 h-4" />
                                            </button>
                                          </div>
                                        ) : (
                                          <motion.button
                                            type="button"
                                            onClick={() => addToCart(item)}
                                            whileTap={{ scale: 0.97 }}
                                            animate={lastAddedItemId === item.id ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                                            transition={{ duration: 0.28, ease: 'easeOut' }}
                                            className="relative overflow-hidden h-10 min-w-[120px] rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 border-2"
                                            style={{
                                              borderColor: '#E9C46A',
                                              color: isLightMode ? '#7B4A2D' : '#F8E08E',
	                                              background: isLightMode ? 'linear-gradient(135deg,#FFFFFF,#FFF7E8)' : 'rgba(176,122,73,0.12)',
                                            }}
                                          >
                                            {lastAddedItemId === item.id && (
                                              <span className="absolute inset-0 rounded-xl bg-[#E9C46A]/15 animate-ping" />
                                            )}
                                            <span className="relative z-10 inline-flex items-center gap-1.5">
                                              ADD
                                              <Plus className="w-4 h-4" />
                                            </span>
                                          </motion.button>
                                        )}
                                      </div>
                                    </div>
                                  </motion.div>
                                )
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </section>
                  )
                })}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  viewport={{ once: true }}
                  className="grid grid-cols-2 gap-3 sm:gap-4"
                >
                  {currentCategory.items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(index * 0.02, 0.15) }}
                      className="group rounded-[24px] overflow-hidden border transition-all duration-300 relative flex flex-col min-h-[148px]"
                      style={
                        isLightMode
                          ? {
	                              background: 'linear-gradient(145deg, #ffffff 0%, #fffaf1 54%, #ffffff 100%)',
	                              border: '1px solid rgba(216, 195, 165, 0.72)',
	                              boxShadow: '0 14px 30px rgba(73, 46, 26, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.92)',
                            }
                          : {
                              background: 'radial-gradient(circle at 100% 0%, rgba(176,122,73,0.18), transparent 8rem), linear-gradient(180deg, rgba(255,255,255,0.085), rgba(255,255,255,0.04))',
                              border: '1px solid rgba(233,196,106,0.18)',
                              boxShadow: '0 18px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
                            }
                      }
                    >
                      <div className="p-4 flex flex-col flex-1 min-h-0 gap-0 relative z-10">
                        <div className="flex items-center justify-end gap-2 shrink-0 flex-wrap">
                          <span
	                            className={`rounded-full px-2.5 py-1 text-xs font-extrabold tabular-nums border shadow-sm shrink-0 ${isLightMode ? 'bg-white text-[#7B4A2D] border-[#D8C3A5] shadow-[0_6px_14px_rgba(73,46,26,0.08)]' : 'bg-[#E9C46A] text-[#1a1a1a] border-[#FFE8A3] shadow-[0_8px_18px_rgba(233,196,106,0.22)]'}`}
                          >
                            {item.price}
                          </span>
                        </div>
                        <h3
                          className={`text-[14px] sm:text-[15px] font-bold leading-snug line-clamp-3 flex-1 min-h-0 mt-3 overflow-hidden break-words ${isLightMode ? 'text-slate-900' : 'text-white/95'}`}
                        >
                          {item.name}
                        </h3>
                        {item.quantity && item.quantity !== '1 portion' && (
                          <p className={`text-[11px] mt-1.5 truncate shrink-0 font-medium ${isLightMode ? 'text-slate-600' : 'text-white/55'}`}>{item.quantity}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isOrderMode && showCategoryMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100001] bg-black/35 backdrop-blur-[1px] p-3"
            onClick={() => setShowCategoryMenu(false)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              className="mx-auto mt-4 w-full max-w-md rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_44px_rgba(15,23,42,0.22)] max-h-[72vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <p className="text-base font-bold text-slate-900">Browse Menu</p>
                <button
                  type="button"
                  onClick={() => setShowCategoryMenu(false)}
                  className="h-8 w-8 rounded-full bg-slate-100 text-slate-700 inline-flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden py-1.5 scrollbar-hide touch-pan-y">
                {categoryKeys.map((key) => {
                  const cat = menuCategories[key]
                  const isActive = activeCategory === key
                  return (
                    <button
                      key={`menu-sheet-${key}`}
                      type="button"
                      onClick={() => {
                        setActiveCategory(key)
                        setExpandedOrderCategory(key)
                        setShowCategoryMenu(false)
                        window.setTimeout(() => scrollToCategorySection(key), 200)
                      }}
                      className="w-full px-4 py-3.5 text-left flex items-center justify-between border-b border-slate-100/90 last:border-b-0"
                    >
                      <span className={`text-[16px] font-semibold ${isActive ? 'text-[#7B4A2D]' : 'text-slate-800'}`}>
                        {cat.name}
                      </span>
                      <span className={`text-[15px] font-semibold ${isActive ? 'text-[#7B4A2D]' : 'text-slate-500'}`}>
                        {cat.items.length}
                      </span>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOrderMode && (
        <>
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="pointer-events-none fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[9999] flex justify-center"
                style={{
                  paddingLeft: 'max(1.25rem, env(safe-area-inset-left))',
                  paddingRight: 'max(1.25rem, env(safe-area-inset-right))',
                }}
              >
                <motion.button
                  onClick={goToCheckout}
                  animate={cartBarPulse ? { scale: [1, 1.02, 1] } : { scale: 1 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="pointer-events-auto w-full max-w-[430px] h-[60px] rounded-full text-white shadow-[0_14px_32px_rgba(176,122,73,0.34)] flex items-center justify-between px-4 border border-[#E9C46A]/40"
                  style={{ background: 'linear-gradient(135deg,#B07A49,#7B4A2D)' }}
                >
	                  <span className="flex min-w-0 items-center gap-2.5">
	                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/95 text-[13px] font-extrabold text-[#7B4A2D] shadow-sm">
	                      {getTotalItems()}
	                    </span>
	                    <span className="min-w-0 text-left">
	                      <span className="block truncate text-[15px] font-extrabold">
	                        {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} added
	                      </span>
	                      <span className="block text-[12px] font-semibold text-white/80">
	                        Total ₹{getTotalPrice().toFixed(0)}
	                      </span>
	                    </span>
	                  </span>
	                  <span className="shrink-0 text-[15px] font-extrabold">Checkout &gt;</span>
	                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!showCategoryMenu && (
              <div
                className={`pointer-events-none fixed inset-x-0 z-[10000] mx-auto flex w-full max-w-[430px] justify-end ${
                  cart.length > 0
                    ? 'bottom-[calc(5.25rem+env(safe-area-inset-bottom))]'
                    : 'bottom-[max(0.75rem,env(safe-area-inset-bottom))]'
                }`}
                style={{
                  paddingLeft: 'max(1.25rem, env(safe-area-inset-left))',
                  paddingRight: 'max(1.25rem, env(safe-area-inset-right))',
                }}
              >
                <motion.button
                  initial={{ opacity: 0, y: 16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.96 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  onClick={() => setShowCategoryMenu(true)}
                  whileTap={{ scale: 0.97 }}
                  className="pointer-events-auto h-11 rounded-full shadow-[0_14px_30px_rgba(15,23,42,0.38)] text-white px-4 inline-flex items-center gap-2.5 border border-white/20 touch-manipulation"
                  style={{ background: 'linear-gradient(135deg, #334155, #0f172a)' }}
                >
                  <span className="w-6 h-6 rounded-full bg-white/20 inline-flex items-center justify-center">
                    <List className="w-4 h-4" />
                  </span>
                  <span className="text-sm font-semibold tracking-wide">Menu</span>
                </motion.button>
              </div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <main
          className="min-h-screen pb-24 flex items-center justify-center"
          style={{ backgroundColor: '#ffffff' }}
        >
          <p className="text-slate-600 text-sm">Loading menu...</p>
        </main>
      }
    >
      <MenuPageInner />
    </Suspense>
  )
}
