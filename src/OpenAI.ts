import dotenv from 'dotenv';
import axios from 'axios';
import * as process from 'process';
import { encode } from 'gpt-3-encoder';

dotenv.config({ path: '.env.local' });

const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.OPENAI_KEY;
console.log("Using api key:", API_KEY);

export type Msg = {
  "role": string;
  "content": string;
};

export function userMsg(message: string): Msg {
  return { role: "user", content: message };
}

export function agentMsg(message: string): Msg {
  return { role: "assistant", content: message };
}

export function systemMsg(message: string): Msg {
  return { role: "system", content: message };
}

export async function openaiChat(messages: Msg[]): Promise<string> {
  let requestBody = {
    "model": "gpt-3.5-turbo",
    "messages": messages
  };

  console.log("Tokens used:", getTokenCount(messages));

  const response = await axios.post(API_URL, requestBody, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    }
  });

  return response.data.choices[0].message.content.trim();
}

export function getTokenCount(messages: Msg[]): number {
  let totalTokens = 0;
  for (const m of messages) {
    totalTokens += encode(`${m.role}: ${m.content}`).length;
  }
  return totalTokens;
}
