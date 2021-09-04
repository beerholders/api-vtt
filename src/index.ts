import express from "express";
import cookieParser from "cookie-parser";
import { apiRouter } from "./api";
import { handleHttpErrors } from "./middlewares/handleHttpErrors";

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api", apiRouter);
app.use(handleHttpErrors);

app.listen(PORT, () =>
  console.log(`
🚀 Server ready at: http://localhost:${PORT}
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
);
