import { type Request } from 'express';
import type { User } from './user.model';

export interface AuthenticatedRequest extends Request {
  user?: User;
}
