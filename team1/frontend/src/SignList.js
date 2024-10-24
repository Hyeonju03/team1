import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from "axios";
import {ChevronDown, ChevronRight, Paperclip, Search} from "lucide-react";


export default function SignList() {
    const navigate = useNavigate(); // 경로 navigate
    const [isPanelOpen, setIsPanelOpen] = useState(false); // 화면 옆 슬라이드

    const [isExpanded, setIsExpanded] = useState(true);
    const [documents, setDocuments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // 검색 입력 상태 추가
    const [filteredDocuments, setFilteredDocuments] = useState([]); // 필터링된 문서 상태
    const [selectedDocuments, setSelectedDocuments] = useState([]); // 선택된 문서 상태 추가
    const [selectedCategory, setSelectedCategory] = useState(''); // 카테고리 상태 변수

    useEffect(() => {
        // doc리스트 가져오기
        const empCode = "3118115625-jys1902"

        const comCode = 3118115625

        axios.get(`/sign/${empCode}`)
            .then(response => {
                setDocuments(response.data);
                setFilteredDocuments(response.data); // 초기값은 전체 문서
            })
            .catch(error => console.log(error));

        // code 가져오기
        axios.get(`/code/${comCode} `)
            .then(response => {
                const uniqueCategories = [...new Set(response.data.map(category => category.signCateCode))];
                setCategories(uniqueCategories);
            })


    }, []);

    // 화면 옆 슬라이드 열림 구분
    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    const goSignRequest = () => {
        navigate("/sign/register");
    }

    // 제목 클릭 시 상세 페이지로 이동
    const handleDocumentClick = (signNum) => {
        navigate(`/sign/detail/${signNum}`)
    }

    // 날짜 형식 변환
    const formatDate = (dateString) => {
        return dateString.replace("T", " ").slice(0, 16); // LocalDateTime의 기본 형식을 변경
    };

    // 검색 버튼 클릭 시
    const handleSearch = () => {
        // 검색어가 포함된 문서를 필터링
        const filtered = documents.filter((doc) =>
            doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || // 제목 검색
            doc.content?.toLowerCase().includes(searchQuery.toLowerCase()) || // 내용(문서 설명) 검색
            doc.docCateCode?.toLowerCase().includes(searchQuery.toLowerCase()) // 카테고리 검색
        );
        setFilteredDocuments(filtered); // 필터링된 문서로 상태 업데이트

        // 검색된 결과가 없을 경우
        if (filtered.length === 0) {
            alert("검색된 문서가 없습니다.");
        }
    };

    // 엔터키로 문서 검색 가능
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    }

    // 왼쪽 메뉴 카테고리 선택 시 해당 카테고리와 일치하는 문서들만 필터링
    const handleCategorySelect = (category) => {
        setSelectedCategory(category); // 별도의 선택 상태
        const filtered = documents.filter((document) => document.signCateCode === category);
        setFilteredDocuments(filtered); // 필터링된 문서로 상태 업데이트
        if (filtered.length === 0) {
            alert("해당 카테고리 관련 문서를 찾을 수 없습니다.");
        }
    }

    // 체크박스 상태 변화
    const handleCheckboxChange = (signNum) => {
        setSelectedDocuments(prevState => {
            if (prevState.includes(signNum)) {
                return prevState.filter(num => num !== signNum); // 이미 선택된 문서는 해제
            } else {
                return [...prevState, signNum]; // 새로운 문서 선택
            }
        });
    };

    const handleDelete = () => {
        const deletePromises = selectedDocuments.map(signNum =>
            axios.delete(`/sign/${signNum}`) // 실제 삭제 API 호출
        );

        Promise.all(deletePromises)
            .then(() => {
                // 삭제 후 상태 업데이트
                setDocuments(prevDocuments =>
                    prevDocuments.filter(doc => !selectedDocuments.includes(doc.signNum))
                );
                setFilteredDocuments(prevDocuments =>
                    prevDocuments.filter(doc => !selectedDocuments.includes(doc.signNum))
                );
                setSelectedDocuments([]); // 선택된 문서 초기화
            })
            .catch(error => console.log(error));
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header with logo */}
            <header className="bg-gray-200 p-4">
                <h1 className="text-2xl font-bold text-center">로고</h1>
            </header>
            <div className="flex-1 flex">
                <aside className="w-64 bg-gray-100 p-4 space-y-2">

                    <div>
                        <button
                            className="w-full flex items-center"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? <ChevronDown className="mr-2 h-4 w-4"/> :
                                <ChevronRight className="mr-2 h-4 w-4"/>}
                            결재함
                        </button>
                        {isExpanded && (
                            <div className="ml-8 space-y-2 pace-y-2 mt-2">
                                {categories.map((category, index) => (
                                    // 각 카테고리를 ','로 나누고 각 항목을 한 줄씩 출력
                                    category.split(',').map((item, subIndex) => (
                                        <button className="w-full" key={`${index}-${subIndex}`}
                                                onClick={() => handleCategorySelect(item)}>
                                            {item}
                                        </button>
                                    ))
                                ))}
                            </div>
                        )}
                    </div>

                </aside>

                {/* Main content */}
                <main className="flex-1 p-4">
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="relative flex flex-1 max-w-xl">
                            <input type="text" placeholder="문서 검색"
                                   className="pl-10 pr-4 w-[300px] h-[40px] border border-gray-300 rounded"
                                   value={searchQuery} // 검색 입력값 상태와 연결
                                   onChange={(e) => setSearchQuery(e.target.value)} // 입력값이 변경될 때 상태 업데이트
                                   onKeyDown={handleKeyDown}
                            />
                            <search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
                            <button className="ml-2 bg-gray-200 hover:bg-gray-400 rounded w-[50px]"
                                    onClick={handleSearch}>검색
                            </button>
                        </div>

                    </div>
                    <div className="flex justify-end space-x-2 mb-4">
                        <button onClick={() => {
                            // 등록 페이지로 이동할 때 선택된 카테고리를 전달
                            navigate('/sign/register', {state: {selectedCategory: selectedCategory}});
                        }}>등록
                        </button>
                        <button onClick={handleDelete}>삭제</button>
                    </div>
                    <h1 className="text-2xl font-bold mb-4">문서결재</h1>
                    <div className="space-y-2">
                        {/* Document table */}
                        <table className="w-full mb-6">
                            <thead>
                            <tr className="bg-gray-200">
                                <th className="p-2 text-center">문서번호</th>
                                <th className="p-2 text-center">분류</th>
                                <th className="p-2 text-center">제목</th>
                                <th className="p-2 text-center">기안일</th>
                                <th className="p-2 text-center">완료일</th>
                                <th className="p-2 text-center">승인현황</th>
                            </tr>
                            </thead>
                            <tbody>
                            {(filteredDocuments.length > 0 ? filteredDocuments : documents).map((document, docIndex) => {
                                const target = document.target
                                return (
                                    <tr key={docIndex} className="cursor-pointer hover:bg-gray-100"
                                        onClick={handleDocumentClick}>
                                        <td className="p-2">{document.signNum}</td>
                                        <td className="p-2">{document.signCateCode}</td>
                                        <td className="p-2">{document.title}</td>
                                        <td className="p-2">{document.startDate}</td>
                                        <td className="p-2">{document.endDate}</td>
                                        <td className="p-2">
                                            {target.split(',')[0]?.split('_')[1] || '없음'}
                                            {target.split(',')[1]? (" > "+target.split(',')[1].split('_')[1]) : ""}
                                            {target.split(',')[2]? (" > "+target.split(',')[2].split('_')[1]) : ""}
                                            {target.split(',')[3]? (" > "+target.split(',')[3].split('_')[1]) : ""}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>


                    {/* Create document button */}
                    <button
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                        onClick={goSignRequest}
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
        </div>
    );

}