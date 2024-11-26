'use client'
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePopup } from "@/context/PopupContext";
import { reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import Loader from "@/components/Loader";
import { useSession } from "@/context/SessionContext";
import auth from "@/Firebase";
import { FaEye } from "react-icons/fa";

const DeleteProfile = () => {

    const { profile, setProfile, handleSignOut } = useSession();
    const router = useRouter();
    const { showPopup } = usePopup();
    const currentUser = auth.currentUser;

    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    const onSubmit = async (formData) => {
        setErrorMessage("")
        setLoading(true)

        try {
            if (profile?.provider === "password") {
                const credential = EmailAuthProvider.credential(formData.email, formData.password);
                await reauthenticateWithCredential(currentUser, credential);
            }
            
            const token = await currentUser.getIdToken()
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/delete-profile`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    uid: currentUser.uid,
                }),
            });
            const result = await response.json()

            if (result.success) {
                showPopup("Profile Deleted Successfully !")
                handleSignOut()
                setProfile(null)
                router.push(`/`)
            }
            else {
                setLoading(false)
                setErrorMessage(result.message);
                showPopup("Profile Deletion Failed !", "red")
            }
        }
        catch (err) {
            console.error(err);
            if (err.code === "auth/wrong-password") {
                setErrorMessage("Incorrect password. Please try again.");
            }
            else if (err.code === "auth/user-not-found") {
                setErrorMessage("User not found. Please check the email.");
            }
            else {
                setErrorMessage("An unexpected error occurred. Please try again later.");
            }
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center text-white">
            {isLoading ? (
                <Loader size="h-16 w-16" text="Deleting your account, please wait..." />
            ) : (
                <div className="max-w-[600px] w-full p-4 md:p-8 rounded-lg shadow-lg">
                    <h1 className="text-xl md:text-3xl text-center font-semibold my-6">
                        Delete Profile
                    </h1>
                    <p className="md:text-xl text-center my-3">
                        Are you sure you want to delete your account? This action cannot be reversed.
                    </p>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {profile?.provider === "password" &&
                            <>
                                <div className="flex flex-col gap-3">
                                    <label className="block font-bold md:text-xl">Email</label>
                                    <input
                                        placeholder="Email"
                                        type="email"
                                        {...register('email', {
                                            required: (profile?.provider === "password")
                                                ? "Email is required"
                                                : false,
                                            pattern: {
                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                                message: 'Please enter a valid email address',
                                            },
                                        })}
                                        className="w-full px-4 py-3 text-sm md:text-lg bg-transparent rounded-xl border border-gray-700 focus:outline-none  focus:border-red-500"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm md:text-base">{errors.email.message}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-3">
                                    <label className="block font-bold md:text-xl">Password</label>
                                    <div className='relative w-full'>
                                        <input
                                            placeholder="Password"
                                            type={passwordVisible ? "text" : "password"}
                                            {...register("password", {
                                                required: (profile?.provider === "password")
                                                    ? "Password is required"
                                                    : false,
                                                minLength: { value: 8, message: "Password must be at least 8 characters long!" },
                                            })}
                                            className="w-full px-4 py-3 text-sm md:text-lg bg-transparent rounded-xl border border-gray-700 focus:outline-none  focus:border-red-500"
                                        />
                                        <FaEye
                                            onClick={() => setPasswordVisible(!passwordVisible)}
                                            className={`absolute top-1/2 right-[2%] transform -translate-y-1/2 text-gray-500 hover:text-gray-50 hover:bg-gray-800 ${passwordVisible ? "text-red-500 border border-red-500" : ""} transition duration-300 rounded-full p-1 md:p-2 box-content cursor-pointer`}
                                        />
                                    </div>
                                    {errors.password && (
                                        <p className="text-red-500 text-sm md:text-base">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>
                            </>
                        }

                        {errorMessage && (
                            <div className="text-red-500 text-center mt-2">
                                {errorMessage}
                            </div>
                        )}

                        <div className="flex flex-col md:flex-row gap-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition duration-300"
                            >
                                Delete Profile
                            </button>
                            <Link
                                href={`/${profile?.username}`}
                                className="w-full text-white text-center font-medium bg-button-secondary hover:bg-button-secondary/90 px-3 md:px-4 py-3 rounded-lg transition duration-300"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default DeleteProfile;
