import { Router } from 'express';
import prisma from '@/prisma';

const signupRouter = Router();

signupRouter.post(`/signup`, async (req, res) => {
  const { name, email } = req.body

  const result = await prisma.user.create({
    data: {
      name,
      email,
    },
  })
  res.json(result)
});

export { signupRouter };
