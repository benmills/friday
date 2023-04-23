import { Agent } from "../Agent";
import { Msg, userMsg, agentMsg } from "../OpenAI";
import { KeyWordAgent } from "./KeyWordAgent";
import { KnowledgeBaseAgent } from "./KnowledgeBaseAgent";
import { TaskAgent } from "./TaskAgent";

// import fs from 'fs';

// const CONVO_FILE = 'convo.json';

export class MainAgent extends Agent {
  convo: Msg[];
  taskAgent: TaskAgent | undefined;
  keyWordAgent: KeyWordAgent | undefined;
  knowledgeBaseAgent: KnowledgeBaseAgent | undefined;

  constructor(taskAgent?: TaskAgent, keyWordAgent?: KeyWordAgent, knowledgeBaseAgent?: KnowledgeBaseAgent) {
    const personalityData = {
      'formality_level': 'informal',
      'verbosity_level': 'low',
      'sentence_structure': 'simple',
      'vocabulary_preference': 'everyday words',
      'punctuation_emoji_usage': 'minimal',
      'tone': 'casual',
      'idiomatic_expressions': ['no brainer', 'light on topics', 'fall into the $0-$1MM bucket'],
      'favorite_phrases': ['sounds good', 'yeah', 'lol', 'nice', 'ok'],
      'response_length': 'short',
      'question_frequency': 'low',
      'language_level': 'basic',
      'personality': { "H": 3.5, "E": 3.0, "X": 3.5, "A": 3.0, "C": 3.5, "O": 3.0 }
    };

    super([`
I want you to parse the following JSON object and use it to respond to the last message in this conversation.Please adjust your communication based on the JSON fields: formality_level, verbosity_level, sentence_structure, vocabulary_preference, punctuation_emoji_usage, tone, idiomatic_expressions, favorite_phrases, response_length, question_frequency, and language_level.Also, consider the personality values provided under the 'personality' key.When you provide the response, do not mention the JSON object or any possible responses.Avoid using repetitive greetings like "Hey!" at the beginning of each message.Simply respond in the most relevant way based on the given information.

${JSON.stringify(personalityData)}
    `]);

    this.convo = this.loadConversation();
    this.taskAgent = taskAgent;
    this.keyWordAgent = keyWordAgent;
    this.knowledgeBaseAgent = knowledgeBaseAgent;
  }

  async sendMessage(message: string): Promise<string> {
    this.convo.push(userMsg(message));

    const response = await this._sendMessage(this.convo, [
      // ...this.taskAgent.getContextPrompts(),
      // ...this.keyWordAgent.getContextPrompts(),
      // ...this.knowledgeBaseAgent.getContextPrompts(),
    ]);

    this.convo.push(agentMsg(response));
    this.saveConversation();
    return response;
  }

  saveConversation(): void {
    // fs.writeFileSync(CONVO_FILE, JSON.stringify(this.convo, null, 2));
  }

  loadConversation(): Msg[] {
    // if (fs.existsSync(CONVO_FILE)) {
    //   const jsonData = fs.readFileSync(CONVO_FILE, 'utf-8');
    //   return JSON.parse(jsonData) as Msg[];
    // }

    return [];
  }
}
