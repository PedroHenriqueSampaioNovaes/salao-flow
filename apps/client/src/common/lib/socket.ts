'use client';

import { io, Socket } from 'socket.io-client';

const sockets = new Map<string, Socket>();

export function connectToSocket(token: string, apiUrl: string) {
  const key = `${apiUrl}:${token}`;

  if (sockets.has(key)) {
    const existing = sockets.get(key)!;
    if (existing.connected) return existing;
    existing.connect();
    return existing;
  }

  const socket = io(apiUrl, {
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  sockets.set(key, socket);

  return socket;
}

export function disconnectSocket(token: string, apiUrl: string) {
  const key = `${apiUrl}:${token}`;
  const socket = sockets.get(key);
  if (socket) {
    socket.disconnect();
    sockets.delete(key);
  }
}
