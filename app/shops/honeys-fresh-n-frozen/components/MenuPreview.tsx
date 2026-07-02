'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { menuCategories } from '../menu'

// Show only 4 categories on home section (Burger & Pizza, Sandwich, Momos, Wraps)
const previewCategories: (keyof typeof menuCategories)[] = [
  'burgerPizza',
  'sandwichSalad',
  'momos',
  'wraps',
]

export default function MenuPreview() {
  return (
    <section id="menu" className="w-full max-w-md mx-auto py-8">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="mb-6"
      >
        <div className="section-title-accent mb-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-left">
            Our Menu
          </h2>
        </div>
        <p className="text-sm sm:text-base text-slate-300/90 font-medium text-left tracking-wide">
          Fresh kitchen • Bakery • Made with care
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3.5 mb-6">
        {previewCategories.map((key, index) => {
          const category = menuCategories[key]
          return (
            <Link key={key} href={`/menu?cat=${key}`} className="block">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.05, duration: 0.35, ease: 'easeOut' }}
                className="relative aspect-square rounded-[24px] overflow-hidden cursor-pointer group border border-white/10 shadow-[0_16px_32px_rgba(0,0,0,0.22)] transition-all duration-300"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 448px) 50vw, 224px"
                />
                <div className="absolute inset-[1px] rounded-[23px] border border-white/10 z-[1]" />
                <div className="absolute inset-x-5 top-4 h-12 rounded-full bg-white/10 blur-2xl z-[1]" />
                <div
                  className="absolute inset-0 z-[1]"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.82) 28%, rgba(0,0,0,0.54) 55%, rgba(0,0,0,0.18) 82%, rgba(0,0,0,0.04) 100%)',
                  }}
                />
                <div className="absolute top-3 right-3 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center z-10 bg-white/15 border border-white/25 shadow-lg backdrop-blur-md">
                  <span className="text-xl sm:text-2xl">{category.icon}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4 z-10">
                  <h3 className="text-white font-bold text-base sm:text-lg mb-0.5 leading-tight line-clamp-2" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.85)' }}>
                    {category.name}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm font-medium leading-snug mb-2.5 line-clamp-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.7)' }}>
                    {category.shortDescription}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-slate-100 font-semibold text-xs sm:text-sm bg-white/14 hover:bg-white/22 px-3 py-1.5 rounded-full transition-colors border border-white/20 backdrop-blur-md">
                    View Items
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </span>
                </div>
              </motion.div>
            </Link>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="pt-1"
      >
        <Link
          href="/menu"
          className="block w-full bg-mango-green hover:bg-mango-greenSoft text-white font-bold py-4 px-6 rounded-2xl shadow-[0_18px_34px_rgba(30,77,61,0.28)] hover:shadow-[0_22px_40px_rgba(30,77,61,0.34)] transition-all flex items-center justify-center gap-2"
        >
          View Full Menu
          <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>
    </section>
  )
}
