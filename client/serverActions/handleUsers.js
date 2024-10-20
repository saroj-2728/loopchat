"use server"
import { User } from '@/models/User'
import connectToDatabase from '@/lib/mongodb'

export const usersArray = async (ins) => {
    await connectToDatabase()
    const usersArray = await User.find().select('name username _id').lean();
    const usersArraySimplified = usersArray.map(user => ({
        ...user,
        _id: user._id.toString()
    }))
    return usersArraySimplified;
}