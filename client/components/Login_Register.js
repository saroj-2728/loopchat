"use client"
import React, { useState, useEffect, useRef, Suspense } from 'react'
import { useSession, signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Loader from './Loader';
import { usePopup } from '@/context/PopupContext';
import { FaGithub } from 'react-icons/fa';

function Login_Register_Content({ component }) {

    const router = useRouter()
    const { showPopup } = usePopup()

    const { data } = useSession()
    const user = data?.user;
    const searchParams = useSearchParams()
    const redirected = searchParams.get('redirected')

    const [errorMessage, setErrorMessage] = useState("")
    const [isLoading, setLoading] = useState(false)

    const ref = useRef();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    const handleGitHubSignIn = async () => {
        setLoading(true)
        const signInResponse = await signIn('github', { redirectTo: "/home?githubloginsuccess=true" })
        if (signInResponse?.error) {
            setLoading(false)
            setErrorMessage("Authentication Failed: ", signInResponse.error)
            console.error(("Error During Sign In: ", signInResponse.error));
        }
    }

    const onSubmit = async (data) => {
        ref.current.reset();
        setLoading(true)

        try {
            const apiPath = component === "login" ? "api/auth/login" : "api/auth/register";
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/${apiPath}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            const result = await response.json()

            if (result.success) {
                console.log(result.userData);
                // const signInResponse = await signIn('credentials', {
                //     redirect: false,
                //     ...result.userData,
                //     profileImage: JSON.stringify(result.userData.profileImage)
                // })

                // if (signInResponse?.error) {
                //     setLoading(false)
                //     showPopup(component === 'login' ? "Log In Failed !" : "Sign Up Failed !", "red")
                //     setErrorMessage("Authentication Failed: ", signInResponse.error)
                //     console.error(("Error During Sign In: ", signInResponse.error));
                // }
                // else {
                //     showPopup(component === 'login' ? "Logged In Successfully !" : "Sign Up Successful !")
                // }
            } else {
                setLoading(false)
                setErrorMessage(result.message);
                showPopup(component === 'login' ? "Log In Failed !" : "Sign Up Failed !", "red")
            }
        } catch (err) {
            console.error("Error occured: ", err)
        }

    };

    useEffect(() => {
        if (user && user.oauthProvider) router.push('/home')
        if (user && !user.oauthProvider)
            router.push(component === 'login' ? "/home" : "/register/profile-setup");
    }, [user])


    return (
        <div className="relative min-h-screen flex justify-center items-center px-4 w-full">

            {isLoading ? <Loader size={'h-16 w-16'} text={"Please Wait ..."} />
                :
                <div className='w-full flex flex-col items-center justify-center gap-5'>

                    <div className='md:hidden text-2xl font-bold mb-10'>
                        LoopChat
                    </div>

                    {redirected && (
                        <div className="mb-5 md:mb-8 text-xl sm:text-2xl">
                            Please login to continue
                        </div>
                    )}

                    <div className="container mx-auto max-w-md md:border border-y border-white/20 md:rounded-lg p-6">

                        <form ref={ref} onSubmit={handleSubmit(onSubmit)} className={`w-full`}>

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
                                            isLowercase: value => value === value.toLowerCase() || 'Username must be lowercase only',
                                            noDash: value => !/-/g.test(value) || 'Username cannot contain dashes (-)'
                                        },
                                    })}
                                />

                                {errors.username &&
                                    <div className="text-red-500 text-center mt-2">
                                        {errors.username.message}
                                    </div>
                                }
                            </div>

                            <div className="w-full mb-6">
                                <input
                                    name="password"
                                    id="password"
                                    placeholder="Password"
                                    className="rounded-lg border border-white/20 w-full px-3 py-3 bg-inputField focus:outline-none focus:border-blue-500"
                                    type="password"
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: { value: 8, message: "Password must be at least 8 characters long!" },
                                    })}
                                />

                                {errors.password && <div className="text-red-500 text-center mt-2">{errors.password.message}</div>}

                                {errorMessage && <div className="text-red-500 text-center mt-2">{errorMessage}</div>}
                            </div>

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
                                <div className='w-full'>
                                    <button
                                        type='button'
                                        className='w-full flex flex-row items-center bg-white justify-center gap-5 hover:bg-white/80 text-black text-base md:text-lg transition-colors duration-300 font-semibold py-3 px-5 rounded-lg cursor-pointer'
                                        onClick={handleGitHubSignIn}
                                    >

                                        <FaGithub
                                            className='h-7 w-7'
                                        />
                                        Sign in with Github
                                    </button>
                                </div>
                            </div>

                            {component === "login" &&
                                <div className='w-full flex items-center justify-center mt-4'>
                                    <Link
                                        href={'/'}
                                        className='hover:text-sky-500 transition duration-300'
                                    >
                                        Forgotten your password?
                                    </Link>
                                </div>
                            }
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
