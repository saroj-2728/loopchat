"use client"
import React from 'react'
import { usersArray } from '@/serverActions/handleUsers';
import { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/navigation';
import { UserContext } from '@/context/userContext';

const Messages = () => {

    const { user: userMe } = useContext(UserContext)
    const router = useRouter()
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await usersArray("all");
                setUsers(data);
            } catch (err) {
                setError("Failed to fetch users.");
                console.error(err);
            }
        };
        fetchUsers();
    }, []);

    const handleUserMessaging = (users) => {
        router.push(`/${userMe.username}/messages/${users.username}`);
    }

    return (

        <div className="flex flex-col items-center md:h-[calc(100vh-104px)] h-[calc(100vh-64px)] md:border md:rounded-xl bg-gray-900 md:py-4">
            <div className="shadow-lg rounded-lg p-4 w-full max-w-md text-center h-full flex flex-col">
                <h1 className="text-xl md:text-2xl mt-2 md:mb-2 font-bold text-sky-600">Pick a User to Message!</h1>

                <div className="users mt-4 overflow-y-auto flex-grow">
                    {users.length > 0 ? (
                        users.map((user) => (
                            <div
                                key={user._id}
                                className="border border-white py-4 text-xl rounded-xl my-2 cursor-pointer transition duration-300 hover:bg-gray-600"
                                onClick={() => handleUserMessaging(user)}
                            >
                                {`${user.name} (${user.username})`}
                            </div>
                        ))
                    ) : (
                        <div className="loader w-8 h-8 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                    )}
                </div>
            </div>
        </div>


    )
}

export default Messages


