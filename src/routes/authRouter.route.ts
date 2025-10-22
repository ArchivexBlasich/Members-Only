import { Router } from 'express';
import { Auth } from '../controllers';

const authRouter = Router();

authRouter.get('/sign-up', Auth.getSignUp);
authRouter.post('/sign-up', Auth.authUser, Auth.postSignUp);

export { authRouter };
