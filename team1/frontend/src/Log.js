import React, { useState } from 'react';

function Button({ children, className, size, variant, onClick }) {
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

function Input({ placeholder, className, onChange }) {
    return (
        <input
            type="text"
            placeholder={placeholder}
            className={`border border-gray-300 p-2 rounded ${className} w-full h-10`} // 입력 필드 높이 설정
            onChange={onChange}
        />
    );
}

function Table({ children }) {
    return (
        <table className="min-w-full border border-gray-300">
            {children}
        </table>
    );
}

function TableHeader({ children }) {
    return <thead className="bg-gray-200">{children}</thead>;
}

function TableBody({ children }) {
    return <tbody>{children}</tbody>;
}

function TableRow({ children }) {
    return <tr className="border-b text-center">{children}</tr>;
}

function TableHead({ children }) {
    return <th className="p-2 border border-gray-300 text-center">{children}</th>;
}

function TableCell({ children, colSpan, className }) {
    return <td colSpan={colSpan} className={`p-2 border border-gray-300 ${className}`}>{children}</td>;
}

export default function Component() {
    const results = [
        { companyName: "회사A", ceo: "홍길동", employeeCount: 50, registrationDate: "2024-01-01", paymentStatus: "완료", logInfo: "로그1", industry: "IT", companyCode: "001" },
        { companyName: "회사B", ceo: "이순신", employeeCount: 100, registrationDate: "2024-02-01", paymentStatus: "대기", logInfo: "로그2", industry: "제조", companyCode: "002" },
    ];

    const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태
    const [searchCriteria, setSearchCriteria] = useState({
        keyword: "",
        ceo: "",
        employeeCount: "",
        paymentStatus: ""
    });

    const categoryOnchangeHandler = (e, field) => {
        setSearchCriteria({
            ...searchCriteria,
            [field]: e.target.value
        });
    };

    const categorysearchButton = () => {
        const filteredResults = results.filter(item => {
            return (
                (searchCriteria.keyword ? item.companyName.includes(searchCriteria.keyword) : true) &&
                (searchCriteria.ceo ? item.ceo.includes(searchCriteria.ceo) : true) &&
                (searchCriteria.employeeCount ? item.employeeCount === Number(searchCriteria.employeeCount) : true) &&
                (searchCriteria.paymentStatus ? item.paymentStatus === searchCriteria.paymentStatus : true)
            );
        });
        setSearchResults(filteredResults);
    };

    const searchButton = () => {
        // 전체 검색 버튼 기능 (필요시 추가)
        setSearchResults(results); // 예시로 모든 결과를 보여줌
    };

    return (
        <div className="container mx-auto p-4 max-w-3xl shadow-md" style={{ height: "900px" }}>
            <h1 className="text-2xl font-bold text-center p-4 bg-gray-200 mb-6">로고</h1>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">회사정보</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {['검색어', '대표자명', '직원수', '결제상태'].map((placeholder, index) => {
                        const field = placeholder === '검색어' ? 'keyword' :
                            placeholder === '대표자명' ? 'ceo' :
                                placeholder === '직원수' ? 'employeeCount' :
                                    'paymentStatus';
                        return (
                            <div className="flex items-center" key={placeholder}>
                                <Input onChange={(e) => categoryOnchangeHandler(e, field)} placeholder={placeholder} className="mr-2" />
                                <Button onClick={categorysearchButton} size="icon" variant="outline" className="flex justify-center items-center">
                                    검색
                                </Button>
                            </div>
                        );
                    })}
                </div>
                <Button className="w-full" onClick={searchButton}>전체 검색하기</Button>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2">검색결과</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>기업명</TableHead>
                            <TableHead>대표자명</TableHead>
                            <TableHead>직원수</TableHead>
                            <TableHead>등록일</TableHead>
                            <TableHead>결제상태</TableHead>
                            <TableHead>로그정보</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {searchResults.length > 0 ? (
                            searchResults.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.companyName}</TableCell>
                                    <TableCell>{item.ceo}</TableCell>
                                    <TableCell>{item.employeeCount}</TableCell>
                                    <TableCell>{item.registrationDate}</TableCell>
                                    <TableCell>{item.paymentStatus}</TableCell>
                                    <TableCell>{item.logInfo}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">검색 결과가 없습니다.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
