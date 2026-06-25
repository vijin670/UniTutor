import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot } from 'lucide-react';
import { API_URL } from '../../config';

const AIPanel = () => {
  const [messages, setMessages] = useState([{ text: "Hi! I have your complete academic context. Ask me about your schedule, marks, fees, or anything!", isBot: true }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInput('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/chat/ask`, { question: userMsg });
      setMessages(prev => [...prev, { text: res.data.answer, isBot: true }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Network error. Make sure backend is running.", isBot: true }]);
    } finally { setLoading(false); }
  };

  return (
    <aside className="ai-panel">
      <div className="ai-header">
        <Bot size={20} />
        <div style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.01em' }}>UniTutor AI</div>
      </div>
      <div className="ai-messages">
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
            background: msg.isBot ? 'var(--gray-50)' : 'var(--black)',
            color: msg.isBot ? 'var(--text-primary)' : 'var(--white)',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            borderBottomRightRadius: !msg.isBot ? '3px' : 'var(--radius-md)',
            borderBottomLeftRadius: msg.isBot ? '3px' : 'var(--radius-md)',
            maxWidth: '88%',
            lineHeight: 1.55,
            fontSize: '0.875rem',
            border: msg.isBot ? '1px solid var(--border)' : 'none',
            whiteSpace: 'pre-wrap'
          }}>
            {msg.text}
          </div>
        ))}
        {loading && <div style={{ alignSelf: 'flex-start', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Thinking...</div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="ai-input-wrapper">
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Ask about marks, fees..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            style={{ paddingRight: '3rem', fontSize: '0.85rem' }}
          />
          <button
            className="btn-primary"
            onClick={handleSend}
            style={{ position: 'absolute', right: '4px', top: '4px', bottom: '4px', padding: '0 0.75rem', borderRadius: 'var(--radius-sm)' }}
            disabled={loading}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AIPanel;
