import express from "express";
import cookieParser from "cookie-parser";
import { apiRouter } from "./api";
import { handleHttpErrors } from "./middlewares/handleHttpErrors";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api", apiRouter);
app.use(handleHttpErrors);

app.listen(3001, () =>
  console.log(`
🚀 Server ready at: http://localhost:3001
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
);
