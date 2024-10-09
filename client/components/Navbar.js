"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useRef, useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/context/userContext';
import profileImage from '@/images/logo.png';

const Navbar = () => {
    const router = useRouter();
    const { user, logout } = useContext(UserContext);
    const [status, setStatus] = useState("loading");
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const popupRef = useRef(null);
    const mobileMenuRef = useRef(null);

    const togglePopup = () => setPopupVisible(!isPopupVisible);
    const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);

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

            if (isMobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('#mobile-menu-button')) {
                setMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPopupVisible, isMobileMenuOpen]);

    const handleLoginClick = () => router.push('/login');
    const navigateToHome = () => router.push(user?.username ? '/home' : '/');

    const handleLogoutClick = () => {
        logout();
        togglePopup();
        router.push('/')
    }

    return (
        <div className="sticky top-0 z-20">
            <nav className="bg-gray-800">
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        {/* Mobile menu button */}
                        <button
                            onClick={toggleMobileMenu}
                            id="mobile-menu-button"
                            className="sm:hidden p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-inset focus:ring-white rounded-full"
                            aria-controls="mobile-menu"
                            aria-expanded={isMobileMenuOpen}>
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <svg className="block h-6 w-6" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            )}
                        </button>

                        {/* Logo */}
                        <div onClick={navigateToHome} className="hidden md:flex cursor-pointer">
                            <Image src={profileImage} width={35} height={35} alt="Chat App Logo" />
                        </div>

                        {/* Desktop Links */}
                        <div className="hidden sm:block">
                            <div className="flex space-x-4">
                                <Link href={user?.username ? `/home` : `/`} className="hover:bg-gray-700 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg">Home</Link>
                                <Link href="/about" className="hover:bg-gray-700 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg">About</Link>
                                <Link href={`/${user?.username}/messages`} className="hover:bg-gray-700 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg">Messages</Link>
                                <Link href="/contact" className="hover:bg-gray-700 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg">Contact</Link>
                            </div>
                        </div>

                        {/* User and Popup */}
                        <div className="relative">
                            {status === "loading" ? (
                                <div className="loader w-8 h-8 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                            ) : status === "loggedIn" ?  (
                                // If user is logged in, show user info
                                <div className="flex gap-4 items-center">
                                    <span>{user?.name}</span>
                                    <button
                                        onClick={togglePopup}
                                        id="user-popup-button"
                                        className="relative flex rounded-full bg-gray-800"
                                    >
                                        <span className="sr-only">Open user menu</span>
                                        <Image src={profileImage} width={35} height={35} alt="Profile" />
                                    </button>
                                </div>
                            ) : (
                                // If no user is logged in, show login button
                                <button
                                    onClick={handleLoginClick}
                                    className="bg-white text-blue-600 font-semibold py-2 px-6 rounded-full shadow-lg hover:bg-gray-200"
                                >
                                    Login
                                </button>
                            )}



                            {isPopupVisible && (
                                <div ref={popupRef} className="absolute right-0 z-10 mt-2 w-48 bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                    <a href="#" onClick={togglePopup} className="block px-4 py-2 text-sm text-gray-700">Your Profile</a>
                                    <a href="#" onClick={togglePopup} className="block px-4 py-2 text-sm text-gray-700">Settings</a>
                                    <p href="#" onClick={handleLogoutClick} className="block px-4 py-2 text-sm text-gray-700 cursor-pointer">Sign out</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div ref={mobileMenuRef} id="mobile-menu" className="absolute top-16 left-0 right-0 bg-gray-800 px-2 pt-2 pb-3 z-10">
                        <Link href={user?.username ? `/home` : `/`} className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white" onClick={toggleMobileMenu}>Home</Link>
                        <Link href="/about" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white" onClick={toggleMobileMenu}>About</Link>
                        <Link href={`/${user?.username}/messages`} className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white" onClick={toggleMobileMenu}>Messages</Link>
                        <Link href="/contact" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white" onClick={toggleMobileMenu}>Contact</Link>
                    </div>
                )}
            </nav>
        </div>
    );
}

export default Navbar;
