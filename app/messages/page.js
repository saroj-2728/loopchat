"use client"
import React from 'react'
import { usersArray } from '@/serverActions/handleUsers';
import { useEffect, useState } from 'react'

const messages = () => {

    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await usersArray();
                setUsers(data);
            } catch (err) {
                setError("Failed to fetch users.");
                console.error(err);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div>
            {users.map((user)=>{
                return(
                    <div key={user._id}>
                        {user.name}
                    </div>
                );
            })}
        </div>
    )
}

export default messages
