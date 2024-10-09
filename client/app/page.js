"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import connectDatabaseOnLanding from "@/serverActions/connectDatabase";

export default function Home() {

  const router = useRouter();
  const [isLeaving, setIsLeaving] = useState(false)

  const isLoggedIn = () => {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find(cookie => cookie.startsWith(`${"user"}=`));

    const cookieUser = cookie ? decodeURIComponent(cookie.split('=')[1]) : null;

    return cookieUser;
  };

  useEffect(() => {
    const connectDatabase = async () => {
      await connectDatabaseOnLanding()
    }
    connectDatabase()
  }, [process.env.M])


  useEffect(() => {
    const delayedAction = async () => {
      if (isLoggedIn()) {
        setIsLeaving(true)
        await delay(1)
        router.push('/home');
      }
    }
    delayedAction()
  }, [router]);

  return (
    <>
      <div className='w-full h-[calc(100vh-64px)] flex items-center justify-center'>
        {isLeaving ?
          <div className='flex gap-3 flex-col items-center justify-center'>
            <p className='text-green-600 text-3xl'>Logging In!! Please Wait</p>
            <p>This may take a few seconds.</p>
          </div>
          :
          <div className='max-w-[1440px]'>
            <section className="flex flex-col items-center text-center bg-gradient-to-r from-sky-500 to-indigo-600 text-white py-20 px-6 md:px-16 rounded-lg shadow-lg">
              <h1 className="text-white text-5xl font-bold mb-4">Connect Instantly, Chat Effortlessly</h1>
              <p className="text-white text-lg mb-6">Real-time messaging, private conversations, and seamless interaction.</p>
              <button onClick={() => { router.push('/login') }} className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-gray-200">
                Get Started
              </button>
            </section>

            <section className="text-center mt-20">
              <h2 className="text-3xl font-semibold text-sky-600 mb-6">Start Your Journey with The Next Chat App</h2>
              <p className="text-gray-500 mb-8 max-w-xl mx-auto">
                Sign up and give it a try.
              </p>
              <button onClick={() => { router.push('/register') }} className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-gray-200">
                Sign Up
              </button>
            </section>
          </div>
        }
      </div>
    </>
  );
}

const delay = (secs) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1)
    }, secs * 1000);
  })
}