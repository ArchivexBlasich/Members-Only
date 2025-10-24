import { type Request, type Response } from 'express';
import { deleteMessageById } from '../db/queries';

class Message {
  static async delete(req: Request, res: Response) {
    await deleteMessageById(req.body.id);
    res.redirect('dashboard');
  }
}

export { Message };
