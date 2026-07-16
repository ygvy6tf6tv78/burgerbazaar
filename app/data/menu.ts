export interface MenuItem {
  id: string
  name: string
  quantity: string
  price: string
  category: 'fish' | 'prawns' | 'chicken' | 'mutton' | 'veg'
  image?: string
}

// Helper function to generate image URL for menu items
function getItemImage(category: string, itemName: string): string {
  // Convert item name to URL-friendly format
  const imageName = itemName.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `/menu-items/${category}/${imageName}.jpg`
}

export const menuCategories = {
  fish: {
    name: 'Fish & Seafood',
    icon: '🐟',
    image: '/fish-category.jpg',
    items: [
      { id: 'fish-1', name: 'Indian Salmon Fish', quantity: '500 gm', price: '₹400', category: 'fish' as const, image: getItemImage('fish', 'Indian Salmon Fish') },
      { id: 'fish-2', name: 'Indian Basa Boneless', quantity: '1 Kg', price: '₹500', category: 'fish' as const, image: getItemImage('fish', 'Indian Basa Boneless') },
      { id: 'fish-3', name: 'Fresh Semi Sole Snax Cut', quantity: '1 Kg', price: '₹500', category: 'fish' as const, image: getItemImage('fish', 'Fresh Semi Sole Snax Cut') },
      { id: 'fish-4', name: 'Queen Caribbean Boneless', quantity: '1 Kg', price: '₹600', category: 'fish' as const, image: getItemImage('fish', 'Queen Caribbean Boneless') },
      { id: 'fish-5', name: 'Singhara With Bone Fresh Cleaned', quantity: '1 Kg', price: '₹750', category: 'fish' as const, image: getItemImage('fish', 'Singhara With Bone Fresh Cleaned') },
      { id: 'fish-6', name: 'Singhara Fish Boneless', quantity: '500 gm', price: '₹500', category: 'fish' as const, image: getItemImage('fish', 'Singhara Fish Boneless') },
      { id: 'fish-7', name: 'River Sole Fish', quantity: '500 gm', price: '₹600', category: 'fish' as const, image: getItemImage('fish', 'River Sole Fish') },
      { id: 'fish-8', name: 'Trout Rainbow', quantity: '1 Kg', price: '₹700', category: 'fish' as const, image: getItemImage('fish', 'Trout Rainbow') },
      { id: 'fish-9', name: 'Pomfret', quantity: '500 gm', price: '₹500', category: 'fish' as const, image: getItemImage('fish', 'Pomfret') },
      { id: 'fish-10', name: 'Rohu Fish Cleaned', quantity: '1 Kg', price: '₹400', category: 'fish' as const, image: getItemImage('fish', 'Rohu Fish Cleaned') },
      { id: 'fish-11', name: 'Katla Fish Cleaned Cut Pieces', quantity: '1 Kg', price: '₹400', category: 'fish' as const, image: getItemImage('fish', 'Katla Fish Cleaned Cut Pieces') },
      { id: 'fish-12', name: 'Indian Mackerel', quantity: '1 Kg', price: '₹450', category: 'fish' as const, image: getItemImage('fish', 'Indian Mackerel') },
      { id: 'fish-13', name: 'Red Snapper', quantity: '500 gm', price: '₹500', category: 'fish' as const, image: getItemImage('fish', 'Red Snapper') },
      { id: 'fish-14', name: 'Fish Finger', quantity: '500 gm', price: '₹250', category: 'fish' as const, image: getItemImage('fish', 'Fish Finger') },
      { id: 'fish-15', name: 'Fish Kebab', quantity: '400 gm', price: '₹200', category: 'fish' as const, image: getItemImage('fish', 'Fish Kebab') },
    ]
  },
  prawns: {
    name: 'Prawns',
    icon: '🦐',
    image: '/prawn-category.jpg',
    items: [
      { id: 'prawn-1', name: 'Jumbo Tiger Prawns Cleaned 8/12', quantity: '1 Kg', price: '₹900', category: 'prawns' as const, image: getItemImage('prawns', 'Jumbo Tiger Prawns Cleaned 8/12') },
      { id: 'prawn-2', name: 'Medium Tiger Prawns Cleaned 16/20', quantity: '1 Kg', price: '₹800', category: 'prawns' as const, image: getItemImage('prawns', 'Medium Tiger Prawns Cleaned 16/20') },
      { id: 'prawn-3', name: 'Small Prawns 31/40', quantity: '1 Kg', price: '₹700', category: 'prawns' as const, image: getItemImage('prawns', 'Small Prawns 31/40') },
    ]
  },
  chicken: {
    name: 'Chicken Items',
    icon: '🍗',
    image: '/chicken-category.avif',
    items: [
      { id: 'chicken-1', name: 'Chicken Wings Plain', quantity: '1 Kg', price: '₹300', category: 'chicken' as const, image: getItemImage('chicken', 'Chicken Wings Plain') },
      { id: 'chicken-2', name: 'Chicken Breast Boneless', quantity: '1 Kg', price: '₹350', category: 'chicken' as const, image: getItemImage('chicken', 'Chicken Breast Boneless') },
      { id: 'chicken-3', name: 'Chicken Thigh Boneless', quantity: '1 Kg', price: '₹400', category: 'chicken' as const, image: getItemImage('chicken', 'Chicken Thigh Boneless') },
      { id: 'chicken-4', name: 'Chicken Tangri', quantity: '1 Kg', price: '₹350', category: 'chicken' as const, image: getItemImage('chicken', 'Chicken Tangri') },
      { id: 'chicken-5', name: 'Chicken Curry Cut Dressed', quantity: '1 Kg', price: '₹300', category: 'chicken' as const, image: getItemImage('chicken', 'Chicken Curry Cut Dressed') },
      { id: 'chicken-6', name: 'Chicken Keema Raw', quantity: '1 Kg', price: '₹350', category: 'chicken' as const, image: getItemImage('chicken', 'Chicken Keema Raw') },
      { id: 'chicken-7', name: 'Chicken Tangri KFC Fried', quantity: '500 gm', price: '₹250', category: 'chicken' as const, image: getItemImage('chicken', 'Chicken Tangri KFC Fried') },
      { id: 'chicken-8', name: 'Chicken Strips KFC Fried', quantity: '500 gm', price: '₹250', category: 'chicken' as const, image: getItemImage('chicken', 'Chicken Strips KFC Fried') },
      { id: 'chicken-9', name: 'Chicken Wings KFC Fried', quantity: '500 gm', price: '₹250', category: 'chicken' as const, image: getItemImage('chicken', 'Chicken Wings KFC Fried') },
      { id: 'chicken-10', name: 'Chicken Nuggets KFC Fried', quantity: '500 gm', price: '₹200', category: 'chicken' as const, image: getItemImage('chicken', 'Chicken Nuggets KFC Fried') },
      { id: 'chicken-11', name: 'Chicken Popcorn KFC Fried', quantity: '500 gm', price: '₹250', category: 'chicken' as const, image: getItemImage('chicken', 'Chicken Popcorn KFC Fried') },
      { id: 'chicken-12', name: 'Chicken Momos', quantity: '1 Kg', price: '₹320', category: 'chicken' as const, image: getItemImage('chicken', 'Chicken Momos') },
      { id: 'chicken-13', name: 'Chicken Seekh Kabab', quantity: '500 gm', price: '₹200', category: 'chicken' as const, image: getItemImage('chicken', 'Chicken Seekh Kabab') },
      { id: 'chicken-14', name: 'Chicken Punjabi Kabab', quantity: '500 gm', price: '₹200', category: 'chicken' as const, image: getItemImage('chicken', 'Chicken Punjabi Kabab') },
      { id: 'chicken-15', name: 'Chicken Rainbow Kabab', quantity: '500 gm', price: '₹200', category: 'chicken' as const, image: getItemImage('chicken', 'Chicken Rainbow Kabab') },
      { id: 'chicken-16', name: 'Chicken Achari Kabab', quantity: '500 gm', price: '₹200', category: 'chicken' as const, image: getItemImage('chicken', 'Chicken Achari Kabab') },
      { id: 'chicken-17', name: 'Chicken Malai Tikka Kabab', quantity: '500 gm', price: '₹200', category: 'chicken' as const, image: getItemImage('chicken', 'Chicken Malai Tikka Kabab') },
      { id: 'chicken-18', name: 'Chicken Hara Bhara Kabab', quantity: '500 gm', price: '₹200', category: 'chicken' as const, image: getItemImage('chicken', 'Chicken Hara Bhara Kabab') },
      { id: 'chicken-19', name: 'Chicken Peri Peri Kabab', quantity: '500 gm', price: '₹200', category: 'chicken' as const, image: getItemImage('chicken', 'Chicken Peri Peri Kabab') },
      { id: 'chicken-20', name: 'Chicken Kofta', quantity: '500 gm', price: '₹200', category: 'chicken' as const, image: getItemImage('chicken', 'Chicken Kofta') },
      { id: 'chicken-21', name: 'Chicken Salami', quantity: '500 gm', price: '₹200', category: 'chicken' as const, image: getItemImage('chicken', 'Chicken Salami') },
      { id: 'chicken-22', name: 'Chicken Sausages Italian', quantity: '500 gm', price: '₹200', category: 'chicken' as const, image: getItemImage('chicken', 'Chicken Sausages Italian') },
      { id: 'chicken-23', name: 'Chicken Hams', quantity: '500 gm', price: '₹250', category: 'chicken' as const, image: getItemImage('chicken', 'Chicken Hams') },
      { id: 'chicken-24', name: 'Chicken Pepperoni', quantity: '500 gm', price: '₹250', category: 'chicken' as const, image: getItemImage('chicken', 'Chicken Pepperoni') },
      { id: 'chicken-25', name: 'Chicken Nuggets Plain', quantity: '500 gm', price: '₹200', category: 'chicken' as const, image: getItemImage('chicken', 'Chicken Nuggets Plain') },
      { id: 'chicken-26', name: 'Chicken Cheese Nuggets', quantity: '500 gm', price: '₹220', category: 'chicken' as const, image: getItemImage('chicken', 'Chicken Cheese Nuggets') },
      { id: 'chicken-27', name: 'Chicken Cheese Finger', quantity: '500 gm', price: '₹220', category: 'chicken' as const, image: getItemImage('chicken', 'Chicken Cheese Finger') },
      { id: 'chicken-28', name: 'Chicken Burger Patty', quantity: '500 gm', price: '₹200', category: 'chicken' as const, image: getItemImage('chicken', 'Chicken Burger Patty') },
      { id: 'chicken-29', name: 'Chicken Popcorn', quantity: '500 gm', price: '₹200', category: 'chicken' as const, image: getItemImage('chicken', 'Chicken Popcorn') },
    ]
  },
  mutton: {
    name: 'Mutton Items',
    icon: '🐑',
    image: '/mutton-category.jpg',
    items: [
      { id: 'mutton-1', name: 'Mutton Tandoori Kabab', quantity: '500 gm', price: '₹250', category: 'mutton' as const, image: getItemImage('mutton', 'Mutton Tandoori Kabab') },
      { id: 'mutton-2', name: 'Mutton Rista', quantity: '500 gm / 10 pcs', price: '₹250', category: 'mutton' as const, image: getItemImage('mutton', 'Mutton Rista') },
      { id: 'mutton-3', name: 'Mutton Gushtaba', quantity: '500 gm / 10 pcs', price: '₹250', category: 'mutton' as const, image: getItemImage('mutton', 'Mutton Gushtaba') },
      { id: 'mutton-4', name: 'Mutton Lamb Kabab', quantity: '500 gm', price: '₹250', category: 'mutton' as const, image: getItemImage('mutton', 'Mutton Lamb Kabab') },
      { id: 'mutton-5', name: 'Mutton Seekh Kabab', quantity: '500 gm', price: '₹220', category: 'mutton' as const, image: getItemImage('mutton', 'Mutton Seekh Kabab') },
      { id: 'mutton-6', name: 'Mutton Kofta', quantity: '500 gm', price: '₹250', category: 'mutton' as const, image: getItemImage('mutton', 'Mutton Kofta') },
      { id: 'mutton-7', name: 'Mutton Keema', quantity: '1 Kg', price: '₹650', category: 'mutton' as const, image: getItemImage('mutton', 'Mutton Keema') },
      { id: 'mutton-8', name: 'German Mutton Sausages', quantity: '500 gm', price: '₹250', category: 'mutton' as const, image: getItemImage('mutton', 'German Mutton Sausages') },
    ]
  },
  veg: {
    name: 'Veg Ready-to-Eat',
    icon: '🥬',
    image: '/veg-category.webp',
    items: [
      { id: 'veg-1', name: 'Paneer Momos', quantity: '1 Kg', price: '₹320', category: 'veg' as const, image: getItemImage('veg', 'Paneer Momos') },
      { id: 'veg-2', name: 'Veg Cheese Cigar / Spring Roll', quantity: '1 Kg', price: '₹400', category: 'veg' as const, image: getItemImage('veg', 'Veg Cheese Cigar / Spring Roll') },
      { id: 'veg-3', name: 'Veg Hara Bhara Kabab', quantity: '1 Kg', price: '₹300', category: 'veg' as const, image: getItemImage('veg', 'Veg Hara Bhara Kabab') },
    ]
  }
}

export function generateWhatsAppOrderMessage(item: MenuItem): string {
  return `Hello Burger Bazaar,

I would like to place an order.

Product: ${item.name}
Quantity: ${item.quantity}
Price: ${item.price}

Please confirm availability and total price.

Thank you.`
}

export interface CartItem extends MenuItem {
  cartQuantity: number
}

export function generateWhatsAppCartMessage(cartItems: CartItem[], totalPrice: number): string {
  const itemsList = cartItems
    .map((item) => {
      const unitPrice = parseFloat(item.price.replace('₹', '').replace(',', ''))
      const totalItemPrice = unitPrice * item.cartQuantity
      const packSize = item.quantity // This is the pack size like "1 Kg"
      return `• ${item.name}\n  Pack Size: ${packSize}\n  Quantity: ${item.cartQuantity} × ₹${unitPrice.toFixed(0)} = ₹${totalItemPrice.toFixed(2)}`
    })
    .join('\n\n')

  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.cartQuantity, 0)

  return `Hello Burger Bazaar,

I would like to place an order for the following items:

${itemsList}

━━━━━━━━━━━━━━━━━━━━
Total Items: ${totalItemsCount}
Estimated Total: ₹${totalPrice.toFixed(2)}
━━━━━━━━━━━━━━━━━━━━

Please confirm availability and final price.

Thank you!`
}
