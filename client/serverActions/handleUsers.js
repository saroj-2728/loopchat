"use server"
import { User } from '@/models/User'
import connectToDatabase from '@/lib/mongodb'

export const usersArray = async (ins) => {
    await connectToDatabase()
    const usersArray = await User.find().select('name username password _id').lean();
    const usersArraySimplified = usersArray.map(user => ({
        ...user,
        _id: user._id.toString()
    }))
    if (ins === "all")
        return usersArraySimplified;
    const usersName = await User.findOne({ username: ins }).select('name username password _id').lean();
    const usersNameSimplified = {
        ...usersName,
        _id: usersName._id.toString()
    };
    return usersNameSimplified;
}