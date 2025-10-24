import {
  maxLength,
  nonEmpty, object, pipe, string,
  trim,
  type InferInput,
} from 'valibot';

export const messageSchema = object({
  title: pipe(string(), nonEmpty('Please enter your code.'), trim(), maxLength(255, 'Your title must have less than 255 characters')),
  content: pipe(string(), nonEmpty('Please enter your code.')),
});

export type Message = InferInput<typeof messageSchema> & {
  author_id: number;
};
