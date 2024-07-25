import Link from "next/link";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export function SignupCard() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          Vous voulez plus ? Essayez les fonctionnalités Premium !
        </CardTitle>
        <CardDescription>
          Liens raccourcis personnalisés, dashboard avec satistiques
          détaillées...
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 w-full">
        <Link href="/signup" className="w-full">
          <Button type="button" className="w-full">
            Créer un compte
          </Button>
        </Link>
        <Link href="/signin">Vous avez déjà un compte ? Se connecter.</Link>
      </CardContent>
    </Card>
  );
}
