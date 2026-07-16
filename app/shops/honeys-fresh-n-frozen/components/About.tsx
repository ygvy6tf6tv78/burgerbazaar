'use client'

import { shopConfig } from '../config'

export default function About() {
  return (
    <section className="w-full max-w-md mx-auto py-6">
      <div className="section-shell section-shell-green">
        <div className="section-shell-inner p-7 sm:p-8">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[#FBE9E9]/18 blur-3xl" />
          <div className="absolute left-[-2rem] bottom-[-2rem] h-28 w-28 rounded-full bg-white/[0.08] blur-3xl" />

          <div className="relative">
            <div className="section-title-accent mb-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-left">
                {shopConfig.about.title}
              </h2>
            </div>
            <p className="text-white/95 leading-[1.7] text-[17px] font-medium sm:text-[18px]">
              {shopConfig.about.shortDescription}
            </p>
            <div className="mt-6 h-px w-full bg-gradient-to-r from-white/40 via-[#FBE9E9]/65 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
