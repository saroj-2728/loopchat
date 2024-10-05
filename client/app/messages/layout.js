export default function RootLayout({ children }) {
    return (
        <>
            <div className='max-w-[1024px] mx-auto rounded-xl mt-5 pb-5 h-[95vh] relative flex flex-col'>
                {children}
            </div>
        </>
    );
}

