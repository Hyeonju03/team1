import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useAuth} from "./noticeAuth";


const NoticeList = () => {
    const [notices, setNotices] = useState([]); // 공지사항 목록 상태 초기화
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 초기화
    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수 상태 초기화
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 초기화
    const [userId, setUserId] = useState(""); // 사용자 ID 상태 초기화
    const [userType, setUserType] = useState("user"); // 사용자 유형 상태 초기화
    const [error, setError] = useState(null); // 오류 상태 초기화
    const [inputId, setInputId] = useState(""); // 사용자 ID 상태 추가
    const {  login } = useAuth(); // login 함수 가져오기

    const PAGE_SIZE = 6; // 페이지당 공지사항 수
    const navigate = useNavigate();

    // 공지사항을 가져오는 함수
    const fetchNotices = async () => {
        if (!isLoggedIn) return; // 로그인하지 않은 경우 함수 종료

        console.log("공지사항 가져오기 시도"); // 추가된 로그

        try {
            const response = await axios.get(`/api/notice/list`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } // JWT 토큰 사용
            });
            setNotices(response.data); // DB 데이터로 공지사항 목록 업데이트
            setTotalPages(Math.ceil(response.data.length / PAGE_SIZE)); // 총 페이지 수 계산
            setError(null);
        } catch (error) {
            console.error("공지사항을 가져오는 중 오류 발생:", error);
            setError("공지사항을 불러오는데 실패했습니다. 다시 시도해주세요.");
        }
    };

    // 로그인 상태 확인 및 유효성 검사
    useEffect(() => {
        const storedId = localStorage.getItem(userType === "admin" ? 'adminId' : 'empCode');
        const token = localStorage.getItem('token'); // 토큰 가져오기
        const storedUserType = localStorage.getItem('userType') || "user"; // 사용자 유형 가져오기

        console.log("저장된 ID:", storedId);
        console.log("저장된 토큰:", token);

        if (storedId && token) {
            setIsLoggedIn(true);
            setUserId(storedId);
            setUserType(storedUserType); // 사용자 유형 설정
        } else {
            setIsLoggedIn(false); // 저장된 ID가 없으면 로그아웃 상태로 설정
            setUserId(""); // 사용자 ID 초기화
            setUserType("user"); // 기본값으로 초기화
        }
    }, []);

    // 로그인 상태가 변경될 때마다 공지사항 가져오기
    useEffect(() => {
        fetchNotices(); // 로그인 상태가 변경될 때마다 공지사항 가져오기
    }, [isLoggedIn]); // isLoggedIn이 변경될 때마다 실행

    // 로그인 처리 함수
    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("로그인 시도:", inputId, userType); // 추가된 로그

        if (!inputId) {
            setError("아이디를 입력해주세요.");
            return;
        }

        try {
            const response = await axios.post(
                userType === "admin" ? '/api/admin/login' : '/api/employ/login',
                { [userType === "admin" ? 'adminId' : 'empCode']: inputId }
            );
            console.log("로그인 응답:", response.data); // 추가된 로그

            if (response.data.success) {
                const userRole = userType === "admin" ? 'admin' : 'user'; // 기본 역할 설정
                login(inputId, response.data.role, response.data.token); // 역할과 토큰 추가
                console.log("로그인 성공");
                setIsLoggedIn(true);
                setUserId(inputId);
                localStorage.setItem(userType === "admin" ? 'adminId' : 'empCode', inputId); // 로그인 정보 로컬 스토리지에 저장
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userType', userType); // 사용자 유형 저장
                console.log("저장된 ID:", localStorage.getItem(userType === "admin" ? 'adminId' : 'empCode'));
                console.log("저장된 토큰:", localStorage.getItem('token'));
                navigate('/notice/list'); // 로그인 후 리스트 페이지로 이동
            } else {
                setError("유효하지 않은 로그인 정보입니다.");
            }
        } catch (error) {
            console.error("로그인 중 오류 발생:", error);
            setError("로그인에 실패했습니다. 다시 시도해주세요.");
        }

    };

    // 로그아웃 처리 함수
    const handleLogout = async () => {
        try {
            await axios.post(userType === "admin" ? '/api/admin/logout' : '/api/employ/logout'); // 적절한 로그아웃 API 호출
            setIsLoggedIn(false); // 로그인 상태 업데이트
            setUserId(""); // 사용자 ID 초기화
            localStorage.removeItem(userType === "admin" ? 'adminId' : 'empCode'); // ID 제거
            localStorage.removeItem('token'); // 토큰 제거
            navigate('/notice/list'); // 리스트 페이지로 이동
        } catch (error) {
            console.error("로그아웃 중 오류 발생:", error);
        }
    };

    // 페이지 변경 처리 함수
    const handlePageChange = (page) => {
        setCurrentPage(page); // 현재 페이지 업데이트
    };



    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-gray-200 p-2">
                <div className="container mx-auto flex justify-center items-center h-24">
                    <div className="w-48 h-24 bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600">로고</span>
                    </div>
                </div>
            </header>

            <div className="flex flex-grow">
                <main className="flex-grow w-full bg-gradient-to-br from-blue-100 to-indigo-200 min-h-screen p-4">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-800">공지사항</h1>

                        {error && ( // 오류가 있는 경우 오류 메시지 표시
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full md:w-4/5 lg:w-3/4 mx-auto">
                            {isLoggedIn ? ( // 로그인 상태 확인
                                <ul className="divide-y divide-gray-200">
                                    {notices.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((notice) => (
                                        <li key={notice.noticeNum} className="p-3 hover:bg-indigo-50 transition duration-200">
                                            <h3
                                                className="text-lg font-semibold text-indigo-700 cursor-pointer hover:text-indigo-500 transition duration-200"
                                                onClick={() => navigate(`/notice/detail/${notice.noticeNum}`)}
                                            >
                                                {notice.title}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">
                                                작성일: {new Date(notice.startDate).toLocaleString()}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="p-4 text-center text-gray-600">로그인 해주세요.</p>  // 로그인하지 않은 경우 안내 메시지
                            )}
                        </div>

                        {isLoggedIn && ( // 로그인 상태에서만 공지사항 리스트 불러오기
                            <div className="flex justify-between items-center w-full mt-4 md:w-4/5 lg:w-3/4 mx-auto">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                                >
                                    이전
                                </button>
                                <span className="text-indigo-800 font-semibold text-sm">{currentPage} / {totalPages}</span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                                >
                                    다음
                                </button>
                            </div>
                        )}

                        {isLoggedIn && userType === "admin" &&  ( // 관리자 로그인 상태에서만 보이는 공지사항 등록 버튼
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={() => navigate('/notice/register')}
                                    className="bg-green-500 text-white font-bold py-2 px-4 text-sm rounded-full hover:bg-green-400 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                                >
                                    공지사항 등록
                                </button>
                            </div>
                        )}
                    </div>
                </main>

                <aside className="w-64 p-4 border-l border-gray-300">
                    {isLoggedIn ? ( // 로그인 상태 확인
                        <div className="mb-4">
                            <p className="mb-2">{userId}님<br/>반갑습니다.</p>
                            <button
                                onClick={handleLogout}
                                className="w-full bg-red-500 text-white p-2 mb-2 hover:bg-red-600 transition duration-200"
                            >
                                로그아웃
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleLogin} className="mb-4">
                            <input
                                type="text"
                                name="id"
                                value={inputId}  // 상태를 관리
                                onChange={(e) => setInputId(e.target.value)} // ID 입력 시 상태 업데이트
                                placeholder={userType === "admin" ? "관리자 ID" : "사원 번호"} // 사용자 ID 입력 필드
                                className="w-full p-2 border mb-2"
                                required // 필수 입력 필드
                            />
                            <select name="userType" value={userType} onChange={(e) => {
                                setUserType(e.target.value);
                                setInputId(""); // 사용자 유형 변경 시 ID 초기화
                            }} className="w-full p-2 border mb-2">
                                <option value="user">일반 사용자</option>
                                <option value="admin">관리자</option>
                            </select>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white p-2 mb-2 hover:bg-blue-600 transition duration-200"
                            >
                                로그인
                            </button>
                        </form>
                    )}
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">공지사항</h3>
                        <ul className="list-disc list-inside">
                            <li>첫 번째 공지사항</li>
                            <li>두 번째 공지사항</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">메신저</h3>
                        <p>메신저 기능은 준비 중입니다.</p>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default NoticeList;
