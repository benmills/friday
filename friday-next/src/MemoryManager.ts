import { createEmbeddings } from "./OpenAI";
const cosineSimilarity = require('cosine-similarity');

interface ContentObject {
  type: string;
  content: string;
}

export class MemoryManager {
  embeddings: number[][][] = [];
  content: ContentObject[] = [];
  maxContentLength: number = 1000;
  contentChunkOverlap = 0.2;
  private dataFileName: string;

  constructor(dataFileName = "memory.json") {
    this.dataFileName = dataFileName;
  }

  async findRelatedContent(query: string, type?: string, topN: number = 3): Promise<string[]> {
    const queryEmbedding: number[][] = (await createEmbeddings([query]))[0];

    let contentIndices = this.content.map((_, index) => index);
    if (type !== undefined) {
      contentIndices = contentIndices.filter(index => this.content[index].type === type);
    }

    const similarities = contentIndices.map((index) => {
      return {
        index: index,
        similarity: cosineSimilarity(this.embeddings[index], queryEmbedding)
      }
    });

    const sortedIndices = similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topN)
      .map(({ index }) => index);

    return sortedIndices.map(index => this.content[index].content);
  }

  async save(rawContents: string[], type: string = "") {
    const newContentObjects: ContentObject[] = [];

    for (const c of rawContents) {
      if (c.length >= this.maxContentLength) {
        let contents = c;
        let chunkSize = this.maxContentLength * (1 + this.contentChunkOverlap);

        while (contents.length > 0) {
          let part = contents.slice(0, chunkSize).trim();
          contents = contents.slice(chunkSize);
          if (part.length > 0) newContentObjects.push({ type, content: part });
        }
      } else {
        newContentObjects.push({ type, content: c });
      }
    }

    const newEmbeddings = await createEmbeddings(newContentObjects.map(co => co.content));

    newContentObjects.forEach((v: ContentObject, i: number) => {
      this.content.push(v);
      this.embeddings.push(newEmbeddings[i]);
    });
  }

  // saveData() {
  //   fs.writeFileSync(this.dataFileName, this.toJSON());
  // }
  //
  // loadData() {
  //   const data = JSON.parse(fs.readFileSync(this.dataFileName, 'utf-8'));
  //   this.content = data.content;
  //   this.embeddings = data.embeddings;
  // }

  toJSON(): string {
    return JSON.stringify({
      content: this.content,
      embeddings: this.embeddings
    })
  }
}

