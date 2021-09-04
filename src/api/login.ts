import { Router } from "express";
import bcrypt from "bcryptjs";
import createError from "http-errors";
import { omit } from "lodash";
import { body, validationResult } from "express-validator";
import prisma from "@/prisma";
import { generateAuthTokenForUser } from "@/middlewares/auth";

const loginRouter = Router();

loginRouter.post(
  "/",
  body("email").isEmail().withMessage("must be a valid email").normalizeEmail(),
  body("password")
    .isLength({ min: 4 })
    .withMessage("must be at least 4 chars long"),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const result = await prisma.user.findFirst({
      where: { email },
    });

    if (result && bcrypt.compareSync(password, result.password)) {
      const token = generateAuthTokenForUser(result);
      return res.cookie("token", token).json({ ...omit(result, ["password"]) });
    }

    return next(new createError.BadRequest("Failed to login."));
  }
);

export { loginRouter };
