import React, {useState} from 'react';
import { useLocation } from 'react-router-dom';

function Button({children, className, size, variant, onClick}) {
    const baseStyle = "rounded"; // padding 제거
    const sizeStyle = size === "icon" ? "h-10 w-12" : "h-10"; // 버튼 높이 및 너비 설정
    const variantStyle = variant === "outline" ? "border border-gray-300 bg-white" : "bg-blue-500 text-white";
    const fontSizeStyle = size === "icon" ? "text-xs" : ""; // 폰트 크기 설정

    return (
        <button className={`${baseStyle} ${sizeStyle} ${variantStyle} ${fontSizeStyle} ${className}`} onClick={onClick}>
            {children}
        </button>
    );
}

function Input({placeholder, className, onChange}) {
    return (
        <input
            type="text"
            placeholder={placeholder}
            className={`border border-gray-300 p-2 rounded ${className} w-full h-10`} // 입력 필드 높이 설정
            onChange={onChange}
        />
    );
}

function Table({children}) {
    return (
        <table className="min-w-full border border-gray-300">
            {children}
        </table>
    );
}

function TableHeader({children}) {
    return <thead className="bg-gray-200">{children}</thead>;
}

function TableBody({children}) {
    return <tbody>{children}</tbody>;
}

function TableRow({children}) {
    return <tr className="border-b text-center">{children}</tr>;
}

function TableHead({children}) {
    return <th className="p-2 border border-gray-300 text-center">{children}</th>;
}

function TableCell({children, colSpan, className}) {
    return <td colSpan={colSpan} className={`p-2 border border-gray-300 ${className}`}>{children}</td>;
}

export default function Component() {
    const location = useLocation();
    const { companyName } = location.state || {};
    const results = [
        { num: "1", who: "홍길동", where: "인사부", what: "김다진 사원 퇴직처리", with: "퇴사처리", logInfo: "로그1"},
        { num: "2", who: "이순신", where: "감사부", what: "홍홍홍 사원 횡령", with: "퇴사처리", logInfo: "로그2"},

    ];
    const [searchResults, setSearchResults] = useState(results); // 검색 결과 상태

    return (
        // <div className="container mx-auto p-4">
        <div className="overflow-hidden flex flex-col min-h-screen w-full  mx-auto p-4  rounded-lg ">
            <h1 className="text-2xl font-bold text-center p-4 bg-gray-200 mb-6">로고</h1>

            <div className="mb-6 ">
                <h2 className="text-xl font-semibold mb-4">{companyName} 로그정보</h2>
            </div>
            <div className="border bg-gray-200  " style={{height: "300px"}}>
                {(searchResults.map((item, index) => (
                        <div key={index}>
                            <p style={{fontSize: "20px"}}>{item.num} {item.who} {item.where} {item.what} {item.with} {item.logInfo}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
