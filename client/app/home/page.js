"use client"
import { UserContext } from '@/context/userContext';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';

const Home = () => {

    const { user } = useContext(UserContext)
    const router = useRouter()
    const handleMessaging = () => {
        router.push(`${user.username}/messages`)
    }

    const handleLogOut = () => {
        localStorage.removeItem('user')
        router.push('/')
    }

    return (
        <>
            <div className="flex flex-col h-[calc(100vh-64px)] items-center justify-center">
                <div className="bg-white shadow-md rounded-lg p-8 text-center flex flex-col gap-4 px-14">
                    <h1 className="text-3xl font-bold text-sky-600">
                        Welcome, {user?.name || "User"}!
                    </h1>
                    <p className="text-black">Start messaging now with the other users there.</p>

                    <button className='py-3.5 md:py-4 text-xl w-full text-center bg-white text-blue-600 font-semibold rounded-full shadow-2xl hover:bg-gray-200 border border-black' onClick={handleMessaging}>Go to Messages</button>

                    <button className='py-3.5 md:py-4 text-xl w-full text-center  bg-white text-blue-600 font-semibold rounded-full shadow-lg hover:bg-gray-200 border border-black' onClick={handleLogOut}>Log Out</button>
                </div>
            </div>
        </>
    )
}

export default Home
