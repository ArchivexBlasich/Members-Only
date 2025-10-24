import { type Request, type Response } from 'express';
import { RENDER, type AuthenticatedRequest } from '../models';
import { isAuth } from '../utils/isAuth';
import { getAllMessages } from '../db/queries';
import { formatTimestamp } from '../utils/formatDate';

class Dashboard {
  static async get(req: Request, res: Response) {
    const authRequest = req as AuthenticatedRequest;

    const messages = await getAllMessages();

    res.render(
      RENDER.DASHBOARD,
      {
        isAuth: isAuth(authRequest),
        messages,
        formatTimestamp,
      },
    );
  }
}

export { Dashboard };
