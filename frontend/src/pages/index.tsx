import { ShortURLForm } from "@/components/ShortURLForm";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>ShortURL</title>
      </Head>
      <main
        className={`flex min-h-screen flex-col items-center gap-4 p-6 sm:p-12 lg:p-24 ${inter.className}`}
      >
        <img src="/logo.png" className="h-14" height={56} />
        <ShortURLForm />
        <Toaster />
      </main>
    </>
  );
}
