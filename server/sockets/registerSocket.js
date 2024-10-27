import { getSocketInstance } from "../socket.js"

const connectedUsers = {}

export const registerUsers = () => {
    const io = getSocketInstance()
    io.on("connection", (socket) => {
        socket.on("register", (userId) => {
            connectedUsers[userId] = socket.id;
        })
    })
}

export { connectedUsers }