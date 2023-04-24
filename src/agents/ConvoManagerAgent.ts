import { Agent } from "../Agent";
import { Msg, systemMsg, openaiChat } from "../OpenAI";
import { KnowledgeBaseAgent, MainAgent } from "./";
import fs from 'fs';

const CONVO_FILE = 'convo.json';

export type Convo = {
  name: string,
  agent: MainAgent,
};

export class ConvoManagerAgent extends Agent {
  convos: { [key: string]: Convo };
  currentConvo: Convo | undefined;
  lastUpdateAt: number;
  knowledgeBaseAgent: KnowledgeBaseAgent | undefined;
  saveLock: boolean = false;

  constructor({ knowledgeBaseAgent }: {
    knowledgeBaseAgent?: KnowledgeBaseAgent;
  } = {}) {
    super();
    this.convos = this.loadConversations();
    this.lastUpdateAt = 0;
    this.knowledgeBaseAgent = knowledgeBaseAgent;
  }

  startConvo(): MainAgent {
    const newConvoName = `New Convo ${Object.keys(this.convos).length}`;

    const newConvo = {
      name: newConvoName,
      agent: new MainAgent({ knowledgeBaseAgent: this.knowledgeBaseAgent })
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
        console.log("Updating convo names");
        this.currentConvo.name = newName;
        this.convos[newName] = this.currentConvo;
        delete this.convos[oldName];
        this.lastUpdateAt = this.currentConvo.agent.convo.length;
      } else {
        throw ("Tried to overwrite a convo");
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

  async saveConversations(): Promise<void> {
    if (this.saveLock) {
      throw ("Attempted to save convo while another save was happening");
    }

    this.saveLock = true;
    fs.writeFile(CONVO_FILE, JSON.stringify(this.convos, null, 2), (error) => {
      this.saveLock = false;
      if (error) {
        throw (error);
      }
    });
  }

  loadConversations(): { [key: string]: Convo } {
    if (fs.existsSync(CONVO_FILE)) {
      const jsonData = fs.readFileSync(CONVO_FILE, 'utf-8');
      return JSON.parse(jsonData) as { [key: string]: Convo }
    }

    return {};
  }
}
