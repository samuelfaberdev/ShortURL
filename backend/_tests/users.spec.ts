import { beforeAll, describe, expect, it } from "@jest/globals";
import { GraphQLSchema, graphql } from "graphql";
import jwt from "jsonwebtoken";
import { AuthChecker, buildSchema } from "type-graphql";
import { DataSource } from "typeorm";
import { dataSourceOptions } from "../src/datasource";
import { UserCreateInput } from "../src/entities/User";
import { UserResolver } from "../src/resolvers/Users";

// Signer un jeton JWT avec l'ID de l'utilisateur
function generateAuthToken(userId: string): string {
  return jwt.sign({ userId }, "secret");
}

// Fonction pour vérifier si l'utilisateur est authentifié
const customAuthChecker: AuthChecker<{ authToken: string }> = ({ context }) => {
  const { authToken } = context;

  if (!authToken) {
    return false;
  }

  try {
    const decodedToken = jwt.verify(authToken, "secret");

    return true;
  } catch (error) {
    return false;
  }
};

let dataSource: DataSource;
let schema: GraphQLSchema;
let authToken: string;

beforeAll(async () => {
  dataSource = new DataSource({
    ...dataSourceOptions,
    host: "127.0.0.1",
    port: 5571,
    username: "postgres",
    password: "pgpassword",
    database: "postgres",
    dropSchema: true,
    logging: false,
  });

  await dataSource.initialize();

  schema = await buildSchema({
    resolvers: [UserResolver],
    authChecker: customAuthChecker,
  });
});

describe("create a new quest", () => {
  let createdUserId: number;

  it("should create a new quest", async () => {
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

    const createUser: any = response.data?.createUser;
    createdUserId = createUser.id;

    expect(createUser).toBeDefined();
    expect(createUser).toHaveProperty("id");
    expect(createUser).toHaveProperty("email", data.email);
  });

  it("should find the created quest by its ID", async () => {
    const response = await graphql({
      schema,
      source: `
          query GetUserById($userId: ID!) {
            getUserById(id: $userId) {
              id
              email
            }
          }
        `,
      variableValues: { userId: createdUserId },
    });

    const foundUser = response.data?.getUserById;

    expect(foundUser).toBeDefined();
    expect(foundUser).toHaveProperty("id", createdUserId);
  });
});
