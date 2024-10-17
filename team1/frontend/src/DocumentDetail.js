import React, {useCallback, useEffect, useState} from 'react';
import {ChevronDown, ChevronRight, Paperclip, Search, Mail} from 'lucide-react';
import {useNavigate, useParams} from "react-router-dom";
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

export default function DocumentDetail() {
    const [isExpanded, setIsExpanded] = useState(false);
    const {id} = useParams(); // 여기서 id는 docNum을 의미
    const [document, setDocument] = useState(null);
    const [categories, setCategories] = useState([]); // 카테고리 상태 추가

    useEffect(() => {
        axios.get(`/documents/${id}`) // 여기서 id는 docNum 값
            .then(response => {
                setDocument(response.data);
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

    }, [id]);

    if (!document) {
        return <div>문서를 찾을 수 없습니다.</div>; // 문서를 찾을 수 없는 경우의 처리

    }

    const formatDate = (dateString) => {
        return dateString.replace("T", " ").slice(0, 16); // LocalDateTime의 기본 형식을 변경
    };

    const handleDocumentDownload = async (document) => {
        axios.get(`/documents/download/${document.docNum}`) // API 엔드포인트를 조정하세요
            .then(response => {
                console.log(response);
            })
            .catch(error => console.log(error));
    }


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
                            <Input type="text" placeholder="문서 검색 칸" className="pl-10 pr-4 w-full"/>
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
                        </div>
                        <Button variant="outline">검색</Button>
                    </div>

                    <h1 className="text-2xl font-bold mb-4">문서 상세</h1>

                    <div className="border rounded-lg p-4">
                        <div className="flex items-center space-x-4 mb-4">
                            {/*<form>*/}
                            {/*    <fieldset>*/}
                            {/*        /!*<legend>카테고리</legend>*!/*/}
                            {/*        <div>*/}
                            {/*            <select name="cate">*/}
                            {/*                <option value="">문서함</option>*/}
                            {/*                {categories.map((cate, index) => ( // 공통 카테고리 배열 사용*/}
                            {/*                    <option key={index} value={cate}>*/}
                            {/*                        {cate}*/}
                            {/*                    </option>*/}
                            {/*                ))}*/}
                            {/*            </select>*/}
                            {/*        </div>*/}
                            {/*    </fieldset>*/}
                            {/*</form>*/}
                            <div className="text-sm font-bold text-gray-600 text-left">{document.docCateCode}</div>
                            <h2 className="text-2xl font-bold mb-4 text-left">{document.title}</h2>
                        </div>
                        {/*<div className="gap-2 text-sm mb-4">*/}
                        {/*<div className="text-left"><span className="font-semibold">등록일 : </span>{formatDate(document.startDate)}*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        <div className="mb-4">
                            <h3 className="font-semibold mb-2"></h3>
                            <p className="whitespace-pre-wrap text-left"><span
                                className="font-semibold">등록일 : </span>{formatDate(document.startDate)}
                            </p>
                        </div>
                        <div className="mb-4">
                            <h3 className="font-semibold mb-2"></h3>
                            <p className="whitespace-pre-wrap text-left"><span
                                className="font-semibold">첨부파일명 : </span>
                                <span onClick={() => handleDocumentDownload(document)} className={'cursor-pointer text-indigo-700 hover:text-indigo-500'}>{document.fileOriginName}</span>
                                {/*{document.fileOriginName}*/}
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2"></h3>
                            <p className="whitespace-pre-wrap text-left"><span
                                className="font-semibold">설명 : </span>{document.content}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="outline">수정</Button>
                        <Button variant="outline">삭제</Button>
                    </div>
                </main>
            </div>
        </div>
    );
}