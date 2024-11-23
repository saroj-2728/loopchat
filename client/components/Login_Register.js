"use client"
import React, { useState, useRef, Suspense } from 'react'
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Loader from './Loader';
import { usePopup } from '@/context/PopupContext';
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from 'react-icons/fa';
import { useSession } from '@/context/SessionContext';
import { redirect } from 'next/navigation';
import { FaEye } from "react-icons/fa";

function Login_Register_Content({ component }) {

    const { profile, user, signInWithEmail, signUpWithEmail, signInWithGithub, signInWithGoogle } = useSession()

    const router = useRouter()
    const searchParams = useSearchParams()

    const { showPopup } = usePopup()
    const continueTo = searchParams.get('continueTo')

    const [errorMessage, setErrorMessage] = useState("")
    const [isLoading, setLoading] = useState(false)
    const [loggedIn, setloggedIn] = useState(false)
    const [passwordVisible, setPasswordVisible] = useState(false);

    const ref = useRef();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    const googleSignIn = async () => {
        setLoading(true)
        const result = await signInWithGoogle()
        if (result.success) {
            showPopup("Signed In With Google!")
            router.push(continueTo || '/home')
        }
        else {
            showPopup("Sign In Failed!", "red")
            setLoading(false)
            setErrorMessage(result.message)
        }
    }
    const githubSignIn = async () => {
        setLoading(true)
        const result = await signInWithGithub()
        if (result.success) {
            showPopup("Signed In With Github!")
            router.push(continueTo || '/home')
        }
        else {
            showPopup("Sign In Failed!", "red")
            setLoading(false)
            setErrorMessage(result.message)
        }
    }
    const onSubmit = async (data) => {
        ref.current.reset();
        setLoading(true)
        let result;
        if (component === "login") {
            result = await signInWithEmail(data)
        }
        else {
            result = await signUpWithEmail(data)
        }
        if (result.success) {
            showPopup(component === "login" ? "Signed In" : "Signed Up" + " Successfully!")
            router.push(continueTo || '/home')
        }
        else {
            showPopup(`Sign ${component === 'login' ? "In" : "Up"} Failed!`, "red")
            setLoading(false)
            setErrorMessage(result.message)
        }
    };

    if (user?.uid) redirect('/home')

    return (
        <div className="relative min-h-screen flex justify-center items-center px-4 w-full">

            {isLoading ? <Loader size={'h-16 w-16'} text={"Please Wait ..."} />
                :
                <div className='w-full flex flex-col items-center justify-center gap-5 my-20'>
                    <div className='md:hidden text-2xl font-bold mb-10'>
                        LoopChat
                    </div>

                    {continueTo && (
                        <div className="mb-5 md:mb-8 text-xl sm:text-2xl">
                            Please login to continue
                        </div>
                    )}

                    <div className="container mx-auto max-w-md md:border border-y border-white/20 md:rounded-lg p-6">

                        <form ref={ref} onSubmit={handleSubmit(onSubmit)} className={`w-full ${!loggedIn ? 'block' : 'hidden'}`}>

                            <h2 className="text-center mb-8 text-xl sm:text-2xl font-bold">
                                {component === 'login' ? "Login" : "Create New Account"}
                            </h2>

                            {component === 'register' && (
                                <div className="w-full mb-6">
                                    <input
                                        name="name"
                                        id="name"
                                        placeholder="Name"
                                        className="rounded-lg border border-white/20 w-full px-3 py-3 bg-inputField focus:outline-none focus:border-blue-500"
                                        type="text"
                                        {...register("name", { required: component === 'register' ? "Name is required" : false })}
                                    />

                                    {errors.name &&
                                        <div className="text-red-500 text-center mt-2">
                                            {errors.name.message}
                                        </div>
                                    }
                                </div>
                            )}

                            {component === "register" &&
                                <div className="w-full mb-6">
                                    <input
                                        name="username"
                                        id="username"
                                        placeholder="Username"
                                        className="rounded-lg border border-white/20 w-full px-3 py-3 bg-inputField focus:outline-none focus:border-blue-500"
                                        type="text"
                                        {...register("username", {
                                            required: "Username is required",
                                            minLength: { value: 3, message: "Username must be at least 3 characters long!" },
                                            validate: {
                                                noSpaces: value => !/\s/g.test(value) || 'No spaces allowed in username',
                                                isLowercase: value => value === value.toLowerCase() || 'Username must be lowercase only'
                                            },
                                        })}
                                    />

                                    {errors.username &&
                                        <div className="text-red-500 text-center mt-2">
                                            {errors.username.message}
                                        </div>
                                    }
                                </div>
                            }

                            <div className="w-full mb-6">
                                <input
                                    name="email"
                                    id="email"
                                    placeholder="Email"
                                    className="rounded-lg border border-white/20 w-full px-3 py-3 bg-inputField focus:outline-none focus:border-blue-500"
                                    type="email"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                            message: 'Please enter a valid email address',
                                        },
                                    })}
                                />

                                {errors.email &&
                                    <div className="text-red-500 text-center mt-2">
                                        {errors.email.message}
                                    </div>
                                }
                            </div>

                            <div className="w-full mb-6">
                                <div className='relative w-full'>
                                <input
                                    name="password"
                                    id="password"
                                    placeholder="Password"
                                    className="rounded-lg border border-white/20 w-full px-3 py-3 bg-inputField focus:outline-none focus:border-blue-500"
                                    type={passwordVisible ? "text" : "password"}
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: { value: 8, message: "Password must be at least 8 characters long!" },
                                    })}
                                />

                                <FaEye
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                    className={`absolute top-1/2 right-[2%] transform -translate-y-1/2 text-gray-500 hover:text-gray-50 hover:bg-gray-800 ${passwordVisible? "text-blue-500 border border-blue-500": ""} transition duration-300 rounded-full p-1 md:p-2 box-content cursor-pointer`}
                                />
                                </div>

                                {errors.password && <div className="text-red-500 text-center mt-2">{errors.password.message}</div>}
                            </div>

                            {errorMessage &&
                                <div className="text-red-500 text-center my-2">
                                    {errorMessage}
                                </div>
                            }

                            <div className="w-full mb-6">
                                <input
                                    className="w-full bg-button-primary hover:bg-button-primary/90 text-white text-base md:text-xl transition-colors duration-300 font-semibold py-3.5 px-4 rounded-lg cursor-pointer"
                                    disabled={isSubmitting}
                                    type="submit"
                                    value={component === 'register' ? "Sign Up" : "Login"}
                                />
                            </div>




                            <div className='w-full flex flex-col gap-4'>
                                <div className='flex flex-row items-center justify-center'>
                                    <div className='w-2/5 border border-white/20' />
                                    <p className='w-1/5 text-center text-white/60'>OR</p>
                                    <div className='w-2/5 border border-white/20' />
                                </div>
                                <div className='w-full my-3 flex flex-col gap-4'>
                                    <div className='w-full'>
                                        <button
                                            className='w-full flex items-center justify-center gap-5 transition duration-300 py-3 bg-white hover:bg-white/80 text-black rounded-lg text-lg font-semibold'
                                            type='button'
                                            onClick={googleSignIn}
                                        >
                                            <FcGoogle
                                                className='md:w-8 md:h-8 h-7 w-7'
                                            />
                                            <div>Sign In With Google</div>
                                        </button>
                                    </div>

                                    <div className='w-full'>
                                        <button
                                            className='w-full flex items-center justify-center gap-5 transition duration-300 py-3 bg-white hover:bg-white/80 text-black rounded-lg text-lg font-semibold'
                                            type='button'
                                            onClick={githubSignIn}
                                        >
                                            <FaGithub
                                                className='md:w-8 md:h-8 h-7 w-7'
                                            />
                                            <div>Sign In With GitHub</div>
                                        </button>
                                    </div>
                                </div>
                                {component === "login" &&
                                    <div className='w-full flex items-center justify-center'>
                                        <Link
                                            href={'/'}
                                            className='hover:text-sky-500 transition duration-300'
                                        >
                                            Forgotten your password?
                                        </Link>
                                    </div>
                                }
                            </div>
                        </form>
                    </div>

                    <div className="container mx-auto max-w-md md:border border-t border-white/20 md:rounded-lg p-6 sm:p-10">
                        <div className="text-center w-full text-sm sm:text-lg text-white">
                            <p>{component === 'register' ? "Have" : "Don't have"} an account? { }
                                <Link
                                    className="text-sky-100 font-bold hover:underline hover:text-sky-500 transition-all duration-300 ease-in-out"
                                    href={component === 'register' ? "/login" : "/register"}>
                                    {component === 'register' ? "Login" : "Sign Up"}
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            }
        </div>

    )
}

const Login_Register = ({ component }) => {

    return (
        <Suspense>
            <Login_Register_Content component={component} />
        </Suspense>
    )

}

export default Login_Register;
