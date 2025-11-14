
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getCareerBotAnswer } from '../services/geminiService';
import { ChatBubble, X, Bot, UserCircle, Send } from './icons';
import { marked } from 'marked';


interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
}

const LoadingIndicator: React.FC = () => (
  <div className="flex items-center space-x-2">
    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
  </div>
);

const CareerBot: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { id: 1, sender: 'bot', text: "Hi! I'm CareerBot. Ask me a question below, or select one of these suggestions." }
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!user) return null;

  const predefinedQuestions = [
    `What are the most in-demand skills for a ${user.careerTrack}?`,
    `How can I improve my resume for a ${user.experienceLevel} role?`,
    `Suggest a portfolio project for my skills.`,
    `Common interview questions for a ${user.experienceLevel}?`,
    `Tell me about the job market for ${user.careerTrack}.`
  ];
  
  const sendQuestion = async (question: string) => {
    setInputError(null);
    if (!question.trim()) return;

    const wordCount = question.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount > 30) {
        setInputError("Your question must be 30 words or less.");
        setTimeout(() => setInputError(null), 3000);
        return;
    }

    const newUserMessage: Message = { id: Date.now(), sender: 'user', text: question };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const answer = await getCareerBotAnswer(question, user);
      const newBotMessage: Message = { id: Date.now() + 1, sender: 'bot', text: answer };
      setMessages(prev => [...prev, newBotMessage]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Sorry, something went wrong.";
      const newBotMessage: Message = { id: Date.now() + 1, sender: 'bot', text: errorMessage };
      setMessages(prev => [...prev, newBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionClick = (question: string) => {
    sendQuestion(question);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendQuestion(inputValue);
    setInputValue('');
  };

  const showQuestions = !isLoading && messages.length > 0 && messages[messages.length - 1]?.sender === 'bot';

  return (
    <>
      {/* Chat Window */}
      <div className={`fixed bottom-24 right-4 sm:right-8 w-[calc(100%-2rem)] max-w-sm h-[70vh] max-h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col transition-all duration-300 ease-in-out z-40 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <header className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Bot className="text-orange-500"/> CareerBot
          </h3>
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </header>
        
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0"><Bot className="w-5 h-5 text-white"/></div>}
              <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${msg.sender === 'bot' ? 'bg-gray-100 dark:bg-gray-700' : 'bg-orange-500 text-white'}`}>
                 <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) as string }}></div>
              </div>
               {msg.sender === 'user' && <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0"><UserCircle className="w-5 h-5 text-gray-600"/></div>}
            </div>
          ))}
          {isLoading && (
             <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0"><Bot className="w-5 h-5 text-white"/></div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3">
                <LoadingIndicator />
              </div>
            </div>
          )}
           {showQuestions && (
            <div className="pt-2">
              <div className="flex flex-col items-start gap-2">
                {predefinedQuestions.map((q, i) => (
                  <button key={i} onClick={() => handleQuestionClick(q)} className="w-full text-left text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-gray-700 hover:bg-orange-100 dark:hover:bg-gray-600 p-2 rounded-md transition-colors">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        
        <footer className="p-4 border-t dark:border-gray-700">
            <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask a question..."
                    disabled={isLoading}
                    className="flex-1 p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none disabled:opacity-50"
                    aria-label="Your message"
                />
                <button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className="bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                    aria-label="Send message"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
            {inputError && <p className="text-red-500 text-xs mt-1">{inputError}</p>}
        </footer>
      </div>

      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 sm:right-8 bg-orange-500 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 transition-transform duration-200 hover:scale-110 z-50"
        aria-label="Toggle CareerBot"
      >
        {isOpen ? <X className="w-7 h-7" /> : <ChatBubble className="w-7 h-7" />}
      </button>
    </>
  );
};

export default CareerBot;
