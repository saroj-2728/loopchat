'use client'
import { createContext, useContext, useState, useEffect } from 'react';

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
    const [popup, setPopup] = useState({
        isVisible: false,
        message: '',
        progressColor: 'rgb(74, 222, 128)'
    });

    const [percentage, setPercentage] = useState(0);

    const showPopup = (message, progressColor = 'rgb(74, 222, 128)') => {
        setPercentage(0);
        setPopup({ isVisible: true, message, progressColor });
    };

    useEffect(() => {
        if (popup.isVisible) {
            const intervalId = setInterval(() => {
                setPercentage((prevPercentage) => {
                    if (prevPercentage < 100) {
                        return prevPercentage + 1;
                    } else {
                        clearInterval(intervalId);
                        setPopup((prev) => ({ ...prev, isVisible: false }));
                        return prevPercentage;
                    }
                });
            }, 30);

            return () => clearInterval(intervalId);
        }
    }, [popup.isVisible]);

    return (
        <PopupContext.Provider value={{ popup, showPopup, percentage }}>
            {children}
        </PopupContext.Provider>
    );
};

export const usePopup = () => useContext(PopupContext);
