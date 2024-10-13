"use client"
import { usersArray } from "@/serverActions/handleUsers";
import { useEffect, useState, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { UserContext } from "@/context/userContext";

export default function RootLayout({ children }) {

    const { user: userMe } = useContext(UserContext)
    const router = useRouter()
    const pathname = usePathname()
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const messagePageRegex = /^\/([^/]+)\/messages\/([^/]+)$/;
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await usersArray("all");
                setUsers(data);
            } catch (err) {
                setError("Failed to fetch users.");
                console.error(err);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        document.title = 'Messages'
    }, [])


    const handleUserMessaging = (users) => {
        router.push(`/${userMe.username}/messages/${users.username}`);
    }

    return (
        <>
            <div className={`max-w-[1440px] mx-auto md:mt-5 relative flex flex-col bg-[#1e1e1e] md:shadow-custom md:h-[calc(100vh-104px)] h-[calc(100dvh-64px)]  md:rounded-xl md:py-2 md:px-3`}>
                <div className="flex flex-row h-full md:gap-2">

                    <div className={`md:flex flex-col items-center md:w-1/3 w-full md:border-r-2 md:border-[#ff7043]  h-full md:py-2 md:pl-2 md:pr-4 ${messagePageRegex.test(pathname) ? "hidden" : "flex"}`}>

                        <div className="shadow-small rounded-lg p-4 w-full max-w-md text-center h-full flex flex-col bg-black/30 backdrop-blur-md ">
                            <h1 className="text-xl md:text-2xl mt-2 md:mb-2 font-bold text-[#ff7043]">Pick a User to Message!</h1>

                            <div className="users mt-4 overflow-y-auto flex-grow">
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <div
                                            key={user._id}
                                            className="border border-[#ff7043] py-1  rounded-xl my-2 cursor-pointer transition duration-[650ms] hover:bg-[#ff5722] text-white"
                                            onClick={() => handleUserMessaging(user)}
                                        >
                                            <div className="text-xl">
                                                {`${user.name}`}
                                            </div>
                                            <div
                                            className="text-sm">
                                                {`(${user.username})`}
                                            </div>
                                        </div>
                                    ))
                                )
                                    :
                                    (
                                        <div className="loader w-8 h-8 border-4 border-t-4 border-gray-200 border-t-white rounded-full animate-spin mx-auto"></div>
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


