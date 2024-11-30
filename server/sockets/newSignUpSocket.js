import { getSocketInstance } from "../socket.js";

export const usersChangeSocket = () => {
    const io = getSocketInstance()
    io.emit("newUserSignUp")
}