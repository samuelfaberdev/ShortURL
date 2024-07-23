import { signup } from "@/graphql/signup";
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

const formSchema = z
  .object({
    email: z.string().email({ message: "Adresse email invalide." }),
    password: z.string().min(8, {
      message: "Le mot de passe doit faire au minimum 8 caractères.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Le mot de passe doit faire au minimum 8 caractères.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Les mots de passe ne sont pas identiques.",
  });

export function SignupForm() {
  const [doSignup, { data: signupData, error }] = useMutation(signup);
  const { toast } = useToast();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data } = await doSignup({
        variables: { data: { email: values.email, password: values.password } },
      });
      if (data.signUp) {
        toast({
          title:
            "Utilisateur créé avec succès, un email de confirmation vous a été envoyé.",
          description: "Redirection vers la page de connexion...",
          action: <ToastClose />,
        });
        setTimeout(() => {
          router.replace("/signin");
        }, 2000);
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
        <CardTitle>Formulaire d&apos;inscription</CardTitle>
        <CardDescription>
          Débloquez les fonctionnalités Premium : Liens raccourcis
          personnalisés, dashboard avec satistiques détaillées...
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirmation du mot de passe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">S&apos;inscrire</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
