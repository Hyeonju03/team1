import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NoticeList = () => {
    const [notices, setNotices] = useState([]); // 공지사항 목록 상태 초기화
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 초기화
    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수 상태 초기화
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 초기화
    const [empCode, setEmpCode] = useState("");  // 사원 번호 상태 초기화
    const [error, setError] = useState(null); // 오류 상태 초기화
    const PAGE_SIZE = 6; // 페이지당 공지사항 수

    const navigate = useNavigate();


    // 공지사항을 가져오는 함수
    const fetchNotices = async () => {
        if (!isLoggedIn) return; // 로그인하지 않은 경우 함수 종료

        try {
            const response = await axios.get(`/api/notice/list`, {
                headers: { Authorization: `Bearer ${empCode}` }
            });
            setNotices(response.data); // 백엔드(DB) 데이터 공지사항리스트 화면으로 불러오기
            setTotalPages(Math.ceil(response.data.length / PAGE_SIZE)); // 총 페이지 수 계산
            setError(null);
        } catch (error) {
            console.error("공지사항을 가져오는 중 오류 발생:", error);
            setError("공지사항을 불러오는데 실패했습니다. 다시 시도해주세요.");
        }
    };

    // 로그인 여부 확인
    useEffect(() => {
        const storedEmpCode = localStorage.getItem('empCode'); // 임시로 로컬 데이터 가져옴
        if (storedEmpCode) {
            setIsLoggedIn(true); // 저장된 empCode가 있다면 로그인 상태로 설정
            setEmpCode(storedEmpCode); // 사원 번호 초기화
        }
    }, []);

    // 로그인 후 공지사항 가져오기
    useEffect(() => {
        if (isLoggedIn) {
            fetchNotices();
        }
    }, [isLoggedIn, empCode]); // isLoggedIn 또는 empCode가 변경될 때마다 실행

    // 페이지 변경 처리 함수
    const handlePageChange = (page) => {
        setCurrentPage(page); // 현재 페이지 업데이트
    };

    // 로그인 처리 함수
    const handleLogin = async (e) => {
        e.preventDefault();
        const inputEmpCode = e.target.empCode.value; // 입력된 사원 번호 가져오기
        setIsLoggedIn(true); // 로그인 한 상태
        setEmpCode(inputEmpCode);
        localStorage.setItem('empCode', inputEmpCode); // 로컬 스토리지에 사원 번호 저장
        await fetchNotices(); // 로그인 후 즉시 공지사항 불러오기
    };

    // 로그아웃 처리 함수
    const handleLogout = () => {
        setIsLoggedIn(false); // 로그아웃
        setEmpCode("");  // 사원 번호 초기화
        localStorage.removeItem('empCode'); // 로컬 스토리지에서 사원 번호 삭제
        setNotices([]); // 로그아웃 시 공지사항 목록 초기화
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
                                    {notices.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((notice) => ( // 현재 페이지의 공지사항 리스트 표시
                                        <li key={notice.noticeNum}
                                            className="p-3 hover:bg-indigo-50 transition duration-200">
                                            <h3
                                                className="text-lg font-semibold text-indigo-700 cursor-pointer hover:text-indigo-500 transition duration-200"
                                                onClick={() => navigate(`/notice/detail/${notice.noticeNum}`)} // 제목 클릭 시 상세 페이지로 이동
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
                                    onClick={() => handlePageChange(currentPage - 1)} // 이전 페이지 버튼 클릭 시 페이지 변경
                                    disabled={currentPage === 1} // 첫 페이지에서는 이전 버튼 비활성화
                                    className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                                >
                                    이전
                                </button>
                                <span className="text-indigo-800 font-semibold text-sm">{currentPage} / {totalPages}</span> {/* 현재 페이지와 총 페이지 수 표시 */}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)} // 다음 페이지 버튼 클릭 시 페이지 변경
                                    disabled={currentPage === totalPages} // 마지막 페이지에서는 다음 버튼 비활성화
                                    className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                                >
                                    다음
                                </button>
                            </div>
                        )}

                        {isLoggedIn && ( // 로그인 상태에서만 '공지사항 등록' 버튼 표시
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={() => navigate('/notice/register')} // 등록 버튼 클릭 시 register 페이지로 이동
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
                            <p className="mb-2">로그인됨: {empCode}</p> {/* 로그인된 사원 번호 표시 */}
                            <button
                                onClick={handleLogout} // 로그아웃 버튼 클릭 시 로그아웃 처리
                                className="w-full bg-red-500 text-white p-2 mb-2 hover:bg-red-600 transition duration-200"
                            >
                                로그아웃
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleLogin} className="mb-4"> {/* 로그인 폼 */}
                            <input
                                type="text"
                                name="empCode"
                                placeholder="사원 번호"
                                className="w-full p-2 border mb-2"
                                required // 필수 입력 필드
                            />
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
