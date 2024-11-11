import React, {useState} from 'react';
import {ChevronDown, ChevronRight, Mail, Paperclip, Search} from "lucide-react";
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


export default function TrashPage({trash}) { // trash prop을 받아 휴지통의 이메일을 표시
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();

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
                            {isExpanded ? <ChevronDown className="mr-2 h-4 w-4"/> :
                                <ChevronRight className="mr-2 h-4 w-4"/>}
                            <Mail className="mr-2 h-4 w-4"/>
                            내 메일함
                        </Button>
                        {isExpanded && (
                            <div className="ml-8 shandleDelete pace-y-2 mt-2">
                                <Button variant="ghost" className="w-full">카테고리 1</Button>
                                <Button variant="ghost" className="w-full">카테고리 2</Button>
                            </div>
                        )}
                    </div>
                    <Button variant="ghost" className="w-full" onClick={() => navigate('/trash')}>휴지통</Button>
                </aside>
                <main className="flex-1 p-4">
                    <div className="flex justify-between mb-4">
                        <div className="relative flex-1 max-w-xl">
                            <Input type="text" placeholder="메일 검색 칸" className="pl-10 pr-4 py-2 w-full"/>
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
                        </div>
                    </div>
                    <div className="p-4">
                        <h1 className="text-2xl font-bold mb-4">휴지통</h1>
                        {trash.length > 0 ? (
                            <div className="space-y-2">
                                {trash.map((email) => (
                                    <div key={email.id} className="flex items-center space-x-4 p-2 border rounded">
                                        <Paperclip className="h-4 w-4 text-gray-400"/>
                                        <div className="flex-1">
                                            <div className="font-semibold text-left">{email.sender}</div>
                                            <div className="text-sm text-gray-600 text-left">{email.subject}</div>
                                        </div>
                                        <div className="text-sm text-gray-500">{email.date}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>휴지통이 비어 있습니다.</p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}



