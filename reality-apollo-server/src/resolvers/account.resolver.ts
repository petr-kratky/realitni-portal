import { Ctx, Arg, Mutation, Query, Resolver, ID } from "type-graphql"
import { ApolloError, AuthenticationError } from "apollo-server-express"
import { Inject } from "typescript-ioc"
import { hash, compare } from "bcryptjs"
import { verify } from "jsonwebtoken"

import { Account, AccountUpdateInput, Estate, LoginResponse } from "../models"
import { resolverManager } from "./_resolver-manager"
import { MyContext } from "../typings"
import { attachRefreshToken } from "../lib/auth/refreshToken"
import { RequireAuthentication } from "../decorators/auth-gql"
import { AccountService, EstateService } from "../services"
import { ServiceConfig } from "../config"

@Resolver(of => Account)
export class AccountResolver {
  @Inject
  accountService: AccountService
  @Inject
  estateService: EstateService
  @Inject
  config: ServiceConfig

  @Query(() => Account, { nullable: true })
  currentUser(@Ctx() context: MyContext) {
    const authHeader = context.req.headers["authorization"]
    if (!authHeader) {
      return null
    }
    try {
      const token = authHeader.split(" ")[1]
      const payload: any = verify(token, this.config.auth.accessTokenSecret)
      return this.accountService.getAccountById(payload.id)
    } catch (err) {
      throw new AuthenticationError("AUTH_FAILED")
    }
  }

  @RequireAuthentication()
  @Query(() => [Estate])
  async recentEstates(@Ctx() { payload }: MyContext): Promise<Estate[]> {
    const user = await this.accountService.getAccountById(payload.id, ["recent_estates"])
    return user.recent_estates
  }

  @RequireAuthentication()
  @Query(() => [Estate])
  async favoriteEstates(@Ctx() { payload }: MyContext): Promise<Estate[]> {
    const user = await this.accountService.getAccountById(payload.id, ["favorite_estates"])
    return user.favorite_estates
  }

  @RequireAuthentication()
  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: MyContext) {
    try {
      attachRefreshToken(res, "", this.config.server.domain)
      return true
    } catch (err) {
      throw new ApolloError("LOGOUT_FAILED", "500", { err })
    }
  }

  @RequireAuthentication()
  @Mutation(() => [Estate])
  async addRecentEstate(@Ctx() { payload }: MyContext, @Arg("estate_id") estate_id: string): Promise<Estate[]> {
    const user = await this.accountService.getAccountById(payload.id, ["recent_estates"])
    const visitedEstate = Estate.create({ id: estate_id })
    user.recent_estates = user.recent_estates.filter(estate => estate.id !== visitedEstate.id)
		await user.save()
    if (user.recent_estates.push(visitedEstate) > 5) {
      user.recent_estates.shift()
    }
    await user.save()
    return user.recent_estates
  }

  @RequireAuthentication()
  @Mutation(() => [Estate])
  async addFavoriteEstate(@Ctx() { payload }: MyContext, @Arg("estate_id") estate_id: string): Promise<Estate[]> {
    const user = await this.accountService.getAccountById(payload.id, ["favorite_estates"])
    const favoriteEstate = Estate.create({ id: estate_id })
    if (user.favorite_estates.some(estate => estate.id === favoriteEstate.id)) {
      return user.favorite_estates
    }
    user.favorite_estates.push(favoriteEstate)
    await user.save()
    return user.favorite_estates
  }

  @RequireAuthentication()
  @Mutation(() => [Estate])
  async removeFavoriteEstate(@Ctx() { payload }: MyContext, @Arg("estate_id") estate_id: string): Promise<Estate[]> {
    const user = await this.accountService.getAccountById(payload.id, ["favorite_estates"])
    const newFavoriteEstates = user.favorite_estates.filter(estate => estate.id !== estate_id)
    user.favorite_estates = newFavoriteEstates
    await user.save()
    return user.favorite_estates
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const account = await Account.findOne({ where: { email } })
    if (!account) {
      throw new ApolloError("LOGIN_INVALID_ACCOUNT", "400")
    }

    const valid = await compare(password, account.password)
    if (!valid) {
      throw new ApolloError("LOGIN_INVALID_PASSWORD", "400")
    }

    attachRefreshToken(res, this.accountService.createRefreshToken(account), this.config.server.domain)

    return {
      accessToken: this.accountService.createAccessToken(account),
      account
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
  async register(@Arg("username") username: string, @Arg("email") email: string, @Arg("password") password: string) {
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

resolverManager.registerResolver(AccountResolver)
