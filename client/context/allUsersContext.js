"use client"
import { createContext, useEffect, useState } from "react";
import { usersArray } from "@/serverActions/handleUsers";

export const AllUsersContext = createContext()

const AllUsersProvider = ({ children }) => {

    const [allUsers, setAllUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null);
    useEffect(() => {
        let usersLength = 0;
        const fetchUsers = async () => {
            try {
                const data = await usersArray();
                const hasChanged = usersLength !== data.length
                if (!hasChanged) return;
                setAllUsers(data)
                usersLength = data.length;
                setLoading(false)

            } catch (err) {
                setError("Failed to fetch users.");
                console.error(err);
                setLoading(false);
            }
        };
        fetchUsers();

        const intervalId = setInterval(fetchUsers, 10000);

        return () => {
            clearInterval(intervalId)
        };
    }, []);

    return (
        <AllUsersContext.Provider value={{ allUsers, setAllUsers, loading }}>
            {children}
        </AllUsersContext.Provider>
    )
}

export default AllUsersProvider
