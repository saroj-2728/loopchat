import { User } from '../models/User.js';
import connectToDatabase from '../lib/mongodb.js';
import cloudinary from 'cloudinary';

export const handleProfileUpdate = async (req, res) => {

    const { uid, name, username, bio, previousPublicId } = req.body;
    const profileImage = req.file;

    try {
        await connectToDatabase()
        const user = await User.findOne({ uid })

        if (!user)
            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        if (username !== user.username) {
            const usernameExists = await User.findOne({ username });
            if (usernameExists) {
                return res.status(400).json({
                    success: false,
                    message: "Username is already taken",
                });
            }
        }

        user.name = name;
        user.username = username;
        user.bio = bio || "";

        if (profileImage) {
            if (previousPublicId)
                await cloudinary.v2.uploader.destroy(previousPublicId);

            const uploadPromise = new Promise((resolve, reject) => {
                const stream = cloudinary.v2.uploader.upload_stream(
                    {
                        folder: 'chat_app_profiles',
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );

                stream.end(profileImage.buffer);
            });

            try {
                const uploadedImage = await uploadPromise;
                user.profileImage = {
                    url: uploadedImage.secure_url,
                    public_id: uploadedImage.public_id,
                };
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error uploading profile image!',
                });
            }
        }

        await user.save();

        return res.status(200).json({
            success: true,
            updatedData: {
                name: user.name,
                username: user.username,
                bio: user?.bio,
                profileImage: user.profileImage,
            },
            message: "Profile updated successfully!"
        });

    } catch (err) {
        console.error("Error updating user profile:", err);
        return res.status(500).json({
            success: false,
            message: "Profile update failed. Please try again."
        });
    }
};
