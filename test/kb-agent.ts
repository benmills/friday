import { KnowledgeBaseAgent } from "../src/agents";
import { userMsg, agentMsg, openaiEmbedding, openaiEmbeddings } from "../src/OpenAI";
const cosineSimilarity = require('cosine-similarity');

function calculateSimilarities(embeddings: number[][][], questionEmbedding: number[][]): number[] {
  return embeddings.map(embedding => cosineSimilarity(embedding, questionEmbedding));
}

function selectContext(similarities: number[], knowledgeBase: any[], topN: number): any[] {
  const sortedIndices = similarities
    .map((similarity, index) => ({ similarity, index }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topN)
    .map(({ index }) => index);

  return sortedIndices.map(index => knowledgeBase[index]);
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
    },
    {
      title: 'Cora Birthday',
      slug: 'startup_info',
      description: "Cora's birthday is in July",
      related: ['family', 'event']
    }
  ];

  const embeddings: number[][][] = await openaiEmbeddings(exampleKB.map((k) => JSON.stringify(k)));

  const newMessage = 'Can you tell me more about the Meso startup?';
  const newEmbedding: number[][] = await openaiEmbedding(newMessage);

  const similarities = calculateSimilarities(embeddings, newEmbedding)
  console.log(similarities);

  const topN = 2; // Adjust this value as needed
  const context = selectContext(similarities, exampleKB, topN);

  console.log("Context to provide based on message `" + newMessage + "`:");
  console.log(context.map((c) => `${c.title}: ${c.description.substring(0, 15) + "..."} ${c.related.map((r: string) => `#${r}`)}`));
  console.log("\nFull KB:");
  console.log(exampleKB.map((c) => `${c.title}: ${c.description.substring(0, 15) + "..."} ${c.related.map((r: string) => `#${r}`)}`));
}

main();
