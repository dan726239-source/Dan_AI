import React, { useState, useRef, useEffect } from 'react';
import SendIcon from './icons/SendIcon';
import MicrophoneIcon from './icons/MicrophoneIcon';

// This is for TypeScript to recognize the webkitSpeechRecognition API
// FIX: Added missing types for the Web Speech API to resolve compilation errors.
declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition };
    webkitSpeechRecognition: { new (): SpeechRecognition };
  }

  interface SpeechRecognitionResult {
    readonly [index: number]: { readonly transcript: string };
    readonly length: number;
  }
  
  interface SpeechRecognitionResultList {
    readonly [index: number]: SpeechRecognitionResult;
    readonly length: number;
  }
  
  interface SpeechRecognitionEvent extends Event {
    readonly results: SpeechRecognitionResultList;
  }
  
  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onend: (() => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    start(): void;
    stop(): void;
  }

  const SpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
  };
}

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSpeechRecognitionSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setText(transcript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };
      
      recognitionRef.current = recognition;
    }

    return () => {
        recognitionRef.current?.stop();
    }
  }, []);

  const handleMicClick = () => {
      if (!recognitionRef.current) return;
      if (isRecording) {
          recognitionRef.current.stop();
      } else {
          setText('');
          recognitionRef.current.start();
          setIsRecording(true);
      }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent);
    }
  }

  return (
    <footer className="bg-gray-800 p-4 border-t border-gray-700">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2 md:space-x-4">
        {isSpeechRecognitionSupported && (
             <button
                type="button"
                onClick={handleMicClick}
                disabled={isLoading}
                className={`flex-shrink-0 text-white rounded-full p-3 ${isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-gray-600 hover:bg-gray-500'} disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-800`}
                aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
                <MicrophoneIcon className="w-6 h-6" />
            </button>
        )}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type or click the mic to talk..."
          className="flex-1 bg-gray-700 rounded-full py-3 px-5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-300"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="bg-cyan-500 text-white rounded-full p-3 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-800"
          aria-label="Send message"
        >
          <SendIcon className="w-6 h-6" />
        </button>
      </form>
    </footer>
  );
};

export default MessageInput;