// Burger Bazaar menu structure based on the verified Channi Himmat Zomato listing.
// Exact item prices are not publicly exposed, so the UI deliberately requests live pricing.

export interface MenuItem {
  id: string
  name: string
  description?: string
  quantity: string
  price: string
  category: MenuCategoryKey
  kind?: 'Veg' | 'Non-Veg'
  image?: string
}

export type MenuCategoryKey =
  | 'combos'
  | 'smashBurgers'
  | 'friedChickenBurgers'
  | 'vegBurgers'
  | 'friesSides'
  | 'desserts'

function item(
  id: string,
  name: string,
  category: MenuCategoryKey,
  description: string,
  kind: MenuItem['kind']
): MenuItem {
  return {
    id,
    name,
    description,
    quantity: '1 portion',
    price: 'Live price',
    category,
    kind,
    image: '/burger-bazaar-header.jpg',
  }
}

export interface MenuCategoryConfig {
  name: string
  shortDescription: string
  icon: string
  image: string
  items: MenuItem[]
}

const categoryImage = '/burger-bazaar-header.jpg'

export const menuCategories: Record<MenuCategoryKey, MenuCategoryConfig> = {
  combos: {
    name: 'Combos',
    shortDescription: 'Burger, peri-peri fries and a chilled drink.',
    icon: '🥤',
    image: categoryImage,
    items: [
      item('combo-1', 'Veggie Smash Combo', 'combos', 'Veggie Smash Burger, peri-peri fries and Coke or Sprite [330 ml].', 'Veg'),
      item('combo-2', 'Classic Chicken Smash Combo', 'combos', 'Classic Chicken Smash Burger, peri-peri fries and Coke or Sprite [330 ml].', 'Non-Veg'),
    ],
  },
  smashBurgers: {
    name: 'Smash Burgers',
    shortDescription: 'Freshly smashed patties, housemade buns and signature sauces.',
    icon: '🍔',
    image: categoryImage,
    items: [
      item('smash-1', 'Classic Chicken Smash', 'smashBurgers', 'Soft toasted bun, juicy chicken smash patty and crisp lettuce.', 'Non-Veg'),
      item('smash-2', 'Veggie Smasher', 'smashBurgers', 'Soft toasted bun stacked with a veggie smash patty and fresh layers.', 'Veg'),
      item('smash-3', 'Bazaar Signature Smash', 'smashBurgers', 'Buttered bun, two chicken smash patties, tomato, lettuce and house-special burger sauce.', 'Non-Veg'),
    ],
  },
  friedChickenBurgers: {
    name: 'Fried Chicken Burgers',
    shortDescription: 'Crispy fried chicken burgers with bold sauces.',
    icon: '🍗',
    image: categoryImage,
    items: [
      item('chicken-1', 'Hot Honey Fried Chicken Burger', 'friedChickenBurgers', 'Hot-honey glazed crispy chicken, Burger Bazaar sauce, coleslaw and iceberg lettuce.', 'Non-Veg'),
      item('chicken-2', 'Korean Fried Chicken Burger', 'friedChickenBurgers', 'Crispy chicken in gochujang sauce with garlic aioli, tomato and spring onion.', 'Non-Veg'),
      item('chicken-3', 'New York Fried Chicken Burger', 'friedChickenBurgers', 'Fried chicken, Burger Bazaar sauce, coleslaw, tomato and lettuce.', 'Non-Veg'),
      item('chicken-4', 'Nashville Heatwave Burger', 'friedChickenBurgers', 'Nashville hot fried chicken, garlic aioli, lettuce and tomato.', 'Non-Veg'),
      item('chicken-5', 'Nashville Hot Chicken Burger', 'friedChickenBurgers', 'Nashville hot fried chicken, tomato, garlic aioli, coleslaw and pickle.', 'Non-Veg'),
    ],
  },
  vegBurgers: {
    name: 'Veg Burgers',
    shortDescription: 'Loaded vegetarian burgers with bold flavours and fresh ingredients.',
    icon: '🌱',
    image: categoryImage,
    items: [
      item('veg-1', 'Crispy Mushroom Burger', 'vegBurgers', 'Crispy mushroom patty, garlic aioli, coleslaw, lettuce, grilled onion and tomato.', 'Veg'),
      item('veg-2', 'Spicy Paneer Fried Burger', 'vegBurgers', 'Crispy spicy paneer, Burger Bazaar sauce, coleslaw, iceberg lettuce and tomato.', 'Veg'),
    ],
  },
  friesSides: {
    name: 'Fries & Sides',
    shortDescription: 'Crispy fries, loaded sides and perfect add-ons.',
    icon: '🍟',
    image: categoryImage,
    items: [
      item('fries-1', 'Smash Dirty Fries', 'friesSides', 'Peri-peri fries loaded with mozzarella, pico de gallo, chilli mayo and cheese sauce.', 'Veg'),
      item('fries-2', 'Peri Peri Fries', 'friesSides', 'Golden crispy fries finished with peri-peri masala.', 'Veg'),
      item('fries-3', 'Dirty Smash Chilli Fries', 'friesSides', 'Crispy peri-peri fries with mozzarella, pico de gallo, chilli mayo and cheese sauce.', 'Veg'),
      item('fries-4', 'Bazaar Dirty Fries', 'friesSides', 'Peri-peri fries loaded with mozzarella, pico de gallo, chilli mayo and garlic aioli.', 'Veg'),
    ],
  },
  desserts: {
    name: 'Desserts',
    shortDescription: 'An indulgent finish to your Burger Bazaar order.',
    icon: '🍎',
    image: categoryImage,
    items: [
      item('dessert-1', 'Peach and Apple Cobbler', 'desserts', 'A warm baked crumble filled with spiced peach and apple, baked until golden.', 'Veg'),
    ],
  },
}

export function generateWhatsAppOrderMessage(item: MenuItem): string {
  return `Hi Burger Bazaar,\n\nI would like to order:\n${item.name}\n\nPlease confirm availability and the live price. Thank you!`
}

export interface CartItem extends MenuItem {
  cartQuantity: number
}

export function generateWhatsAppCartMessage(cartItems: CartItem[], _totalPrice: number): string {
  const itemsList = cartItems
    .map((item) => `• ${item.name}\n  Quantity: ${item.cartQuantity} · Live price to be confirmed`)
    .join('\n\n')

  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.cartQuantity, 0)

  return `Hi Burger Bazaar,\n\nI would like to order:\n\n${itemsList}\n\n━━━━━━━━━━━━━━━━━━━━\nTotal items: ${totalItemsCount}\nFinal price: Please confirm\n━━━━━━━━━━━━━━━━━━━━\n\nPlease confirm availability and the order total. Thank you!`
}
