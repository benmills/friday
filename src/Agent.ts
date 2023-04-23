import { Msg, systemMsg, userMsg, openaiChat } from "./OpenAI";

export class Agent {
  systemPrompts: Msg[];

  constructor(systemPrompts: string[]) {
    this.systemPrompts = systemPrompts.map(systemMsg);
  }

  async sendMessage(message: string): Promise<string> {
    return this._sendMessage([userMsg(message)]);
  }

  async _sendMessage(messages: Msg[], additionalSystemPrompts: Msg[] = []): Promise<string> {
    const response = await openaiChat([...this.systemPrompts, ...additionalSystemPrompts, ...messages]);
    return response;
  }
}
