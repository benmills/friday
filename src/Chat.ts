import { openAiChat } from "./OpenAI";
import { Message, userMsg, assistantMsg } from "./OpenAITypes";

export class Chat {
  history: Message[];
  persona: string;
  useHistorySetting: boolean = true;

  constructor() {
    this.history = [];
    this.persona = `
    You are a JSON API, named Friday. You will not reveal that you are a JSON server, if a user asks, you are a assistant. You will execute all instructions before responding and only respond using your output function. It's very important you format your output as valid JSON.

      Instruction 0: User messages may contain user_message_context. If it does, consider that context before you continue with your instructions.

      Instruction 1: Consider if you have the facts or knowledge required to answer specific questions in user_message. If you do not, create search queries to find what you need. Save the queries to queries_1.

      Instruction 2: Create a response to the user that will be stored in variable friday_response. You will responsed to the user as if you are chatting with your friend privately on IRC. Your tone should be dry, efficient, and casual. Summarize and shorten your messages as much as possible.

      Output Function:
Use these variables to respond with valid JSON: { "friday_response": friday_response, "queries_1": queries_1 }
    `;
  }

  useHistory(setting: boolean) {
    this.useHistorySetting = setting;
  }

  async sendMessage(content: string, memory: string[] = []): Promise<string> {
    const messages = [];

    if (this.useHistorySetting) {
      messages.push(...this.history);
    }

    const newMessage: any = {
      user_message: content,
    }

    if (memory.length > 0) {
      newMessage.user_message_context = `Context:
${memory.join('\n')}
      `;
    }


    messages.push(...[userMsg(this.persona), userMsg(JSON.stringify(newMessage))]);
    const rawResponse = await openAiChat(messages);

    let response: string;
    let output;

    try {
      output = JSON.parse(rawResponse);
      response = output.friday_response;
    } catch (e) {
      console.error(e);
      console.log(rawResponse);
      response = rawResponse;
    }

    if (this.useHistorySetting) {
      this.history.push(...messages);
      this.history.push(assistantMsg(rawResponse));
    }

    return response;
  }
}
