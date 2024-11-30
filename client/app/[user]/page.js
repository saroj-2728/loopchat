"use client"
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import DefaultProfile from '@/utilities/DefaultProfile';
import { useSession } from '@/context/SessionContext';
import { use, useState, useEffect } from 'react';
import Loader from '@/components/Loader';

const UserProfile = ({ params }) => {

    const router = useRouter()
    const { profile } = useSession()
    const unwrappedParams = use(params);

    const [userProfile, setUserProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    const isCurrentUser = profile?.username === unwrappedParams.user;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/get-user`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-username': unwrappedParams.user,
                        },
                    }
                );
                const result = await response.json();

                if (result.success) {
                    setUserProfile(result.userData);
                }
                else {
                    setUserProfile(null)
                }
                setLoading(false)
            }
            catch (error) {
                console.error("Error fetching user profile: ", error)
                setUserProfile(null);
            }
            finally {
                setLoading(false);
            }
        }
        if (profile) {
            if (isCurrentUser) {
                router.push(`/profile/${profile?.username}`)
            }
            else {
                fetchProfile()
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

                        {userProfile ?
                            <>
                                <div className="flex justify-center md:justify-start w-[150px] h-[150px] md:w-auto">
                                    <Image
                                        src={userProfile?.profileImage?.url || defaultProfileSrc}
                                        width={150}
                                        height={150}
                                        alt={`${userProfile?.name}'s profile`}
                                        priority={true}
                                        className="rounded-full object-cover object-center border-2 border-gray-700"
                                    />
                                </div>


                                <div className="text-center md:text-left mt-5 md:mt-0 md:ml-10 flex flex-col gap-3 md:gap-5">

                                    <div className="flex flex-col md:flex-row items-center gap-4 justify-center md:justify-start">
                                        <h2 className="text-xl">
                                            {userProfile?.username}
                                        </h2>
                                    </div>

                                    <div className='text-xl md:text-2xl  font-semibold'>
                                        {userProfile?.name}
                                    </div>

                                    <div className="text-gray-300">
                                        <p>{userProfile?.bio || "No bio available."}</p>
                                    </div>
                                </div>
                            </>
                            :
                            <p className='my-28'>User unavailable</p>
                        }
                    </div>
                )
            }
        </div>
    );
};

export default UserProfile;
