import { type Request, type Response } from 'express';
import { RENDER, type AuthenticatedRequest } from '../models';
import { isAuth } from '../../utils/isAuth';

class Dashboard {
  static get(req: Request, res: Response) {
    const authRequest = req as AuthenticatedRequest;

    res.render(
      RENDER.DASHBOARD,
      {
        isAuth: isAuth(authRequest),
      },
    );
  }
}

export { Dashboard };
