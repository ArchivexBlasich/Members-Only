import { Router } from 'express';
import { Message, Auth } from '../controllers';

const messageRouter = Router();

messageRouter.use(Auth.isAuth);

messageRouter.delete('/', Message.delete);

export { messageRouter };
