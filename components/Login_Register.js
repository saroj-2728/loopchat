"use client"
import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Login_Register = ({redirectTo, header, handleData, visibility, buttonText, text1, text2, theLink, laterMessage }) => {

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

    const onSubmit = async (data) => {
        // console.log(data);
        ref.current.reset();

        const result = await handleData(data)

        if (result.success) {
            // If login successful, redirect to home page
            setloggedIn(true)
            await delay(1)
            router.push(redirectTo);
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
        <div className="relative h-screen">

            <div className='container mx-auto max-w-[480px] absolute inset-0 flex items-center justify-center'>

                <form ref={ref} onSubmit={handleSubmit(onSubmit)} className={`px-8 w-full md:border-2 border-y border-white md:rounded-xl ${!loggedIn ? 'block' : 'hidden'}`}>
                    <h2 className='text-center my-8 text-3xl font-bold'>{header}</h2>
                    <div>
                        <div className={`w-full mt-9 ${visibility ? "block" : "hidden"}`}>
                            <input name='name' id='name' placeholder='Name' className="w-full  py-3.5 rounded-full text-black text-xl px-8" type="text" {...register("name", { required: visibility })} />
                        </div>
                        <div className='w-full mt-9'>
                            <input name='username' id='username' placeholder='Username' className="w-full  py-3.5 rounded-full text-black text-xl px-8" type="text" {...register("username", { required: true, minLength: { value: 3, message: "Username must be at least 3 characters long!" }, validate: value => !/\s/g.test(value) || 'No spaces allowed in username' })} />
                            {errors.username && <div style={errorStyle}>
                                {errors.username.message}
                            </div>}
                        </div>
                        <div className='w-full mt-9'>
                            <input name='password' id='password' placeholder='Password' className='w-full py-3.5 rounded-full text-black text-xl px-8' type="password" {...register("password", { required: true, minLength: { value: 8, message: "Password must be at least 8 characters long!" }, })} />
                            {errors.password && <div style={errorStyle}>
                                {errors.password.message}
                            </div>}
                            {errorMessage && <div style={errorStyle}>{errorMessage}</div>}
                        </div>
                        <div className={`remember-forget my-6  flex-row justify-between items-center text-lg ${visibility ? "hidden" : "flex"}`}>
                            <div className="remember cursor-pointer">
                                <input type="checkbox" id="remember" name="remember" className='me-2 cursor-pointer' />
                                <label className='text-lg cursor-pointer' htmlFor="remember">Remember Me</label>
                            </div>
                            <div className="forget">
                                <Link href="/"> Forgot Password </Link>
                            </div>
                        </div>
                        <div className='w-full my-6'>
                            <input className='py-3.5 border-2 w-full text-center rounded-full text-xl cursor-pointer' disabled={isSubmitting} type="submit" value={buttonText} />
                        </div>
                        <div className="register text-center w-full my-6 text-lg">
                            <p>{text1} have an account? <Link className='font-bold' href={theLink}> {text2} </Link></p>
                        </div>
                    </div>

                </form>

                <div className={`loggedIn text-center text-3xl text-green-500 ${loggedIn ? 'block' : 'hidden'}`}>
                    {laterMessage}
                </div>
            </div>

        </div>
    )
}

export default Login_Register
