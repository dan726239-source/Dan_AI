
import React from 'react';
import { ChatMessage as ChatMessageType, MessageSender } from '../types';
import BotIcon from './icons/BotIcon';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === MessageSender.BOT;

  return (
    <div className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
          <BotIcon className="w-5 h-5 text-cyan-400" />
        </div>
      )}
      <div
        className={`max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl ${
          isBot
            ? 'bg-gray-700 text-gray-200 rounded-tl-none'
            : 'bg-cyan-600 text-white rounded-br-none'
        } whitespace-pre-wrap`}
      >
        {message.text}
      </div>
    </div>
  );
};

export default ChatMessage;
