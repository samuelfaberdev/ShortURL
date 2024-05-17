import Cookies from "cookies";
import jwt from "jsonwebtoken";
import { AuthChecker } from "type-graphql";
import { User } from "./entities/User";

export type ContextType = {
  req: any;
  res: any;
  user?: User;
};

// stock jwt token into cookies

export const customAuthChecker: AuthChecker<ContextType> = async ({
  context,
}) => {
  const cookies = new Cookies(context.req, context.res);
  const token = cookies.get("token");

  if (!token) {
    console.error("Missing token");
    return false;
  }

  try {
    const payload = jwt.verify(token, `${process.env.JWT_SECRET}`);
    if (typeof payload === "object" && "userId" in payload) {
      const user = await User.findOneBy({ id: payload.userId });

      if (user !== null) {
        context.user = user;
        return true;
      } else {
        console.error("User not found!");
        return false;
      }
    } else {
      console.error("Missing token, missing userId");
      return false;
    }
  } catch {
    console.error("Invalid token");
    return false;
  }
};
