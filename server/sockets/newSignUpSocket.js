import { getSocketInstance } from "../socket.js";

export const newUserSignUpSocket = () => {
    const io = getSocketInstance()
    io.emit("newUserSignUp")
}