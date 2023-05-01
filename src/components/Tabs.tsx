import Link from 'next/link';
import React, { useState } from 'react';
import styled from 'styled-components';
import UnstyledButton from './UnstyledButton';
import SpinningDots from './SpinningDots';
import { Plus, X } from 'react-feather';

const Tabs = () => {
  const [tabs, setTabs] = useState([0]);
  const [currentTab, setCurrentTab] = useState<number>(0);

  const addTab = () => {
    setTabs((prevTabs) => [...prevTabs, prevTabs.length]);
  };

  const switchTab = (newTab: number) => {
    setCurrentTab(newTab);
    console.log('tabs not really working!!');
  };

  return (
    <Wrapper>
      {tabs.map((t) => (
        <Tab onClick={() => switchTab(t)} key={t} isActive={t == currentTab}>
          <TabLink href={`/chat/${t}`}>
            [Chat
            {' '}<SpinningDots />]
            {' '}
            <CloseTab><X /></CloseTab>
          </TabLink>
        </Tab>
      ))}
      <AddTab onClick={addTab}><Plus /></AddTab>
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
