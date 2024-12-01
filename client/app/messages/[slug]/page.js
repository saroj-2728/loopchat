"use client"
import { useEffect, useState, useRef, use } from 'react'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSocket } from '@/context/socketContext';
import Loader from '@/components/Loader';
import DefaultProfile from '@/utilities/DefaultProfile';
import { GoArrowLeft } from "react-icons/go";
import { useSession } from '@/context/SessionContext';
import auth from '@/Firebase';
import { useFriends } from '@/context/FriendContext';

const MessagePage = ({ params }) => {

  const { profile } = useSession()
  const currentUser = auth.currentUser;
  const unwrappedParams = use(params);

  const { friends } = useFriends()
  const router = useRouter()

  const socketRef = useSocket()
  const endOfMessagesRef = useRef(null);

  const [targetUser, settargetUser] = useState({});
  const [inputMessage, setInputMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [fetchingMessages, setFetchingMessages] = useState(true)

  const defaultProfileSrc = DefaultProfile()

  const isMobileDevice = () => {
    return window.innerWidth < 768;
  };

  useEffect(() => {
    if (friends.length === 0) return;
    const fetchUsersName = () => {
      const theUser = friends.find((user) => user.username === unwrappedParams.slug)
      if (theUser)
        settargetUser(theUser)
      else
        router.push(`/messages`)
    };
    fetchUsersName();
  }, [friends, unwrappedParams.slug, router]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = await currentUser.getIdToken()
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/messages/${profile._id}/${targetUser._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const result = await response.json();

        if (response.ok) {
          setMessages(result);
          setFetchingMessages(false)
        } else {
          console.error('Failed to fetch messages:', result.error);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (targetUser?.username && profile?.username && currentUser) {
      fetchMessages();
    }

  }, [targetUser, profile, currentUser]);

  useEffect(() => {
    document.title = `Message ${targetUser.name}`
  }, [targetUser.name])

  useEffect(() => {
    const socket = socketRef.current;

    // Listen for incoming messages 
    socket?.on('privateMessage', (data) => {
      if (data.senderId === targetUser._id && profile._id === data.receiverId) {
        setMessages((prevMessages) => [
          ...prevMessages,
          data,
        ]);
      }
    });

    return () => {
      socket?.off('privateMessage');
    };
  }, [profile, targetUser, socketRef]);

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
        senderId: profile._id,
        receiverId: targetUser._id,
        content: inputMessage,
      },
    ]);

    socketRef.current.emit('privateMessage', {
      senderId: profile._id,
      receiverId: targetUser._id,
      content: inputMessage,
      timestamp: new Date().toISOString(),
    });
    setInputMessage("");
  }

  return (
    <div className='relative h-full w-full flex flex-col'>

      <div className="messageTo w-full flex flex-row items-center justify-start gap-3 text-center text-white font-medium text-base md:text-xl border-b border-white/20 py-2 md:py-2.5 px-4">
        <div
          onClick={() => router.back()}
          className="md:hidden"
        >
          <GoArrowLeft className=" w-7 h-7" />
        </div>
        <div className='flex justify-center w-[30px] h-[30px] md:w-[45px] md:h-[45px]'>
          <Image
            src={targetUser?.profileImage?.url || defaultProfileSrc}
            width={50}
            height={50}
            alt='User Profile'
            className="rounded-full"
          />
        </div>
        <div className='text-base'>
          {targetUser.name ? targetUser.name
            :
            <Loader size={'h-8 w-8'} text={''} />}
        </div>
      </div>

      <div ref={ref} className="messageSection w-full overflow-auto flex-grow rounded-lg px-4 md:px-6">
        {messages?.length > 0 ? (
          messages.map((msgObj, index) => (
            <div
              key={index}
              className={`flex flex-row w-full ${msgObj.senderId === profile?._id ? "justify-end" : "justify-start"} items-center gap-2 md:gap-3 my-5 md:my-3`}
            >
              {msgObj.senderId !== profile?._id &&
                <div className='flex justify-center w-[30px] h-[30px]'>
                  <Image
                    src={targetUser?.profileImage?.url || defaultProfileSrc}
                    height={40}
                    width={40}
                    alt="User's Profile"
                    className='rounded-full'
                  />
                </div>
              }
              <span className={`rounded-xl md:py-1.5 py-1 px-4 md:px-5 text-lg md:text-base ${msgObj.senderId === profile?._id ? "bg-sky-500 rounded-br" : "bg-gray-600/50 rounded-bl"} text-white max-w-[50%]`}>
                {msgObj.content}
              </span>
            </div>
          ))
        )
          :
          (fetchingMessages
            ? <Loader size={'h-8 w-8'} text={''} />
            : <p className="text-gray-200 text-center mt-4">No messages yet.</p>
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
            onKeyDown={(e) => {
              if (inputMessage.length > 400) return;
              if (e.key === "Enter") handleMessageSent();
            }}
            onChange={(e) => setInputMessage(e.target.value)}
            className='py-3 md:py-[14px] pl-6 pr-24 w-full text-sm md:text-lg box-border rounded-full border border-gray-200/30 text-white bg-transparent placeholder-white/50'
          />

          {inputMessage.length > 400 && (
            <div className="absolute text-center bottom-12 md:bottom-14 left-1/2 transform -translate-x-1/2 text-red-500 text-sm">
              Message is too long (max 400 characters)
            </div>
          )}

          {inputMessage &&
            <button
              disabled={inputMessage.length > 400}
              onClick={handleMessageSent}
              className={`absolute top-1/2 right-4 transform -translate-y-1/2 text-sky-500 font-semibold py-2 px-4 rounded-full transition duration-300  ${inputMessage.length > 400 ? 'text-white/20 cursor-not-allowed' : 'hover:text-white'}`}
            >
              Send
            </button>
          }
        </div>
      </div>
    </div>

  );

}

export default MessagePage
