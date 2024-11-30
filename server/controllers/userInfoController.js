import connectToDatabase from "../lib/mongodb.js";
import mongoose from "mongoose";
import admin from '../firebaseConfig.js'
import { User } from "../models/User.js"
import { usersChangeSocket } from "../sockets/newSignUpSocket.js";

export const handleGetUser = async (req, res) => {
    const uid = req.headers['x-uid'];
    const username = req.headers['x-username'];

    try {
        await connectToDatabase();

        const user = await User.findOne({
            $or: [
                { uid: uid || null },
                { username: username || null }
            ]
        })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            userData: user,
            message: "User Data"
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

export const handleUserCreation = async (req, res) => {
    const { uid, email, username, name, emailVerified, provider, photoURL } = req.body;

    try {
        await connectToDatabase();

        let user = await User.findOne({ username })
        if (user) {
            try {
                await admin.auth().deleteUser(uid);
                console.log(`User with UID: ${uid} deleted from Firebase.`);
            }
            catch (err) {
                console.error("Error deleting Firebase user:", err);
            }
            return res.status(401).json({
                success: false,
                message: "User with this username already exists!"
            })
        }

        const newUser = new User({
            uid,
            name,
            username,
            email,
            provider,
            emailVerified,
            profileImage: {
                url: photoURL || null, public_id: null
            }
        })
        await newUser.save()

        usersChangeSocket()

        return res.status(200).json({
            success: true,
            userData: newUser,
            message: "User created successfully!"
        });
    }
    catch (err) {
        if (err instanceof mongoose.Error) {
            console.error("Database error during registration:", err);

            try {
                await admin.auth().deleteUser(uid);
                console.log(`User with UID: ${uid} deleted from Firebase due to DB error.`);
            } catch (firebaseError) {
                console.error("Error deleting Firebase user:", firebaseError);
            }

            return res.status(500).json({
                success: false,
                message: "Database error occurred. Please try again."
            });
        }
        else {
            console.error("Error during registration:", err);
            return res.status(500).json({
                success: false,
                message: "Registration failed. Please try again."
            });
        }
    }
}
