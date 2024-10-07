export default function RootLayout({ children }) {
    return (
        <>
            <div className='h-[calc(100vh-104px)] w-full mx-auto rounded-xl border-2 flex items-center justify-center border-white p-5'>
                {children}
            </div>
        </>
    );
}