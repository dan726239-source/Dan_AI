
import React from 'react';
import BotIcon from './icons/BotIcon';

const ChatHeader: React.FC = () => {
  return (
    <header className="bg-gray-800 shadow-md p-4 flex items-center z-10 border-b border-gray-700">
       <div className="relative">
        <BotIcon className="w-10 h-10 text-cyan-400" />
        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-gray-800"></span>
      </div>
      <div className="ml-4">
        <h1 className="text-xl font-bold text-white">Dan</h1>
        <p className="text-sm text-green-400">Online</p>
      </div>
    </header>
  );
};

export default ChatHeader;
