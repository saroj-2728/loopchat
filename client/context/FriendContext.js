'use client'
import { createContext, useContext, useState, useEffect } from "react"
import { useSocket } from "./socketContext"
import { useSession } from "./SessionContext"

const FriendContext = createContext()

export const FriendsProvider = ({ children }) => {

    const socketRef = useSocket()
    const { profile } = useSession()

    const [friends, setFriends] = useState([])
    const [pendingRequests, setPendingRequests] = useState([])
    const [notifications, setNotifications] = useState([])
    const [totalNotifications, setTotalNotifications] = useState([])

    useEffect(() => {
        if (!profile?._id) return;

        const fetchFriends = async () => {
            try {

                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/friends/get-friends/accepted/${profile?._id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                const result = await response.json()

                if (result.success) {
                    const processedFriends = result.data.map((friend) => {
                        const friendUser = (friend?.user1?._id === profile?._id) ? friend?.user2 : friend?.user1;
                        return {
                            friendShipId: friend?._id,
                            ...friendUser,
                        }
                    });
                    setFriends(processedFriends)
                }
                else {
                    setFriends([])
                }
            } catch (err) {
                setError("Failed to fetch users.");
                console.error(err);
            }
        };
        fetchFriends();

        const fetchPendingRequests = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/friends/get-friends/pending/${profile?._id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                const result = await response.json()

                if (result.success) {
                    setPendingRequests(result.data)
                }
                else
                    setPendingRequests([])
            } catch (err) {
                console.error(err);
            }
        };
        fetchPendingRequests();

        if (socketRef.current) {
            socketRef.current.on("friendActivityUpdate", () => {
                fetchFriends();
                fetchPendingRequests();
            });

            socketRef.current.on("requestResponse", (data) => {
                setNotifications(prev => {
                    return [
                        ...prev,
                        data
                    ]
                })
            });
        }

        return () => {
            socketRef.current?.off("friendActivityUpdate");
        };
    }, [socketRef.current, profile])

    useEffect(() => {
        let requestsReceived = 0
        for (let obj of pendingRequests) {
            if (obj?.user2?._id === profile?._id)
                requestsReceived++
        }
        setTotalNotifications(requestsReceived + notifications.length)
    }, [pendingRequests, notifications])



    return (
        <FriendContext.Provider value={{ friends, pendingRequests, notifications, totalNotifications, setNotifications }}>
            {children}
        </FriendContext.Provider>
    )
}

export const useFriends = () => {
    return useContext(FriendContext)
}

