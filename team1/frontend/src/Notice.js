import React, { useState } from 'react';

const initialNotices = [
    { id: 1, title: '제목 1', content: '공지사항 1의 내용입니다.', createdAt: new Date(), updatedAt: new Date() },
    { id: 2, title: '제목 2', content: '공지사항 2의 내용입니다.', createdAt: new Date(), updatedAt: new Date() },
    { id: 3, title: '제목 3', content: '공지사항 3의 내용입니다.', createdAt: new Date(), updatedAt: new Date() },
    { id: 4, title: '제목 4', content: '공지사항 4의 내용입니다.', createdAt: new Date(), updatedAt: new Date() },
    { id: 5, title: '제목 5', content: '공지사항 5의 내용입니다.', createdAt: new Date(), updatedAt: new Date() },
    { id: 6, title: '제목 6', content: '공지사항 6의 내용입니다.', createdAt: new Date(), updatedAt: new Date() },
    { id: 7, title: '제목 7', content: '공지사항 7의 내용입니다.', createdAt: new Date(), updatedAt: new Date() },
    { id: 8, title: '제목 8', content: '공지사항 8의 내용입니다.', createdAt: new Date(), updatedAt: new Date() },
    { id: 9, title: '제목 9', content: '공지사항 9의 내용입니다.', createdAt: new Date(), updatedAt: new Date() },
    { id: 10, title: '제목 10', content: '공지사항 10의 내용입니다.', createdAt: new Date(), updatedAt: new Date() },
];

const PAGE_SIZE = 5;

export default function Notice() {
    const [notices, setNotices] = useState(initialNotices);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedNotice, setEditedNotice] = useState({ title: '', content: '' });
    const [newNotice, setNewNotice] = useState({ title: '', content: '' });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const totalPages = Math.ceil(notices.length / PAGE_SIZE);

    const startIdx = (currentPage - 1) * PAGE_SIZE;
    const currentNotices = notices.slice(startIdx, startIdx + PAGE_SIZE);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleNoticeClick = (notice) => {
        setSelectedNotice(notice);
        setIsCreating(false);
        setIsEditing(false);
    };

    const handleBackToList = () => {
        setSelectedNotice(null);
        setIsCreating(false);
        setIsEditing(false);
    };

    const handleCreateClick = () => {
        setIsCreating(true);
        setSelectedNotice(null);
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (isEditing) {
            setEditedNotice(prev => ({ ...prev, [name]: value }));
        } else {
            setNewNotice(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            setNotices(prev => prev.map(notice =>
                notice.id === selectedNotice.id ? {
                    ...notice,
                    ...editedNotice,
                    updatedAt: new Date() // Update modified date only
                } : notice
            ));
            setSelectedNotice({ ...selectedNotice, ...editedNotice, updatedAt: new Date() });
            setIsEditing(false);
        } else {
            const newId = notices.length > 0 ? Math.max(...notices.map(n => n.id)) + 1 : 1;
            const createdNotice = {
                id: newId,
                ...newNotice,
                createdAt: new Date(), // Set created date
                updatedAt: new Date() // Set updated date
            };
            setNotices(prev => [createdNotice, ...prev]);
            setNewNotice({ title: '', content: '' });
            setIsCreating(false);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setEditedNotice({ title: selectedNotice.title, content: selectedNotice.content });
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = () => {
        setNotices(prev => prev.filter(notice => notice.id !== selectedNotice.id));
        setSelectedNotice(null);
        setShowDeleteConfirm(false);
    };

    const renderNoticeList = () => (
        <>
            <h1 className="text-2xl font-bold text-center mb-6 bg-gray-400 text-white py-2 rounded">공지사항</h1>
            <ul className="space-y-4">
                {currentNotices.map((notice) => (
                    <li key={notice.id} className="flex items-center justify-between border p-3 rounded">
                        <button
                            onClick={() => handleNoticeClick(notice)}
                            className="font-medium text-blue-600 hover:underline text-left"
                        >
                            [{notice.title}]
                        </button>
                        <span className="px-3 py-1 rounded text-sm">
                            {`등록일: ${new Date(notice.createdAt).toLocaleString()}`}
                        </span>
                    </li>
                ))}
            </ul>
            <div className="flex justify-center mt-4">
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-gray-400 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            <button
                onClick={handleCreateClick}
                className="w-1/5 bg-orange-400 hover:bg-orange-600 text-white font-bold py-2 rounded mt-6"
            >
                등록
            </button>
        </>
    );

    const renderNoticePage = () => (
        <>
            <h1 className="text-2xl font-bold text-center mb-6 bg-gray-400 text-white py-2 rounded">{selectedNotice.title}</h1>
            <div className="mb-4">
                <p>{selectedNotice.content}</p>
                <p className="text-sm text-gray-500">{`수정일: ${new Date(selectedNotice.updatedAt).toLocaleString()}`}</p>
            </div>
            <div className="flex justify-between">
                <button
                    onClick={handleBackToList}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    목록으로 돌아가기
                </button>
                <div>
                    <button
                        onClick={handleEditClick}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                    >
                        수정
                    </button>
                    <button
                        onClick={handleDeleteClick}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        삭제
                    </button>
                </div>
            </div>
        </>
    );

    const renderEditPage = () => (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h1 className="text-2xl font-bold text-center mb-6 bg-gray-400 text-white py-2 rounded">공지사항 수정</h1>
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">제목</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={editedNotice.title}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">내용</label>
                <textarea
                    id="content"
                    name="content"
                    value={editedNotice.content}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            <div className="flex justify-between">
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    수정 완료
                </button>
                <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                >
                    취소
                </button>
            </div>
        </form>
    );

    const renderCreatePage = () => (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h1 className="text-2xl font-bold text-center mb-6 bg-gray-400 text-white py-2 rounded">새 공지사항 작성</h1>
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">제목</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={newNotice.title}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">내용</label>
                <textarea
                    id="content"
                    name="content"
                    value={newNotice.content}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            <div className="flex justify-between">
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    저장
                </button>
                <button
                    type="button"
                    onClick={handleBackToList}
                    className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                >
                    취소
                </button>
            </div>
        </form>
    );

    const renderDeleteConfirm = () => (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">삭제 확인</h3>
                    <div className="mt-2 px-7 py-3">
                        <p className="text-sm text-gray-500">
                            정말 삭제하시겠습니까?
                        </p>
                    </div>
                    <div className="items-center px-4 py-3">
                        <button
                            id="ok-btn"
                            className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                            onClick={handleDeleteConfirm}
                        >
                            확인
                        </button>
                        <button
                            id="cancel-btn"
                            className="px-4 py-2 bg-gray-300 text-black text-base font-medium rounded-md w-24 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            onClick={() => setShowDeleteConfirm(false)}
                        >
                            취소
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

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
                    {isCreating ? renderCreatePage() :
                        isEditing ? renderEditPage() :
                            selectedNotice ? renderNoticePage() :
                                renderNoticeList()}
                </main>

                <aside className="w-64 p-4 border-l">
                    <div className="mb-4">
                        <input type="text" placeholder="아이디" className="w-full p-2 border mb-2"/>
                        <input type="password" placeholder="비밀번호" className="w-full p-2 border mb-2"/>
                        <button className="w-full bg-blue-500 text-white p-2 mb-2">로그인</button>
                        <div className="text-sm text-center">
                            <button onClick={handleBackToList} className="text-blue-600 hover:underline">공지사항</button>
                            <span className="mx-1">|</span>
                            <button className="text-blue-600 hover:underline">문의사항</button>
                        </div>
                    </div>
                    <div className="mb-4">
                        <h3  className="font-semibold mb-2">공지사항</h3>
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
            {showDeleteConfirm && renderDeleteConfirm()}
        </div>
    );
}
