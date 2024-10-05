"use server"

import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";

export const handleLogin = async (dataObj) => {
    const { username, password } = dataObj;
    // console.log(username, password);

    await connectToDatabase();

    let user = await User.findOne({ username })
    if (!user) {
        return {
            success: false,
            message: "User with this username doesn't exist!"
        }
    }
    if (user.password === password) {
        return {
            success: true,
            message: "Logged In Succssfully!"
        }
    }
    return {
        success: false,
        message: "Incorrect Password! Please Try Again.."
    }
}