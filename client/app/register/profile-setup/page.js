'use client'
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import Loader from "@/components/Loader";
import { usePopup } from "@/context/PopupContext";
import DefaultProfile from "@/utilities/DefaultProfile";

export default function ProfileSetup() {

    const { data } = useSession()
    const user = data?.user;
    const router = useRouter()
    const { showPopup } = usePopup()

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

        setLoading(true)
        const form = new FormData();
        form.append('username', user.username);
        form.append('email', formData.email);
        form.append('bio', formData.bio);
        if (profileImage) {
            form.append('profileImage', profileImage);
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/profile-setup`, {
                method: 'PUT',
                body: form
            });

            const result = await response.json();
            if (result.success) {
                const signInResponse = await signIn('credentials', {
                    redirect: false,
                    ...result.userData,
                    profileImage: JSON.stringify(result.userData.profileImage)
                })
                if (signInResponse?.error) {
                    setLoading(false)
                    showPopup("Profile Updation Failed !", "red")
                    setErrorMessage("Profile Updation Failed: ", signInResponse.error)
                    console.error(("Error Updating Profile: ", signInResponse.error));
                }
                else {
                    showPopup("Profile Updated Successfully !")
                    router.push(`/home`)
                }
            } else {
                setLoading(false)
                setErrorMessage(result.message);
                showPopup("Profile Updation Failed !", "red")
            }
        } catch (err) {
            console.error("Error updating profile:", err);
        }
    };

    useEffect(() => {
        if (user?.oauthProvider) router.back()
    }, [user])


    if (user?.oauthProvider) return (
        <div></div>
    )

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
                                    <span className="text-sm md:text-lg font-bold">{user?.username}</span>
                                    <span className="text-white/60 text-xs md:text-base">{user?.name}</span>
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
                                    disabled={user?.oauthProvider}
                                    type="button"
                                    onClick={() => {
                                        fileInputRef.current.click();
                                    }}
                                    className="px-3 md:px-5 py-2 bg-button-primary hover:bg-button-primary/80 disabled:bg-button-primary/80 rounded-xl text-sm md:text-base font-semibold transition duration-300">
                                    Change Photo
                                </button>
                            </div>
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

                        {errorMessage &&
                            <div className="text-red-500 text-center mt-2">
                                {errorMessage}
                            </div>
                        }

                        {fileSizeError &&
                            <div className="text-red-500 text-center mt-2">
                                {fileSizeError}
                            </div>
                        }

                        <div className="flex flex-col md:flex-row gap-4">
                            <button
                                type="submit"
                                disabled={isSubmitting || user?.oauthProvider}
                                className="w-full  bg-button-primary hover:bg-button-primary/80 disabled:bg-button-primary/80 text-white font-semibold py-3 rounded-lg transition duration-300"
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
