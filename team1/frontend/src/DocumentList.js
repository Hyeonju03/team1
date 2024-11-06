import React, {useEffect, useState} from 'react';
import {ChevronDown, ChevronRight, Paperclip, Search} from 'lucide-react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import useComCode from "hooks/useComCode";
import {useAuth} from "./noticeAuth";

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

    const [isExpanded, setIsExpanded] = useState(true);
    const [documents, setDocuments] = useState([]);
    // const [codeCategory, setCodeCategory] = useState();
    const [codeCategory] = useComCode();
    const [searchQuery, setSearchQuery] = useState(""); // 검색 입력 상태 추가
    const [filteredDocuments, setFilteredDocuments] = useState([]); // 필터링된 문서 상태
    const [selectedDocuments, setSelectedDocuments] = useState([]); // 선택된 문서 상태 추가
    const [selectedCategory, setSelectedCategory] = useState(''); // 카테고리 상태 변수
    const navigate = useNavigate(); // navigate 함수 사용
    const [comCode, setComCode] = useState(process.env.REACT_APP_COM_CODE);
    // const [empCode, setEmpCode] = useState(process.env.REACT_APP_EMP_CODE);
    const [auth, setAuth] = useState(null);
    // 로그인
    const {isLoggedIn, empCode, logout} = useAuth();
    const [prevLogin, setPrevLogin] = useState(undefined);   // 이전 로그인 상태를 추적할 변수
    // slide 변수
    const [isPanelOpen, setIsPanelOpen] = useState(false); // 화면 옆 슬라이드

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    useEffect(() => {
        if (isLoggedIn) {
            // document 테이블에서 문서 가져오기
            axios.get(`/company/${comCode}`)
                .then(response => {
                    setDocuments(response.data);
                    setFilteredDocuments(response.data); // 초기값은 전체 문서
                })
                .catch(error => console.log(error));
        }
        // 상태 변경 후 이전 상태를 현재 상태로 설정
        setPrevLogin(isLoggedIn);
    }, [isLoggedIn, empCode]); //isLoggedIn과 empCode 변경 시에만 실행

    // 로그아웃 처리 함수
    const handleLogout = async () => {
        try {
            await axios.post('/api/employ/logout');
            logout(); // 로그아웃 호출
            navigate("/"); // 로그아웃 후 홈으로 이동
        } catch (error) {
            console.error("로그아웃 중 오류 발생:", error);
        }
    };

    // 문서 제목 클릭 시 상세 페이지로 이동
    const handleDocumentClick = (docNum) => {
        navigate(`/documents/${docNum}`)
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
        const filtered = documents.filter((doc) => doc.docCateCode === category);
        setFilteredDocuments(filtered); // 필터링된 문서로 상태 업데이트
        if (filtered.length === 0) {
            alert("해당 카테고리 관련 문서를 찾을 수 없습니다.");
        }
    }

    // 체크박스 상태 변화
    const handleCheckboxChange = (docNum) => {
        setSelectedDocuments(prevState => {
            if (prevState.includes(docNum)) {
                return prevState.filter(num => num !== docNum); // 이미 선택된 문서는 해제
            } else {
                return [...prevState, docNum]; // 새로운 문서 선택
            }
        });
    };


    useEffect(() => {
        const fetchAuth = async () => {
            try {
                // 권한 정보 가져오기
                const response = await axios.get(`/authority/document/${empCode}`);
                setAuth(response.data);
            } catch (error) {
                console.error('권한 정보를 가져오는 데 실패했습니다.', error);
            }
        };

        fetchAuth();
    }, [comCode, empCode]);

    /* 0:x, 1:작성, 2: 수정. 3: 삭제, 4:작성+수정, 5:작성+삭제, 6:수정+삭제. 7:전부  */
    // 등록 버튼
    const handleRegister = () => {
        if (auth == '1' || auth == '4' || auth == '5' || auth == '7') {
            navigate('/document/register', {state: {selectedCategory: selectedCategory}});
        } else {
            alert("문서를 등록할 수 있는 권한이 없습니다.");
        }
    }

    // 삭제 버튼
    const handleDelete = () => {
        if (auth == '3' || auth == '5' || auth == '6' || auth == '7') {
            const deletePromises = selectedDocuments.map(docNum =>
                axios.delete(`/documents/${docNum}`)
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
        } else {
            alert("문서를 삭제할 수 있는 권한이 없습니다.");
        }
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
                            문서함
                        </Button>
                        {isExpanded && (
                            <div className="ml-8 space-y-2 pace-y-2 mt-2">
                                {codeCategory && codeCategory.docCateCode && codeCategory.docCateCode.split(',').map((item, index) => (
                                        <Button variant="ghost" className="w-full" key={`${item}`}
                                                onClick={() => handleCategorySelect(item)}>
                                            {item}
                                        </Button>
                                    )
                                )}
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
                        <Button variant="outline"
                                onClick={handleRegister}>등록</Button>
                        <Button variant="outline" onClick={handleDelete}>삭제</Button>
                    </div>
                    <h1 className="text-2xl font-bold mb-4">문서함</h1>
                    <div className="space-y-2">
                        {(filteredDocuments.length > 0 ? filteredDocuments : documents).map((document) => (
                            <div
                                key={document.docNum}
                                className="flex items-center space-x-4 p-2 border rounded"
                                // onClick={() => handleDocumentClick(document.docNum)} // 제목 클릭 시 페이지 이동

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
                                    {/* 제목 클릭시 페이지 이동*/}
                                    <div
                                        className="font-semibold text-left cursor-pointer hover:text-indigo-500 hover:underline hover:underline-offset-1"
                                        onClick={() => handleDocumentClick(document.docNum)}>{document.title}</div>
                                    <div className="text-sm text-gray-600 text-left">{document.docCateCode}</div>
                                </div>
                                <div className="text-sm text-gray-500">{formatDate(document.startDate)}</div>
                            </div>))}
                    </div>
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
                        {isLoggedIn ? <button onClick={handleLogout}>로그아웃</button>
                            : (<><h2 className="text-xl font-bold mb-4">로그인</h2>
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
                                    <button
                                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4">
                                        로그인
                                    </button>
                                </>
                            )}
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