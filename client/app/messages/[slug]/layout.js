export default function RootLayout({ children }) {
    return (
        <>
            <div className='md:h-full md:w-full w-screen mx-0 flex items-center justify-center'>
                {children}
            </div>
        </>
    );
}