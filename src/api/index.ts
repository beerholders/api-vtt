import { Router } from 'express';
import { usersRouter } from './users';
import { signupRouter } from './signup';

const apiRouter = Router();

apiRouter.use('/users', usersRouter);
apiRouter.use('/signup', signupRouter);

export { apiRouter };