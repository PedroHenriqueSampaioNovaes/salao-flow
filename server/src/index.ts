import 'dotenv/config';

import express from 'express';

import routes from './routes/index.js';

const app = express();

app.use(express.json());

app.use(routes);

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando em http://localhost:${process.env.PORT}`);
});
