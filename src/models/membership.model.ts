import {
  nonEmpty, object, pipe, string,
  trim,
} from 'valibot';

export const membershipSchema = object({
  code: pipe(string(), nonEmpty('Please enter your code.'), trim()),
});
