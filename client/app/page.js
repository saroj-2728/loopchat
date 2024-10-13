"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
        {isLoading ? (
          <div className="loader w-16 h-16 border-8 border-t-8 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        ) : (
          <div className='max-w-[1440px] md:mt-24 md:mb-24'>

            <section className="flex flex-col items-center text-center bg-[#1e1e1e] hover:bg-black transition-all duration-500 ease-in-out text-white px-6 py-12 md:px-16 md:py-20 rounded-lg shadow-custom">

              <h1 className="text-white text-3xl md:text-5xl font-bold mb-4">
                Connect Instantly, Chat Effortlessly
              </h1>
              <p className="text-white text-base md:text-lg mb-6">
                Real-time messaging, private conversations, and seamless interaction.
              </p>

              <button onClick={() => { router.push('/login') }} className="bg-[#ff7043] hover:bg-[#ff5722] text-white font-semibold py-3 px-6 rounded-full shadow-lg transition duration-300">
                Get Started
              </button>
            </section>

            <section className="text-center mt-12 md:mt-20">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4 md:mb-6">
                Start Your Journey with The Next Chat App
              </h2>
              <p className="text-gray-200 mb-6 md:mb-8 max-w-xl mx-auto text-sm md:text-base">
                Sign up and give it a try.
              </p>
              <button onClick={() => { router.push('/register') }} className="bg-[#ffccbc] hover:bg-[#ffb6a0] text-[#121212] font-semibold py-3 px-6 rounded-full shadow-lg transition duration-300">
                Sign Up
              </button>
            </section>
          </div>
        )}
      </div>

    </>
  );
}
