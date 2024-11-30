"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/public/images/logo.png'
import profileImage from '@/images/logo.png';
import { NavIcons } from '@/utilities/Icons';
import { usePathname } from 'next/navigation';
import DefaultProfile from '@/utilities/DefaultProfile';
import MobileNav from './MobileNav';
import { useSession } from '@/context/SessionContext';
import Notifications from './Notifications';
import { useFriends } from '@/context/FriendContext';

const Navbar = () => {
    const { profile, user, handleSignOut } = useSession()
    const pathname = usePathname()
    const isMessagesPage = pathname.includes('/messages') && user;
    const router = useRouter();
    const { totalNotifications } = useFriends()

    const [isPopupVisible, setPopupVisible] = useState(false);
    const [notificationsVisible, setNotificationsVisible] = useState(false)

    const popupRef = useRef(null);
    const navRef = useRef(null)

    const defaultProfileSrc = DefaultProfile()
    let shortNav = notificationsVisible || isMessagesPage;

    const togglePopup = () => setTimeout(() => {
        setPopupVisible(!isPopupVisible);
    }, 100);
    const toggleNotifications = () => setNotificationsVisible(!notificationsVisible)

    const handleLogoutClick = () => {
        togglePopup();
        handleSignOut()
        router.push('/')
    }

    return (
        <>
            <div className={`z-10 sticky top-0 h-screen hidden md:flex flex-row justify-start ${isMessagesPage ? '' : 'w-1/5'} ${!shortNav ? 'border-r' : ""}  border-r-white/20 max-w-md`}>

                <nav ref={navRef} className={`h-full ${shortNav ? '' : "w-full"} relative`}>

                    <div className={`mx-auto md:mx-0 px-2 lg:px-3 h-full md:w-full ${shortNav ? 'border-r' : ""}  border-r-white/20`}>

                        <div className="relative flex flex-row md:flex-col h-14 md:h-full md:py-20 items-center md:items-start justify-between md:w-full">

                            {/* Logo */}
                            <Link
                                href={profile?.username ? '/home' : '/'}
                                onClick={() => { notificationsVisible && toggleNotifications() }}
                                className={`w-full flex text-base cursor-pointer ${shortNav ? 'justify-center py-3 px-0' : 'justify-start py-1 md:px-3 lg:px-4'}`}
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
                                        href={profile?.username ? `/home` : `/`}
                                        onClick={() => { notificationsVisible && toggleNotifications() }}
                                        className={`flex flex-row ${shortNav ? 'gap-0 justify-center py-3 px-0' : 'gap-2 justify-start py-1 md:px-3 lg:px-4'} items-center hover:bg-gray-700/35 transition-all duration-300 rounded-lg px-3 lg:px-4 py-3 w-full`}
                                    >
                                        <NavIcons.HomeIcon className={`w-4 h-4 md:h-5 md:w-5`} />
                                        <div className={`${shortNav ? 'hidden' : 'block'} ${pathname === '/home' ? 'font-bold text-sky-500' : 'font-medium hover:text-white'} md:text-base text-gray-300  text-start`}>
                                            Home
                                        </div>
                                    </Link>

                                    <Link
                                        href="/about"
                                        onClick={() => { notificationsVisible && toggleNotifications() }}
                                        className={`flex flex-row ${shortNav ? 'gap-0 justify-center py-3 px-0' : 'gap-2 justify-start py-1 md:px-3 lg:px-4'} items-center hover:bg-gray-700/35 transition-all duration-300 rounded-lg px-3 lg:px-4 py-3 w-full`}
                                    >
                                        <NavIcons.AboutIcon className={`w-4 h-4 md:h-5 md:w-5`} />
                                        <div className={`${shortNav ? 'hidden' : 'block'} ${pathname === '/about' ? 'font-bold text-sky-500' : 'font-medium hover:text-white'} md:text-base text-gray-300  text-start`}>
                                            About
                                        </div>
                                    </Link>

                                    {user &&
                                        <>
                                            <Link
                                                href="/messages"
                                                onClick={() => { notificationsVisible && toggleNotifications() }}
                                                className={`flex flex-row ${shortNav ? 'gap-0 justify-center py-3 px-0' : 'gap-2 justify-start py-1 md:px-3 lg:px-4'} items-center hover:bg-gray-700/35 transition-all duration-300 rounded-lg px-3 lg:px-4 py-3 w-full`}
                                            >
                                                <NavIcons.MessageIcon className={`w-4 h-4 md:h-5 md:w-5`} />
                                                <div className={`${shortNav ? 'hidden' : 'block'} ${pathname === '/messages' ? 'font-bold text-sky-500' : 'font-medium hover:text-white'} md:text-base text-gray-300  text-start`}>
                                                    Messages
                                                </div>
                                            </Link>

                                            <Link
                                                href="/friends"
                                                onClick={() => { notificationsVisible && toggleNotifications() }}
                                                className={`flex flex-row ${shortNav ? 'gap-0 justify-center py-3 px-0' : 'gap-2 justify-start py-1 md:px-3 lg:px-4'} items-center hover:bg-gray-700/35 transition-all duration-300 rounded-lg px-3 lg:px-4 py-3 w-full`}
                                            >
                                                <NavIcons.FriendsIcon className={`w-4 h-4 md:h-5 md:w-5`} />
                                                <div className={`${shortNav ? 'hidden' : 'block'} ${pathname === '/friends' ? 'font-bold text-sky-500' : 'font-medium hover:text-white'} md:text-base text-gray-300  text-start`}>
                                                    Friends
                                                </div>
                                            </Link>

                                            <div
                                                onClick={toggleNotifications}
                                                className={`flex flex-row ${shortNav ? 'gap-0 justify-center py-3 px-0' : 'gap-2 justify-start py-1 md:px-3 lg:px-4'} items-center hover:bg-gray-700/35 transition-all duration-300 rounded-lg px-3 lg:px-4 py-3 w-full cursor-pointer`}
                                            >
                                                <div className='w-auto relative'>
                                                    <NavIcons.NotificationIcon className={`w-4 h-4 md:h-5 md:w-5`} />
                                                    {totalNotifications > 0 &&
                                                        <div className='absolute bottom-3 left-3 border bg-red-500 rounded-full w-5 h-5 flex items-center justify-center'>
                                                            {totalNotifications}
                                                        </div>
                                                    }
                                                </div>
                                                <div className={`${shortNav ? 'hidden' : 'block'} font-medium md:text-base text-gray-300 hover:text-white text-start`}>
                                                    Notifications
                                                </div>
                                            </div>

                                            <Link
                                                href={"/profile/" + profile?.username}
                                                onClick={() => { notificationsVisible && toggleNotifications() }}
                                                className={`flex flex-row ${shortNav ? 'gap-0 justify-center py-3 px-0' : 'gap-2 justify-start py-1 md:px-3 lg:px-4'} items-center hover:bg-gray-700/35 transition-all duration-300 rounded-lg px-3 lg:px-4 py-3 w-full`}
                                            >
                                                <div className='flex justify-center md:justify-start h-[20px] w-[20px]'>
                                                    <Image
                                                        src={profile?.profileImage?.url || defaultProfileSrc}
                                                        width={28}
                                                        height={28}
                                                        alt='User Profile'
                                                        className='rounded-full object-cover object-center'
                                                    />
                                                </div>
                                                <div className={`${shortNav ? 'hidden' : 'block'} ${pathname.includes('/profile') ? 'font-bold text-sky-500' : 'font-medium hover:text-white'} md:text-base text-gray-300  text-start`}>
                                                    Profile
                                                </div>
                                            </Link>
                                        </>
                                    }
                                </div>
                            </div>

                            {/* User and Popup */}
                            <div className="relative md:w-full">
                                {user ? (
                                    <div className="flex flex-row gap-4 items-center md:w-full">
                                        <span
                                            className='md:hidden'
                                        >
                                            {profile?.name}
                                        </span>
                                        <button
                                            onClick={togglePopup}
                                            onBlur={() => { if (isPopupVisible) togglePopup() }}
                                            id="user-popup-button"
                                            className={`relative flex rounded-full items-center ${shortNav ? 'justify-center py-3 px-0' : 'justify-start py-1 md:px-3 lg:px-4'}  ${isPopupVisible ? 'bg-gray-700/35' : ''} md:hover:bg-gray-700/35 transition-all duration-300 md:rounded-lg  md:w-full `}
                                        >
                                            <svg
                                                className="hidden md:block w-4 h-4 md:h-5 md:w-5"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                            </svg>
                                            <p className={`${shortNav ? '' : 'md:block'} hidden px-3 py-2 font-medium text-gray-300 hover:text-white text-start text-lg md:text-base`}>
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
                                    <div ref={popupRef} className="absolute right-0 md:left-5 md:bottom-12 z-20 mt-2 w-36 md:w-56 md:py-2 md:px-3 bg-[#1e1e1e] shadow-lg rounded-lg ring-1 ring-black ring-opacity-5">
                                        <Link
                                            href={`/profile/${profile?.username}`}
                                            onClick={togglePopup}
                                            className="block px-4 py-2 rounded-lg text-sm md:text-base text-gray-200 md:hover:bg-gray-700/35">
                                            Your Profile
                                        </Link>
                                        <a
                                            href="#"
                                            onClick={togglePopup}
                                            className="block px-4 py-2 rounded-lg text-sm md:text-base text-gray-200 md:hover:bg-gray-700/35">
                                            Settings
                                        </a>
                                        <p
                                            onClick={handleLogoutClick}
                                            className="block px-4 py-2 rounded-lg text-sm md:text-base text-gray-200 md:hover:bg-gray-700/35 cursor-pointer">
                                            Sign out
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <Notifications notificationsVisible={notificationsVisible} setNotificationsVisible={setNotificationsVisible} />

                </nav>
            </div>
            <MobileNav />
        </>
    );
}

export default Navbar;
