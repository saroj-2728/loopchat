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
  const [inputMessage, setInputMessage] = useState("")
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
        router.push(`/messages`)
    };
    fetchUsersName();
  }, [allUsers, params.slug, router]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/messages/${userMe.username}/${targetUser.username}`);
        const result = await response.json();
        
        if (response.ok) {
          setMessages(result);
        } else {
          console.error('Failed to fetch messages:', result.error);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (targetUser.username && userMe.username) {
      fetchMessages();
    }

  }, [targetUser, userMe]);

  useEffect(() => {
    document.title = `Message ${targetUser.name}`
  }, [targetUser.name])

  useEffect(() => {
    const socket = socketRef.current;

    // Listen for incoming messages 
    socket?.on('privateMessage', (data) => {
      if (data.senderId === targetUser.username && userMe.username === data.receiverId) {
        setMessages((prevMessages) => [
          ...prevMessages,
          data,
        ]);
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
    if (inputMessage.trim() === "") {
      setInputMessage("")
      return;
    }
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        senderId: userMe.username,
        receiverId: targetUser.username,
        content: inputMessage,
      },
    ]);

    socketRef.current.emit('privateMessage', {
      senderId: userMe.username,
      receiverId: targetUser.username,
      content: inputMessage,
      timestamp: new Date().toISOString(),
    });
    setInputMessage("");
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
        {messages?.length > 0 ? (
          messages.map((msgObj, index) => (
            <div
              key={index}
              className={`flex flex-row w-full ${msgObj.senderId === userMe?.username ? "justify-end" : "justify-start"} items-center gap-2 md:gap-3 my-5`}
            >
              {msgObj.senderId !== userMe?.username &&
                <div className='flex justify-center w-[30px] h-[30px] md:h-[38px] md:w-[38px]'>
                  <Image
                    src={targetUser?.profileImage?.url}
                    height={40}
                    width={40}
                    alt="User's Profile"
                    className='rounded-full'
                  />
                </div>
              }
              <span className={`rounded-xl md:py-2 py-1 px-4 md:px-5 text-lg ${msgObj.senderId === userMe?.username ? "bg-sky-500 rounded-br" : "bg-gray-600/50 rounded-bl"} text-white max-w-[50%]`}>
                {msgObj.content}
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
            value={inputMessage}
            placeholder='Message...'
            onKeyDown={(e) => { if (e.key === "Enter") handleMessageSent(); }}
            onChange={(e) => setInputMessage(e.target.value)}
            className='py-3 md:py-[14px] pl-6 pr-24 w-full text-sm md:text-lg box-border rounded-full border border-gray-200/30 text-white bg-transparent placeholder-white/50'
          />
          {inputMessage && <button
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
