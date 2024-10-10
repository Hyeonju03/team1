import React from 'react';

function Button({ children, size, variant, onClick }) {
    const baseStyle = "px-4 py-2 rounded";
    const sizeStyle = size === "sm" ? "text-sm" : "text-base";
    const variantStyle = variant === "outline" ? "border border-gray-300 bg-white" : "bg-blue-500 text-white";

    return (
        <button className={`${baseStyle} ${sizeStyle} ${variantStyle}`} onClick={onClick}>
            {children}
        </button>
    );
}

function Input({ placeholder }) {
    return (
        <input type="text" placeholder={placeholder} className="border border-gray-300 p-2 rounded w-full" />
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

function TableCell({ children }) {
    return <td className="p-2">{children}</td>;
}

export default function Component() {
    return (
        <div className="container mx-auto p-4">
            <header className="text-2xl font-bold text-center p-4 bg-gray-200 mb-6">로고</header>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-64 bg-white p-6 shadow-md flex flex-col justify-center items-center " style={{height:"600px"}}>
                    <h2 className="text-2xl font-bold mb-4 text-center mt-4">FAQ</h2>
                    <h3 className="text-xl font-semibold mb-2 text-center mt-2">1:1 상담</h3>
                    <ul className="mb-4 text-center">
                        <li className="text-lg">- 문의작성</li>
                        <li className="text-lg">- 문의내역</li>
                    </ul>
                    <hr className="border-gray-300 my-2 w-full"/>
                    {/* 구분선 추가 */}
                    <h3 className="text-2xl font-semibold mb-2 text-center mt-2">CS 센터</h3>
                    <p className="text-lg mb-2 text-center mt-2">1234-5678</p>
                    <p className="text-sm text-center mt-2">
                        월-금 09:00 ~ 12:00<br/>
                        13:00 ~ 18:00
                    </p>
                    <p className="text-sm mt-2 text-center">(공휴일 휴무)</p>
                </div>

                <main className="flex-1">
                    <h1 className="text-xl font-bold mb-4 text-left">문의내역</h1>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>번호</TableHead>
                                <TableHead>제목</TableHead>
                                <TableHead>등록일</TableHead>
                                <TableHead>상태</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>1.</TableCell>
                                <TableCell></TableCell>
                                <TableCell>2024.10.02</TableCell>
                                <TableCell>
                                    <Button size="sm" variant="outline">답변대기</Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <div className="flex items-center gap-4 mt-4">
                        <div className="flex-1">
                            <Input placeholder="검색"/>
                        </div>
                        <Button size="icon" variant="outline">
                            <span className="material-icons">검색</span>
                        </Button>
                        <Button variant="outline">삭제</Button>
                        <Button>문의등록</Button>
                    </div>
                </main>
            </div>
        </div>
    );
}
