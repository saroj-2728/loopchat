// app/api/userMessaging/route.js
import { Server } from "socket.io";

export async function GET(req, res) {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.IO server...");

    const io = new Server(res.socket.server, {
      path: "/api/userMessaging/socket", // Set a custom path for the socket connection
      addTrailingSlash: false,
    });

    io.on("connection", (socket) => {
      console.log("A user connected", socket.id);

      socket.on("message", (msg) => {
        console.log("Message received: ", msg);
        io.emit("message", msg); // Broadcast the message to all connected clients
      });

      socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}
