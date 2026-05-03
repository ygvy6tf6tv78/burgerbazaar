'use client'

import { useState, useEffect, Suspense, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, Moon, Sun, ChevronsLeftRight, ShoppingCart, Plus, Minus, Check, List, X, ChevronDown, ChevronUp } from 'lucide-react'
import { menuCategories, type CartItem, type MenuItem } from '../shops/honeys-fresh-n-frozen/menu'
import { shopConfig } from '../shops/honeys-fresh-n-frozen/config'
import { getWhatsAppLink } from '../lib/phone'

type MenuCategoryKey = keyof typeof menuCategories

const categoryKeys: MenuCategoryKey[] = [
  'burgerPizza',
  'sandwichSalad',
  'momos',
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
]

// PDF menu in public – opens in phone preview / browser
const MENU_PDF_URL = '/mango%20menu%2017-01-2025.pdf'
const defaultOrderMessage = "Hi Mango, I'd like to order from the menu. Please share today's availability and rates."

/** Scroll `element`'s top edge to near the top of `container` (same coordinate space as `container.scrollTop`). */
function scrollElementTopIntoContainer(
  element: HTMLElement,
  container: HTMLElement,
  paddingTop = 10,
  behavior: ScrollBehavior = 'auto'
) {
  const cRect = container.getBoundingClientRect()
  const eRect = element.getBoundingClientRect()
  const nextTop = container.scrollTop + (eRect.top - cRect.top) - paddingTop
  const top = Math.max(0, nextTop)
  if (!Number.isFinite(top)) return
  container.scrollTo({ top, behavior })
}

function MenuPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const catParam = searchParams.get('cat') as MenuCategoryKey | null
  const mode = searchParams.get('mode')
  const isOrderMode = mode === 'order'
  const initialCat = (catParam && categoryKeys.includes(catParam)) ? catParam : 'burgerPizza'
  const [activeCategory, setActiveCategory] = useState<MenuCategoryKey>(initialCat)
  const [isLightMode, setIsLightMode] = useState(true)
  const [showSlideHint, setShowSlideHint] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [lastAddedItemId, setLastAddedItemId] = useState<string | null>(null)
  const [cartBarPulse, setCartBarPulse] = useState(false)
  const [showCategoryMenu, setShowCategoryMenu] = useState(false)
  const [expandedOrderCategory, setExpandedOrderCategory] = useState<MenuCategoryKey | null>(initialCat)
  const [activeFilter, setActiveFilter] = useState<'all' | 'under150' | 'under300' | 'quickBites' | 'meals' | 'drinks' | 'desserts' | 'combos'>('all')
  const categoryRefs = useRef<Partial<Record<MenuCategoryKey, HTMLButtonElement | null>>>({})
  const orderSectionRefs = useRef<Partial<Record<MenuCategoryKey, HTMLElement | null>>>({})
  /** Accordion header row — scroll target so the category title bar lands under the header, not the section bottom. */
  const orderHeaderRefs = useRef<Partial<Record<MenuCategoryKey, HTMLButtonElement | null>>>({})
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
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
    const el = categoryRefs.current[activeCategory]
    if (!el) return
    if (skipInitialOrderCategoryPillScroll.current) {
      skipInitialOrderCategoryPillScroll.current = false
      return
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

  const currentCategory = menuCategories[activeCategory]
  const currentItemCount = currentCategory.items.length

  const openWhatsApp = () => {
    const phone = shopConfig.contact.phones[0]?.replace(/\D/g, '') || '9419532222'
    const e164 = phone.length === 10 ? `91${phone}` : phone
    window.open(getWhatsAppLink(e164, defaultOrderMessage), '_blank')
  }

  const addToCart = (menuItem: MenuItem) => {
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
          if (activeFilter === 'quickBites') return ['burgerPizza', 'sandwichSalad', 'momos', 'pastaMaggiFries', 'wraps', 'starters'].includes(key)
          if (activeFilter === 'meals') return ['mainCourse', 'riceNoodlesSoups', 'thali'].includes(key)
          if (activeFilter === 'drinks') return ['healthyDrinks', 'mojitosSmoothies', 'shakesIceCream', 'hotBeverages'].includes(key)
          if (activeFilter === 'desserts') return ['shakesIceCream'].includes(key)
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
    const container = scrollContainerRef.current
    if (target && container) {
      scrollElementTopIntoContainer(target, container, 8, 'auto')
      return
    }
    target?.scrollIntoView({ behavior: 'auto', block: 'start' })
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
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('mango_checkout_cart', JSON.stringify(cart))
    }
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
    <div className="relative max-w-[430px] mx-auto min-h-screen overflow-x-hidden">
      <div
        ref={scrollContainerRef}
        className="h-[100dvh] min-h-0 overflow-y-auto overscroll-y-contain scrollbar-hide touch-pan-y [-webkit-overflow-scrolling:touch]"
      >
      <main
        className={`relative min-h-screen ${isOrderMode ? (cart.length > 0 ? 'pb-[calc(9rem+env(safe-area-inset-bottom))]' : 'pb-[calc(5.5rem+env(safe-area-inset-bottom))]') : 'pb-24'} transition-colors duration-300 w-full max-w-full pl-[max(0.25rem,env(safe-area-inset-left))] pr-[max(0.25rem,env(safe-area-inset-right))] ${
          isLightMode
            ? 'bg-gradient-to-b from-[#fff8e8] via-slate-50 to-[#fef2d7] text-slate-900'
            : 'bg-gradient-to-b from-slate-950 via-[#08110f] to-slate-950 text-white'
        }`}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className={`absolute -top-14 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl ${isLightMode ? 'bg-[#FBEC89]/20' : 'bg-[#FBEC89]/10'}`} />
          <div className={`absolute top-[22rem] -left-20 h-64 w-64 rounded-full blur-3xl ${isLightMode ? 'bg-mango-green/12' : 'bg-mango-green/16'}`} />
          <div className={`absolute bottom-[18rem] right-[-5rem] h-72 w-72 rounded-full blur-3xl ${isLightMode ? 'bg-[#FBEC89]/15' : 'bg-white/[0.05]'}`} />
        </div>

        <div
          className={`relative z-20 transition-colors duration-300 ${isLightMode ? 'bg-[#fff8e8]' : 'bg-slate-950'}`}
          style={{
            paddingTop: 'max(0.4rem, env(safe-area-inset-top))',
          }}
        >
          <div className={`w-full max-w-md mx-auto px-2 sm:px-3 ${isOrderMode ? 'pb-2' : 'pb-3'}`}>
            <div
              className={`rounded-[28px] px-2.5 sm:px-3 py-3 border transition-colors duration-300 ${
                isLightMode ? 'border-amber-200/70 bg-white shadow-sm' : 'border-white/[0.08] bg-white/[0.06] shadow-sm'
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
                    <span className="text-lg sm:text-xl font-bold tracking-tight leading-tight">Order Online</span>
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
                    className="flex items-center text-xs sm:text-sm font-semibold z-10 touch-manipulation"
                  >
                    <span
                      className={`relative inline-flex h-7 w-12 sm:h-8 sm:w-14 items-center rounded-full border transition-colors ${
                        isLightMode
                          ? 'bg-slate-100 border-slate-300 shadow-[0_4px_10px_rgba(148,163,184,0.55)]'
                          : 'bg-slate-800 border-slate-600 shadow-[0_6px_16px_rgba(15,23,42,0.8)]'
                      }`}
                    >
                      <span
                        className={`absolute inset-y-0 left-0 flex w-1/2 items-center justify-center text-[11px] sm:text-xs ${
                          isLightMode ? 'text-amber-500' : 'text-slate-400'
                        }`}
                      >
                        <Sun className="w-4 h-4" />
                      </span>
                      <span
                        className={`absolute inset-y-0 right-0 flex w-1/2 items-center justify-center text-[11px] sm:text-xs ${
                          !isLightMode ? 'text-slate-100' : 'text-slate-400'
                        }`}
                      >
                        <Moon className="w-4 h-4" />
                      </span>
                      <span
                        className={`inline-block h-6 w-6 sm:h-7 sm:w-7 transform rounded-full bg-white shadow-lg transition-transform ${
                          isLightMode ? 'translate-x-[26px] sm:translate-x-[30px]' : 'translate-x-1'
                        }`}
                      />
                    </span>
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
                  <ShoppingCart className="w-4 h-4 shrink-0" />
                  View PDF Menu
                </a>
              </div>}

              <div className="mt-4">
                <AnimatePresence>
                  {!isOrderMode && showSlideHint && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-center justify-center gap-2 mb-3 py-2 px-3 rounded-xl text-sm font-medium"
                      style={{
                        background: isLightMode ? 'rgba(30, 77, 61, 0.08)' : 'rgba(255,255,255,0.08)',
                        border: `1px solid ${isLightMode ? 'rgba(30, 77, 61, 0.2)' : 'rgba(255,255,255,0.15)'}`,
                        color: isLightMode ? '#1E4D3D' : 'rgba(255,255,255,0.95)',
                      }}
                    >
                      <ChevronsLeftRight className="w-4 h-4 shrink-0" aria-hidden />
                      <span>Slide to view categories</span>
                      <ChevronsLeftRight className="w-4 h-4 shrink-0" aria-hidden />
                    </motion.div>
                  )}
                </AnimatePresence>
                {!isOrderMode && (
                  <p className={`mb-2.5 px-0.5 text-[11px] font-semibold uppercase tracking-wide ${isLightMode ? 'text-slate-600' : 'text-white/70'}`}>
                    Browse Categories
                  </p>
                )}
                {isOrderMode && (
                  <p className={`mb-2.5 px-0.5 text-[11px] font-semibold uppercase tracking-wide ${isLightMode ? 'text-slate-600' : 'text-white/70'}`}>
                    Browse filters
                  </p>
                )}
                {!isOrderMode && (
                <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1 pt-0.5 -mx-0.5 px-0.5">
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
                            ? 'bg-mango-green text-white border-mango-green shadow-[0_8px_18px_rgba(30,77,61,0.28)] ring-1 ring-mango-green/30'
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
                              ? 'bg-mango-green text-white border-mango-green shadow-[0_8px_18px_rgba(30,77,61,0.22)]'
                              : isLightMode
                                ? 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-white'
                                : 'bg-white/[0.08] text-white/90 border-white/[0.15] hover:bg-white/[0.12]'
                          }`}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                    <p className="mb-2.5 mt-4 px-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                      Browse Categories
                    </p>
                    <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1 pt-0.5 -mx-0.5 px-0.5">
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
                                ? 'bg-mango-green text-white border-mango-green shadow-[0_8px_18px_rgba(30,77,61,0.28)] ring-1 ring-mango-green/30'
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
                    Pure veg
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
                      className={`w-full overflow-hidden rounded-2xl border transition-all duration-200 ${
                        isLightMode
                          ? isOpen
                            ? 'border-mango-green/25 bg-white shadow-[0_10px_28px_rgba(30,77,61,0.1)] ring-1 ring-mango-green/15'
                            : 'border-slate-200/95 bg-white shadow-sm hover:border-slate-300'
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
                        className={`flex w-full items-center gap-3 px-4 py-3.5 text-left touch-manipulation active:bg-slate-50/80 ${
                          isLightMode ? 'bg-slate-50/70 hover:bg-slate-50' : 'bg-white/[0.04] hover:bg-white/[0.07]'
                        }`}
                      >
                        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
                          <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="44px" unoptimized />
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className={`block truncate text-[16px] font-semibold leading-tight ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
                            {cat.name}
                          </span>
                          <span className={`mt-0.5 block text-[12px] ${isLightMode ? 'text-slate-500' : 'text-white/60'}`}>
                            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
                            <span className="opacity-40"> · </span>
                            {isOpen ? 'Tap header to close' : 'Tap to view & add'}
                          </span>
                        </div>
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                            isLightMode
                              ? isOpen
                                ? 'bg-mango-green text-white'
                                : 'bg-white text-slate-600 shadow-sm ring-1 ring-slate-200'
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
                            <div className="p-3 space-y-3">
                              {filteredItems.map((item, index) => {
                                const inCartQty = cart.find((c) => c.id === item.id)?.cartQuantity || 0
                                return (
                                  <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: Math.min(index * 0.02, 0.15) }}
                                    className="group rounded-2xl overflow-hidden border transition-all duration-300 relative min-h-[160px]"
                                    style={
                                      isLightMode
                                        ? {
                                            background: 'linear-gradient(145deg, #ffffff 0%, #ffffff 56%, #fafafa 100%)',
                                            border: '1px solid rgba(226, 232, 240, 0.95)',
                                            boxShadow: '0 10px 20px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.96)',
                                          }
                                        : {
                                            background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            boxShadow: '0 12px 28px rgba(0,0,0,0.35)',
                                          }
                                    }
                                  >
                                    <div className="p-3.5 relative z-10">
                                      <span
                                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                                          isLightMode ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-500/15 text-emerald-200 border-emerald-400/35'
                                        }`}
                                      >
                                        Veg
                                      </span>
                                      <h3 className={`text-[15px] font-bold leading-tight mt-2 ${isLightMode ? 'text-slate-900' : 'text-white'}`}>{item.name}</h3>
                                      <p className={`text-sm font-semibold mt-1 ${isLightMode ? 'text-slate-700' : 'text-white/85'}`}>{item.price}</p>
                                      {item.quantity && item.quantity !== '1 portion' && (
                                        <p className={`text-xs mt-1 ${isLightMode ? 'text-slate-500' : 'text-white/55'}`}>{item.quantity}</p>
                                      )}
                                      <div className="mt-3 flex justify-end">
                                        {inCartQty > 0 ? (
                                          <div className={`h-10 min-w-[120px] rounded-xl flex items-center justify-between px-3 transition-transform ${lastAddedItemId === item.id ? 'scale-[1.03]' : ''}`} style={{ background: '#F25269', color: '#FFFFFF' }}>
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
                                              borderColor: '#F25269',
                                              color: '#F25269',
                                              background: isLightMode ? '#FFFFFF' : 'rgba(255,255,255,0.06)',
                                            }}
                                          >
                                            {lastAddedItemId === item.id && (
                                              <span className="absolute inset-0 rounded-xl bg-[#F25269]/10 animate-ping" />
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
                              background: 'linear-gradient(145deg, #ffffff 0%, #ffffff 52%, #fcfcfb 100%)',
                              border: '1px solid rgba(226, 232, 240, 0.95)',
                              boxShadow: '0 14px 28px rgba(15, 23, 42, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.92)',
                            }
                          : {
                              background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.04))',
                              border: '1px solid rgba(255,255,255,0.08)',
                              boxShadow: '0 18px 48px rgba(0,0,0,0.55)',
                            }
                      }
                    >
                      <div className="p-4 flex flex-col flex-1 min-h-0 gap-0 relative z-10">
                        <div className="flex items-center justify-between gap-2 shrink-0 flex-wrap">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold border tracking-wide shrink-0 ${isLightMode ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-500/15 text-emerald-200 border-emerald-300/50'}`}
                          >
                            Veg
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-bold tabular-nums border shadow-sm shrink-0 ${isLightMode ? 'bg-white text-amber-900 border-amber-200 shadow-[0_6px_14px_rgba(15,23,42,0.06)]' : 'bg-black/40 text-amber-100 border-amber-400/50'}`}
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
      </div>

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
                      <span className={`text-[16px] font-semibold ${isActive ? 'text-[#E23744]' : 'text-slate-800'}`}>
                        {cat.name}
                      </span>
                      <span className={`text-[15px] font-semibold ${isActive ? 'text-[#E23744]' : 'text-slate-500'}`}>
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
                className="pointer-events-none absolute left-3 right-3 z-[9999] bottom-[max(0.75rem,env(safe-area-inset-bottom))]"
              >
                <motion.button
                  onClick={goToCheckout}
                  animate={cartBarPulse ? { scale: [1, 1.02, 1] } : { scale: 1 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="pointer-events-auto w-full h-[60px] rounded-full text-white shadow-[0_14px_28px_rgba(226,55,68,0.32)] flex items-center justify-between px-4 border border-white/20"
                  style={{ background: '#F25269' }}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="flex items-center -space-x-2">
                      <span className="w-7 h-7 rounded-full border border-white/80 overflow-hidden bg-white">
                        <Image src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=120&q=60" alt="Food 1" width={28} height={28} className="w-full h-full object-cover" unoptimized />
                      </span>
                      <span className="w-7 h-7 rounded-full border border-white/80 overflow-hidden bg-white">
                        <Image src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=120&q=60" alt="Food 2" width={28} height={28} className="w-full h-full object-cover" unoptimized />
                      </span>
                    </span>
                    <span className="text-[16px] font-semibold">{getTotalItems()} items added</span>
                  </span>
                  <span className="text-[16px] font-semibold">Checkout &gt;</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!showCategoryMenu && (
              <motion.button
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.96 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                onClick={() => setShowCategoryMenu(true)}
                whileTap={{ scale: 0.97 }}
                className={`absolute right-3 z-[10000] h-11 rounded-full shadow-[0_14px_30px_rgba(15,23,42,0.38)] text-white px-4 inline-flex items-center gap-2.5 border border-white/20 touch-manipulation ${
                  cart.length > 0
                    ? 'bottom-[calc(5.25rem+env(safe-area-inset-bottom))]'
                    : 'bottom-[max(0.75rem,env(safe-area-inset-bottom))]'
                }`}
                style={{ background: 'linear-gradient(135deg, #334155, #0f172a)' }}
              >
                <span className="w-6 h-6 rounded-full bg-white/20 inline-flex items-center justify-center">
                  <List className="w-4 h-4" />
                </span>
                <span className="text-sm font-semibold tracking-wide">Menu</span>
              </motion.button>
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
          style={{ backgroundColor: '#1a1a1a' }}
        >
          <p className="text-white/70 text-sm">Loading menu…</p>
        </main>
      }
    >
      <MenuPageInner />
    </Suspense>
  )
}
