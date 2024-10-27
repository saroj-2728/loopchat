import connectToDatabase from "../lib/mongodb.js";
import { User } from "../models/User.js"
import { newUserSignUpSocket } from "../sockets/newSignUpSocket.js";

export const handleLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        await connectToDatabase();

        let user = await User.findOne({ username })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User with this username doesn't exist!"
            })
        }
        if (user.password === password) {
            return res.status(200).json({
                success: true,
                userData: {
                    name: user.name,
                    username: user.username
                },
                message: "Logged In Succssfully!"
            })
        }
        return res.status(401).json({
            success: false,
            message: "Incorrect Password! Please Try Again.."
        })
    }
    catch (err) {
        console.error("Error during login:", err);
        return res.status(500).json({
            success: false,
            message: "Login failed. Please try again."
        });
    }
}

export const handleRegister = async (req, res) => {
    const { name, username, password } = req.body;

    try {
        await connectToDatabase();

        let user = await User.findOne({ username })
        if (user) {
            return res.status(401).json({
                success: false,
                message: "User with this username already exists!"
            })
        }
        const newUser = new User({
            name,
            username,
            password
        })
        await newUser.save()

        newUserSignUpSocket()
        return res.status(200).json({
            success: true,
            message: "Registered Succssfully!"
        })
    }
    catch (err) {
        console.error("Error during registration:", err);
        return res.status(500).json({
            success: false,
            message: "Registration failed. Please try again."
        });
    }
}
