import 'dotenv/config';

import http from 'http';
import express from 'express';
import cors from 'cors';

import { errorHandling } from './middlewares/errorHandling.js';

import routes from './routes/index.js';

import { initializeSocket } from './lib/socket.js';

const app = express();
const server = http.createServer(app);

app.use('/webhooks/stripe', express.raw({ type: 'application/json' }));

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  }),
);

app.use(routes);

app.use(errorHandling);

initializeSocket(server);

server.listen(process.env.PORT, () => {
  console.log(`Servidor rodando em http://localhost:${process.env.PORT}`);
});
