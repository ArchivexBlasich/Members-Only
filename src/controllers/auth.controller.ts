import bcrypt from 'bcryptjs';
import { type Request, type Response, type NextFunction } from 'express';
import { safeParse } from 'valibot';
import { authSchema, RENDER } from '../models';
import { createUser, ConflictError } from '../db/queries';

class Auth {
  static getSignUp(req: Request, res: Response) {
    res.render(RENDER.SIGN_UP);
  }

  static async postSignUp(req: Request, res: Response, next: NextFunction) {
    console.warn(req.body);
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await createUser({ ...req.body, password: hashedPassword });
      res.redirect(RENDER.DASHBOARD);
    } catch (error) {
      if (error instanceof ConflictError) {
        res.render(RENDER.SIGN_UP, { errors: [{ message: error.message }] });
        return;
      }
      next(error);
    }
  }

  static authUser(req: Request, res: Response, next: NextFunction) {
    const result = safeParse(authSchema, req.body);

    if (!result.success) {
      res.render(RENDER.SIGN_UP, { errors: result.issues });
      return;
    }

    next();
  }
}

export { Auth };
