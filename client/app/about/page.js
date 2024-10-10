"use client"

const About = () => {
  return (
    <>
      <div className='w-full min-h-screen flex md:items-center md:justify-center'>
        <div className='max-w-[1440px] md:mt-24 md:mb-24'>
          <div className="flex flex-col items-center text-center bg-gradient-to-r from-sky-500 to-indigo-600 text-white py-12 px-6 md:py-20 md:px-16 rounded-lg shadow-lg mb-10">
            <h1 className="text-3xl md:text-5xl font-bold text-white">Welcome to The Next Chat App</h1>
            <p className="text-base md:text-lg text-white mt-4">
              A Private Messaging App made on <a className='text-sky-400 hover:text-black transition-all duration-300 ease-in-out' target='_blank' href="https://nextjs.org">Next JS</a> , <a className='text-sky-400 hover:text-black transition-all duration-300 ease-in-out' target='_blank' href="https://socket.io">Socket IO</a> and <a className='text-sky-400 hover:text-black transition-all duration-300 ease-in-out' target='_blank' href="https://expressjs.com">Express JS</a>
              <br />
              And of course <a className='text-sky-400 hover:text-black transition-all duration-300 ease-in-out' target='_blank' href="https://tailwindcss.com"> Tailwind CSS </a> for styling.
            </p>
          </div>

          <section className="mb-6 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-center text-white mb-6 md:mb-8">App Features</h2>
            <div className="flex flex-wrap justify-center md:space-x-6">
              <div className="bg-white shadow-md rounded-lg p-6 md:p-8 max-w-xs mb-6 md:mb-8">
                <h3 className="text-lg md:text-xl font-semibold text-sky-600 mb-4">Real-time Messaging</h3>
                <p className="text-sm md:text-base text-gray-500">
                  Real-time communication system made on Socket IO.
                </p>
              </div>
              <div className="bg-white shadow-md rounded-lg p-6 md:p-8 max-w-xs mb-6 md:mb-8">
                <h3 className="text-lg md:text-xl font-semibold text-sky-600 mb-4">User Login System</h3>
                <p className="text-sm md:text-base text-gray-500">
                  Users can login and try the private messaging system.
                </p>
              </div>
              <div className="bg-white shadow-md rounded-lg p-6 md:p-8 max-w-xs mb-6 md:mb-8">
                <h3 className="text-lg md:text-xl font-semibold text-sky-600 mb-4">Route Protection</h3>
                <p className="text-sm md:text-base text-gray-500">
                  Route Protection to ensure only the logged-in users can access the messaging system.
                </p>
              </div>
            </div>
            <div className='mx-auto text-center text-gray-200'>
              And Many More!!
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4 md:mb-6">Get Started with ChatApp!</h2>
            <p className="text-gray-200 text-sm md:text-base mb-6 md:mb-8">
              Login with your account and Experience the messaging on The Next Chat App.
            </p>
          </section>
        </div>
      </div>
    </>
  )
}

export default About
