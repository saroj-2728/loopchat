import express from 'express'
import http from 'http';  // Required to create a server for Socket.IO
import { Server } from 'socket.io';  // Import Socket.IO
import cors from 'cors'

const app = express();  // Initialize Express
const server = http.createServer(app);  // Create a server
const io = new Server(server, {
  cors: {
      origin: 'http://localhost:3000', // Allow requests from your Next.js app
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
      credentials: true // Allow credentials if needed
  }
}); // Initialize Socket.IO on the server

// Serve static files if needed (optional)
app.use(express.static('public'));
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle incoming messages
  socket.on('message', (msg) => {
    console.log('Message received:', msg);

    // Broadcast message to all connected clients
    io.emit('message', msg);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Define a route for Express
app.get('/', (req, res) => {
  res.send('Socket.IO server is running');
});

// Start the server on a specified port
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


