"use client"
import Image from 'next/image';
import Link from 'next/link';
import { UserContext } from '@/context/userContext';
import { useContext } from 'react';
import { usePathname } from 'next/navigation';
import DefaultProfile from '@/utilities/DefaultProfile';

const UserProfile = ({ posts }) => {

    const defaultProfileSrc = DefaultProfile()
    const pathname = usePathname()
    const { user } = useContext(UserContext)

    return (
        <div className="w-full flex flex-col items-center justify-center md:justify-start text-white min-h-screen">

            {/* Top Section with Profile Info */}
            <div className="w-full max-w-5xl p-6 flex flex-col md:flex-row items-center md:justify-around">
                {/* Profile Picture */}
                <div className="flex justify-center md:justify-start w-[150px] h-[150px] md:w-auto">
                    <Image
                        src={user?.profileImage?.url || defaultProfileSrc}
                        width={150}
                        height={150}
                        alt={`${user?.name}'s profile`}
                        priority={true}
                        className="rounded-full object-cover object-center border-2 border-gray-700"
                    />
                </div>

                {/* User Info */}
                <div className="text-center md:text-left mt-5 md:mt-0 md:ml-10 flex flex-col gap-3 md:gap-5">
                    {/* Username and Edit Button */}
                    <div className="flex items-center gap-4 justify-center md:justify-start">
                        <h2 className="text-xl">
                            {user?.username}
                        </h2>
                        <Link href={`${pathname}/edit/edit-profile`} className="text-sm  font-medium bg-button-secondary hover:bg-button-secondary/90 px-3 md:px-4 py-1 md:py-2 rounded-md transition duration-150">
                            Edit Profile
                        </Link>
                    </div>
                    <div className='text-xl md:text-2xl  font-semibold'>
                        {user?.name}
                    </div>
                    {/* User Bio */}
                    <div className="text-gray-300">
                        <p>{user?.bio || "No bio available."}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
