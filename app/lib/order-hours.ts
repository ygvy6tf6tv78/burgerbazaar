export interface OrderWindowState {
  isOpen: boolean
  label: string
  message: string
}

export function getOrderWindowState(_date = new Date()): OrderWindowState {
  return {
    isOpen: true,
    label: 'Check live availability',
    message: 'Burger Bazaar will confirm current availability and final pricing.',
  }
}
