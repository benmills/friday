import { Agent } from "../Agent";
import { Msg, userMsg, systemMsg } from "../OpenAI";
import fs from 'fs';

const TASK_FILE = 'tasks.json';

export type Task = {
  title: string;
  description: string;
  tags: string[];
};

export class TaskAgent extends Agent {
  tasks: Task[];

  constructor() {
    super([]);
    this.tasks = [];
    this.loadTasks();
  }

  getContextPrompts(): Msg[] {
    if (this.tasks.length == 0) {
      return [];
    }

    return [systemMsg(`
Parse the following JSON object and consider it the user's task database. Each task has a title, description, and an array of tags. Tags associate the task with other tasks, concepts, key words, or any way you could imagine a task can be categorized or organized.

Always use this task database to enhance your responses and better assist the user. For instance, if the user asks about what's on their to-do list, you could provide a list of all the task titles.

${JSON.stringify(this.tasks)}
  `)];
  }

  async extractAndSaveTasks(convo: Msg[]) {
    if (convo.length == 0) return;

    const response = await this._sendMessage([userMsg(`
Your job is to suggest tasks from the conversation provided below. It's important to consider the full context of the conversation and identify the tasks most important and relevant for the user. You should respond with a JSON array of possible todo list items. Each item should have a title, a description, and an array of relevant tags based on the conversation. When you provide the list of items, make sure they are clear and actionable. The user should be able to look at the list and know exactly what they need to do. Additionally, make sure to include any relevant tags that could help the user prioritize their tasks. You should also consider the existing task JSON object provided below when searching the conversation for potential tasks. You should not create duplicate tasks and your final JSON object should include the existing tasks with new tasks you've identified added.

  If one of the user's messages implies they want to remove a task in the provided conversation you should remove the task from your results and the existing tasks.

It's very important you only respond with a JSON array that holds objects with three keys: title (string), description (string), and tags (array of strings). Do not include anything else in your response beside a valid JSON array of task objects.

  Existing tasks:
${JSON.stringify(this.tasks)}

  Conversation:
${JSON.stringify(convo)}
    `)]);

    try {
      this.tasks = JSON.parse(response);
      this.saveTasks();
    } catch (error) {
      console.error("Error parsing API response:", response);
    }
  }

  saveTasks(): void {
    fs.writeFileSync(TASK_FILE, JSON.stringify(this.tasks, null, 2));
  }

  loadTasks() {
    if (fs.existsSync(TASK_FILE)) {
      console.log("Loading tasks...");
      const jsonData = fs.readFileSync(TASK_FILE, 'utf-8');
      this.tasks = JSON.parse(jsonData) as Task[];
    }
  }
}
