import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from './noticeAuth';

const UserNoticeDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { empCode, logout, login, isLoggedIn, config } = useAuth();

    const [notice, setNotice] = useState(null);
    const [inputId, setInputId] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const noticeNum = location.state?.noticeNum;

    useEffect(() => {
        const fetchNotice = async () => {
            if (!noticeNum) {
                console.error("noticeNum이 없습니다.");
                navigate('/user/notice/list');
                return;
            }

            try {
                const response = await axios.get(`/api/user/notice/detail/${noticeNum}`, config);
                setNotice(response.data);
            } catch (error) {
                console.error("공지사항을 가져오는 중 오류 발생:", error);
            }
        };
        fetchNotice();
    }, [noticeNum, navigate, config]);

    // 로그인 처리 함수
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!inputId || !inputPassword) {
            alert("아이디와 비밀번호를 모두 입력해주세요.");
            return;
        }

        try {
            const response = await axios.post('/api/employ/login', {
                empCode: inputId,
                empPass: inputPassword
            });

            if (response.data.success) {
                login(inputId, response.data.role, response.data.token); // 로그인 상태 업데이트
                localStorage.setItem('empCode', inputId);
                localStorage.setItem('token', response.data.token);
                navigate('/user/notice/list'); // 로그인 후 페이지 이동
            } else {
                alert("유효하지 않은 로그인 정보입니다.");
            }
        } catch (error) {
            alert("로그인 중 오류 발생.");
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/user/notice/list');
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
                <main className="flex-grow w-full bg-gradient-to-br from-blue-200 to-indigo-200 min-h-screen p-4">
                    <div className="max-w-4xl mx-auto">
                        {notice ? (
                            <div className="max-w-4xl mx-auto">
                                <div className="bg-indigo-100 p-6 rounded-lg shadow-lg mb-6">
                                    <h2 className="text-4xl font-extrabold text-indigo-800">{notice.title}</h2>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-md">
                                    <div className="text-gray-700 text-lg whitespace-pre-line mb-4">{notice.content}</div>
                                    <p className="text-sm text-gray-500 text-right">
                                        작성일: <span className="font-semibold text-indigo-600">{new Date(notice.startDate).toLocaleString()}</span>
                                    </p>
                                    <div className="flex justify-end mt-4">
                                        <button onClick={() => navigate('/user/notice/list')}
                                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50">목록
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                            </div>
                        )}
                    </div>
                </main>

                <aside className="w-64 p-4 border-l border-gray-300">
                    <div className="mb-4">
                        {isLoggedIn ? (
                            <>
                                <p className="mb-2">{empCode}님<br />반갑습니다.</p>
                                <button onClick={handleLogout}
                                        className="w-full bg-red-500 text-white p-2 mb-2 hover:bg-red-600 transition duration-200">로그아웃
                                </button>
                            </>
                        ) : (
                            <form onSubmit={handleLogin} className="mb-4">
                                <input
                                    type="text"
                                    value={inputId}
                                    onChange={(e) => setInputId(e.target.value)}
                                    placeholder="사용자 ID"
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
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default UserNoticeDetail;