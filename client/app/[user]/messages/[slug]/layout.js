export default function RootLayout({ children }) {
    return (
        <>
            <div className='md:h-[calc(100vh-104px)] h-[calc(100dvh-64px)] w-full mx-auto md:rounded-xl md:border flex items-center justify-center border-white md:p-5 p-2 bg-gray-900'>
                {children}
            </div>
        </>
    );
}