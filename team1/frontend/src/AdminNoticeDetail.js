import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from './noticeAuth';
import Clock from "react-live-clock"

const AdminNoticeDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isLoggedIn, empCode, logout, config, login } = useAuth();

    const [notice, setNotice] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ title: "", content: "" });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [inputId, setInputId] = useState(""); // 로그인 ID 상태
    const [inputPassword, setInputPassword] = useState(""); // 로그인 비밀번호 상태

    const noticeNum = location.state?.noticeNum;

    const [isPanelOpen, setIsPanelOpen] = useState(false); // 화면 옆 슬라이드

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };


    useEffect(() => {
        if (!noticeNum) {
            console.error("noticeNum이 없습니다.");
            navigate('/adminnotice');
            return;
        }

        const fetchNotice = async () => {
            try {
                const response = await axios.get(`/api/adminnotice/detail/${noticeNum}`, config);
                setNotice(response.data);
                setFormData({ title: response.data.title, content: response.data.content });
            } catch (error) {
                console.error("공지사항을 가져오는 중 오류 발생:", error);
            }
        };

        fetchNotice();
    }, [noticeNum, navigate, config]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEdit = () => setIsEditing(true);

    const handleCancelEdit = () => {
        setIsEditing(false);
        if (notice) {
            setFormData({ title: notice.title, content: notice.content });
        }
    };

    const submitEdit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/adminnotice/detail/${noticeNum}`, formData, config);
            setNotice({ ...notice, ...formData });
            setIsEditing(false);
        } catch (error) {
            console.error("오류 발생:", error.response ? error.response.data : error.message);
        }
    };

    const handleDelete = () => setShowDeleteConfirm(true);

    const confirmDelete = async () => {
        try {
            await axios.delete(`/api/notice/detail/admin/${noticeNum}`, config);
            navigate('/adminnotice');
        } catch (error) {
            console.error("공지사항 삭제 중 오류 발생:", error);
        }
    };

    const cancelDelete = () => setShowDeleteConfirm(false);

    const handleLogout = () => {
        logout();
        localStorage.removeItem('adminId'); // localStorage에서 ID 제거
        localStorage.removeItem('token'); // localStorage에서 토큰 제거
        navigate('/adminnotice');
    };

    const handleLogin = async (e) => {
        e.preventDefault(); // 폼 제출 기본 동작 방지
        const success = await login(inputId, inputPassword); // login 함수에 ID와 비밀번호 전달
        if (success) {
            // 로그인 성공 후, 현재 페이지로 리디렉션
            navigate(`/adminnotice/detail/${noticeNum}`, { state: { noticeNum } });
        }
    };

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
                <main className="flex-grow w-full bg-gradient-to-br from-blue-200 to-indigo-200 min-h-screen p-4">
                    <div className="max-w-4xl mx-auto">
                        {isEditing ? (
                            <form onSubmit={submitEdit} className="p-6">
                                <h2 className="text-3xl font-bold mb-6 text-indigo-800 border-b-2 border-indigo-200 pb-2">공지사항
                                    수정</h2>
                                <div className="mb-4">
                                    <label className="block text-indigo-700 mb-2 font-semibold"
                                           htmlFor="title">제목</label>
                                    <input type="text" id="title" name="title" value={formData.title}
                                           onChange={handleInputChange} required
                                           className="border-2 border-indigo-200 rounded p-2 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200"/>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-indigo-700 mb-2 font-semibold"
                                           htmlFor="content">내용</label>
                                    <textarea id="content" name="content" value={formData.content}
                                              onChange={handleInputChange} required
                                              className="border-2 border-indigo-200 rounded p-2 w-full h-48 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200"/>
                                </div>
                                <button type="submit"
                                        className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-full transition duration-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">수정하기
                                </button>
                                <button type="button" onClick={handleCancelEdit}
                                        className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-full transition duration-200 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ml-4">취소
                                </button>
                            </form>
                        ) : notice ? (
                            <div className="p-6">
                                <div className="bg-indigo-100 p-4 rounded-lg mb-4">
                                    <h2 className="text-3xl font-bold mb-2 text-indigo-900">{notice.title}</h2>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-md">
                                    <div className="text-gray-700 text-lg whitespace-pre-line">{notice.content}</div>
                                    <p className="text-sm text-gray-500 text-right mb-6">작성일: <span
                                        className="font-semibold text-indigo-600">{new Date(notice.startDate).toLocaleString()}</span>
                                    </p>
                                    <div className="flex justify-end space-x-3 mt-6">
                                        {isLoggedIn ? (
                                            <>
                                                <button onClick={handleEdit}
                                                        className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-full transition duration-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">수정
                                                </button>
                                                <button onClick={handleDelete}
                                                        className="bg-red-600 text-white font-bold py-2 px-6 rounded-full transition duration-200 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">삭제
                                                </button>
                                            </>
                                        ) : (
                                            <div className="flex flex-col">
                                                {/* 비로그인 상태에서는 수정 및 삭제 버튼을 숨깁니다. */}
                                            </div>
                                        )}
                                        <button onClick={() => navigate('/adminnotice')}
                                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50">목록
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center h-64">
                                <div
                                    className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
                            </div>
                        )}
                    </div>

                    {showDeleteConfirm && (
                        <div
                            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                            <div className="bg-white p-5 rounded-lg shadow-xl">
                                <h3 className="text-lg font-bold mb-4">정말 삭제하시겠습니까?</h3>
                                <div className="flex justify-end">
                                    <button onClick={confirmDelete}
                                            className="bg-red-500 text-white font-bold py-2 px-4 rounded mr-2">확인
                                    </button>
                                    <button onClick={cancelDelete}
                                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">취소
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                <aside className="w-64 p-4 border-l border-gray-300">
                    <div className="mb-4">
                        {isLoggedIn ? (
                            <>
                                <p className="mb-2">{empCode}님<br/>반갑습니다.</p>
                                <button onClick={handleLogout}
                                        className="w-full bg-red-500 text-white p-2 mb-2 hover:bg-red-600 transition duration-200">로그아웃
                                </button>
                            </>
                        ) : (
                            <>
                                <form onSubmit={handleLogin}>
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
                            </>
                        )}
                        <div className="text-sm text-center mb-4">
                            <a href="#" className="text-blue-600 hover:underline">공지사항</a>
                            <span className="mx-1">|</span>
                            <a href="#" className="text-blue-600 hover:underline">문의사항</a>
                        </div>
                        <h2 className="text-xl font-bold mb-2">메신저</h2>
                        <p>메신저 기능은 준비 중입니다.</p>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default AdminNoticeDetail;
