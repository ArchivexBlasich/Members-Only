import bcrypt from 'bcryptjs';
import { type Request, type Response, type NextFunction } from 'express';
import { safeParse } from 'valibot';
import { authSchema, loginSchema, RENDER } from '../models';
import { createUser, ConflictError } from '../db/queries';
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    flash?: { [key: string]: string[] };
  }
}

class Auth {
  static getSignUp(req: Request, res: Response) {
    res.render(RENDER.SIGN_UP);
  }

  static async postSignUp(req: Request, res: Response, next: NextFunction) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password_hash, 10);
      await createUser({ ...req.body, password_hash: hashedPassword });
      res.redirect('/log-in');
    } catch (error) {
      if (error instanceof ConflictError) {
        res.render(RENDER.SIGN_UP, { errors: [{ message: error.message }] });
        return;
      }
      next(error);
    }
  }

  static authUserValidation(req: Request, res: Response, next: NextFunction) {
    const result = safeParse(authSchema, req.body);

    if (!result.success) {
      res.render(RENDER.SIGN_UP, { errors: result.issues });
      return;
    }

    next();
  }

  static logInUserValidation(req: Request, res: Response, next: NextFunction) {
    const result = safeParse(loginSchema, req.body);

    if (!result.success) {
      res.render(RENDER.LOG_IN, { errors: result.issues });
      return;
    }

    next();
  }

  static getLogIn(req: Request, res: Response) {
    res.render(RENDER.LOG_IN);
  }

  static isAuth(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/');
    }
  }
}

export { Auth };
