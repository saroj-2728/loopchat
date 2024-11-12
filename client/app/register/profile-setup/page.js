'use client'
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/userContext";
import Link from "next/link";

export default function ProfileSetup() {

    const { user, setUser } = useContext(UserContext)
    const router = useRouter()
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [errorMessage, setErrorMessage] = useState("")
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file.size > MAX_FILE_SIZE) {
            setErrorMessage("File size exceeds 5MB. Please select a smaller file.")
            return;
        }
        if (file) {
            setProfileImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('username', user.username);
        formData.append('email', email);
        formData.append('bio', bio);
        if (profileImage) {
            formData.append("profileImage", formData.profileImage);
        }
        formData.append('profileImage', profileImage);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/profile-setup`, {
                method: 'PUT',
                body: formData,  // Pass the formData as the request body
            });

            const data = await response.json();
            if (data.success) {
                setUser(data.userData);
                router.push('/home')
            } else {
                console.error("Error:", data.message);
            }
        } catch (err) {
            console.error("Error during profile update:", err);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center px-4">
            <div className="max-w-lg w-full p-4 rounded-lg shadow-lg">
                <h2 className="text-3xl font-semibold text-center text-sky-500 mb-6">
                    Complete Your Profile
                </h2>
                <form onSubmit={handleSubmit} className="rounded-lg md:border md:p-8 border-sky-500/50 space-y-6">
                    <div>
                        <label className="block text-white mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-900 text-gray-200 rounded-lg border border-gray-700 focus:outline-none focus:border-sky-500"
                        />
                    </div>
                    <div>
                        <label className="block text-white mb-1">Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-900 text-gray-200 rounded-lg border border-gray-700 focus:outline-none focus:border-sky-500"
                            rows="4"
                        />
                    </div>
                    <div>
                        <label className="block text-white mb-1">Profile Image</label>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="px-4 py-3 w-full text-white bg-gray-900 rounded-lg"
                            accept="image/*"
                        />
                        {errorMessage &&
                            <div className="text-base text-red-500 my-2">
                                {errorMessage}
                            </div>
                        }
                        {imagePreview && (
                            <div className="mt-4 flex items-center justify-center">
                                <img
                                    src={imagePreview}
                                    alt="Profile Preview"
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-4">
                        <button
                            type="submit"
                            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-lg transition duration-300"
                        >
                            Save Profile
                        </button>
                        <Link
                            href={'/home'}
                            className="w-full text-white text-center font-medium bg-gray-700/70 px-3 md:px-4 py-3 rounded-lg hover:bg-gray-700 transition duration-300"
                        >
                            Skip
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
