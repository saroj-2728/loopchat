import http from 'http';
import app from './app.js';
import { initSocket } from './socket.js';
import { newUserSignUpSocket } from './sockets/newSignUpSocket.js';
import { registerUsers } from './sockets/registerSocket.js';
import initChatSocket from './sockets/chatSocket.js';

const server = http.createServer(app);

const io = initSocket(server)
newUserSignUpSocket();
registerUsers();
initChatSocket();

app.get('/', (req, res) => {
  res.send('Socket.IO server is running');
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running!!`);
});


