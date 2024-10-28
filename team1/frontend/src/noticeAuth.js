import React, { createContext, useContext, useState, useEffect } from 'react';


const noticeAuth = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [empCode, setEmpCode] = useState("");
    const [role, setRole] = useState(null); // 역할 상태 추가
    const [token, setToken] = useState(""); // 토큰 상태 추가

    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

    useEffect(() => {
        const storedEmpCode = localStorage.getItem('empCode');
        const storedToken = localStorage.getItem('token');
        const storedRole = localStorage.getItem('role'); // 역할 가져오기
        if (storedEmpCode && storedToken) {
            setIsLoggedIn(true);
            setEmpCode(storedEmpCode);
            setToken(storedToken);
            setRole(storedRole); // 역할 설정
        }
    }, []);

    const login = (code, userRole, authToken) => {
        console.log("Logging in with role:", userRole);
        setEmpCode(code);
        setIsLoggedIn(true);
        setToken(authToken); // 토큰 설정
        setRole(userRole); // 역할 설정
        localStorage.setItem('empCode', code);
        localStorage.setItem('token', authToken); // 토큰 저장
        localStorage.setItem('role', userRole); // 역할 저장
    };

    const logout = () => {
        setEmpCode("");
        setIsLoggedIn(false);
        setToken(""); // 토큰 초기화
        setRole(""); // 역할 초기화
        localStorage.removeItem('empCode');
        localStorage.removeItem('token'); // 토큰 제거
        localStorage.removeItem('role'); // 역할 제거
    };

    return (
        <noticeAuth.Provider value={{ isLoggedIn, empCode, role, login, logout, setRole }}>
            {children}
        </noticeAuth.Provider>
    );
};

export const useAuth = () => {
    return useContext(noticeAuth);
};