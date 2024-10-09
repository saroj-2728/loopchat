import express from 'express'
import http from 'http';  // Required to create a server for Socket.IO
import { Server } from 'socket.io';
import cors from 'cors'

const app = express();
const server = http.createServer(app);  // Create a server 
const io = new Server(server, {
  cors: {
    origin: 'https://next-js-chat-app-5lgs.vercel.app/',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    transports: ['websocket']
  }
});


app.use(cors({
  origin: 'https://next-js-chat-app-5lgs.vercel.app/',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));

const users = {};

io.on("connection", (socket) => {
  // console.log(`User connected: ${socket.id}`);
  socket.on("register", (userId) => {
    users[userId] = socket.id;
  });

  // Handle private message event
  socket.on("privateMessage", ({ inputMessage, sender, receiverId }) => {
    const receiverSocketId = users[receiverId];
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit("privateMessage", {
        inputMessage,
        sender,
      });
    }
  });

  socket.on("disconnect", () => {
    // console.log(`User disconnected: ${socket.id}`);
  });
});

app.get('/', (req, res) => {
  res.send('Socket.IO server is running');
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running!!`);
});


