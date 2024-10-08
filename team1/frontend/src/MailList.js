import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Paperclip, Search, Mail } from 'lucide-react';
import {useNavigate} from "react-router-dom";

const Button = ({ variant, className, children, ...props }) => {
    const baseClass = "px-4 py-2 rounded text-left";
    const variantClass = variant === "outline" ? "border border-gray-300" : "text-gray-700";
    return (
        <button className={`${baseClass} ${variantClass} ${className}`} {...props}>
            {children}
        </button>
    );
};

const Input = ({ className, ...props }) => {
    return <input className={`border rounded px-3 py-2 ${className}`} {...props} />;
};

export default function EmailClient() {
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();

    const emails = [
        { id: 1, sender: "김철수", subject: "회의 일정 안내", date: "10.07 14:41" },
        { id: 2, sender: "이영희", subject: "프로젝트 보고서", date: "10.07 11:23" },
        { id: 3, sender: "박지성", subject: "휴가 신청 승인", date: "10.06 17:55" },
        { id: 4, sender: "정민우", subject: "신제품 출시 안내", date: "10.06 09:30" }
    ];

    const handleMailClick = (id) => {
        navigate(`/mail/${id}`);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-gray-200 p-4">
                <h1 className="text-2xl font-bold text-center">로고</h1>
            </header>
            <div className="flex-1 flex">
                <aside className="w-64 bg-gray-100 p-4 space-y-2">
                    <div className="flex space-x-2">
                        <Button variant="outline" className="flex-1">메일쓰기</Button>
                        <Button variant="outline" className="flex-1">내게쓰기</Button>
                    </div>
                    <Button variant="ghost" className="w-full">첨부파일메일함</Button>
                    <Button variant="ghost" className="w-full">받은메일함</Button>
                    <Button variant="ghost" className="w-full">보낸메일함</Button>
                    <Button variant="ghost" className="w-full">내게쓴메일함</Button>
                    <div>
                        <Button
                            variant="ghost"
                            className="w-full flex items-center"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? <ChevronDown className="mr-2 h-4 w-4" /> : <ChevronRight className="mr-2 h-4 w-4" />}
                            <Mail className="mr-2 h-4 w-4" />
                            내 메일함
                        </Button>
                        {isExpanded && (
                            <div className="ml-8 space-y-2 mt-2">
                                <Button variant="ghost" className="w-full">카테고리 1</Button>
                                <Button variant="ghost" className="w-full">카테고리 2</Button>
                            </div>
                        )}
                    </div>
                    <Button variant="ghost" className="w-full">휴지통</Button>
                </aside>
                <main className="flex-1 p-4">
                    <div className="flex justify-between mb-4">
                        <div className="relative flex-1 max-w-xl">
                            <Input type="text" placeholder="메일 검색 칸" className="pl-10 pr-4 py-2 w-full" />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                        <div className="flex space-x-2">
                            <Button variant="outline">답장</Button>
                            <Button variant="outline">삭제</Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {emails.map((email) => (
                            <div
                                key={email.id}
                                className="flex items-center space-x-4 p-2 border rounded cursor-pointer"
                                onClick={() => handleMailClick(email.id)} // 제목 클릭 시 페이지 이동
                            >
                                <input type="checkbox" className="h-4 w-4" />
                                <Paperclip className="h-4 w-4 text-gray-400" />
                                <div className="flex-1">
                                    <div className="font-semibold text-left">{email.sender}</div>
                                    <div className="text-sm text-gray-600 text-left">{email.subject}</div>
                                </div>
                                <div className="text-sm text-gray-500">{email.date}</div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}