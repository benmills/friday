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
  knowledgeBaseAgent: KnowledgeBaseAgent;
  saveLock: boolean = false;

  constructor(knowledgeBaseAgent: KnowledgeBaseAgent) {
    super();
    this.convos = {}
    this.lastUpdateAt = 0;
    this.knowledgeBaseAgent = knowledgeBaseAgent;

    this.loadConversations();
  }

  getOrStartConvo(): MainAgent {
    if (this.currentConvo) {
      return this.currentConvo.agent;
    } else {
      return this.startConvo();
    }
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

  switchConvo(targetConvoName: string): MainAgent {
    if (typeof this.convos[targetConvoName] === "undefined") {
      throw ("Unknown convo `" + targetConvoName + "`");
    }

    this.currentConvo = this.convos[targetConvoName];
    return this.currentConvo.agent;
  }

  async updateConvoNames(): Promise<void> {
    for (const c of Object.values(this.convos)) {
      if (c.agent.convo.length > 5) {
        this.updateConvoName(c);
      }
    }
  }

  async updateConvoName(c: Convo): Promise<void> {
    const newName = await this.nameConversation(c.agent.convo);
    const oldName = c.name;

    if (typeof this.convos[newName] === 'undefined') {
      c.name = newName;
      this.convos[newName] = c;
      delete this.convos[oldName];
    } else {
      throw ("Tried to overwrite a convo");
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
    const convos: { name: string, convo: Msg[] }[] = [];

    for (const c of Object.values(this.convos)) {
      convos.push({
        name: c.name,
        convo: c.agent.convo
      });
    }

    fs.writeFile(CONVO_FILE, JSON.stringify(convos, null, 2), (error) => {
      this.saveLock = false;
      if (error) {
        throw (error);
      }
    });
  }

  loadConversations(): { [key: string]: Convo } {
    if (fs.existsSync(CONVO_FILE)) {
      const jsonData = fs.readFileSync(CONVO_FILE, 'utf-8');
      const convos = JSON.parse(jsonData) as { name: string, convo: Msg[] }[];
      this.convos = {};

      for (const c of convos) {
        this.convos[c.name] = {
          name: c.name,
          agent: new MainAgent({ convo: c.convo, knowledgeBaseAgent: this.knowledgeBaseAgent })
        };
      }

      this.currentConvo = Object.values(this.convos)[0];
    }

    return {};
  }
}
