import pool from './pool';
import { type User, Role, type Message } from '../models';

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
    await pool.query(createUserQuery, [
      params.firstName,
      params.lastName,
      params.email,
      params.password_hash,
      Role.NON_MEMBER,
    ]);
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

export const createMessage = async (params: Message) => {
  try {
    const createMessageQuery = `
      INSERT INTO message (title, content, author_id)
      VALUES (
      $1, $2, $3
    )`;
    await pool.query(createMessageQuery, [
      params.title,
      params.content,
      params.author_id,
    ]);
  } catch (err) {
    console.error(`[DB Error] Failed to create message, author id: ${params.author_id}`, err);
    throw new Error('Database query failed');
  }
};

export const findUserByEmail = async (email: string): Promise<User | undefined> => {
  const findUserByEmailQuery = `
  SELECT u.id, u.firstName, u.lastName, u.email, u.password_hash, r.name as role
  FROM "user" as u
  JOIN role as r
  ON u.role_id = r.id
  WHERE u.email = $1
  `;

  try {
    const { rows } = await pool.query<User>(findUserByEmailQuery, [email]);
    return rows[0];
  } catch (error) {
    console.error(`[DB Error] Failed to find user by email: ${email}`, error);
    throw new Error('Database query failed');
  }
};

export const findUserById = async (id: number): Promise<User | undefined> => {
  const findUserByIdQuery = `
  SELECT u.id, u.firstName, u.lastName, u.email, u.password_hash, r.name as role
  FROM "user" as u
  JOIN role as r
  ON u.role_id = r.id
  WHERE u.id = $1
  `;

  try {
    const { rows } = await pool.query<User>(findUserByIdQuery, [id]);
    return rows[0];
  } catch (error) {
    console.error(`[DB Error] Failed to find user by id: ${id}`, error);
    throw new Error('Database query failed');
  }
};

export const updateUserRol = async (id: number, role: Role) => {
  const updateUserRolQuery = `
  UPDATE "user"
  SET role_id = (
    SELECT id
    FROM role
    WHERE name = $1
  )
  WHERE id = $2;
  `;

  try {
    await pool.query(updateUserRolQuery, [role, id]);
  } catch (error) {
    console.error(`[DB Error] Failed to update user rol: ${id} ${role}`, error);
    throw new Error('Database query failed');
  }
};

export const getAllMessages = async () => {
  const getAllMessagesQuery = `
  SELECT 
    s.title, s.content, s.publish_timestamp as publish_date,
    CONCAT(u.lastName, ' ', u.firstName) as author
  FROM message as s
  JOIN "user" as u
  ON s.author_id = u.id;
  `;

  try {
    const { rows } = await pool.query<Message>(getAllMessagesQuery);
    return rows;
  } catch (error) {
    console.error('[DB Error] Failed to get all messages', error);
    throw new Error('Database query failed');
  }
};
