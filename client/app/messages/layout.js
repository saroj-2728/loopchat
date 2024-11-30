"use client"
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import DefaultProfile from "@/utilities/DefaultProfile";
import { GoArrowLeft } from "react-icons/go";
import { useSession } from "@/context/SessionContext";
import { useFriends } from "@/context/FriendContext";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }) {

    const router = useRouter()
    const { profile } = useSession()
    const { friends } = useFriends()
    const pathname = usePathname()
    const messagePageRegex = /\/messages\/([^/]+)$/;
    const defaultProfileSrc = DefaultProfile()

    useEffect(() => {
        document.title = 'Messages'
    }, [])

    return (
        <>
            <div className={`mx-auto md:mx-0 w-full relative flex flex-col md:shadow-custom h-screen md:rounded-xl`}>
                <div className="flex flex-row h-full w-full">

                    <div className={`lg:flex flex-col items-center md:w-[36%] w-full md:border-r md:border-r-white/30  h-full ${messagePageRegex.test(pathname) ? "hidden" : ""} max-w-[460px]`}>

                        <div className="shadow-small rounded-lg p-4 md:px-0 w-full mx-auto text-center h-full flex flex-col">

                            <div className="flex items-center">
                                <div
                                    onClick={() => router.back()}
                                    className="md:hidden"
                                >
                                    <GoArrowLeft className=" w-7 h-7" />
                                </div>
                                <h1 className="text-base md:w-full w-[85%] md:text-2xl font-bold text-center text-white">
                                    Messages
                                </h1>
                            </div>

                            <div className="users w-full mt-2 md:mt-4  overflow-y-auto flex flex-col flex-grow">
                                {friends.length > 0 ? (
                                    friends.map((friend) => {
                                        if (friend?._id === profile?._id) return;
                                        return (
                                            <Link
                                                href={`/messages/${friend?.username}`}
                                                key={friend?._id}
                                                className={`w-full border-y border-y-white/5 py-2 cursor-pointer transition duration-300  text-white ${pathname.split('/')[2] === friend?.username ? "bg-gray-600/60" : "hover:bg-gray-700/40"} flex flex-row items-center gap-4 md:px-4 px-1`}
                                            >
                                                <div className="flex justify-center h-[50px] w-[50px]">
                                                    <Image
                                                        src={friend?.profileImage?.url || defaultProfileSrc}
                                                        width={56}
                                                        height={56}
                                                        className="rounded-full"
                                                        alt="User Profile"
                                                    />
                                                </div>
                                                <div className="text-base md:text-lg flex flex-row gap-3">
                                                    {`${friend?.name}`}
                                                </div>
                                            </Link>
                                        )
                                    })
                                )
                                    :
                                    (
                                        <div>You do not have any friends. 
                                            <Link
                                            className="text-sky-500 hover:text-sky-600 transition duration-300"
                                             href={'/friends/make-new-friends'}>
                                            {" "} Find friends.</Link>
                                            </div>
                                    )}
                            </div>
                        </div>
                    </div>
                    {children}
                </div>
            </div>

        </>
    );
}


