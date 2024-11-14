"use client"
import { useEffect } from "react"

const Messages = () => {

    useEffect(() => {
        document.title = "Messages"
    }, [])


    return (
        <>
            <div className='md:flex hidden justify-center items-center h-full w-full text-2xl'>
            Send private messages to any friend.
            </div>
        </>
    )
}

export default Messages


