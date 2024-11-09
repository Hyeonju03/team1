import React, {useEffect, useState} from 'react';
import axios from "axios";
import {ChevronDown, ChevronRight} from "lucide-react";
import {useAuth} from "./noticeAuth";
import Clock from "react-live-clock";
import {useNavigate} from "react-router-dom";
import {useUserContext} from "./UserContext";

export default function UserInfoModifyRequestList() {
    const {isLoggedIn, empCode, logout} = useAuth();
    const [btnCtl, setBtnCtl] = useState(0)
    const [isRClick, setIsRClick] = useState(false)
    const [newWindowPosY, setNewWindowPosY] = useState(500)

    const [subordinates, setSubordinates] = useState([]);
    const [modifyReqData, setModifyReqData] = useState([]);
    const {setSelectedUser} = useUserContext();
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const navigate = useNavigate();

    const today = new Date();
    const formattedDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`;

    useEffect(() => {
        console.log("Authentication state:", {isLoggedIn, empCode});
        if (isLoggedIn && empCode) {
            fetchSubordinates();
        }
    }, [isLoggedIn, empCode]);

    const fetchSubordinates = async () => {
        try {
            const response = await axios.get(`/emp/${empCode}`);
            console.log("Subordinates data:", response.data);
            // parseModifyReqData(response.data);
        } catch (error) {
            console.error("Error fetching subordinates:", error);
        }
    };

    const parseModifyReqData = (data) => {
        if (data.length > 0 && data[0].modifyReq) {
            const modifyReq = data[0].modifyReq;

            if (modifyReq.includes(",")) {
                const modifyReqList = modifyReq.split(","); // Split by comma first

                const parsedData = modifyReqList.map(req => {
                    if (req.includes(":")) {
                        const [prefix, dataString] = req.split(":");
                        if (dataString && dataString.includes("_")) {
                            const [empName, depCode, posCode, empPass, phoneNum, extNum, empMail, corCode] = dataString.split("_");
                            return {prefix, empName, depCode, posCode, empPass, phoneNum, extNum, empMail, corCode};
                        }
                    }
                    return null;
                }).filter(item => item !== null); // Filter out any null values

                setModifyReqData(parsedData);
            } else if (modifyReq.includes(":")) {
                const [prefix, dataString] = modifyReq.split(":");
                if (dataString && dataString.includes("_")) {
                    const [empName, depCode, posCode, empPass, phoneNum, extNum, empMail, corCode] = dataString.split("_");
                    setModifyReqData([{
                        prefix, empName, depCode, posCode, empPass, phoneNum, extNum, empMail, corCode
                    }]);
                }
            }
        } else {
            setModifyReqData([]);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('/api/employ/logout');
            logout();
            navigate("/");
        } catch (error) {
            console.error("로그아웃 중 오류 발생:", error);
        }
    };

    const togglePanel = () => setIsPanelOpen(!isPanelOpen);


    // 사용자 클릭 시 상세 페이지로 이동하는 함수
    const handleUserClick = (index) => {
        setSelectedUser(index);  // UserContext에 선택된 사용자 저장
        navigate(`/UserInfoModifyRequest/${index}`);  // UserInfoModifyRequest로 이동
    };

    return (
        <div className="min-h-screen flex flex-col">
            <div className="fixed w-full">
                <header className="w-full flex justify-end items-center border-b shadow-md h-14 bg-white">
                    <div className="flex mr-6">
                        <div className="font-bold mr-1">{formattedDate}</div>
                        <Clock
                            format={'HH:mm:ss'}
                            ticking={true}
                            timezone={'Asia/Seoul'}/>
                    </div>
                    <div className="mr-5">
                        <img width="40" height="40" src="https://img.icons8.com/windows/32/f87171/home.png"
                             alt="home" onClick={() => navigate("/main")}/>
                    </div>
                    <div className="mr-16">
                        <img width="45" height="45"
                             src="https://img.icons8.com/ios-glyphs/60/f87171/user-male-circle.png"
                             alt="user-male-circle" onClick={togglePanel}/>
                    </div>
                </header>
            </div>
            <div className="flex-1 flex">
                <div className="fixed h-full">
                    <aside className="mt-14 h-full w-64 bg-red-200 border-r-2 shadow-lg p-4 space-y-2">
                        <ol>
                            <li>
                                <div>
                                    <button
                                        className={`w-full flex items-center transition-colors duration-300`}
                                        onClick={() => setIsExpanded(!isExpanded)}
                                    >
                                        {isExpanded ? <ChevronDown className="mr-2 h-4 w-4"/> :
                                            <ChevronRight className="mr-2 h-4 w-4"/>}
                                        <span className="hover:underline">인사 정보</span>

                                    </button>
                                    {isExpanded && (
                                        <div className="ml-8 space-y-2 pace-y-2 mt-2">
                                            <li>
                                                <div className="flex justify-between">
                                                    <button className="w-full flex items-center"

                                                    >
                                                        <ChevronRight className="mr-2 h-4 w-4"/>
                                                        <div className="hover:underline">내 인사 정보</div>
                                                    </button>

                                                </div>
                                            </li>
                                            <li>
                                                <div className="flex justify-between">
                                                    <button className="w-full flex items-center"
                                                            onClick={() => {
                                                                navigate('/UserInfoRequestList')
                                                            }}
                                                    >
                                                        <ChevronRight className="mr-2 h-4 w-4"/>
                                                        <div className="hover:underline">정보 수정 요청</div>
                                                    </button>
                                                </div>
                                            </li>
                                        </div>
                                    )}
                                </div>
                            </li>
                        </ol>
                    </aside>
                </div>
                {/* Main content */}
                <main className="ml-64 mt-14 flex-1 p-4 w-full h-full sm:w-[80%] md:w-[70%] lg:w-[60%]">
                    <h1 className="text-left text-2xl font-bold mb-2 pb-3 border-b border-gray-200 mt-2">
                        인사정보 > 승인 요청 목록
                    </h1>
                    <div className="space-y-2">
                        <table className="w-full mb-6 rounded shadow-lg">
                            <thead>
                            <tr className="bg-gray-200">
                                <th className="p-2 text-center w-1/4">번호</th>
                                <th className="p-2 text-center w-3/4">목록</th>
                            </tr>
                            </thead>
                            <tbody>
                            {modifyReqData.map((item, index) => (
                                <tr
                                    className="cursor-pointer hover:bg-gray-100"
                                    key={index}
                                    onClick={() => handleUserClick(item)}
                                >
                                    <td className="p-2 text-center w-1/4" >{index + 1}</td>
                                    <td className="p-2 text-center w-3/4">{item.depCode} {item.empName} {item.posCode}님의 정보 수정 승인 요청입니다.</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            {/* Slide-out panel with toggle button */}
            <div className={`${isPanelOpen ? "" : "hidden"}`}>
                <div
                    className="fixed mt-16 top-0 right-0 h-11/12 w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out max-w-xs p-1 rounded-lg border-2 border-red-300">
                    {/* 내용 부분 */}
                    {/*<div*/}
                    {/*    className={`fixed mt-[55px] top-0 right-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isPanelOpen ? "translate-x-0" : "translate-x-full"}`}*/}
                    {/*>*/}
                    <div className="p-1 h-full">
                        {/*<div className="text-sm text-center">*/}
                        {/*    <a href="#" className="text-blue-600 hover:underline">*/}
                        {/*        공지사항*/}
                        {/*    </a>*/}
                        {/*    <span className="mx-1">|</span>*/}
                        {/*    <a href="#" className="text-blue-600 hover:underline">*/}
                        {/*        문의사항*/}
                        {/*    </a>*/}
                        {/*</div>*/}
                        {isLoggedIn ?
                            <div className="h-full">
                                <div className="h-1/4">
                                    <div className="flex h-3/6">
                                        <div className="w-1/3 ">
                                            <img width="75px" height="75px" src="/logo192.png"/>
                                        </div>
                                        <div className="w-2/3 text-left">
                                            <p className="">이름:</p>
                                            <p className="">직급:</p>
                                            <p className="">부서:</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col text-left mb-1">
                                        <p className="">사내 이메일:</p>
                                        <p className="">전화번호:</p>
                                    </div>


                                    <div className="flex">
                                        <button className="border w-1/5 text-sm p-1"
                                                onClick={() => setBtnCtl(0)}>
                                            조직도
                                        </button>
                                        <button className="border w-1/5 text-sm p-1"
                                                onClick={() => setBtnCtl(1)}>
                                            대화방
                                        </button>
                                        <button className="border w-1/5 text-sm p-1"
                                                onClick={() => setBtnCtl(2)}>
                                            주소록
                                        </button>
                                        <button className="border w-2/5 text-sm p-1"
                                                onClick={() => setBtnCtl(3)}>
                                            공지사항
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <div className="border text-left h-[435px] blue">
                                        {btnCtl === 0 ? (
                                            // ListLibrary.WorkerList(com)
                                            <></>
                                        ) : btnCtl === 1 ? (
                                            <>
                                                <div className="h-[100%] overflow-y-auto">
                                                    <div className="border flex justify-between">
                                                        <button>대화방</button>
                                                        <button>나가기</button>
                                                    </div>
                                                </div>
                                            </>
                                        ) : btnCtl === 2 ? (
                                            <>
                                                {/*<div dangerouslySetInnerHTML={{__html: addressBookHtml}}/>*/}
                                            </>
                                        ) : btnCtl === 3 ? (
                                            <>
                                                {/*<div dangerouslySetInnerHTML={{__html: noticeHtml}}/>*/}
                                                <div>
                                                    <button
                                                        className="text-center border w-full h-[45px]"
                                                        onClick={() => setBtnCtl(6)}>
                                                        {" "}
                                                        공지사항 추가하기
                                                    </button>
                                                </div>
                                            </>
                                        ) : btnCtl === 4 ? (
                                            <>
                                                <div className="h-[480px] overflow-y-auto">
                                                    <ul className="pb-2">
                                                        상대방이름 <li className="pl-4">대화내용 </li>
                                                    </ul>
                                                    <ul className="text-right pb-2">
                                                        사용자이름 <li className="pr-4">대화내요ㅛㅛㅛㅛㅛㅇ </li>
                                                    </ul>
                                                    <ul className="pb-2">
                                                        상대방이름 <li className="pl-4">대화내용 </li>
                                                    </ul>
                                                    <ul className="pb-2">
                                                        상대방이름 <li className="pl-4">대화내용 </li>
                                                    </ul>
                                                    <ul className="pb-2">
                                                        상대방이름 <li className="pl-4">대화내용 </li>
                                                    </ul>
                                                    <ul className="pb-2">
                                                        상대방이름 <li className="pl-4">대화내용 </li>
                                                    </ul>
                                                    <ul className="pb-2">
                                                        상대방이름 <li className="pl-4">대화내용 </li>
                                                    </ul>
                                                    <ul className="pb-2">
                                                        상대방이름 <li className="pl-4">대화내용 </li>
                                                    </ul>
                                                    <ul className="pb-2">
                                                        상대방이름 <li className="pl-4">대화내용 </li>
                                                    </ul>
                                                    <ul className="pb-2">
                                                        상대방이름 <li className="pl-4">대화내용 </li>
                                                    </ul>
                                                    <ul className="pb-2">
                                                        상대방이름 <li className="pl-4">대화내용 </li>
                                                    </ul>
                                                    <ul className="pb-2">
                                                        상대방이름 <li className="pl-4">대화내용 </li>
                                                    </ul>
                                                </div>
                                            </>
                                        ) : btnCtl === 5 ? (
                                            <>
                                                {/*<div dangerouslySetInnerHTML={{__html: loadNoticeHtml}}/>*/}
                                                <div>
                                                    <button
                                                        className="text-center border w-full h-[45px]"
                                                        onClick={() => setBtnCtl(3)}>
                                                        목록으로
                                                    </button>
                                                </div>
                                            </>
                                        ) : btnCtl === 6 ? (
                                            <>
                                                {/*{ListLibrary.noticeWritePage(com, setBtnCtl)}*/}
                                                <button
                                                    className="text-center border w-full h-[45px]"
                                                    onClick={() => {
                                                        setBtnCtl(3);
                                                        // ListLibrary.noticeInsert(user);
                                                    }}
                                                >
                                                    공지사항 등록
                                                </button>
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </div>
                                <button
                                    className="mt-2 w-full h-10 text-white bg-red-400 hover:bg-red-500 rounded"
                                    onClick={handleLogout}>로그아웃</button>
                            </div>
                            : (<><h2 className="mt-2">로그인</h2>
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


                        {isRClick === true ? (
                            <></>
                            // <div className={`flex absolute`}
                            //      style={{top: `${newWindowPosY}px`, right: `${newWindowPosX}px`}}>
                            //     <div className="w-1/3 border">
                            //         <img src="/logo192.png"/>
                            //     </div>
                            //     <div className="w-2/3 text-left border">
                            //         <p>사내 이메일:{newWindowData[0]}</p>
                            //         <p>전화번호:{newWindowData[1]}</p>
                            //         <p>상태:</p>
                            //         <button
                            //             onClick={() => {
                            //                 setIsRClick(false);
                            //                 setNewWindowData([]);
                            //             }}
                            //         >
                            //             닫기
                            //         </button>
                            //     </div>
                            // </div>
                        ) : (
                            <></>
                        )}


                    </div>
                </div>
                <div
                    className="fixed mt-14 top-0 right-16 transform -translate-x-3 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-red-300"></div>
            </div>
        </div>
    );
}
