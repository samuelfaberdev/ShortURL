import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createAlias } from "@/graphql/createAlias";
import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { FRONT_URL } from "../config";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";

const formSchema = z.object({
  url: z.string().min(5, {
    message: "L'url doit faire au minimum 5 caractères.",
  }),
});

export function ShortURLForm() {
  const [doCreateAlias, { data, error }] = useMutation(createAlias);
  const [shortUrl, setShortUrl] = useState("");
  const { toast } = useToast();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  useEffect(() => {
    data ? setShortUrl(`${FRONT_URL}/${data.createRandomAliasUrl.alias}`) : "";
  }, [data]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      await doCreateAlias({ variables: { data: { url: values.url } } });
    } catch {
      console.error(error);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(shortUrl);
    toast({
      title: "ShortURL copiée !",
    });
    console.info(shortUrl);
  }

  return (
    <Card className="w-full max-w-[480px]">
      <CardHeader>
        <CardTitle>Raccourcir l&apos;URL</CardTitle>
        <CardDescription>
          Coller l&apos;URL à raccourcir ci-dessous.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="URL à réduire" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">Envoyer</Button>
          </form>
        </Form>
      </CardContent>
      {data ? (
        <CardFooter className="flex flex-col gap-4 w-full items-start">
          <Label>URL réduite</Label>
          <Input
            id="url"
            type="url"
            placeholder="URL réduite"
            readOnly
            value={shortUrl}
          />

          <Button type="button" onClick={handleCopy} className="w-full">
            Copier
          </Button>
        </CardFooter>
      ) : (
        ""
      )}
    </Card>
  );
}
