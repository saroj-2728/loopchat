export default function RootLayout({ children }) {
    return (
        <>
            <div className='md:h-[calc(100vh-104px)] h-[calc(100vh-64px)] w-full mx-auto md:rounded-xl md:border flex items-center justify-center border-white p-5 bg-gray-900'>
                {children}
            </div>
        </>
    );
}