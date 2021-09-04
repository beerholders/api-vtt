import { Router } from "express";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import createError from "http-errors";
import { omit } from "lodash";
import { body, validationResult } from "express-validator";
import prisma from "@/prisma";
import { generateAuthTokenForUser } from "@/middlewares/auth";

const signupRouter = Router();

signupRouter.post(
  "/",
  body("name").notEmpty().withMessage("must not be empty"),
  body("email").isEmail().withMessage("must be a valid email").normalizeEmail(),
  body("password")
    .isLength({ min: 4 })
    .withMessage("must be at least 4 chars long"),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      const result = await prisma.user.create({
        data: {
          name,
          email,
          password: bcrypt.hashSync(password, 8),
        },
      });

      const token = generateAuthTokenForUser(result);
      res.cookie("token", token).json({ ...omit(result, ["password"]) });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // Unique constraint violation
        if (e.code === "P2002") {
          return next(
            new createError.BadRequest("A user with that email already exists.")
          );
        }
      }
      throw e;
    }
  }
);

export { signupRouter };
