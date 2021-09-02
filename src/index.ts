import express from 'express';
import { apiRouter } from './api';

const app = express()

app.use(express.json());

app.use('/api', apiRouter);

app.listen(3001, () =>
  console.log(`
🚀 Server ready at: http://localhost:3001
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`,
  ),
)
