import { Friend } from "../models/Friends.js"
import { friendActivitySocket, requestResponseSocket } from "../sockets/friendActivitySocket.js";
import connectToDatabase from "../lib/mongodb.js";

export const handleFriendRequestSent = async (req, res) => {
    const { senderId, receiverId } = req.body;

    try {
        await connectToDatabase()

        const existingRequest = await Friend.findOne({
            $or: [
                { user1: senderId, user2: receiverId },
                { user1: receiverId, user2: senderId },
            ]
        })

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: 'Friend request already exists or users are already friends.'
            });
        }

        const newRequest = new Friend({
            user1: senderId,
            user2: receiverId,
            status: 'pending',
        });
        await newRequest.save();

        friendActivitySocket(senderId, receiverId)

        return res.status(200).json({
            success: true,
            message: 'Friend request sent!'
        });
    }
    catch (error) {
        console.error(error)
        return res.status(200).json({
            success: false,
            message: "An error occured while sending friend request!"
        })
    }
}

export const handleFriendRequestResponse = async (req, res) => {
    const { userId, friendRequestId, response } = req.body;

    try {
        await connectToDatabase()

        const friendRequest = await Friend.findById(friendRequestId).populate("user2", "name");

        if (!friendRequest || friendRequest.user2._id.toString() !== userId) {
            return res.status(404).json({
                success: false,
                message: 'Friend request not found or unauthorized.'
            });
        }

        friendRequest.status = response;
        friendRequest.updatedAt = Date.now();
        await friendRequest.save();

        friendActivitySocket(friendRequest.user1, friendRequest.user2._id)
        requestResponseSocket(friendRequest.user2, friendRequest.user1, response);

        res.status(200).json({
            success: true,
            message: `Friend request ${response}.`
        });
    }
    catch (error) {
        console.error("Error responding to friend request: ", error);
        res.status(500).json({
            success: false,
            message: 'Failed to respond to friend request.'
        });
    }
}

export const handleFriendDeletion = async (req, res) => {
    const { friendShipId } = req.body;

    try {
        await connectToDatabase()

        const deletedFriendship = await Friend.findByIdAndDelete(friendShipId);

        if (!deletedFriendship) {
            return res.status(404).json({
                success: false,
                message: 'Friendship not found or status is not accepted.',
            });
        }

        friendActivitySocket(deletedFriendship.user1, deletedFriendship.user2)

        res.status(200).json({
            success: true,
            message: 'Friend removed.'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to remove friend.'
        });
    }
}

export const handleGetFriends = async (req, res) => {
    const { status, userId } = req.params;

    try {
        await connectToDatabase()

        const friends = await Friend.find({
            status,
            $or: [
                { user1: userId },
                { user2: userId }
            ],
        }).populate('user1 user2', 'name username profileImage');

        res.status(200).json({
            success: true,
            data: friends,
            message: "Friends Fetch Successful!"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch friends.'
        });
    }
}