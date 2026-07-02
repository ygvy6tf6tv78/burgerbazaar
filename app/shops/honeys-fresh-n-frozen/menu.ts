// The Sonnet Cafe - structured menu extracted from supplied menu text

export interface MenuItem {
  id: string
  name: string
  description?: string
  quantity: string
  price: string
  category: MenuCategoryKey
  kind?: 'Veg' | 'Non-Veg' | 'Egg' | 'Veg/Non-Veg'
  image?: string
}

export type MenuCategoryKey =
  'starters'
  | 'riceNoodlesSoups'
  | 'burgerPizza'
  | 'sandwichSalad'
  | 'wraps'
  | 'momos'
  | 'pastaMaggiFries'
  | 'healthyDrinks'
  | 'mojitosSmoothies'
  | 'shakesIceCream'
  | 'mainCourse'
  | 'combos'
  | 'thali'
  | 'hotBeverages'
  | 'desserts'
  | 'icedCoffee'
  | 'shakes'
  | 'coolers'
  | 'signatureDrinks'
  | 'healthyBlends'
  | 'icedTea'
  | 'teaKehwa'

function item(
  id: string,
  name: string,
  price: string,
  category: MenuCategoryKey,
  quantity = '1 portion',
  kind: MenuItem['kind'] = 'Veg'
): MenuItem {
  return { id, name, quantity, price, category, kind }
}

export interface MenuCategoryConfig {
  name: string
  shortDescription: string
  icon: string
  image: string
  items: MenuItem[]
}

export const menuCategories: Record<MenuCategoryKey, MenuCategoryConfig> = {
  starters: {
    name: 'Starters & Small Plates',
    shortDescription: 'Small plates, fries and chicken bites.',
    icon: '🍟',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop',
    items: [
      item('starters-1', 'Hummus and Warm Pita', '₹249', 'starters', '1 portion', 'Veg'),
      item('starters-2', 'Crisp Chicken Popcorn', '₹179', 'starters', '1 portion', 'Non-Veg'),
      item('starters-3', 'Honey Chilli Potatoes', '₹249', 'starters', '1 portion', 'Veg'),
      item('starters-4', 'Peri-Peri Chicken Strips', '₹239', 'starters', '1 portion', 'Non-Veg'),
      item('starters-5', 'Seasoned Fries', '₹149', 'starters', 'Classic -', 'Veg'),
      item('starters-6', 'Seasoned Fries', '₹169', 'starters', 'Peri-Peri -', 'Veg'),
      item('starters-7', 'Seasoned Fries', '₹199', 'starters', 'Cheesy -', 'Veg'),
      item('starters-8', 'Nandos Style Fully Loaded Chips', '₹249', 'starters', '1 portion', 'Veg'),
    ],
  },
  riceNoodlesSoups: {
    name: 'Soups',
    shortDescription: 'Soup options with classic and chicken variants.',
    icon: '🥣',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop',
    items: [
      item('riceNoodlesSoups-1', 'Hot & Sour', '₹149 / ₹199', 'riceNoodlesSoups', 'Veg / Chicken', 'Non-Veg'),
      item('riceNoodlesSoups-2', 'Manchow Soup', '₹149 / ₹199', 'riceNoodlesSoups', 'Veg / Chicken', 'Non-Veg'),
      item('riceNoodlesSoups-3', 'Sweet-Corn', '₹149', 'riceNoodlesSoups', 'Veg', 'Veg'),
    ],
  },
  burgerPizza: {
    name: 'Burgers',
    shortDescription: 'Cafe-style burgers with clear pricing.',
    icon: '🍔',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    items: [
      item('burgerPizza-1', 'Aaloo Tikki Burger', '₹109', 'burgerPizza', '1 portion', 'Veg'),
      item('burgerPizza-2', 'Dynamite Chicken Burger', '₹279', 'burgerPizza', '1 portion', 'Non-Veg'),
      item('burgerPizza-3', 'Crispy Chicken Burger', '₹249', 'burgerPizza', '1 portion', 'Non-Veg'),
    ],
  },
  sandwichSalad: {
    name: 'Sandwiches',
    shortDescription: 'Grilled and fresh cafe sandwiches.',
    icon: '🥪',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop',
    items: [
      item('sandwichSalad-1', 'Chicken Tikka Sandwich', '₹249', 'sandwichSalad', '1 portion', 'Non-Veg'),
      item('sandwichSalad-2', 'Tomato and Cucumber Melt', '₹149', 'sandwichSalad', '1 portion', 'Veg'),
      item('sandwichSalad-3', 'Grilled Chicken Sandwich', '₹199', 'sandwichSalad', '1 portion', 'Non-Veg'),
      item('sandwichSalad-4', 'Falafel Sandwich', '₹149', 'sandwichSalad', '1 portion', 'Veg'),
    ],
  },
  wraps: {
    name: 'Wraps & Rolls',
    shortDescription: 'Shawarma, rolls and wraps.',
    icon: '🌯',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
    items: [
      item('wraps-1', 'Middle Eastern Shawarma', '₹249', 'wraps', '1 portion', 'Veg'),
      item('wraps-2', 'Shawarma Platter', '₹349', 'wraps', '1 portion', 'Veg'),
      item('wraps-3', 'Spiced Chicken Wrap', '₹229', 'wraps', '1 portion', 'Non-Veg'),
      item('wraps-4', 'Chicken Tikka Wrap', '₹249', 'wraps', '1 portion', 'Non-Veg'),
      item('wraps-5', 'Spiced Paneer Roll', '₹179', 'wraps', '1 portion', 'Veg'),
    ],
  },
  momos: {
    name: 'Pizza\'s',
    shortDescription: 'Thin or thick crust options.',
    icon: '🍕',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
    items: [
      item('momos-1', 'Chicken Blast Chef\'s Special', '₹329 / ₹439 / ₹599', 'momos', 'Small / Medium / Large', 'Non-Veg'),
      item('momos-2', 'Mexican Spiced Chicken', '₹329 / ₹399 / ₹529', 'momos', 'Small / Medium / Large', 'Non-Veg'),
      item('momos-3', 'Fatira', '₹299', 'momos', '1 portion', 'Veg'),
      item('momos-4', 'Roasted Chicken Delight', '₹279 / ₹349 / ₹479', 'momos', 'Small / Medium / Large', 'Non-Veg'),
      item('momos-5', 'Garden Farmhouse', '₹199 / ₹319 / ₹449', 'momos', 'Small / Medium / Large', 'Veg'),
      item('momos-6', 'Margherita Pizza', '₹229 / ₹349 / ₹549', 'momos', 'Small / Medium / Large', 'Veg'),
      item('momos-7', 'Mushroom and Garlic Pizza', '₹279 / ₹379 / ₹519', 'momos', 'Small / Medium / Large', 'Veg'),
    ],
  },
  pastaMaggiFries: {
    name: 'Pastas & Salads',
    shortDescription: 'Penne pastas and fresh salad.',
    icon: '🍝',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop',
    items: [
      item('pastaMaggiFries-1', 'Alfredo', '₹269 / ₹349', 'pastaMaggiFries', 'Veg / Chicken', 'Non-Veg'),
      item('pastaMaggiFries-2', 'Arrabbiata', '₹249 / ₹329', 'pastaMaggiFries', 'Veg / Chicken', 'Non-Veg'),
      item('pastaMaggiFries-3', 'Blush Sauce', '₹249 / ₹369', 'pastaMaggiFries', 'Veg / Chicken', 'Non-Veg'),
      item('pastaMaggiFries-4', 'Garden Green Salad', '₹119', 'pastaMaggiFries', '1 portion', 'Veg'),
    ],
  },
  healthyDrinks: {
    name: 'Ramen & Noodles',
    shortDescription: 'Noodles and ramen bowls.',
    icon: '🍜',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
    items: [
      item('healthyDrinks-1', 'Chowmein', '₹169 / ₹209', 'healthyDrinks', 'Veg / Chicken', 'Non-Veg'),
      item('healthyDrinks-2', 'Triple Cheese Ramen', '₹389 / ₹399', 'healthyDrinks', 'Veg / Egg', 'Egg'),
      item('healthyDrinks-3', 'Korean Hot Chicken Ramen', '₹349 / ₹359', 'healthyDrinks', 'Veg / Egg', 'Egg'),
      item('healthyDrinks-4', 'Carbonara Style Ramen', '₹349 / ₹359', 'healthyDrinks', 'Veg / Egg', 'Egg'),
    ],
  },
  mojitosSmoothies: {
    name: 'Dumplings',
    shortDescription: 'Steamed, crispy and tandoori dumplings.',
    icon: '🥟',
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop',
    items: [
      item('mojitosSmoothies-1', 'Afghani Dumplings', '₹269', 'mojitosSmoothies', '1 portion', 'Veg'),
      item('mojitosSmoothies-2', 'Crispy Chicken Dumplings', '₹130', 'mojitosSmoothies', '1 portion', 'Non-Veg'),
      item('mojitosSmoothies-3', 'Steamed Chicken Dumplings', '₹120', 'mojitosSmoothies', '1 portion', 'Non-Veg'),
      item('mojitosSmoothies-4', 'Tandoori Dumplings', '₹179', 'mojitosSmoothies', '1 portion', 'Veg'),
    ],
  },
  shakesIceCream: {
    name: 'Tandoor',
    shortDescription: 'Tikka, kebab and tandoor plates.',
    icon: '🔥',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
    items: [
      item('shakesIceCream-1', 'Chicken Tikka', '₹359', 'shakesIceCream', '1 portion', 'Non-Veg'),
      item('shakesIceCream-2', 'Paneer Tikka', '₹329', 'shakesIceCream', '1 portion', 'Veg'),
      item('shakesIceCream-3', 'Tandoori Chicken', '₹349 / ₹649', 'shakesIceCream', 'Half / Full', 'Non-Veg'),
      item('shakesIceCream-4', 'Mutton Seekh Kebab', '₹229 / ₹419', 'shakesIceCream', 'Half / Full', 'Non-Veg'),
    ],
  },
  mainCourse: {
    name: 'Curries & Mains',
    shortDescription: 'Cafe mains, curries and steaks.',
    icon: '🍛',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    items: [
      item('mainCourse-1', 'Butter Chicken [Bone]', '₹399 / ₹699', 'mainCourse', 'Half / Full', 'Non-Veg'),
      item('mainCourse-2', 'Butter Chicken [Boneless]', '₹449 / ₹799', 'mainCourse', 'Half / Full', 'Non-Veg'),
      item('mainCourse-3', 'Murg Afghani', '₹429 / ₹749', 'mainCourse', 'Half / Full', 'Veg'),
      item('mainCourse-4', 'Chicken Rara', '₹349 / ₹699', 'mainCourse', 'Half / Full', 'Non-Veg'),
      item('mainCourse-5', 'Chicken Kanti', '₹399', 'mainCourse', '1 portion', 'Non-Veg'),
      item('mainCourse-6', 'Chilli Chicken', '₹349', 'mainCourse', '1 portion', 'Non-Veg'),
      item('mainCourse-7', 'Chicken Steak With Brown Sauce', '₹369', 'mainCourse', '1 portion', 'Non-Veg'),
      item('mainCourse-8', 'Chicken Steak With Mushroom Sauce', '₹379', 'mainCourse', '1 portion', 'Non-Veg'),
      item('mainCourse-9', 'Fajita', '₹449', 'mainCourse', '1 portion', 'Veg'),
      item('mainCourse-10', 'Shakshuka', '₹349', 'mainCourse', '1 portion', 'Veg'),
      item('mainCourse-11', 'Peshawari Lamb Kadhai', '₹649 / ₹1049', 'mainCourse', 'Half / Full', 'Non-Veg'),
      item('mainCourse-12', 'Nalli Nihari', '₹749', 'mainCourse', '1 portion', 'Non-Veg'),
      item('mainCourse-13', 'Lahori Korma', '₹349 / ₹649', 'mainCourse', 'Half / Full', 'Veg'),
      item('mainCourse-14', 'Shinwari Keema', '₹449', 'mainCourse', '1 portion', 'Non-Veg'),
      item('mainCourse-15', 'Chapli Kabab', '₹399', 'mainCourse', '1 portion', 'Non-Veg'),
      item('mainCourse-16', 'Mutton Rara', '₹549 / ₹1049', 'mainCourse', 'Half / Full', 'Non-Veg'),
      item('mainCourse-17', 'Mutton Kabab Kanti', '₹449', 'mainCourse', '1 portion', 'Non-Veg'),
      item('mainCourse-18', 'Matar-Mushroom', '₹149', 'mainCourse', '1 portion', 'Veg'),
      item('mainCourse-19', 'Panner Butter Masala', '₹299', 'mainCourse', '1 portion', 'Veg'),
      item('mainCourse-20', 'Panner Kadai', '₹349', 'mainCourse', '1 portion', 'Veg'),
      item('mainCourse-21', 'Mix-Veg', '₹199', 'mainCourse', '1 portion', 'Veg'),
    ],
  },
  combos: {
    name: 'Rice Meals',
    shortDescription: 'Rice sides and fried rice.',
    icon: '🍚',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
    items: [
      item('combos-1', 'Chicken-Fried Rice', '₹249', 'combos', '1 portion', 'Non-Veg'),
      item('combos-2', 'Schezwan Chicken Fried Rice', '₹279', 'combos', '1 portion', 'Non-Veg'),
      item('combos-3', 'Veg-Fried Rice', '₹179', 'combos', '1 portion', 'Veg'),
      item('combos-4', 'Steamed Rice', '₹99', 'combos', '1 portion', 'Veg'),
      item('combos-5', 'Zeera Rice', '₹109', 'combos', '1 portion', 'Veg'),
    ],
  },
  thali: {
    name: 'Breads',
    shortDescription: 'Naan, roti and rice-pairing breads.',
    icon: '🫓',
    image: 'https://images.unsplash.com/photo-1601050690117-64b6a6109e53?w=400&h=300&fit=crop',
    items: [
      item('thali-1', 'Classic Naan', '₹49', 'thali', '1 portion', 'Veg'),
      item('thali-2', 'Butter Naan', '₹69', 'thali', '1 portion', 'Veg'),
      item('thali-3', 'Garlic Naan', '₹79', 'thali', '1 portion', 'Veg'),
      item('thali-4', 'Naan Gone Wrong', '₹49', 'thali', '1 portion', 'Veg'),
      item('thali-5', 'Tawa Naan', '₹49', 'thali', '1 portion', 'Veg'),
      item('thali-6', 'Rumali Roti', '₹29', 'thali', '1 portion', 'Veg'),
    ],
  },
  hotBeverages: {
    name: 'Dessert Delights',
    shortDescription: 'Pastries, brownies and sweet plates.',
    icon: '🍰',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    items: [
      item('hotBeverages-1', 'Brownie', '₹120', 'hotBeverages', '1 portion', 'Veg'),
      item('hotBeverages-2', 'Brownie With Ice-Cream', '₹150', 'hotBeverages', '1 portion', 'Veg'),
      item('hotBeverages-3', 'Brownie On Sizzler', '₹170', 'hotBeverages', '1 portion', 'Veg'),
      item('hotBeverages-4', 'Shahi Tukda', '₹119', 'hotBeverages', '1 portion', 'Veg'),
      item('hotBeverages-5', 'Um-Ali', '₹149', 'hotBeverages', '1 portion', 'Veg'),
      item('hotBeverages-6', 'Red-Velvet Pastry', '₹140', 'hotBeverages', '1 portion', 'Veg'),
      item('hotBeverages-7', 'Fresh-Fruit Pastry', '₹150', 'hotBeverages', '1 portion', 'Veg'),
      item('hotBeverages-8', 'Cupcakes', '₹60', 'hotBeverages', '1 portion', 'Veg'),
      item('hotBeverages-9', 'Pancakes (Classic)', '₹219', 'hotBeverages', '1 portion', 'Veg'),
      item('hotBeverages-10', 'Pancakes (Triple Chocolate)', '₹259', 'hotBeverages', '1 portion', 'Veg'),
    ],
  },
  desserts: {
    name: 'Hot Drinks',
    shortDescription: 'Coffee and hot chocolate.',
    icon: '☕',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
    items: [
      item('desserts-1', 'Espresso', '₹99 / ₹109', 'desserts', '1 portion', 'Veg'),
      item('desserts-2', 'Black Coffee', '₹119', 'desserts', '1 portion', 'Veg'),
      item('desserts-3', 'House Latte', '₹139 / ₹149', 'desserts', '1 portion', 'Veg'),
      item('desserts-4', 'Americano', '₹109', 'desserts', '1 portion', 'Veg'),
      item('desserts-5', 'Cappuccino', '₹139 / ₹149', 'desserts', '1 portion', 'Veg'),
      item('desserts-6', 'Classic Hot Chocolate', '₹149', 'desserts', '1 portion', 'Veg'),
    ],
  },
  icedCoffee: {
    name: 'Iced Coffee',
    shortDescription: 'Cold coffee classics and frappe.',
    icon: '🧊',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
    items: [
      item('icedCoffee-1', 'Iced Americano', '₹119 / ₹129', 'icedCoffee', '1 portion', 'Veg'),
      item('icedCoffee-2', 'Iced Cappuccino', '₹139 / ₹149', 'icedCoffee', '1 portion', 'Veg'),
      item('icedCoffee-3', 'Coffee Frappe', '₹199', 'icedCoffee', '1 portion', 'Veg'),
      item('icedCoffee-4', 'Iced Latte', '₹139 / ₹149', 'icedCoffee', '1 portion', 'Veg'),
      item('icedCoffee-5', 'Sonnet Special Iced Latte', '₹159', 'icedCoffee', '1 portion', 'Veg'),
      item('icedCoffee-6', 'Iced Mocha', '₹139', 'icedCoffee', '1 portion', 'Veg'),
    ],
  },
  shakes: {
    name: 'Shakes',
    shortDescription: 'Creamy cafe shakes.',
    icon: '🥤',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop',
    items: [
      item('shakes-1', 'Classic Vanilla', '₹179', 'shakes', '1 portion', 'Veg'),
      item('shakes-2', 'Strawberry Shake', '₹189', 'shakes', '1 portion', 'Veg'),
      item('shakes-3', 'Loaded Chocolate', '₹199', 'shakes', '1 portion', 'Veg'),
      item('shakes-4', 'Mango Shake', '₹199', 'shakes', '1 portion', 'Veg'),
      item('shakes-5', 'Oreo Shake', '₹199', 'shakes', '1 portion', 'Veg'),
      item('shakes-6', 'Kit-Kat Shake', '₹199', 'shakes', '1 portion', 'Veg'),
      item('shakes-7', 'Nutella Milk Shake', '₹179', 'shakes', '1 portion', 'Veg'),
      item('shakes-8', 'Brownie Shake', '₹199', 'shakes', '1 portion', 'Veg'),
    ],
  },
  coolers: {
    name: 'Mocktails & Coolers',
    shortDescription: 'Refreshing coolers and lemonade.',
    icon: '🍹',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
    items: [
      item('coolers-1', 'Green Apple Refresher', '₹119', 'coolers', '1 portion', 'Veg'),
      item('coolers-2', 'Blue Citrus Cooler', '₹119', 'coolers', '1 portion', 'Veg'),
      item('coolers-3', 'Virgin Mojito', '₹119', 'coolers', '1 portion', 'Veg'),
      item('coolers-4', 'Apple Honey Lime Soda', '₹119', 'coolers', '1 portion', 'Veg'),
      item('coolers-5', 'House Lemonade', '₹109', 'coolers', '1 portion', 'Veg'),
    ],
  },
  signatureDrinks: {
    name: 'Signature Drinks',
    shortDescription: 'Sonnet signature drinks.',
    icon: '✨',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop',
    items: [
      item('signatureDrinks-1', 'Italian Thick Hot Chocolate', '₹219', 'signatureDrinks', '1 portion', 'Veg'),
      item('signatureDrinks-2', 'Affogato', '₹109', 'signatureDrinks', '1 portion', 'Veg'),
      item('signatureDrinks-3', 'Sonnet Signature Latte', '₹159', 'signatureDrinks', '1 portion', 'Veg'),
      item('signatureDrinks-4', 'Café Mocha', '₹139', 'signatureDrinks', '1 portion', 'Veg'),
    ],
  },
  healthyBlends: {
    name: 'Healthy Blends',
    shortDescription: 'Fruit, nut and date shakes.',
    icon: '🌿',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop',
    items: [
      item('healthyBlends-1', 'Peanut Butter Shake', '₹189', 'healthyBlends', '1 portion', 'Veg'),
      item('healthyBlends-2', 'Almond & Date Shake', '₹199', 'healthyBlends', '1 portion', 'Veg'),
      item('healthyBlends-3', 'Banana Shake', '₹159', 'healthyBlends', '1 portion', 'Veg'),
    ],
  },
  icedTea: {
    name: 'Iced Tea',
    shortDescription: 'Peach and lemon iced tea.',
    icon: '🍑',
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=400&h=300&fit=crop',
    items: [
      item('icedTea-1', 'Peach Iced Tea', '₹149', 'icedTea', '1 portion', 'Veg'),
      item('icedTea-2', 'Lemon Iced Tea', '₹149', 'icedTea', '1 portion', 'Veg'),
    ],
  },
  teaKehwa: {
    name: 'Tea & Kehwa',
    shortDescription: 'Tea and Kashmiri kehwa.',
    icon: '🫖',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=300&fit=crop',
    items: [
      item('teaKehwa-1', 'Classic Tea', '₹49', 'teaKehwa', '1 portion', 'Veg'),
      item('teaKehwa-2', 'Lemon Tea', '₹69', 'teaKehwa', '1 portion', 'Veg'),
      item('teaKehwa-3', 'Honey Ginger Lemon Tea', '₹99', 'teaKehwa', '1 portion', 'Veg'),
      item('teaKehwa-4', 'Masala Tea', '₹59', 'teaKehwa', '1 portion', 'Veg'),
      item('teaKehwa-5', 'Kashmiri Kehwa', '₹99', 'teaKehwa', '1 portion', 'Veg'),
    ],
  },
}

export function generateWhatsAppOrderMessage(item: MenuItem): string {
  return `Hi The Sonnet Cafe, I would like to order:` +
    `\n\n${item.name}\n${item.quantity} - ${item.price}\n\nPlease confirm availability. Thank you!`
}

export interface CartItem extends MenuItem {
  cartQuantity: number
}

export function generateWhatsAppCartMessage(cartItems: CartItem[], totalPrice: number): string {
  const itemsList = cartItems
    .map((item) => {
      const priceStr = item.price.replace('₹', '').replace(',', '')
      const unitPrice = parseFloat(priceStr.replace(/\/.*/, '').trim())
      const totalItemPrice = (isNaN(unitPrice) ? 0 : unitPrice) * item.cartQuantity
      return `• ${item.name}\n  ${item.quantity} × ${item.cartQuantity} = ₹${totalItemPrice.toFixed(0)}`
    })
    .join('\n\n')

  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.cartQuantity, 0)

  return `Hi The Sonnet Cafe, I would like to place an order:

${itemsList}

━━━━━━━━━━━━━━━━━━━━
Total items: ${totalItemsCount}
Estimated total: ₹${totalPrice.toFixed(0)}
━━━━━━━━━━━━━━━━━━━━

Please confirm availability and final price. Thank you!`
}
