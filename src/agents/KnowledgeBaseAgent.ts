import { Agent } from "../Agent";
import { Task } from "./TaskAgent";
import { Msg, userMsg, systemMsg, openaiEmbeddings, openaiEmbedding } from "../OpenAI";
import fs from 'fs';
const cosineSimilarity = require('cosine-similarity');

const KB_FILE = 'kb.json';
const KB_EMBEDDINGS_FILE = 'kb_embeddings.json';

export type Knowledge = {
  slug: string;
  title: string;
  description: string;
  related: string[];
}

export class KnowledgeBaseAgent extends Agent {
  knowledgeBase: Knowledge[];
  embeddings: number[][][];

  constructor() {
    super([]);
    this.knowledgeBase = [];
    this.embeddings = [];
    this.loadKB();
  }

  async messageWithContext(message: string): Promise<Msg> {
    return systemMsg(`
Answer the following user message using the provided context. It's very important you use all provided context to give the best possible assistant you can to the user.

Context:
${JSON.stringify(await this.findRelatedEntries(message, 10))}

User Message:
${message}
    `);
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

  async cleanUpKB() {
    if (Object.keys(this.knowledgeBase).length > 20) {
      let localConvo = [userMsg(`
System prompt: "Evaluate the provided knowledge base below and propose a new JSON object that represents the knowledge base that deletes entries you feel are not useful or relevant for the user or AI assistants helping the user. It's very important each entry provides valuable context to both the user and AI assistants in the future and isn't a generic entry.

You should also make sure that any duplicate entries are collapsed and any existing entries have an extensive set of related terms based on all knowledge avaliable in this knowledge base.


Output a JSON array of objects representing the new and cleaned up knowledge base. Each object should include a title, slug, description, and a list of related knowledge. Ensure the title is clear and relevant, the description is detailed and context-rich, and the slug serves as a unique identifier for each piece of knowledge.

Existing Knowledge Base:
${JSON.stringify(this.knowledgeBase)}

Example output format:
[
  {"title": "User Info", "slug": "user_info", "description": "The user's name is Ben Mills", "related": ["user_birthday"]},
  {"title": "User's Birthday", "slug": "user_birthday", "description": "Detailed and context-rich description of keyword 1, explaining its significance to the user and relevance to the conversation", "related": ["user_info"]}
]"
    `)];

      const response = await this._sendMessage(localConvo);

      try {
        const newKB = JSON.parse(response);
        const newEmbeddings = await this.createEmbeddings(newKB);

        this.knowledgeBase = newKB;
        this.embeddings = newEmbeddings;
        this.saveKB();
      } catch (e) {
        console.log("Agent response:", response);
        console.log(e);
      };
    } else {
      return Promise.resolve();
    }
  }

  async processRecentMessages(recentMessages: Msg[]) {
    await this.cleanUpKB();

    let localConvo = [userMsg(`
      System prompt: "Evaluate the new messages provided below between a user and an AI assistant, and add relevant information to the existing knowledge base. Your goal is to incorporate valuable information from the new messages into the knowledge base, enhancing the user's experience and enabling AI assistants to provide more tailored assistance in future interactions. Do not update or delete any existing entries. Only add new entries when necessary.

      Use the context of the conversation and the existing knowledge base to identify valuable information, such as personal details, preferences, relationships, key events, dates, or any other information that could help AI assistants better assist the user. Avoid creating duplicate entries and ensure newly created entries are related to existing entries when it makes sense.

      Output a JSON array of objects representing the updated knowledge base, including only new entries. Each object should include a title, slug, description, and a list of related knowledge. Ensure the title is clear and relevant, the description is detailed and context-rich, and the slug serves as a unique identifier for each piece of knowledge.

      Existing Knowledge Base:
      ${JSON.stringify(this.knowledgeBase)}

      New Messages:
      ${JSON.stringify(recentMessages)}

      Example output format:
      [
        {"title": "User Info", "slug": "user_info", "description": "The user's name is Ben Mills", "related": ["user_birthday"]},
        {"title": "User's Birthday", "slug": "user_birthday", "description": "Detailed and context-rich description of keyword 1, explaining its significance to the user and relevance to the conversation", "related": ["user_info"]}
      ]"
    `)];

    const response = await this._sendMessage(localConvo);

    try {
      const newEntries = JSON.parse(response);
      const newEmbeddings = await this.createEmbeddings(newEntries);
      this.knowledgeBase = this.knowledgeBase.concat(newEntries);
      this.embeddings = this.embeddings.concat(newEmbeddings);
      this.saveKB();
    } catch (e) {
      console.log("Agent response:", response);
      console.log(e);
    };

  }

  async generateNewKnowledgeBase(convo: Msg[], tasks: Task[]) {
    if (convo.length == 0) return;

    let localConvo = [userMsg(`
  System prompt: "Analyze the conversation provided below between a user and an AI assistant, as well as the JSON object containing an array of task objects. Your goal is to extract valuable information and insights from both the conversation and tasks that can enhance the user's experience and enable AI assistants to provide more tailored assistance in future interactions.

  Use the context of the conversation and the tasks to identify valuable information, such as personal details, preferences, relationships, key events, dates, or any other information that could help AI assistants better assist the user. Create knowledge entries for each message and task that contain valuable information.

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
      this.embeddings = await this.createEmbeddings(this.knowledgeBase);
      this.saveKB();
    } catch (e) {
      console.log("Agent response:", response);
      console.log(e);
    };
  }

  async createEmbeddings(knowledgeBase: Knowledge[]) {
    return await openaiEmbeddings(knowledgeBase.map((k) => JSON.stringify(k)));
  }

  async findRelatedEntries(query: string, topN: number = 2): Promise<Knowledge[]> {
    if (this.embeddings) {
      const queryEmbedding: number[][] = await openaiEmbedding(query);

      const similarities = this.calculateSimilarities(this.embeddings, queryEmbedding)

      const sortedIndices = similarities
        .map((similarity, index) => ({ similarity, index }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topN)
        .map(({ index }) => index);

      return sortedIndices.map(index => this.knowledgeBase[index]);

    } else {
      throw ("Can't call findRelatedEntries without having embeddings");
    }
  }


  calculateSimilarities(embeddings: number[][][], questionEmbedding: number[][]): number[] {
    return embeddings.map(embedding => cosineSimilarity(embedding, questionEmbedding));
  }

  saveKB(): void {
    fs.writeFileSync(KB_FILE, JSON.stringify(this.knowledgeBase, null, 2));
    fs.writeFileSync(KB_EMBEDDINGS_FILE, JSON.stringify(this.embeddings, null, 2));
  }

  loadKB() {
    if (fs.existsSync(KB_FILE) && fs.existsSync(KB_EMBEDDINGS_FILE)) {
      console.log("Loading knowledge base...");
      const kbData = fs.readFileSync(KB_FILE, 'utf-8');
      const embeddingsData = fs.readFileSync(KB_EMBEDDINGS_FILE, 'utf-8');

      this.knowledgeBase = JSON.parse(kbData) as Knowledge[];
      this.embeddings = JSON.parse(embeddingsData) as number[][][];
    }
  }
}
