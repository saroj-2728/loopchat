"use client"
import { createContext, useContext, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext)
}

export const SocketProvider = ({ children }) => {
    
    const { data } = useSession()
    const user = data?.user;
    const socketRef = useRef(null)

    useEffect(() => {
        if (!user?.username) return;

        const socket = io(process.env.NEXT_PUBLIC_SERVER_URL);
        socketRef.current = socket;
        socketRef.current.emit("register", user.username)

        return () => {
            socket.disconnect()
        }
    }, [user])

    return (
        <SocketContext.Provider value={socketRef}>
            {children}
        </SocketContext.Provider>
    )
}