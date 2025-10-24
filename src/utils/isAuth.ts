import { type AuthenticatedRequest } from '../models';
import { Role } from '../models';

export function isAuth(req: AuthenticatedRequest):boolean {
  return req.user?.role === Role.ADMIN || req.user?.role === Role.MEMBER;
}

export function isAdmin(req: AuthenticatedRequest):boolean {
  return req.user?.role === Role.ADMIN;
}
