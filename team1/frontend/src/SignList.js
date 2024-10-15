import React, { useCallback, useEffect, useState } from 'react';
import axios from "axios";

export default function SignList() {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [openDocumentId, setOpenDocumentId] = useState(null); // 열려 있는 문서 ID 저장

    useEffect(() => {
        const res = axios.get('/schedule')
            .then(response => {
                console.log(response.data);
                setSchedules(response.data); // 서버에서 받은 데이터를 상태에 설정
            })
        console.log(res)
    }, []);

    const setDoc = useCallback(() => {
        // doc리스트 가져오기
        setDocuments([
            {
                id: '001',
                classification: '일반',
                title: '2023년 4분기 보고서',
                submissionDate: '2023-12-01',
                completionDate: '2023-12-05',
                approvalStatus: '승인 > 미승인 > 미승인',
                content: '2023년 4분기 보고서에 대한 상세 내용입니다.',
            },
            {
                id: '002',
                classification: '긴급',
                title: '신규 프로젝트 계획서',
                submissionDate: '2023-12-10',
                completionDate: '-',
                approvalStatus: '승인 > 승인 > 미승인',
                content: '신규 프로젝트 계획서에 대한 상세 내용입니다.',
            },
        ]);
    }, []);

    useEffect(() => {
        setDoc();
    }, [setDoc]);

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    const toggleDocument = (docId) => {
        // 클릭한 문서 ID가 열려 있는 문서 ID와 같으면 닫고, 다르면 그 문서 ID로 변경
        setOpenDocumentId(openDocumentId === docId ? null : docId);
    };

    const addNewDocument = () => {

        // const newDoc = {
        //     id: `00${documents.length + 1}`,
        //     classification: '신규',
        //     title: `새 문서 ${documents.length + 1}`,
        //     submissionDate: new Date().toISOString().split('T')[0],
        //     completionDate: '-',
        //     approvalStatus: '미승인 > 미승인 > 미승인',
        //     content: '새 문서에 대한 상세 내용입니다.',
        // };
        // setDocuments([...documents, newDoc]);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Header with logo */}
            <header className="bg-white shadow-md p-4">
                <div className="container mx-auto">
                    <div className="w-32 h-8 bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600">로고</span>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-grow container mx-auto mt-8 p-4 bg-white rounded-lg shadow">
                <h1 className="text-2xl font-bold mb-6">문서결재</h1>

                {/* Document table */}
                <table className="w-full mb-6">
                    <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 text-left">문서번호</th>
                        <th className="p-2 text-left">분류</th>
                        <th className="p-2 text-left">제목</th>
                        <th className="p-2 text-left">기안일</th>
                        <th className="p-2 text-left">완료일</th>
                        <th className="p-2 text-left">승인현황</th>
                    </tr>
                    </thead>
                    <tbody>
                    {documents.map((doc) => (
                        <React.Fragment key={doc.id}>
                            <tr onClick={() => toggleDocument(doc.id)} className="cursor-pointer hover:bg-gray-100">
                                <td className="p-2">{doc.id}</td>
                                <td className="p-2">{doc.classification}</td>
                                <td className="p-2">{doc.title}</td>
                                <td className="p-2">{doc.submissionDate}</td>
                                <td className="p-2">{doc.completionDate}</td>
                                <td className="p-2">{doc.approvalStatus}</td>
                            </tr>
                            {openDocumentId === doc.id && ( // 현재 문서가 열려 있다면 내용 표시
                                <tr className="bg-gray-50">
                                    <td colSpan="6" className="p-2">
                                        <h2 className="text-lg font-semibold">문서 내용</h2>
                                        <p>{doc.content}</p>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                    </tbody>
                </table>

                {/* Create document button */}
                <button
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                    onClick={addNewDocument}
                >
                    문서 만들기
                </button>
            </main>

            {/* Slide-out panel with toggle button */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Panel toggle button */}
                <button
                    onClick={togglePanel}
                    className="absolute top-1/2 -left-6 transform -translate-y-1/2 bg-blue-500 text-white w-6 h-12 flex items-center justify-center rounded-l-md hover:bg-blue-600"
                >
                    {isPanelOpen ? '>' : '<'}
                </button>

                <div className="p-4">
                    <h2 className="text-xl font-bold mb-4">로그인</h2>
                    <input
                        type="text"
                        placeholder="아이디"
                        className="w-full p-2 mb-2 border rounded"
                    />
                    <input
                        type="password"
                        placeholder="비밀번호"
                        className="w-full p-2 mb-4 border rounded"
                    />
                    <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4">
                        로그인
                    </button>
                    <div className="text-sm text-center mb-4">
                        <a href="#" className="text-blue-600 hover:underline">공지사항</a>
                        <span className="mx-1">|</span>
                        <a href="#" className="text-blue-600 hover:underline">문의사항</a>
                    </div>
                    <h2 className="text-xl font-bold mb-2">메신저</h2>
                    <p>메신저 기능은 준비 중입니다.</p>
                </div>
            </div>
        </div>
    );
}