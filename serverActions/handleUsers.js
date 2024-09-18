"use server"
import { User } from '@/models/User'
import connectToDatabase from '@/lib/mongodb'

export const usersArray = async () => {
    await connectToDatabase()
    const usersArray = await User.find().select('name username password _id').lean();
    return usersArray.map(user => ({
        ...user,
        _id: user._id.toString()
    }));
}