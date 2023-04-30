export type Message = {
  "role": "user" | "assistant" | "system";
  "content": string;
};

export function userMsg(message: string): Message {
  return { role: "user", content: message };
}

export function assistantMsg(message: string): Message {
  return { role: "assistant", content: message };
}

export function systemMsg(message: string): Message {
  return { role: "system", content: message };
}
