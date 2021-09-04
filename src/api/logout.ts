import { Router } from "express";

const logoutRouter = Router();

logoutRouter.get("/", async (req, res) =>
  res.clearCookie("token").status(204).json()
);

export { logoutRouter };
