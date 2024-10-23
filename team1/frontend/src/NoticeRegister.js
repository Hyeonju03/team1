import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NoticeRegister = () => {
    const [formData, setFormData] = useState({ title: "", content: "" });
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
    const [empCode, setEmpCode] = useState(""); // 사원 번호 상태
    const navigate = useNavigate();

    // 컴포넌트가 마운트될 때 로그인 상태 확인
    useEffect(() => {
        const storedEmpCode = localStorage.getItem('empCode');
        if (storedEmpCode) {
            setIsLoggedIn(true); // 로그인 상태로 설정
            setEmpCode(storedEmpCode); // 사원 번호 설정
        } else {
            navigate('/notice/list'); // 로그인되지 않은 경우 리스트 페이지로 이동
        }
    }, [navigate]);

    // 등록시 입력하는 함수
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // 입력된 내용 제출 함수
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 백엔드(DB)로 데이터 저장
            await axios.post("/api/notice/register", formData, {
                headers: { Authorization: `Bearer ${empCode}` } // 로그인된 상태에서만 요청
            });
            navigate("/notice/list"); // 등록 완료 후 리스트 페이지로 이동
        } catch (error) {
            console.error("등록 중 오류 발생:", error);
        }
    };

    // 로그아웃 처리 함수
    const handleLogout = () => {
        setIsLoggedIn(false); // 로그아웃 상태로 설정
        setEmpCode(""); // 사원 번호 초기화
        localStorage.removeItem('empCode'); // 로컬 스토리지에서 사원 번호 삭제
        navigate("/notice/list"); // 리스트 페이지로 이동
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
                <main className="flex-grow bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
                    <h2 className="text-3xl font-bold mb-8 text-indigo-800 text-center">공지사항 등록</h2>
                    <div className="flex justify-center items-center w-full">
                        <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white shadow-xl rounded-lg p-8 text-center">
                            <div className="mb-6">
                                <label className="block text-indigo-700 text-sm font-bold mb-2" htmlFor="title">제목</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title} // 제목 불러오기
                                    onChange={handleInputChange} // 제목 등록
                                    required // 필수 입력 필드
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 transition duration-200"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-indigo-700 text-sm font-bold mb-2" htmlFor="content">내용</label>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={formData.content} // 내용 불러오기
                                    onChange={handleInputChange} // 내용 등록
                                    required // 필수 입력 필드
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 transition duration-200 h-48"
                                />
                            </div>
                            <div className="flex items-center justify-center">
                                <button type="submit"
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-200">
                                    등록하기
                                </button>
                            </div>
                        </form>
                    </div>
                </main>

                <aside className="w-64 p-4 border-l border-gray-300"> {/* 오른쪽에 배치 */}
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
                        <form className="mb-4"> {/* 로그인 폼 */}
                            <input
                                type="text"
                                placeholder="사원 번호"
                                className="w-full p-2 border mb-2"
                            />
                            <button
                                type="button"
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

export default NoticeRegister;
