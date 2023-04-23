import dotenv from 'dotenv';
import axios from 'axios';
import * as process from 'process';
import { encode } from 'gpt-3-encoder';

dotenv.config({ path: '.env.local' });

let DEBUG = false;
const API_URL = 'https://api.openai.com/v1';
const API_KEY = process.env.OPENAI_KEY;

if (DEBUG) {
  console.log("Using api key:", API_KEY);
}

export function setOpenAIDebug(debug: boolean) {
  DEBUG = debug;
}

export function getOpenAIDebug(): boolean {
  return DEBUG;
}

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

  if (DEBUG) {
    console.log("Tokens used:", getTokenCount(messages));
  }

  const response = await _apiPost("/chat/completions", requestBody);
  return response.data.choices[0].message.content.trim();
}

export async function openaiEmbeddings(inputs: string[]) {
  let requestBody = {
    "model": "text-embedding-ada-002",
    "input": inputs
  };

  const response = await _apiPost("/embeddings", requestBody);
  return response.data.data.map((d: { embedding: number[] }) => d["embedding"]);
}

export async function openaiEmbedding(input: string): Promise<number[][]> {
  let requestBody = {
    "model": "text-embedding-ada-002",
    "input": input
  };

  const response = await _apiPost("/embeddings", requestBody);
  return response.data.data[0]["embedding"];
}

async function _apiPost(urlFragment: string, requestBody: object) {
  const url = API_URL + urlFragment;
  try {
    return await axios.post(url, requestBody, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      }
    });
  } catch (e) {
    console.error(e);
    console.log("Failed making POST request to:", url);
    console.log("Request body:", requestBody);
    throw ("OpenAI API Error");
  }
}

function getTokenCount(messages: Msg[]): number {
  let totalTokens = 0;
  for (const m of messages) {
    totalTokens += encode(`${m.role}: ${m.content}`).length;
  }
  return totalTokens;
}
