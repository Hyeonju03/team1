import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Notice() {
    const [notices, setNotices] = useState([]);
    // 공지사항 리스트 저장
    const [currentPage, setCurrentPage] = useState(1);
    // 공지사항 리스트 페이지 번호 저장
    const [selectedNotice, setSelectedNotice] = useState(null);
    // 공지사항 리스트 중에 선택(클릭)된 공지사항을 받는 코드
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ title: "", content: "", empCode: "", target: "", endDate: "" });
    // 공지사항 등록, 수정에 필요한 데이터 저장
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    // 삭제 버튼 클릭시 삭제 확인 팝업 여부


    const PAGE_SIZE = 5; // 한 페이지에 보여줄 공지사항 게시글 수


    // 백엔드에 연동된 DB 데이터 가져오기
    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await axios.get('/api/notices');
                setNotices(response.data);
            } catch (error) {
                console.error("공지사항을 가져오는 중 오류 발생:", error);
            }
        };
        fetchNotices();
    }, []);


    // 공지사항 등록,수정시 필드에 입력된 값이 변경될때 실행되는 함수
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // 새 글 작성, 수정, 삭제 버튼 클릭시 호출되는 함수
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isCreating) {
                const response = await axios.post('/api/notices', formData);
                setNotices((prev) => [...prev, response.data]); // 새 글 등록 후 리스트 불러오는 코드

                const updatedNotices = await axios.get('/api/notices');
                setNotices(updatedNotices.data);
                // 새 글 등록 후 최신 순 게시글 리스트를 보여줌

            } else if (isEditing) {
                await axios.put(`/api/notices/${selectedNotice.noticeNum}`, formData);

                const updatedNotices = await axios.get('/api/notices');
                setNotices(updatedNotices.data);
                // 글 업데이트를 하더라도 최신 순 게시글 리스트 보여줌
            }
            resetForm();

        } catch (error) {
            console.error("오류 발생:", error.response ? error.response.data : error.message);
        }
    };

    // 초기 상태로 리셋
    const resetForm = () => {
        setIsCreating(false);
        setIsEditing(false);
        setSelectedNotice(null);
        setFormData({ title: "", content: "", empCode: "", target: "", endDate: "" }); // 초기화 시 모든 필드 초기화
    };

    // 공지사항 삭제
    const deleteNotice = async () => {
        try {
            await axios.delete(`/api/notices/${selectedNotice.noticeNum}`);

            const updatedNotices = await axios.get('/api/notices');
            setNotices(updatedNotices.data);
            resetForm();
        } catch (error) {
            console.error("공지사항 삭제 중 오류 발생:", error);
        }
    };

    // 삭제 버튼 클릭시 확인 팝업창 함수
    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    // 삭제 '확인' 버튼 클릭시 최종삭제 deleteNotice(); 함수호출
    const confirmDelete = () => {
        deleteNotice();
        setShowDeleteConfirm(false);
    };

    // 삭제 '취소' 버튼 클릭시 팝업창만 닫음
    const cancelDelete = () => {
        setShowDeleteConfirm(false);
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

            <div className="flex-grow flex">
                <main className="w-full max-w-3xl mx-auto mt-2 p-6 bg-white rounded-lg">
                    {isCreating || isEditing ? (
                        <form onSubmit={handleSubmit} className="mb-6">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                                {isCreating ? "공지사항 등록" : "공지사항 수정"}
                            </h2>
                            {/* 공지사항 등록, 수정을 실행했을때만 해당 폼을 구현하는 코드 */}

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="empCode">직원 코드</label>
                                <input
                                    type="text"
                                    id="empCode"
                                    name="empCode"
                                    value={formData.empCode}  // 직원코드
                                    onChange={handleInputChange} // 직원코드 변경할때 호출
                                    required
                                    className="border rounded p-2 w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="title">제목</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title} // 제목
                                    onChange={handleInputChange} // 제목 변경할때 호출
                                    required
                                    className="border rounded p-2 w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="content">내용</label>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={formData.content} // 내용
                                    onChange={handleInputChange} // 내용 변경할때 호출
                                    required
                                    className="border rounded p-2 w-full h-32"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="target">대상</label>
                                <input
                                    type="text"
                                    id="target"
                                    name="target"
                                    value={formData.target} // 대상
                                    onChange={handleInputChange} // 대상 변경할때 호출
                                    required
                                    className="border rounded p-2 w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="endDate">종료 날짜</label>
                                <input
                                    type="datetime-local"
                                    id="endDate"
                                    name="endDate"
                                    value={formData.endDate} // 종료일
                                    onChange={handleInputChange} // 종료일 변경할때 호출
                                    required
                                    className="border rounded p-2 w-full"
                                />
                            </div>

                            {/* 등록하기 버튼 */}
                            <button
                                type="submit"
                                className={`${isCreating ? "bg-green-600" : "bg-blue-600"} text-white font-bold py-2 px-4 rounded transition duration-200 hover:${isCreating ? "bg-green-500" : "bg-blue-500"}`}
                            >
                                {isCreating ? "등록하기" : "수정하기"}
                                {/* 등록하기를 클릭하면 True, False면 수정하기 */}
                            </button>

                            {/* 취소 버튼 */}
                            <button
                                type="button"
                                onClick={resetForm}
                                className="ml-2 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded transition duration-200"
                            >
                                취소
                            </button>
                        </form>

                        // 공지사항 특정 게시글을 클릭했을때 보여지는 화면
                    ) : selectedNotice ? (
                        <div className="mb-6">
                            <div className="bg-blue-50 p-6 rounded-lg mb-4">
                                <h2 className="text-3xl font-bold mb-2 text-blue-700 border-b-4 border-blue-500 pb-2">
                                    {selectedNotice.title}
                                </h2>
                            </div>
                            <div className="bg-gray-100 p-6 rounded-lg mb-4">
                                <div
                                    className="text-gray-700 text-lg whitespace-pre-line">{selectedNotice.content}</div>
                                <p className="text-sm text-gray-600 text-right mt-4">{selectedNotice.target}</p>
                            </div>
                            <p className="text-sm text-gray-500 text-right mb-4">
                                작성일: <span
                                className="font-semibold text-gray-800">{new Date(selectedNotice.startDate).toLocaleString()}</span>
                            </p>
                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    onClick={() => {
                                        setIsEditing(true);
                                        setFormData({
                                            empCode: selectedNotice.empCode,
                                            title: selectedNotice.title,
                                            content: selectedNotice.content,
                                            target: selectedNotice.target,
                                            endDate: selectedNotice.endDate
                                        });
                                    }}
                                    className="bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200 hover:bg-blue-500"
                                >
                                    수정
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-200 hover:bg-red-500"
                                >
                                    삭제
                                </button>
                                <button
                                    onClick={() => setSelectedNotice(null)}
                                    className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded transition duration-200"
                                >
                                    목록으로
                                </button>
                            </div>
                        </div>

                        // 공지사항 리스트를 볼때 (화면구현)
                    ) : (
                        <>
                            <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">공지사항</h1>
                            <ul className="space-y-2">
                                {notices
                                    .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
                                    .map((notice) => (
                                        <li key={notice.noticeNum}
                                            className="border border-gray-300 p-3 rounded-lg shadow-sm bg-white hover:bg-blue-50 transition duration-200">
                                            <h3
                                                className="text-lg font-semibold text-blue-600 cursor-pointer hover:text-blue-500 transition duration-200"
                                                onClick={() => setSelectedNotice(notice)}
                                            >
                                                {notice.title}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                작성일: {new Date(notice.startDate).toLocaleString()}
                                            </p>
                                        </li>
                                    ))}
                            </ul>
                            <div className="flex justify-center mt-4">
                                {[...Array(Math.ceil(notices.length / PAGE_SIZE))].map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentPage(index + 1)}
                                        className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300 transition duration-200"}`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setIsCreating(true)}
                                className="mt-4 bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200 hover:bg-green-500"
                            >
                                새 공지사항 작성
                            </button>
                        </>
                    )}

                    {/* 삭제 팝업 창 구현 */}
                    {showDeleteConfirm && (
                        <div
                            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                            <div className="bg-white p-5 rounded-lg shadow-xl">
                                <h3 className="text-lg font-bold mb-4">정말 삭제하시겠습니까?</h3>
                                <div className="flex justify-end">
                                    <button
                                        onClick={confirmDelete}
                                        className="bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-200 hover:bg-red-500"
                                    >
                                        확인
                                    </button>
                                    <button
                                        onClick={cancelDelete}
                                        className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded transition duration-200"
                                    >
                                        취소
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                <aside className="w-64 p-4 border-l">
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
                            <button
                                onClick={() => setSelectedNotice(null)}
                                className="text-blue-600 hover:underline"
                            >
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
    )
        ;
}
