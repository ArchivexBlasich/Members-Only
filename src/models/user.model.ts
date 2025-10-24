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

const emailValidation = pipe(string(), nonEmpty('Please enter your email.'), email('The email address is badly formatted.'));
const passwordRegistrationValidation = pipe(string(), nonEmpty('Please enter your password.'), minLength(8, 'Your password must have 8 characters or more.'));
export const authSchema = pipe(
  object({
    firstName: pipe(string(), nonEmpty('Please enter your firstName.')),
    lastName: pipe(string(), nonEmpty('Please enter your lastName.')),
    email: emailValidation,
    password_hash: passwordRegistrationValidation,
    confirm_password: string(),
  }),
  forward(
    partialCheck(
      [['password_hash'], ['confirm_password']],
      (input) => input.password_hash === input.confirm_password,
      'The two passwords do not match.',
    ),
    ['confirm_password'],
  ),
);

export type User = Omit<InferInput<typeof authSchema>, 'confirm_password'> & {
  id: number;
  role: Role;
};

export const loginSchema = object({
  email: emailValidation,
  password_hash: passwordRegistrationValidation,
});

export type LoginCredentials = InferInput<typeof loginSchema>;
