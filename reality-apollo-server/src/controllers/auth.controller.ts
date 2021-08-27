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
      response.send({ ok: false, accessToken: "" })
      return
    }

    let payload: any = null

    try {
      payload = verify(token, this.config.auth.refreshTokenSecret)
    } catch (err) {
      console.log(err)
      response.send({ ok: false, accessToken: "" })
      return
    }

    const user = await this.accountService.getAccountById(payload.id)

    if (!user) {
      response.send({ ok: false, accessToken: "" })
      return
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      response.send({ ok: false, accessToken: "" })
      return
    }

    attachRefreshToken(response, this.accountService.createRefreshToken(user), this.config.server.domain)

    response.send({ ok: true, accessToken: this.accountService.createAccessToken(user) })
  }
}
