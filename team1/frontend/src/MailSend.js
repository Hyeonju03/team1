import React, {useState} from 'react';
import {ChevronDown, ChevronRight, Paperclip, Search, Mail} from 'lucide-react';

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

export default function EmailSend() {
    const [isExpanded, setIsExpanded] = useState(false);


    const emailData = {
        sender: 'sender@example.com',
        recipient: 'recipient@example.com',
        subject: '회의 일정 안내',
        attachments: ['회의안건.pdf', '참석자명단.xlsx'],
        content: '안녕하세요,\n\n내일 오후 2시에 회의가 예정되어 있습니다. 첨부된 파일을 확인해 주시기 바랍니다.\n\n감사합니다.',
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
                            {isExpanded ? <ChevronDown className="mr-2 h-4 w-4"/> :
                                <ChevronRight className="mr-2 h-4 w-4"/>}
                            <Mail className="mr-2 h-4 w-4"/>
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
                            <Input type="text" placeholder="메일 검색 칸" className="pl-10 pr-4 py-2 w-full"/>
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
                        </div>
                        <div className="flex space-x-2">
                            <Button>보내기</Button>
                        </div>
                    </div>
                    <div className="border rounded-lg p-4">
                        <div className="mb-4">
                            <input
                                type="text"
                                value={emailData.sender}
                                className="w-full p-2 border rounded mb-2"
                                readOnly
                            />
                            <input
                                type="text"
                                value={emailData.recipient}
                                className="w-full p-2 border rounded mb-2"
                                readOnly
                            />
                            <input
                                type="text"
                                value={emailData.subject}
                                className="w-full p-2 border rounded"
                                readOnly
                            />
                        </div>
                        <div className="flex justify-between mb-4 w-full p-2 border rounded">
                            <div className="flex items-center">
                                <Paperclip className="h-5 w-5 mr-2"/>
                                <span className="whitespace-nowrap">첨부파일</span>
                                <input type="file" className="m-1"/>
                            </div>
                            <div>0KB/10MB</div>
                        </div>
                        <textarea
                            value={emailData.content}
                            className="w-full h-64 p-2 border rounded"
                            readOnly
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}

