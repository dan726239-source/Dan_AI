
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chat } from '@google/genai';
import { ChatMessage as ChatMessageType, MessageSender } from './types';
import { initializeChat } from './services/geminiService';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: 'initial-message',
      text: "Hello! I'm Dan, your friendly AI assistant. How can I help you today?",
      sender: MessageSender.BOT
    }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);

  useEffect(() => {
    const initChat = () => {
      try {
        const chatSession = initializeChat();
        setChat(chatSession);
      } catch (e) {
        console.error("Failed to initialize chat:", e);
        setError("Could not initialize AI chat session. Please check your API key.");
      }
    };
    initChat();
  }, []);

  const handleSendMessage = useCallback(async (inputText: string) => {
    if (isLoading || !inputText.trim() || !chat) return;

    setIsLoading(true);
    setError(null);

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      text: inputText,
      sender: MessageSender.USER,
    };
    
    setMessages(prev => [...prev, userMessage]);

    const botMessageId = (Date.now() + 1).toString();
    const botMessagePlaceholder: ChatMessageType = {
        id: botMessageId,
        text: '',
        sender: MessageSender.BOT,
    };
    setMessages(prev => [...prev, botMessagePlaceholder]);


    try {
      const stream = await chat.sendMessageStream({ message: inputText });
      let accumulatedText = '';

      for await (const chunk of stream) {
        accumulatedText += chunk.text;
        setMessages(prev => prev.map(msg => 
            msg.id === botMessageId ? { ...msg, text: accumulatedText } : msg
        ));
      }
      
      if(accumulatedText.length === 0) {
        setMessages(prev => prev.map(msg => 
            msg.id === botMessageId ? { ...msg, text: "I'm sorry, I couldn't generate a response. Please try again." } : msg
        ));
      }

    } catch (e) {
      console.error("Error sending message:", e);
      const errorMessage = "Sorry, something went wrong. Please try again later.";
      setError(errorMessage);
       setMessages(prev => prev.map(msg => 
            msg.id === botMessageId ? { ...msg, text: errorMessage } : msg
        ));
    } finally {
      setIsLoading(false);
    }
  }, [chat, isLoading]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <ChatHeader />
      <MessageList messages={messages} isLoading={isLoading} />
       {error && <div className="text-red-500 text-center py-2">{error}</div>}
      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;
