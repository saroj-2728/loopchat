"use client"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Loader from '@/components/Loader';
import { useSession } from '@/context/SessionContext';

const Home = () => {

    const { profile, setProfile, handleSignOut } = useSession()
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleLogOut = async () => {
        setLoading(true)
        setProfile(null)
        handleSignOut()
        router.push('/')
    }

    return (
        <>
            <div className="flex flex-col min-h-screen items-center justify-center px-4 w-full">
                {loading ? <Loader size={'h-16 w-16'} text={"Please Wait ..."} />
                    :
                    <div className="shadow-custom rounded-lg p-6 sm:p-8 md:p-10 text-center flex flex-col gap-4 w-full max-w-md">
                        <h1 className="text-3xl font-bold text-sky-500">
                            Welcome, {profile?.name || "User"}!
                        </h1>
                        <p className="text-white text-base">
                            Start messaging now with the other users there.
                        </p>
                        <div className='flex md:flex-row flex-col gap-4'>
                            <Link
                                href={'/messages'}
                                className="w-full md:w-1/2 bg-button-primary hover:bg-button-primary/80 text-white text-base  transition-colors duration-300 font-semibold py-3.5 md:py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline cursor-pointer"
                            >
                                Go to messages
                            </Link>

                            <button
                                className="w-full md:w-1/2 bg-white hover:bg-gray-300 text-black text-base transition-colors duration-300 font-semibold py-3.5 md:py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline cursor-pointer"
                                onClick={handleLogOut}>
                                Log out
                            </button>
                        </div>
                    </div>}
            </div>
        </>
    )
}

export default Home
