import { type AppType } from "next/app";

import { api } from "~/utils/api";

import GlobalStyles from "~/components/GlobalStyles";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Component {...pageProps} />
      <GlobalStyles />
    </>
  );
};

export default api.withTRPC(MyApp);
