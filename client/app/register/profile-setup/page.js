'use client'
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import Loader from "@/components/Loader";
import { usePopup } from "@/context/PopupContext";
import DefaultProfile from "@/utilities/DefaultProfile";
import { useSession } from "@/context/SessionContext";
import auth from "@/Firebase";

export default function ProfileSetup() {

    const { profile, setProfile } = useSession()
    const router = useRouter()
    const { showPopup } = usePopup()
    const currentUser = auth.currentUser;

    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(DefaultProfile());
    const [errorMessage, setErrorMessage] = useState("")
    const [fileSizeError, setFileSizeError] = useState("")
    const [isLoading, setLoading] = useState(false)

    const fileInputRef = useRef(null);
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

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

    const onSubmit = async (formData) => {
        setErrorMessage("")
        setLoading(true)
        const form = new FormData();
        form.append('uid', profile?.uid);
        form.append('bio', formData.bio);
        if (profileImage) {
            form.append('profileImage', profileImage);
        }

        try {
            const token = await currentUser.getIdToken()
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/profile-setup`, {
                method: 'PUT',
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: form
            });

            const result = await response.json();
            if (result.success) {
                showPopup("Profile Updated Successfully !")
                setProfile(prevData => {
                    return {
                        ...prevData,
                        ...result.updatedData
                    }
                })
                router.push('/home')
            } else {
                setLoading(false)
                setErrorMessage(result.message);
                showPopup("Profile Updation Failed !", "red")
            }
        } catch (err) {
            setLoading(false)
            console.error("Error updating profile:", err);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center text-white">
            {isLoading ?
                <Loader size={'h-16 w-16'} text={"Please Wait ..."} />
                :
                <div className="max-w-4xl w-full p-1 md:p-4 rounded-lg shadow-lg">
                    <h1 className="text-xl md:text-3xl text-center font-semibold my-6">
                        Complete Your Profile
                    </h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="mb-14 rounded-lg p-2 md:p-8 space-y-6">
                        <div className="w-auto flex justify-between items-center bg-accent rounded-3xl md:px-6 px-3">
                            <div className="flex flex-row items-center gap-3 md:gap-5">
                                {imagePreview && (
                                    <div className="my-4 w-14 md:w-20 h-14 md:h-20 flex justify-center mx-auto">
                                        <Image
                                            src={imagePreview}
                                            width={80}
                                            height={80}
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
                            <label className="block font-bold md:text-xl">Email</label>
                            <div className="w-full relative group">
                                <input
                                    type="email"
                                    disabled
                                    value={profile?.email || ""}
                                    className="w-full px-4 py-3 text-sm md:text-lg bg-transparent disabled:bg-gray-950 disabled:text-gray-400 rounded-xl border border-gray-700 focus:outline-none focus:border-sky-500"
                                />
                                <div
                                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-3 md:px-4 py-2 md:py-3 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Email cannot be changed.
                                </div>
                            </div>
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
                                Save Profile
                            </button>
                            <Link
                                href={`/home`}
                                className="w-full text-white text-center font-semibold bg-button-secondary hover:bg-button-secondary/90 px-3 md:px-4 py-3 rounded-lg transition duration-300"
                            >
                                Skip
                            </Link>
                        </div>
                    </form>
                </div>
            }
        </div>
    );
}
