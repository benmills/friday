import React, { useEffect } from 'react';
import styled from 'styled-components';
import BlockCursorInput from './BlockCursorInput';

const Terminal = () => {
  return (
    <Wrapper>
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
      <Chat>
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
      </Chat>
      <BlockCursorInput />
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
  display: flex;
  flex-direction: column;
  gap: 6px;
  background-color: #8346ff2f;
  border-radius: 4px;
  padding: 1em;
`;
const Prompt = styled.div``;

const MemorySources = styled.div``;

export default Terminal;