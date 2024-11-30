'use client'
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "@/context/SessionContext"
import { useFriends } from "@/context/FriendContext";
import Loader from "./Loader";
import DefaultProfile from "@/utilities/DefaultProfile";
import { usePopup } from "@/context/PopupContext";
import { RxCross1 } from "react-icons/rx";

const Notifications = ({ notificationsVisible, setNotificationsVisible }) => {

    const { profile } = useSession()
    const { pendingRequests, notifications, setNotifications } = useFriends()
    const { showPopup } = usePopup()

    const defaultProfileSrc = DefaultProfile()

    const [friendRequestStates, setFriendRequestStates] = useState({});

    const handleNotificationsDeletion = (friendId) => {
        setNotifications(prev => {
            return prev.filter((notification) => notification?.responseFrom?._id !== friendId);
        })
    }

    const handleDeletRequest = async (requestId) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/friends/respond-friend-request`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: profile?._id,
                    friendRequestId: requestId,
                    response: "rejected"
                })
            })
            const result = await response.json()

            if (result.success) {
                showPopup("Request deleted!")
            }
            else {
                throw new Error("Failed to delete request");
            }

        }
        catch (error) {
            console.error("Error Deleting Friend Request: ", error);
            showPopup("Couldn't delete friend request!", "red");
        }
    }

    const handleAcceptFriend = async (requestId) => {
        setFriendRequestStates((prev) => ({
            ...prev,
            [requestId]: { loading: true, accepted: false },
        }));
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/friends/respond-friend-request`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: profile?._id,
                    friendRequestId: requestId,
                    response: "accepted"
                })
            })
            const result = await response.json()

            if (result.success) {
                showPopup("Request accepted!")
                setFriendRequestStates((prev) => ({
                    ...prev,
                    [requestId]: { loading: false, sent: true },
                }));
            }
            else {
                throw new Error("Failed to accept request");
            }

        }
        catch (error) {
            console.error("Error Accepting Friend Request: ", error);
            showPopup("Couldn't accept friend request!", "red");

            setFriendRequestStates((prev) => ({
                ...prev,
                [requestId]: { loading: false, sent: false },
            }));
        }
    }

    if (!notificationsVisible) return null;

    return (
        <>
            <section
                className={`notifications hidden md:block absolute left-full top-0 w-[300%] md:w-[500%]  max-w-md h-full transition-all duration-300 bg-black border-r border-r-white/20`}
            >
                <div className="shadow-small rounded-lg p-4 md:px-0 w-full max-w-md mx-auto text-center h-full flex flex-col bg-black/30 backdrop-blur-md ">

                    <div className="flex items-center">
                        <h1 className="text-base md:w-full w-[85%] md:text-2xl font-bold text-center text-white">
                            Notifications
                        </h1>
                    </div>

                    <div className="users w-full mt-2 md:mt-4  overflow-y-auto flex flex-col flex-grow">


                        <div>
                            {
                                notifications?.length > 0 ?
                                    notifications.map((notification, index) => {
                                        return (
                                            <div
                                                className="w-full flex flex-row items-center justify-between py-5 px-7 border-y border-white/10"
                                                key={index}
                                            >
                                                <p>
                                                    {notification?.responseFrom?.name} {notification?.response} your friend request.
                                                </p>
                                                <RxCross1
                                                className="p-1 hover:bg-gray-600 box-content rounded-full cursor-pointer"
                                                    onClick={() => handleNotificationsDeletion(notification?.responseFrom?._id)}
                                                />
                                            </div>
                                        )
                                    })
                                    :
                                    (
                                        "No new notifications"
                                    )
                            }
                        </div>

                        <div className="w-full mt-10 mb-5 border-b border-white/10">
                            <p className='text-start mb-3 px-6 font-semibold'>
                                Friend Requests
                            </p>
                        </div>

                        {pendingRequests?.length > 0 ? (
                            pendingRequests.map((request) => {

                                const { loading, sent } = friendRequestStates[request?._id] || {};
                                if (request?.user2?._id !== profile?._id) return;

                                return (
                                    <Link
                                        href={`/${request?.user1?.username}`}
                                        onClick={() => setNotificationsVisible(!notificationsVisible)}
                                        key={request?._id}
                                        className={`w-full border-y border-y-white/5 py-2 cursor-pointer transition duration-300  text-white flex flex-row items-center justify-between gap-4 md:px-4 px-1`}
                                    >
                                        <div className='flex flex-row gap-2 items-center'>
                                            <div className="flex justify-center h-[50px] w-[50px]">
                                                <Image
                                                    src={request?.user1?.profileImage?.url || defaultProfileSrc}
                                                    width={56}
                                                    height={56}
                                                    className="rounded-full"
                                                    alt="User Profile"
                                                />
                                            </div>
                                            <div className="text-base flex flex-row gap-3">
                                                {`${request?.user1?.name}`}
                                            </div>
                                        </div>
                                        <div className='flex flex-row items-center gap-2'>
                                            {sent ? (
                                                <button
                                                    disabled
                                                    className='px-3 py-1 bg-button-secondary rounded-lg'
                                                >
                                                    Accepted
                                                </button>
                                            ) : (loading ?
                                                (
                                                    <Loader size={'h-5 w-5'} text={""} shadow="shadow-none" />
                                                ) : (
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleAcceptFriend(request?._id, request?.user1?._id);
                                                        }}
                                                        className='px-3 py-1 bg-button-primary hover:bg-button-primary/80 rounded-lg'
                                                    >
                                                        Accept
                                                    </button>
                                                )
                                            )}

                                            {!sent &&
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleDeletRequest(request?.user1?._id);
                                                    }}
                                                    className='px-3 py-1 bg-button-secondary hover:bg-button-secondary/60 rounded-lg'
                                                >
                                                    Delete
                                                </button>
                                            }
                                        </div>
                                    </Link>
                                )
                            })
                        )
                            :
                            (
                                "No friend requests at the moment."
                            )}
                    </div>
                </div>
            </section>
        </>
    )
}

export default Notifications
