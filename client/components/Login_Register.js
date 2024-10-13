"use client"
import React, { useState, useRef, useContext } from 'react'
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/context/userContext';

const Login_Register = ({ component, handleData, laterMessage }) => {

    const router = useRouter()
    const [errorMessage, setErrorMessage] = useState("")
    const [isLoading, setLoading] = useState(false)
    const [loggedIn, setloggedIn] = useState(false)
    const ref = useRef();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    const { login } = useContext(UserContext);
    const onSubmit = async (data) => {
        ref.current.reset();
        setLoading(true)

        const result = await handleData(data)

        if (result?.success) {
            setloggedIn(true)
            if (component === 'login') {
                login(result.userData.username, result.userData.name)
            }

            router.push(component === 'login' ? "/home" : "/login");
        } else {
            setLoading(false)
            setErrorMessage(result.message);
        }
    };


    return (
        <div className="relative h-[calc(100vh-64px)] flex justify-center items-center px-4">

            {isLoading ? <div className="loader w-16 h-16 border-8 border-t-8 border-gray-200 border-t-blue-500 rounded-full animate-spin">
            </div>
                :
                <div className="container mx-auto max-w-[480px] bg-[#1e1e1e] backdrop-blur-lg shadow-custom rounded-xl p-6 sm:p-10">

                    <form ref={ref} onSubmit={handleSubmit(onSubmit)} className={`w-full ${!loggedIn ? 'block' : 'hidden'}`}>

                        <h2 className="text-center mb-8 text-2xl sm:text-3xl font-bold text-[#ff7043]">
                            {component === 'login' ? "Login" : "Register"}
                        </h2>

                        {component === 'register' && (
                            <div className="w-full mb-6">
                                <input
                                    name="name"
                                    id="name"
                                    placeholder="Name"
                                    className="w-full py-3 px-6 rounded-full text-lg sm:text-xl bg-[#2c2c2c] text-gray-200 border border-gray-600 focus:outline-none focus:border-blue-500"
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
                                className="w-full py-3 px-6 rounded-full text-lg sm:text-xl bg-[#2c2c2c] text-gray-200 border border-gray-600 focus:outline-none focus:border-blue-500"
                                type="text"
                                {...register("username", {
                                    required: true,
                                    minLength: { value: 3, message: "Username must be at least 3 characters long!" },
                                    validate: value => !/\s/g.test(value) || 'No spaces allowed in username',
                                })}
                            />

                            {errors.username && <div className="text-red-500 text-center mt-2">{errors.username.message}</div>}
                        </div>

                        <div className="w-full mb-6">
                            <input
                                name="password"
                                id="password"
                                placeholder="Password"
                                className="w-full py-3 px-6 rounded-full text-lg sm:text-xl  bg-[#2c2c2c] text-gray-200 border border-gray-600 focus:outline-none focus:border-blue-500"
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

                                <Link href="/" className="text-white hover:underline hover:text-[#ff5722] transition-all duration-300 ease-in-out">Forgot Password?</Link>
                            </div>
                        )}

                        <div className="w-full mb-6">
                            <input
                                className="py-4 w-full text-center rounded-full bg-[#ff7043] hover:bg-[#ff5722] text-white  font-semibold shadow-lg text-lg sm:text-xl cursor-pointer  transition-colors duration-300"
                                disabled={isSubmitting}
                                type="submit"
                                value={component === 'register' ? "Register" : "Login"}
                            />
                        </div>

                        <div className="text-center w-full text-sm sm:text-lg text-white">
                            <p>{component === 'register' ? "Already" : "Don't"} have an account? <Link className="text-sky-100 font-bold hover:underline hover:text-[#ff5722] transition-all duration-300 ease-in-out" href={component === 'register' ? "/login" : "/register"}>{component === 'register' ? "Login" : "Sign Up"}</Link></p>
                        </div>
                    </form>

                    <div className={`loggedIn text-center text-2xl sm:text-3xl ${loggedIn ? 'block' : 'hidden'}`}>
                        {component === 'register' ? "Registered Successfully!!" : "Logged In Successfully!!"}
                    </div>
                </div>}
        </div>

    )
}

export default Login_Register
