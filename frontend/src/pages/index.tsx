import Layout from "@/components/Layout";
import { ShortURLForm } from "@/components/ShortURLForm";
import { SignupCard } from "@/components/SignupCard";

export default function Home() {
  return (
    <Layout title="ShortURL">
      <ShortURLForm />
      <SignupCard />
    </Layout>
  );
}
