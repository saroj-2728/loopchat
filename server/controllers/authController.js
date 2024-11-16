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
                userData: user,
                message: "Log In Successful !"
            });
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
    const { name, username, email, password, bio, profileImage, oauthProvider } = req.body;

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
            email: email || null,
            password: password || null,
            bio: bio || null,
            profileImage: profileImage || { url: null, public_id: null },
            oauthProvider: oauthProvider || null
        })
        await newUser.save()

        newUserSignUpSocket()

        return res.status(200).json({
            success: true,
            userData: {
                name: newUser.name,
                username: newUser.username,
                email: newUser.email || null,
                bio: newUser.bio || null,
                profileImage: newUser.profileImage || null,
                oauthProvider: oauthProvider || null
            },
            message: "Registration Successful !"
        });
    }
    catch (err) {
        console.error("Error during registration:", err);
        return res.status(500).json({
            success: false,
            message: "Registration failed. Please try again."
        });
    }
}


export const handleCheckUser = async (req, res) => {
    const username = req.headers.username; // GitHub username

    try {
        await connectToDatabase();

        const user = await User.findOne({ username });

        if (user) {
            return res.status(200).json({
                success: true,
                message: "User exists",
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "User does not exist",
            });
        }
    } catch (err) {
        console.error("Error checking user:", err);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again.",
        });
    }
};
