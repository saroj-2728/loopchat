const Loader = ({ size, text, shadow = "shadow-small" }) => {
    return (
        <div className="flex flex-col gap-3 items-center justify-center rounded-lg ">
            <div className={`loader ${size} ${shadow} border-t-4 border-t-sky-500 rounded-full animate-spin`}></div>
            {text &&
                <p className='text-base md:text-2xl font-semibold'>{text}</p>
            }
        </div>
    )
}

export default Loader
