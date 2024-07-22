import { addDays } from "date-fns";
import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { Url, UrlCreateInput } from "../entities/Url";

const argon2 = require("argon2");

@Resolver(Url)
export class UrlResolver {
  // Query pour récupérer toutes les urls
  @Query(() => [Url])
  async getUrls(): Promise<Url[]> {
    const urls = await Url.find();
    return urls;
  }

  // Query pour récupérer une url
  @Query(() => Url, { nullable: true })
  async getUrlByAlias(
    @Arg("alias", () => ID) alias: string
  ): Promise<Url | null> {
    const url = await Url.findOne({
      where: { alias: alias },
      select: ["alias", "url"],
    });
    return url;
  }

  // Mutation création d'une url raccourcie
  @Mutation(() => Url)
  async createRandomAliasUrl(
    @Arg("data", () => UrlCreateInput) data: UrlCreateInput
  ): Promise<Url> {
    // Génération d'un alias aléatoire de 6 caractères alphanumériques
    async function generateAlias(): Promise<string> {
      const alphaNum: string[] =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
          ""
        );

      let newAliasArray: string[] = [];

      for (let i = 0; i < 6; i++) {
        newAliasArray.push(
          alphaNum[Math.floor(Math.random() * alphaNum.length)]
        );
      }

      const newAlias: string = newAliasArray.join("");

      // Vérifier si l'alias existe déjà
      const existingAlias = await Url.findOneBy({ alias: newAlias });
      // Regénérer si l'alias existe déjà
      if (existingAlias) {
        return generateAlias();
      }
      return newAlias;
    }

    if (!data.url.startsWith("http")) {
      data.url = "https://" + data.url;
    }

    const newAlias = generateAlias();
    const shortUrl = new Url();
    shortUrl.alias = await newAlias;
    shortUrl.url = data.url;
    shortUrl.createdAt = new Date();
    shortUrl.expireAt = addDays(new Date(), 15);

    await shortUrl.save();
    return shortUrl;
  }
}
