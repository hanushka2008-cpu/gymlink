import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Loader2, User, Bot, Dumbbell, Sparkles } from 'lucide-react';
import { askFitnessQuestion } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface ChatbotProps {
  onClose: () => void;
  isDarkMode: boolean;
}

export default function Chatbot({ onClose, isDarkMode }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hello! I'm your GYMLINK AI coach. How can I help you with your fitness journey today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await askFitnessQuestion(userMessage, messages);
      setMessages(prev => [...prev, { role: 'model', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-inherit">
      <div className="p-6 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-accent rounded-xl">
            <Bot size={24} className="text-black" />
          </div>
          <div>
            <h2 className={`text-xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              AI COACH
            </h2>
            <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest flex items-center">
              <Sparkles size={10} className="mr-1" /> Powered by Gemini
            </p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-200'}`}
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-4 rounded-2xl flex space-x-3 ${
              msg.role === 'user' 
                ? 'bg-accent text-black rounded-tr-none font-semibold' 
                : isDarkMode ? 'bg-white/10 text-white rounded-tl-none' : 'bg-slate-200 text-slate-800 rounded-tl-none'
            }`}>
              {msg.role === 'model' && <Bot size={16} className="mt-1 flex-shrink-0" />}
              <p className="text-sm leading-relaxed">{msg.content}</p>
              {msg.role === 'user' && <User size={16} className="mt-1 flex-shrink-0" />}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className={`p-4 rounded-2xl flex items-center space-x-3 ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`}>
              <Loader2 size={16} className="animate-spin" />
              <span className="text-xs font-bold uppercase tracking-widest opacity-50">Coach is thinking...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything about fitness..."
            className={`w-full py-4 pl-6 pr-14 rounded-2xl outline-none transition-all border ${
              isDarkMode 
                ? 'bg-white/5 border-white/10 focus:border-accent text-white' 
                : 'bg-white border-slate-200 focus:border-accent text-slate-900'
            }`}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all ${
              input.trim() && !isLoading ? 'bg-accent text-black' : 'opacity-20 pointer-events-none'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[10px] text-center mt-4 opacity-40 font-medium">
          AI can make mistakes. Consult a doctor before starting a new exercise regime.
        </p>
      </div>
    </div>
  );
}
