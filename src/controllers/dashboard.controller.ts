import { type Request, type Response } from 'express';
import { RENDER } from '../models';

class Dashboard {
  static get(req: Request, res: Response) {
    res.render(RENDER.DASHBOARD);
  }
}

export { Dashboard };
