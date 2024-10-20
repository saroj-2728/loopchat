"use client"
import React from 'react'
import Login_Register from '@/components/Login_Register'
import { handleLogin } from '@/serverActions/handleLogin'

const Login = () => {
    return (
        <>
            <Login_Register component='login' handleData={handleLogin} />
        </>
    )
}

export default Login
