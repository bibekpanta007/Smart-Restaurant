import { useState, useRef, useEffect } from 'react';
import { aiResponses, fallbackAnswer, suggestedQuestions } from '../data/aiResponses';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { restaurant } from '../data/restaurantInfo';

// turns ['A', 'B', 'C'] into "A, B and C"
function joinNames(names) {
  if (names.length === 1) return names[0];
  return names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];
}

// finds the item ordered the most across all orders
function getMostPopularItem(orders) {
  const counts = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      counts[item.name] = (counts[item.name] || 0) + item.quantity;
    });
  });

  let best = null;
  for (const name in counts) {
    if (best === null || counts[name] > counts[best]) best = name;
  }
  return best;
}

function getAnswer(question, user, orders) {
  const text = question.toLowerCase();

  // personalized: last order from the user's real order history
  if (text.includes('last time') || text.includes('last order') || text.includes('previous order')) {
    if (!user) return 'Please log in so I can check your order history.';

    const myOrders = orders.filter((o) => o.userId === user.id);
    if (myOrders.length === 0) return "You haven't ordered anything yet. Would you like a recommendation?";

    const lastOrder = myOrders[0]; // orders are stored newest first
    const names = lastOrder.items.map((item) => item.name);
    return `Your previous order was ${joinNames(names)}.`;
  }

  // recommendation based on the most popular item
  if (text.includes('recommend') || text.includes('suggest')) {
    const popular = getMostPopularItem(orders);
    if (popular) return `Based on popular orders, we recommend our ${popular}.`;
  }

  // otherwise use the dataset
  const match = aiResponses.find((response) =>
    response.keywords.some((keyword) => text.includes(keyword))
  );
  return match ? match.answer : fallbackAnswer;
}

function ChatBot() {
  const { user } = useAuth();
  const { orders } = useOrders();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
        { from: 'bot', text: `Hi! I'm the ${restaurant.name} assistant. How can I help you today?` },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // used to scroll to the newest message
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  function sendMessage(text) {
    if (text.trim() === '') return;

    setMessages((prev) => [...prev, { from: 'user', text }]);
    setInput('');
    setIsTyping(true);

    // short delay so it feels like the AI is "thinking"
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: 'bot', text: getAnswer(text, user, orders) }]);
      setIsTyping(false);
    }, 700);
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <>
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>{restaurant.name} Assistant</span>
            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-bubble ${msg.from}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && <div className="chat-bubble bot typing">Typing...</div>}
            <div ref={bottomRef} />
          </div>

          {/* quick questions, only shown before the first question */}
          {messages.length === 1 && (
            <div className="chat-suggestions">
              {suggestedQuestions.map((q) => (
                <button key={q} onClick={() => sendMessage(q)}>{q}</button>
              ))}
            </div>
          )}

          <form className="chat-input" onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
            />
            <button type="submit" className="btn">Send</button>
          </form>
        </div>
      )}

      {/* floating button to open / close the chat */}
      <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '×' : '💬'}
      </button>
    </>
  );
}

export default ChatBot;