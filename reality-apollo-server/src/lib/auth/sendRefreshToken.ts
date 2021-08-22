import { Response } from "express";

export const sendRefreshToken = (res: Response, token: string, domain: string) => {
  res.cookie("jid", token, {
    httpOnly: true,
    domain: domain
  });
};
