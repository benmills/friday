import { Agent } from "../Agent";
import { Task } from "./TaskAgent";
import { Msg, userMsg, systemMsg } from "../OpenAI";
import fs from 'fs';

const KW_FILE = 'keywords.json';

export type KeyWord = {
  title: string;
  description: string;
};

export class KeyWordAgent extends Agent {
  keyWords: KeyWord[];

  constructor() {
    super([]);
    this.keyWords = [];
    this.loadKeyWords();
  }

  getContextPrompts(): Msg[] {
    if (this.keyWords.length == 0) {
      return [];
    }

    return [systemMsg(`
System prompt: "As you assist the user throughout the conversation, internally consider the JSON array of keywords provided below. Use these keywords to enhance your responses and better assist the user without explicitly mentioning the keywords unless the user brings them up. Focus on understanding the context and relevance of each keyword in relation to the user's questions or concerns.

Keywords JSON:
${JSON.stringify(this.keyWords)}

Instructions:
1. For each message the user sends, identify any relevant keywords.
2. Use the descriptions of relevant keywords to improve your answers without explicitly mentioning the keywords unless the user refers to them.
3. Provide helpful and contextually appropriate responses based on the user's messages and the identified keywords.

Keep these instructions in mind for all messages the user sends going forward. Your goal is to provide relevant and context-aware assistance by considering the keywords and their descriptions when formulating your responses."
    `)];
  }

  async extractAndSaveKeyWords(convo: Msg[], tasks: Task[]) {
    if (convo.length == 0) return;

    let localConvo = [userMsg(`
System prompt: "Carefully analyze the conversation provided below between a user and an AI assistant, as well as the JSON object containing an array of task objects. Your goal is to identify important keywords in the conversation and tasks, considering the full context, titles, descriptions, and especially the tags. Focus on understanding the user's perspective and what they would find relevant, helpful, or important. Pay special attention to extracting names, locations, and other pertinent details.

Additionally, take into account the provided JSON object containing existing keywords. Your output should be a JSON array of objects that combines the existing keywords with any new unique keywords you discover. Each object should represent a keyword with a title and a detailed description. The description should provide enough context for future AI agents to understand the importance and relevance of the keyword to the user, which will enable them to provide better assistance.


Task JSON:
${JSON.stringify(tasks)}

Conversation:
${JSON.stringify(convo)}

Existing Keywords JSON:
${JSON.stringify(this.keyWords)}

Example output format:
[ {"title": "Keyword 1", "description": "Detailed and context-rich description of keyword 1, explaining its significance to the user and relevance to the conversation" } ]
    `)];

    const response = await this._sendMessage(localConvo);

    try {
      this.keyWords = JSON.parse(response);
      this.saveKeyWords();
    } catch (e) {
      console.log("Agent response:", response);
      console.log(e);
    };
  }

  saveKeyWords(): void {
    fs.writeFileSync(KW_FILE, JSON.stringify(this.keyWords, null, 2));
  }

  loadKeyWords() {
    if (fs.existsSync(KW_FILE)) {
      console.log("Loading key words...");
      const jsonData = fs.readFileSync(KW_FILE, 'utf-8');
      this.keyWords = JSON.parse(jsonData) as KeyWord[];
    }
  }
}
