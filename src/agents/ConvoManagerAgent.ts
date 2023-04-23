import { Agent } from "../Agent";
import { Msg, systemMsg, openaiChat } from "../OpenAI";
import { MainAgent } from "./";

export type Convo = {
  name: string,
  agent: MainAgent,
};

export class ConvoManagerAgent extends Agent {
  convos: { [key: string]: Convo };
  currentConvo: Convo | undefined;
  lastUpdateAt: number;

  constructor() {
    super();
    this.convos = {};
    this.lastUpdateAt = 0;
  }

  startConvo(): MainAgent {
    const newConvoName = `New Convo ${Object.keys(this.convos).length}`;

    const newConvo = {
      name: newConvoName,
      agent: new MainAgent()
    };

    this.convos[newConvoName] = newConvo;
    this.currentConvo = newConvo;
    this.lastUpdateAt = 0;

    return this.currentConvo.agent;
  }

  async updateCurrentConvoName(): Promise<void> {
    if (this.currentConvo && (this.currentConvo.agent.convo.length - this.lastUpdateAt) >= 5) {
      const newName = await this.nameConversation(this.currentConvo.agent.convo);
      const oldName = this.currentConvo.name;

      if (typeof this.convos[newName] === 'undefined') {
        this.currentConvo.name = newName;
        this.convos[newName] = this.currentConvo;
        delete this.convos[oldName];
        this.lastUpdateAt = this.currentConvo.agent.convo.length;
      } else {
        throw ("Tried to overright a convo");
      }
    }
  }

  async nameConversation(convo: Msg[]): Promise<string> {
    const response = await openaiChat([systemMsg(`
You will read the following conversation between a user and an AI assistant and create a conversation name that sumarizes the conversation in a way the user or other future AI assistants will understand and find valuable. It's important to fully consider the entire conversation, what the user is trying to do, and any other insights you can infer to come up with a descriptive and short name for the conversation.

Your output will be a valid JSON object that contains a single key called "name" which has a value of the descriptive and short name you come up with for the conversation.

Conversation:
${JSON.stringify(convo)}

Example Output:
{ "name": "Weekly Planning" }
    `)]);

    return JSON.parse(response).name;
  }
}
