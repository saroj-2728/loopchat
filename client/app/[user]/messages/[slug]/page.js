"use client"
import React, { useEffect, useState, useRef, useContext } from 'react'
import { UserContext } from '@/context/userContext';
import { AllUsersContext } from '@/context/allUsersContext';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/context/socketContext';

const MessagePage = ({ params }) => {

  const { user: userMe } = useContext(UserContext);
  const { allUsers } = useContext(AllUsersContext)
  const router = useRouter()
  const socketRef = useSocket()
  const endOfMessagesRef = useRef(null);
  const [targetUser, settargetUser] = useState({});
  const [sender, setSender] = useState({})
  const [inputMessage, setInputMessage] = useState({ mode: "", message: "" })
  const [messages, setMessages] = useState([])

  const isMobileDevice = () => {
    return window.innerWidth < 768;
  };

  useEffect(() => {
    if (allUsers.length === 0) return;
    const fetchUsersName = () => {
      const theUser = allUsers.find((user) => user.username === params.slug)
      if (theUser)
        settargetUser(theUser)
      else
        userMe ? router.push(`/${userMe?.username}/messages`) : "";
    };
    fetchUsersName();
  }, [allUsers, params.slug, router, userMe]);

  useEffect(() => {
    document.title = `Message ${targetUser.name}`
  }, [targetUser.name])

  useEffect(() => {
    // Listen for incoming messages 
    socketRef.current?.on('privateMessage', (data) => {
      if (data.sender.username === targetUser.username && userMe.username === data.receiverId) {
        setSender(data.sender)
        setMessages((prevMessages) => [...prevMessages, {
          mode: "received",
          message: data.inputMessage
        }]);
      }
    });

    return () => {
      socketRef.current?.off('privateMessage');
    };
  }, [userMe, targetUser]);

  useEffect(() => {
    const delay = isMobileDevice() ? 200 : 10;
    setTimeout(() => {
      endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, delay);

  }, [messages]);

  const ref = useRef(null)
  const handleMessageSent = (e) => {
    if (inputMessage.message.trim() === "") {
      setInputMessage({ mode: "", message: "" })
      return;
    }
    setMessages((prevMessages) => [...prevMessages, {
      mode: "sent",
      message: inputMessage.message
    }]);

    socketRef.current.emit('privateMessage', {
      inputMessage: inputMessage.message,
      sender: {
        username: userMe.username,
        name: userMe.name
      },
      receiverId: targetUser.username
    });
    setInputMessage({ mode: "", message: "" });

  }

  return (
    <div className='relative h-full w-full flex flex-col md:p-4'>

      <div className="messageTo text-center pb-2 text-[#ff7043] font-bold text-2xl">
        {targetUser.name ? targetUser.name
          :
          <div className="loader w-8 h-8 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>}
      </div>

      <div ref={ref} className="messageSection overflow-auto flex-grow p-4 rounded-lg border border-gray-600 bg-black/30">
        {messages.length > 0 ? (
          messages.map((msgObj, index) => (
            <div key={index} className={`flex flex-col ${msgObj.mode === "sent" ? "items-end" : "items-start"} my-5`}>
              <span className={`rounded-xl py-2 px-5 text-lg ${msgObj.mode === "sent" ? "bg-[#ff7043]" : "bg-gray-600/50"} text-white`}>
                {msgObj.message}
              </span>
            </div>
          ))
        )
          :
          (
            <p className="text-gray-200 text-center">No messages yet.</p>
          )}
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
            className='py-4 pl-6 pr-24 w-full text-lg box-border rounded-full border border-[#ff7043] text-white bg-transparent placeholder-white focus:border-[#ff7043]'
          />
          <button
            onClick={handleMessageSent}
            className='absolute top-1/2 right-4 transform -translate-y-1/2 bg-[#ff5722] text-white py-2 px-4 rounded-full transition duration-300 md:font-bold'>
            Send
          </button>
        </div>
      </div>
      <p className='text-center mt-1 md:-mb-6 text-gray-200 text-xs md:text-base'>Messages are deleted as soon as you leave this message page.</p>
    </div>

  );

}

export default MessagePage
