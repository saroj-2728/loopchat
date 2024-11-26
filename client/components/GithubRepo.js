'use client'
import Link from "next/link"
import { FaGithub } from "react-icons/fa";

const GithubRepo = () => {
    return (
        <Link
            href={"https://github.com/saroj-2728/next_js_chat_app"}
            target="_blank"
            className="fixed right-5 top-5 w-6 h-6 md:w-8 md:h-8 group z-50"
        >
            <div
                className="absolute right-[150%] top-1/2 -translate-y-1/2 flex items-center justify-center w-max px-3 md:px-4 py-2 md:py-3 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
                Github Repository
            </div>
            <FaGithub
                className="w-full h-full"
            />
        </Link>
    )
}

export default GithubRepo
