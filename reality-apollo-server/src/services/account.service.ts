import { ApolloError } from "apollo-server-express";
import { Singleton } from "typescript-ioc";

import { Account } from "../models";

@Singleton
export class AccountService {
  public async getDuplicateAccountFields(account: Account): Promise<String[]> {
    const duplicateFields: string[] = []

    try {
      const emailDuplicate = await Account.findOne({ where: { email: account.email } })

      if (emailDuplicate && emailDuplicate.id !== account.id)
        duplicateFields.push("email")

      const usernameDuplicate = await Account.findOne({ where: { username: account.username } })
      if (usernameDuplicate && usernameDuplicate.id !== account.id)
        duplicateFields.push("username")

      return duplicateFields

    } catch (err) {
      throw new ApolloError(err.message, undefined, { err })
    }
  }

  public async getAccountById(id: string): Promise<Account> {
    try {
      const account = await Account.findOne(id)
      if (!account) throw new ApolloError("ACCOUNT_NOT_FOUND", "404")
      return account
    } catch (err) {
      throw new ApolloError(err.message, "500", { err })
    }
 
  }


}