import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import session from "express-session";

const port = process.env.PORT || 3001;

const app = express();
const httpServer = createServer(app);

const sessionMiddleware = session({
  secret: "changeit",
  resave: true,
  saveUninitialized: true,
});

app.use(sessionMiddleware);

app.get("/", (req, res) => {
  res.sendFile(new URL("./index.html", import.meta.url).pathname);
});

app.post("/incr", (req, res) => {
  const session = req.session;
  session.count = (session.count || 0) + 1;
  res.status(200).end("" + session.count);
});

const io = new Server(httpServer);

httpServer.listen(port, () => {
  console.log(`application is running at: http://localhost:${port}`);
});