// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Chat } from "../../Chat";

const chat = new Chat();

type Data = {
  name?: string
  error?: string
  friday_response?: string;
}

function errorRes(res: any, body: string) {
  res.status(400).json({ error: `Req body must be: {"user_message":"<msg>"}.\nGot: ${JSON.stringify(body)}` })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    try {
      if (req.body.user_message) {
        const output = await chat.sendMessage(req.body.user_message);
        res.status(200).json({ friday_response: output })
      } else {
        errorRes(res, req.body);
      }
    } catch (e) {
      console.error(e);
      errorRes(res, req.body);
    }
  } else {
    res.status(200).json({ name: 'John Doe' })
  }
}
