"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import connectDatabaseOnLanding from "@/serverActions/connectDatabase";

export default function Home() {

  const router = useRouter();
  const [isLoading, setLoading] = useState(true)

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
  }, [])


  useEffect(() => {
    const delayedAction = async () => {
      if (isLoggedIn()) {
        return router.push('/home');
      }
      return setLoading(false)
    }
    delayedAction()
  }, [router, isLoading]);

  return (
    <>
      <div className='w-full md:min-h-screen min-h-[calc(100vh-64px)] flex items-center justify-center px-4 md:px-0'>
        {isLoading ? (
          <div className="loader w-16 h-16 border-8 border-t-8 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        ) : (
          <div className='max-w-[1440px] md:mt-24 md:mb-24'>
            <section className="flex flex-col items-center text-center bg-gradient-to-r from-sky-500 to-indigo-600 text-white px-6 py-12 md:px-16 md:py-20 rounded-lg shadow-lg">
              <h1 className="text-white text-3xl md:text-5xl font-bold mb-4">Connect Instantly, Chat Effortlessly</h1>
              <p className="text-white text-base md:text-lg mb-6">Real-time messaging, private conversations, and seamless interaction.</p>
              <button onClick={() => { router.push('/login') }} className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-gray-200">
                Get Started
              </button>
            </section>

            <section className="text-center mt-12 md:mt-20">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4 md:mb-6">Start Your Journey with The Next Chat App</h2>
              <p className="text-gray-200 mb-6 md:mb-8 max-w-xl mx-auto text-sm md:text-base">
                Sign up and give it a try.
              </p>
              <button onClick={() => { router.push('/register') }} className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-gray-200">
                Sign Up
              </button>
            </section>
          </div>
        )}
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