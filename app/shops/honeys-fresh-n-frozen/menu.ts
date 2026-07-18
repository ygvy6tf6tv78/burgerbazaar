// Burger Bazaar menu transcribed from the official two-page PDF supplied by the brand.

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
  | 'smashBurgers'
  | 'friedChickenBurgers'
  | 'dirtyFries'
  | 'wings'
  | 'combos'
  | 'desserts'
  | 'drinks'

function item(
  id: string,
  name: string,
  price: number,
  category: MenuCategoryKey,
  description: string,
  kind: MenuItem['kind'],
  quantity = '1 portion'
): MenuItem {
  return {
    id,
    name,
    description,
    quantity,
    price: `₹${price}`,
    category,
    kind,
  }
}

export interface MenuCategoryConfig {
  name: string
  shortDescription: string
  icon: string
  image: string
  items: MenuItem[]
}

export const menuCategories: Record<MenuCategoryKey, MenuCategoryConfig> = {
  smashBurgers: {
    name: 'Smash Burger',
    shortDescription: 'Juicy smash patties, pickles and signature burger sauce.',
    icon: '🍔',
    image: '/burger-bazaar-sticker.png',
    items: [
      item('smash-1', 'Classic Chicken Smash', 189, 'smashBurgers', 'Bun, juicy chicken smash patty, lettuce, tomato, pickles & signature burger sauce. Add extra chicken patty ₹49.', 'Non-Veg'),
      item('smash-2', 'Mutton Inferno Smash', 229, 'smashBurgers', 'Juicy mutton smash patty with lettuce, tomato, pickles & burger sauce. Add extra mutton patty ₹79.', 'Non-Veg'),
      item('smash-3', 'Veggie Smasher', 179, 'smashBurgers', 'Bun, juicy chicken smash patty, lettuce, pickles, burger sauce. Add extra chicken patty ₹39.', 'Veg'),
      item('smash-4', 'The Bazaar Signature Smash', 299, 'smashBurgers', 'Bun, juicy chicken smash patty, lettuce, pickles, burger sauce. Add extra chicken patty ₹49.', 'Veg'),
    ],
  },
  friedChickenBurgers: {
    name: 'Fried Chicken Burger',
    shortDescription: 'Crispy fried burgers with Nashville, Korean and house sauces.',
    icon: '🍗',
    image: '/burger-bazaar-sticker.png',
    items: [
      item('fried-1', 'Nashville Hot Chicken Burger', 199, 'friedChickenBurgers', 'Bun, Nashville-hot fried chicken, garlic aioli, slaw, lettuce, pickles & tomato.', 'Non-Veg'),
      item('fried-2', 'Nashville Heatwave Burger', 229, 'friedChickenBurgers', 'Bun, hottest Nashville-hot fried chicken, garlic aioli, slaw, lettuce, pickles & tomato.', 'Non-Veg'),
      item('fried-3', 'NY Fried Chicken Burger', 229, 'friedChickenBurgers', 'Bun, NY-sauced fried chicken, BBQ sauce, coleslaw, pickles & tomato, lettuce.', 'Non-Veg'),
      item('fried-4', 'Korean Fried Chicken Burger', 229, 'friedChickenBurgers', 'Bun, crispy Korean fried chicken in signature sauce, garlic aioli, pickles, tomato, spring onions & sesame.', 'Non-Veg'),
      item('fried-5', 'Hot Honey Fried Chicken Burger', 229, 'friedChickenBurgers', 'Bun, hot honey-glazed crispy chicken, BBQ sauce, slaw, iceberg lettuce, tomato & pickles.', 'Non-Veg'),
      item('fried-6', 'Spicy Paneer Fried Burger', 189, 'friedChickenBurgers', 'Bun, crispy spicy paneer patty, tandoori mayo, fresh coleslaw, grilled onions & tomato.', 'Veg'),
      item('fried-7', 'Crispy Mushroom Burger', 199, 'friedChickenBurgers', 'Bun, golden crispy mushroom patty, garlic aioli, coleslaw, lettuce, grilled onions, tomato & pickles.', 'Veg'),
    ],
  },
  dirtyFries: {
    name: 'Dirty Fries',
    shortDescription: 'Loaded peri-peri fries with cheese, sauces and fresh toppings.',
    icon: '🍟',
    image: '/burger-bazaar-sticker.png',
    items: [
      item('fries-1', 'Bazaar Dirty Fries', 139, 'dirtyFries', 'Peri-peri fries loaded with mozzarella, pico de gallo, chilli mayo, garlic aioli & spring onion. Add fried chicken ₹79.', 'Veg'),
      item('fries-2', 'Smash Dirty Fries', 149, 'dirtyFries', 'Loaded peri-peri fries with mozzarella, pico de gallo, chilli mayo, cheese sauce & caramelised onions. Add fried chicken ₹79.', 'Veg'),
      item('fries-3', 'Dirty Smash Chili Fries', 159, 'dirtyFries', 'Crispy peri-peri fries with mozzarella, pico de gallo, chilli mayo, cheese sauce, peri-peri masala, caramelised onions & house chilli. Add fried chicken ₹79.', 'Veg'),
      item('fries-4', 'Cheesy Peri-Peri Fries', 119, 'dirtyFries', 'Crispy peri-peri fries loaded with mozzarella, cheese sauce & butter. Add fried chicken ₹79.', 'Veg'),
      item('fries-5', 'Peri-Peri Fries', 89, 'dirtyFries', 'Golden crispy fries with peri-peri masala. Add fried chicken ₹79.', 'Veg'),
    ],
  },
  wings: {
    name: 'Wings',
    shortDescription: 'Classic, Nashville, Korean and buffalo-style wings.',
    icon: '🔥',
    image: '/burger-bazaar-sticker.png',
    items: [
      item('wings-1', 'Bazaar Classic Wings', 169, 'wings', 'Peri-peri flavoured wings, served with housemade coleslaw & pickles.', 'Non-Veg'),
      item('wings-2', 'Nashville Hot Wings', 199, 'wings', 'Wings dipped in Nashville oil, served with housemade coleslaw & pickles.', 'Non-Veg'),
      item('wings-3', 'Korean Glaze Wings', 199, 'wings', 'Gochujang glazed wings served with housemade coleslaw & pickles.', 'Non-Veg'),
      item('wings-4', 'Buffalo Style Wings', 199, 'wings', 'Buffalo styled wings served with housemade coleslaw & pickles.', 'Non-Veg'),
      item('wings-5', 'Bazaar Loaded Wings', 199, 'wings', 'Seasoned wings served with housemade coleslaw & pickles.', 'Non-Veg'),
    ],
  },
  combos: {
    name: 'Combos',
    shortDescription: 'Burger with peri-peri fries and soda.',
    icon: '🥤',
    image: '/burger-bazaar-sticker.png',
    items: [
      item('combo-1', 'Classic Chicken Smash', 259, 'combos', 'With peri-peri fries and soda.', 'Non-Veg'),
      item('combo-2', 'Mutton Inferno Smash', 299, 'combos', 'With peri-peri fries and soda.', 'Non-Veg'),
      item('combo-3', 'Veggie Smash', 239, 'combos', 'With peri-peri fries and soda.', 'Veg'),
    ],
  },
  desserts: {
    name: 'Desserts',
    shortDescription: 'A warm, buttery finish with vanilla ice cream.',
    icon: '🍎',
    image: '/burger-bazaar-sticker.png',
    items: [
      item('dessert-1', 'Peach & Apple Cobbler', 179, 'desserts', 'A warm, buttery crumble filled with spiced peaches and apples, baked until golden and served soft and comforting with a scoop of vanilla ice cream.', 'Veg'),
    ],
  },
  drinks: {
    name: 'Drinks',
    shortDescription: 'Chilled soft drinks.',
    icon: '🥤',
    image: '/burger-bazaar-sticker.png',
    items: [
      item('drink-1', 'Diet Coke', 55, 'drinks', 'Chilled Diet Coke.', 'Veg', '1 can'),
      item('drink-2', 'Fanta', 25, 'drinks', 'Chilled Fanta.', 'Veg', '250 ml'),
      item('drink-3', 'Limca', 25, 'drinks', 'Chilled Limca.', 'Veg', '250 ml'),
    ],
  },
}

const priceValue = (price: string) => Number(price.replace(/[^0-9.]/g, '')) || 0

export function generateWhatsAppOrderMessage(item: MenuItem): string {
  return `Hi Burger Bazaar,\n\nI would like to order:\n${item.name} - ${item.price}\n\nPlease confirm availability. Thank you!`
}

export interface CartItem extends MenuItem {
  cartQuantity: number
}

export function generateWhatsAppCartMessage(cartItems: CartItem[], totalPrice: number): string {
  const itemsList = cartItems
    .map((item) => `• ${item.name}\n  ${item.cartQuantity} x ${item.price} = ₹${priceValue(item.price) * item.cartQuantity}`)
    .join('\n\n')

  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.cartQuantity, 0)

  return `Hi Burger Bazaar,\n\nI would like to order:\n\n${itemsList}\n\n━━━━━━━━━━━━━━━━━━━━\nTotal items: ${totalItemsCount}\nOrder total: ₹${totalPrice}\n━━━━━━━━━━━━━━━━━━━━\n\nPlease place this order. Thank you!`
}
