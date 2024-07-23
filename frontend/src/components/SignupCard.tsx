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
      <CardContent>
        <Link href="/signup">
          <Button type="button" className="w-full">
            Créer un compte
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
