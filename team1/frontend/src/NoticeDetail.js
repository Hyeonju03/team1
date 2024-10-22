import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const NoticeDetail = () => {
    const { noticeNum } = useParams();
    const [notice, setNotice] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ title: "", content: "" });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const response = await axios.get(`/api/notice/detail/${noticeNum}`);
                setNotice(response.data);
                setFormData({ title: response.data.title, content: response.data.content });
            } catch (error) {
                console.error("공지사항을 가져오는 중 오류 발생:", error);
            }
        };
        fetchNotice();
    }, [noticeNum]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/notice/detail/${noticeNum}`, formData);
            setIsEditing(false);
            setNotice({ ...notice, ...formData });
        } catch (error) {
            console.error("오류 발생:", error.response ? error.response.data : error.message);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/notice/detail/${noticeNum}`);
            navigate('/notice/list');
        } catch (error) {
            console.error("공지사항 삭제 중 오류 발생:", error);
        }
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
                <main className="flex-grow p-4 max-w-5xl mx-auto">
                    {isEditing ? (
                        <form onSubmit={handleEdit} className="mb-6">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">공지사항 수정</h2>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="title">제목</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="border rounded p-2 w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="content">내용</label>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    required
                                    className="border rounded p-2 w-full h-32"
                                />
                            </div>
                            <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200 hover:bg-blue-500">
                                수정하기
                            </button>
                        </form>
                    ) : notice ? (
                        <div className="mb-6">
                            <div className="bg-blue-50 p-6 rounded-lg mb-4">
                                <h2 className="text-3xl font-bold mb-2 text-blue-700 border-b-4 border-blue-500 pb-2">
                                    {notice.title}
                                </h2>
                            </div>
                            <div className="bg-gray-100 p-6 rounded-lg mb-4">
                                <div className="text-gray-700 text-lg whitespace-pre-line">{notice.content}</div>
                            </div>
                            <p className="text-sm text-gray-500 text-right mb-4">
                                작성일: <span className="font-semibold text-gray-800">{new Date(notice.startDate).toLocaleString()}</span>
                            </p>
                            <div className="flex justify-end space-x-2 mt-4">
                                <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200 hover:bg-blue-500">
                                    수정
                                </button>
                                <button onClick={handleDelete} className="bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-200 hover:bg-red-500">
                                    삭제
                                </button>
                                <button onClick={() => navigate('/notice/list')} className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded transition duration-200">
                                    목록
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>로딩 중...</div>
                    )}
                </main>

                <aside className="w-64 p-4 border-l border-gray-300">
                    <div className="mb-4">
                        <input type="text" placeholder="아이디" className="w-full p-2 border mb-2" />
                        <input type="password" placeholder="비밀번호" className="w-full p-2 border mb-2" />
                        <button className="w-full bg-blue-500 text-white p-2 mb-2">로그인</button>
                        <div className="text-sm text-center">
                            <button className="text-blue-600 hover:underline">공지사항</button>
                            <span className="mx-1">|</span>
                            <button className="text-blue-600 hover:underline">문의사항</button>
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

export default NoticeDetail;
