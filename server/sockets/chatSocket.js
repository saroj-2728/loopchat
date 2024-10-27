import { getSocketInstance } from "../socket.js";
import { connectedUsers } from "./registerSocket.js";

const handlePrivateMessage = (socket, { inputMessage, sender, receiverId }) => {
    const receiverSocketId = connectedUsers[receiverId];
    if (receiverSocketId) {
        socket.to(receiverSocketId).emit("privateMessage", {
            inputMessage,
            sender,
            receiverId,
        });
    }
};

export const handleNewUserSignUp = (socket) => {
    socket.emit("newUserSignUp", {});
};

const disconnectUser = (socket) => {
    for (const userId in connectedUsers) {
        if (connectedUsers[userId] === socket.id) {
            delete connectedUsers[userId];
            break;
        }
    }
};

export const initChatSocket = () => {
    const io = getSocketInstance();
    io.on("connection", (socket) => {
        // console.log(`User connected: ${socket.id}`);
        socket.on("privateMessage", (data) => handlePrivateMessage(socket, data));

        socket.on("newUserSignUp", () => handleNewUserSignUp(socket));

        socket.on("disconnect", () => disconnectUser(socket));
    });
}

export default initChatSocket;