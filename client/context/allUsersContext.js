"use client"
import { createContext, useEffect, useState } from "react";
import { useSocket } from "./socketContext";

export const AllUsersContext = createContext()

const AllUsersProvider = ({ children }) => {

    const socketRef = useSocket()
    const [allUsers, setAllUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/users`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ data: "Users" })
                })
                const data = await response.json()
                setAllUsers(data)
                setLoading(false)

            } catch (err) {
                setError("Failed to fetch users.");
                console.error(err);
                setLoading(false);
            }
        };
        fetchUsers();

        if (socketRef.current) {
            socketRef.current.on("newUserSignUp", () => {
                fetchUsers();
            });
        }

        return () => {
            socketRef.current?.off("newUserSignUp");
        };
    }, [socketRef.current]);

    return (
        <AllUsersContext.Provider value={{ allUsers, setAllUsers, loading }}>
            {children}
        </AllUsersContext.Provider>
    )
}

export default AllUsersProvider
