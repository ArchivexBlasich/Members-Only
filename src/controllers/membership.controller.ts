import { type NextFunction, type Request, type Response } from 'express';
import { safeParse } from 'valibot';
import {
  membershipSchema, RENDER, Role, type AuthenticatedRequest,
} from '../models';
import { isAuth } from '../../utils/isAuth';
import { updateUserRol } from '../db/queries';

class Membership {
  static get(req: Request, res: Response) {
    res.render(
      RENDER.MEMBERSHIP,
    );
  }

  static async post(req: Request, res: Response) {
    const authRequest = req as AuthenticatedRequest;

    if (isAuth(authRequest) || !authRequest.user?.id) {
      res.redirect('/dashboard');
      return;
    }

    if (req.body.code !== process.env.MEMBER_CODE) {
      res.render(RENDER.MEMBERSHIP, { errors: [{ message: 'No valid code' }] });
      return;
    }

    await updateUserRol(authRequest.user?.id, Role.MEMBER);
    res.redirect('/dashboard');
  }

  static membershipValidation(req: Request, res: Response, next: NextFunction) {
    const result = safeParse(membershipSchema, req.body);

    if (!result.success) {
      res.render(RENDER.MEMBERSHIP, { errors: result.issues });
      return;
    }

    next();
  }
}

export { Membership };
