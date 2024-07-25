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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createAlias } from "@/graphql/createAlias";
import { mySelf } from "@/graphql/mySelf";
import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { FRONT_URL } from "../config";
import { useToast } from "./ui/use-toast";

const formSchema = z.object({
  url: z.string().url({ message: "URL invalide." }),
});

export function DashboardURLForm() {
  const [doCreateAlias, { data, error }] = useMutation(createAlias, {
    refetchQueries: [mySelf],
  });
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
    try {
      await doCreateAlias({ variables: { data: { url: values.url } } });
    } catch {
      console.error(error?.message);
    }
  }

  return (
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
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Envoyer</Button>
      </form>
    </Form>
  );
}
