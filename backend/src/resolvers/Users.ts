import { validate } from "class-validator";
import Cookies from "cookies";
import jwt from "jsonwebtoken";
import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { ContextType } from "../auth";
import { ChangePasswordInput, User, UserCreateInput } from "../entities/User";

const argon2 = require("argon2");

@Resolver(User)
export class UserResolver {
  // Query pour récupérer tous les utilisateurs
  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    const users = await User.find();
    return users;
  }

  // Query pour récupérer un utilisateur
  @Query(() => User, { nullable: true })
  async getUserById(@Arg("id", () => ID) id: number): Promise<User | null> {
    const user = await User.findOne({
      where: { id: id },
      select: ["id", "email"],
    });
    return user;
  }

  // Query d'inscription
  @Mutation(() => User)
  async signUp(
    @Arg("data", () => UserCreateInput) data: UserCreateInput
  ): Promise<User> {
    const errors = await validate(data);
    if (errors.length !== 0) {
      throw new Error(`Error occured: ${JSON.stringify(errors)}`);
    }

    // Erreur si l'utilisateur existe déjà
    const existingUser = await User.findOneBy({ email: data.email });
    if (existingUser) {
      throw new Error(`L'utilisateur existe déjà`);
    }

    // Création d'un nouvel utilisateur avec le mot de passe hashé
    const newUser = new User();
    const hashedPassword = await argon2.hash(data.password);
    Object.assign(newUser, {
      email: data.email,
      hashedPassword,
    });

    await newUser.save();
    return newUser;
  }

  // Query pour récupérer l'utilisateur actuel
  @Authorized()
  @Query(() => User, { nullable: true })
  async mySelf(@Ctx() context: ContextType): Promise<User | null> {
    return context.user as User;
  }

  // Mutation de MàJ du mot passe utilisateur
  @Authorized()
  @Mutation(() => Boolean)
  async changePassword(
    @Arg("data") data: ChangePasswordInput,
    @Ctx() context: ContextType
  ): Promise<boolean> {
    const { currentPassword, newPassword } = data;

    // Récupération de l'ID de l'utilisateur à partir du contexte
    const userId = context?.user?.id;

    if (!userId) {
      throw new Error("Vous devez être connecté pour effectuer cette action");
    }

    const user = await User.findOneBy({ id: userId });

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    // Vérification du mot de passe actuel
    const isPasswordValid = await argon2.verify(
      user.hashedPassword,
      currentPassword
    );

    if (!isPasswordValid) {
      throw new Error("Mot de passe actuel incorrect");
    }

    // Hash du nouveau mot de passe
    const hashedNewPassword = await argon2.hash(newPassword);

    // Mise à jour du mot de passe dans la base de données
    user.hashedPassword = hashedNewPassword;
    await user.save();

    return true;
  }

  @Mutation(() => User, { nullable: true })
  async signIn(
    @Ctx() context: { req: any; res: any },
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User | null> {
    const existingUser = await User.findOneBy({ email });

    // verify if user exists
    if (existingUser) {
      const isPasswordValid = await argon2.verify(
        existingUser.hashedPassword,
        password
      );

      // verify if password is valid
      if (isPasswordValid) {
        const token = jwt.sign(
          {
            userId: existingUser.id,
          },
          `${process.env.JWT_SECRET}`
        );

        const cookies = new Cookies(context.req, context.res);
        cookies.set("token", token, {
          httpOnly: true,
          secure: false,
          maxAge: 1000 * 60 * 24,
        });

        return existingUser;
      } else {
        console.log(password, "Mauvais mot de passe");
        return null;
      }
    } else {
      console.log(existingUser, "L'utilisateur n'existe pas");
      return null;
    }
  }

  @Mutation(() => Boolean)
  async signOut(@Ctx() context: ContextType): Promise<Boolean> {
    const cookies = new Cookies(context.req, context.res);
    cookies.set("token", "", {
      httpOnly: true,
      secure: false,
      maxAge: 0,
    });
    return true;
  }
}
