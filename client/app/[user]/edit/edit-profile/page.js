"use client";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DefaultProfile from "@/utilities/DefaultProfile";
import { usePopup } from "@/context/PopupContext";
import Loader from "@/components/Loader";
import { useSession } from "@/context/SessionContext";

const ProfileEdit = () => {

    const { profile } = useSession()
    const router = useRouter()
    const { showPopup } = usePopup()

    const [profileImage, setProfileImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState("")
    const [fileSizeError, setFileSizeError] = useState("")
    const [isLoading, setLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState(profile?.profileImage?.url || DefaultProfile());

    const fileInputRef = useRef(null);
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    const onSubmit = async (formData) => {

        setLoading(true)
        const updatedData = new FormData();
        updatedData.append("name", formData.name);
        updatedData.append("username", formData.username);
        updatedData.append("email", formData.email);
        updatedData.append("bio", formData.bio);
        if (profileImage) {
            updatedData.append("profileImage", profileImage);
            updatedData.append("previousPublicId", profile.profileImage?.public_id);
        }

        // try {
        //     const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/${profile.username}/update-profile`, {
        //         method: "PUT",
        //         body: updatedData,
        //     });
        //     const result = await response.json()
        //     if (result.success) {
        //         setUser(result.userData);
        //         showPopup("Profile Updated Successfully !")
        //         router.push(`/${result.userData?.username}`)
        //     } else {
        //         setLoading(false)
        //         setErrorMessage(result.message);
        //         showPopup("Profile Updation Failed !", "red")
        //     }
        // } catch (error) {
        //     console.error("Error updating profile:", error);
        // }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setFileSizeError("")
        if (file && file.size > MAX_FILE_SIZE) {
            setFileSizeError("File size exceeds 5MB. Please select a smaller file.")
            return;
        }
        if (file) {
            setProfileImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center text-white">

            {isLoading ?
                <Loader size={'h-16 w-16'} text={"Please Wait ..."} />
                :
                <div className="max-w-[850px] w-full p-1 md:p-4 rounded-lg shadow-lg">
                    <h1 className="text-xl md:text-3xl text-center font-semibold my-6">
                        Edit Profile
                    </h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="mb-14 rounded-lg p-2 md:p-8 space-y-6">

                        <div className="w-auto flex justify-between items-center bg-accent rounded-3xl md:px-6 px-3 md:py-1">
                            <div className="flex flex-row items-center gap-3 md:gap-5">
                                {imagePreview && (
                                    <div className="my-4 w-14 md:w-[70px] h-14 md:h-[70px] flex justify-center mx-auto">
                                        <Image
                                            src={imagePreview}
                                            width={70}
                                            height={70}
                                            alt="Profile Preview"
                                            className="rounded-full object-cover object-center"
                                        />
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className="text-sm md:text-lg font-bold">{profile?.username}</span>
                                    <span className="text-white/60 text-xs md:text-base">{profile?.name}</span>
                                </div>
                            </div>
                            <div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        fileInputRef.current.click();
                                    }}
                                    className="px-3 md:px-5 py-2 bg-button-primary hover:bg-button-primary/80 rounded-xl text-sm md:text-base font-semibold transition duration-300">
                                    Change Photo
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="block font-bold md:text-xl">Name</label>
                            <input
                                placeholder="Name"
                                type="text"
                                {...register("name", { required: "Name is required" })}
                                className="w-full px-4 py-3 text-sm md:text-lg bg-transparent rounded-xl border border-gray-700 focus:outline-none focus:border-sky-500"
                            />
                            {errors.name &&
                                <p className="text-red-500 text-sm md:text-base">{errors.name.message}</p>
                            }
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="block font-bold md:text-xl">Username</label>
                            <input
                                placeholder="Username"
                                type="text"
                                {...register("username", {
                                    required: "Username is required",
                                    minLength: { value: 3, message: "Username must be at least 3 characters long!" },
                                    validate: {
                                        noSpaces: value => !/\s/g.test(value) || 'No spaces allowed in username',
                                        isLowercase: value => value === value.toLowerCase() || 'Username must be lowercase only'
                                    },
                                })}
                                className="w-full px-4 py-3 text-sm md:text-lg bg-transparent rounded-xl border border-gray-700 focus:outline-none focus:border-sky-500"
                            />
                            {errors.username &&
                                <p className="text-red-500 text-sm md:text-base">{errors.username.message}</p>
                            }
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="block font-bold md:text-xl">Email</label>
                            <input
                                type="email"
                                placeholder="Email"
                                {...register("email", { required: false })}
                                className="w-full px-4 py-3 text-sm md:text-lg bg-transparent rounded-xl border border-gray-700 focus:outline-none focus:border-sky-500"
                            />
                            {errors.email &&
                                <p className="text-red-500 text-sm md:text-base">{errors.email.message}</p>
                            }
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="block font-bold md:text-xl">Bio</label>
                            <textarea
                                placeholder="Bio"
                                rows={5}
                                {...register("bio")}
                                className="w-full px-4 py-3 text-sm md:text-lg bg-transparent rounded-xl border border-gray-700 focus:outline-none focus:border-sky-500"
                            />
                        </div>

                        {fileSizeError &&
                            <div className="text-red-500 text-sm md:text-base text-center my-2">
                                {fileSizeError}
                            </div>
                        }

                        {errorMessage &&
                            <div className="text-red-500 text-center mt-2">
                                {errorMessage}
                            </div>
                        }

                        <div className="flex flex-col md:flex-row gap-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full  bg-button-primary hover:bg-button-primary/80 text-white font-semibold py-3 rounded-lg transition duration-300"
                            >
                                Save Changes
                            </button>
                            <Link
                                href={`/${profile?.username}`}
                                className="w-full text-white text-center font-medium bg-button-secondary hover:bg-button-secondary/90 px-3 md:px-4 py-3 rounded-lg transition duration-300"
                            >
                                Cancel
                            </Link>
                        </div>

                    </form>

                    <div className="md:hidden w-full text-center mb-20">
                        <p>Looking for something else ?</p>
                        <div className="w-full mx-auto flex flex-row py-2 justify-center gap-5">
                            <Link
                                href={`/${profile?.username}/edit/change-password`}
                                className="text-sky-500"
                                >
                                Change Password
                            </Link>
                            <Link
                                href={`/${profile?.username}/edit/delete-profile`}
                                className="text-sky-500"
                                >
                                Delete Profile
                            </Link>
                        </div>
                    </div>

                </div>
            }
        </div>
    );
};

export default ProfileEdit;
