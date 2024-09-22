"use client"
import React from 'react'
import { usersArray } from '@/serverActions/handleUsers';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';

const messages = () => {

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

    useEffect(() => {
        document.title = "Messages"
    }, []);

    const handleUserMessaging = (user) => {
        router.push(`/messages/${user.username}`);
    }

    return (

        <div className='w-full border-2 border-white px-7 border-t-0 rounded-b-xl pb-5'>
            <div className='text-xl text-center pt-5'>
                Pick a user to message !!
            </div>
            <div className="users">
                {users.map((user) => {
                    return (
                        <div key={user._id} className='text-center border border-white py-5 text-2xl rounded-xl my-5 cursor-pointer' onClick={() => handleUserMessaging(user)}>
                            {`${user.name} (${user.username})`}
                        </div>
                    );  
                })}
            </div>
        </div>
    )
}

export default messages


