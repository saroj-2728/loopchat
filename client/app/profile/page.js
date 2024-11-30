'use client'
import { useSession } from "@/context/SessionContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const Profile = () => {

    const router = useRouter()
    const { profile } = useSession()

    useEffect(() => {
        if (!profile?.username) return;
        router.push(`/profile/${profile?.username}`)
    }, [router, profile?.username])


    return (
        <>

        </>
    )
}

export default Profile
