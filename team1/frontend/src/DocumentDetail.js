import React, {useEffect, useState} from 'react';
import {ChevronDown, ChevronRight} from 'lucide-react';
import {useNavigate, useParams} from "react-router-dom";
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

export default function DocumentDetail() {
    const [isExpanded, setIsExpanded] = useState(true);
    const {id} = useParams(); // 여기서 id는 docNum을 의미
    const [doc, setDoc] = useState(null);
    // const [codeCategory, setCodeCategory] = useState([]); // 카테고리 상태 추가
    const [codeCategory] = useComCode();
    const [loading, setLoading] = useState(true); // 상세 페이지 로딩 상태 추가
    const navigate = useNavigate();
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
            async function documentDetail() {
                try {
                    const response = await axios.get(`/documents/${id}`) // 여기서 id는 docNum 값
                    setDoc(response.data);
                } catch (e) {
                    console.error(e);
                } finally {
                    setLoading(false); // 로딩이 끝남
                }
            }

            documentDetail();
        }
        // 상태 변경 후 이전 상태를 현재 상태로 설정
        setPrevLogin(isLoggedIn);
    }, [id, isLoggedIn, empCode]);

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

    // 문서가 로딩 중일 때는 아무것도 표시하지 않음
    if (loading) {
        return null;
    }

    // 문서를 찾을 수 없는 경우의 처리
    if (!doc) {
        return null; // 문서가 없을 경우도 아무것도 표시하지 않음
    }

    const formatDate = (dateString) => {
        return dateString.replace("T", " ").slice(0, 16); // LocalDateTime의 기본 형식을 변경
    };

    const fileDownload = (blobData, fileName) => {
        const url = window.URL.createObjectURL(blobData);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.fileOriginName;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        a.remove();
    }

    const handleDocumentDownload = async (doc) => {
        try {
            const response = await axios({
                method: "get",
                url: `/documents/download/${doc.docNum}`,
                responseType: "blob"
            });
            fileDownload(response.data, doc.fileOriginName);
        } catch (e) {
            console.error(e);
        }
        // 2번째 방법
        // axios.get(`/documents/download/${document.docNum}`) // API 엔드포인트를 조정하세요
        //     .then(response => {
        //         console.log(response);
        //     })
        //     .catch(error => console.log(error));
    }

    // 수정
    const handleUpdateClick = () => {
        if (auth == '2' || auth == '4' || auth == '6' || auth == '7') {
            navigate(`/documents/update/${id}`);
        } else {
            alert("문서를 수정할 수 있는 권한이 없습니다.");
        }
    };

    // 삭제
    const handleDeleteClick = async () => {
        if (auth == '3' || auth == '5' || auth == '6' || auth == '7') {
            try {
                await axios.delete(`/documents/${id}`)
                navigate(`/documents/`); // 삭제 후 문서 리스트로 이동
                alert("성공적으로 삭제되었습니다.")

            } catch (e) {
                console.error(e);
                alert("삭제에 실패했습니다.");
            }
        } else {
            alert("문서를 삭제할 수 있는 권한이 없습니다.");
        }
    };

    // 목록 버튼 클릭 시 리스트 페이지로 이동
    const handleHome = () => {
        navigate(`/documents/`);
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
                                {codeCategory && codeCategory.docCateCode && codeCategory.docCateCode.split(',').map((item, index) => (
                                        <Button variant="ghost" className="w-full" key={`${item}`}>
                                            {item}
                                        </Button>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                </aside>
                <main className="flex-1 p-4">
                    <div className="flex justify-start space-x-2 mb-4">
                        <Button variant="outline" onClick={handleHome}>목록</Button>
                    </div>
                    <h1 className="text-2xl font-bold mb-4">문서 상세</h1>

                    <div className="border rounded-lg p-4">
                        <div className="flex items-center space-x-4 mb-4">

                            <div className="text-sm font-bold text-gray-600 text-left">{doc.docCateCode}</div>
                            <h2 className="text-2xl font-bold mb-4 text-left">{doc.title}</h2>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-semibold mb-2"></h3>
                            <p className="whitespace-pre-wrap text-left"><span
                                className="font-semibold">등록일 : </span>{formatDate(doc.startDate)}
                            </p>
                        </div>
                        <div className="mb-4">
                            <h3 className="font-semibold mb-2"></h3>
                            <p className="whitespace-pre-wrap text-left"><span
                                className="font-semibold">첨부파일명 : </span>
                                <span onClick={() => handleDocumentDownload(doc)}
                                      className={'cursor-pointer text-indigo-600 hover:text-indigo-500 hover:underline hover:underline-offset-1'}>{doc.fileOriginName}</span>
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2"></h3>
                            <p className="whitespace-pre-wrap text-left"><span
                                className="font-semibold">설명 : </span>{doc.content}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="outline" onClick={handleUpdateClick}>수정</Button>
                        <Button variant="outline" onClick={handleDeleteClick}>삭제</Button>
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