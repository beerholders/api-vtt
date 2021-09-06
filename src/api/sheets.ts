import { Router } from "express";
import { body, validationResult } from "express-validator";
import prisma from "@/prisma";
import { RequestWithUser } from "@/types/RequestWithUser";
import createError from "http-errors";

const sheetRouter = Router();

sheetRouter.post(
  "/",
  body("characterInfo").notEmpty().withMessage("must not be empty"),

  async (req: RequestWithUser, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { user } = req;
    const { characterInfo } = req.body;

    const player = await prisma.user.findFirst({
      where: { email: user!.email },
    });

    const result = await prisma.sheet.create({
      data: {
        characterInfo,
        playerId: player!.id
      },
    });

    return res.status(201).json(result);
  }
);

sheetRouter.get(
  "/",
  async (req: RequestWithUser, res) => {
    const { user } = req;

    const player = await prisma.user.findFirst({
      where: { email: user!.email },
    });

    const sheets = await prisma.sheet.findMany({
      where: { player: player! }
    });
    res.status(201).json(sheets);
  }
);

sheetRouter.get(
  "/:id",
  async (req, res) => {

    if(isNaN(parseInt(req.params.id)))
      return new createError.BadRequest("Invalid sheet ID");

    const sheet = await prisma.sheet.findFirst({
      where: { id: parseInt(req.params.id) }
    });

    res.status(200).json(sheet);
  }
);

export { sheetRouter };