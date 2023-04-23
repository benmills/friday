import { KnowledgeBaseAgent } from "../src/agents";
import { userMsg, agentMsg, openaiEmbedding } from "../src/OpenAI";
import cosineSimilarity from "cosine-similarity";

async function getRealKB() {
  const exampleConvo = [
    userMsg("Hey nice to meet you! I want to tell you a bit about myself and who I am."),
    agentMsg("Ok great can you tell me more about you?"),
    userMsg("My name is Ben and I live in Redwood City, CA. I'm working on a new startup I founded with my friend Ali called Meso"),
    agentMsg("That's awesome! Starting a new startup is exciting, but also scary. How are you coping?"),
    userMsg("Yeah that's true I've been trying to learn how to cope with the stress better by going on walks."),
  ];
  const exampleTasks = [
    { title: "Work on Meso prototype", description: "Create an example of how Meso could be used with a DEX like Uniswap. Needs to be done by the end of the week of 4/24/23.", tags: ["meso", "development", "crypto", "deadline"] }
  ];

  const agent = new KnowledgeBaseAgent();
  await agent.extractAndSaveKeyWords(exampleConvo, exampleTasks);

  console.log(agent.knowledgeBase);
}

async function main() {
  const exampleKB = [
    {
      title: 'User Info',
      slug: 'user_info',
      description: "The user's name is Ben and he lives in Redwood City, CA. He is working on a startup called Meso with his friend Ali.",
      related: ['startup', 'location']
    },
    {
      title: 'Startup Information',
      slug: 'startup_info',
      description: "Meso is a startup founded by Ben and Ali. Task 'Work on Meso prototype' relates to their project and involves creating an example of how Meso could be used with a DEX like Uniswap.",
      related: ['startup', 'crypto', 'development']
    }
  ];

  const embeddings: number[][] = await openaiEmbedding(JSON.stringify(exampleKB));

  const newMessage = 'Can you tell me more about the Meso startup?';
  const newEmbedding = await openaiEmbedding(newMessage);

  const similarities = embeddings.map((embedding: object) => cosineSimilarity(embedding, newEmbedding));
  const maxSimilarity = Math.max(...similarities);
  const closestEmbeddings = embeddings.filter((_: object, index: number) => similarities[index] === maxSimilarity);

  const relevantData = closestEmbeddings.flatMap(embedding => exampleKB.find(data => data.description.includes(embedding.join(' '))));

  console.log(relevantData);

}

main();
