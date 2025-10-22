import { Router } from 'express';
import passport from 'passport';
import { Auth } from '../controllers';

const authRouter = Router();

authRouter.get('/sign-up', Auth.getSignUp);
authRouter.post('/sign-up', Auth.authUserValidation, Auth.postSignUp);
authRouter.get('/log-in', Auth.getLogIn);
authRouter.post(
  '/log-in',
  Auth.logInUserValidation,
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/auth/log-in',
  }),
);
export { authRouter };
