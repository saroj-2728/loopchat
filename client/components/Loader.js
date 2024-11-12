const Loader = ({ size, text }) => {
    return (
        <div className="flex flex-col gap-3 items-center justify-center rounded-lg shadow-small">
            <div className={`loader ${size} border-t-4 border-t-sky-500 rounded-full animate-spin`}></div>
            <p className='text-2xl font-semibold'>{text}</p>
        </div>
    )
}

export default Loader
