import './configs/config';
import express, { type Request, type Response, type NextFunction } from 'express';
import path from 'node:path';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import passport from 'passport';
import {
  indexRouter, authRouter, dashboardRouter, membershipRouter, newMessageRouter,
} from './routes';
import pool from './db/pool';
import { initializePassport } from './configs/passport.config';

if (!process.env.COOKIE_SECRET) {
  console.error('Define a COOKIE_SECRET and DB_URL env variable');
  process.exit(1);
}

const PgStore = pgSession(session);

const app = express();
const PORT = process.env.PORT ?? 8080;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
  store: new PgStore({
    pool,
    tableName: 'session',
  }),
}));

initializePassport(passport);
app.use(passport.session());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/dashboard', dashboardRouter);
app.use('/membership', membershipRouter);
app.use('/new-message', newMessageRouter);

app.use((req: Request, res: Response) => {
  res.status(404).send('Sorry, the requested resource was not found.');
});

app.use((err: Error & { status?: number }, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);

  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
  });
});

app.listen(PORT, (error) => {
  if (error) throw error;

  console.warn(`Server listening. http://localhost:${PORT}`);
});
