"use client"
import React, { useEffect, useState, useRef, useContext } from 'react'
import { UserContext } from '@/context/userContext';
import { AllUsersContext } from '@/context/allUsersContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useSocket } from '@/context/socketContext';
import Loader from '@/components/Loader';
import DefaultProfile from '@/utilities/DefaultProfile';
import { GoArrowLeft } from "react-icons/go";

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
  const defaultProfileSrc = DefaultProfile()

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
    const socket = socketRef.current;

    // Listen for incoming messages 
    socket?.on('privateMessage', (data) => {
      if (data.sender.username === targetUser.username && userMe.username === data.receiverId) {
        setSender(data.sender)
        setMessages((prevMessages) => [...prevMessages, {
          mode: "received",
          message: data.inputMessage
        }]);
      }
    });

    return () => {
      socket?.off('privateMessage');
    };
  }, [userMe, targetUser, socketRef]);

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
    <div className='relative h-full w-full flex flex-col'>

      <div className="messageTo w-full flex flex-row items-center justify-start gap-3 text-center text-white font-medium text-base md:text-xl border-b border-white/20 py-2 md:py-4 px-4">

        <Link
          href={'/messages'}
          className="md:hidden"
        >
          <GoArrowLeft className=" w-7 h-7" />
        </Link>
        <div className='flex justify-center w-[30px] h-[30px] md:w-[50px] md:h-[50px]'>
          <Image
            src={targetUser?.profileImage?.url || defaultProfileSrc}
            width={50}
            height={50}
            alt='User Profile'
            className="rounded-full"
          />
        </div>
        {targetUser.name ? targetUser.name
          :
          <Loader size={'h-8 w-8'} text={''} />}
      </div>

      <div ref={ref} className="messageSection w-full overflow-auto flex-grow rounded-lg px-4 md:px-6">
        {messages.length > 0 ? (
          messages.map((msgObj, index) => (
            <div
              key={index}
              className={`flex flex-col ${msgObj.mode === "sent" ? "items-end" : "items-start"} my-5`}
            >
              <span className={`rounded-xl md:py-2 py-1 px-4 md:px-5 text-lg ${msgObj.mode === "sent" ? "bg-sky-500" : "bg-gray-600/50"} text-white`}>
                {msgObj.message}
              </span>
            </div>
          ))
        )
          :
          (
            <p className="text-gray-200 text-center mt-4">No messages yet.</p>
          )}
        <div ref={endOfMessagesRef} />
      </div>

      <div className='w-full messageBox flex items-center justify-center my-4 px-4'>
        <div className='w-full max-w-2xl relative'>
          <input
            id='message'
            name='message'
            type="text"
            value={inputMessage.message}
            placeholder='Message...'
            onKeyDown={(e) => { if (e.key === "Enter") handleMessageSent(); }}
            onChange={(e) => setInputMessage({ mode: "", message: e.target.value })}
            className='py-3 md:py-[14px] pl-6 pr-24 w-full text-sm md:text-lg box-border rounded-full border border-gray-200/30 text-white bg-transparent placeholder-white/50'
          />
          {inputMessage.message && <button
            onClick={handleMessageSent}
            className='absolute top-1/2 right-4 transform -translate-y-1/2 hover:text-white text-sky-500 font-semibold py-2 px-4 rounded-full transition duration-300'>
            Send
          </button>}
        </div>
      </div>
    </div>

  );

}

export default MessagePage
