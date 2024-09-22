export default function RootLayout({ children }) {
    return (
        <>
            <div className='max-w-[1024px] mx-auto rounded-xl my-5 pb-5 h-[95vh] relative flex flex-col'>
                <div className='text-3xl font-bold text-center py-5 border-2  rounded-t-xl border-white'>
                    Chat App
                </div>
                {children}
            </div>
        </>
    );
}

