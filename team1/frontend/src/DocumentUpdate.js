import React, {useEffect, useState} from 'react';
import {ChevronDown, ChevronRight} from 'lucide-react';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import useComCode from "hooks/useComCode";
import {useAuth} from "./noticeAuth";

const Button = ({variant, className, children, ...props}) => {
    const baseClass = "px-4 py-2 rounded text-left";
    const variantClass = variant === "outline" ? "border border-gray-300" : "text-gray-700";
    return (<button className={`${baseClass} ${variantClass} ${className}`} {...props}>
        {children}
    </button>);
};

const Input = ({className, ...props}) => {
    return <input className={`border rounded px-3 py-2 ${className}`} {...props} />;
};

export default function DocumentUpdate() {
    const [doc, setDoc] = useState({
        docCateCode: '', title: '', content: '', filename: '', fileOriginName: '', filesize: '', filepath: ''
    });
    const {id} = useParams(); // 여기서 id는 docNum을 의미
    const [isExpanded, setIsExpanded] = useState(true);
    // const [categories, setCategories] = useState([]); // 카테고리 상태 추가
    const [codeCategory] = useComCode();
    const [attachment, setAttachment] = useState(null); // 새로운 첨부파일 상태 추가
    const navigate = useNavigate();
    // 로그인
    const {isLoggedIn, empCode, logout} = useAuth();
    const [prevLogin, setPrevLogin] = useState(undefined);   // 이전 로그인 상태를 추적할 변수
    // slide 변수
    const [isPanelOpen, setIsPanelOpen] = useState(false); // 화면 옆 슬라이드

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    // 문서 정보 및 카테고리 가져오기
    useEffect(() => {
        if (isLoggedIn) {
            axios.get(`/documents/${id}`) // 여기서 id는 docNum 값
                .then(response => {
                    setDoc(response.data);
                })
                .catch(error => console.log(error));

            // code 테이블에서 카테고리 가져오기
            // axios.get(`/code`) // API 엔드포인트를 조정하세요
            //     .then(response => {
            //         // console.log(response.data);
            //         // 응답이 카테고리 배열이라고 가정할 때
            //         const uniqueCategories = [...new Set(response.data.map(category => category.docCateCode))]; // 중복 제거
            //         setCategories(uniqueCategories); // 카테고리 상태에 저장
            //     })
            //     .catch(error => console.log(error));
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

    // 입력된 값 변경하는 것
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setDoc({
            ...doc, [name]: value // 입력된 값을 수정된 상태에 반영
        });
    };

    // 파일 선택 핸들러
    const handleFileChange = (e) => {
        setAttachment(e.target.files[0]);
    };

    // 수정 요청
    const handleUpdate = () => {
        const formData = new FormData();
        formData.append("title", doc.title);
        formData.append("category", doc.docCateCode);
        formData.append("content", doc.content);
        if (attachment) {
            formData.append("attachment", attachment); // 새로운 파일 추가
        }

        axios.put(`/documents/${id}`, formData, {headers: {"Content-Type": "multipart/form-data"}})
            .then((response) => {
                // console.log("response 콘솔 찍은거: ", response)
                alert("성공적으로 수정되었습니다.");
                navigate(`/documents/${id}`); // 수정 후 상세 페이지로 이동
            })
            .catch(error => console.log(error));
    };

    // 취소 버튼 클릭 시 상세 페이지로 이동
    const handleCancel = () => {
        navigate(`/documents/${id}`); // 상세 페이지로 이동
    };

    return (<div className="min-h-screen flex flex-col">
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
                    {isExpanded && (<div className="ml-8 space-y-2 pace-y-2 mt-2">
                        {codeCategory && codeCategory.docCateCode && codeCategory.docCateCode.split(',').map((item, index) => (
                            <Button variant="ghost" className="w-full" key={`${item}`}
                            >
                                {item}
                            </Button>))}
                    </div>)}
                </div>

            </aside>
            <main className="flex-1 p-4">
                <h1 className="text-2xl font-bold mb-4">문서 수정</h1>

                <div className="border rounded-lg p-4">


                    <div className="flex items-center space-x-4 mb-4">
                        <div className="mb-4">
                            <label className="flex justify-start block text-sm font-bold mb-2">카테고리</label>
                            <select
                                name="docCateCode"
                                value={doc.docCateCode}
                                onChange={handleInputChange}
                                className="w-full border rounded px-3 py-2"
                            >
                                {/*<option value="">카테고리를 선택하세요</option>*/}
                                {codeCategory && codeCategory.docCateCode && codeCategory.docCateCode.split(',').map((item, index) => (
                                    <option key={`${item}`} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="flex justify-start block text-sm font-bold mb-2">제목</label>
                            <Input
                                type="text"
                                name="title"
                                value={doc.title}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="flex justify-start block text-sm font-bold mb-2">첨부파일명</label>
                        <input type="file" onChange={handleFileChange}
                               className="w-full border rounded px-3 py-2"/>
                    </div>
                    <div className="mb-4">
                        <label className="flex justify-start block text-sm font-bold mb-2">내용</label>
                        <textarea
                            name="content"
                            value={doc.content}
                            onChange={handleInputChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={handleCancel}>취소</Button>
                    <Button variant="outline" onClick={handleUpdate}>수정</Button>
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
    </div>);
}