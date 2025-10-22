import pool from './pool';
import { type User, Role } from '../models';

export class ConflictError extends Error {
  status: number;

  constructor(message: string, status = 409) {
    super(message);
    this.name = 'ConflictError';
    this.status = status;
  }
}

export const createUser = async (params: Omit<User, 'id' | 'rol'>) => {
  try {
    const createUserQuery = `
    INSERT INTO "user" (firstName, lastName, email, password_hash, role_id)
    VALUES (
    $1, $2, $3, $4,
    (SELECT id FROM role WHERE name = $5)
    )`;
    await pool.query(
      createUserQuery,
      [params.firstName, params.lastName, params.email, params.password, Role.NON_MEMBER],
    );
  } catch (err) {
    // Check if it's a 'unique_violation' error (code 23505)
    if (typeof err === 'object' && err !== null && 'code' in err) {
      if ((err as { code: string }).code === '23505') {
        throw new ConflictError('This email is already in use.');
      }
    }

    throw err;
  }
};
