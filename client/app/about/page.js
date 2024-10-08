"use client"

const About = () => {
  return (
    <>
      <div className="text-center mb-16 mt-16">
        <h1 className="text-5xl font-bold text-sky-600">Welcome to The Next Chat App</h1>
        <p className="text-lg text-gray-500 mt-4">
          A Private Messaging App made on <a className='text-blue-700' target='_blank' href="https://nextjs.org">Next JS</a> , <a className='text-blue-700' target='_blank' href="https://socket.io">Socket IO</a> and <a className='text-blue-700' target='_blank' href="https://expressjs.com">Express JS</a>
        </p>
        <p className="text-lg text-gray-500 mt-4">And of course <a className='text-blue-700' target='_blank' href="https://tailwindcss.com"> Tailwind CSS </a> for styling.</p>
      </div>

      {/* Features Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-semibold text-center text-sky-500 mb-8">App Features</h2>
        <div className="flex flex-wrap justify-center space-x-6">
          <div className="bg-white shadow-md rounded-lg p-8 max-w-xs mb-8">
            <h3 className="text-xl font-semibold text-sky-600 mb-4">Real-time Messaging</h3>
            <p className="text-gray-500">
              Real-time communication system made on Socket IO.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-8 max-w-xs mb-8">
            <h3 className="text-xl font-semibold text-sky-600 mb-4">User Login System</h3>
            <p className="text-gray-500">
              Users can login and try the private messaging system.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-8 max-w-xs mb-8">
            <h3 className="text-xl font-semibold text-sky-600 mb-4">Route Protection</h3>
            <p className="text-gray-500">
              Route Protection to ensure only the logged in users can access the messaging system.
            </p>
          </div>
        </div>
        <div className='mx-auto text-center text-gray-500'>
          And Many More!!
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <h2 className="text-3xl font-semibold text-sky-600 mb-6">Get Started with ChatApp!</h2>
        <p className="text-gray-500 mb-8">
          Login with your account and Experience the communication on The Next Chat App.
        </p>
      </section>
    </>
  )
}

export default About
