import express from 'express'
import http from 'http';  // Required to create a server for Socket.IO
import { Server } from 'socket.io';
import cors from 'cors'

const app = express();
const server = http.createServer(app);  // Create a server 
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    transports: ['websocket']
  }
});


app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));

const users = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on("register", (userId) => {
    users[userId] = socket.id;
  });

  // Handle private message event
  socket.on("privateMessage", ({ inputMessage, sender, receiverId }) => {
    // console.log(inputMessage);
    const receiverSocketId = users[receiverId];
    // console.log(users);
    // console.log(sender);
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit("privateMessage", {
        inputMessage,
        sender,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.get('/', (req, res) => {
  res.send('Socket.IO server is running');
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


