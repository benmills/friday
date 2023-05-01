import axios from 'axios';
import dotenv from 'dotenv';
import { Message } from './OpenAITypes';

dotenv.config({ path: '.env.local' });

const API_URL = 'https://api.openai.com/v1';
const API_KEY = process.env.OPENAI_KEY;



export async function openAiChat(messages: Message[], temperature = 1, top_p = 1): Promise<string> {
  const requestBody = {
    "model": "gpt-3.5-turbo",
    "messages": messages,
    "temperature": temperature,
    "top_p": top_p
  };

  const response = await openAiApi("/chat/completions", requestBody)
  return response.data.choices[0].message.content.trim();
}

export async function createEmbeddings(inputs: string[]) {
  const requestBody = {
    "model": "text-embedding-ada-002",
    "input": inputs
  };

  const response = await openAiApi("/embeddings", requestBody);
  return response.data.data.map((d: { embedding: number[] }) => d["embedding"]);
}

async function openAiApi(urlFragment: string, requestBody: object) {
  return axios.post(API_URL + urlFragment, requestBody, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    }
  });
}
