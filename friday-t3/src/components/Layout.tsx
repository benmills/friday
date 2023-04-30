import React from 'react';
import Tabs from './Tabs';
import styled from 'styled-components';

const Layout = ({ children }: { children: React.ReactNode; }) => {
  return (
    <Wrapper>
      <Tabs />
      {children}
    </Wrapper>
  );
};

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  * {
    font-family: "FiraCodeRegular"
  }
`;

export default Layout;