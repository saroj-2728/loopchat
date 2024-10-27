import connectToDatabase from "../lib/mongodb.js";
import { User } from "../models/User.js";

export const handleUsersList = async (req,res) => {
    try {
        
        await connectToDatabase()
        const usersArray = await User.find().select('name username _id').lean();
        const usersArraySimplified = usersArray.map(user => ({
            ...user,
            _id: user._id.toString()
        }))
        return res.status(200).json(usersArraySimplified);
    } 
    catch (err) {
        console.error("Error Fetching Users:", err);
        return res.status(500).json({});
    }
}