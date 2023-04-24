import { Agent } from "../Agent";
import { Msg, userMsg, agentMsg } from "../OpenAI";
import { KeyWordAgent } from "./KeyWordAgent";
import { KnowledgeBaseAgent } from "./KnowledgeBaseAgent";
import { TaskAgent } from "./TaskAgent";

export class MainAgent extends Agent {
  convo: Msg[];
  taskAgent: TaskAgent | undefined;
  keyWordAgent: KeyWordAgent | undefined;
  knowledgeBaseAgent: KnowledgeBaseAgent | undefined;

  constructor({ convo, taskAgent, keyWordAgent, knowledgeBaseAgent }: {
    taskAgent?: TaskAgent;
    keyWordAgent?: KeyWordAgent;
    knowledgeBaseAgent?: KnowledgeBaseAgent;
    convo?: Msg[];
  } = {}) {
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

    if (convo) {
      this.convo = convo;
    } else {
      this.convo = [];
    }

    this.taskAgent = taskAgent;
    this.keyWordAgent = keyWordAgent;
    this.knowledgeBaseAgent = knowledgeBaseAgent;
  }

  async sendMessageWithContext(message: string): Promise<string> {
    if (this.knowledgeBaseAgent) {
      const messageWithContext = await this.knowledgeBaseAgent.messageWithContext(message);

      const response = await this._sendMessage([...this.convo, messageWithContext]);

      this.convo.push(userMsg(message));
      this.convo.push(agentMsg(response));

      this.knowledgeBaseAgent.processRecentMessages([userMsg(message), agentMsg(response)]);
      return response;
    } else {
      throw ("Tried to call sendMessageWithContext without a knowledgeBaseAgent");
    }
  }
}
