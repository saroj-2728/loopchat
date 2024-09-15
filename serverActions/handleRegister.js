"use server"

import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";

export const handleRegister = async (dataObj) => {
    const { username, password } = dataObj;
    console.log(username, password);    
    await connectToDatabase();

    let user = await User.findOne({ username })
    if (!user) {
        return {
            success: false,
            message: "Login Failed!! Incorrect Username Or Password!"
        }
    }
    return {
        success: true,
        message: "Logged In Succssfully!"
    }
}