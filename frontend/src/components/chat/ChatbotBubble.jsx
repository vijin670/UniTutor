import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send } from 'lucide-react';

const ChatbotBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hi! I'm your UniTutor assistant. How can I help you today?", isBot: true }]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInput('');

    try {
      const res = await axios.post('http://localhost:5000/api/chat/ask', { question: userMsg });
      setMessages(prev => [...prev, { text: res.data.answer, isBot: true }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting right now.", isBot: true }]);
    }
  };

  return (
    <>
      <div className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </div>

      {isOpen && (
        <div className="chatbot-bubble">
          <div className="chatbot-header">
            <span>UniTutor AI Assistant</span>
            <X size={18} cursor="pointer" onClick={() => setIsOpen(false)} />
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input-area">
            <input 
              type="text" 
              className="input-field" 
              placeholder="Ask me anything..." 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              style={{ borderRadius: '2rem', paddingRight: '3rem' }}
            />
            <button 
              className="btn-primary" 
              onClick={handleSend}
              style={{ position: 'absolute', right: '1.25rem', bottom: '1.25rem', padding: '0.5rem', borderRadius: '50%' }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotBubble;
