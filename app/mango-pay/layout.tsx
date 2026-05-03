import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pay · Mango',
  description: 'UPI / QR payment — Mango, Bahu Plaza Jammu',
}

export default function MangoPayLayout({ children }: { children: React.ReactNode }) {
  return children
}
