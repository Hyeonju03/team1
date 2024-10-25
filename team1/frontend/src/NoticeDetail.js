import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from './noticeAuth';

const NoticeDetail = () => {
    const { noticeNum } = useParams(); // 각각 noticeNum 추출
    const [notice, setNotice] = useState(null); // 공지사항 데이터 상태 초기화
    const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태 초기화
    const [formData, setFormData] = useState({ title: "", content: "" }); // 입력 폼 데이터 초기화
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // 삭제 확인 팝업 초기화
    const [showEditConfirm, setShowEditConfirm] = useState(false); // 수정 확인 팝업 초기화
    const { empCode, role, logout, setRole } = useAuth(); // 로그인 상태 가져오기
    const navigate = useNavigate();

    useEffect(() => {
        const storedRole = localStorage.getItem('role'); // 역할 가져오기
        setRole(storedRole); // 역할 상태 업데이트
    }, []);

    useEffect(() => {
        const fetchNotice = async () => {
            try {
                // 공지사항 게시글 백엔드(DB) 연동
                const response = await axios.get(`/api/notice/detail/${noticeNum}`);
                setNotice(response.data);
                setFormData({ title: response.data.title, content: response.data.content });
            } catch (error) {
                console.error("공지사항을 가져오는 중 오류 발생:", error);
                console.log("에러 응답:", error.response ? error.response.data : "No response");
            }
        };
        fetchNotice();
    }, [noticeNum]);

    // 수정시에 발생하는 입력 변화 함수
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // 수정 버튼 클릭시 호출되는 함수
    const handleEdit = () => {
        setIsEditing(true);

    }




    // 수정 폼 제출 처리 함수
    const submitEdit = async () => {

        const config = {
            withCredentials: true
        };

        try {
            // 수정된 내용 DB와 동기화
            await axios.put(`/api/notice/detail/${noticeNum}`, formData, config );
            setNotice({ ...notice, ...formData });
            setIsEditing(false);
        } catch (error) {
            console.error("오류 발생:", error.response ? error.response.data : error.message);
            console.log("에러 응답:", error.response ? error.response : "No response");
            console.log(error);
        }
    };

    // 삭제 버튼 클릭시 호출되는 함수
    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    // 삭제 팝업에서 확인 버튼 클릭시 호출되는 함수
    const confirmDelete = async () => {
        console.log("삭제 확인 버튼 클릭");
        try {
            // 삭제된 데이터 DB와 동기화
            await axios.delete(`/api/notice/detail/admin/${noticeNum}`);
            navigate('/notice/list'); // 리스트 페이지로 이동
        } catch (error) {
            console.error("공지사항 삭제 중 오류 발생:", error);
            console.log("에러 응답:", error.response ? error.response.data : "No response");
            console.log(error);
        }
    };

    // 삭제 팝업에서 취소 버튼 클릭시 호출되는 함수
    const cancelDelete = () => {
        setShowDeleteConfirm(false); // 팝업창 닫기
    };


    const handleLogout = () => {
        logout(); // 로그아웃 함수 호출
        navigate('/notice/list'); // 리스트 페이지로 이동
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
                        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
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
                                </form>
                            ) : notice ? (
                                <div className="p-6">
                                    <div className="bg-indigo-50 p-6 rounded-lg mb-6">
                                        <h2 className="text-3xl font-bold mb-2 text-indigo-800 border-b-4 border-indigo-300 pb-2">{notice.title}</h2>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-lg mb-6">
                                        <div
                                            className="text-gray-700 text-lg whitespace-pre-line">{notice.content}</div>
                                    </div>
                                    <p className="text-sm text-gray-500 text-right mb-6">작성일: <span
                                        className="font-semibold text-indigo-600">{new Date(notice.startDate).toLocaleString()}</span>
                                    </p>
                                    <div className="flex justify-end space-x-3 mt-6">
                                        {/* Admin 역할일 때 */}
                                        {role === 'admin' ? (
                                            <>
                                                <button onClick={handleEdit}
                                                        className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-full transition duration-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">수정
                                                </button>
                                                <button onClick={handleDelete}
                                                        className="bg-red-600 text-white font-bold py-2 px-6 rounded-full transition duration-200 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">삭제
                                                </button>
                                            </>
                                        ) : (
                                            // 일반 사용자 역할일 때
                                            <p className="text-gray-600"></p>
                                        )}
                                        <button onClick={() => navigate('/notice/list')}
                                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50">목록
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-center items-center h-64">
                                    <div
                                        className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Delete and Edit Confirm Modals */}
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
                        <p className="mb-2">{empCode}님<br/>반갑습니다.</p>
                        <button onClick={handleLogout}
                                className="w-full bg-red-500 text-white p-2 mb-2 hover:bg-red-600 transition duration-200">로그아웃
                        </button>
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
