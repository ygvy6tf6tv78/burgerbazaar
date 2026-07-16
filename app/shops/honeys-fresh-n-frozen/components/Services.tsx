'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Flame, Sandwich, PackageCheck, Salad } from 'lucide-react'

const services = [
  {
    id: 'service-1',
    icon: Flame,
    title: 'Smashed Fresh',
    description: 'Every burger is prepared fresh after the order is received.',
    image: '/burger-bazaar-explore-smash.jpeg',
  },
  {
    id: 'service-2',
    icon: Sandwich,
    title: 'Housemade Buns',
    description: 'Soft housemade buns made to hold every loaded bite together.',
    image: '/burger-bazaar-brand-1.jpg',
  },
  {
    id: 'service-3',
    icon: PackageCheck,
    title: 'Packed to Travel',
    description: 'Every order is packed carefully for delivery and takeaway.',
    image: '/burger-bazaar-header-food.jpg',
  },
  {
    id: 'service-4',
    icon: Salad,
    title: 'Veg & Non-Veg',
    description: 'Strong options for both vegetarian and non-vegetarian cravings.',
    image: '/burger-bazaar-menu-fries.jpeg',
  },
]

export default function Services() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto py-6"
    >
      <div className="mb-6">
        <div className="section-title-accent mb-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-left">
            Why Burger Bazaar?
          </h2>
        </div>
        <p className="whitespace-nowrap text-sm sm:text-base text-slate-300/90 font-normal text-left tracking-tight">
          Freshly prepared • Bold flavours • Built for delivery
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3.5">
        {services.map((service, index) => {
          const IconComponent = service.icon
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
              className="group relative rounded-[25px] p-5 overflow-hidden transition-transform duration-300 hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #FBE9E9 0%, #FFF9F4 35%, #ffffff 72%, #FFF9F4 100%)',
                border: '1px solid rgba(209, 35, 37, 0.28)',
                boxShadow: '0 14px 32px rgba(15, 23, 42, 0.10), 0 4px 14px rgba(209, 35, 37, 0.11)',
              }}
            >
              <div className="pointer-events-none absolute inset-y-0 left-0 w-[62%] overflow-hidden" aria-hidden>
                <Image
                  src={service.image}
                  alt=""
                  fill
                  className="scale-110 object-cover object-center opacity-[0.20] blur-[2px] saturate-[0.85]"
                  sizes="280px"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/65 to-[#FFF9F4]" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-white/45" />
              </div>
              <div className="absolute inset-x-0 top-0 h-20 opacity-65 pointer-events-none bg-gradient-to-b from-white/85 to-transparent" />
              <div className="absolute right-4 top-4 rounded-full border border-[#D12325]/15 bg-white/80 px-2 py-1 text-[9px] font-black tracking-[0.18em] text-[#D12325] shadow-sm">
                  {String(index + 1).padStart(2, '0')}
              </div>

              <div className="relative z-10 flex items-start gap-4 transition-all duration-300 group-hover:-translate-y-0.5">
                <div
                  className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border border-[#D12325]/30"
                  style={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.98) 0%, #FBE9E9 100%)',
                    boxShadow: '0 8px 18px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255,255,255,0.92)',
                  }}
                >
                  <IconComponent className="w-7 h-7 relative z-10" style={{ color: '#D12325' }} strokeWidth={2} />
                </div>

                <div className="flex-1 relative z-10 pr-7">
                  <h3
                    className="font-bold text-base mb-1.5 leading-tight"
                    style={{ color: '#1e293b' }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: '#475569' }}
                  >
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.section>
  )
}
