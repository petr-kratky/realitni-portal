import express from "express";
import { verify } from "jsonwebtoken";
import { Errors } from "typescript-rest";

export function authenticate(req: express.Request): void {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      throw new Errors.UnauthorizedError('AUTH_HEADER_MISSING')
    }

    try {
      const token = authHeader.split(" ")[1];
      verify(token, process.env.ACCESS_TOKEN_SECRET!);

    } catch {
      throw new Errors.UnauthorizedError('AUTH_TOKEN_INVALID')
    }
  }