"use client"
import React, { useEffect, useState, useRef } from 'react'
import { usersArray } from '@/serverActions/handleUsers'
import io from "socket.io-client";

let socket;

const messagePage = ({ params }) => {

  const [user, setUser] = useState([]);
  const [error, setError] = useState(null);
  const [inputMessage, setInputMessage] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(() => {
    socket = io("/api/userMessaging/socket"); 
    // socket = io("@/app/api/userMessaging/route");

    // Listen for new messages
    socket.on("message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
      console.log("It's working     flkjsdfhls");
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [])

  const sendMessage = () => {
    
  };  

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
  
  const ref = useRef(null)
  const handleMessageSent = (e) => {
    if (inputMessage.trim()) {
      socket.emit("message", inputMessage); // Send message to the server
      setInputMessage("");
    }
  }

  return (
    <div className='relative h-full w-full'>
      <div className="messageTo text-center pb-2">
        {user.name}
      </div>

      <div ref={ref} className="messageSection mx-20 ">
        <div className=' flex flex-col border my-5'>
          <span>Me: </span>
          <p className=' rounded-xl px-5 text-lg bg-sky-600'>this is a very long message and i don't know where its going to appear on the page but what i know is its not gonna look good</p>
        </div>


      </div>

      <div className='messageBox flex items-center justify-center absolute bottom-0 w-full z-50'>
        <div className='w-1/2 relative'>
          <input id='message' name='message' type="text" value={inputMessage} placeholder='Type Your Message Here' onKeyDown={(e) => { if (e.key == "Enter") handleMessageSent() }} onChange={(e) => setInputMessage(e.target.value)} className=' py-4 px-8 w-full text-lg box-border rounded-full border border-sky-600 text-white bg-black' />

          <button onClick={handleMessageSent} className='absolute top-1/2 right-4 transform -translate-y-1/2 bg-blue-600 text-white py-2 px-4 rounded-full'>Send</button>
        </div>
      </div>
    </div>
  )
}

export default messagePage
