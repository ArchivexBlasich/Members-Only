import { type NextFunction, type Request, type Response } from 'express';
import { safeParse } from 'valibot';
import { RENDER, messageSchema, type AuthenticatedRequest } from '../models';
import { createMessage } from '../db/queries';

class NewMessage {
  static get(req: Request, res: Response) {
    res.render(RENDER.NEW_MESSAGE);
  }

  static async post(req: Request, res: Response) {
    const authRequest = req as AuthenticatedRequest;

    if (!authRequest.user?.id) {
      res.redirect('/dashboard');
      return;
    }

    await createMessage({
      title: req.body.title,
      content: req.body.content,
      author_id: authRequest.user?.id,
    });
    res.redirect('/dashboard');
  }

  static messageValidation(req: Request, res: Response, next: NextFunction) {
    const result = safeParse(messageSchema, req.body);

    if (!result.success) {
      res.render(RENDER.NEW_MESSAGE, { errors: result.issues });
      return;
    }

    req.body = result.output;

    next();
  }
}

export { NewMessage };
