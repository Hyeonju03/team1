import { useState } from 'react';

const Input = ({ className, placeholder, ...props }) => (
    <input
        type="text"
        className={`border p-2 rounded ${className}`}
        placeholder={placeholder}
        {...props}
    />
);

const Button = ({ variant, children, className, ...props }) => (
    <button
        className={`px-4 py-2 rounded ${variant === 'outline' ? 'border' : 'bg-blue-500 text-white'} ${className}`}
        {...props}
    >
        {children}
    </button>
);

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.35-4.35" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const ChevronUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
);

export default function FAQPage() {


    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Logo Section */}
            <div className="bg-gray-200 p-4 text-center">
                <div className="max-w-screen-xl mx-auto">
                    <h1 className="text-2xl font-bold">회사 로고</h1>
                </div>
            </div>

            <div className="flex flex-1">
                {/* Sidebar */}
                <div className="w-64 bg-white p-6 shadow-md flex flex-col justify-center items-center">
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


                {/* Main content */}
                <div className="flex-1 p-6 mt-16">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-6 text-left" style={{marginLeft: "50px"}}>문의작성</h2>
                        <hr className="border-gray-300 my-4 w-full"/>
                        <form className="space-y-4">
                            <div className="flex space-x-8" style={{marginLeft: "50px"}}>
                                <label htmlFor="title" className="block text-xl font-medium text-gray-700 mb-1">
                                    제목
                                </label>
                                <Input id="title" placeholder="제목을 입력해주세요."
                                       style={{width: '80%', height: '30px', fontSize: '1.25rem'}}/>
                            </div>
                            <div className="flex space-x-8" style={{marginLeft: "50px"}}>
                                <label htmlFor="content" className=" block text-xl font-medium text-gray-700 mb-1">
                                    내용
                                </label>
                                <Input id="title" placeholder="내용을 입력해주세요."
                                       style={{width: '80%', height: '500px', fontSize: '1.25rem'}}/>
                            </div>
                            <div className="flex justify-end space-x-4 text-center" style={{justifyContent: "center"}}>
                                <Button variant="outline">취소</Button>
                                <Button>접수</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    )
        ;
}
