"use client"
import React, { useEffect, useState, useRef, useContext } from 'react'
import { usersArray } from '@/serverActions/handleUsers'
import { io } from 'socket.io-client';
import { UserContext } from '@/context/userContext';
import { useRouter } from 'next/navigation';

const MessagePage = ({ params }) => {

  const { user: userMe } = useContext(UserContext);
  const router = useRouter()
  const socketRef = useRef(null);
  const endOfMessagesRef = useRef(null);
  const [targetUser, settargetUser] = useState([]);
  const [error, setError] = useState(null);
  const [sender, setSender] = useState({})
  const [inputMessage, setInputMessage] = useState({ mode: "", message: "" })
  const [messages, setMessages] = useState([])

  useEffect(() => {
    if (!userMe) return;

    const fetchUsersName = async () => {
      try {
        const data = await usersArray("all");
        const theUser = data.find((user) => user.username === params.slug)
        if (theUser)
          settargetUser(theUser)
        else
         userMe? router.push(`/${userMe?.username}/messages`) : "";
        
      } catch (err) {
        setError("Failed to fetch user.");
        console.error(err);
      }
    };
    fetchUsersName();
  }, [userMe,params.slug,router]);

  useEffect(() => {
    document.title = `Message ${targetUser.name}`
  }, [targetUser.name])

  useEffect(() => {
    socketRef.current = io('https://next-js-chat-app.onrender.com/', { transports: ['websocket'] });
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
        receiverId: targetUser.username
      }); // Send message to the server
      setInputMessage({ mode: "", message: "" });
    }
  }

  return (
    <div className='relative h-full w-full flex flex-col bg-gray-900 md:p-4'>
  <div className="messageTo text-center pb-2 text-sky-600 font-bold text-2xl">
    {targetUser.name}
  </div>

  <div ref={ref} className="messageSection overflow-auto flex-grow p-4 rounded-lg border border-gray-600 bg-gray-800">
    {messages.length > 0 ? (
      messages.map((msgObj, index) => (
        <div key={index} className={`flex flex-col ${msgObj.mode === "sent" ? "items-start" : "items-end"} my-5`}>
          <span className={`text-sm ${msgObj.mode === "sent" ? "text-sky-400" : "text-gray-400"}`}>
            {msgObj.mode === "sent" ? "Me" : `${sender.name}`}
          </span>
          <span className={`rounded-xl py-2 px-5 text-lg ${msgObj.mode === "sent" ? "bg-sky-600" : "bg-gray-600"} text-white`}>
            {msgObj.message}
          </span>
        </div>
      ))
    ) : (
      <p className="text-gray-500 text-center">No messages yet.</p>
    )}
    {/* This div is the target for scrolling */}
    <div ref={endOfMessagesRef} />
  </div>

  <div className='messageBox flex items-center justify-center mt-4'>
    <div className='w-full max-w-md relative'>
      <input
        id='message'
        name='message'
        type="text"
        value={inputMessage.message}
        placeholder='Type Your Message Here'
        onKeyDown={(e) => { if (e.key === "Enter") handleMessageSent(); }}
        onChange={(e) => setInputMessage({ mode: "", message: e.target.value })}
        className='py-4 pl-6 pr-24 w-full text-lg box-border rounded-full border border-sky-600 text-white bg-black placeholder-gray-400'
      />
      <button
        onClick={handleMessageSent}
        className='absolute top-1/2 right-4 transform -translate-y-1/2 bg-blue-600 text-white py-2 px-4 rounded-full transition duration-300 hover:bg-blue-500'>
        Send
      </button>
    </div>
  </div>
  <p className='text-center mt-1 -mb-3 md:-mb-7 text-gray-500 text-xs md:text-base'>Messages are deleted as soon as you leave this message page.</p>
</div>

  );

}

export default MessagePage
