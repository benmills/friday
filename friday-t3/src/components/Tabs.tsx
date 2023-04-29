import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import UnstyledButton from './UnstyledButton';
import SpinningDots from './SpinningDots';

const Tabs = () => {
  return (
    <Wrapper>
      <Tab href="/0" activeTab={true}>
        [Friday AI app wiki]
        {' '}
        <CloseTab>(x)</CloseTab>
        <Status>
          <SpinningDots />
        </Status>
      </Tab>
      <Tab href="/1">[New Chat 1]{' '}<CloseTab>(x)</CloseTab></Tab>
      <AddTab as="button" onClick={() => console.log("add a tab here")}>(+)</AddTab>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  background-color: #8446ff;
  color: #fff;
`;

const CloseTab = styled(UnstyledButton)`
  display: none;
  width: 3ch;
`;

const Status = styled.span`
  display: inline-flex;
  width: 3ch;
`;

const Tab = styled(Link) <{
  activeTab?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0.5em 1em;
  background-color: ${({ activeTab }) => activeTab ? '#050309' : 'transparent'};
  color: #fff;
  text-decoration: none;

  &:hover {
    background-color: #050309;

    ${CloseTab} {
      display: inline-flex;
    }

    ${Status} {
      display: none;
    }
  }
`;

const AddTab = styled(UnstyledButton)`
  border: none;
  padding: 4px 2px;
  background-color: #050309;
  border-radius: 4px;
  margin: 6px;
`;

export default Tabs;