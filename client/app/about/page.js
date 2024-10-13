"use client"

const About = () => {
  return (
    <>
      <div className='w-full min-h-screen flex md:items-center md:justify-center'>
        <div className='max-w-[1440px] md:mt-24 md:mb-24'>

          <div className="flex flex-col items-center text-center bg-[#1e1e1e] hover:bg-black transition duration-500 ease-in-out text-white py-12 px-6 md:py-20 md:px-16 rounded-lg shadow-custom mb-10">

            <h1 className="text-3xl md:text-5xl font-bold text-white">
              Welcome to The Next Chat App
            </h1>
            <p className="text-base md:text-lg text-white mt-4">
              A Private Messaging App made on <a className='text-[#38bdf8] hover:text-[#ff7043] transition-all duration-300 ease-in-out' target='_blank' href="https://nextjs.org">
                Next JS
              </a>, <a className='text-[#38bdf8] hover:text-[#ff7043] transition-all duration-300 ease-in-out' target='_blank' href="https://socket.io">
                Socket IO
              </a> and <a className='text-[#38bdf8] hover:text-[#ff7043] transition-all duration-300 ease-in-out' target='_blank' href="https://expressjs.com">
                Express JS
              </a>
              <br />
              And of course <a className='text-[#38bdf8] hover:text-[#ff7043] transition-all duration-300 ease-in-out' target='_blank' href="https://tailwindcss.com">
                Tailwind CSS </a>
              for styling.
            </p>
          </div>

          <section className="mb-6 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-center text-white mb-6 md:mb-8">App Features</h2>

            <div className="flex flex-wrap justify-center md:space-x-6">
              <div className="bg-[#1e1e1e] shadow-lg rounded-lg p-6 md:p-8 max-w-xs mb-6 md:mb-8 transform hover:scale-105 transition duration-300 hover:bg-black hover:shadow-small cursor-pointer group">
                <h3 className="text-lg md:text-xl font-semibold text-[#ff7043] mb-4 transition duration-300 group-hover:text-[#ffab76]">Real-time Messaging</h3>
                <p className="text-sm md:text-base text-gray-400 transition duration-300 group-hover:text-gray-300">
                  Real-time communication system made on Socket IO.
                </p>
              </div>

              <div className="bg-[#1e1e1e] shadow-lg rounded-lg p-6 md:p-8 max-w-xs mb-6 md:mb-8 transform transition duration-300 hover:scale-105 hover:bg-black hover:shadow-small cursor-pointer group">
                <h3 className="text-lg md:text-xl font-semibold text-[#ff7043] mb-4 transition duration-300 group-hover:text-[#ffab76]">User Access Control</h3>
                <p className="text-sm md:text-base text-gray-400 transition duration-300 group-hover:text-gray-300">
                Users can sign in to gain access to the messaging platform.
                </p>
              </div>
            </div>

            <div className='mx-auto text-center text-gray-200'>
              And Many More!!
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4 md:mb-6">Get Started with ChatApp!</h2>
            <p className="text-gray-400 text-sm md:text-base mb-6 md:mb-8">
              Login with your account and Experience the messaging on The Next Chat App.
            </p>
          </section>
        </div>
      </div>
    </>
  )
}

export default About
