import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/notices"; // API의 기본 URL을 설정
const USE_API = false; // API 사용 여부를 설정하는 플래그입니다. true로 설정하면 백엔드 API를 사용

const useNotices = () => { // 공지사항 관련 상태 및 기능을 관리
    const [notices, setNotices] = useState(() => { // 공지사항 상태를 초기화
        const savedNotices = localStorage.getItem("notices"); // 로컬 스토리지에서 공지사항을 가져온다
        return savedNotices // 저장된 공지사항이 있다면 파싱하여 반환
            ? JSON.parse(savedNotices)
            : [ // 없으면 기본 공지사항 목록을 설정
                {
                    id: 1,
                    title: "첫 번째 공지사항",
                    content: "첫 번째 공지사항 내용입니다.",
                    createdAt: new Date().toISOString(), // 현재 날짜와 시간을 ISO 형식으로 저장합니다.
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
        const fetchData = async () => {
            try {
                if (USE_API) {
                    await fetchNotices(); // API에서 공지사항을 가져온다
                } else {
                    localStorage.setItem("notices", JSON.stringify(notices)); // 공지사항을 로컬 스토리지에 저장
                }
            } catch (error) {
                console.error("Error fetching data:", error); // 에러 처리
            }
        };

        fetchData(); // 비동기 함수 호출
    }, [notices]); // notices가 변경될 때마다 이 effect가 실행

    const fetchNotices = async () => { // 공지사항을 API에서 비동기적으로 가져오는 함수
        try {
            const response = await axios.get(API_URL); // API에서 공지사항을 GET 요청
            setNotices(response.data); // 가져온 데이터를 notices 상태에 저장
        } catch (error) {
            console.error("Error fetching notices:", error); // 오류가 발생하면 콘솔에 출력
        }
    };

    const addNotice = async (notice) => { // 새로운 공지사항을 추가하는 함수
        if (USE_API) { // API 사용 여부에 따라 분기
            try {
                const response = await axios.post(API_URL, notice); // API에 새로운 공지사항을 POST 요청
                setNotices((prevNotices) => [response.data, ...prevNotices]); // 응답으로 받은 공지사항을 상태에 추가
            } catch (error) {
                console.error("Error adding notice:", error); // 오류 발생 시 콘솔에 출력
            }
        } else {
            const newNotice = { // API를 사용하지 않을 때 새로운 공지사항을 생성
                ...notice,
                id: Date.now(), // 현재 시간을 ID로 사용
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setNotices((prevNotices) => [newNotice, ...prevNotices]); // 새로운 공지사항을 상태에 추가
        }
    };

    const updateNotice = async (id, updatedNotice) => { // 공지사항을 업데이트하는 함수
        if (USE_API) {
            try {
                const response = await axios.put(`${API_URL}/${id}`, updatedNotice); // API에 PUT 요청으로 업데이트된 공지사항 전송
                setNotices((prevNotices) =>
                    prevNotices.map((notice) => // 기존 공지사항 목록을 업데이트
                        notice.id === id ? response.data : notice // ID가 일치하는 경우 업데이트된 공지사항으로 교체
                    )
                );
            } catch (error) {
                console.error("Error updating notice:", error);
            }
        } else {
            setNotices((prevNotices) =>
                prevNotices.map((notice) =>
                    notice.id === id // ID가 일치하는 경우
                        ? {
                            ...notice,
                            ...updatedNotice, // 업데이트된 내용을 기존 공지사항에 병합
                            updatedAt: new Date().toISOString(), // 업데이트 날짜를 새로 저장
                        }
                        : notice // 일치하지 않으면 기존 공지사항을 그대로 반환
                )
            );
        }
    };

    const deleteNotice = async (id) => { // 공지사항을 삭제하는 함수
        if (USE_API) {
            try {
                await axios.delete(`${API_URL}/${id}`); // API에 DELETE 요청으로 공지사항을 삭제
                setNotices((prevNotices) =>
                    prevNotices.filter((notice) => notice.id !== id) // ID가 일치하지 않는 공지사항만 필터링하여 상태에 저장
                );
            } catch (error) {
                console.error("Error deleting notice:", error); // 오류 발생 시 콘솔에 출력
            }
        } else {
            setNotices((prevNotices) =>
                prevNotices.filter((notice) => notice.id !== id) // API를 사용하지 않을 때 동일하게 필터링
            );
        }
    };

    return { notices, addNotice, updateNotice, deleteNotice }; // 공지사항 및 관련 함수를 반환
};

export default function Notice() { // 공지사항 컴포넌트를 정의합니다.
    const { notices, addNotice, updateNotice, deleteNotice } = useNotices(); // 커스텀 훅에서 반환한 값들을 구조 분해 할당합니다.
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태를 저장
    const [selectedNotice, setSelectedNotice] = useState(null); // 선택된 공지사항을 저장
    const [isCreating, setIsCreating] = useState(false); // 공지사항 등록 여부 표시
    const [isEditing, setIsEditing] = useState(false); // 공지사항 수정 여부 표시
    const [formData, setFormData] = useState({ title: "", content: "" }); // 입력 폼의 데이터 상태를 저장
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // 삭제 확인 표시

    const PAGE_SIZE = 5; // 페이지당 표시할 공지사항 수를 설정합니다.
    const totalPages = Math.ceil(notices.length / PAGE_SIZE); // 총 페이지 수를 계산

    const handleInputChange = (e) => { // 입력 필드의 변화에 따라 상태를 업데이트
        const { name, value } = e.target; // 이벤트 타겟의 name과 value를 추출
        setFormData((prev) => ({ ...prev, [name]: value })); // 상태를 업데이트
    };

    const handleSubmit = (e) => { // 폼 제출 시 실행되는 함수
        e.preventDefault(); // 기본 상태에서는 제출을 막아줌.
        if (isCreating) { // 공지사항 등록 모드
            addNotice(formData); // 공지사항을 추가.
            setIsCreating(false); // 등록 모드를 종료
        } else if (isEditing) { // 공지사항 수정 모드
            updateNotice(selectedNotice.id, formData); // 선택된 공지사항을 업데이트
            setIsEditing(false); // 수정 모드를 종료
            setSelectedNotice(null); // 선택된 공지사항을 초기화
        }
        setFormData({ title: "", content: "" }); // 폼 데이터를 초기화
    };

    const handleDelete = () => { // 삭제 버튼 클릭 시 호출되는 함수
        setShowDeleteConfirm(true); // 삭제 확인 표시
    };

    const confirmDelete = () => { // 삭제 확인 후 호출되는 함수
        deleteNotice(selectedNotice.id); // 선택된 공지사항을 삭제
        setSelectedNotice(null); // 선택된 공지사항을 초기화
        setShowDeleteConfirm(false); // 삭제 확인 닫음
    };

    const cancelDelete = () => { // 삭제 취소 버튼 클릭 시 호출되는 함수
        setShowDeleteConfirm(false); // 삭제 확인 닫음
    };

    useEffect(() => { // 컴포넌트가 마운트될 때 실행
        axios.get('/test') // '/test' API를 호출
            .then(response => console.log(response.data)) // 응답 데이터를 콘솔에 출력
            .catch(error => console.log(error)) // 오류 발생 시 콘솔에 출력
    }, []); //  처음 렌더링될 때만 실행된다.

    return (
        <div className="min-h-screen flex flex-col"> {
            <header className="bg-gray-200 p-2">
                <div className="container mx-auto flex justify-center items-center h-24">
                    <div className="w-48 h-24 bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600">로고</span>
                    </div>
                </div>
            </header>
        }

            <div className="flex-grow flex">
                <main className="w-full mx-auto mt-2 p-6 bg-white rounded-lg shadow-md">
                    {isCreating || isEditing ? ( // 공지사항 등록 또는 수정 모드일 때
                        <form onSubmit={handleSubmit} className="mb-6">
                            <h2 className="text-xl font-bold mb-4">
                                {isCreating ? "공지사항 등록" : "공지사항 수정"}
                            </h2>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="title">
                                    제목
                                </label>
                                <input
                                    type="text" // 텍스트 입력 필드
                                    id="title" // 필드의 ID
                                    name="title" // 필드의 name
                                    value={formData.title} // 입력 필드의 값
                                    onChange={handleInputChange} // 입력 변경 시 호출되는 함수
                                    required // 필수 입력 필드
                                    className="border rounded p-2 w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="content">
                                    내용
                                </label>
                                <textarea
                                    id="content" // 필드의 ID
                                    name="content" // 필드의 name
                                    value={formData.content} // 입력 필드의 값
                                    onChange={handleInputChange} // 입력 변경 시 호출되는 함수
                                    required // 필수 입력 필드
                                    className="border rounded p-2 w-full h-32"
                                />
                            </div>
                            <button
                                type="submit"
                                className={`${isCreating ? "bg-green-500" : "bg-blue-500"} text-white font-bold py-2 px-4 rounded`}
                            >
                                {isCreating ? "등록하기" : "수정하기"}
                            </button>
                            <button
                                type="button" // 취소 버튼
                                onClick={() => {
                                    setIsCreating(false); // 등록 모드 종료
                                    setIsEditing(false); // 수정 모드 종료
                                    setFormData({ title: "", content: "" }); // 입력 데이터 초기화
                                }}
                                className="ml-2 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                            >
                                취소
                            </button>
                        </form>
                    ) : selectedNotice ? ( // 선택된 공지사항이 있을 경우
                        <div>
                            <h2 className="text-2xl font-bold mb-4">
                                {selectedNotice.title}
                            </h2>
                            <p className="mb-4">{selectedNotice.content}</p>
                            <p className="text-sm text-gray-500 mb-4">
                                작성일: {new Date(selectedNotice.createdAt).toLocaleString()}
                                {selectedNotice.updatedAt !== selectedNotice.createdAt && // 수정일이 있을 경우
                                    ` (수정일: ${new Date(
                                        selectedNotice.updatedAt
                                    ).toLocaleString()})`}
                            </p>
                            <button
                                onClick={() => { // 수정 버튼 클릭 시
                                    setIsEditing(true); // 수정 모드로 전환
                                    setFormData({ // 수정할 데이터를 입력 필드에 설정
                                        title: selectedNotice.title,
                                        content: selectedNotice.content,
                                    });
                                }}
                                className="bg-blue-500 text-white font-bold py-2 px-4 rounded mr-2"
                            >
                                수정
                            </button>
                            <button
                                onClick={handleDelete} // 삭제 버튼 클릭 시 삭제 확인 표시
                                className="bg-red-500 text-white font-bold py-2 px-4 rounded mr-2"
                            >
                                삭제
                            </button>
                            <button
                                onClick={() => setSelectedNotice(null)} // 목록으로 버튼 클릭 시 선택 해제
                                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                            >
                                목록으로
                            </button>
                        </div>
                    ) : ( // 공지사항 목록이 보여질 경우
                        <>
                            <h1 className="text-2xl font-bold text-center mb-6">공지사항</h1>
                            <ul className="space-y-4">
                                {notices
                                    .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE) // 현재 페이지에 맞게 공지사항을 잘라냅니다.
                                    .map((notice) => ( // 잘라낸 공지사항을 반복하여 리스트 항목 생성
                                        <li key={notice.id} className="border p-4 rounded shadow">
                                            <h3
                                                className="text-lg font-semibold text-blue-600 cursor-pointer"
                                                onClick={() => setSelectedNotice(notice)} // 제목 클릭 시 선택된 공지사항 게시글로 이동
                                            >
                                                {notice.title}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                작성일: {new Date(notice.createdAt).toLocaleString()}
                                            </p>
                                        </li>
                                    ))}
                            </ul>
                            <div className="flex justify-center mt-4"> {/* 페이지 네비게이션 */}
                                {[...Array(totalPages)].map((_, index) => ( // 총 페이지 수만큼 버튼 생성
                                    <button
                                        key={index}
                                        onClick={() => setCurrentPage(index + 1)} // 페이지 버튼 클릭 시 해당 페이지로 이동
                                        className={`mx-1 px-3 py-1 rounded ${
                                            currentPage === index + 1 // 현재 페이지와 일치하는 경우 스타일 변경
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-200 hover:bg-gray-300"
                                        }`}
                                    >
                                        {index + 1} {/* 페이지 번호 표시 */}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setIsCreating(true)} // 새 공지사항 작성 버튼 클릭 시 등록 모드로 전환
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
                                onClick={() => setSelectedNotice(null)} //공지사항 링크 클릭 시 선택 해제
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

            {showDeleteConfirm && ( // 삭제 확인 표시 조건
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="bg-white p-5 rounded-lg shadow-xl">
                        <h3 className="text-lg font-bold mb-4">정말 삭제하시겠습니까?</h3>
                        <div className="flex justify-end">
                            <button
                                onClick={confirmDelete} // 삭제 확인 버튼
                                className="bg-red-500 text-white font-bold py-2 px-4 rounded mr-2"
                            >
                                확인
                            </button>
                            <button
                                onClick={cancelDelete} // 삭제 취소 버튼
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
