'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowRight, Share2 } from 'lucide-react'
import { shopConfig } from '../config'

// Gallery images from public/gallery folder
const galleryImages = [
  '/burger-bazaar-smash.jpg',
  '/burger-bazaar-veg.jpg',
  '/burger-bazaar-fries.jpg',
  '/burger-bazaar-dessert.jpg',
]

const visibleImages = galleryImages.slice(0, 4)

export default function Gallery() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      visibleImages.forEach((src) => {
        const img = document.createElement('img')
        img.src = src
      })
    }
  }, [])

  const handleImageClick = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('fromGallery', 'true')
    }
    router.push('/gallery')
  }

  const handleShareContact = async () => {
    const shareText = `${shopConfig.name} - ${shopConfig.tagline}. Call ${shopConfig.contact.officePhone}. ${shopConfig.contact.address}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: shopConfig.name,
          text: shareText,
          url: shopConfig.url,
        })
        return
      } catch {
      }
    }

    await navigator.clipboard.writeText(`${shareText}\n${shopConfig.url}`)
    alert('Contact copied to clipboard.')
  }

  return (
    <section id="gallery" className="w-full max-w-md mx-auto pt-8 pb-6">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="mb-6"
      >
        <div className="section-title-accent mb-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-left">
            Fresh from the Kitchen
          </h2>
        </div>
        <p className="whitespace-nowrap text-sm sm:text-base text-slate-300/90 font-normal text-left tracking-tight">
          Burgers • fries • desserts • kitchen moments.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3.5">
        {visibleImages.map((imageSrc, index) => (
          <motion.div
            key={`gallery-${index}-${imageSrc}`}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: index * 0.06, duration: 0.3 }}
            className="relative aspect-square rounded-[24px] overflow-hidden shadow-[0_18px_36px_rgba(0,0,0,0.24)] cursor-pointer group border border-white/10"
            onClick={handleImageClick}
          >
            <Image
              src={imageSrc}
              alt={`Gallery image ${index + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 448px) 50vw, 224px"
            />
            <div className="absolute inset-[1px] rounded-[23px] border border-white/10 z-[1]" />
            <div className="absolute inset-x-6 top-4 h-10 rounded-full bg-white/12 blur-2xl z-[1]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent group-hover:from-black/60 transition-colors" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="mt-5"
      >
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/gallery"
            onClick={() => {
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('fromGallery', 'true')
              }
            }}
            className="min-h-[48px] bg-mango-green hover:bg-mango-greenSoft text-white font-bold px-2.5 rounded-2xl shadow-[0_12px_24px_rgba(209,35,37,0.22)] hover:shadow-[0_16px_28px_rgba(209,35,37,0.28)] transition-all flex items-center justify-center gap-1.5"
          >
            <span className="flex -space-x-2 shrink-0" aria-hidden>
              <span className="relative h-7 w-7 overflow-hidden rounded-full border-2 border-white bg-white shadow-sm">
                <Image src="/burger-bazaar-logo.jpg" alt="" fill className="object-cover" sizes="28px" />
              </span>
              <span className="relative h-7 w-7 overflow-hidden rounded-full border-2 border-white bg-white shadow-sm">
                <Image src="/burger-bazaar-header.jpg" alt="" fill className="object-cover" sizes="28px" />
              </span>
            </span>
            <span className="whitespace-nowrap text-sm">View Gallery</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>
          <button
            type="button"
            onClick={handleShareContact}
            className="min-h-[48px] bg-white text-[#D12325] text-sm font-bold px-3 rounded-2xl border border-[#D12325]/35 shadow-[0_10px_20px_rgba(21,21,21,0.10)] hover:shadow-[0_14px_24px_rgba(209,35,37,0.14)] transition-all flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </motion.div>
    </section>
  )
}
