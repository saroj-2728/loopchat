import { Server } from 'socket.io';

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    io.on('connection', (socket) => {
      console.log('User connected');
      socket.on('message', (msg) => {
        io.emit('message', msg);
      });
    });
    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;
