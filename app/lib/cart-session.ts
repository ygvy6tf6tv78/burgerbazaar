/** Cart handoffs (menu ↔ checkout) + active checkout session (survives refresh on /checkout only). */

export const MANGO_CART_KEY = 'mango_checkout_cart'
export const MANGO_HANDOFF_TO_CHECKOUT = 'mango_handoff_to_checkout'
export const MANGO_HANDOFF_TO_MENU = 'mango_handoff_to_menu'
/** Set while user is on checkout so refresh keeps the cart (not used on menu-first visits). */
export const MANGO_CHECKOUT_SESSION = 'mango_checkout_session'
export const MANGO_ORDER_TYPE_KEY = 'mango_order_type'
export type MangoOrderType = 'online' | 'dine-in' | 'takeaway'

export function writeOrderType(orderType: MangoOrderType) {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(MANGO_ORDER_TYPE_KEY, orderType)
}

export function readOrderType(): MangoOrderType {
  if (typeof window === 'undefined') return 'online'
  const value = window.sessionStorage.getItem(MANGO_ORDER_TYPE_KEY)
  return value === 'dine-in' || value === 'takeaway' ? value : 'online'
}

export function writeHandoffToCheckout(cart: unknown[], orderType: MangoOrderType = 'online') {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(MANGO_CART_KEY, JSON.stringify(cart))
  window.sessionStorage.setItem(MANGO_HANDOFF_TO_CHECKOUT, '1')
  window.sessionStorage.setItem(MANGO_ORDER_TYPE_KEY, orderType)
}

export function writeHandoffToMenuFromCheckout(cart: unknown[], orderType?: MangoOrderType) {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(MANGO_CART_KEY, JSON.stringify(cart))
  window.sessionStorage.setItem(MANGO_HANDOFF_TO_MENU, '1')
  if (orderType) window.sessionStorage.setItem(MANGO_ORDER_TYPE_KEY, orderType)
}

/** Leaving checkout via Back, or after order sent — cart should not reappear on refresh. */
export function clearCheckoutSession() {
  if (typeof window === 'undefined') return
  window.sessionStorage.removeItem(MANGO_CHECKOUT_SESSION)
  window.sessionStorage.removeItem(MANGO_CART_KEY)
  window.sessionStorage.removeItem(MANGO_ORDER_TYPE_KEY)
}
