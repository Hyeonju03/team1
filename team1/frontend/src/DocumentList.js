import React, {useState} from 'react';
import {ChevronDown, ChevronRight, Paperclip, Search, Mail} from 'lucide-react';
import {useNavigate} from "react-router-dom";

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
    const navigate = useNavigate(); // navigate 함수 사용

    const documents = [
        {id: 1, title: "문서 제목 1", category: "카테고리 1", date: "2024-10-10 12:00"},
        {id: 2, title: "문서 제목 2", category: "카테고리 2", date: "2024-10-09 13:13"},
        // 추가 문서 ...
    ];

    const handleDocumentClick = (id) => {
        navigate(`/document/detail/${id}`)
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
                            <div className="ml-8 shandleDelete pace-y-2 mt-2">
                                <Button variant="ghost" className="w-full">카테고리 1</Button>
                                <Button variant="ghost" className="w-full">카테고리 2</Button>
                                <Button variant="ghost" className="w-full">카테고리 3</Button>
                                <Button variant="ghost" className="w-full">카테고리 4</Button>
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
                    <div className="flex justify-end space-x-2 mb-4">
                        <Button variant="outline" onClick={() => navigate('/document/register')}>등록</Button>
                        <Button variant="outline">수정</Button>
                        <Button variant="outline">삭제</Button>
                    </div>
                    <h1 className="text-2xl font-bold mb-4">문서함</h1>
                    <div className="space-y-2">
                        {documents.map((document) => (
                            <div
                                key={document.id}
                                className="flex items-center space-x-4 p-2 border rounded cursor-pointer"
                                onClick={() => handleDocumentClick(document.id)} // 제목 클릭 시 페이지 이동

                            >
                                <input
                                    type="checkbox"
                                    className="h-4 w-4"

                                />
                                <Paperclip className="h-4 w-4 text-gray-400"/>
                                <div className="flex-1">
                                    <div className="font-semibold text-left">{document.category}</div>
                                    <div className="text-sm text-gray-600 text-left">{document.title}</div>
                                </div>
                                <div className="text-sm text-gray-500">{document.date}</div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}