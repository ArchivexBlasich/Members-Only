import {
  email,
  forward,
  minLength,
  nonEmpty,
  object,
  partialCheck,
  pipe,
  string,
  type InferInput,
} from 'valibot';
import type { Role } from './role.model';

export const authSchema = pipe(
  object({
    firstName: pipe(string(), nonEmpty('Please enter your firstName.')),
    lastName: pipe(string(), nonEmpty('Please enter your lastName.')),
    email: pipe(string(), nonEmpty('Please enter your email.'), email('The email address is badly formatted.')),
    password: pipe(string(), nonEmpty('Please enter your password.'), minLength(8, 'Your password must have 8 characters or more.')),
    confirm_password: string(),
  }),
  forward(
    partialCheck(
      [['password'], ['confirm_password']],
      (input) => input.password === input.confirm_password,
      'The two passwords do not match.',
    ),
    ['confirm_password'],
  ),
);

export type User = Omit<InferInput<typeof authSchema>, 'confirm_password'> & {
  id: number;
  rol: Role;
};
