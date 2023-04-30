import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import UnstyledButton from './UnstyledButton';
import SpinningDots from './SpinningDots';
import { Plus, X } from 'react-feather';

const Tabs = () => {
  return (
    <Wrapper>
      <Tab isActive={true}>
        <TabLink href="/chat/0">
          [Friday AI app wiki
          {' '}<SpinningDots />]
          {' '}
          <CloseTab><X /></CloseTab>
        </TabLink>
      </Tab>
      <Tab isActive={false}>
        <TabLink href="/chat/1">
          [New Chat 1]{' '}<CloseTab><X /></CloseTab>
        </TabLink>
      </Tab>
      <AddTab onClick={() => console.log("add a tab here")}><Plus /></AddTab>
      <Logo href="/">FRIDAY</Logo>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: #8446ff;
  color: #fff;
`;

const Status = styled.span`
`;

const TabLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0.5em 1em;
  color: #fff;
  text-decoration: none;

  &:hover {
    background-color: #050309;
  }
`;

const SVGButton = styled(UnstyledButton)`
  --size: 1.4em;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  aspect-ratio: 1/1;
  background-color: #050309;
  color: #fff;
  border-radius: 50%;
  width: var(--size);
  height: var(--size);
  padding: 4px;

  svg {
    width: var(--size);
    height: var(--size);
  }
`;

const AddTab = styled(SVGButton)`
`;

const CloseTab = styled(SVGButton)`
`;

const Tab = styled.div<{
  isActive?: boolean;
}>`
  display: inline-flex;
  ${TabLink} {
    background-color: ${({ isActive }) => isActive ? '#050309' : 'transparent'};
  }

  ${CloseTab} {
    background-color: ${({ isActive }) => isActive ? '#050309' : 'transparent'};
  }
`;

const Logo = styled(Link)`
  margin-left: auto;
  padding: 0.5em 1em;
  font-weight: bold;
  font-family: "FiraCodeSemiBold";
  color: #050309;
`;

export default Tabs;