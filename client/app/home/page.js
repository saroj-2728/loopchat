"use client"
import { UserContext } from '@/context/userContext';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';

const Home = () => {

    const { user, logout } = useContext(UserContext)
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const handleMessaging = () => {
        router.push(`${user.username}/messages`)
    }

    const handleLogOut = () => {
        setLoading(true)
        logout();
        router.push('/')
    }

    return (
        <>
            <div className="flex flex-col min-h-screen items-center justify-center px-4">
                {loading ? <div className="loader w-16 h-16 border-8 border-t-8 border-gray-200 border-t-blue-500 rounded-full animate-spin">
                </div> :
                    <div className="bg-[#1e1e1e] shadow-custom rounded-lg p-6 sm:p-8 md:p-10 text-center flex flex-col gap-4 w-full max-w-md">
                        <h1 className="text-3xl sm:text-4xl font-bold text-[#ff7043]">
                            Welcome, {user?.name || "User"}!
                        </h1>
                        <p className="text-white text-base sm:text-lg">
                            Start messaging now with the other users there.
                        </p>

                        <button className='py-3 md:py-4 text-lg md:text-xl w-full text-center bg-[#ff7043] text-white font-semibold rounded-full shadow-lg hover:bg-[#ff5722] transition duration-300' onClick={handleMessaging}>
                            Go to Messages
                        </button>

                        <button className='py-3 md:py-4 text-lg md:text-xl w-full text-center  bg-[#ffccbc] text-[#121212] font-semibold rounded-full shadow-lg hover:bg-[#ffb6a0] border transition duration-300' onClick={handleLogOut}>
                            Log Out
                        </button>
                    </div>}
            </div>
        </>
    )
}

export default Home
