import {
  Field,
  ObjectType,
  Ctx,
  Arg,
  Mutation,
  Query,
  Resolver,
  ID,
} from "type-graphql";
import { ApolloError, AuthenticationError } from 'apollo-server-express'
import { Inject } from "typescript-ioc";
import { hash, compare } from "bcryptjs";
import { verify } from "jsonwebtoken";

import { Account, AccountUpdateInput } from "../models";
import { resolverManager } from "./_resolver-manager";
import { MyContext } from "../typings";
import { createRefreshToken, createAccessToken } from "../auth";
import { sendRefreshToken } from "../sendRefreshToken";
import { RequireAuthentication } from "../decorators/RequireAuthentication";
import { AccountService } from "../services";

@ObjectType()
class LoginResponse {
  @Field(() => String)
  accessToken: string;
  @Field(() => Account)
  account: Account;
}


@Resolver((of) => Account)
export class AccountResolver {

  @Inject
  accountService: AccountService

  @Query(() => Account, { nullable: true })
  currentUser(@Ctx() context: MyContext) {
    const authHeader = context.req.headers["authorization"];
    if (!authHeader) {
      return null;
    }

    try {
      const token = authHeader.split(" ")[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      return Account.findOne(payload.id);

    } catch (err) {
      throw new AuthenticationError("AUTH_FAILED")
    }
  }


  @RequireAuthentication()
  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: MyContext) {
    try {
      sendRefreshToken(res, "", process.env.DOMAIN);
      return true;
    } catch (err) {
      throw new ApolloError("LOGOUT_FAILED", "500", { err })
    }
  }


  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const account = await Account.findOne({ where: { email } });
    if (!account) {
      throw new ApolloError('LOGIN_INVALID_ACCOUNT', "400")
    }

    const valid = await compare(password, account.password);
    if (!valid) {
      throw new ApolloError('LOGIN_INVALID_PASSWORD', "400")
    }

    sendRefreshToken(res, createRefreshToken(account), process.env.DOMAIN);

    return {
      accessToken: createAccessToken(account),
      account,
    }
  }


  @Mutation(() => Account)
  @RequireAuthentication()
  async updateAccount(@Ctx() { payload }: MyContext, @Arg("accountInput") accountInput: AccountUpdateInput) {
    const account = await this.accountService.getAccountById(payload.id)

    const updatedAccount = Account.merge(account, accountInput)

    const duplicateFields = await this.accountService.getDuplicateAccountFields(updatedAccount)

    if (duplicateFields.includes("email")) {
      throw new ApolloError("ACCOUNT_EMAIL_TAKEN", "400")
    }

    if (duplicateFields.includes("username")) {
      throw new ApolloError("ACCOUNT_USERNAME_TAKEN", "400")
    }

    try {
      return await updatedAccount.save()
    } catch (err) {
      throw new ApolloError("ACCOUNT_UPDATE_FAILED", "500", { err })
    }
  }

  
  @Mutation(() => ID)
  @RequireAuthentication()
  async deleteAccount(@Ctx() { payload }: MyContext): Promise<string> {
    const account = await this.accountService.getAccountById(payload.id)

    try {
      await account.remove()
      return payload.id
    } catch (err) {
      throw new ApolloError("ACCOUNT_DELETE_FAILED", "500", { err })
    }
  }


  @Mutation(() => Account)
  @RequireAuthentication()
  async register(
    @Arg("username") username: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    const newAccount = Account.merge(new Account(), {
      username,
      email,
      password: await hash(password, 12)
    })

    const duplicateFields = await this.accountService.getDuplicateAccountFields(newAccount)

    if (duplicateFields.includes("email")) {
      throw new ApolloError("REGISTER_EMAIL_TAKEN", "400")
    }

    if (duplicateFields.includes("username")) {
      throw new ApolloError("REGISTER_USERNAME_TAKEN", "400")
    }

    try {
      return await newAccount.save()
    } catch (err) {
      throw new ApolloError("REGISTER_FAILED", "500", { err })
    }
  }
}

resolverManager.registerResolver(AccountResolver);
