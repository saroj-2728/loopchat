"use server"
import { AuthError } from "next-auth"
import { signIn } from "@/auth"

export const credentialsSignIn = async (formData, mode) => {
    
    const response = await fetch(`${process.env.SERVER_URL}/api/auth/${mode}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
    const result = await response.json()

    if (result.success) {
        try {
            await signIn('credentials', {
                redirect: false,
                ...result.userData,
            })
            return {
                success: true,
            } 
        } catch (err) {
            if (err instanceof AuthError) {
                switch (err.type) {
                    case "CredentialsSignin":
                        return {
                            success: false,
                            error: "Invalid Credentials !"
                        }
                    default:
                        return {
                            success: false, 
                            error: "Something went wrong !"
                        }
                }
            }
            throw err;
        }
    } else {
        return {
            success: false,
            error: result.message
        } 
    }
}