import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate 임포트 추가

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

export default function FAQPage() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate(); // useNavigate 훅 사용

    const titleOnChangeHandler = (e) => {
        setTitle(e.target.value);
    }

    const contentOnChangeHandler = (e) => {
        setContent(e.target.value);
    }

    const qComplete = (e) => {
        console.log(title, content);
        e.preventDefault(); // 기본 폼 제출 방지
        navigate("/AdminQDetail");
        window.location.reload();
    }

    const qCancel = (e) => {
        e.preventDefault(); // 기본 링크 동작 방지
        navigate("/AdminQDetail"); // 이동할 페이지로 네비게이트
        window.location.reload();
    }

    const goQDetail =()=>{
        navigate("/AdminQDetail");
        window.location.reload();
    }

    const qRegister = () => {
        navigate("/AdminQ");
        window.location.reload();
    }


    const goFAQ =()=>{
        navigate("/AdminFAQ");
        window.location.reload();
    }



    return (
        <div className="container mx-auto p-4">
            <header className="text-2xl font-bold text-center p-4 bg-gray-200 mb-6">로고</header>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-64 bg-white p-6 shadow-md flex flex-col justify-center items-center"
                     style={{height: "900px"}}>
                    <h2 onClick={goFAQ} className="text-2xl mb-2 cursor-pointer" style={{marginLeft: "-40px" , marginTop:"-200px"}}>
                        <span className="inline-block w-2 h-2 bg-black rounded-full mr-2"
                              style={{marginRight: "15px"}}/>FAQ</h2>
                    <ul className="mb-4 text-center">
                        <li className="text-2xl mb-2">
                            <span className="inline-block w-2 h-2 bg-black rounded-full mr-2"
                                  style={{marginLeft: "5px"}}/> {/* 점 추가 */}
                            1:1 상담
                            <ul className="ml-4">
                                <li onClick={qRegister} className="text-lg cursor-pointer" style={{fontWeight: "400"}}>-
                                    문의작성
                                </li>
                                <li onClick={goQDetail} className="text-lg cursor-pointer" style={{fontWeight: "400"}}>-
                                    문의내역
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <hr className="border-gray-300 my-2 w-full" style={{marginTop:"250px"}}/>
                    <h3 className="text-2xl  mb-2 text-center mt-2">CS 센터</h3>
                    <p className="text-lg mb-2 text-center mt-2" style={{fontWeight: "400"}}>1234-5678</p>
                    <p className="text-lg text-center mt-2">월-금 09:00 ~ 12:00<br/>13:00 ~ 18:00</p>
                    <p className="text-lg mt-2 text-center">(공휴일 휴무)</p>
                </div>

                <div className="flex-1 p-6 mt-16">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-6 text-left">문의작성</h2>
                        <hr className="border-gray-300 my-4 w-full"/>
                        <form className="space-y-4">
                            <div className="flex space-x-8">
                                <label htmlFor="title"
                                       className="block text-xl font-medium text-gray-700 mb-1">제목</label>
                                <Input onChange={titleOnChangeHandler} id="title" placeholder="제목을 입력해주세요."
                                       style={{width: '80%', height: '30px', fontSize: '1.25rem'}}/>
                            </div>
                            <div className="flex space-x-8">
                                <label htmlFor="content"
                                       className="block text-xl font-medium text-gray-700 mb-1">내용</label>
                                <Input onChange={contentOnChangeHandler} id="content" placeholder="내용을 입력해주세요."
                                       style={{width: '80%', height: '500px', fontSize: '1.25rem'}}/>
                            </div>
                            <div className="flex justify-center space-x-4 text-center">
                                <Button onClick={qCancel} variant="outline">취소</Button>
                                <Button onClick={qComplete}>접수</Button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}
