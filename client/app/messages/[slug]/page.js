"use client"
import React, { useEffect, useState, useRef } from 'react'
import { usersArray } from '@/serverActions/handleUsers'
import { io } from 'socket.io-client';

const messagePage = ({ params }) => {

  const socketRef = useRef(null);
  const endOfMessagesRef = useRef(null);
  const [user, setUser] = useState([]);
  const [error, setError] = useState(null);
  const [inputMessage, setInputMessage] = useState('')
  const [messages, setMessages] = useState([])

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

  useEffect(() => {
    socketRef.current = io('http://localhost:3001');

    // Listen for incoming messages
    socketRef.current.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
      console.log(msg);
    });

    // Cleanup on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    // Scroll to the last message whenever messages change
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const ref = useRef(null)
  const handleMessageSent = (e) => {
    if (inputMessage.trim()) {
      socketRef.current.emit('message', inputMessage); // Send message to the server
      setInputMessage('');
    }
  }

  return (
    <div className='relative h-full w-full'>
      <div className="messageTo text-center pb-2">
        {user.name}
      </div>

      {/* Message section */}
      <div ref={ref} className="messageSection scrollbar-hidden mx-20 overflow-auto max-h-[calc(100%-8rem)]"> {/* 8rem or 32px (my-8) */}
        {messages.map((msg, index) => (
          <div key={index} className='flex flex-col items-start my-5'>
            <span>Me: </span>
            <span className='rounded-xl py-2 px-5 text-lg bg-sky-600'>{msg}</span>
          </div>
        ))}
        {/* This div is the target for scrolling */}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Message input box */}
      <div className='messageBox flex items-center justify-center absolute bottom-0 w-full z-50'>
        <div className='w-1/2 relative'>
          <input
            id='message'
            name='message'
            type="text"
            value={inputMessage}
            placeholder='Type Your Message Here'
            onKeyDown={(e) => { if (e.key == "Enter") handleMessageSent() }}
            onChange={(e) => setInputMessage(e.target.value)}
            className='py-4 ps-8 pe-24 w-full text-lg box-border rounded-full border border-sky-600 text-white bg-black'
          />
          <button
            onClick={handleMessageSent}
            className='absolute top-1/2 right-4 transform -translate-y-1/2 bg-blue-600 text-white py-2 px-4 rounded-full'>
            Send
          </button>
        </div>
      </div>
    </div>
  );

}

export default messagePage
