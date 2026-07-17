import 'dotenv/config';
import { Server as HTTPServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

import { BarbershopRepository } from '@/src/repositories/BarbershopRepository.js';

let io: Server | null = null;

export function initializeSocket(httpServer: HTTPServer) {
  io = new Server(httpServer, {
    connectionStateRecovery: {},
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Token não fornecido.'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };

      const barbershopRepo = new BarbershopRepository();
      const barbershop = await barbershopRepo.getById(Number(decoded.id));

      if (!barbershop) {
        return next(new Error('Barbearia não encontrada.'));
      }

      socket.data.barbershopSlug = barbershop.slug;
      next();
    } catch {
      next(new Error('Token inválido ou expirado.'));
    }
  });

  io.on('connection', (socket) => {
    const slug = socket.data.barbershopSlug;
    socket.join(`barbershop:${slug}`);
    console.log(`[Socket] Barbearia conectada: ${slug} (socket: ${socket.id})`);

    socket.on('disconnect', () => {
      console.log(
        `[Socket] Barbearia desconectada: ${slug} (socket: ${socket.id})`,
      );
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error('Socket.IO não foi inicializado.');
  }
  return io;
}

export function emitToBarbershop(slug: string, event: string, data: unknown) {
  getIO().to(`barbershop:${slug}`).emit(event, data);
}
