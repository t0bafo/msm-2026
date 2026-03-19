/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

let chatSession: Chat | null = null;

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are 'MADNESS', the AI Concierge for Mid-Summer Madness 2026. 
      The festival is in Dallas, Texas. Dates: June 19-21, 2026.
      
      Tone: High energy, urban, helpful, strictly for the culture. Use emojis like ⚡️, 💿, 🌃, ✨, 🌵.
      
      Key Info:
      - Headliners: Diaspora Kings, Afro-Vibe, The Dallas Collective.
      - Genres: Afrobeats, Amapiano, Hip-Hop.
      - Tickets: Standard ($120), VIP ($280), Culture Pass ($750).
      
      Keep responses short (under 50 words) and punchy.`,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!API_KEY) {
    return "Systems offline. (Missing API Key)";
  }

  try {
    const chat = initializeChat();
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "Transmission interrupted.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Signal lost. Try again later.";
  }
};