import { Router } from "express";
import { omit } from "lodash";
import prisma from "@/prisma";

const usersRouter = Router();

usersRouter.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users.map((user) => omit(user, ["password"])));
});

export { usersRouter };
