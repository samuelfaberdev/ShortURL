import { DashboardURLForm } from "@/components/DashboardUrlForm";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToastClose } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { deleteUrl } from "@/graphql/deleteUrl";
import { mySelf } from "@/graphql/mySelf";
import { useMutation, useQuery } from "@apollo/client";
import { PopoverClose } from "@radix-ui/react-popover";
import { ClipboardCopy, Trash2 } from "lucide-react";
import { Inter } from "next/font/google";
import Link from "next/link";
import router from "next/router";

export type UrlType = {
  alias: string;
  url: string;
  createdAt: string;
  clics: number;
};

const inter = Inter({ subsets: ["latin"] });

export default function Dashboard() {
  const { toast } = useToast();
  const { loading, error, data: getMe } = useQuery(mySelf);
  const [doDeleteUrl, { data: deleteData, error: deleteError }] = useMutation(
    deleteUrl,
    {
      refetchQueries: [mySelf],
    }
  );

  if (loading) return <p>Chargement...</p>;

  if (error) {
    setTimeout(() => router.replace("/signin"), 2000);
    return (
      <main
        className={`flex flex-col min-h-screen justify-center items-center p-24 ${inter.className}`}
      >
        <p>Veuillez vous authentifier...</p>
      </main>
    );
  }

  const urls: UrlType[] = getMe.mySelf.urls;

  const sortedUrls = [...urls];

  sortedUrls.sort((a, b) => {
    return Date.parse(a.createdAt) - Date.parse(b.createdAt);
  });

  async function handleDelete(alias: string) {
    const { data } = await doDeleteUrl({
      variables: { alias },
    });
    console.log(data.deleteUrl);
    toast({
      title: `Alias ${data.deleteUrl.alias} supprimé avec succès`,
      action: <ToastClose />,
    });
  }

  function handleCopy(alias: string) {
    navigator.clipboard.writeText(location.origin + "/" + alias);
    toast({
      title: "ShortURL copiée !",
    });
  }

  return (
    <Layout title="ShortURL - Dashboard">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>Vous pouvez gérer vos liens ici.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 w-full">
          <Table>
            <TableCaption>La liste de vos URLs raccourcis.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Alias</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Copier</TableHead>
                <TableHead>Créé le</TableHead>
                <TableHead>Nb clics</TableHead>
                <TableHead className="text-right">Supprimer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUrls.map((url) => (
                <TableRow key={url.alias}>
                  <TableCell className="font-medium">{url.alias}</TableCell>
                  <TableCell className="max-w-80 overflow-hidden">
                    <Link href={url.url}>{url.url}</Link>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleCopy(url.alias)}>
                      <ClipboardCopy className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell>{url.createdAt.split("T")[0]}</TableCell>
                  <TableCell className="font-medium">{url.clics}</TableCell>
                  <TableCell className="text-right">
                    <Popover>
                      <PopoverTrigger>
                        <Button variant="destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="flex flex-col gap-4 w-full items-center">
                        <p>Êtes-vous sur ?</p>
                        <div className="flex gap-4">
                          <Button
                            onClick={() => handleDelete(url.alias)}
                            variant="destructive"
                          >
                            Oui
                          </Button>
                          <PopoverClose>
                            <Button>Non</Button>
                          </PopoverClose>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Popover>
        <PopoverTrigger>
          <Button>Ajouter une url</Button>
        </PopoverTrigger>
        <PopoverContent className="w-full max-w-[800px]">
          <DashboardURLForm />
        </PopoverContent>
      </Popover>
    </Layout>
  );
}
