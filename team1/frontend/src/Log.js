import React from 'react';

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

function Input({ placeholder, className }) {
    return (
        <input
            type="text"
            placeholder={placeholder}
            className={`border border-gray-300 p-2 rounded ${className} w-full h-10`} // 입력 필드 높이 설정
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
    return <tr className="border-b">{children}</tr>;
}

function TableHead({ children }) {
    return <th className="p-2 text-left">{children}</th>;
}

function TableCell({ children, colSpan, className }) {
    return <td colSpan={colSpan} className={`p-2 ${className}`}>{children}</td>;
}

export default function Component() {
    return (
        <div className="container mx-auto p-4 max-w-3xl shadow-md" style={{height:"700px"}}>
            <h1 className="text-2xl font-bold text-center p-4 bg-gray-200 mb-6">로그</h1>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">회사정보</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {['검색어', '업종', '회사코드', '직원수'].map((placeholder) => (
                        <div className="flex items-center" key={placeholder}>
                            <Input placeholder={placeholder} className="mr-2" />
                            <Button size="icon" variant="outline" className="flex justify-center items-center"> {/* 버튼의 너비 조정 */}
                                검색
                            </Button>
                        </div>
                    ))}
                </div>
                <Button className="w-full">검색하기</Button>
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
                        <TableRow>
                            <TableCell colSpan={6} className="text-center">검색 결과가 여기에 표시됩니다.</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
