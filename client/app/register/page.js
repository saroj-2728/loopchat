"use client"
import React from 'react'
import Login_Register from '@/components/Login_Register'
import { handleRegister } from '@/serverActions/handleRegister'

const Register = () => {
  return (
    <>
      <Login_Register component='register' redirectTo={'/login'} header={"Register"} handleData={handleRegister} visibility={true} buttonText={"Register"} text1={"Already"} text2={"Login"} theLink={"/login"} laterMessage={"Registered Succesfully!!"} />
    </>
  )
}

export default Register
