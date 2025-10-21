import './config.js';
import express from 'express';
import path from 'node:path';

const app = express();
const PORT = process.env.PORT ?? 8080;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
/* app.use('/', indexRouter); */

app.listen(PORT, (error) => {
  if (error) throw error;

  console.log(`Server listening. http://localhost:${PORT}`);
});
