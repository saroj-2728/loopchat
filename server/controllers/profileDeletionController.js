import connectToDatabase from "../lib/mongodb.js";
import { User } from "../models/User.js";
import admin from '../firebaseConfig.js'

export const handleDeleteProfile = async (req, res) => {
    const { uid } = req.body;

    try {
        await connectToDatabase()

        let user = await User.findOne({ uid })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        try {
            await admin.auth().deleteUser(uid);
            console.log(`User with UID: ${uid} deleted from Firebase.`);
        }
        catch (err) {
            console.error("Error deleting Firebase user:", err);
            return res.status(500).json({
                success: false,
                message: "Failed to delete the user from Firebase.",
            });
        }

        try {
            await User.deleteOne({ uid });
        } 
        catch (err) {
            console.error("Error deleting user from database:", err);
            return res.status(500).json({
                success: false,
                message: "Failed to delete the user from the database.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully!",
        });

    }
    catch (err) {
        console.error("Error during deletion: ", err)
        return res.status(500).json({
            success: false,
            message: "An Error Occured. Please Try Again !"
        });
    }
}