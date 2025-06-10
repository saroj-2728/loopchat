'use client'
import { usePopup } from "@/context/PopupContext"

import { IoClose } from "react-icons/io5";

const Popup = () => {

    const { popup, percentage, setPopup } = usePopup();

    if (!popup.isVisible) return null;

    return (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 md:transform-none md:top-5 md:right-5 md:left-auto flex flex-row gap-3 bg-gray-900 text-white rounded-lg w-[60%] md:w-auto md:min-w-[18rem] p-1 md:py-3 md:pr-5 md:pl-3 z-[55]">
            <div className="flex items-center justify-center">
                <IoClose
                    onClick={() => setPopup(prev => ({ ...prev, isVisible: false }))}
                    className="size-5 box-content rounded-full hover:bg-gray-700 p-2 text-2xl text-gray-400 cursor-pointer hover:text-gray-200  transition duration-300"
                />
            </div>
            <div className="flex flex-col items-end justify-center flex-1">
                <div className="w-full text-left text-sm">
                    <p>{popup.message}</p>
                </div>
                <div className="w-full">
                    <div
                        style={{
                            width: `${percentage}%`,
                            backgroundColor: popup.progressColor
                        }}
                        className={`h-[3px] rounded-lg mt-2`}
                    />
                </div>
            </div>
        </div>
    )
}

export default Popup
