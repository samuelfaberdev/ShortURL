import { beforeAll, describe, expect, it } from "@jest/globals";
import { GraphQLSchema, graphql } from "graphql";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthChecker, buildSchema } from "type-graphql";
import { DataSource } from "typeorm";
import { dataSourceOptions } from "../src/datasource";
import { User, UserCreateInput } from "../src/entities/User";
import { UserResolver } from "../src/resolvers/Users";

// Signer un jeton JWT avec l'ID de l'utilisateur
function generateAuthToken(userId: string): string {
  return jwt.sign({ userId }, "secret");
}

// Fonction pour vérifier si l'utilisateur est authentifié
const customAuthChecker: AuthChecker<{
  user: any;
  authToken: string;
}> = ({ context }) => {
  const { authToken } = context;

  if (!authToken) {
    return false;
  }

  try {
    const decodedToken = jwt.verify(authToken, "secret") as JwtPayload;
    context.user = {
      id: parseInt(decodedToken.userId, 10),
      email: "testuser@example.com",
      roles: "user",
    } as any;
    return true;
  } catch (error) {
    return false;
  }
};

let dataSource: DataSource;
let schema: GraphQLSchema;
let authToken: string;
let fakeUser: User;

beforeAll(async () => {
  dataSource = new DataSource({
    ...dataSourceOptions,
    host: "127.0.0.1",
    port: 5571,
    username: "postgres",
    password: "pgpassword",
    database: "postgres",
    dropSchema: true,
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();

  schema = await buildSchema({
    resolvers: [UserResolver],
    authChecker: customAuthChecker,
  });

  // Créer un utilisateur fictif dans la base de données
  fakeUser = await User.create({
    email: "testuser@example.com",
    hashedPassword: "hashedPassword",
    createdAt: new Date(),
    roles: "user",
  }).save();

  authToken = generateAuthToken(fakeUser.id.toString());
});

describe("create a new user", () => {
  let createdUserId: number;

  it("should create a new user", async () => {
    const data: UserCreateInput = {
      email: "user@user.com",
      password: "12345678",
    };

    const response = await graphql({
      schema,
      source: `
          mutation SignUp($data: UserCreateInput!) {
            signUp(data: $data) {
              id
              email
            }
          }
        `,
      variableValues: { data },
    });

    const createUser: any = response.data?.signUp;
    createdUserId = createUser.id;

    expect(createUser).toBeDefined();
    expect(createUser).toHaveProperty("id");
    expect(createUser).toHaveProperty("email", data.email);
  });

  it("should find the created user", async () => {
    const response = await graphql({
      schema,
      source: `
          query MySelf {
            mySelf {
              id
              roles
            }
          }
        `,
      contextValue: {
        authToken,
        user: fakeUser,
      },
    });

    const foundUser = response.data?.mySelf;

    expect(foundUser).toBeDefined();
    expect(foundUser).toHaveProperty("id", fakeUser.id.toString());
    expect(foundUser).toHaveProperty("roles", "user");
  });
});
