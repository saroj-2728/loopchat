'use client'
import { useState } from "react";
import { useForm } from "react-hook-form";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { useRouter } from "next/navigation";
import { usePopup } from "@/context/PopupContext";
import { useSession } from "@/context/SessionContext";
import Loader from "@/components/Loader";
import { FaEye } from "react-icons/fa";
import auth from "@/Firebase";

const ChangePassword = () => {
    const { showPopup } = usePopup();
    const { profile } = useSession();
    const router = useRouter();
    const currentUser = auth.currentUser;

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    const onSubmit = async (formData) => {
        setErrorMessage("");
        setIsLoading(true);

        try {
            if (formData.newPassword !== formData.confirmNewPassword) {
                setErrorMessage("Passwords do not match!")
                return;
            }
            const credential = EmailAuthProvider.credential(profile?.email, formData.oldPassword);
            await reauthenticateWithCredential(currentUser, credential);

            await updatePassword(currentUser, formData.newPassword);

            showPopup("Password updated successfully!");
            router.push(`/${profile?.username}`);
        }
        catch (err) {
            console.error(err)
            showPopup("Password Change Failed !", "red")
            if (err.code === "auth/wrong-password") {
                setErrorMessage("Incorrect old password. Please try again.");
            }
            else if (err.code === "auth/user-not-found") {
                setErrorMessage("User not found. Please check the email.");
            }
            else {
                setErrorMessage("An unexpected error occurred. Please try again later.");
            }
        }
        finally {
            setIsLoading(false);
        }
    };

    if (profile?.provider !== "password")
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center text-white">
                <div className="md:text-xl text-center">
                    Oops! It seems like you signed in using {profile?.provider?.split('.')[0]}. <br />
                    Password management is only available for email and password accounts. <br />
                    To manage your account or update your credentials, please visit your {profile?.provider?.split('.')[0]} account settings.
                </div>
            </div>
        )

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center text-white">
            {isLoading ? (
                <Loader size="h-16 w-16" text="Updating password, please wait..." />
            ) : (
                <div className="max-w-[600px] w-full p-4 md:p-8 rounded-lg shadow-lg">
                    <h1 className="text-xl md:text-3xl text-center font-semibold my-6">
                        Change Password
                    </h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex flex-col gap-3">
                            <label className="block font-bold md:text-xl">Old Password</label>
                            <div className="relative w-full">
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    placeholder="Enter old password"
                                    {...register("oldPassword", {
                                        required: "Old password is required",
                                        minLength: { value: 8, message: "Password must be at least 8 characters long!" },
                                    })}
                                    className="w-full px-4 py-3 text-sm md:text-lg bg-transparent rounded-xl border border-gray-700 focus:outline-none focus:border-red-500"
                                />
                                <FaEye
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                    className={`absolute top-1/2 right-[2%] transform -translate-y-1/2 text-gray-500 hover:text-gray-50 hover:bg-gray-800 ${passwordVisible ? "text-red-500 border border-red-500" : ""} transition duration-300 rounded-full p-1 md:p-2 box-content cursor-pointer`}
                                />
                            </div>
                            {errors.oldPassword && (
                                <p className="text-red-500 text-sm md:text-base">{errors.oldPassword.message}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="block font-bold md:text-xl">New Password</label>
                            <div className="relative w-full">
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    placeholder="Enter new password"
                                    {...register("newPassword", {
                                        required: "New password is required",
                                        minLength: { value: 8, message: "Password must be at least 8 characters long!" },
                                    })}
                                    className="w-full px-4 py-3 text-sm md:text-lg bg-transparent rounded-xl border border-gray-700 focus:outline-none focus:border-red-500"
                                />
                                <FaEye
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                    className={`absolute top-1/2 right-[2%] transform -translate-y-1/2 text-gray-500 hover:text-gray-50 hover:bg-gray-800 ${passwordVisible ? "text-red-500 border border-red-500" : ""} transition duration-300 rounded-full p-1 md:p-2 box-content cursor-pointer`}
                                />
                            </div>
                            {errors.newPassword && (
                                <p className="text-red-500 text-sm md:text-base">{errors.newPassword.message}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="block font-bold md:text-xl">Confirm New Password</label>
                            <div className="relative w-full">
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    {...register("confirmNewPassword", {
                                        required: "New password is required",
                                        minLength: { value: 8, message: "Password must be at least 8 characters long!" },
                                    })}
                                    className="w-full px-4 py-3 text-sm md:text-lg bg-transparent rounded-xl border border-gray-700 focus:outline-none focus:border-red-500"
                                />
                                <FaEye
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                    className={`absolute top-1/2 right-[2%] transform -translate-y-1/2 text-gray-500 hover:text-gray-50 hover:bg-gray-800 ${passwordVisible ? "text-red-500 border border-red-500" : ""} transition duration-300 rounded-full p-1 md:p-2 box-content cursor-pointer`}
                                />
                            </div>
                            {errors.confirmNewPassword && (
                                <p className="text-red-500 text-sm md:text-base">{errors.confirmNewPassword.message}</p>
                            )}
                        </div>

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
                                Update Password
                            </button>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="w-full text-white text-center font-medium bg-button-secondary hover:bg-button-secondary/90 px-3 md:px-4 py-3 rounded-lg transition duration-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChangePassword;
