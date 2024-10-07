"use client";
import React, { createContext, useEffect, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const [user, setUser] = useState(null);

      // Helper function to set cookies
    const setCookie = (name, value, days) => {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
    };

    // Helper function to get cookie
    const getCookie = (name) => {
        const cookies = document.cookie.split('; ');
        const cookie = cookies.find(cookie => cookie.startsWith(`${name}=`));
        return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
    };

    // Load user from cookies or localStorage when the app starts (only once)
    useEffect(() => {
        const savedUser = getCookie('user') || localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    // Save user to localStorage and cookies whenever user changes (only if valid user)
    useEffect(() => {
        if (user && user.name && user.username) {
            localStorage.setItem('user', JSON.stringify(user));
            
            // Save to cookies for 7 days
            setCookie('user', JSON.stringify(user), 7);
        }
    }, [user]);


    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
