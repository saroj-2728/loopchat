import { getSocketInstance } from "../socket.js";
import { connectedUsers } from "./registerSocket.js";

export const friendActivitySocket = (senderId, receiverId) => {

    const io = getSocketInstance()

    const senderSocketId = connectedUsers[senderId];
    const receiverSocketId = connectedUsers[receiverId];

    if (senderSocketId) {
        io.to(senderSocketId).emit("friendActivityUpdate");
    }

    if (receiverSocketId) {
        io.to(receiverSocketId).emit("friendActivityUpdate");
    }
}

export const requestResponseSocket = (responseFrom, sentEventTo, response) => {
    const io = getSocketInstance();

    const senderSocketId = connectedUsers[sentEventTo];

    const data = {
        responseFrom,
        response
    }

    if (senderSocketId) {
        io.to(senderSocketId).emit("requestResponse", data);
    }
}