import { Router } from "express";
import { loginRouter } from "./login";
import { logoutRouter } from "./logout";
import { signupRouter } from "./signup";
import { sessionRouter } from "./session";
import { usersRouter } from "./users";
import { getValidateAuthSessionWithExceptions } from "@/middlewares/auth";

const apiRouter = Router();

apiRouter.use(getValidateAuthSessionWithExceptions(["/login", "/signup"]));
apiRouter.use("/login", loginRouter);
apiRouter.use("/logout", logoutRouter);
apiRouter.use("/signup", signupRouter);
apiRouter.use("/session", sessionRouter);
apiRouter.use("/users", usersRouter);

export { apiRouter };
