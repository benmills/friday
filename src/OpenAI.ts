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
    console.log("Tokens used:", getTokenCountForMessages(messages));
  }

  const response = await _apiPost("/chat/completions", requestBody);
  return response.data.choices[0].message.content.trim();
}

export async function openaiEmbeddings(inputs: string[]) {
  let requestBody = {
    "model": "text-embedding-ada-002",
    "input": inputs
  };

  if (DEBUG) {
    console.log("Tokens used:", getTokenCount(inputs));
  }

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
    if (DEBUG) {
      console.log(`Making OpenAI API request to ${urlFragment}...`);
    }

    const response = await axios.post(url, requestBody, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    if (DEBUG) {
      console.log(`API call to ${urlFragment} done...`);
    }

    return response;
  } catch (e) {
    console.error(e);
    console.log("Failed making POST request to:", url);
    console.log("Request body:", requestBody);
    throw ("OpenAI API Error");
  }
}

function getTokenCountForMessages(messages: Msg[]): number {
  return getTokenCount(messages.map((m) => `${m.role}: ${m.content}`));
}

function getTokenCount(messages: string[]): number {
  let totalTokens = 0;
  for (const m of messages) {
    totalTokens += encode(m).length;
  }
  return totalTokens;
}

