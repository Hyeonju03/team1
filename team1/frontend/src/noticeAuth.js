import React, { createContext, useContext, useState, useEffect } from 'react';


const noticeAuth = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [empCode, setEmpCode] = useState(null);

    useEffect(() => {
        const storedEmpCode = localStorage.getItem('empCode');
        if (storedEmpCode) {
            setIsLoggedIn(true);
            setEmpCode(storedEmpCode);
        }
    }, []);

    const login = (code) => {
        setEmpCode(code);
        setIsLoggedIn(true);
        localStorage.setItem('empCode', code);
    };

    const logout = () => {
        setEmpCode(null);
        setIsLoggedIn(false);
        localStorage.removeItem('empCode');
    };

    return (
        <noticeAuth.Provider value={{ isLoggedIn, empCode, login, logout }}>
            {children}
        </noticeAuth.Provider>
    );
};

export const useAuth = () => {
    return useContext(noticeAuth);
};