"use client"
import React, { useState, useRef, useContext, Suspense } from 'react'
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserContext } from '@/context/userContext';
import Loader from './Loader';

function Login_Register_Content({ component }) {

    const router = useRouter()
    const searchParams = useSearchParams()
    const redirected = searchParams.get('redirected')
    const [errorMessage, setErrorMessage] = useState("")
    const [isLoading, setLoading] = useState(false)
    const [loggedIn, setloggedIn] = useState(false)
    const ref = useRef();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    const { login } = useContext(UserContext);
    const onSubmit = async (data) => {
        ref.current.reset();
        setLoading(true)

        const apiPath = component === "login" ? "api/auth/login" : "api/auth/register";
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/${apiPath}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        const result = await response.json()

        if (result?.success) {
            setloggedIn(true)
            login(result.userData)
            router.push(component === 'login' ? "/home" : "/register/profile-setup");
        } else {
            setLoading(false)
            setErrorMessage(result.message);
        }
    };


    return (
        <div className="relative min-h-screen flex justify-center items-center px-4 w-full">

            {isLoading ? <Loader />
                :
                <div className='w-full flex flex-col items-center justify-center'>
                    {redirected && (
                        <div className="mb-5 md:mb-8 text-xl sm:text-2xl">
                            Please login to continue
                        </div>
                    )}
                    <div className="container mx-auto max-w-[480px] bg-gray-950 border border-sky-500/50 backdrop-blur-lg shadow-custom rounded-xl p-6 sm:p-10">

                        <form ref={ref} onSubmit={handleSubmit(onSubmit)} className={`w-full ${!loggedIn ? 'block' : 'hidden'}`}>

                            <h2 className="text-center mb-8 text-2xl sm:text-3xl font-bold text-sky-500">
                                {component === 'login' ? "Login" : "Register"}
                            </h2>

                            {component === 'register' && (
                                <div className="w-full mb-6">
                                    <input
                                        name="name"
                                        id="name"
                                        placeholder="Name"
                                        className="shadow appearance-none border border-gray-600 rounded-lg w-full py-4 px-3 bg-gray-950 text-gray-200 leading-tight focus:outline-none focus:shadow-outline focus:ring-sky-400 focus:border-blue-500"
                                        type="text"
                                        {...register("name", { required: component === 'register' })}
                                    />
                                </div>
                            )}

                            <div className="w-full mb-6">
                                <input
                                    name="username"
                                    id="username"
                                    placeholder="Username"
                                    className="shadow appearance-none border border-gray-600 rounded-lg w-full py-4 px-3 bg-gray-950 text-gray-200 leading-tight focus:outline-none focus:shadow-outline focus:ring-sky-400 focus:border-blue-500"
                                    type="text"
                                    {...register("username", {
                                        required: true,
                                        minLength: { value: 3, message: "Username must be at least 3 characters long!" },
                                        validate: {
                                            noSpaces: value => !/\s/g.test(value) || 'No spaces allowed in username',
                                            isLowercase: value => value === value.toLowerCase() || 'Username must be lowercase only'
                                        },
                                    })}
                                />

                                {errors.username && <div className="text-red-500 text-center mt-2">{errors.username.message}</div>}
                            </div>

                            <div className="w-full mb-6">
                                <input
                                    name="password"
                                    id="password"
                                    placeholder="Password"
                                    className="shadow appearance-none border border-gray-600 rounded-lg w-full py-4 px-3 bg-gray-950 text-gray-200 leading-tight focus:outline-none focus:shadow-outline focus:ring-sky-400 focus:border-blue-500"
                                    type="password"
                                    {...register("password", {
                                        required: true,
                                        minLength: { value: 8, message: "Password must be at least 8 characters long!" },
                                    })}
                                />

                                {errors.password && <div className="text-red-500 text-center mt-2">{errors.password.message}</div>}

                                {errorMessage && <div className="text-red-500 text-center mt-2">{errorMessage}</div>}
                            </div>

                            {component === 'login' && (
                                <div className="flex justify-between items-center mb-6">

                                    <div className="flex items-center">
                                        <input type="checkbox" id="remember" name="remember" className="mr-2 cursor-pointer" />
                                        <label htmlFor="remember" className="text-white cursor-pointer">Remember Me</label>
                                    </div>

                                    <Link href="/" className="text-white hover:underline hover:text-sky-500 transition-all duration-300 ease-in-out">Forgot Password?</Link>
                                </div>
                            )}

                            <div className="w-full mb-6">
                                <input
                                    className="w-full bg-sky-500 hover:bg-sky-600 text-white text-base md:text-xl transition-colors duration-300 font-semibold py-3.5 px-4 rounded-lg focus:outline-none focus:shadow-outline cursor-pointer"
                                    disabled={isSubmitting}
                                    type="submit"
                                    value={component === 'register' ? "Register" : "Login"}
                                />
                            </div>

                            <div className="text-center w-full text-sm sm:text-lg text-white">
                                <p>{component === 'register' ? "Already" : "Don't"} have an account? { }
                                    <Link
                                        className="text-sky-100 font-bold hover:underline hover:text-sky-500 transition-all duration-300 ease-in-out"
                                        href={component === 'register' ? "/login" : "/register"}>
                                        {component === 'register' ? "Login" : "Sign Up"}
                                    </Link>
                                </p>
                            </div>
                        </form>

                        <div className={`loggedIn text-center text-2xl sm:text-3xl ${loggedIn ? 'block' : 'hidden'}`}>
                            {component === 'register' ? "Registered Successfully!!" : "Logged In Successfully!!"}
                        </div>
                    </div>
                </div>}
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
