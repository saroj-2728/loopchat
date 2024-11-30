"use client"
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import DefaultProfile from '@/utilities/DefaultProfile';
import { useSession } from '@/context/SessionContext';
import { use, useState, useEffect } from 'react';
import Loader from '@/components/Loader';

const UserProfile = ({ params }) => {

    const router = useRouter()
    const { profile } = useSession()
    const unwrappedParams = use(params);

    const [loading, setLoading] = useState(true)

    const isCurrentUser = profile?.username === unwrappedParams.user;

    useEffect(() => {
        if (profile) {
            if (!isCurrentUser) {
                router.push(`/${unwrappedParams.user}`);
            } else {
                setLoading(false);
            }
        }
    }, [isCurrentUser, unwrappedParams.user, profile, router]);

    const defaultProfileSrc = DefaultProfile()
    const pathname = usePathname()

    return (
        <div className="w-full flex flex-col items-center justify-center md:justify-start text-white min-h-screen">

            {loading ?
                (<div className='my-28'>
                    <Loader
                        size={'h-8 w-8'} text={''}
                    />
                </div>
                )
                :
                (
                    <div className="w-full max-w-5xl p-6 flex flex-col md:flex-row items-center md:justify-around">

                        <div className="flex justify-center md:justify-start w-[150px] h-[150px] md:w-auto">
                            <Image
                                src={profile?.profileImage?.url || defaultProfileSrc}
                                width={150}
                                height={150}
                                alt={`${profile?.name}'s profile`}
                                priority={true}
                                className="rounded-full object-cover object-center border-2 border-gray-700"
                            />
                        </div>


                        <div className="text-center md:text-left mt-5 md:mt-0 md:ml-10 flex flex-col gap-3 md:gap-5">

                            <div className="flex flex-col md:flex-row items-center gap-4 justify-center md:justify-start">
                                <h2 className="text-xl">
                                    {profile?.username}
                                </h2>

                                <div className='flex flex-row items-center gap-4'>
                                    <Link href={`${pathname}/edit/edit-profile`} className="text-sm  font-medium bg-button-secondary hover:bg-button-secondary/90 px-3 md:px-4 py-1 md:py-2 rounded-md transition duration-150">
                                        Edit Profile
                                    </Link>
                                    <Link href={`/friends`} className="text-sm  font-medium bg-button-secondary hover:bg-button-secondary/90 px-3 md:px-4 py-1 md:py-2 rounded-md transition duration-150">
                                        Friends
                                    </Link>
                                </div>

                            </div>
                            <div className='text-xl md:text-2xl  font-semibold'>
                                {profile?.name}
                            </div>

                            <div className="text-gray-300">
                                <p>{profile?.bio || "No bio available."}</p>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default UserProfile;
