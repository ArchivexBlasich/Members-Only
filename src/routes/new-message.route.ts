import { Router } from 'express';
import { NewMessage, Auth } from '../controllers';

const newMessageRouter = Router();

newMessageRouter.use(Auth.isAuth);

newMessageRouter.get('/', NewMessage.get);
newMessageRouter.post('/', NewMessage.messageValidation, NewMessage.post);

export { newMessageRouter };
