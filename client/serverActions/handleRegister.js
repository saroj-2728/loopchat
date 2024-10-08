"use server"
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";

export const handleRegister = async (dataObj) => {
    const { name, username, password } = dataObj;

    try {
        await connectToDatabase();

        let user = await User.findOne({ username })
        if (user) {
            return {
                success: false,
                message: "User with this username already exists!"
            }
        }
        const newUser = new User({
            name,
            username,
            password
        })
        await newUser.save()
        return {
            success: true,
            message: "Registered Succssfully!"
        }
    }
    catch (err) {
        console.error("Error during registration:", err);
        return {
            success: false,
            message: "Registration failed. Please try again."
        };
    }
}