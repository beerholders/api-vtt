import { Router } from "express";
import { body, validationResult } from "express-validator";
import prisma from "@/prisma";
import { RequestWithUser } from "@/types/RequestWithUser";

const gameRoomRouter = Router();

gameRoomRouter.post(
  "/",
  body("name").notEmpty().withMessage("must not be empty"),
  
  async (req: RequestWithUser, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { user } = req;
    const { name } = req.body;

    const master = await prisma.user.findFirst({
      where: { email: user!.email },
    });
    const result = await prisma.gameRoom.create({
      data: {
        name,
        masterId: master!.id
      },
    });
      
    return res.status(201).json(result);
  }
);
  
export { gameRoomRouter };