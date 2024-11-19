"use client"
import { useEffect, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AllUsersContext } from "@/context/allUsersContext";
import Link from "next/link";
import Image from "next/image";
import Loader from "@/components/Loader";
import DefaultProfile from "@/utilities/DefaultProfile";
import { GoArrowLeft } from "react-icons/go";

export default function RootLayout({ children }) {

    const pathname = usePathname()
    const router = useRouter()

    const { allUsers } = useContext(AllUsersContext)

    const messagePageRegex = /\/messages\/([^/]+)$/;
    const defaultProfileSrc = DefaultProfile()

    const goBack = () => router.back()

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
                                    onClick={goBack}
                                    className="md:hidden"
                                >
                                    <GoArrowLeft className=" w-7 h-7" />
                                </div>
                                <h1 className="text-base md:w-full w-[85%] md:text-2xl font-bold text-center text-white">
                                    Messages
                                </h1>
                            </div>

                            <div className="users w-full mt-2 md:mt-4  overflow-y-auto flex flex-col flex-grow">
                                {allUsers.length > 0 ? (
                                    allUsers.map((user) => (
                                        <Link
                                            href={`/messages/${user.username}`}
                                            key={user._id}
                                            className={`w-full border-y border-y-white/5 py-2 md:py-3 cursor-pointer transition duration-300  text-white ${pathname.split('/')[2] === user.username ? "bg-gray-600/60" : "hover:bg-gray-700/40"} flex flex-row items-center gap-4 md:px-4 px-1`}
                                        >
                                            <div className="flex justify-center h-[56px] w-[56px]">
                                                <Image
                                                    src={user?.profileImage?.url || defaultProfileSrc}
                                                    width={56}
                                                    height={56}
                                                    className="rounded-full"
                                                    alt="User Profile"
                                                />
                                            </div>
                                            <div className="text-base md:text-xl flex flex-row gap-3">
                                                {`${user.name}`}
                                            </div>
                                        </Link>
                                    ))
                                )
                                    :
                                    (
                                        <Loader size={'h-8 w-8 md:h-14 md:w-14'} text={""} />
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


