"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

export default function Home() {

  const router = useRouter();
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn) {
      router.push('/home');
    } else {
      setLoading(false);
    }
  }, [router]);

  return (
    <>
      <div className='w-full md:min-h-screen min-h-[calc(100vh-64px)] flex items-center justify-center px-4 md:px-0'>
        {isLoading ? (<Loader size={'h-16 w-16'} text={"Please Wait ..."}/>) : (
          <div className='max-w-[1440px] md:mt-24 md:mb-24'>

            <section className="flex flex-col items-center text-center transition-all duration-500 ease-in-out text-white px-6 py-6 md:px-16 md:py-10 rounded-lg shadow-custom">

              <h1 className="text-white text-3xl md:text-5xl font-bold mb-4">
                Connect Instantly, Chat Effortlessly
              </h1>
              <p className="text-white text-base md:text-lg mb-6">
                Real-time messaging, private conversations, and seamless interaction.
              </p>

              <button onClick={() => { router.push('/login') }} className="bg-button-primary hover:bg-button-primary/80 text-white font-semibold py-3 px-12 rounded-lg shadow-lg transition duration-300">
                Get Started
              </button>
            </section>

            <section className="flex flex-col items-center text-center transition-all duration-500 ease-in-out text-white px-6 py-6 md:px-16 md:py-10 rounded-lg shadow-custom">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4 md:mb-6">
                Start Your Journey with LoopChat
              </h2>
              <p className="text-gray-200 mb-6 md:mb-8 max-w-xl mx-auto text-sm md:text-base">
                Sign up and give it a try.
              </p>
              <button onClick={() => { router.push('/register') }} className="bg-white hover:bg-white/80 text-black font-semibold py-3 px-12 rounded-lg shadow-lg transition duration-300">
                Sign Up
              </button>
            </section>
          </div>
        )}
      </div>

    </>
  );
}
