"use client";

const Contact = () => {
    return (
        <>
            <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] p-4">
                <div className="flex flex-col items-center justify-center h-full">
                    <h1 className="text-3xl font-bold mb-4 sm:text-4xl">Contact Me</h1>
                    <p className="mb-4 text-base sm:text-lg text-center">Feel free to reach out via the form below or connect with me on social media!</p>

                    <form className="container mx-auto max-w-[480px] bg-white/30 backdrop-blur-lg shadow-lg rounded-xl p-6 sm:p-8">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                Name
                            </label>
                            <input
                                className="shadow appearance-none border rounded-lg w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="name"
                                type="text"
                                placeholder="Your Name"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="shadow appearance-none border rounded-lg w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="email"
                                type="email"
                                placeholder="Your Email"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                                Message
                            </label>
                            <textarea
                                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="message"
                                placeholder="Your Message"
                                rows="4"
                                required
                            ></textarea>
                        </div>
                        <div className="flex items-center justify-center">
                            <button
                                className="bg-white hover:bg-sky-200 transition-colors duration-300 text-blue-600 font-semibold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Send Message
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <h2 className="text-2xl font-bold mb-4">Connect with Me</h2>
                        <div className="flex flex-wrap justify-center space-x-4">
                            <a href="https://twitter.com/yourprofile" target="_blank" rel="noopener noreferrer" className="text-sky-100 font-bold hover:underline hover:text-black transition-all duration-300 ease-in-out">
                                Twitter
                            </a>
                            <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="text-sky-100 font-bold hover:underline hover:text-black transition-all duration-300 ease-in-out">
                                LinkedIn
                            </a>
                            <a href="https://github.com/yourprofile" target="_blank" rel="noopener noreferrer" className="text-sky-100 font-bold hover:underline hover:text-black transition-all duration-300 ease-in-out">
                                GitHub
                            </a>
                            <a href="https://instagram.com/yourprofile" target="_blank" rel="noopener noreferrer" className="text-sky-100 font-bold hover:underline hover:text-black transition-all duration-300 ease-in-out">
                                Instagram
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Contact;
