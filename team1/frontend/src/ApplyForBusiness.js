import React, { useState } from 'react';

// 모의 데이터베이스
const mockDatabase = {
    '1234567890': {
        companyName: '테스트 기업',
        representativeName: '홍길동',
        representativeContact: '010-1234-5678'
    },
    '9876543210': {
        companyName: '샘플 회사',
        representativeName: '김철수',
        representativeContact: '010-8765-4321'
    }
};

export default function ApplyForBusiness() {
    const [businessNumber, setBusinessNumber] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [representativeName, setRepresentativeName] = useState('');
    const [representativeContact, setRepresentativeContact] = useState('');
    const [managerContact, setManagerContact] = useState('');
    const [employeeCount, setEmployeeCount] = useState('');
    const [email, setEmail] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const handleBusinessNumberCheck = () => {
        // 실제 구현에서는 이 부분을 DB 쿼리로 대체
        const info = mockDatabase[businessNumber];

        if (!businessNumber) {
            alert('사업자 번호를 입력해주세요.');
            return;
        }
        if (info) {
            setCompanyName(info.companyName);
            setRepresentativeName(info.representativeName);
            setRepresentativeContact(info.representativeContact);
        } else {
            alert('해당 사업자 번호로 정보를 찾을 수 없습니다.');
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // 여기에 실제 제출 로직을 구현해야 함
        setShowAlert(true);
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header with centered logo */}
            <header className="bg-gray-200 p-4">
                <div className="container mx-auto flex justify-center items-center h-24">
                    <div className="w-48 h-24 bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600">로고</span>
                    </div>
                </div>
            </header>

            {/* Main content area */}
            <div className="flex max-w-screen-lg mx-auto mt-10 p-6 bg-yellow-100 rounded-lg shadow-md relative">
                {/* Form Section */}
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-center mb-6 bg-gray-500 text-white py-2 rounded">사용 등록 신청</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Form Fields */}
                        <div className="flex items-center space-x-2">
                            <label className="w-1/2">사업자 등록번호</label>
                            <div className="flex-1 flex items-center">
                                <input
                                    className="w-3/5 border rounded px-2 py-1"
                                    value={businessNumber}
                                    onChange={(e) => setBusinessNumber(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded ml-3 mt-1"
                                    onClick={handleBusinessNumberCheck}
                                >
                                    확인
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <label className="w-1/2">회사 이름</label>
                            <input
                                className="w-1/2 border rounded px-2 py-1"
                                value={companyName}
                                readOnly
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <label className="w-1/2">대표 이름</label>
                            <input
                                className="w-1/2 border rounded px-2 py-1"
                                value={representativeName}
                                readOnly
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <label className="w-1/2">대표 연락처</label>
                            <input
                                className="w-1/2 border rounded px-2 py-1"
                                value={representativeContact}
                                readOnly
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <label className="w-1/2">담당자 연락처</label>
                            <input
                                className="w-1/2 border rounded px-2 py-1"
                                value={managerContact}
                                onChange={(e) => setManagerContact(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <label className="w-1/2">직원 수</label>
                            <input
                                className="w-1/2 border rounded px-2 py-1"
                                value={employeeCount}
                                onChange={(e) => setEmployeeCount(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <label className="w-1/2">이메일</label>
                            <input
                                className="w-1/2 border rounded px-2 py-1"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-2/3 bg-orange-400 hover:bg-orange-600 text-white mt-6 py-2 rounded"
                        >
                            신청하기
                        </button>
                    </form>
                </div>
            </div>

            {/* Sidebar */}
            <aside className="w-64 p-4 border-l bg-white h-full fixed right-0 top-32">
                <div className="mb-4">
                    <input type="text" placeholder="아이디" className="w-full p-2 border mb-2"/>
                    <input type="password" placeholder="비밀번호" className="w-full p-2 border mb-2"/>
                    <button className="w-full bg-blue-500 text-white p-2 mb-2">로그인</button>
                    <div className="text-sm text-center">
                        <a href="#" className="text-blue-600 hover:underline">공지사항</a>
                        <span className="mx-1">|</span>
                        <a href="#" className="text-blue-600 hover:underline">문의사항</a>
                    </div>
                </div>
                <div className="mb-4">
                    <h3 className="font-semibold mb-2">공지사항</h3>
                    <ul className="list-disc list-inside">
                        <li>첫 번째 공지사항</li>
                        <li>두 번째 공지사항</li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">메신저</h3>
                    <p>메신저 기능은 준비 중입니다.</p>
                </div>
            </aside>

            {/* Alert Modal */}
            {showAlert && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
                        <p className="text-lg mb-4">정상적으로 신청이 등록되었습니다.</p>
                        <button
                            onClick={() => setShowAlert(false)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}