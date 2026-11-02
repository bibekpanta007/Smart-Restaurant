import { useState, useRef, useEffect } from 'react';
import { aiResponses, fallbackAnswer, suggestedQuestions } from '../data/aiResponses';

// find the first answer whose keywords appear in the question
function getAnswer(question) {
  const text = question.toLowerCase();
  const match = aiResponses.find((response) =>
    response.keywords.some((keyword) => text.includes(keyword))
  );
  return match ? match.answer : fallbackAnswer;
}

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi! I'm your Smart Restaurant assistant. How can I help you today?" },
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
      setMessages((prev) => [...prev, { from: 'bot', text: getAnswer(text) }]);
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
            <span>🤖 Restaurant Assistant</span>
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