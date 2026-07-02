import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pay · The Sonnet Cafe',
  description: 'UPI / QR payment - The Sonnet Cafe, Rajbagh Srinagar',
}

export default function SonnetPayLayout({ children }: { children: React.ReactNode }) {
  return children
}
