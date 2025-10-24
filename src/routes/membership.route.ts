import { Router } from 'express';
import { Membership, Auth } from '../controllers';

const membershipRouter = Router();

membershipRouter.use(Auth.isAuth);

membershipRouter.get('/', Membership.get);
membershipRouter.post('/', Membership.membershipValidation, Membership.post);

export { membershipRouter };
