import fs from 'fs';
const CONVO_FILE = 'convo.json';

type Msg = {
  "role": string;
  "content": string;
}

if (fs.existsSync(CONVO_FILE)) {
  const jsonData = fs.readFileSync(CONVO_FILE, 'utf-8');
  const res: Msg[] = JSON.parse(jsonData);

  const output = res.map((m) => {
    if (m.role != "system") {
      return `${m.role}: ${m.content}`;
    } else {
      return "";
    }
  }).join("\n");

  console.log(output);

  // for (const m of res) {
  //   if (m.role != "system") {
  //     console.log(`${m.role}: ${m.content}`);
  //   }
  // };
} else {
  console.log("NO CONVO");
}
