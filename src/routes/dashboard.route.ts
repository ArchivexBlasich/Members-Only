import { Router } from 'express';
import { Dashboard, Auth } from '../controllers';

const dashboardRouter = Router();

dashboardRouter.use(Auth.isAuth);

dashboardRouter.get('/', Dashboard.get);

export { dashboardRouter };
