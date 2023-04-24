import { MainAgent, KnowledgeBaseAgent } from "../src/agents";
import { userMsg, agentMsg, setOpenAIDebug } from "../src/OpenAI";
import assert from "assert";

setOpenAIDebug(true);

async function main() {
  const agent = new KnowledgeBaseAgent();
  const mainAgent = new MainAgent({ knowledgeBaseAgent: agent });

  // console.log("\nMain Agent Response:" + (await mainAgent.sendMessage("hey whats up")))

  const exampleConvo = [
    userMsg("Hey nice to meet you! I want to tell you a bit about myself and who I am."),
    agentMsg("Ok great can you tell me more about you?"),
    userMsg("My name is Ben and I live in Redwood City, CA. I'm working on a new startup I founded with my friend Ali called Meso"),
    agentMsg("That's awesome! Starting a new startup is exciting, but also scary. How are you coping?"),
    userMsg("Yeah that's true I've been trying to learn how to cope with the stress better by going on walks."),
    agentMsg("Anything else that can help?"),
    userMsg("Yeah I like spending time with my kids. My son's name is Charlie and he is 8 years old and likes Minecraft"),
  ];
  const exampleTasks = [
    { title: "Work on Meso prototype", description: "Create an example of how Meso could be used with a DEX like Uniswap. Needs to be done by the end of the week of 4/24/23.", tags: ["meso", "development", "crypto", "deadline"] }
  ];

  await agent.extractAndSaveKeyWords(exampleConvo, exampleTasks);
  assert(agent.knowledgeBase.length > 0, "Expected to find some KB entries, but found none.");

  // console.log(agent.knowledgeBase);

  console.log(`\nFound ${agent.knowledgeBase.length} KB entries`);
  agent.knowledgeBase.map((e) => {
    console.log(`${e.slug}: "${e.title}" ${e.description.substring(0, 15) + "..."} [${e.related.map((r: string) => "#" + r).join(", ")}]`);
  });

  console.log("\n>> Results from a pure search:");
  console.log(await agent.findRelatedEntries("What is Meso?"))

  console.log("\n>> Now trying with main agent");

  console.log(await mainAgent.sendMessageWithContext("What is meso?"));
}

main();
