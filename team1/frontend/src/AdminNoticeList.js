import React, { useState, useEffect } from "react"; // React 및 Hook 가져오기
import axios from "axios"; // axios 가져오기
import { useNavigate } from "react-router-dom"; // useNavigate 훅 가져오기
import { useAuth } from "./noticeAuth"; // 인증 훅 가져오기
import Clock from "react-live-clock";

const AdminNoticeList = () => {
    const [notices, setNotices] = useState([]); // 공지사항 목록 상태 초기화
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 초기화
    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수 상태 초기화
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 초기화
    const [userId, setUserId] = useState(""); // 사용자 ID 상태 초기화
    const [error, setError] = useState(null); // 오류 상태 초기화
    const [inputId, setInputId] = useState(""); // 사용자 ID 상태 추가
    const [inputPassword, setInputPassword] = useState(""); // 비밀번호 입력
    const { login, logout } = useAuth(); // login 함수 가져오기

    const [isPanelOpen, setIsPanelOpen] = useState(false); // 화면 옆 슬라이드

    const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태 추가
    const [searchType, setSearchType] = useState("title"); // 검색 기준 상태 추가

    const PAGE_SIZE = 6; // 페이지당 공지사항 수
    const navigate = useNavigate(); // navigate 훅

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    // 공지사항을 가져오는 함수
    const fetchNotices = async () => {
        try {
            const response = await axios.get(`/api/adminnotice`,{
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
            setNotices(response.data); // DB 데이터로 공지사항 목록 업데이트
            setTotalPages(Math.ceil(response.data.length / PAGE_SIZE)); // 총 페이지 수 계산
            setError(null);
        } catch (error) {
            console.error("공지사항을 가져오는 중 오류 발생:", error);
            setError("공지사항을 불러오는데 실패했습니다. 다시 시도해주세요.");
        }
    };

    // 로그인 상태 확인
    useEffect(() => {
        const storedId = localStorage.getItem('adminId'); // 관리자 ID 가져오기
        const token = localStorage.getItem('token'); // 토큰 가져오기

        if (storedId && token) {
            setIsLoggedIn(true);
            setUserId(storedId); // 관리자 ID 설정

        } else {
            setIsLoggedIn(false); // 저장된 ID가 없으면 로그아웃 상태로 설정
            setUserId(""); // 사용자 ID 초기화
        }
    }, []);

    // 로그인 상태가 변경될 때마다 공지사항 가져오기
    useEffect(() => {
            fetchNotices(); // 로그인 상태가 true일 때만 공지사항 가져오기
    }, []); // isLoggedIn 상태가 변경될 때마다 실행

    // 로그인 처리 함수
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!inputId || !inputPassword) {
            setError("아이디와 비밀번호를 모두 입력해주세요.");
            return;
        }

        try {
            const response = await axios.post(
                '/api/employ/login', // 관리자 로그인 API 호출
                {
                    empCode: inputId,
                    empPass: inputPassword
                }
            );

            if (response.data.success) {
                login(inputId, response.data.role, response.data.token); // 역할과 토큰 추가
                setIsLoggedIn(true);
                setUserId(inputId);
                localStorage.setItem('adminId', inputId); // 로그인 정보 로컬 스토리지에 저장
                localStorage.setItem('token', response.data.token);
                setInputId(""); // 아이디 입력 필드 초기화
                setInputPassword(""); // 비밀번호 입력 필드 초기화
                navigate('/admin/notice/list'); // 로그인 후 관리자 공지사항 리스트 페이지로 이동
            } else {
                setError("유효하지 않은 로그인 정보입니다.");
            }
        } catch (error) {
            setError("잘못된 계정 정보입니다. 다시 시도해주세요.");
        }
    };

    // 로그아웃 처리 함수
    const handleLogout = async () => {
        try {
            await axios.post('/api/admin/logout'); // 관리자 로그아웃 API 호출
            localStorage.removeItem('adminId'); // ID 제거
            localStorage.removeItem('token'); // 토큰 제거
            setInputId(""); // 아이디 입력 필드 초기화
            setInputPassword(""); // 비밀번호 입력 필드 초기화
            setIsLoggedIn(false); // 로그인 상태 업데이트
            setUserId(""); // 사용자 ID 초기화
            navigate('/admin/notice'); // 리스트 페이지로 이동
        } catch (error) {
            console.error("로그아웃 중 오류 발생:", error);
        }
    };

    // 수정된 부분: 공지사항 클릭 시 state를 통해 noticeNum 전달
    const handleNoticeClick = (noticeNum) => {
        navigate('/admin/notice/detail', { state: { noticeNum } }); // 모든 경우에 adminnotice/detail로 이동
    };

    // 필터링된 공지사항 가져오기 (검색창)
    const filteredNotices = notices.filter((notice) => {
        return searchType === "title"
            ? notice.title.toLowerCase().includes(searchQuery.toLowerCase())
            : notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            notice.content.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const filteredCount = filteredNotices.length; // 필터링된 공지사항 수
    const total = Math.ceil(filteredCount / PAGE_SIZE); // 총 페이지 수를 필터링된 공지사항 수에 기반하여 계산

    const today = new Date();
    const formattedDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`;


    return (
        <div className="min-h-screen flex flex-col">
            <header className="w-full flex justify-end items-center border-b shadow-md h-14 bg-white">
                <div className="flex mr-6">
                    <div className="font-bold mr-1">{formattedDate}</div>
                    <Clock
                        format={'HH:mm:ss'}
                        ticking={true}
                        timezone={'Asia/Seoul'}/>
                </div>
                <div className="mr-5">
                    <img width="40" height="40"
                         src="https://img.icons8.com/external-tanah-basah-basic-outline-tanah-basah/24/5A5A5A/external-marketing-advertisement-tanah-basah-basic-outline-tanah-basah.png"
                         alt="external-marketing-advertisement-tanah-basah-basic-outline-tanah-basah"
                         onClick={() => {
                             navigate(`/user/notice/list`)
                         }}/>
                </div>
                <div className="mr-5">
                    <img width="40" height="40" src="https://img.icons8.com/ios-filled/50/5A5A5A/help.png"
                         alt="help" onClick={() => {
                        navigate(`/AdminFAQ`)
                    }}/>
                </div>
                <div className="mr-5">
                    <img width="40" height="40" src="https://img.icons8.com/windows/32/5A5A5A/home.png"
                         alt="home" onClick={() => {
                        navigate("/")
                    }}/>
                </div>
                <div className="mr-16" onClick={togglePanel}>
                    <div className="bg-gray-800 text-white font-bold w-36 h-8 pt-1 rounded-2xl">로그인 / 회원가입
                    </div>
                </div>
            </header>

            <div className="flex flex-grow">
                <main className="flex-grow w-full bg-gradient-to-br from-blue-200 to-indigo-200 p-4">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-800">공지사항</h1>

                        {error && (
                            <div
                                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                                role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        <div className="flex justify-center mb-4">
                            <select
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                                className="p-2 border rounded-lg mr-2"
                            >
                                <option value="title">제목</option>
                                <option value="content">제목 + 내용</option>
                            </select>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="검색어 입력"
                                className="border rounded-lg w-72 pl-2.5 shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
                            />
                        </div>

                        <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full md:w-4/5 lg:w-3/4 mx-auto">
                            <ul className="divide-y divide-gray-200">
                                {filteredNotices.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((notice) => (
                                    <li key={notice.noticeNum}
                                        className="p-3 hover:bg-indigo-50 transition duration-200">
                                        <h3
                                            className="text-lg font-semibold text-indigo-700 cursor-pointer hover:text-indigo-500 transition duration-200"
                                            onClick={() => handleNoticeClick(notice.noticeNum)}
                                        >
                                            {notice.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            작성일: {new Date(notice.startDate).toLocaleString()}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex justify-between items-center w-full mt-4 md:w-4/5 lg:w-3/4 mx-auto">
                            {currentPage > 1 && filteredCount > 0 && ( // '이전' 버튼 숨기기 조건
                                <button
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500 transition duration-200 focus:outline-none"
                                >
                                    이전
                                </button>
                            )}
                            <span className="text-indigo-800 font-semibold text-sm">{currentPage} / {total}</span>
                            {currentPage < total && filteredCount > PAGE_SIZE && ( // '다음' 버튼 숨기기 조건
                                <button
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500 transition duration-200 focus:outline-none"
                                >
                                    다음
                                </button>
                            )}
                        </div>

                        {isLoggedIn && (
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={() => navigate('/adminnotice/register')}
                                    className="bg-green-500 text-white font-bold py-2 px-4 text-sm rounded-full hover:bg-green-400 transition duration-200"
                                >
                                    공지사항 등록
                                </button>
                            </div>
                        )}
                    </div>
                </main>


                <aside className="w-64 p-4 border-l border-gray-300">
                    {isLoggedIn ? (
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
                                value={inputId}
                                onChange={(e) => setInputId(e.target.value)}
                                placeholder="관리자 ID"
                                className="w-full p-2 border mb-2"
                                required
                            />
                            <input
                                type="password"
                                value={inputPassword}
                                onChange={(e) => setInputPassword(e.target.value)}
                                placeholder="비밀번호"
                                className="w-full p-2 border mb-2"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white p-2 mb-2 hover:bg-blue-600 transition duration-200"
                            >
                                로그인
                            </button>
                        </form>
                    )}
                    <div className="text-sm text-center mb-4">
                        <a href="#" className="text-blue-600 hover:underline">공지사항</a>
                        <span className="mx-1">|</span>
                        <a href="#" className="text-blue-600 hover:underline">문의사항</a>
                    </div>
                    <h2 className="text-xl font-bold mb-2">메신저</h2>
                    <p>메신저 기능은 준비 중입니다.</p>
                </aside>
            </div>
        </div>
    );
};

export default AdminNoticeList;
