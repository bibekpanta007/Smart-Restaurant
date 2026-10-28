// Sample menu items for the restaurant.
// Later (final project) this will come from the backend database.

const menuItems = [
  {
    id: 1,
    name: 'Garlic Bread',
    category: 'Starters',
    description: 'Toasted bread with garlic butter and herbs.',
    ingredients: ['Bread', 'Butter', 'Garlic', 'Parsley'],
    price: 6.99,
    dietary: ['Vegetarian'],
    available: true,
  },
  {
    id: 2,
    name: 'Garden Salad',
    category: 'Starters',
    description: 'Fresh greens with tomato, cucumber and vinaigrette.',
    ingredients: ['Lettuce', 'Tomato', 'Cucumber', 'Vinaigrette'],
    price: 8.49,
    dietary: ['Vegetarian', 'Vegan', 'Gluten-Free'],
    available: true,
  },
  {
    id: 3,
    name: 'Chicken Wings',
    category: 'Starters',
    description: 'Crispy wings tossed in BBQ sauce.',
    ingredients: ['Chicken', 'BBQ Sauce', 'Spices'],
    price: 12.99,
    dietary: ['Gluten-Free'],
    available: true,
  },
  {
    id: 4,
    name: 'Chicken Alfredo',
    category: 'Mains',
    description: 'Fettuccine pasta in a creamy parmesan sauce with grilled chicken.',
    ingredients: ['Fettuccine', 'Chicken', 'Cream', 'Parmesan'],
    price: 18.99,
    dietary: [],
    available: true,
  },
  {
    id: 5,
    name: 'Vegetable Pasta',
    category: 'Mains',
    description: 'Penne with roasted vegetables in tomato sauce.',
    ingredients: ['Penne', 'Zucchini', 'Bell Pepper', 'Tomato Sauce'],
    price: 15.49,
    dietary: ['Vegetarian'],
    available: true,
  },
  {
    id: 6,
    name: 'Margherita Pizza',
    category: 'Mains',
    description: 'Classic pizza with tomato, mozzarella and fresh basil.',
    ingredients: ['Pizza Dough', 'Tomato Sauce', 'Mozzarella', 'Basil'],
    price: 16.99,
    dietary: ['Vegetarian'],
    available: true,
  },
  {
    id: 7,
    name: 'Gluten-Free Pasta',
    category: 'Mains',
    description: 'Gluten-free spaghetti with marinara sauce.',
    ingredients: ['Gluten-Free Spaghetti', 'Marinara Sauce', 'Basil'],
    price: 16.49,
    dietary: ['Vegetarian', 'Gluten-Free'],
    available: true,
  },
  {
    id: 8,
    name: 'Chocolate Lava Cake',
    category: 'Desserts',
    description: 'Warm chocolate cake with a melting centre.',
    ingredients: ['Chocolate', 'Flour', 'Eggs', 'Butter'],
    price: 8.99,
    dietary: ['Vegetarian'],
    available: true,
  },
  {
    id: 9,
    name: 'Fruit Sorbet',
    category: 'Desserts',
    description: 'Refreshing mango and raspberry sorbet.',
    ingredients: ['Mango', 'Raspberry', 'Sugar'],
    price: 6.49,
    dietary: ['Vegan', 'Gluten-Free'],
    available: true,
  },
  {
    id: 10,
    name: 'Fresh Lemonade',
    category: 'Beverages',
    description: 'Homemade lemonade with mint.',
    ingredients: ['Lemon', 'Sugar', 'Mint', 'Water'],
    price: 4.49,
    dietary: ['Vegan', 'Gluten-Free'],
    available: true,
  },
  {
    id: 11,
    name: 'Iced Coffee',
    category: 'Beverages',
    description: 'Cold brewed coffee served over ice.',
    ingredients: ['Coffee', 'Milk', 'Ice'],
    price: 4.99,
    dietary: ['Vegetarian', 'Gluten-Free'],
    available: false,
  },
];

export const categories = ['Starters', 'Mains', 'Desserts', 'Beverages'];

// helper function so pages don't use the array directly
// (in the final project this will call the API instead)
export function getMenuItems() {
  return menuItems;
}