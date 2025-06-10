'use client'
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "@/context/SessionContext"
import DefaultProfile from "@/utilities/DefaultProfile"
import Loader from "@/components/Loader"
import { usePopup } from "@/context/PopupContext"
import { useFriends } from "@/context/FriendContext"

const MakeFriends = () => {

    const { profile } = useSession()
    const { showPopup } = usePopup()
    const { friends, pendingRequests, isDataReady } = useFriends()

    const defaultProfileSrc = DefaultProfile()

    const [allUsers, setAllUsers] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [friendRequestStates, setFriendRequestStates] = useState({});

    const filteredUsers = allUsers.filter((user) =>
        user?.name.toLowerCase().includes(searchQuery)
    );

    useEffect(() => {
         if (!isDataReady) return;

        const fetchUsers = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    next: { revalidate: 3600 },
                })
                const result = await response.json()

                if (result.success) {
                    const friendsIds = new Set(friends.map(friend => friend._id));
                    const pendingRequestsIds = new Set(pendingRequests.map(request => request._id));

                    const filteredUsers = result.usersArray.filter(user =>
                        !friendsIds.has(user._id) &&
                        !pendingRequestsIds.has(user._id)
                    );

                    setAllUsers(filteredUsers);
                }
                else {
                    setAllUsers([])
                }
            }
            catch (err) {
                console.error("Failed to fetch users: ", err);
            }
        };
        fetchUsers();
    }, [friends, pendingRequests]);


    const handleAddFriend = async (friendId) => {

        setFriendRequestStates((prev) => ({
            ...prev,
            [friendId]: { loading: true, sent: false },
        }));

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/friends/send-friend-request`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    senderId: profile?._id,
                    receiverId: friendId
                })
            })
            const result = await response.json()
            console.log('result: ', result);
            if (result.success) {
                showPopup("Request sent!")
                setFriendRequestStates((prev) => ({
                    ...prev,
                    [friendId]: { loading: false, sent: true },
                }));
            }
            else {
                showPopup("Couldn't send friend request", "red");
                setFriendRequestStates((prev) => ({
                    ...prev,
                    [friendId]: { loading: false, sent: false },
                }));
            }

        }
        catch (error) {
            console.error("Error Sending Friend Request: ", error);
            showPopup("Failed to send friend request!", "red");

            setFriendRequestStates((prev) => ({
                ...prev,
                [friendId]: { loading: false, sent: false },
            }));
        }
    }


    return (
        <div className="w-full min-h-screen flex flex-col items-center text-white mb-20">

            <div className="w-full">

                <h1 className="text-3xl md:text-4xl text-center font-bold mt-7 mb-2">
                    Make new friends
                </h1>
            </div>

            <div className="w-full max-w-xl flex flex-col md:flex-row items-center gap-4 px-4 md:px-0 bg-black py-4 sticky top-0">
                <div className="w-full md:w-1/2">
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                        placeholder="Search"
                        className="w-full px-4 py-3 text-sm md:text-base bg-gray-800 rounded-xl border border-gray-700 focus:outline-none focus:ring-1 focus:ring-sky-500 placeholder-gray-400 transition duration-300"
                    />
                </div>
            </div>


            <div className="w-full px-4 md:px-0 max-w-xl mt-2 md:mt-4 flex flex-col items-center">

                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
                        const { loading, sent } = friendRequestStates[user?._id] || {};
                        if (user?._id === profile?._id) return

                        return (
                            <Link
                                href={`/${user?.username}`}
                                key={user._id}
                                className="w-full bg-gray-800/70 hover:bg-gray-700 rounded-lg shadow-md flex items-center justify-between p-4 transition duration-300 mb-4"
                            >
                                <div className="flex items-center md:gap-4 gap-2">
                                    <div className="flex justify-center items-center h-[40px] md:h-[56px] md:w-[56px] w-[40px]">
                                        <Image
                                            src={user?.profileImage?.url || defaultProfileSrc}
                                            width={56}
                                            height={56}
                                            className="rounded-full"
                                            alt="User Profile"
                                        />
                                    </div>
                                    <div className="md:text-xl font-medium">{user?.name}</div>
                                </div>

                                <div className="h-full flex items-center justify-center">
                                    {sent ? (
                                        <button
                                            disabled
                                            className="md:px-4 px-2 md:py-2 py-1.5 bg-button-secondary text-sm md:text-base font-medium text-white rounded-lg transition duration-300 cursor-not-allowed"
                                        >
                                            Request Sent
                                        </button>
                                    ) : (loading ?
                                        (
                                            <Loader size={'h-5 w-5'} text={""} shadow="shadow-none" />
                                        ) : (
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleAddFriend(user?._id);
                                                }}
                                                className={`md:px-4 px-2 md:py-2 py-1.5 bg-button-primary hover:bg-button-primary/80 text-sm md:text-base font-medium text-white rounded-lg transition duration-300`}
                                            >
                                                Add Friend
                                            </button>
                                        )
                                    )}
                                </div>
                            </Link>
                        )
                    })
                ) : (
                    allUsers.length > 0
                        ?
                        <div className="text-lg md:text-xl text-gray-400 text-center mt-16">
                            No user match your search.
                        </div>
                        :
                        <Loader size={'h-10 w-10'} text={""} />
                )}

            </div>
        </div>

    )
}

export default MakeFriends
