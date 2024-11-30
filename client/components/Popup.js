'use client'
import { usePopup } from "@/context/PopupContext"

const Popup = () => {

    const { popup, percentage } = usePopup();
    

    if (!popup.isVisible) return null;  

    return (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 md:transform-none md:top-5 md:right-5 md:left-auto bg-white text-black rounded-lg w-[60%] md:w-auto p-1 md:p-2 z-[55]">
            <div className=" px-1 md:px-5 w-full text-center text-sm ">
                <p>{popup.message}</p>
            </div>
            <div
                style={{
                    width: `${percentage}%`,
                    backgroundColor: popup.progressColor
                }}
                className={`h-[3px] rounded-lg`}
            />
        </div>
    )
}

export default Popup
