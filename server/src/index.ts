import 'dotenv/config';

import express from 'express';

import { errorHandling } from './middlewares/errorHandling.js';

import routes from './routes/index.js';

const app = express();

app.use(express.json());

app.use(routes);

app.use(errorHandling);

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando em http://localhost:${process.env.PORT}`);
});
