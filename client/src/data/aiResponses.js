// Simulated AI dataset.
// The first six come from the assignment brief, the rest are extra.
// Each entry has keywords to look for in the question, and the answer to give.

export const aiResponses = [
  {
    keywords: ['last time', 'last order', 'previous order'],
    answer: 'Your previous order was Chicken Alfredo and Chocolate Lava Cake.',
  },
  {
    keywords: ['special', 'today'],
    answer: "Today's special is Chicken Alfredo for $18.99.",
  },
  {
    keywords: ['vegetarian', 'veggie'],
    answer: 'We offer Vegetable Pasta, Margherita Pizza, and Garden Salad.',
  },
  {
    keywords: ['recommend', 'suggest'],
    answer: 'Based on popular orders, we recommend our Chicken Alfredo.',
  },
  {
    keywords: ['gluten'],
    answer: 'Yes. We offer gluten-free pasta and selected salads.',
  },
  {
    keywords: ['dessert', 'sweet'],
    answer: 'Our Chocolate Lava Cake is our most popular dessert.',
  },
  {
    keywords: ['vegan'],
    answer: 'Our vegan options are the Garden Salad, Fruit Sorbet and Fresh Lemonade.',
  },
  {
    keywords: ['vegan'],
    answer: 'Our vegan options include the Garden Salad, Tomato Basil Soup, Fruit Sorbet, Fresh Lemonade and Sparkling Water.',
  },
  {
    keywords: ['deliver', 'pickup'],
    answer: 'We offer delivery for a $4.99 fee, or free pickup. You can choose at checkout.',
  },
  {
    keywords: ['reserv', 'book', 'table', 'birthday', 'event'],
    answer: 'You can book a table on the Reservations page. We also host birthday parties and corporate events!',
  },
  {
    keywords: ['thank', 'nice', 'great', 'awesome', 'cool'],
    answer: "Glad I could help! Is there anything else you'd like to know?",
  },
  {
    keywords: ['hello', 'hey', 'good morning', 'good evening'],
    answer: "Hello! Ask me about today's specials, dietary options or recommendations.",
  },
];

// shown when no keyword matches
export const fallbackAnswer =
  "Sorry, I'm not sure about that. Try asking about today's specials, vegetarian or gluten-free options, desserts, or recommendations.";

// quick question buttons (from the assignment brief)
export const suggestedQuestions = [
  'What are today\'s specials?',
  'What vegetarian meals do you have?',
  'What do you recommend?',
  'Do you have gluten-free options?',
  'What is the most popular dessert?',
  'What did I order last time?',
];