"use client"
import React, { useState, useRef, useContext } from 'react'
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/context/userContext';

const Login_Register = ({ component, handleData, laterMessage }) => {

    const router = useRouter()
    const [errorMessage, setErrorMessage] = useState("")
    const [loggedIn, setloggedIn] = useState(false)
    const ref = useRef();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    const errorStyle = {
        color: "red",
        textAlign: "center",
        marginTop: "10px"
    }

    const { setUser } = useContext(UserContext);
    const onSubmit = async (data) => {
        // console.log(data);
        ref.current.reset();

        const result = await handleData(data)

        if (result?.success) {
            setloggedIn(true)
            if (component === 'login') {
                const loggedInUser = {
                    name: result.userData.name,
                    username: result.userData.username
                };
                setUser(loggedInUser);
                const setCookie = (name, value, days) => {
                    const expires = new Date(Date.now() + days * 864e5).toUTCString();
                    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
                };
                setCookie('user', JSON.stringify(loggedInUser), 7);
            }

            await delay(1)
            router.push(component === 'login' ? "/home" : "/login");
        } else {
            setErrorMessage(result.message);
        }
    };

    const delay = (seconds) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, seconds * 1000);
        })
    }

    return (
        <div className="relative h-[calc(100vh-64px)] flex justify-center items-center bg-gradient-to-br from-blue-400 to-blue-600">
            <div className="container mx-auto max-w-[480px] bg-white/30 backdrop-blur-lg shadow-lg rounded-xl p-10">
                <form ref={ref} onSubmit={handleSubmit(onSubmit)} className={`w-full ${!loggedIn ? 'block' : 'hidden'}`}>
                    <h2 className="text-center mb-8 text-3xl font-bold text-white">{component === 'login' ? "Login" : "Register"}</h2>

                    <div>
                        {component === 'register' && (
                            <div className="w-full mb-6">
                                <input
                                    name="name"
                                    id="name"
                                    placeholder="Name"
                                    className="w-full py-3 px-6 rounded-full text-xl bg-white/80 text-gray-700 border border-gray-300 focus:outline-none focus:border-blue-500"
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
                                className="w-full py-3 px-6 rounded-full text-xl bg-white/80 text-gray-700 border border-gray-300 focus:outline-none focus:border-blue-500"
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
                                className="w-full py-3 px-6 rounded-full text-xl bg-white/80 text-gray-700 border border-gray-300 focus:outline-none focus:border-blue-500"
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
                                    <input type="checkbox" id="remember" name="remember" className="mr-2" />
                                    <label htmlFor="remember" className="text-white">Remember Me</label>
                                </div>
                                <Link href="/" className="text-white hover:underline hover:text-black transition-all duration-300 ease-in-out">Forgot Password?</Link>
                            </div>
                        )}

                        <div className="w-full mb-6">
                            <input
                                className='py-4 w-full text-center rounded-full bg-white text-blue-600 font-semibold shadow-lg text-xl cursor-pointer hover:bg-sky-200 transition-colors duration-300'
                                disabled={isSubmitting}
                                type="submit"
                                value={component === 'register' ? "Register" : "Login"}
                            />
                        </div>

                        <div className="text-center w-full text-lg text-white">
                            <p>{component === 'register' ? "Already" : "Don't"} have an account? <Link className="text-sky-100 font-bold hover:underline hover:text-black transition-all duration-300 ease-in-out" href={component === 'register' ? "/login" : "/register"}>{component === 'register' ? "Login" : "Sign Up"}</Link></p>
                        </div>
                    </div>
                </form>

                <div className={`loggedIn text-center text-3xl ${loggedIn ? 'block' : 'hidden'}`}>
                    {component === 'register' ? "Registered Successfully!!" : "Logged In Successfully!!"}
                </div>
            </div>
        </div>
    )
}

export default Login_Register
