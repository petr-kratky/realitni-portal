import { Context, Path, POST, ServiceContext } from "typescript-rest"
import { Inject } from "typescript-ioc"
import { verify } from "jsonwebtoken"

import { AccountService } from "../services"
import { attachRefreshToken } from "../lib/auth/refreshToken"
import { ServiceConfig } from "../config"

@Path("/auth")
export class AuthController {
  @Inject
  accountService: AccountService
  @Inject
  config: ServiceConfig

  @POST
  @Path("/refresh")
  async refresh(@Context { request, response }: ServiceContext): Promise<any> {
    const token = request.cookies.jid

    if (!token) {
      return response.send({ ok: false, accessToken: "" })
    }

    let payload: any = null

    try {
      payload = verify(token, this.config.auth.refreshTokenSecret)
    } catch (err) {
      console.log(err)
      return response.send({ ok: false, accessToken: "" })
    }

    const user = await this.accountService.getAccountById(payload.id)

    if (!user) {
      return response.send({ ok: false, accessToken: "" })
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return response.send({ ok: false, accessToken: "" })
    }

    attachRefreshToken(response, this.accountService.createRefreshToken(user), this.config.server.domain)

    return response.send({ ok: true, accessToken: this.accountService.createAccessToken(user) })
  }
}
