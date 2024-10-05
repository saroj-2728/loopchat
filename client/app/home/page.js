"use client"
import React from 'react'
import { useRouter } from 'next/navigation';

const Home = () => {

    const router = useRouter()
    const handleMessaging = () => {
        router.push('/messages')
    }

    const handleLogOut = () => {
        router.push('/')
    }

    return (
        <>
            <div className='w-full h-[calc(100vh-64px)] flex justify-center items-center'>
                <div className='flex flex-col mx-auto w-1/2 max-w-[380px] min-w-[300px] gap-10 items-center'>
                    <button className='py-3.5 md:py-4 text-xl w-full bg-sky-500 text-white font-bold text-center rounded-full' onClick={handleMessaging}>Start Messaging</button>
                    <button className='py-3.5 md:py-4 text-xl w-full bg-sky-500 text-white font-bold text-center rounded-full' onClick={handleLogOut}>Log Out</button>
                </div>
            </div>
        </>
    )
}

export default Home
