import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styled from "styled-components";
import Tabs from "~/components/Tabs";
import Terminal from "~/components/Terminal";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Friday</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main>
        <Tabs />
        <Terminal />
      </Main>
    </>
  );
};

const Main = styled.main`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  * {
    font-family: "FiraCodeRegular"
  }
`;

export default Home;