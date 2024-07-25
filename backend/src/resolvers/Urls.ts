import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { ContextType, getUserFromReq } from "../auth";
import { Url, UrlCreateInput } from "../entities/Url";

@Resolver(Url)
export class UrlResolver {
  // Query pour récupérer toutes les urls
  @Query(() => [Url])
  async getUrls(): Promise<Url[]> {
    const urls = await Url.find({ relations: { createdBy: true } });
    return urls;
  }

  // Query pour récupérer une url
  @Query(() => Url, { nullable: true })
  async getUrlByAlias(
    @Arg("alias", () => ID) alias: string
  ): Promise<Url | null> {
    const url = await Url.findOne({
      where: { alias },
    });

    if (url) {
      url.clics += 1;
      url.save();
    }
    return url;
  }

  // Mutation création d'une url raccourcie
  @Mutation(() => Url)
  async createRandomAliasUrl(
    @Arg("data", () => UrlCreateInput) data: UrlCreateInput,
    @Ctx() context: ContextType
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

    let connectedUser = await getUserFromReq(context.req, context.res);

    if (connectedUser) {
      shortUrl.createdBy = connectedUser;
    }

    await shortUrl.save();
    return shortUrl;
  }

  @Authorized()
  @Mutation(() => Url, { nullable: true })
  async deleteUrl(@Arg("alias", () => ID) alias: string): Promise<Url | null> {
    const url = await Url.findOne({ where: { alias } });
    if (url) {
      await url.remove();
      url.alias = alias;
    }
    return url;
  }
}
