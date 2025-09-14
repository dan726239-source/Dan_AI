
import React, { useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import ChatMessage from './ChatMessage';

interface MessageListProps {
  messages: ChatMessageType[];
  isLoading: boolean;
}

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-2 ml-4">
        <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse"></div>
        <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
);

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.map((msg, index) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
       {isLoading && messages[messages.length-1]?.text === '' && (
           <div className="flex justify-start">
               <TypingIndicator />
           </div>
       )}
      <div ref={messagesEndRef} />
    </main>
  );
};

export default MessageList;
