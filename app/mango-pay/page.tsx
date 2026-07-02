'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/** Clean share link: opens one-link card on payment face (same as legacy ?pay=1). */
export default function MangoPayPage() {
  const router = useRouter()

  useEffect(() => {
    try {
      sessionStorage.setItem('openPayment', '1')
    } catch {
      /* private mode / quota */
    }
    router.replace('/')
  }, [router])

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#1a1a1a] px-4">
      <p className="text-center text-sm text-white/80">Opening payment...</p>
    </main>
  )
}
