import { signin } from "@/graphql/signin";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { ToastClose } from "./ui/toast";
import { useToast } from "./ui/use-toast";

const formSchema = z.object({
  email: z.string().email({ message: "Adresse email invalide." }),
  password: z.string().min(8, {
    message: "Le mot de passe doit faire au minimum 8 caractères.",
  }),
});

export function SigninForm() {
  const [doSignin, { data, error }] = useMutation(signin);
  const { toast } = useToast();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data } = await doSignin({
        variables: { email: values.email, password: values.password },
      });
      console.log(data.signIn);
      if (data.signIn !== null) {
        toast({
          title:
            "Connexion réalisée avec succès. Redirection vers votre Dashboard.",
          action: <ToastClose />,
        });
        // setTimeout(() => {
        //   router.replace("/dashboard");
        // }, 2000);
      } else {
        throw new Error("Mauvais identifiants !");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error.message,
        action: <ToastClose />,
      });
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Formulaire de connexion</CardTitle>
        <CardDescription>
          Connectez-vous pour accéder aux fonctionnalités Premium.
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@provider.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Mot de passe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Se connecter</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
