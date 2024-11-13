'use client'
import { usePopup } from "@/context/PopupContext"

const Popup = () => {

    const { popup, percentage } = usePopup();
    

    if (!popup.isVisible) return null;  

    return (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 md:transform-none md:top-10 md:right-10 md:left-auto bg-accent rounded-lg w-[60%] md:w-auto p-2">
            <div className="py-2 md:py-3 px-4 md:px-16 w-full text-center text-sm md:text-lg">
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
