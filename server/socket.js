import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            // origin: 'https://next-js-chat-app-5lgs.vercel.app',
            origin: 'http://localhost:3000',
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
