"use client"
import React, { useEffect, useState, useRef, useContext } from 'react'
import { usersArray } from '@/serverActions/handleUsers'
import { io } from 'socket.io-client';
import { UserContext } from '@/context/userContext';

const messagePage = ({ params }) => {

  const { user: userMe } = useContext(UserContext);
  const socketRef = useRef(null);
  const endOfMessagesRef = useRef(null);
  const [user, setUser] = useState([]);
  const [error, setError] = useState(null);
  const [sender, setSender] = useState({})
  const [inputMessage, setInputMessage] = useState({ mode: "", message: "" })
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const fetchUsersName = async () => {
      try {
        const data = await usersArray(params.slug);
        setUser(data);
      } catch (err) {
        setError("Failed to fetch user.");
        console.error(err);
      }
    };
    fetchUsersName();
  }, []);

  useEffect(() => {
    document.title = `Message ${user.name}`
  }, [user.name])

  useEffect(() => {
    socketRef.current = io('http://localhost:3001', { transports: ['websocket'] });
    if (userMe?.username)
      socketRef.current.emit("register", userMe?.username)

    // Listen for incoming messages 
    socketRef.current.on('privateMessage', (data) => {
      setSender(data.sender)
      setMessages((prevMessages) => [...prevMessages, {
        mode: "received",
        message: data.inputMessage
      }]);
    });

    // Cleanup on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, [userMe]);

  useEffect(() => {
    // Scroll to the last message whenever messages change
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const ref = useRef(null)
  const handleMessageSent = (e) => {
    setMessages((prevMessages) => [...prevMessages, {
      mode: "sent",
      message: inputMessage.message
    }]);
    if (inputMessage.message.trim()) {
      socketRef.current.emit('privateMessage', {
        inputMessage: inputMessage.message,
        sender: {
          username: userMe.username,
          name: userMe.name
        },
        receiverId: user.username
      }); // Send message to the server
      setInputMessage({ mode: "", message: "" });
    }
  }
  
  return (
    <div className='relative h-full w-full'>
      <div className="messageTo text-center pb-2">
        {user.name}
      </div>

      <div ref={ref} className="messageSection scrollbar-hidden mx-20 overflow-auto max-h-[calc(100%-8rem)]">
        {messages.map((msgObj, index) => (
          <div key={index} className={`flex flex-col ${msgObj.mode === "sent" ? "items-start" : "items-end"} items-start my-5`}>
            <span>{msgObj.mode === "sent" ? "Me" : `${sender.name}`} </span>
            <span className={`rounded-xl py-2 px-5 text-lg ${msgObj.mode === "sent" ? "bg-sky-600" : "bg-gray-600"} `}>{msgObj.message}</span>
          </div>
        ))}
        {/* This div is the target for scrolling */}
        <div ref={endOfMessagesRef} />
      </div>

      <div className='messageBox flex items-center justify-center absolute bottom-0 w-full z-50'>
        <div className='w-1/2 relative'>
          <input
            id='message'
            name='message'
            type="text"
            value={inputMessage.message}
            placeholder='Type Your Message Here'
            onKeyDown={(e) => { if (e.key == "Enter") handleMessageSent() }}
            onChange={(e) => setInputMessage({ mode: "", message: e.target.value })}
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
