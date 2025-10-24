import { type AuthenticatedRequest } from '../src/models';
import { Role } from '../src/models';

export function isAuth(req: AuthenticatedRequest):boolean {
  return req.user?.role === Role.ADMIN || req.user?.role === Role.MEMBER;
}
