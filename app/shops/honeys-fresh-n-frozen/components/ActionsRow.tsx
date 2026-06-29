'use client'

import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Download, MapPin, ShoppingCart, Star, X, List, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { shopConfig, ContactPerson } from '../config'
import { getTelLink, getWhatsAppLink, formatPhoneDisplay } from '../../../lib/phone'
import { generateVCard, downloadVCard } from '../../../lib/vcard'
import { useLanguage } from '../../../contexts/LanguageContext'

interface ActionsRowProps {
  onOpenPayments?: () => void
}

export interface ActionsRowRef {
  openWhatsAppSelector: () => void
  openInstagramSelector: () => void
}

const ActionsRow = forwardRef<ActionsRowRef, ActionsRowProps>(({ onOpenPayments }, ref) => {
  const { t } = useLanguage()
  const [callSelectorOpen, setCallSelectorOpen] = useState(false)
  const [whatsappSelectorOpen, setWhatsappSelectorOpen] = useState(false)
  const [instagramSelectorOpen, setInstagramSelectorOpen] = useState(false)
  const callSelectorRef = useRef<HTMLDivElement>(null)
  const whatsappSelectorRef = useRef<HTMLDivElement>(null)
  const instagramSelectorRef = useRef<HTMLDivElement>(null)

  // Expose WhatsApp selector toggle to parent via ref
  useImperativeHandle(ref, () => ({
    openWhatsAppSelector: () => {
      setWhatsappSelectorOpen(true)
      setCallSelectorOpen(false)
      setInstagramSelectorOpen(false)
    },
    openInstagramSelector: () => {
      setInstagramSelectorOpen(true)
      setCallSelectorOpen(false)
      setWhatsappSelectorOpen(false)
    }
  }))

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (callSelectorOpen || whatsappSelectorOpen || instagramSelectorOpen) {
        const target = e.target as HTMLElement
        if (!target.closest('.popup-selector') && !target.closest('[data-call-button]') && !target.closest('[data-whatsapp-button]') && !target.closest('[data-instagram-button]')) {
          setCallSelectorOpen(false)
          setWhatsappSelectorOpen(false)
          setInstagramSelectorOpen(false)
        }
      }
    }

    if (callSelectorOpen || whatsappSelectorOpen || instagramSelectorOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [callSelectorOpen, whatsappSelectorOpen, instagramSelectorOpen])

  const handleCall = (person: ContactPerson) => {
    const telLink = getTelLink(person.phoneE164)
    window.location.href = telLink
    setCallSelectorOpen(false)
  }

  const handleWhatsApp = (person: ContactPerson) => {
    const message = `Hello ${person.label}, I want to place an order. Please share today's availability and rates.`
    const whatsappLink = getWhatsAppLink(person.whatsappE164, message)
    window.open(whatsappLink, '_blank')
    setWhatsappSelectorOpen(false)
  }

  const handleDirections = () => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shopConfig.contact.mapQuery)}`
    window.open(mapUrl, '_blank')
  }

  const handleSaveContact = () => {
    const vCard = generateVCard({
      name: shopConfig.name,
      organization: shopConfig.name,
      title: shopConfig.tagline,
      phones: shopConfig.contactPersons.map(p => p.phoneE164.replace(/^91/, '')),
      address: shopConfig.contact.address,
      website: shopConfig.url,
      note: [
        shopConfig.tagline,
        shopConfig.contact.storeHours,
        `Website: ${shopConfig.url}`,
      ].join('\n'),
    })
    downloadVCard(vCard, `${shopConfig.name.replace(/\s+/g, '-')}-contact.vcf`)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shopConfig.name,
          text: `${shopConfig.name} - ${shopConfig.tagline}. Menu, reviews & order: ${shopConfig.url}`,
          url: shopConfig.url,
        })
      } catch (err) {
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }


  return (
    <>
      <div className="space-y-3 w-full max-w-full min-w-0" onClick={(e) => e.stopPropagation()}>
        {/* Row 1: Call Now + Order Online */}
        <div className="grid grid-cols-2 gap-2 w-full min-w-0">
          <Button
            data-call-button
            onClick={(e) => {
              e.stopPropagation()
              setCallSelectorOpen(!callSelectorOpen)
              setWhatsappSelectorOpen(false)
            }}
            className="w-full min-w-0 h-11 text-white font-semibold rounded-full transition-all flex items-center justify-center gap-1.5 sm:gap-2 active:scale-[0.97] touch-manipulation relative overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%)',
              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.4), 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              WebkitTapHighlightColor: 'transparent',
              transform: 'translateY(-1px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(37, 99, 235, 0.5), 0 6px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'
              e.currentTarget.style.background = 'linear-gradient(135deg, #4A90F4 0%, #2E7CE8 50%, #2563EB 100%)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(37, 99, 235, 0.4), 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              e.currentTarget.style.transform = 'translateY(-1px) scale(1)'
              e.currentTarget.style.background = 'linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%)'
            }}
          >
            <Phone className="w-4 h-4 relative z-10" style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))' }} />
            <span className="text-sm font-bold relative z-10 truncate" style={{ fontSize: '14px', textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}>{t('callNow')}</span>
          </Button>

          <Link
            href="/menu?mode=order&type=online"
            onClick={(e) => e.stopPropagation()}
            className="min-w-0 h-11 text-white font-semibold rounded-full transition-all flex items-center justify-center gap-1.5 sm:gap-2 active:scale-[0.97] touch-manipulation relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%)',
              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.4), 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              fontSize: '14px',
              WebkitTapHighlightColor: 'transparent',
              transform: 'translateY(-1px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                '0 12px 28px rgba(37, 99, 235, 0.5), 0 6px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'
              e.currentTarget.style.background = 'linear-gradient(135deg, #4A90F4 0%, #2E7CE8 50%, #2563EB 100%)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                '0 8px 20px rgba(37, 99, 235, 0.4), 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              e.currentTarget.style.transform = 'translateY(-1px) scale(1)'
              e.currentTarget.style.background = 'linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%)'
            }}
          >
            <ShoppingCart className="w-4 h-4 shrink-0 text-white relative z-10" strokeWidth={2.25} aria-hidden />
            <span className="text-sm font-bold truncate relative z-10" style={{ color: '#FFFFFF', fontSize: '14px', textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}>Order Online</span>
          </Link>
        </div>

        {/* Row 2: Dine/Pickup + View Menu */}
        <div className="grid grid-cols-2 gap-2 w-full min-w-0">
          <Link
            href="/order"
            onClick={(e) => e.stopPropagation()}
            className="min-w-0 h-11 bg-white/90 backdrop-blur-md hover:bg-white rounded-2xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 active:scale-[0.97] touch-manipulation border border-slate-200/90"
            style={{
              color: '#0F172A',
              boxShadow: '0 8px 16px rgba(15, 118, 110, 0.22), 0 4px 8px rgba(15, 118, 110, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              borderRadius: '16px',
              fontSize: '14px',
              WebkitTapHighlightColor: 'transparent',
              transform: 'translateY(-1px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                '0 10px 20px rgba(15, 118, 110, 0.28), 0 6px 12px rgba(15, 118, 110, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                '0 8px 16px rgba(15, 118, 110, 0.22), 0 4px 8px rgba(15, 118, 110, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
          >
            <ShoppingBag className="w-4 h-4 shrink-0 text-teal-700" strokeWidth={2.35} aria-hidden />
            <span className="text-sm font-bold truncate" style={{ color: '#0F172A', fontSize: '14px' }}>Dine/Pickup</span>
          </Link>
          <Link
            href="/menu"
            onClick={(e) => e.stopPropagation()}
            className="min-w-0 h-11 bg-white/90 backdrop-blur-md hover:bg-white rounded-2xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 active:scale-[0.97] touch-manipulation border border-slate-200/90"
            style={{
              color: '#0F172A',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              borderRadius: '16px',
              fontSize: '14px',
              WebkitTapHighlightColor: 'transparent',
              transform: 'translateY(-1px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2), 0 6px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
          >
            <List className="w-4 h-4 shrink-0 text-slate-700" strokeWidth={2.5} aria-hidden />
            <span className="text-sm font-bold truncate" style={{ color: '#0F172A', fontSize: '14px' }}>View Menu</span>
          </Link>
        </div>

        {/* Row 3: Payment + Instagram */}
        <div className="grid grid-cols-2 gap-2 w-full min-w-0">
          {onOpenPayments && (
            <div className="min-w-0 relative">
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  onOpenPayments()
                }}
                className="w-full min-w-0 h-11 text-white font-semibold rounded-full transition-all flex items-center justify-center gap-1.5 sm:gap-2 active:scale-[0.97] touch-manipulation relative overflow-hidden group"
                style={{
                  background:
                    'radial-gradient(circle at 30% 30%, rgb(21, 124, 130) 0%, rgb(15, 118, 110) 40%, rgb(17, 19, 21) 100%)',
                  boxShadow:
                    '0 8px 20px rgba(21, 124, 130, 0.4), 0 4px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                  WebkitTapHighlightColor: 'transparent',
                  transform: 'translateY(-1px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    '0 12px 28px rgba(21, 124, 130, 0.5), 0 6px 12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'
                  e.currentTarget.style.background =
                    'radial-gradient(circle at 30% 30%, rgb(25, 140, 145) 0%, rgb(20, 130, 120) 40%, rgb(20, 25, 30) 100%)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    '0 8px 20px rgba(21, 124, 130, 0.4), 0 4px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                  e.currentTarget.style.transform = 'translateY(-1px) scale(1)'
                  e.currentTarget.style.background =
                    'radial-gradient(circle at 30% 30%, rgb(21, 124, 130) 0%, rgb(15, 118, 110) 40%, rgb(17, 19, 21) 100%)'
                }}
              >
                <Image
                  src="/icons8-bhim-48.png"
                  alt="Payment"
                  width={16}
                  height={16}
                  className="w-4 h-4 object-contain relative z-10"
                  style={{ filter: 'brightness(0) invert(1) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}
                />
                <span
                  className="text-sm font-bold relative z-10 truncate"
                  style={{ fontSize: '14px', textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}
                >
                  {t('openPayment')}
                </span>
              </Button>
            </div>
          )}
          <Button
            data-instagram-button
            onClick={(e) => {
              e.stopPropagation()
              setInstagramSelectorOpen(!instagramSelectorOpen)
              setCallSelectorOpen(false)
              setWhatsappSelectorOpen(false)
            }}
            className="w-full min-w-0 h-11 bg-white/90 hover:bg-white text-slate-900 font-semibold rounded-2xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 active:scale-[0.97] touch-manipulation relative overflow-hidden border border-slate-200/90"
            style={{
              boxShadow: '0 8px 16px rgba(225, 48, 108, 0.16), 0 4px 8px rgba(15, 23, 42, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              borderRadius: '16px',
              fontSize: '14px',
              WebkitTapHighlightColor: 'transparent',
              transform: 'translateY(-1px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                '0 10px 20px rgba(225, 48, 108, 0.22), 0 6px 12px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                '0 8px 16px rgba(225, 48, 108, 0.16), 0 4px 8px rgba(15, 23, 42, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
          >
            <Image
              src="/instagram-logo-transparent.webp"
              alt=""
              width={22}
              height={22}
              className="h-[22px] w-[22px] shrink-0 object-contain"
            />
            <span className="text-sm font-bold truncate" style={{ color: '#0F172A', fontSize: '14px' }}>Instagram</span>
          </Button>
        </div>

        {/* Row 4: Zomato left, Swiggy right */}
        <div className="grid grid-cols-2 gap-2 w-full min-w-0">
          {shopConfig.social?.zomato && (
            <Link
              href={shopConfig.social.zomato}
              onClick={(e) => e.stopPropagation()}
              className="min-w-0 h-11 rounded-2xl transition-all flex items-center justify-center active:scale-[0.97] touch-manipulation hover:opacity-95"
              style={{
                background: '#E23744',
                boxShadow: '0 4px 12px rgba(226, 55, 68, 0.4), 0 2px 6px rgba(0, 0, 0, 0.1)',
                borderRadius: '16px',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              <Image
                src="/Zomato_Logo_1.png"
                alt="Zomato"
                width={104}
                height={28}
                className="h-[28px] w-auto object-contain"
                priority
              />
            </Link>
          )}
          {shopConfig.social?.swiggy && (
            <Link
              href={shopConfig.social.swiggy}
              onClick={(e) => e.stopPropagation()}
              className="min-w-0 h-11 rounded-2xl transition-all flex items-center justify-center active:scale-[0.97] touch-manipulation hover:opacity-95 border-2"
              style={{
                background: '#FFFFFF',
                borderColor: '#FC8019',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.16), 0 2px 6px rgba(15, 23, 42, 0.1)',
                borderRadius: '16px',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              <Image
                src="/image copy.png"
                alt="Swiggy"
                width={92}
                height={24}
                className="h-[24px] w-auto object-contain"
                priority
              />
            </Link>
          )}
        </div>

        {/* Row 4: Reviews, Location */}
        <div className="grid grid-cols-2 gap-2 w-full min-w-0">
          <Link
            href="/reviews"
            onClick={(e) => e.stopPropagation()}
            className="min-w-0 h-11 bg-white/90 backdrop-blur-md hover:bg-white rounded-2xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 active:scale-[0.97] touch-manipulation"
            style={{
              color: '#0F172A',
              boxShadow: '0 8px 16px rgba(234, 179, 8, 0.25), 0 4px 8px rgba(234, 179, 8, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              borderRadius: '16px',
              fontSize: '14px',
              WebkitTapHighlightColor: 'transparent',
              transform: 'translateY(-1px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(234, 179, 8, 0.3), 0 6px 12px rgba(234, 179, 8, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(234, 179, 8, 0.25), 0 4px 8px rgba(234, 179, 8, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
          >
            <Star className="w-4 h-4" style={{ color: '#EAB308' }} fill="#EAB308" />
            <span className="text-sm font-bold truncate" style={{ color: '#0F172A', fontSize: '14px' }}>Reviews</span>
          </Link>
          <Button
            onClick={handleDirections}
            className="w-full min-w-0 h-11 bg-white/90 backdrop-blur-md hover:bg-white rounded-2xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 active:scale-[0.97] touch-manipulation"
            style={{
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              borderRadius: '16px',
              fontSize: '14px',
              WebkitTapHighlightColor: 'transparent',
              transform: 'translateY(-1px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2), 0 6px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
          >
            <MapPin className="w-4 h-4" style={{ color: '#EF4444', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))' }} />
            <span className="text-sm font-bold truncate" style={{ color: '#0F172A', fontSize: '14px' }}>Location</span>
          </Button>
        </div>

        {/* Bottom Row: Save Contact & Gallery – equal width, responsive */}
        <div className="grid grid-cols-2 gap-2 w-full min-w-0 actions-row-bottom">
          <Button
            onClick={handleSaveContact}
            className="w-full min-w-0 h-11 bg-white/90 hover:bg-white backdrop-blur-md text-slate-700 rounded-2xl border-2 border-teal-500/70 hover:border-teal-600/90 relative overflow-hidden transition-all touch-manipulation"
            style={{
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              borderRadius: '16px',
              fontSize: '14px',
              WebkitTapHighlightColor: 'transparent',
              transform: 'translateY(-1px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(21, 124, 130, 0.25), 0 6px 12px rgba(21, 124, 130, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
          >
            {/* Animated border highlight glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-teal-400/30 to-transparent animate-[shimmer_2s_infinite] pointer-events-none" />
            <div className="relative z-10 flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              <span className="text-sm font-bold truncate" style={{ fontSize: '14px' }}>{t('saveContact')}</span>
            </div>
          </Button>
          <Link 
            href="/gallery" 
            className="min-w-0 h-11 bg-white/90 backdrop-blur-md hover:bg-white rounded-2xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 active:scale-[0.97] touch-manipulation"
            style={{ 
              color: '#0F172A',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              borderRadius: '16px',
              WebkitTapHighlightColor: 'transparent',
              fontSize: '14px',
              transform: 'translateY(-1px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2), 0 6px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
          >
            <div className="flex items-center -space-x-1.5 relative z-10">
              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center overflow-hidden relative"
                style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
              >
                <img
                  src="/gallery/unnamed.webp"
                  alt="Gallery"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center overflow-hidden relative"
                style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
              >
                <img
                  src="/gallery/unnamed (1).webp"
                  alt="Gallery"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>
            <span className="text-sm font-bold truncate" style={{ color: '#0F172A', fontSize: '14px' }}>Gallery</span>
          </Link>
        </div>


        {/* Call Selector - Bottom Pop-out */}
        <AnimatePresence>
          {callSelectorOpen && (
            <>
              {/* Popup */}
              <motion.div
                ref={callSelectorRef}
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="popup-selector fixed bottom-0 left-0 right-0 z-[9999] bg-white rounded-3xl shadow-2xl p-6 pb-8 m-4 mb-6"
                style={{ 
                  paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
                  maxHeight: '80vh'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="text-base font-semibold text-slate-800">Select Number to Call</div>
                  <button
                    onClick={() => setCallSelectorOpen(false)}
                    className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
                <div className="flex gap-4 justify-center flex-wrap">
                  {shopConfig.contactPersons.map((person) => (
                    <motion.button
                      key={person.label}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: shopConfig.contactPersons.indexOf(person) * 0.1 }}
                      onClick={() => handleCall(person)}
                      className="flex flex-col items-center gap-2 touch-manipulation"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-mango-green to-mango-greenSoft rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                        <Phone className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800 text-center">{person.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* WhatsApp Selector - Bottom Pop-out */}
        <AnimatePresence>
          {whatsappSelectorOpen && (
            <>
              {/* Popup */}
              <motion.div
                ref={whatsappSelectorRef}
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="popup-selector fixed bottom-0 left-0 right-0 z-[9999] bg-white rounded-3xl shadow-2xl p-6 pb-8 m-4 mb-6"
                style={{ 
                  paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
                  maxHeight: '80vh'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="text-base font-semibold text-slate-800">Select Number for WhatsApp</div>
                  <button
                    onClick={() => setWhatsappSelectorOpen(false)}
                    className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
                <div className="flex gap-4 justify-center flex-wrap">
                  {shopConfig.contactPersons.map((person) => (
                    <motion.button
                      key={person.label}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: shopConfig.contactPersons.indexOf(person) * 0.1 }}
                      onClick={() => handleWhatsApp(person)}
                      className="flex flex-col items-center gap-2 touch-manipulation"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-[#25D366] to-[#20BA5A] rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="white">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-slate-800 text-center">{person.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Instagram Selector - Bottom Pop-out */}
        <AnimatePresence>
          {instagramSelectorOpen && (
            <>
              {/* Popup */}
              <motion.div
                ref={instagramSelectorRef}
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="popup-selector fixed bottom-0 left-0 right-0 z-[9999] bg-white rounded-3xl shadow-2xl p-6 pb-8 m-4 mb-6"
                style={{ 
                  paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
                  maxHeight: '80vh'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="text-base font-bold text-slate-800">Follow us on Instagram</div>
                  <button
                    onClick={() => setInstagramSelectorOpen(false)}
                    className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
                <div className="flex gap-6 justify-center flex-wrap">
                  {shopConfig.social?.instagram && (
                    <motion.button
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      onClick={() => {
                        window.open(shopConfig.social.instagram, '_blank', 'noopener,noreferrer')
                        setInstagramSelectorOpen(false)
                      }}
                      className="flex flex-col items-center gap-3 touch-manipulation"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform overflow-hidden p-1"
                        style={{
                          background: 'linear-gradient(135deg, #833AB4, #FD1D1D, #FCB045)',
                        }}
                      >
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                          <Image
                            src="/instagram-logo-transparent.webp"
                            alt="Instagram"
                            width={72}
                            height={72}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-slate-800 mb-1">Follow @mangojammu</div>
                        <div className="text-xs text-slate-600">@mangojammu</div>
                      </div>
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  )
})

ActionsRow.displayName = 'ActionsRow'

export default ActionsRow
