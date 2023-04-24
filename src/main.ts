import { setOpenAIDebug, getOpenAIDebug } from "./OpenAI";
import { MainAgent, TaskAgent, KeyWordAgent, KnowledgeBaseAgent, ConvoManagerAgent } from "./agents";
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

const convoManager = new ConvoManagerAgent({ knowledgeBaseAgent });
let agent = convoManager.startConvo();

async function promptUser(): Promise<void> {
  console.log(" ");
  rl.question('You: ', async (input: string) => {
    console.log(" ");

    const commands: { [key: string]: () => void } = {
      "/todo": () => {
        console.log(taskAgent.tasks);
      },
      "/debug": () => {
        setOpenAIDebug(!getOpenAIDebug());
        console.log("Debug was set to `" + getOpenAIDebug() + "`");
      },
      "/keyword": () => {
        console.log(keyWordAgent.keyWords);
      },
      "/kb": () => {
        console.log(knowledgeBaseAgent.knowledgeBase);
      },
      "/kb cleanup": async () => {
        setOpenAIDebug(true);
        const prevCount = Object.keys(knowledgeBaseAgent.knowledgeBase).length;
        await knowledgeBaseAgent.cleanUpKB();
        console.log("Cleaned up KB! Change:", Object.keys(knowledgeBaseAgent.knowledgeBase).length - prevCount);
        setOpenAIDebug(false);
      },
      "/convos": () => {
        const convoKeys = Object.keys(convoManager.convos);
        for (const i in convoKeys) {
          const n = convoKeys[i];
          console.log(`[${i}]: ${n}`);
        }
        console.log("Type `/convos switch <number>` to switch to a specific conversation. `/convos new` to start a new convo");
      },
      "/convos new": () => {
        agent = convoManager.startConvo();
        console.log("Started new convo. `/convos` to see all active convos");
      },
    };

    if (input.charAt(0) == "/") {
      const command = commands[input];
      if (typeof command !== "undefined") {
        command();
      } else if (input.startsWith("/convos switch")) {
        const convoIndex = parseInt(input.split(" ").slice(-1)[0], 10);
        const targetConvoKey = Object.keys(convoManager.convos)[convoIndex];

        if (typeof targetConvoKey !== "undefined") {
          console.log("Switching to convo ", targetConvoKey);
        } else {
          console.log("Error:", "Unable to find convo for command", input.trim());
        }
      } else {
        console.log("Error:", "Unknown command", input.trim());
      }
    } else {
      console.log(`Bot: ${await agent.sendMessageWithContext(input)}`);
      convoManager.updateCurrentConvoName();
      convoManager.saveConversations();
    }

    promptUser();
  });
}

console.log("Ready!");
promptUser();
