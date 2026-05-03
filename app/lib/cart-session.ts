/** Cart is only restored when these one-shot handoff flags are set (menu ↔ checkout flow). */

export const MANGO_CART_KEY = 'mango_checkout_cart'
export const MANGO_HANDOFF_TO_CHECKOUT = 'mango_handoff_to_checkout'
export const MANGO_HANDOFF_TO_MENU = 'mango_handoff_to_menu'

export function writeHandoffToCheckout(cart: unknown[]) {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(MANGO_CART_KEY, JSON.stringify(cart))
  window.sessionStorage.setItem(MANGO_HANDOFF_TO_CHECKOUT, '1')
}

export function writeHandoffToMenuFromCheckout(cart: unknown[]) {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(MANGO_CART_KEY, JSON.stringify(cart))
  window.sessionStorage.setItem(MANGO_HANDOFF_TO_MENU, '1')
}
