import { Router } from "express";
import { omit } from "lodash";
import prisma from "@/prisma";
import { RequestWithUser } from "@/types/RequestWithUser";

const sessionRouter = Router();

sessionRouter.get("/", async (req: RequestWithUser, res) => {
  const { user } = req;

  const result = await prisma.user.findFirst({
    where: { email: user!.email },
  });

  return res.json({ ...omit(result, ["password"]) });
});

export { sessionRouter };
