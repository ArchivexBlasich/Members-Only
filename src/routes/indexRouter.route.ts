import { Router } from 'express';
import { Index } from '../controllers';

const indexRouter = Router();

indexRouter.get('/', Index.get);

export { indexRouter };
