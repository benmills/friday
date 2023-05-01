import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import TerminalInput from './TerminalInput';

import { Message, userMsg, assistantMsg } from "../OpenAITypes";

const Terminal = () => {
  const [history, setHistory] = useState<Message[]>([]);

  const onUserInput = async (input: string) => {
    setHistory((prevHistory) => [...prevHistory, userMsg(input)]);

    const resp = await fetch(`${window.location.origin}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "user_message": input })
    });

    const fridayMsg = assistantMsg((await resp.json()).friday_response);

    setHistory((prevHistory) => [...prevHistory, fridayMsg]);
  };

  return (
    <Wrapper>
      <Chat>
        {history.map((m: Message, key) => {
          if (m.role === "assistant") {
            return <Response key={key}>{m.content}</Response>
          } else if (m.role === "user") {
            return <Prompt key={key}>{m.content}</Prompt>
          } else {
            return <Response key={key}>Error! {JSON.stringify(m)}</Response>
          }
        })}
        <TerminalInput onInput={onUserInput} />
      </Chat>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  background-color: #050309;
  color: #fff;
  height: 100%;
  padding: 1em;
  overflow: auto;
`;

const WelcomeMessage = styled.div``;
const Logo = styled.div`
`;

const Chat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Response = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background-color: #8346ff2f;
  padding: 1em;
  outline: 2px solid #050309;
  outline-offset: -0.5em;
`;
const Prompt = styled.div``;

const MemorySources = styled.div``;

const Code = styled.code`
  display: block;
  white-space: pre-wrap;
  word-wrap: break-word;
  box-decoration-break: clone;
  padding: 1em;
  background-color: #050309;
  border-radius: 4px;
`;

export default Terminal;
