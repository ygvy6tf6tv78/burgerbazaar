export interface OrderWindowState {
  isOpen: boolean
  label: string
  message: string
}

const OPEN_HOUR = 12
const CLOSE_HOUR = 22

export function getOrderWindowState(date = new Date()): OrderWindowState {
  const hour = date.getHours()
  const minute = date.getMinutes()
  const minutes = hour * 60 + minute
  const openMinutes = OPEN_HOUR * 60
  const closeMinutes = CLOSE_HOUR * 60
  const isOpen = minutes >= openMinutes && minutes < closeMinutes

  return {
    isOpen,
    label: '12:00 PM - 10:00 PM',
    message: isOpen
      ? 'Ordering is open now. Last delivery orders close at 10:00 PM.'
      : 'Delivery ordering is closed. Orders open again at 12:00 PM.',
  }
}
