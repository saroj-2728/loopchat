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

        <div className="flex flex-col items-center h-[calc(100vh-104px)] border rounded-xl bg-gray-900 py-4">
            <div className="shadow-lg rounded-lg p-2 w-full max-w-md text-center h-full flex flex-col">
                <h1 className="text-2xl mb-3 font-bold text-sky-600">Pick a User to Message!</h1>

                <div className="users mt-5 overflow-y-auto flex-grow"> {/* Using flex-grow to fill available space */}
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
                        <p className="font-bold text-sky-600">No users available to message.</p>
                    )}
                </div>
            </div>
        </div>


    )
}

export default Messages


