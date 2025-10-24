import { Router } from 'express';
import { Dashboard } from '../controllers';

const dashboardRouter = Router();

dashboardRouter.get('/', Dashboard.get);

export { dashboardRouter };
