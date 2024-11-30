'use client'
import { useSession } from "@/context/SessionContext"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

export default function RootLayout({ children }) {

    const pathname = usePathname()
    const { profile } = useSession()

    useEffect(() => {
        document.title = "Edit Profile"
    }, [])


    return (
        <div className="min-h-screen sticky top-0 w-full flex flex-row">
            <div className="h-screen sticky top-0 bottom-0 hidden md:block w-1/4 border-r border-r-white/20">
                <div className="max-w-4xl w-full p-1 md:p-4 rounded-lg shadow-lg">
                    <h1 className="text-lg md:text-2xl text-white text-center font-semibold my-6">
                        Settings
                    </h1>
                    <div className="flex flex-col w-full px-5 gap-3">
                        <Link
                            href={`/profile/${profile?.username}/edit/edit-profile`}
                            className={`${pathname.includes('edit-profile') ? "bg-accent/80" : ""} hover:bg-accent py-4 rounded-lg px-4 transition duration-300 font-medium text-sm`}
                        >
                            Edit Profile
                        </Link>
                        <Link
                            href={`/profile/${profile?.username}/edit/change-password`}
                            className={`${pathname.includes('change-password') ? "bg-accent/80" : ""} hover:bg-accent py-4 rounded-lg px-4  transition duration-300 font-medium text-sm`}
                        >
                            Change Password
                        </Link>
                        <Link
                            href={`/profile/${profile?.username}/edit/delete-profile`}
                            className={`${pathname.includes('delete-profile') ? "bg-accent/80" : ""} hover:bg-accent py-4 rounded-lg px-4  transition duration-300 font-medium text-sm`}
                        >
                            Delete Profile
                        </Link>
                    </div>
                </div>
            </div>
            <div className="h-full w-full md:w-3/4">
                {children}
            </div>
        </div>
    )
}