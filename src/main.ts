import { MainAgent, TaskAgent, KeyWordAgent, KnowledgeBaseAgent } from "./agents";
import readline from 'readline';

console.log("Starting up...");
console.log("loading history...");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const taskAgent = new TaskAgent();
const keyWordAgent = new KeyWordAgent();
const knowledgeBaseAgent = new KnowledgeBaseAgent();
const agent = new MainAgent(taskAgent, keyWordAgent, knowledgeBaseAgent);

async function promptUser(): Promise<void> {
  rl.question('You: ', async (input: string) => {
    console.log(" ");

    if (input == "/todo") {
      console.log(taskAgent.tasks);
    } else if (input == "/keyword") {
      console.log(keyWordAgent.keyWords);
    } else if (input == "/kb") {
      console.log(knowledgeBaseAgent.knowledgeBase);
    } else {
      console.log(`Bot: ${await agent.sendMessage(input)}`);
      taskAgent.extractAndSaveTasks(agent.convo);
    }

    promptUser();
  });
}

knowledgeBaseAgent.extractAndSaveKeyWords(agent.convo, taskAgent.tasks).then(promptUser);
// promptUser();
