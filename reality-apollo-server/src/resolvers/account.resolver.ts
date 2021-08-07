import {
  Field,
  ObjectType,
  Ctx,
  Arg,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { AuthenticationError } from 'apollo-server-express'
import { hash, compare } from "bcryptjs";
import { verify } from "jsonwebtoken";

import { Account } from "../models";
import { resolverManager } from "./_resolver-manager";
import { MyContext } from "../MyContext";
import { createRefreshToken, createAccessToken } from "../auth";
import { sendRefreshToken } from "../sendRefreshToken";


@ObjectType()
class LoginResponse {
  @Field(() => String)
  accessToken: string;
  @Field(() => Account)
  account: Account;
}
@Resolver((of) => Account)
export class AccountResolver {
  @Query(() => String)
  bye(@Ctx() { payload }: MyContext) {
    return `your user id is: ${payload!.id}`;
  }


  @Query(() => Account, { nullable: true })
  me(@Ctx() context: MyContext) {
    const authorization = context.req.headers["authorization"];

    if (!authorization) {
      return null;
    }

    try {
      const token = authorization.split(" ")[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      return Account.findOne(payload.id);
    } catch (err) {
      console.log(err);
      return null;
    }
  }


  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: MyContext) {
    sendRefreshToken(res, "", process.env.DOMAIN);

    return true;
  }


  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const account = await Account.findOne({ where: { email } });
    if (!account) {
      throw new AuthenticationError('AUTH_INVALID_ACCOUNT')
    }

    const valid = await compare(password, account.password);
    if (!valid) {
      throw new AuthenticationError('AUTH_INVALID_PASSWORD')
    }

    sendRefreshToken(res, createRefreshToken(account), process.env.DOMAIN);

    return {
      accessToken: createAccessToken(account),
      account,
    }
  }


  @Mutation(() => Boolean)
  async register(
    @Arg("username") username: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    try {
      await Account.insert({
        username,
        email,
        password: await hash(password, 12),
      });
    } catch (e) {
      // console.log('password', await hash(password, 12))
      console.log(e);
      return false;
    }

    return true;
  }
}

resolverManager.registerResolver(AccountResolver);
