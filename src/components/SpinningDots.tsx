import React from 'react';
import styled, { keyframes } from 'styled-components';

const SpinningDots: React.FC = () => {
  return <Wrapper />;
};

const spinningChars = keyframes`
  0% { content: '⠋'; }
  12.5% { content: '⠙'; }
  25% { content: '⠹'; }
  37.5% { content: '⠸'; }
  50% { content: '⠼'; }
  62.5% { content: '⠴'; }
  75% { content: '⠦'; }
  87.5% { content: '⠧'; }
  100% { content: '⠇'; }
`;

const Wrapper = styled.span`
  display: inline-block;

  &:before {
    content: '';
    animation: ${spinningChars} 1s steps(8) infinite;
  }
`;

export default SpinningDots;
