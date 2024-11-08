import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import axios from "axios"; // useNavigate 임포트 추가
import Clock from "react-live-clock";

import {useAuth} from "./noticeAuth";

const Input = ({className, placeholder, ...props}) => (
    <input
        type="text"
        className={`border p-2 rounded ${className}`}
        placeholder={placeholder}
        {...props}
    />
);

const Button = ({variant, children, className, ...props}) => (
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
    const [adminId, setAdminId] = useState("")
    const [permission, setPermission] = useState(false)

    // 로그인
    const {isLoggedIn, empCode, logout} = useAuth();
    const [prevLogin, setPrevLogin] = useState(undefined);   // 이전 로그인 상태를 추적할 변수

    // slide 변수
    const [isPanelOpen, setIsPanelOpen] = useState(false); // 화면 옆 슬라이드


    const today = new Date();
    const formattedDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`;

    const location = useLocation();
    const {item} = location.state || {qNum: "없음"};

    console.log(item)

    //로그아웃이 맨위로
    useEffect(() => {
        if (!localStorage.getItem('empCode')) {
            alert("로그인하세요")
            navigate("/"); // 로그인하지 않으면 홈페이지로 이동
        }
    }, [])


    useEffect(() => {
        if (isLoggedIn) {
            const fetchData = async () => {
                //운영자만 가능함ㅇㅇ
                // const loggedInEmpCode = "kdj";
                // //3148127227-user002 이건 권한없는 그냥 user
                // //kdj 운영자
                // setAdminId(loggedInEmpCode);

                const response = await axios.get(`/selectAdmin`, {params: {adminId: empCode}});
                console.log(response.data)
                setAdminId(response.data);

                if (response.data === 0) {
                    setPermission(false);
                } else {
                    setPermission(true);
                }

            }
            fetchData();
        }
        setPrevLogin(isLoggedIn);

    }, [isLoggedIn, empCode]); // isLoggedIn과 empCode 변경 시에만 실행

    const titleOnChangeHandler = (e) => {
        setTitle(e.target.value);
    }

    const contentOnChangeHandler = (e) => {
        setContent(e.target.value);
    }

    const qComplete = async (e) => {
        e.preventDefault();
        console.log(title, content, item.qnum)
        const send = {ansTitle: title, ansContent: content, qNum: item.qnum}

        try {
            const result = await axios.put('/updateAdminQ', send)
            console.log(result)
            alert("답장완료")
            navigate("/AnsQDetail");
        } catch (error) {
            console.log(error)
        }

    }

    const qCancel = (e) => {
        e.preventDefault(); // 기본 링크 동작 방지
        navigate("/AnsQDetail"); // 이동할 페이지로 네비게이트
    }

    const goCompleteList = () => {
        navigate("/AnsQCompleteList");
    }

    const goNoAnsList = () => {
        navigate("/NoAnsQList");
    }

    const goAnsQList = () => {
        navigate("/AnsQDetail")
    }


    // 로그아웃 처리 함수
    const handleLogout = async () => {
        try {
            await axios.post('/api/employ/logout');
            logout(); // 로그아웃 호출
            navigate("/"); // 로그아웃 후 홈으로 이동
        } catch (error) {
            console.error("로그아웃 중 오류 발생:", error);
        }
    };

//<토글>
    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    if (!permission) {
        return (
            <div className="flex items-center justify-center h-screen">
                <h1 className="text-center text-4xl font-bold text-red-500">권한이 없습니다. 접근할 수 없습니다.</h1>
            </div>
        );
    }

    return (
        <div className="overflow-hidden flex flex-col min-h-screen w-full  mx-auto p-4  rounded-lg ">
            <header className="flex justify-end items-center border-b shadow-md h-[6%] bg-white">
                <div className="flex mr-6">
                    <div className="font-bold mr-1">{formattedDate}</div>
                    <Clock
                        format={'HH:mm:ss'}
                        ticking={true}
                        timezone={'Asia/Seoul'}/>
                </div>
                <div className="mr-5">
                    <img width="40" height="40" src="https://img.icons8.com/windows/32/f87171/home.png"
                         alt="home"/>
                </div>
                <div className="mr-16">
                    <img width="45" height="45"
                         src="https://img.icons8.com/ios-glyphs/60/f87171/user-male-circle.png"
                         alt="user-male-circle" onClick={togglePanel}/>
                </div>
            </header>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-64 bg-white p-6 shadow-md flex flex-col justify-center items-center"
                     style={{height: "auto"}}>
                    <ul className="mb-4 text-center">
                        <li className="text-2xl mb-2 ">
                            <h2 onClick={goAnsQList} className="cursor-pointer">
                            <span className="inline-block w-2 h-2 bg-black rounded-full mr-2"
                                  style={{marginLeft: "5px"}}/> {/* 점 추가 */}
                                1:1 상담</h2>
                            <ul className="ml-4">
                                <li onClick={goNoAnsList} className="text-sm cursor-pointer"
                                    style={{fontWeight: "400", marginTop: "10px", marginBottom: "10px"}}>-
                                    미답변내역
                                </li>
                                <li onClick={goCompleteList} className="text-sm cursor-pointer"
                                    style={{fontWeight: "400", marginLeft: "10px"}}>-
                                    답변완료내역
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <hr className="border-gray-300 my-2 w-full" style={{marginTop: "250px"}}/>
                    <h3 className="text-2xl  mb-2 text-center mt-2">CS 센터</h3>
                    <p className="text-lg mb-2 text-center mt-2" style={{fontWeight: "400"}}>1234-5678</p>
                    <p className="text-lg text-center mt-2">월-금 09:00 ~ 12:00<br/>13:00 ~ 18:00</p>
                    <p className="text-lg mt-2 text-center">(공휴일 휴무)</p>
                </div>


                <div className="flex-1 p-6 mt-16" style={{marginTop: "-10px"}}>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-6 text-left">AnsQ</h2>
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

            {/* Slide-out panel with toggle button */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Panel toggle button */}
                <button
                    onClick={togglePanel}
                    className="absolute top-1/2 -left-6 transform -translate-y-1/2 bg-blue-500 text-white w-6 h-12 flex items-center justify-center rounded-l-md hover:bg-blue-600"
                >
                    {isPanelOpen ? '>' : '<'}
                </button>

                <div className="p-4">
                    {isLoggedIn ? <button onClick={handleLogout}>로그아웃</button>
                        : (<><h2 className="text-xl font-bold mb-4">로그인</h2>
                                <input
                                    type="text"
                                    placeholder="아이디"
                                    className="w-full p-2 mb-2 border rounded"
                                />
                                <input
                                    type="password"
                                    placeholder="비밀번호"
                                    className="w-full p-2 mb-4 border rounded"
                                />
                                <button
                                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4">
                                    로그인
                                </button>
                            </>
                        )}
                    <div className="text-sm text-center mb-4">
                        <a href="#" className="text-blue-600 hover:underline">공지사항</a>
                        <span className="mx-1">|</span>
                        <a href="#" className="text-blue-600 hover:underline">문의사항</a>
                    </div>
                    <h2 className="text-xl font-bold mb-2">메신저</h2>
                    <p>메신저 기능은 준비 중입니다.</p>
                </div>
            </div>

        </div>
    );
}