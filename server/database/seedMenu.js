require('dotenv').config({ quiet: true });

const pool = require('../config/db');

// same dishes as the React menu
const menuItems = [
  { name: 'Garlic Bread', category: 'Starters', description: 'Toasted bread with garlic butter and herbs.', ingredients: ['Bread', 'Butter', 'Garlic', 'Parsley'], price: 6.99, dietary: ['Vegetarian'], image: '/images/garlic-bread.jpg' },
  { name: 'Garden Salad', category: 'Starters', description: 'Fresh greens with tomato, cucumber and vinaigrette.', ingredients: ['Lettuce', 'Tomato', 'Cucumber', 'Vinaigrette'], price: 8.49, dietary: ['Vegetarian', 'Vegan', 'Gluten-Free'], image: '/images/garden-salad.jpg' },
  { name: 'Chicken Wings', category: 'Starters', description: 'Crispy wings tossed in BBQ sauce.', ingredients: ['Chicken', 'BBQ Sauce', 'Spices'], price: 12.99, dietary: ['Gluten-Free'], image: '/images/chicken-wings.jpg' },
  { name: 'Tomato Basil Soup', category: 'Starters', description: 'Slow-cooked tomato soup with fresh basil.', ingredients: ['Tomato', 'Basil', 'Onion', 'Olive Oil'], price: 7.49, dietary: ['Vegetarian', 'Vegan', 'Gluten-Free'], image: '/images/tomato-soup.jpg' },
  { name: 'Chicken Alfredo', category: 'Mains', description: 'Fettuccine pasta in a creamy parmesan sauce with grilled chicken.', ingredients: ['Fettuccine', 'Chicken', 'Cream', 'Parmesan'], price: 18.99, dietary: [], image: '/images/chicken-alfredo.jpg', isSpecial: true },
  { name: 'Vegetable Pasta', category: 'Mains', description: 'Penne with roasted vegetables in tomato sauce.', ingredients: ['Penne', 'Zucchini', 'Bell Pepper', 'Tomato Sauce'], price: 15.49, dietary: ['Vegetarian'], image: '/images/vegetable-pasta.jpg' },
  { name: 'Margherita Pizza', category: 'Mains', description: 'Classic pizza with tomato, mozzarella and fresh basil.', ingredients: ['Pizza Dough', 'Tomato Sauce', 'Mozzarella', 'Basil'], price: 16.99, dietary: ['Vegetarian'], image: '/images/margherita-pizza.jpg' },
  { name: 'Gluten-Free Pasta', category: 'Mains', description: 'Gluten-free spaghetti with marinara sauce.', ingredients: ['Gluten-Free Spaghetti', 'Marinara Sauce', 'Basil'], price: 16.49, dietary: ['Vegetarian', 'Gluten-Free'], image: '/images/gluten-free-pasta.jpg' },
  { name: 'Grilled Salmon', category: 'Mains', description: 'Atlantic salmon with lemon herb butter and asparagus.', ingredients: ['Salmon', 'Lemon', 'Asparagus', 'Herb Butter'], price: 19.99, dietary: ['Gluten-Free'], image: '/images/grilled-salmon.jpg' },
  { name: 'Classic Beef Burger', category: 'Mains', description: 'Juicy beef patty with cheddar, lettuce and tomato on a brioche bun.', ingredients: ['Beef Patty', 'Brioche Bun', 'Cheddar', 'Lettuce', 'Tomato'], price: 17.49, dietary: [], image: '/images/beef-burger.jpg' },
  { name: 'Chocolate Lava Cake', category: 'Desserts', description: 'Warm chocolate cake with a melting centre.', ingredients: ['Chocolate', 'Flour', 'Eggs', 'Butter'], price: 8.99, dietary: ['Vegetarian'], image: '/images/chocolate-lava-cake.jpg' },
  { name: 'Fruit Sorbet', category: 'Desserts', description: 'Refreshing mango and raspberry sorbet.', ingredients: ['Mango', 'Raspberry', 'Sugar'], price: 6.49, dietary: ['Vegan', 'Gluten-Free'], image: '/images/fruit-sorbet.jpg' },
  { name: 'Tiramisu', category: 'Desserts', description: 'Coffee-soaked ladyfingers layered with mascarpone cream.', ingredients: ['Ladyfingers', 'Mascarpone', 'Espresso', 'Cocoa'], price: 8.49, dietary: ['Vegetarian'], image: '/images/tiramisu.jpg' },
  { name: 'New York Cheesecake', category: 'Desserts', description: 'Creamy baked cheesecake with a graham cracker crust.', ingredients: ['Cream Cheese', 'Graham Crackers', 'Sugar', 'Eggs'], price: 7.99, dietary: ['Vegetarian'], image: '/images/cheesecake.jpg' },
  { name: 'Fresh Lemonade', category: 'Beverages', description: 'Homemade lemonade with mint.', ingredients: ['Lemon', 'Sugar', 'Mint', 'Water'], price: 4.49, dietary: ['Vegan', 'Gluten-Free'], image: '/images/lemonade.jpg' },
  { name: 'Iced Coffee', category: 'Beverages', description: 'Cold brewed coffee served over ice.', ingredients: ['Coffee', 'Milk', 'Ice'], price: 4.99, dietary: ['Vegetarian', 'Gluten-Free'], image: '/images/iced-coffee.jpg', available: false },
  { name: 'Mango Smoothie', category: 'Beverages', description: 'Blended mango, yogurt and a touch of honey.', ingredients: ['Mango', 'Yogurt', 'Honey', 'Ice'], price: 5.99, dietary: ['Vegetarian', 'Gluten-Free'], image: '/images/mango-smoothie.jpg' },
  { name: 'Sparkling Water', category: 'Beverages', description: 'Chilled sparkling mineral water with a lemon slice.', ingredients: ['Sparkling Water', 'Lemon'], price: 2.99, dietary: ['Vegan', 'Gluten-Free'], image: '/images/sparkling-water.jpg' },
];

async function seedMenu() {
  // don't add the dishes twice
  const [rows] = await pool.query('SELECT COUNT(*) AS count FROM menu_items');
  if (rows[0].count > 0) {
    console.log('Menu already has items, nothing added.');
    await pool.end();
    return;
  }

  for (const item of menuItems) {
    await pool.query(
      `INSERT INTO menu_items
        (name, category, description, ingredients, price, dietary, image, available, is_special)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item.name,
        item.category,
        item.description,
        JSON.stringify(item.ingredients),
        item.price,
        JSON.stringify(item.dietary),
        item.image,
        item.available !== false,
        item.isSpecial === true,
      ]
    );
  }

  console.log(`Added ${menuItems.length} menu items.`);
  await pool.end();
}

seedMenu().catch((error) => {
  console.error('Could not seed the menu:', error.message);
  process.exit(1);
});