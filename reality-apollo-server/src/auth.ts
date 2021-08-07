import { Account } from "./models/account.model";
import { sign, verify } from "jsonwebtoken";
import { sendRefreshToken } from "./sendRefreshToken"

export const createAccessToken = (account: Account) => {
  return sign({ id: account.id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "7d"
  });
};

export const createRefreshToken = (account: Account) => {
  return sign(
    { id: account.id, tokenVersion: account.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d"
    }
  );
};

export const RefreshTokenReguestHandler = async (req, res) => {
  const token = req.cookies.jid;
  if (!token) {
    return res.send({ ok: false, accessToken: "" });
  }
  let payload: any = null;
  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
  } catch (err) {
    console.log(err);
    return res.send({ ok: false, accessToken: "" });
  }
  const user = await Account.findOne({ id: payload.id });
  if (!user) {
    return res.send({ ok: false, accessToken: "" });
  }
  if (user.tokenVersion !== payload.tokenVersion) {
    return res.send({ ok: false, accessToken: "" });
  }
  sendRefreshToken(res, createRefreshToken(user), process.env.DOMAIN);
  return res.send({ ok: true, accessToken: createAccessToken(user) });
}
