export default function RootLayout({ children }) {
    return (
        <>
            <div className='md:h-auto  md:w-full w-screen mx-auto md:rounded-xl md:border-none flex items-center justify-center border-white  md:p-0 p-2'>
                {children}
            </div>
        </>
    );
}