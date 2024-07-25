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

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error?.message}</p>;

  if (data.getUrlByAlias === null) {
    setTimeout(() => router.replace(location.origin), 2000);
    return (
      <main
        className={`flex flex-col min-h-screen justify-center items-center p-24 ${inter.className}`}
      >
        <p>
          Alias <span className="font-bold">{router.query.alias}</span>{" "}
          inconnu...
        </p>
        <p>Redirection à l&apos;accueil...</p>
      </main>
    );
  }

  setTimeout(() => router.replace(data.getUrlByAlias.url), 2000);

  return (
    <main
      className={`flex flex-col min-h-screen justify-center items-center p-24 ${inter.className}`}
    >
      <p>C&apos;est parti : {data.getUrlByAlias.url}</p>
    </main>
  );
}
