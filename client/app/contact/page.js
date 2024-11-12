"use client";

const Contact = () => {
    return (
        <>
            <div className="w-full min-h-screen flex items-center justify-center px-4 md:px-0">
                <div className="flex flex-col items-center justify-center md:mt-10 md:mb-10">

                    <h1 className="text-3xl text-sky-500 font-bold mb-4 sm:text-4xl">Contact Me</h1>
                    <p className="mb-4 text-base sm:text-lg text-center">Feel free to reach out via the form below or connect with me on social media!</p>

                    <form className="container mx-auto max-w-[480px] bg-gray-950 border border-sky-500/50 backdrop-blur-lg shadow-custom rounded-xl p-6 sm:p-8">
                        <div className="mb-4">
                            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="name">
                                Name
                            </label>
                            <input
                                className="shadow appearance-none border border-gray-600 rounded-lg w-full py-3 px-3 bg-gray-950 text-gray-200 leading-tight focus:outline-none focus:shadow-outline focus:ring-sky-400 focus:border-blue-500"
                                id="name"
                                type="text"
                                placeholder="Your Name"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="shadow appearance-none border border-gray-600 rounded-lg w-full py-3 px-3 bg-gray-950 text-gray-200 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                                id="email"
                                type="email"
                                placeholder="Your Email"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="message">
                                Message
                            </label>
                            <textarea
                                className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 bg-gray-950 text-gray-200 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                                id="message"
                                placeholder="Your Message"
                                rows="4"
                                required
                            ></textarea>
                        </div>
                        <div className="flex items-center justify-center">
                            <button
                                className="bg-sky-500 hover:bg-sky-600 text-white transition-colors duration-300 font-semibold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Send Message
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <h2 className="text-2xl font-bold mb-4">Connect with Me</h2>
                        <div className="flex flex-wrap justify-center space-x-4">
                            <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="text-sky-400 font-bold hover:underline hover:text-sky-600 transition-all duration-300 ease-in-out">
                                X
                            </a>
                            <a href="https://www.linkedin.com/in/saroj27/" target="_blank" rel="noopener noreferrer" className="text-sky-400 font-bold hover:underline hover:text-sky-600 transition-all duration-300 ease-in-out">
                                LinkedIn
                            </a>
                            <a href="https://github.com/saroj-2728" target="_blank" rel="noopener noreferrer" className="text-sky-400 font-bold hover:underline hover:text-sky-600 transition-all duration-300 ease-in-out">
                                GitHub
                            </a>
                            <a href="https://instagram.com/_._.saroj._._" target="_blank" rel="noopener noreferrer" className="text-sky-400 font-bold hover:underline hover:text-sky-600 transition-all duration-300 ease-in-out">
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
