'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ChevronLeft, ChevronRight, X, Image as ImageIcon, Video, Share2 } from 'lucide-react'
import { shopConfig } from '../shops/honeys-fresh-n-frozen/config'

// Gallery images from public/gallery folder
const galleryImages = [
  '/gallery/sonnet-gallery-01.jpeg',
  '/gallery/sonnet-gallery-02.jpeg',
  '/gallery/sonnet-gallery-03.jpeg',
  '/gallery/sonnet-gallery-04.jpeg',
  '/gallery/sonnet-gallery-05.jpeg',
  '/gallery/sonnet-gallery-06.jpeg',
  '/gallery/sonnet-gallery-07.jpeg',
  '/gallery/sonnet-gallery-08.jpeg',
  '/gallery/sonnet-gallery-09.jpeg',
  '/gallery/sonnet-gallery-10.jpeg',
]

// No videos – show banner when on Videos tab
const galleryVideos: { src: string; thumbnail: string; title: string }[] = []

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [imageLoading, setImageLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      galleryImages.slice(0, 6).forEach((src) => {
        const img = document.createElement('img')
        img.src = src
        img.loading = 'eager'
      })
    }
  }, [])

  useEffect(() => {
    if (lightboxOpen && typeof window !== 'undefined') {
      setImageLoading(true)
      const preloadIndexes = [
        photoIndex === 0 ? galleryImages.length - 1 : photoIndex - 1,
        photoIndex,
        photoIndex === galleryImages.length - 1 ? 0 : photoIndex + 1,
      ]
      preloadIndexes.forEach((idx) => {
        const img = document.createElement('img')
        img.src = galleryImages[idx]
        img.onload = () => {
          if (idx === photoIndex) {
            setImageLoading(false)
          }
        }
      })
    }
  }, [lightboxOpen, photoIndex])

  const openLightbox = (index: number) => {
    setPhotoIndex(index)
    setLightboxOpen(true)
    setImageLoading(true)
  }

  const goPrev = () => {
    setImageLoading(true)
    setPhotoIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))
  }

  const goNext = () => {
    setImageLoading(true)
    setPhotoIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))
  }

  const handleShareContact = async () => {
    const shareText = `${shopConfig.name} - ${shopConfig.tagline}. Call ${shopConfig.contact.officePhone}. ${shopConfig.contact.address}`
    if (navigator.share) {
      try {
        await navigator.share({ title: shopConfig.name, text: shareText, url: shopConfig.url })
        return
      } catch {
      }
    }
    await navigator.clipboard.writeText(`${shareText}\n${shopConfig.url}`)
    alert('Contact copied to clipboard.')
  }

  return (
    <>
      <main className="relative min-h-screen overflow-x-hidden pb-[max(5rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]" style={{ backgroundColor: '#efd8bc' }}>
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-16 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#B07A49]/20 blur-3xl" />
          <div className="absolute top-[18rem] -left-20 h-64 w-64 rounded-full bg-mango-green/12 blur-3xl" />
          <div className="absolute bottom-[12rem] right-[-4rem] h-72 w-72 rounded-full bg-white/45 blur-3xl" />
        </div>

        <div
          className="sticky top-0 z-20 backdrop-blur-xl"
          style={{
            paddingTop: 'max(0.45rem, env(safe-area-inset-top))',
            background: 'linear-gradient(180deg, rgba(255,248,238,0.94) 0%, rgba(246,230,209,0.72) 100%)',
          }}
        >
          <div className="max-w-md mx-auto px-1 pb-3 relative z-10">
            <div className="rounded-[28px] border border-[#B07A49]/25 bg-white/70 shadow-[0_20px_40px_rgba(73,46,26,0.12)] px-3 sm:px-4 py-3.5">
              <div className="relative flex items-center justify-between">
                <Link
                  href="/"
                  prefetch
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[#B07A49]/30 bg-white transition-colors hover:bg-[#f8ead8] active:scale-[0.97] touch-manipulation shadow-[0_10px_20px_rgba(73,46,26,0.10)]"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      sessionStorage.setItem('fromGallery', 'true')
                    }
                  }}
                >
                  <ArrowLeft className="h-5 w-5 shrink-0 text-[#302318]" strokeWidth={2.25} aria-hidden />
                </Link>

                <div className="pointer-events-none absolute inset-x-0 text-center">
                  <h1 className="text-lg sm:text-xl font-bold text-[#302318] tracking-tight">Gallery</h1>
                </div>

                <div className="rounded-full border border-[#B07A49]/30 bg-white px-3 py-1.5 text-xs font-semibold text-[#6f5137] shadow-[0_10px_20px_rgba(73,46,26,0.10)]">
                  {activeTab === 'photos' ? `${galleryImages.length} Photos` : `${galleryVideos.length} Videos`}
                </div>
              </div>

              <div className="mt-3 pl-[3px]">
                <p className="text-sm text-[#6f5137]">Fresh kitchen moments at The Sonnet Cafe</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto py-4 sm:py-6 relative z-10">
          <div className="section-shell section-shell-light">
            <div className="section-shell-inner p-5 sm:p-6">
              <div className="mb-5">
                <div className="section-title-accent mb-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#302318]">Gallery Collection</h2>
                </div>
                <p className="text-sm text-[#6f5137]">Browse cafe, bakery and menu moments from The Sonnet Cafe.</p>
                <button
                  type="button"
                  onClick={handleShareContact}
                  className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center gap-2.5 rounded-2xl bg-white text-[#7B4A2D] font-bold border border-[#B07A49]/45 shadow-[0_14px_28px_rgba(73,46,26,0.12)]"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>

              <div className="flex gap-3 mb-5">
                <motion.button
                  onClick={() => setActiveTab('photos')}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 px-5 py-3.5 rounded-2xl font-semibold text-sm sm:text-base transition-all ${
                    activeTab === 'photos'
                      ? 'bg-mango-green text-white shadow-[0_16px_30px_rgba(30,77,61,0.28)]'
                      : 'bg-white text-[#6f5137] hover:bg-[#f8ead8] border border-[#B07A49]/30'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2.5">
                    <ImageIcon className={`w-5 h-5 ${activeTab === 'photos' ? 'text-white' : 'text-[#6f5137]'}`} strokeWidth={2.5} />
                    Photos
                  </span>
                </motion.button>
                <motion.button
                  onClick={() => setActiveTab('videos')}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 px-5 py-3.5 rounded-2xl font-semibold text-sm sm:text-base transition-all ${
                    activeTab === 'videos'
                      ? 'bg-mango-green text-white shadow-[0_16px_30px_rgba(30,77,61,0.28)]'
                      : 'bg-white text-[#6f5137] hover:bg-[#f8ead8] border border-[#B07A49]/30'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2.5">
                    <Video className={`w-5 h-5 ${activeTab === 'videos' ? 'text-white' : 'text-[#6f5137]'}`} strokeWidth={2.5} />
                    Videos
                  </span>
                </motion.button>
              </div>

              {activeTab === 'photos' && galleryImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  {galleryImages.map((imageSrc, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      className="rounded-[22px] shadow-[0_18px_34px_rgba(0,0,0,0.24)] aspect-square overflow-hidden cursor-pointer group hover:shadow-xl hover:-translate-y-1 transition-all relative border border-white/10"
                      onClick={() => openLightbox(index)}
                    >
                      <Image
                        src={imageSrc}
                        alt={`Gallery image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 33vw"
                        priority={index < 4}
                        loading={index < 4 ? 'eager' : 'lazy'}
                        quality={85}
                      />
                      <div className="absolute inset-[1px] rounded-[21px] border border-white/10 z-[1]" />
                      <div className="absolute inset-x-5 top-3 h-8 rounded-full bg-white/10 blur-2xl z-[1]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent group-hover:from-black/55 transition-colors" />
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'videos' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[24px] border border-slate-600/50 bg-slate-800/60 p-8 sm:p-10 text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700/80 flex items-center justify-center">
                    <Video className="w-8 h-8 text-slate-400" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No videos yet</h3>
                  <p className="text-sm text-slate-400 max-w-xs mx-auto">
                    Video content will appear here when available. Check back later.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/98 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <motion.div
              key={photoIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
              <Image
                src={galleryImages[photoIndex]}
                alt={`Gallery image ${photoIndex + 1}`}
                width={1600}
                height={1600}
                className={`w-full h-auto max-h-[90vh] object-contain rounded-xl transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                priority
                quality={90}
                unoptimized
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <span className="text-white text-sm font-medium">
                  {photoIndex + 1} / {galleryImages.length}
                </span>
              </div>
            </motion.div>
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    goPrev()
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    goNext()
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
