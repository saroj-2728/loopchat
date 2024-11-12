"use client"
import { UserContext } from '@/context/userContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import Loader from '@/components/Loader';

const Home = () => {

    const { user, logout } = useContext(UserContext)
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleLogOut = () => {
        setLoading(true)
        logout();
        router.push('/')
    }

    return (
        <>
            <div className="flex flex-col min-h-screen items-center justify-center px-4 w-full">
                {loading ? <Loader size={'h-16 w-16'} text={"Please Wait ..."} />
                    :
                    <div className="shadow-custom rounded-lg p-6 sm:p-8 md:p-10 text-center flex flex-col gap-4 w-full max-w-md">
                        <h1 className="text-3xl sm:text-4xl font-bold text-sky-500">
                            Welcome, {user?.name || "User"}!
                        </h1>
                        <p className="text-white text-base sm:text-lg">
                            Start messaging now with the other users there.
                        </p>

                        <Link
                            href={'/messages'}
                            className="w-full bg-sky-500 hover:bg-sky-600 text-white text-base md:text-xl transition-colors duration-300 font-semibold py-3.5 px-4 rounded-lg focus:outline-none focus:shadow-outline cursor-pointer"
                        >
                            Go to Messages
                        </Link>


                        {/* 
                        <div className="bg-gray-800 p-4 rounded-md">
                            <h2 className="text-lg font-semibold text-sky-400 mb-2">Online Friends</h2>
                            <ul className="space-y-1">
                                {onlineFriends.slice(0, 3).map((friend, index) => (
                                    <li key={index} className="text-gray-300">{friend.name}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-gray-800 p-4 rounded-md">
                            <h2 className="text-lg font-semibold text-sky-400 mb-2">Recent Conversations</h2>
                            <ul className="space-y-1">
                                {recentConversations.slice(0, 3).map((chat, index) => (
                                    <li key={index} className="text-gray-300">{chat.user.name}</li>
                                ))}
                            </ul>
                        </div> */}

                        <button
                            className="w-full bg-white hover:bg-gray-300 text-black text-base md:text-xl transition-colors duration-300 font-semibold py-3.5 px-4 rounded-lg focus:outline-none focus:shadow-outline cursor-pointer"
                            onClick={handleLogOut}>
                            Log Out
                        </button>
                    </div>}
            </div>
        </>
    )
}

export default Home
