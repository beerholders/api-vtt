import { Request } from "express";
import { JWTSignature } from "./JWTSignature";

export interface RequestWithUser extends Request {
  user?: JWTSignature;
}
