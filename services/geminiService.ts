
import { GoogleGenAI, Chat } from "@google/genai";

// Ensure API_KEY is available in the environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

const model = 'gemini-2.5-flash';

export const initializeChat = (): Chat => {
  const chat = ai.chats.create({
    model: model,
    config: {
      systemInstruction: 'You are Dan, a friendly and helpful AI assistant. Your responses should be concise, informative, and always polite. Use markdown for formatting when appropriate.',
    },
  });
  return chat;
};
