import { User } from "@prisma/client";
import { NextFunction, Response } from "express";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import { includes } from "lodash";
import { JWTSignature } from "../types/JWTSignature";
import { RequestWithUser } from "../types/RequestWithUser";

if (!process.env.TOKEN_KEY) {
  console.warn(
    "Did not provide a `TOKEN_KEY` environment key, falling back to a default one. This is dangerous for production environments!"
  );
}

const TOKEN_KEY = process.env.TOKEN_KEY ?? "vtt";

export function generateAuthTokenForUser({ id, email }: User) {
  const jwtSignature: JWTSignature = { userId: id, email };
  return jwt.sign(jwtSignature, TOKEN_KEY, {
    expiresIn: "2h",
  });
}

/**
 * Closure to get the express middleware with exception routes
 * @param exceptions the list of exception routes
 * @returns the validate auth session middleware
 */
export function getValidateAuthSessionWithExceptions(exceptions: string[]) {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const token: string =
      req.body.token ||
      req.query.token ||
      req.headers["x-access-token"] ||
      req.cookies.token;

    if (includes(exceptions, req.path)) return next();

    if (!token) {
      return next(
        new createError.Forbidden("A token is required for authentication")
      );
    }

    try {
      const decoded = jwt.verify(token, TOKEN_KEY) as JWTSignature;
      req.user = decoded;
    } catch (err) {
      return next(new createError.Unauthorized("Invalid Token"));
    }
    return next();
  };
}

export const validateAuthSession = getValidateAuthSessionWithExceptions([]);
