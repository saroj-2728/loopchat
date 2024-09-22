export default function RootLayout({ children }) {
    return (
        <>
            <div className='h-[93%] w-full mx-auto rounded-b-xl border-2 border-t-0 flex-grow flex items-center justify-center border-white p-5'>
                {children}
            </div>
        </>
    );
}

// 