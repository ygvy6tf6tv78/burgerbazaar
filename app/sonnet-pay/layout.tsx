import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pay · Burger Bazaar',
  description: 'Payment details for Burger Bazaar, Jammu',
}

export default function SonnetPayLayout({ children }: { children: React.ReactNode }) {
  return children
}
