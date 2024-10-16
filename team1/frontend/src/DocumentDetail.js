import React, {useState} from 'react';
import {ChevronDown, ChevronRight, Paperclip, Search, Mail} from 'lucide-react';
import {useNavigate, useParams} from "react-router-dom";

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
    const {id} = useParams(); // URL 파라미터에서 id를 가져옵니다.

    // 모든 문서에 공통으로 사용할 카테고리 목록
    const categories = ["카테고리 1", "카테고리 2", "카테고리 3", "카테고리 4"];

    const documents = [
        {
            id: 1,
            title: "문서 제목 1",
            date: "2024-10-10 12:00",
            attachments: ['문서 양식.xlsx'],
            content: "문서 설명1"
        },
        {
            id: 2,
            title: "문서 제목 2",
            date: "2024-10-12 12:00",
            attachments: ['문서 양식2.xlsx'],
            content: "문서 설명2"
        },

        // 추가 문서 ...
    ];

    // id에 해당하는 문서를 찾습니다.
    const document = documents.find(doc => doc.id === parseInt(id));

    if (!document) {
        return <div>문서를 찾을 수 없습니다.</div>; // 문서를 찾을 수 없는 경우의 처리
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

                    <h1 className="text-2xl font-bold mb-4">문서 상세</h1>

                    <div className="border rounded-lg p-4">
                        <div className="flex items-center space-x-4 mb-4">
                            <form>
                                <fieldset>
                                    {/*<legend>카테고리</legend>*/}
                                    <div>
                                        <select name="cate">
                                            <option value="">문서함</option>
                                            {categories.map((cate, index) => ( // 공통 카테고리 배열 사용
                                                <option key={index} value={cate}>
                                                    {cate}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </fieldset>
                            </form>
                            <h2 className="text-2xl font-bold mb-4 text-left">{document.title}</h2>
                        </div>
                        <div className="gap-2 text-sm mb-4">
                            <div className="text-left"><span className="font-semibold"></span> {document.date}
                            </div>
                        </div>
                        <div className="mb-4">
                            <h3 className="font-semibold mb-2"></h3>
                            <ul>
                                {document.attachments.map((attachment, index) => (
                                    <li key={index} className="flex items-center">
                                        <Paperclip className="h-4 w-4 mr-2"/>
                                        <span>{attachment}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2"></h3>
                            <p className="whitespace-pre-wrap text-left">{document.content}</p>
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