'use client'
import Link from "next/link"
import Image from "next/image"
import { NavIcons } from "@/utilities/Icons"
import { usePathname } from 'next/navigation';
import DefaultProfile from '@/utilities/DefaultProfile';
import { useSession } from "@/context/SessionContext";

const MobileNav = () => {

    const { profile, user } = useSession()
    const pathname = usePathname()
    const isMessagesPage = pathname.includes('/messages') && user;
    const defaultProfileSrc = DefaultProfile()

    return (
        !isMessagesPage &&
        <div className="block md:hidden fixed w-full bottom-0 z-50">
            <div id="mobile-menu" className="flex flex-row border-t border-t-white/20">
                <Link
                    href={profile?.username ? `/home` : `/`}
                    className={`flex flex-row items-center justify-center hover:bg-gray-700/35 transition-all duration-300 px-3 lg:px-4 py-4 w-full`}
                >
                    <NavIcons.HomeIcon className={`h-7 w-7`} />
                </Link>
                <Link
                    href="/about"
                    className={`flex flex-row items-center justify-center hover:bg-gray-700/35 transition-all duration-300 px-3 lg:px-4 py-4 w-full`}
                >
                    <NavIcons.AboutIcon className={`h-7 w-7`} />
                </Link>
                {profile?.username &&
                    <>
                        <Link
                            href="/messages"
                            className={`flex flex-row items-center justify-center hover:bg-gray-700/35 transition-all duration-300 px-3 lg:px-4 py-4 w-full`}
                        >
                            <NavIcons.MessageIcon className={`h-7 w-7`} />
                        </Link>
                        <Link
                            href="/notifications"
                            className={`flex flex-row items-center justify-center hover:bg-gray-700/35 transition-all duration-300 px-3 lg:px-4 py-4 w-full`}
                        >
                            <NavIcons.NotificationIcon className={`h-7 w-7`} />
                        </Link>
                        <Link
                            href={"/" + profile?.username}
                            className={`flex flex-row items-center justify-center hover:bg-gray-700/35 transition-all duration-300 px-3 lg:px-4 py-4 w-full`}
                        >
                            <div className='flex justify-center md:justify-start h-[28px] w-[28px]'>
                                <Image
                                    src={profile?.profileImage?.url || defaultProfileSrc}
                                    width={28}
                                    height={28}
                                    alt='User Profile'
                                    className='rounded-full object-cover object-center'
                                />
                            </div>
                        </Link>
                    </>
                }
            </div>
        </div>
    )
}

export default MobileNav
