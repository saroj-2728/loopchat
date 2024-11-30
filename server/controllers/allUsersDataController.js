import connectToDatabase from "../lib/mongodb.js";
import { User } from "../models/User.js";

export const handleALlUsersList = async (req, res) => {
    try {

        await connectToDatabase()
        const usersArray = await User.find().select('name username _id profileImage').lean();

        return res.status(200).json({
            success: true,
            usersArray,
            message: "Users"
        });
    }
    catch (err) {
        console.error("Error Fetching Users:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users."
        });
    }
}