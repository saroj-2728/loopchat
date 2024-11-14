import { getSocketInstance } from "../socket.js";
import { connectedUsers } from "./registerSocket.js";
import { Message } from "../models/Message.js";
import connectToDatabase from "../lib/mongodb.js";

const handlePrivateMessage = async (socket, { senderId, receiverId, content, timestamp }) => {
    const receiverSocketId = connectedUsers[receiverId];

    const newMessage = new Message({
        senderId,
        receiverId,
        content,
        timestamp: new Date()
    });

    await newMessage.save()

    if (receiverSocketId) {
        socket.to(receiverSocketId).emit("privateMessage", {
            senderId,
            receiverId,
            content,
            timestamp,
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

export const initChatSocket = async () => {
    await connectToDatabase()
    const io = getSocketInstance();
    io.on("connection", (socket) => {
        // console.log(`User connected: ${socket.id}`);
        socket.on("privateMessage", (msgData) => handlePrivateMessage(socket, msgData));

        socket.on("newUserSignUp", () => handleNewUserSignUp(socket));

        socket.on("disconnect", () => disconnectUser(socket));
    });
}

export default initChatSocket;