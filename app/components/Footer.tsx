'use client'

import Image from 'next/image'
import { siteConfig } from '../data/site'

export default function Footer() {
  return (
    <footer className="w-full max-w-md mx-auto py-8">
      <div className="text-center space-y-4">
        <p className="text-sm text-white font-medium">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
        <div className="space-y-3 pt-2 border-t border-gray-700">
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-white font-semibold flex items-center gap-1.5">
              <span>OneLink</span>
              <Image
                src="/gallery/onelinklogo.png"
                alt="OneLink Logo"
                width={40}
                height={20}
                className="opacity-100 object-contain"
                quality={100}
                priority
              />
              <span>— your business, one link away.</span>
            </p>
            <span
              className="text-xs transition-colors inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(30, 30, 30, 0.8)',
                color: '#e0e0e0',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              Powered by OneLink
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
