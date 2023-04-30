import React, { useEffect } from 'react';
import styled from 'styled-components';
import TerminalInput from './TerminalInput';

const Terminal = () => {
  return (
    <Wrapper>
      <Chat>
        <WelcomeMessage>
          <Logo>
            ████╗ ██╗██████╗ ██████╗ ██╗   ██╗
            ██╔═██╗██║██╔══██╗╚════██╗╚██╗ ██╔╝
            ██║ ██║██║██████╔╝ █████╔╝ ╚████╔╝
            ████╔╝██║██╔══██╗██╔═══╝   ╚██╔╝
            ╚═══╝ ╚═╝██║  ██║███████╗   ██║
            ╚═╝  ╚═╝╚══════╝   ╚═╝
          </Logo>
        </WelcomeMessage>
        <Prompt>
          🔑 Enter API key: 123e4567-e89b-12d3-a456-426614174000
        </Prompt>
        <Response>
          Welcome to Friday Chat! Please enter a command to get started.
          <MemorySources>
            Sources: <a href="https://www.gpt3demo.com/">GPT-3 Demo</a>, <a href="https://www.youtube.com/watch?v=9W6YAZjJz4o">OpenAI GPT-3: How It Works & Why It Matters</a>
          </MemorySources>
        </Response>

        <Prompt>
          🔮 What is Friday Chat?
        </Prompt>
        <Response>
          Friday Chat is a multi-agent chat application that utilizes GPT to provide users with a seamless and informative conversational experience. The app is designed to assist users in various tasks by connecting them with specialized chat agents, all while maintaining an easy-to-use interface.
          <MemorySources>
            Sources: <a href="https://www.gpt3demo.com/">GPT-3 Demo</a>, <a href="https://www.youtube.com/watch?v=9W6YAZjJz4o">OpenAI GPT-3: How It Works & Why It Matters</a>
          </MemorySources>
        </Response>

        <Prompt>
          🔮 Write a code block for a red dot using styled-components
        </Prompt>
        <Response>
          Here is a code block for a red dot using styled-components:
          <Code>
            {`
            const RedDot = styled.div\`
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: red;
            \`;
            `}
          </Code>
          <MemorySources>
            Sources: <a href="https://www.gpt3demo.com/">GPT-3 Demo</a>, <a href="https://www.youtube.com/watch?v=9W6YAZjJz4o">OpenAI GPT-3: How It Works & Why It Matters</a>
          </MemorySources>
        </Response>
        <TerminalInput />
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