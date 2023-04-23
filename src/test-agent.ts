import { ConvoManagerAgent } from "./agents";
import { userMsg, agentMsg } from "./OpenAI";

async function main() {
  const agent = new ConvoManagerAgent();

  const exampleConvo = [
    userMsg("I need to figure out what I need to do next week."),
    agentMsg("Ok what are your goals for the upcoming week?"),
    userMsg("I need to finish building a prototype for work, clean up my house, and pay my taxes")
  ];

  const convoName = await agent.nameConversation(exampleConvo);

  console.log(convoName);
}

main();
