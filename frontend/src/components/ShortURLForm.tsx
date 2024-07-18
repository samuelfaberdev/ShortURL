import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createAlias } from "@/graphql/createAlias";
import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";

const formSchema = z.object({
  url: z.string().min(5, {
    message: "L'url doit faire au minimum 5 caractères.",
  }),
});

export function ShortURLForm() {
  const [doCreateAlias, { data, error }] = useMutation(createAlias);
  const [shortUrl, setShortUrl] = useState("");
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  useEffect(() => {
    data
      ? setShortUrl(`http://localhost:3000/${data.createRandomAliasUrl.alias}`)
      : "";
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
    console.info(shortUrl);
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-[480px]"
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
                <FormDescription>
                  Ceci est l&apos;url que vous souhaitez réduire.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Envoyer</Button>
          {data ? (
            <FormItem>
              <FormLabel>URL réduite</FormLabel>
              <Input
                id="url"
                type="url"
                placeholder="URL réduite"
                readOnly
                value={shortUrl}
              />
              <Button type="button" onClick={handleCopy}>
                Copier
              </Button>
            </FormItem>
          ) : (
            ""
          )}
        </form>
      </Form>
    </>
  );
}
