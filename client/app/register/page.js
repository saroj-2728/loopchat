"use client"
import React from 'react'
import Login_Register from '@/components/Login_Register'
import { handleRegister } from '@/serverActions/handleRegister'

const register = () => {
  return (
    <>
      <Login_Register redirectTo={'/login'} header={"Register"} handleData={handleRegister} visibility={true} buttonText={"Register"} text1={"Already"} text2={"Login"} theLink={"/login"} laterMessage={"Registered Succesfully!!"} />
    </>
  )
}

export default register
