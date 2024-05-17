import { getUrlByAlias } from "@/graphql/getUrlByAlias";
import { useQuery } from "@apollo/client";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function AliasRedirection() {
  const router = useRouter();

  const { loading, error, data } = useQuery(getUrlByAlias, {
    variables: {
      alias: router.query.alias,
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  console.log(data.getUrlByAlias.url);

  setTimeout(() => router.replace(data.getUrlByAlias.url), 5000);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      Going to : {data.getUrlByAlias.url}
    </main>
  );
}
