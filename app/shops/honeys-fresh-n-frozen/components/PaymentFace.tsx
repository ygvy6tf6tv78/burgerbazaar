'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, ArrowLeft, Check, Shield, Lock, Download, Share2, QrCode } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '../../../contexts/LanguageContext'
import { shopConfig } from '../config'

interface PaymentFaceProps {
  upiId: string
  upiName: string
  amountINR?: number
  upiQrImageUrl?: string
  scannerImage?: string
  bank?: {
    bankName: string
    accountNumberMasked: string
    ifsc: string
    accountHolder: string
    branchName?: string
  }
  onBack: () => void
}

// Build UPI deep link - Secure and properly encoded
function buildUpiLink(upiId: string, upiName: string, amount?: number): string {
  // URLSearchParams automatically encodes special characters like @
  const params = new URLSearchParams({
    pa: upiId, // Payee Address (UPI ID) - @ symbol will be encoded as %40
    pn: upiName, // Payee Name
    tn: `Payment to ${upiName}`,
    cu: 'INR', // Currency
  })
  if (amount && amount > 0) {
    params.set('am', amount.toString())
  }
  return `upi://pay?${params.toString()}`
}

// Copy to clipboard with toast
function useCopyToClipboard() {
  const [copied, setCopied] = useState(false)

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
    }
  }

  return { copy, copied }
}

export default function PaymentFace({
  upiId,
  upiName,
  amountINR,
  upiQrImageUrl,
  scannerImage,
  bank,
  onBack,
}: PaymentFaceProps) {
  const { t } = useLanguage()
  const { copy: copyUpi, copied: upiCopied } = useCopyToClipboard()
  const { copy: copyBank, copied: bankCopied } = useCopyToClipboard()
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [scannerModalOpen, setScannerModalOpen] = useState(false)
  const [canShare, setCanShare] = useState(false)

  const upiLink = buildUpiLink(upiId, upiName, amountINR)

  // Same QR image as shown on site: custom image if set, else generated
  const getQRCodeUrl = () => {
    if (upiQrImageUrl) return upiQrImageUrl
    const encodedUpiLink = encodeURIComponent(upiLink)
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedUpiLink}&bgcolor=ffffff&color=000000&margin=1`
  }
  const qrCodeUrl = getQRCodeUrl()

  // Current QR image shown in scanner modal – use this for share/embed so shared image matches site
  const displayedQRImageUrl = upiQrImageUrl || scannerImage || shopConfig.payment.scannerImage || qrCodeUrl
  const getAbsoluteQRUrlForShare = () => {
    if (typeof window === 'undefined') return displayedQRImageUrl
    const url = displayedQRImageUrl
    return url.startsWith('http') ? url : `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`
  }

  // Check if Web Share API is available
  useEffect(() => {
    setCanShare(!!navigator.share && !!navigator.canShare)
  }, [])

  // Download QR Code
  const handleDownloadQR = async () => {
    try {
      // Fetch QR code image and download
      const response = await fetch(qrCodeUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `upi-qr-${upiId.replace('@', '-')}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      // Fallback: create img element to convert to canvas
      const img = new window.Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (ctx) {
          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)
          canvas.toBlob((blob) => {
            if (blob) {
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `upi-qr-${upiId.replace('@', '-')}.png`
              document.body.appendChild(a)
              a.click()
              window.URL.revokeObjectURL(url)
              document.body.removeChild(a)
            }
          }, 'image/png')
        }
      }
      img.src = qrCodeUrl
    }
  }

  // Share QR Code: use same image as displayed on site so embed matches current QR
  const handleShareQR = async () => {
    const shareText = `Scan to pay ${upiName}\nUPI: ${upiId}`
    const shareImageUrl = getAbsoluteQRUrlForShare()

    try {
      if (canShare && navigator.share) {
        let blob: Blob
        try {
          const response = await fetch(shareImageUrl)
          if (!response.ok) throw new Error('Fetch failed')
          blob = await response.blob()
        } catch {
          // Fallback to generated QR if custom image fetch fails (e.g. CORS)
          const fallback = await fetch(qrCodeUrl)
          blob = await fallback.blob()
        }
        const file = new File([blob], `upi-qr-${upiId.replace('@', '-')}.png`, { type: blob.type || 'image/png' })
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'UPI Payment QR Code',
            text: shareText,
            files: [file],
          })
          return
        }
      }
      const encoded = encodeURIComponent(shareText)
      window.open(`https://wa.me/?text=${encoded}`, '_blank')
    } catch (error) {
      const encoded = encodeURIComponent(shareText)
      window.open(`https://wa.me/?text=${encoded}`, '_blank')
    }
  }

  const handleOpenUpiApp = () => {
    setPaymentModalOpen(false)
    window.location.href = upiLink

    // If no UPI app handles the intent, bring back the copy/manual-pay option.
    window.setTimeout(() => {
      if (document.visibilityState === 'visible') setPaymentModalOpen(true)
    }, 1600)
  }

  // Build Paytm app deep link with UPI ID - Secure and optimized
  const buildPaytmLink = () => {
    // URLSearchParams automatically encodes @ symbol as %40
    const params = new URLSearchParams({
      pa: upiId, // Payee Address (UPI ID) - Same account for all apps
      pn: upiName, // Payee Name
      cu: 'INR', // Currency
    })
    if (amountINR && amountINR > 0) {
      params.set('am', amountINR.toString()) // Amount
    }
    // Paytm deep link - opens Paytm app directly with pre-filled UPI ID
    return `paytmmp://pay?${params.toString()}`
  }

  // Build Google Pay deep link - Secure and optimized
  const buildGooglePayLink = () => {
    // URLSearchParams automatically encodes @ symbol as %40
    const params = new URLSearchParams({
      pa: upiId, // Payee Address (UPI ID) - Same account for all apps
      pn: upiName, // Payee Name
      cu: 'INR', // Currency
    })
    if (amountINR && amountINR > 0) {
      params.set('am', amountINR.toString()) // Amount
    }
    // Google Pay deep link - opens Google Pay app directly with pre-filled UPI ID
    return `tez://upi/pay?${params.toString()}`
  }

  // Build PhonePe UPI link - Secure and optimized
  const buildPhonePeLink = () => {
    // URLSearchParams automatically encodes @ symbol as %40
    const params = new URLSearchParams({
      pa: upiId, // Payee Address (UPI ID) - Same account for all apps
      pn: upiName, // Payee Name
      cu: 'INR', // Currency
    })
    if (amountINR && amountINR > 0) {
      params.set('am', amountINR.toString()) // Amount
    }
    // PhonePe deep link - opens PhonePe app directly with pre-filled UPI ID
    return `phonepe://pay?${params.toString()}`
  }

  const handlePayWithPaytm = () => {
    try {
      const paytmLink = buildPaytmLink()
      setPaymentModalOpen(false)
      
      // Open Paytm app with UPI ID pre-filled
      window.location.href = paytmLink
      
      // Smart fallback: if Paytm app doesn't open, use standard UPI link
      setTimeout(() => {
        if (document.hasFocus()) {
          // App didn't open, fallback to standard UPI
          window.open(upiLink, '_blank')
        }
      }, 1500)
    } catch (error) {
      // Fallback to standard UPI link on error
      window.open(upiLink, '_blank')
      setPaymentModalOpen(false)
    }
  }

  const handlePayWithGooglePay = () => {
    try {
      const googlePayLink = buildGooglePayLink()
      setPaymentModalOpen(false)
      
      // Open Google Pay app with UPI ID pre-filled
      window.location.href = googlePayLink
      
      // Smart fallback: if Google Pay app doesn't open, use standard UPI link
      setTimeout(() => {
        if (document.hasFocus()) {
          // App didn't open, fallback to standard UPI
          window.open(upiLink, '_blank')
        }
      }, 1500)
    } catch (error) {
      // Fallback to standard UPI link on error
      window.open(upiLink, '_blank')
      setPaymentModalOpen(false)
    }
  }

  const handlePayWithPhonePe = () => {
    try {
      const phonePeLink = buildPhonePeLink()
      setPaymentModalOpen(false)
      
      // Open PhonePe app with UPI ID pre-filled
      window.location.href = phonePeLink
      
      // Smart fallback: if PhonePe app doesn't open, use standard UPI link
      setTimeout(() => {
        if (document.hasFocus()) {
          // App didn't open, fallback to standard UPI
          window.open(upiLink, '_blank')
        }
      }, 1500)
    } catch (error) {
      // Fallback to standard UPI link on error
      window.open(upiLink, '_blank')
      setPaymentModalOpen(false)
    }
  }

  const handleCopyUpi = () => {
    copyUpi(upiId)
  }

  const handleCopyBank = () => {
    if (bank) {
      const bankDetails = `Bank: ${bank.bankName}${bank.branchName ? `\nBranch: ${bank.branchName}` : ''}\nAccount: ${bank.accountNumberMasked}\nIFSC: ${bank.ifsc}\nHolder: ${bank.accountHolder}`
      copyBank(bankDetails)
    }
  }

  // Handle Escape key to go back
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBack()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onBack])

  return (
    <div
      className="rounded-[24px] shadow-2xl overflow-y-auto border border-slate-800 relative w-full"
      style={{
        background: 'radial-gradient(circle at 50% 50%, #1FB6D9 0%, #0E7490 50%, #111315 100%)',
        backfaceVisibility: 'hidden',
        willChange: 'transform',
        minHeight: '580px',
        boxSizing: 'border-box'
      }}
    >
      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 py-6 text-center" style={{ minHeight: '580px', paddingBottom: '2rem', pointerEvents: 'auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-black text-white mb-2 tracking-tight drop-shadow-lg">
              {t('securePayment')}
            </h2>
            <div className="flex items-center justify-center gap-2 text-white/70 text-xs">
              <Lock className="w-3.5 h-3.5" />
              <span>{t('secureEncrypted')}</span>
            </div>
          </motion.div>

          {/* Pay via Scanner Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.3 }}
            className="mb-3"
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setScannerModalOpen(true)
              }}
              className="w-full bg-white hover:bg-gray-50 font-bold py-3 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 cursor-pointer relative z-20 touch-manipulation border-[1.5px]"
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                borderColor: 'rgba(31, 182, 217, 0.35)',
                color: '#0E7490',
                boxShadow: '0 2px 8px rgba(14, 116, 144, 0.08)'
              }}
              aria-label="Pay via Scanner"
            >
              <QrCode className="w-5 h-5" style={{ color: '#1FB6D9' }} />
              <span className="pointer-events-none">Pay via Scanner</span>
            </motion.button>
          </motion.div>

          {/* Payment Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="mb-3 relative z-20"
          >
            {/* Pay via UPI Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleOpenUpiApp()
              }}
              className="w-full text-white font-bold py-3.5 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 cursor-pointer relative z-30 touch-manipulation"
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                background: 'linear-gradient(135deg, #0E7490 0%, #1FB6D9 50%, #0E7490 100%)',
                boxShadow: '0 4px 16px rgba(14, 116, 144, 0.3), 0 2px 8px rgba(14, 116, 144, 0.2)'
              }}
              aria-label="Pay via UPI"
            >
              {/* Horizontal Payment Logos */}
              <div className="flex items-center gap-1.5">
                <Image
                  src="/logos/icons8-paytm-48.png"
                  alt="Paytm"
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain"
                  style={{ filter: 'brightness(1.1) contrast(1.1)' }}
                  unoptimized
                />
                <Image
                  src="/logos/icons8-google-pay-48.png"
                  alt="Google Pay"
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain"
                  style={{ filter: 'brightness(1.1) contrast(1.1)' }}
                  unoptimized
                />
                <Image
                  src="/logos/icons8-phone-pe-48.png"
                  alt="PhonePe"
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain"
                  style={{ filter: 'brightness(1.1) contrast(1.1)' }}
                  unoptimized
                />
              </div>
              <span>{t('payViaUPI')}</span>
            </motion.button>
          </motion.div>

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            className="mb-4 relative z-20"
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onBack()
              }}
              className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-2.5 px-4 rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer relative z-30 touch-manipulation"
              style={{ WebkitTapHighlightColor: 'transparent' }}
              aria-label={t('backToDetails')}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('backToDetails')}</span>
            </motion.button>
          </motion.div>

          {/* Helper Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            className="mt-4"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-mango-green" />
              <p className="text-white/80 text-xs font-medium">
                {t('securePaymentGateway')}
              </p>
            </div>
            <p className="text-white/60 text-xs">
              {t('worksWith')}
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* OneLink Branding - Bottom Edge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.3 }}
        className="absolute bottom-0 left-0 right-0 pb-3 pt-2 px-4"
      >
        <div className="flex items-center justify-center">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border"
            style={{
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              background: 'linear-gradient(135deg, #f0fdfa 0%, #ecfeff 100%)',
              borderColor: '#5eead4'
            }}
          >
            <Shield className="w-3.5 h-3.5" style={{ color: '#06b6d4' }} />
            <span 
              className="text-xs font-semibold flex items-center gap-1.5"
              style={{ 
                color: '#06b6d4',
                fontSize: '12px',
                fontWeight: 600
              }}
            >
              Secure payment gateway
              <span style={{ color: '#94a3b8' }}>•</span>
              OneLink
            </span>
            <Image
              src="/gallery/onelinklogo.png"
              alt="OneLink Logo"
              width={32}
              height={16}
              className="opacity-100 object-contain"
              quality={100}
              priority
            />
          </div>
        </div>
      </motion.div>

      {/* Payment Options Modal - Same Card */}
      <AnimatePresence>
        {paymentModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 rounded-[28px] flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(31, 182, 217, 0.95) 0%, rgba(14, 116, 144, 0.95) 50%, rgba(17, 19, 21, 0.98) 100%)',
              backdropFilter: 'blur(10px)',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setPaymentModalOpen(false)
              }
            }}
          >
            {/* Grain overlay */}
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none rounded-[28px]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-50 w-full max-w-md px-6"
              onClick={(e) => e.stopPropagation()}
              style={{ pointerEvents: 'auto' }}
            >
              <h3 className="text-2xl font-black text-white mb-4 tracking-tight drop-shadow-lg text-center">
                Pay via UPI ID
              </h3>
              
              <div className="mb-6 relative z-30 space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                  <p className="text-white/70 text-xs mb-3 text-center tracking-wide uppercase font-medium">UPI ID</p>
                  
                  {/* UPI ID Display - Full Width */}
                  <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
                    <p className="text-white font-bold text-xl text-center break-all select-all" style={{ wordBreak: 'break-all', lineHeight: '1.5' }}>
                      {upiId}
                    </p>
                    <p className="mt-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-white/55">
                      PhonePe Business · MID {shopConfig.payment.merchantId}
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleOpenUpiApp()
                    }}
                    className="mb-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-extrabold text-[#5F259F] shadow-lg transition-all"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                    aria-label="Open UPI app"
                  >
                    <Image src="/logos/icons8-phone-pe-48.png" alt="" width={22} height={22} className="h-[22px] w-[22px] object-contain" aria-hidden />
                    <span>Open UPI App</span>
                  </motion.button>
                  
                  {/* Copy Button - Full Width */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      copyUpi(upiId)
                    }}
                    className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-3 px-5 rounded-xl border border-white/30 transition-all cursor-pointer flex items-center justify-center gap-2 mb-4"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                    aria-label="Copy UPI ID"
                  >
                    {upiCopied ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span className="text-sm font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        <span className="text-sm font-bold">Copy UPI ID</span>
                      </>
                    )}
                  </motion.button>
                  
                  {/* Instructions */}
                  <div className="grid grid-cols-1 gap-2.5 text-white/80 text-xs pt-2 border-t border-white/10">
                    <div className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                      <span>Open any UPI app (GPay, PhonePe, Paytm, BHIM).</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                      <span>Choose &quot;Pay to UPI ID&quot; and paste the ID.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                      <span>Enter amount and complete the payment.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setPaymentModalOpen(false)
                }}
                className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-2.5 px-4 rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer relative z-30 touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <span>{t('close')}</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanner Modal Overlay - Same Card */}
      <AnimatePresence>
        {scannerModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 rounded-[28px] flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(31, 182, 217, 0.95) 0%, rgba(14, 116, 144, 0.95) 50%, rgba(17, 19, 21, 0.98) 100%)',
              backdropFilter: 'blur(10px)',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setScannerModalOpen(false)
              }
            }}
          >
            {/* Grain overlay */}
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none rounded-[28px]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-50 w-full max-w-sm px-4 py-3 flex flex-col"
              onClick={(e) => e.stopPropagation()}
              style={{ pointerEvents: 'auto', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <h3 className="text-xl font-black text-white mb-3 tracking-tight drop-shadow-lg text-center">
                Scan to Pay
              </h3>
              
              {/* Scanner Image */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 mb-3">
                <div className="flex justify-center mb-2">
                  <Image
                    src={displayedQRImageUrl}
                    alt="Payment Scanner"
                    width={250}
                    height={250}
                    className="w-full max-w-[250px] h-auto object-contain rounded-2xl"
                    priority
                    unoptimized
                  />
                </div>
                <p className="text-white/80 text-xs text-center">
                  Open your payment app and scan this code to make a payment
                </p>
              </div>

              {/* Share QR – primary action */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleShareQR()
                }}
                className="w-full bg-white hover:bg-gray-50 font-bold py-2.5 px-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 cursor-pointer relative z-30 touch-manipulation border-[1.5px] mb-2"
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  borderColor: 'rgba(31, 182, 217, 0.35)',
                  color: '#0E7490',
                  boxShadow: '0 2px 8px rgba(14, 116, 144, 0.08)'
                }}
                aria-label="Share QR Code"
              >
                <Share2 className="w-4 h-4" style={{ color: '#1FB6D9' }} />
                <span className="text-sm">Share QR</span>
              </motion.button>

              {/* Close Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setScannerModalOpen(false)
                }}
                className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-2.5 px-4 rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer relative z-30 touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
                aria-label="Close Scanner"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Close</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
