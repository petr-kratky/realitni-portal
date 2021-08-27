import { createMethodDecorator } from "type-graphql";
import { verify } from "jsonwebtoken";

import { MyContext } from "../typings";
import { ApolloError, AuthenticationError } from "apollo-server-express";

export function RequireAuthentication() {
  return createMethodDecorator<MyContext>(async ({ context }, next) => {
    const authHeader = context.req.headers["authorization"];

    if ((!authHeader)) {
      throw new AuthenticationError("AUTH_HEADER_MISSING")
    }

    try {
      const token = authHeader.split(" ")[1];
      const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      context.payload = payload as any;

    } catch (err) {
      console.log(err);
      throw new AuthenticationError("AUTH_TOKEN_INVALID");
    }

    return next();

  })
};
