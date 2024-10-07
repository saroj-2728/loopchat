"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const isLoggedIn = () => {
    return localStorage.getItem("user") !== null;
  };

  useEffect(() => {
    if (isLoggedIn()) {
      // router.push('/home');
    } else {
      // router.push('/login');
    }
  }, [router]);

  return (
    <div className='w-full h-[calc(100vh-64px)] flex items-center justify-center'>
      <div className='text-green-600 text-3xl'>
        Checking Login Status!!
      </div>
    </div>
  );
}

