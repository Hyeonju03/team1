import React from 'react';

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
    return <tr className="border-b text-center hover:bg-gray-100">{children}</tr>;
}

function TableHead({ children }) {
    return <th className="p-2 border border-gray-300 text-center font-semibold">{children}</th>;
}

function TableCell({ children, colSpan, className }) {
    return (
        <td colSpan={colSpan} className={`p-2 border border-gray-300 ${className}`}>
            {children}
        </td>
    );
}

const SelectCorCodePopup = ({ isOpen, onClose, onConfirm ,corCode }) => {
    if (!isOpen) return null;

    console.log(corCode)
    // Sample data for demonstration
    const companies = [
        { id: "1", name: "Sample Company", ceo: "홍길동", employeeCount: 50, registrationDate: "2024-01-01", paymentStatus: "완료" },
        // 더 많은 기업 정보를 추가할 수 있습니다.
    ];

    const handleSelect = (item) => {
        onConfirm(item);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg w-3/4 max-w-3xl">
                <h2 className="text-xl font-bold text-center mb-4">상관 선택</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>코드</TableHead>
                            <TableHead>이름</TableHead>
                            <TableHead>직급</TableHead>
                            <TableHead>선택</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {corCode.map(item => (
                            <TableRow >
                                <TableCell>{item.EMP_CODE}</TableCell>
                                <TableCell>{item.EMP_NAME}</TableCell>
                                <TableCell>{item.POS_CODE}</TableCell>
                                <TableCell>
                                    <button
                                        onClick={() => handleSelect(item)}
                                        className="px-4 py-2 bg-black  text-white rounded hover:bg-blue-600 transition duration-200"
                                    >
                                        선택
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="flex justify-center mt-6 space-x-2">
                    <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">취소</button>
                    <button onClick={onClose} className="px-4 py-2 bg-black  text-white rounded hover:bg-blue-600 transition duration-200">확인</button>
                </div>
            </div>
        </div>
    );
};

export default SelectCorCodePopup;
