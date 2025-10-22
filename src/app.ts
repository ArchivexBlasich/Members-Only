import './config';
import express, { type Request, type Response, type NextFunction } from 'express';
import path from 'node:path';
import { indexRouter, authRouter } from './routes';

const app = express();
const PORT = process.env.PORT ?? 8080;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/auth', authRouter);

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
