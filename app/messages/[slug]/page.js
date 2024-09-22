"use client"
import React, { useEffect, useState } from 'react'
import { usersArray } from '@/serverActions/handleUsers'

const messagePage = ({ params }) => {

  const [user, setUser] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchUsersName = async () => {
      try {
        const data = await usersArray(params.slug);
        setUser(data);
      } catch (err) {
        setError("Failed to fetch users.");
        console.error(err);
      }
    };
    fetchUsersName();
  }, []);

  useEffect(() => {
    document.title = `Message ${user.name}`
  }, [user.name])


  return (
    <div className='relative h-full w-full'>
      <div className="messageTo text-center pb-2">
        {user.name}
      </div>

      <div className="messageSection mx-20 border border-gray-500">
        this is a very long message and i don't know where its going to appear on the page but what i know is its not gonna look good
      </div>

      <div className='messageBox flex items-center justify-center absolute bottom-0 w-full z-50'>
        <input id='message' name='message' type="text" placeholder='Type Your Message Here' className='w-1/2 py-4 px-8 text-lg text-center box-border rounded-full border border-sky-600 text-white bg-black' />
      </div>
    </div>
  )
}

export default messagePage
