import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/notices";
const USE_API = false; // Set this to true when you want to use the backend API


const useNotices = () => {
    const [notices, setNotices] = useState(() => {
        const savedNotices = localStorage.getItem("notices");
        return savedNotices
            ? JSON.parse(savedNotices)
            : [
                {
                    id: 1,
                    title: "첫 번째 공지사항",
                    content: "첫 번째 공지사항 내용입니다.",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },  
                {
                    id: 2,
                    title: "두 번째 공지사항",
                    content: "두 번째 공지사항 내용입니다.",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            ];
    });

    useEffect(() => {
        if (USE_API) {
            fetchNotices();
        } else {
            localStorage.setItem("notices", JSON.stringify(notices));
        }
    }, [notices]);

    const fetchNotices = async () => {
        try {
            const response = await axios.get(API_URL);
            setNotices(response.data);
        } catch (error) {
            console.error("Error fetching notices:", error);
        }
    };


    const addNotice = async (notice) => {
        if (USE_API) {
            try {
                const response = await axios.post(API_URL, notice);
                setNotices((prevNotices) => [response.data, ...prevNotices]);
            } catch (error) {
                console.error("Error adding notice:", error);
            }
        } else {
            const newNotice = {
                ...notice,
                id: Date.now(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setNotices((prevNotices) => [newNotice, ...prevNotices]);
        }
    };

    const updateNotice = async (id, updatedNotice) => {
        if (USE_API) {
            try {
                const response = await axios.put(`${API_URL}/${id}`, updatedNotice);
                setNotices((prevNotices) =>
                    prevNotices.map((notice) =>
                        notice.id === id ? response.data : notice
                    )
                );
            } catch (error) {
                console.error("Error updating notice:", error);
            }
        } else {
            setNotices((prevNotices) =>
                prevNotices.map((notice) =>
                    notice.id === id
                        ? {
                            ...notice,
                            ...updatedNotice,
                            updatedAt: new Date().toISOString(),
                        }
                        : notice
                )
            );
        }
    };

    const deleteNotice = async (id) => {
        if (USE_API) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                setNotices((prevNotices) =>
                    prevNotices.filter((notice) => notice.id !== id)
                );
            } catch (error) {
                console.error("Error deleting notice:", error);
            }
        } else {
            setNotices((prevNotices) =>
                prevNotices.filter((notice) => notice.id !== id)
            );
        }
    };

    return { notices, addNotice, updateNotice, deleteNotice };
};

export default function Notice() {
    const { notices, addNotice, updateNotice, deleteNotice } = useNotices();
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ title: "", content: "" });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const PAGE_SIZE = 5;
    const totalPages = Math.ceil(notices.length / PAGE_SIZE);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isCreating) {
            addNotice(formData);
            setIsCreating(false);
        } else if (isEditing) {
            updateNotice(selectedNotice.id, formData);
            setIsEditing(false);
            setSelectedNotice(null);
        }
        setFormData({ title: "", content: "" });
    };

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        deleteNotice(selectedNotice.id);
        setSelectedNotice(null);
        setShowDeleteConfirm(false);
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
    };
    useEffect(() => {
        axios.get('/test')
            .then(response => console.log(response.data))
            .catch(error => console.log(error))

    }, []);
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
                <main className="w-full mx-auto mt-2 p-6 bg-white rounded-lg shadow-md">
                    {isCreating || isEditing ? (
                        <form onSubmit={handleSubmit} className="mb-6">
                            <h2 className="text-xl font-bold mb-4">
                                {isCreating ? "공지사항 등록" : "공지사항 수정"}
                            </h2>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="title">
                                    제목
                                </label>
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
                                <label className="block text-gray-700 mb-2" htmlFor="content">
                                    내용
                                </label>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    required
                                    className="border rounded p-2 w-full h-32"
                                />
                            </div>
                            <button
                                type="submit"
                                className={`${
                                    isCreating ? "bg-green-500" : "bg-blue-500"
                                } text-white font-bold py-2 px-4 rounded`}
                            >
                                {isCreating ? "등록하기" : "수정하기"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsCreating(false);
                                    setIsEditing(false);
                                    setFormData({ title: "", content: "" });
                                }}
                                className="ml-2 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                            >
                                취소
                            </button>
                        </form>
                    ) : selectedNotice ? (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">
                                {selectedNotice.title}
                            </h2>
                            <p className="mb-4">{selectedNotice.content}</p>
                            <p className="text-sm text-gray-500 mb-4">
                                작성일: {new Date(selectedNotice.createdAt).toLocaleString()}
                                {selectedNotice.updatedAt !== selectedNotice.createdAt &&
                                    ` (수정일: ${new Date(
                                        selectedNotice.updatedAt
                                    ).toLocaleString()})`}
                            </p>
                            <button
                                onClick={() => {
                                    setIsEditing(true);
                                    setFormData({
                                        title: selectedNotice.title,
                                        content: selectedNotice.content,
                                    });
                                }}
                                className="bg-blue-500 text-white font-bold py-2 px-4 rounded mr-2"
                            >
                                수정
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 text-white font-bold py-2 px-4 rounded mr-2"
                            >
                                삭제
                            </button>
                            <button
                                onClick={() => setSelectedNotice(null)}
                                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                            >
                                목록으로
                            </button>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-2xl font-bold text-center mb-6">공지사항</h1>
                            <ul className="space-y-4">
                                {notices
                                    .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
                                    .map((notice) => (
                                        <li key={notice.id} className="border p-4 rounded shadow">
                                            <h3
                                                className="text-lg font-semibold text-blue-600 cursor-pointer"
                                                onClick={() => setSelectedNotice(notice)}
                                            >
                                                {notice.title}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                작성일: {new Date(notice.createdAt).toLocaleString()}
                                            </p>
                                        </li>
                                    ))}
                            </ul>
                            <div className="flex justify-center mt-4">
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentPage(index + 1)}
                                        className={`mx-1 px-3 py-1 rounded ${
                                            currentPage === index + 1
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-200 hover:bg-gray-300"
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setIsCreating(true)}
                                className="mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded"
                            >
                                새 공지사항 작성
                            </button>
                        </>
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

            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="bg-white p-5 rounded-lg shadow-xl">
                        <h3 className="text-lg font-bold mb-4">정말 삭제하시겠습니까?</h3>
                        <div className="flex justify-end">
                            <button
                                onClick={confirmDelete}
                                className="bg-red-500 text-white font-bold py-2 px-4 rounded mr-2"
                            >
                                확인
                            </button>
                            <button
                                onClick={cancelDelete}
                                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
