"use client"
import React from 'react'
import Login_Register from '@/components/Login_Register'
import { handleRegister } from '@/serverActions/handleRegister'

const Register = () => {
  return (
    <>
      <Login_Register component='register' handleData={handleRegister} />
    </>
  )
}

export default Register
