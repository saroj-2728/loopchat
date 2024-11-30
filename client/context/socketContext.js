"use client"
import { createContext, useContext, useRef, useEffect } from "react";
import { io } from 'socket.io-client';
import { useSession } from "./SessionContext";

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext)
}

export const SocketProvider = ({ children }) => {
    const { profile } = useSession()
    const socketRef = useRef(null)
    useEffect(() => {
        if (!profile?._id) return;

        const socket = io(process.env.NEXT_PUBLIC_SERVER_URL);
        socketRef.current = socket;
        socketRef.current.emit("register", profile?._id)

        return () => {
            socket.disconnect()
        }
    }, [profile?._id])

    return (
        <SocketContext.Provider value={socketRef}>
            {children}
        </SocketContext.Provider>
    )
}