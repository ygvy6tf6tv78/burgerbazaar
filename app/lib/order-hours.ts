export interface OrderWindowState {
  isOpen: boolean
  label: string
  message: string
}

export function getOrderWindowState(_date = new Date()): OrderWindowState {
  return {
    isOpen: true,
    label: 'Direct ordering available',
    message: 'Burger Bazaar direct ordering is open.',
  }
}
