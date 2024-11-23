'use client'
import { useSession } from "@/context/SessionContext"
import Link from "next/link"
import { usePathname } from "next/navigation"

// Tried to use middleware for this purpose but that didn't work properly
export default function RootLayout({ children }) {

    const { user } = useSession()
    const pathname = usePathname()

    if (user) return (
        <>
            {children}
        </>
    )
    else return (
        <>
            <div className="flex flex-col min-h-screen items-center justify-center px-4 w-full">
                <div className="container flex items-center justify-center flex-col gap-5">
                    <div>
                        You are not Signed In. Please Sign In to continue.
                    </div>
                    <Link
                        href={`/login?continueTo=${pathname}`}
                        className="bg-white hover:bg-white/80 text-black text-center w-20 py-2 rounded-lg font-semibold transition duration-300">
                        Sign In
                    </Link>
                </div>

            </div>
        </>
    )
}