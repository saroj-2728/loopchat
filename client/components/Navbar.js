"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
    const { data } = useSession()
    const user = data?.user;

    const [status, setStatus] = useState("loading");
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [notificationsVisible, setNotificationsVisible] = useState(false)

    const popupRef = useRef(null);
    const navRef = useRef(null)
    const defaultProfileSrc = DefaultProfile()
    let shortNav = notificationsVisible || isMessagesPage;

    const togglePopup = () => {
        setTimeout(() => {
            setPopupVisible(!isPopupVisible);
        }, 100);
    }
    const toggleNotifications = () => setNotificationsVisible(!notificationsVisible)

    useEffect(() => {
        if (user === null) {
            setStatus("loading");
        } else if (user) {
            setStatus("loggedIn");
        } else {
            setStatus("loggedOut");
        }
    }, [user]);

    const handleLogoutClick = () => {
        signOut();
        togglePopup();
        router.push('/')
    }

    return (
        <>
            <div className={`z-10 max-h-screen sticky top-0 h-screen hidden md:flex flex-row justify-start ${isMessagesPage ? '' : 'md:w-1/5 lg:w-1/4'} ${!shortNav ? 'border-r' : ""}  border-r-white/20 max-w-md`}>

                <nav ref={navRef} className={`h-full ${shortNav ? '' : "w-full"} relative`}>

                    <div className={`mx-auto md:mx-0 px-2 lg:px-3 h-full md:w-full ${shortNav ? 'border-r' : ""}  border-r-white/20`}>

                        <div className="relative flex flex-row md:flex-col h-14 md:h-full md:py-20 items-center md:items-start justify-between md:w-full">

                            {/* Logo */}
                            <Link
                                href={user?.username ? '/home' : '/'}
                                onClick={() => { notificationsVisible && toggleNotifications() }}
                                className="hidden md:block text-base lg:text-xl cursor-pointer px-4 lg:px-5"
                            >
                                {shortNav ?
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
                                        onClick={() => { notificationsVisible && toggleNotifications() }}
                                        className={`flex flex-row ${shortNav ? 'gap-0 justify-center ' : 'gap-2 justify-start'} items-center hover:bg-gray-700/35 transition-all duration-300 rounded-lg px-3 lg:px-4 py-4 w-full`}
                                    >
                                        <NavIcons.HomeIcon className={`h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7`} />
                                        <div className={`${shortNav ? 'hidden' : 'block'} text-lg md:text-base lg:text-xl font-medium text-gray-300 hover:text-white text-start`}>
                                            Home
                                        </div>
                                    </Link>
                                    <Link
                                        href="/about"
                                        onClick={() => { notificationsVisible && toggleNotifications() }}
                                        className={`flex flex-row ${shortNav ? 'gap-0 justify-center ' : 'gap-2 justify-start'} items-center hover:bg-gray-700/35 transition-all duration-300 rounded-lg px-3 lg:px-4 py-4 w-full`}
                                    >
                                        <NavIcons.AboutIcon className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />
                                        <div className={`${shortNav ? 'hidden' : 'block'} text-lg md:text-base lg:text-xl font-medium text-gray-300 hover:text-white text-start`}>
                                            About
                                        </div>
                                    </Link>
                                    {user &&
                                        <>
                                            <Link
                                                href="/messages"
                                                onClick={() => { notificationsVisible && toggleNotifications() }}
                                                className={`flex flex-row ${shortNav ? 'gap-0 justify-center ' : 'gap-2 justify-start'} items-center hover:bg-gray-700/35 transition-all duration-300 rounded-lg px-3 lg:px-4 py-4 w-full`}
                                            >
                                                <NavIcons.MessageIcon className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />
                                                <div className={`${shortNav ? 'hidden' : 'block'} text-lg md:text-base lg:text-xl font-medium text-gray-300 hover:text-white text-start`}>
                                                    Messages
                                                </div>
                                            </Link>

                                            <div
                                                onClick={toggleNotifications}
                                                className={`flex flex-row ${shortNav ? 'gap-0 justify-center ' : 'gap-2 justify-start'} items-center hover:bg-gray-700/35 transition-all duration-300 rounded-lg px-3 lg:px-4 py-4 w-full cursor-pointer`}
                                            >
                                                <NavIcons.NotificationIcon className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />
                                                <div className={`${shortNav ? 'hidden' : 'block'} text-lg md:text-base lg:text-xl font-medium text-gray-300 hover:text-white text-start`}>
                                                    Notifications
                                                </div>
                                            </div>

                                            <Link
                                                href={"/" + user?.username}
                                                onClick={() => { notificationsVisible && toggleNotifications() }}
                                                className={`flex flex-row ${shortNav ? 'gap-0 justify-center ' : 'gap-2 justify-start'} items-center hover:bg-gray-700/35 transition-all duration-300 rounded-lg px-3 lg:px-4 py-4 w-full`}
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
                                                <div className={`${shortNav ? 'hidden' : 'block'} text-lg md:text-base lg:text-xl font-medium text-gray-300 hover:text-white text-start`}>
                                                    Profile
                                                </div>
                                            </Link>
                                        </>
                                    }
                                </div>
                            </div>

                            {/* User and Popup */}
                            <div className="relative md:w-full">
                                {user? (
                                    <div
                                        className="flex flex-row gap-4 items-center md:w-full">
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
                                            <p className={`${shortNav ? '' : 'md:block'} hidden px-3 py-2 font-medium text-gray-300 hover:text-white text-start text-lg md:text-base lg:text-xl`}>
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
                                    <div
                                        ref={popupRef}
                                        className="absolute right-0 md:left-3 md:bottom-12 z-20 mt-2 w-48 md:w-56 md:py-2 md:px-3 bg-[#1e1e1e] shadow-lg rounded-lg ring-1 ring-black ring-opacity-5">
                                        <Link
                                            href={`/${user?.username}`}
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

                    {notificationsVisible &&
                        <section
                            className={`notifications hidden md:block max-h-screen absolute left-full top-0 w-[300%] lg:w-[500%] md:w-[400%]  max-w-md h-full transition-all duration-300 bg-black border-r border-r-white/20`}
                        >
                            <div className="shadow-small rounded-lg p-4 md:px-0 w-full max-w-md mx-auto text-center h-full flex flex-col bg-black/30 backdrop-blur-md ">

                                <div className="flex items-center">
                                    <h1 className="text-base md:w-full w-[85%] md:text-2xl font-bold text-center text-white">
                                        Notifications
                                    </h1>
                                </div>

                                <div className="users w-full mt-2 md:mt-4  overflow-y-auto flex flex-col flex-grow">
                                    <p>Notifications are currently unavailable.</p>
                                    {/* {notifications.length > 0 ? (
                                    notifications.map((notification) => (
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
                                    )} */}
                                </div>
                            </div>
                        </section>
                    }

                </nav>
            </div>
            <MobileNav />
        </>
    );
}

export default Navbar;
