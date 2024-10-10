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

export default function EmailClient({ emails, setEmails, trash, setTrash}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [checkedEmails, setCheckedEmails] = useState([]); // 체크된 이메일 상태
    const navigate = useNavigate();

    const handleMailClick = (id) => {
        navigate(`/mail/${id}`);
    };

    const handleCheckboxChange = (event, emailId) => {
        event.stopPropagation(); // 클릭 이벤트가 상위로 전파되지 않도록 설정
        setCheckedEmails((prev) =>
            prev.includes(emailId) ? prev.filter((id) => id !== emailId) : [...prev, emailId]
        );
    };

    // 이메일 삭제
    const handleDelete = () => {
        const emailsToTrash = emails.filter((email) => checkedEmails.includes(email.id));  // 선택된 이메일 필터링
        setTrash([...trash, ...emailsToTrash]);  // 휴지통 상태에 선택된 이메일 추가
        setEmails(emails.filter((email) => !checkedEmails.includes(email.id)));  // 이메일 목록에서 선택된 이메일 삭제
        setCheckedEmails([]);  // 선택된 이메일 초기화
        navigate('/trash');  // 휴지통 페이지로 이동
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
                            <div className="ml-8 shandleDelete pace-y-2 mt-2">
                                <Button variant="ghost" className="w-full">카테고리 1</Button>
                                <Button variant="ghost" className="w-full">카테고리 2</Button>
                            </div>
                        )}
                    </div>
                    <Button variant="ghost" className="w-full" onClick={() => navigate('/trash')}>휴지통</Button>
                </aside>
                <main className="flex-1 p-4">
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="relative flex flex-1 max-w-xl">
                            <Input type="text" placeholder="메일 검색 칸" className="pl-10 pr-4 py-2 w-full"/>
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
                        </div>
                        <Button variant="outline">검색</Button>
                    </div>
                    <div className="flex justify-end space-x-2 mb-4">
                        <Button variant="outline" onClick={() => navigate('/mail/send')}>답장</Button>
                        <Button variant="outline" onClick={handleDelete}>삭제</Button>
                    </div>

            <h1 className="text-2xl font-bold mb-4">받은메일함</h1>
                    <div className="space-y-2">
                        {emails.map((email) => (
                            <div
                                key={email.id}
                                className="flex items-center space-x-4 p-2 border rounded cursor-pointer"
                                onChange={() => handleCheckboxChange(email.id)}
                                onClick={() => handleMailClick(email.id)} // 제목 클릭 시 페이지 이동
                            >
                                <input
                                    type="checkbox"
                                    className="h-4 w-4"
                                    checked={checkedEmails.includes(email.id)}
                                    onChange={(event) => handleCheckboxChange(event, email.id)} // 체크박스 클릭 시 상태만 변경
                                    onClick={(event) => event.stopPropagation()} // 체크박스 클릭 시 상위 클릭 이벤트 전파 방지
                                />
                                <Paperclip className="h-4 w-4 text-gray-400"/>
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