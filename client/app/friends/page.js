'use client'
import { useFriends } from "@/context/FriendContext"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import DefaultProfile from "@/utilities/DefaultProfile"
import Loader from "@/components/Loader"
import { usePopup } from "@/context/PopupContext"

const Friends = () => {

    const {showPopup} = usePopup()
    const { friends } = useFriends()
    const defaultProfileSrc = DefaultProfile()

    const [searchQuery, setSearchQuery] = useState("")
    const [friendDeletionState, setFriendDeletionStates] = useState({});

    const filteredFriends = friends.filter((friend) => {
        return friend?.name.toLowerCase().includes(searchQuery)
    }
    );


    const handleRemoveFriend = async (friendShipId, friendId) => {

        setFriendDeletionStates((prev) => ({
            ...prev,
            [friendShipId]: { loading: true, sent: false },
        }));

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/friends/remove-friend`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    friendShipId
                })
            })
            const result = await response.json()
            if (result.success) {
                showPopup("Friend removed!")
                setFriendDeletionStates((prev) => ({
                    ...prev,
                    [friendShipId]: { loading: false, sent: true },
                }));
            }
            else {
                throw new Error("Failed to remove friend!");
            }

        } catch (error) {
            console.error("Error Removing Friend: ", error);
            showPopup("Couldn't remove friend!", "red");

            setFriendDeletionStates((prev) => ({
                ...prev,
                [friendShipId]: { loading: false, sent: false },
            }));
        }
    }

    return (
        <div className="w-full min-h-screen flex flex-col items-center text-white mb-20">
            {/* Page Title */}
            <div className="w-full">

                <h1 className="text-3xl md:text-4xl text-center font-bold mt-7 mb-2">
                    Friends
                </h1>
            </div>

            {/* Action Bar */}
            <div className="w-full max-w-xl flex flex-col md:flex-row items-center gap-4 px-4 md:px-0 bg-black py-4 sticky top-0">
                <Link
                    href={'friends/make-new-friends'}
                    className="px-3 hidden md:block py-2.5 bg-button-primary hover:bg-button-primary/80 text-white rounded-lg text-sm md:text-base shadow-md transition duration-300"
                >
                    Make New Friends
                </Link>

                <div className="w-full md:w-1/2">
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                        placeholder="Search for a friend"
                        className="w-full px-4 py-3 md:py-2.5 text-sm md:text-base bg-gray-800 rounded-xl border border-gray-700 focus:outline-none focus:ring-1 focus:ring-sky-500 placeholder-gray-400 transition duration-300"
                    />
                </div>
            </div>

            {/* Friends List */}
            <div className="w-full px-4 md:px-0 max-w-xl mt-2 md:mt-4 flex flex-col items-center">

                {filteredFriends.length > 0 ? (
                    filteredFriends.map((friend) => {
                        const { loading, sent } = friendDeletionState[friend?._id] || {};
                        return (
                            <Link
                                href={`/${friend?.username}`}
                                key={friend?.friendShipId}
                                className="w-full bg-gray-800/70 hover:bg-gray-800 rounded-lg shadow-md flex items-center justify-between p-4 transition duration-300 mb-4"
                            >
                                <div className="flex items-center md:gap-4 gap-2">
                                    <div className="flex justify-center items-center h-[40px] md:h-[56px] md:w-[56px] w-[40px]">
                                        <Image
                                            src={friend?.profileImage?.url || defaultProfileSrc}
                                            width={56}
                                            height={56}
                                            className="rounded-full"
                                            alt="User Profile"
                                        />
                                    </div>
                                    <div className="md:text-xl font-medium">{friend?.name}</div>
                                </div>

                                <div className="w-auto">
                                    {sent ? (
                                        <button
                                            disabled
                                            className="md:px-4 px-2 md:py-2 py-1.5 bg-button-secondary text-sm md:text-base font-medium text-white rounded-lg transition duration-300 cursor-not-allowed"
                                        >
                                            Friend Removed
                                        </button>
                                    ) : (loading ?
                                        (
                                            <Loader size={'h-5 w-5'} text={""} shadow="shadow-none" />
                                        ) : (
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleRemoveFriend(friend?.friendShipId, friend._id);
                                                }}
                                                className="md:px-4 px-2 md:py-2 py-1.5 bg-red-600 hover:bg-red-500 text-sm md:text-base font-medium text-white rounded-lg shadow-md transition duration-300"
                                            >
                                                Remove Friend
                                            </button>
                                        )
                                    )}
                                </div>
                            </Link>
                        )
                    })
                ) : (
                    <div className="text-lg md:text-xl text-gray-400 text-center mt-16">
                        {friends.length > 0 ? " No friends match your search." : "You do not have any friends yet."}
                    </div>
                )}

            </div>
        </div>

    )
}

export default Friends
