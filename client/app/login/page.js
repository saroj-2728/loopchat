"use client"
import React from 'react'
import Login_Register from '@/components/Login_Register'
import { handleLogin } from '@/serverActions/handleLogin'

const Login = () => {
    return (
        <>
            <Login_Register component='login' redirectTo={'/home'} header={"Login"} handleData={handleLogin} visibility={false} buttonText={"Login"} text1={"Don't"} text2={"Sign Up"} theLink={"/register"} laterMessage={"Logged In Succesfully!!"} />
        </>
    )
}

export default Login
