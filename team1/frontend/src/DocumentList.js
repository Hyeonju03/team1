import React, {useEffect, useState} from 'react';
import {ChevronDown, ChevronRight, Paperclip, Search} from 'lucide-react';
import {useNavigate} from "react-router-dom";
import axios from "axios";

const Button = ({variant, className, children, ...props}) => {
    const baseClass = "px-4 py-2 rounded text-left";
    const variantClass = variant === "outline" ? "border border-gray-300" : "text-gray-700";
    return (
        <button className={`${baseClass} ${variantClass} ${className}`} {...props}>
            {children}
        </button>
    );
};

const Input = ({className, ...props}) => {
    return <input className={`border rounded px-3 py-2 ${className}`} {...props} />;
};

export default function DocumentList() {

    const [isExpanded, setIsExpanded] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [categories, setCategories] = useState([]); // 카테고리 상태 추가
    const [searchQuery, setSearchQuery] = useState(""); // 검색 입력 상태 추가
    const [filteredDocuments, setFilteredDocuments] = useState([]); // 필터링된 문서 상태
    const [selectedDocuments, setSelectedDocuments] = useState([]); // 선택된 문서 상태 추가

    const navigate = useNavigate(); // navigate 함수 사용


    useEffect(() => {
        const comCode = 3118115625; // 회사코드
        // documenttest 테이블에서 문서 가져오기
        axios.get(`/company/${comCode}`)
            .then(response => {
                console.log(response.data);
                setDocuments(response.data);
                setFilteredDocuments(response.data); // 초기값은 전체 문서
            })
            .catch(error => console.log(error));

        // code 테이블에서 카테고리 가져오기
        axios.get(`/code`) // API 엔드포인트를 조정하세요
            .then(response => {
                // console.log(response.data);
                // 응답이 카테고리 배열이라고 가정할 때
                const uniqueCategories = [...new Set(response.data.map(category => category.docCateCode))]; // 중복 제거
                setCategories(uniqueCategories); // 카테고리 상태에 저장
            })
            .catch(error => console.log(error));
    }, []);


    // 문서 제목 클릭 시 상세 페이지로 이동
    const handleDocumentClick = (docNum) => {
        navigate(`/documents/${docNum}`)
    }

    // 날짜 형식 변환
    const formatDate = (dateString) => {
        return dateString.replace("T", " ").slice(0, 16); // LocalDateTime의 기본 형식을 변경
    };

    // 검색 버튼 클릭 시 호출되는 함수
    const handleSearch = () => {
        // 검색어가 포함된 문서를 필터링
        const filtered = documents.filter((doc) =>
            doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || // 제목 검색
            doc.content?.toLowerCase().includes(searchQuery.toLowerCase()) || // 내용 검색 (문서 설명)
            doc.docCateCode?.toLowerCase().includes(searchQuery.toLowerCase()) // 카테고리 검색
        );
        setFilteredDocuments(filtered); // 필터링된 문서로 상태 업데이트
    };

    // 엔터키로 검색
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    }

    const handleCheckboxChange = (docNum) => {
        setSelectedDocuments(prevState => {
            if (prevState.includes(docNum)) {
                return prevState.filter(num => num !== docNum); // 이미 선택된 문서는 해제
            } else {
                return [...prevState, docNum]; // 새로운 문서 선택
            }
        });
    };

    const handleDelete = () => {
        const deletePromises = selectedDocuments.map(docNum =>
            axios.delete(`/documents/${docNum}`) // 실제 삭제 API 호출
        );

        Promise.all(deletePromises)
            .then(() => {
                // 삭제 후 상태 업데이트
                setDocuments(prevDocuments =>
                    prevDocuments.filter(doc => !selectedDocuments.includes(doc.docNum))
                );
                setFilteredDocuments(prevDocuments =>
                    prevDocuments.filter(doc => !selectedDocuments.includes(doc.docNum))
                );
                setSelectedDocuments([]); // 선택된 문서 초기화
            })
            .catch(error => console.log(error));
    };


    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-gray-200 p-4">
                <h1 className="text-2xl font-bold text-center">로고</h1>
            </header>
            <div className="flex-1 flex">
                <aside className="w-64 bg-gray-100 p-4 space-y-2">

                    <div>
                        <Button
                            variant="ghost"
                            className="w-full flex items-center"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? <ChevronDown className="mr-2 h-4 w-4"/> :
                                <ChevronRight className="mr-2 h-4 w-4"/>}
                            {/*<Mail className="mr-2 h-4 w-4"/>*/}
                            문서함
                        </Button>
                        {isExpanded && (
                            <div className="ml-8 space-y-2 pace-y-2 mt-2">
                                {categories.map((category, index) => (
                                    // 각 카테고리를 ','로 나누고 각 항목을 한 줄씩 출력
                                    category.split(',').map((item, subIndex) => (
                                        <Button variant="ghost" className="w-full" key={`${index}-${subIndex}`}>
                                            {item}
                                        </Button>
                                    ))
                                ))}
                            </div>
                        )}
                    </div>

                </aside>
                <main className="flex-1 p-4">
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="relative flex flex-1 max-w-xl">
                            <Input type="text" placeholder="문서 검색 칸" className="pl-10 pr-4 w-full"
                                   value={searchQuery} // 검색 입력값 상태와 연결
                                   onChange={(e) => setSearchQuery(e.target.value)} // 입력값이 변경될 때 상태 업데이트
                                   onKeyDown={handleKeyDown}
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
                        </div>
                        <Button variant="outline" onClick={handleSearch}>검색</Button>
                    </div>
                    <div className="flex justify-end space-x-2 mb-4">
                        <Button variant="outline" onClick={() => navigate('/document/register')}>등록</Button>
                        <Button variant="outline" onClick={handleDelete}>삭제</Button>
                    </div>
                    <h1 className="text-2xl font-bold mb-4">문서함</h1>
                    <div className="space-y-2">
                        {(filteredDocuments.length > 0 ? filteredDocuments : documents).map((document) => (
                            <div
                                key={document.docNum}
                                className="flex items-center space-x-4 p-2 border rounded cursor-pointer"
                                onClick={() => handleDocumentClick(document.docNum)} // 제목 클릭 시 페이지 이동

                            >
                                <input
                                    type="checkbox"
                                    className="h-4 w-4"
                                    onClick={(e) => {
                                        e.stopPropagation(); // 클릭 이벤트 전파 방지
                                        handleCheckboxChange(document.docNum); // 체크박스 상태 변경
                                    }}
                                />
                                <Paperclip className="h-4 w-4 text-gray-400"/>
                                <div className="flex-1">
                                    <div className="font-semibold text-left">{document.title}</div>
                                    <div className="text-sm text-gray-600 text-left">{document.docCateCode}</div>
                                </div>
                                <div className="text-sm text-gray-500">{formatDate(document.startDate)}</div>
                            </div>))}


                        {/*{documents.map((document) => (*/}
                        {/*    <div*/}
                        {/*        key={document.docNum}*/}
                        {/*        className="flex items-center space-x-4 p-2 border rounded cursor-pointer"*/}
                        {/*        onClick={() => handleDocumentClick(document.docNum)} // 제목 클릭 시 페이지 이동*/}

                        {/*    >*/}
                        {/*        <input*/}
                        {/*            type="checkbox"*/}
                        {/*            className="h-4 w-4"*/}
                        {/*            onClick={(e) => e.stopPropagation()} // 클릭 이벤트 전파 방지*/}

                        {/*        />*/}
                        {/*        <Paperclip className="h-4 w-4 text-gray-400"/>*/}
                        {/*        <div className="flex-1">*/}
                        {/*            <div className="font-semibold text-left">{document.title}</div>*/}
                        {/*            <div className="text-sm text-gray-600 text-left">{document.docCateCode}</div>*/}
                        {/*        </div>*/}
                        {/*        <div className="text-sm text-gray-500">{formatDate(document.startDate)}</div>*/}
                        {/*    </div>*/}
                        {/*))}*/}
                    </div>
                </main>
            </div>
        </div>
    );
}