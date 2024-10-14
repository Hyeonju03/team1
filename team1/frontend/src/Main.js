import React from 'react';

export default function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header with centered logo */}
            <header className="bg-gray-200 p-4">
                <div className="container mx-auto flex justify-center items-center h-24">
                    <div className="w-48 h-24 bg-gray-300 flex items-center justify-center">
                        {/* Placeholder for logo image */}
                        <span className="text-gray-600">로고</span>
                        {/* Uncomment below and replace with your actual logo image */}
                        {/* <img
              src="/path-to-your-logo.png"
              alt="로고"
              className="max-w-full max-h-full object-contain"
            /> */}
                    </div>
                </div>
            </header>

            {/* Main content area */}
            <div className="flex-grow flex">
                <main className="flex-grow p-4">
                    <div className="container mx-auto">
                        <h2 className="text-xl font-semibold mb-4">회사설명 (홍보)</h2>
                        <p>여기에 회사 설명 및 홍보 내용을 추가하세요.</p>
                    </div>
                </main>

                {/* Sidebar */}
                <aside className="w-64 p-4 border-l">
                    <div className="mb-4">
                        <input type="text" placeholder="아이디" className="w-full p-2 border mb-2" />
                        <input type="password" placeholder="비밀번호" className="w-full p-2 border mb-2" />
                        <button className="w-full bg-blue-500 text-white p-2 mb-2">로그인</button>
                        <div className="text-sm text-center">
                            <a href="/frontend/src/ApplyForBusiness" className="text-blue-600 hover:underline">
                                공지사항
                            </a>
                            <span className="mx-1">|</span>
                            <a href="/inquiry" className="text-blue-600 hover:underline">
                                문의사항
                            </a>
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
            </div>
        </div>
    );
}