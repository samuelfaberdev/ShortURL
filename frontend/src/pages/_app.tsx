import "@/styles/globals.css";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";

const link = createHttpLink({
  uri: process.env.API_URL,
  credentials: "include",
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

// Disabling SSR
export default dynamic(() => Promise.resolve(App), { ssr: false });
