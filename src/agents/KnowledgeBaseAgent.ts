import { Agent } from "../Agent";
import { Task } from "./TaskAgent";
import { Msg, userMsg, systemMsg } from "../OpenAI";
import fs from 'fs';

const KB_FILE = 'kb.json';

export type Knowledge = {
  slug: string;
  title: string;
  description: string;
  related: string[];
}

export class KnowledgeBaseAgent extends Agent {
  knowledgeBase: Knowledge[];

  constructor() {
    super([]);
    this.knowledgeBase = [];
    // this.loadKB();
  }

  getContextPrompts(): Msg[] {
    if (this.knowledgeBase.length == 0) {
      return []
    }

    return [systemMsg(`
System prompt: "Throughout the conversation with the user, utilize the JSON object provided below, which contains an array of pieces of knowledge, to enhance your responses and better assist the user. Focus on understanding the context, titles, descriptions, and related knowledge of each piece of knowledge in order to provide personalized and contextually appropriate assistance. Heavily weigh the context you find in the JSON knowledge base when answering future messages from the user.

Knowledge JSON:
${JSON.stringify(this.knowledgeBase)}

Instructions:
1. For each message the user sends, identify relevant pieces of knowledge from the JSON object.
2. Use the context, titles, descriptions, and related knowledge to improve your responses, giving significant importance to the context found in the JSON knowledge base.
3. Provide helpful and contextually appropriate responses based on the user's message and the identified pieces of knowledge, without explicitly mentioning the knowledge pieces unless the user refers to them.

Keep these instructions in mind for all messages the user sends going forward. Your goal is to provide relevant and context-aware assistance by considering the JSON knowledge base and its context while form

    `)];
  }

  async extractAndSaveKeyWords(convo: Msg[], tasks: Task[]) {
    if (convo.length == 0) return;

    let localConvo = [userMsg(`
      System prompt: "Your task is to analyze the conversation provided below between a user and an AI assistant, as well as the JSON object containing an array of task objects. Extract crucial information and insights from the conversation and tasks that can enhance the user's experience and enable AI assistants to provide more tailored assistance in future interactions.

Consider the conversation context, task titles, descriptions, and tags, and be attentive to personal details, preferences, relationships, key events, dates, or any other valuable information.

Output a JSON array of objects representing the extracted information and insights. Each object should include a title, slug, description, and a list of related knowledge. Ensure the title is clear and relevant, the description is detailed and context-rich, and the slug serves as a unique identifier for each piece of knowledge.

Task JSON:
${JSON.stringify(tasks)}

Conversation:
${JSON.stringify(convo)}

Example output format:
[
  {"title": "User Info", "slug": "user_info", "description": "The user's name is Ben Mills", "related": ["user_birthday"]},
  {"title": "User's Birthday", "slug": "user_birthday", "description": "Detailed and context-rich description of keyword 1, explaining its significance to the user and relevance to the conversation", "related": ["user_info"]}
]"
    `)];

    const response = await this._sendMessage(localConvo);

    try {
      this.knowledgeBase = JSON.parse(response);
      // this.saveKB();
    } catch (e) {
      console.log("Agent response:", response);
      console.log(e);
    };
  }

  saveKB(): void {
    fs.writeFileSync(KB_FILE, JSON.stringify(this.knowledgeBase, null, 2));
  }

  loadKB() {
    if (fs.existsSync(KB_FILE)) {
      console.log("Loading knowledge base...");
      const jsonData = fs.readFileSync(KB_FILE, 'utf-8');
      this.knowledgeBase = JSON.parse(jsonData) as Knowledge[];
    }
  }
}
