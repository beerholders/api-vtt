import { Router } from "express";
import { usersRouter } from "./users";
import { validateAuthSession } from "@/middlewares/auth";

const apiRouter = Router();

apiRouter.use(validateAuthSession);
apiRouter.use("/users", usersRouter);

export { apiRouter };
