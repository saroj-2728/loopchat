"use client";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { UserContext } from "@/context/userContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DefaultProfile from "@/utilities/DefaultProfile";

const ProfileEdit = () => {

    const router = useRouter()
    const { user, setUser } = useContext(UserContext);
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(user?.profileImage?.url || DefaultProfile);
    const [errorMessage, setErrorMessage] = useState("")
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            name: user?.name || "",
            username: user?.username || "",
            email: user?.email || "",
            bio: user?.bio || ""
        }
    });

    const onSubmit = async (formData) => {

        const updatedData = new FormData();
        updatedData.append("name", formData.name);
        updatedData.append("username", formData.username);
        updatedData.append("email", formData.email);
        updatedData.append("bio", formData.bio);
        if (profileImage) {
            updatedData.append("profileImage", profileImage);
            updatedData.append("previousPublicId", user.profileImage?.public_id);
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/${user.username}/update-profile`, {
                method: "PUT",
                body: updatedData,
            });
            const result = await response.json()
            if (result.success) {
                const updatedUser = result.userData;
                setUser(updatedUser);
                router.push(`/${updatedUser?.username}`)
            } else {
                alert("Failed to update profile. Please try again.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

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

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center text-white">
            <div className="max-w-xl w-full p-4 rounded-lg shadow-lg">
                <h1 className="text-3xl text-center text-sky-500 font-semibold my-6">Edit Profile</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="mb-14 rounded-lg md:border p-2 md:p-8 border-sky-500/50 space-y-6">
                    <div>
                        <label className="block mb-1">Name</label>
                        <input
                            type="text"
                            {...register("name", { required: "Name is required" })}
                            className="w-full px-4 py-3 bg-gray-900 text-gray-200 rounded-lg border border-gray-700 focus:outline-none focus:border-sky-500"
                        />
                        {errors.name && <p className="text-red-500 text-sm md:text-base mt-2">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block mb-1">Username</label>
                        <input
                            type="text"
                            {...register("username", {
                                required: "Username is required",
                                minLength: { value: 3, message: "Username must be at least 3 characters long!" },
                                validate: {
                                    noSpaces: value => !/\s/g.test(value) || 'No spaces allowed in username',
                                    isLowercase: value => value === value.toLowerCase() || 'Username must be lowercase only'
                                },
                            })}
                            className="w-full px-4 py-3 bg-gray-900 text-gray-200 rounded-lg border border-gray-700 focus:outline-none focus:border-sky-500"
                        />
                        {errors.username && <p className="text-red-500 text-sm md:text-base mt-2">{errors.username.message}</p>}
                    </div>

                    <div>
                        <label className="block mb-1">Email</label>
                        <input
                            type="email"
                            {...register("email", { required: false })}
                            className="w-full px-4 py-3 bg-gray-900 text-gray-200 rounded-lg border border-gray-700 focus:outline-none focus:border-sky-500"
                        />
                        {errors.email && <p className="text-red-500 text-sm md:text-base mt-2">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block mb-1">Bio</label>
                        <textarea
                            rows={5}
                            {...register("bio")}
                            className="w-full px-4 py-3 bg-gray-900 text-gray-200 rounded-lg border border-gray-700 focus:outline-none focus:border-sky-500"
                        />
                    </div>

                    <div className="flex flex-col mb-4">
                        <label className="block text-white mb-1">Profile Image</label>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="w-full px-4 py-3 text-white bg-gray-900 rounded-lg"
                            accept="image/*"
                        />
                        {errorMessage &&
                            <div className="text-red-500 text-sm md:text-base my-2">
                                {errorMessage}
                            </div>
                        }
                        {imagePreview && (
                            <div className="mt-4 w-24 h-24 flex justify-center mx-auto">
                                <Image
                                    src={imagePreview}
                                    width={96}
                                    height={96}
                                    alt="Profile Preview"
                                    className="rounded-full object-cover object-center"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-lg transition duration-300"
                        >
                            Save Changes
                        </button>
                        <Link
                            href={`/${user?.username}`}
                            className="w-full text-white text-center font-medium bg-gray-700/70 px-3 md:px-4 py-3 rounded-lg hover:bg-gray-700 transition duration-300"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileEdit;
