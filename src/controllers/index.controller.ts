import { type Request, type Response } from 'express';

class Index {
  static get(req: Request, res: Response) {
    res.render('index');
  }
}

export { Index };
