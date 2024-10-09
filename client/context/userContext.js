"use client";
import React, { createContext, useEffect, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const setCookie = (name, value, days) => {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
    };

    const getCookie = (name) => {
        const cookies = document.cookie.split('; ');
        const cookie = cookies.find(cookie => cookie.startsWith(`${name}=`));
        return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
    };

    const logout = () => {
        setUser(null);
        document.cookie = `user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;// Delete user cookie
        localStorage.removeItem('user');
    };

    useEffect(() => {
        const savedUser = getCookie('user') || localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    useEffect(() => {
        if (user && user.name && user.username) {
            localStorage.setItem('user', JSON.stringify(user));
            
            // Save to cookies for 7 days
            setCookie('user', JSON.stringify(user), 7);
        }
    }, [user]);


    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};
