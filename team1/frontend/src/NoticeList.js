import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NoticeList = () => {
    const [notices, setNotices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const PAGE_SIZE = 5; // 한 페이지에 보여줄 공지사항 게시글 수
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await axios.get('/api/notice/list');
                setNotices(response.data);
                setTotalPages(Math.ceil(response.data.length / PAGE_SIZE));
            } catch (error) {
                console.error("공지사항을 가져오는 중 오류 발생:", error);
            }
        };
        fetchNotices();
    }, []);

    const handlePageChange = (page) => {
        setCurrentPage(page);
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
                <main className="flex-grow max-w-5xl mx-auto flex flex-col items-center">
                    <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">공지사항</h1>

                    <div className="flex flex-row justify-between space-x-4 w-full">
                        <ul className="w-full space-y-2 border-r border-gray-300 pr-4">
                            {notices.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((notice) => (
                                <li key={notice.noticeNum}
                                    className="border border-gray-300 p-3 rounded-lg shadow-sm bg-white hover:bg-blue-50 transition duration-200">
                                    <h3
                                        className="text-lg font-semibold text-blue-600 cursor-pointer hover:text-blue-500 transition duration-200"
                                        onClick={() => navigate(`/notice/detail/${notice.noticeNum}`)}
                                    >
                                        {notice.title}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        작성일: {new Date(notice.startDate).toLocaleString()}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex justify-between mt-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 bg-blue-500 text-white"
                        >
                            이전
                        </button>
                        <span>{currentPage} / {totalPages}</span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 bg-blue-500 text-white"
                        >
                            다음
                        </button>
                    </div>

                    {/* 공지사항 등록 버튼 추가 */}
                    <button
                        onClick={() => navigate('/notice/register')}
                        className="mt-4 bg-green-500 text-white p-2"
                    >
                        공지사항 등록
                    </button>
                </main>
                <aside className="w-64 p-4 border-l border-gray-300">
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="아이디"
                            className="w-full p-2 border mb-2"
                        />
                        <input
                            type="password"
                            placeholder="비밀번호"
                            className="w-full p-2 border mb-2"
                        />
                        <button className="w-full bg-blue-500 text-white p-2 mb-2">
                            로그인
                        </button>
                        <div className="text-sm text-center">
                            <button className="text-blue-600 hover:underline">
                                공지사항
                            </button>
                            <span className="mx-1">|</span>
                            <button className="text-blue-600 hover:underline">
                                문의사항
                            </button>
                        </div>
                    </div>
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
