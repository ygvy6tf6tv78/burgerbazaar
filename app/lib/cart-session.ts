/** Cart handoffs (menu ↔ checkout) + active checkout session (survives refresh on /checkout only). */

export const MANGO_CART_KEY = 'mango_checkout_cart'
export const MANGO_HANDOFF_TO_CHECKOUT = 'mango_handoff_to_checkout'
export const MANGO_HANDOFF_TO_MENU = 'mango_handoff_to_menu'
/** Set while user is on checkout so refresh keeps the cart (not used on menu-first visits). */
export const MANGO_CHECKOUT_SESSION = 'mango_checkout_session'

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

/** Leaving checkout via Back, or after order sent — cart should not reappear on refresh. */
export function clearCheckoutSession() {
  if (typeof window === 'undefined') return
  window.sessionStorage.removeItem(MANGO_CHECKOUT_SESSION)
  window.sessionStorage.removeItem(MANGO_CART_KEY)
}
