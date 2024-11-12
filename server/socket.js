import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type']
          }
    });

    return io;
};

export const getSocketInstance = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
