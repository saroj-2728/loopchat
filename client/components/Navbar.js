"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useRef, useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/context/userContext';
import Logo from '@/public/images/logo.png'
import profileImage from '@/images/logo.png';
import { NavIcons } from '@/utilities/Icons';
import { usePathname } from 'next/navigation';
import DefaultProfile from '@/utilities/DefaultProfile';
import Loader from './Loader';
import MobileNav from './MobileNav';

const Navbar = () => {

    const pathname = usePathname()
    const isMessagesPage = pathname.includes('/messages');
    const router = useRouter();
    const { user, logout } = useContext(UserContext);
    const [status, setStatus] = useState("loading");
    const [isPopupVisible, setPopupVisible] = useState(false);
    const popupRef = useRef(null);
    const defaultProfileSrc = DefaultProfile()

    const togglePopup = () => setPopupVisible(!isPopupVisible);

    useEffect(() => {
        if (user === undefined) {
            setStatus("loading");
        } else if (user) {
            setStatus("loggedIn");
        } else {
            setStatus("loggedOut");
        }
    }, [user]);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isPopupVisible && popupRef.current && !popupRef.current.contains(event.target) && !event.target.closest('#user-popup-button')) {
                setPopupVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPopupVisible]);

    const handleLogoutClick = () => {
        logout();
        togglePopup();
        router.push('/')
    }

    return (
        <>
            <div className={`z-10 sticky top-0 h-screen hidden md:flex flex-col justify-center ${isMessagesPage ? 'w-auto' : 'md:w-1/5 lg:w-1/4'} md:border-r md:border-r-white/20`}>
                <nav className="h-full md:w-full">
                    <div className="mx-auto md:mx-0 px-2 lg:px-3 h-full md:w-full">

                        <div className="relative flex flex-row md:flex-col h-14 md:h-full md:py-20 items-center md:items-start justify-between md:w-full">

                            {/* Logo */}
                            <Link
                                href={user?.username ? '/home' : '/'}
                                className="hidden md:block text-base lg:text-xl cursor-pointer px-4 lg:px-5"
                            >
                                {isMessagesPage ?
                                    <Image
                                        src={Logo}
                                        width={30}
                                        height={30}
                                        alt='Logo'
                                    />
                                    : 'LoopChat'}
                            </Link>

                            {/* Desktop Links */}
                            <div className="hidden md:block w-full">
                                <div className="flex flex-row md:flex-col md:items-center md:justify-center md:gap-3 md:py-4 md:w-full">
                                    <Link
                                        href={user?.username ? `/home` : `/`}
                                        className={`flex flex-row ${isMessagesPage ? 'gap-0 justify-center ' : 'gap-2 justify-start'} items-center hover:bg-gray-700/35 transition-all duration-300 rounded-lg px-3 lg:px-4 py-4 w-full`}
                                    >
                                        <NavIcons.HomeIcon className={`h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7`} />
                                        <div className={`${isMessagesPage ? 'hidden' : 'block'} text-lg md:text-base lg:text-xl font-medium text-gray-300 hover:text-white text-start`}>
                                            Home
                                        </div>
                                    </Link>
                                    <Link
                                        href="/about"
                                        className={`flex flex-row ${isMessagesPage ? 'gap-0 justify-center ' : 'gap-2 justify-start'} items-center hover:bg-gray-700/35 transition-all duration-300 rounded-lg px-3 lg:px-4 py-4 w-full`}
                                    >
                                        <NavIcons.AboutIcon className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />
                                        <div className={`${isMessagesPage ? 'hidden' : 'block'} text-lg md:text-base lg:text-xl font-medium text-gray-300 hover:text-white text-start`}>
                                            About
                                        </div>
                                    </Link>
                                    {user &&
                                        <>
                                            <Link
                                                href="/messages"
                                                className={`flex flex-row ${isMessagesPage ? 'gap-0 justify-center ' : 'gap-2 justify-start'} items-center hover:bg-gray-700/35 transition-all duration-300 rounded-lg px-3 lg:px-4 py-4 w-full`}
                                            >
                                                <NavIcons.MessageIcon className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />
                                                <div className={`${isMessagesPage ? 'hidden' : 'block'} text-lg md:text-base lg:text-xl font-medium text-gray-300 hover:text-white text-start`}>
                                                    Messages
                                                </div>
                                            </Link>

                                            <Link
                                                href="/contact"
                                                className={`flex flex-row ${isMessagesPage ? 'gap-0 justify-center ' : 'gap-2 justify-start'} items-center hover:bg-gray-700/35 transition-all duration-300 rounded-lg px-3 lg:px-4 py-4 w-full`}
                                            >
                                                <NavIcons.NotificationIcon className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />
                                                <div className={`${isMessagesPage ? 'hidden' : 'block'} text-lg md:text-base lg:text-xl font-medium text-gray-300 hover:text-white text-start`}>
                                                    Notifications
                                                </div>
                                            </Link>

                                            <Link
                                                href={"/" + user?.username}
                                                className={`flex flex-row ${isMessagesPage ? 'gap-0 justify-center ' : 'gap-2 justify-start'} items-center hover:bg-gray-700/35 transition-all duration-300 rounded-lg px-3 lg:px-4 py-4 w-full`}
                                            >
                                                <div className='flex justify-center md:justify-start h-[28px] w-[28px]'>
                                                    <Image
                                                        src={user?.profileImage?.url || defaultProfileSrc}
                                                        width={28}
                                                        height={28}
                                                        alt='User Profile'
                                                        className='rounded-full object-cover object-center'
                                                    />
                                                </div>
                                                <div className={`${isMessagesPage ? 'hidden' : 'block'} text-lg md:text-base lg:text-xl font-medium text-gray-300 hover:text-white text-start`}>
                                                    Profile
                                                </div>
                                            </Link>
                                        </>
                                    }
                                </div>
                            </div>

                            {/* User and Popup */}
                            <div className="relative md:w-full">
                                {status === "loading" ? (
                                    <Loader size={'w-8 h-8'} text={''} />
                                ) : status === "loggedIn" ? (
                                    <div className="flex flex-row gap-4 items-center md:w-full">
                                        <span
                                            className='md:hidden'
                                        >
                                            {user?.name}
                                        </span>
                                        <button
                                            onClick={togglePopup}
                                            id="user-popup-button"
                                            className="relative flex rounded-full items-center justify-center md:justify-start md:hover:bg-gray-700/35 transition-all duration-300 md:rounded-lg  md:w-full md:px-3 lg:px-4 md:py-3"
                                        >
                                            <svg
                                                className="hidden md:block h-8 w-8"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                            </svg>
                                            <p className={`${isMessagesPage ? '' : 'md:block'} hidden px-3 py-2 font-medium text-gray-300 hover:text-white text-start text-lg md:text-base lg:text-xl`}>
                                                More
                                            </p>
                                            <Image
                                                src={profileImage}
                                                width={35}
                                                height={35}
                                                alt="Profile"
                                                className='md:hidden p-2 md:p-4 box-content rounded-full transition-all duration-[400ms]'
                                            />
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        href='/login'
                                        className="bg-white hover:bg-white/80 text-black font-semibold rounded-lg ms-4 px-10 py-3 w-full transition duration-300"
                                    >
                                        Login
                                    </Link>
                                )}



                                {isPopupVisible && (
                                    <div ref={popupRef} className="absolute right-0 md:left-3 md:bottom-12 z-20 mt-2 w-48 md:w-56 md:py-2 md:px-3 bg-[#1e1e1e] shadow-lg rounded-lg ring-1 ring-black ring-opacity-5">
                                        <Link
                                            href={`/${user.username}`}
                                            onClick={togglePopup}
                                            className="block px-4 py-2 text-sm md:text-base lg:text-xl text-gray-200">
                                            Your Profile
                                        </Link>
                                        <a
                                            href="#"
                                            onClick={togglePopup}
                                            className="block px-4 py-2 text-sm md:text-base lg:text-xl text-gray-200">
                                            Settings
                                        </a>
                                        <p
                                            onClick={handleLogoutClick}
                                            className="block px-4 py-2 text-sm md:text-base lg:text-xl text-gray-200 cursor-pointer">
                                            Sign out
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </nav>
            </div>
            <MobileNav />
        </>
    );
}

export default Navbar;
