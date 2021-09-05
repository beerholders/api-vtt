import { Router } from "express";
import { body, validationResult } from "express-validator";
import prisma from "@/prisma";
import { RequestWithUser } from "@/types/RequestWithUser";

const newSheetRouter = Router();

newSheetRouter.post(
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
  
      const result = await prisma.gameRoom.create({
            data: {
              characterInfo,
              player,
              playerId: player.id
            },
          });
    }
  );
  
  export { newSheetRouter };