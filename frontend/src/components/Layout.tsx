import { Inter } from "next/font/google";
import Head from "next/head";
import { ReactNode } from "react";
import { Toaster } from "./ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="favicon.ico" />
      </Head>
      <main
        className={`flex min-h-screen flex-col items-center gap-4 p-6 sm:p-12 lg:p-24 ${inter.className}`}
      >
        <img src="/logo.png" className="h-14" height={56} />
        <section className="flex flex-col gap-4 w-full max-w-[800px]">
          {children}
        </section>
      </main>
      <Toaster />
    </>
  );
}
