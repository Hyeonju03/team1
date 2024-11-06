import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import axios from "axios";
import {useAuth} from "./noticeAuth";


function Button({children, size, variant, onClick}) {


    const baseStyle = "px-4 py-2 rounded";
    const sizeStyle = size === "sm" ? "text-sm" : "text-base";
    const variantStyle = variant === "outline" ? "border border-gray-300 bg-white" : "bg-blue-500 text-white";


    return (
        <button className={`${baseStyle} ${sizeStyle} ${variantStyle}`} onClick={onClick}>
            {children}
        </button>
    );
}

export default function Component() {
    const location = useLocation();
    const {item} = location.state || {qNum: "없음"};
    const navigate = useNavigate();

    const [Qlist, setQList] = useState([])
    const [filterQlist, setFilterQlist] = useState([])

    // 로그인
    const {isLoggedIn, empCode, logout} = useAuth();
    const [prevLogin, setPrevLogin] = useState(undefined);   // 이전 로그인 상태를 추적할 변수

    const [isPanelOpen, setIsPanelOpen] = useState(false); // 화면 옆 슬라이드

    useEffect(() => {
        if (!localStorage.getItem('empCode')) {
            alert("로그인하세요")
            navigate("/"); // 로그인하지 않으면 홈페이지로 이동
        }
    }, [])


    useEffect(() => {
        const fetchData = async () => {
            if (isLoggedIn) {
                try {
                    const response = await axios.get("/QDetailList", {params: {empCode}});
                    const list = response.data;
                    console.log(response.data);

                    // startDate 변환
                    const updatedList = list.map(v => {
                        const date = new Date(v.startDate);
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');

                        return {
                            ...v, // 기존 데이터 유지
                            startDate: `${year}-${month}-${day}`, // 변환된 날짜
                            checked: false
                        };
                    });

                    setQList(updatedList);
                    setFilterQlist(updatedList)
                } catch (error) {
                    console.error(error);
                }
            }
        }
        fetchData();
        setPrevLogin(isLoggedIn);
    }, [isLoggedIn, empCode]); // isLoggedIn과 empCode 변경 시에만 실행


    const goBack = () => {
        navigate(-1)
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


    return (
        <div className="overflow-hidden flex flex-col min-h-screen w-full  mx-auto p-4  rounded-lg ">
            <header className="text-2xl font-bold text-center p-4 bg-gray-200 mb-6 ">로고</header>

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold mb-4 text-left "
                    style={{marginLeft: "375px"}}>{item.qNum} {item.title}</h1>
                <button onClick={goBack} style={{marginRight: "415px", marginTop: "-10px", height: "50px"}}
                        className=" border rounded-md px-4 text-lg font-bold">목록
                </button>
            </div>
            <div className="flex flex-col md:flex-row gap-6" style={{marginLeft: "350px"}}>


                {/*<main className="flex-1">*/}
                <div className="flex"></div>

                <div className="space-y-4">
                    <div className="flex space-x-8">
                        <p className="block text-xl font-medium text-gray-700 mb-1">Q: 내용 </p>
                        <p id="content" className="border-2 border-gray-300 p-2  text-lg"
                           style={{height: '300px', width: '1000px'}}>{item.content}</p>
                    </div>
                    <div className="flex space-x-8">
                        <p className="block text-xl font-medium text-gray-700 mb-1">Q: 등록일</p>
                        <p className="block text-xl font-medium text-gray-700 mb-1">{item.startDate}</p>
                    </div>
                    <div className="flex space-x-8">
                        <p className="block text-xl font-medium text-gray-700 mb-1">A: 제목</p>
                        <p id="title" className="border-2 border-gray-300 p-2  h-8 text-lg"
                           style={{width: '1000px', height: "50px"}}>{item.ansTitle}</p>
                    </div>
                    <div className="flex space-x-8">
                        <p className="block text-xl font-medium text-gray-700 mb-1">A: 내용</p>
                        <p id="content" className="border-2 border-gray-300 p-2  text-lg"
                           style={{height: '300px', width: '1000px'}}>{item.ansContent}</p>
                    </div>
                </div>

                {/*</main>*/}
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
