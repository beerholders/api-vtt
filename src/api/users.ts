import { Router } from "express";
import prisma from "@/prisma";

const usersRouter = Router();

usersRouter.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

export { usersRouter };
