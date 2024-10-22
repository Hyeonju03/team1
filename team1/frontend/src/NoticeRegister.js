import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NoticeRegister = () => {
    const [formData, setFormData] = useState({ title: "", content: "" });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/notice/register", formData);
            navigate("/notice/list");
        } catch (error) {
            console.error("등록 중 오류 발생:", error);
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
                <main className="flex-grow max-w-5xl mx-auto flex flex-col items-center p-4">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">공지사항 등록</h2>
                    <form onSubmit={handleSubmit} className="mb-6 w-full max-w-md">
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
                        <button type="submit"
                                className="bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200 hover:bg-green-500">
                            등록하기
                        </button>
                    </form>
                </main>

                <aside className="w-64 p-4 border-l border-gray-300"> {/* 오른쪽에 배치 */}
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

export default NoticeRegister;
