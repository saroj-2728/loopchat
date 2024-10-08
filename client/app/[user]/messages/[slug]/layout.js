export default function RootLayout({ children }) {
    return (
        <>
            <div className='h-[calc(100vh-104px)] w-full mx-auto rounded-xl border flex items-center justify-center border-white p-5 bg-gray-900'>
                {children}
            </div>
        </>
    );
}