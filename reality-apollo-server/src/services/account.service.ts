import { ApolloError } from "apollo-server-express"
import { sign } from "jsonwebtoken"
import { Inject, Singleton } from "typescript-ioc"

import { ServiceConfig } from "../config"
import { Account } from "../models"

@Singleton
export class AccountService {
  @Inject
  config: ServiceConfig

  public async getDuplicateAccountFields(account: Account): Promise<String[]> {
    const duplicateFields: string[] = []

    try {
      const emailDuplicate = await Account.findOne({ where: { email: account.email } })

      if (emailDuplicate && emailDuplicate.id !== account.id) duplicateFields.push("email")

      const usernameDuplicate = await Account.findOne({ where: { username: account.username } })
      if (usernameDuplicate && usernameDuplicate.id !== account.id) duplicateFields.push("username")

      return duplicateFields
    } catch (err) {
      throw new ApolloError(err.message, undefined, { err })
    }
  }

  public async getAccountById(id: string): Promise<Account> {
    try {
      const account = await Account.findOne(id, { relations: ["recent_estates", "favorite_estates"] })
      if (!account) throw new ApolloError("ACCOUNT_NOT_FOUND", "404")
      return account
    } catch (err) {
      throw new ApolloError(err.message, "500", { err })
    }
  }

  public createAccessToken = (account: Account) => {
    return sign({ id: account.id }, this.config.auth.accessTokenSecret, {
      expiresIn: "7d"
    })
  }

  public createRefreshToken = (account: Account) => {
    return sign({ id: account.id, tokenVersion: account.tokenVersion }, this.config.auth.refreshTokenSecret, {
      expiresIn: "7d"
    })
  }
}
