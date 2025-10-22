import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { findUserByEmail, findUserById } from '../db/queries';

export function initializePassport(passportInstance: passport.PassportStatic) {
  passportInstance.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password_hash',
    },
    async (email, password, done) => {
      try {
        const user = await findUserByEmail(email);

        if (!user) {
          return done(null, false, { message: 'Incorrect email or password.' });
        }

        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
          return done(null, false, { message: 'Incorrect email or password.' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ));

  passportInstance.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passportInstance.deserializeUser(async (id: number, done) => {
    try {
      const user = await findUserById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}
