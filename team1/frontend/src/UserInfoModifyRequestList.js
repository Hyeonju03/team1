import React, {useEffect, useState} from 'react';
import axios from "axios";
import {ChevronDown, ChevronRight} from "lucide-react";
import {useAuth} from "./noticeAuth";
import Clock from "react-live-clock";
import {useNavigate} from "react-router-dom";
import {useUserContext} from "./UserContext";

export default function UserInfoModifyRequestList() {
    const {isLoggedIn, empCode, logout} = useAuth();
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
            const response = await axios.get("/selectUserInfoList", {params: {empCode}});
            console.log("Subordinates data:", response.data);
            setSubordinates(response.data);
            parseModifyReqData(response.data);
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
    const handleUserClick = (user) => {
        setSelectedUser(user);  // UserContext에 선택된 사용자 저장
        navigate('/UserInfoModifyRequest');  // UserInfoModifyRequest로 이동
    };

    return (
        <div className="min-h-screen flex flex-col">
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
            <div className="flex-1 flex">
                <aside className="w-64 bg-gray-100 p-4 space-y-2">
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
                                                        onClick={() => {
                                                            navigate('/userInfo')
                                                        }}

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
                                                            navigate('/UserInfoModifyRequestList')
                                                        }}
                                                >
                                                    <ChevronRight className="mr-2 h-4 w-4"/>
                                                    <div className="hover:underline">인사정보수정 요청내역</div>
                                                </button>
                                            </div>
                                        </li>
                                    </div>
                                )}
                            </div>
                        </li>
                    </ol>
                </aside>
                <main className="flex-1 p-4">
                    <h1 className="text-2xl font-bold mb-4">인사정보수정 요청내역</h1>
                    <div className="space-y-2">
                        <table className="w-full mb-6 rounded shadow-lg">
                            <thead>
                            <tr className="bg-gray-200">
                                <th className="p-2 text-center">번호</th>
                                <th className="p-2 text-center">부서</th>
                                <th className="p-2 text-center">직급</th>
                                <th className="p-2 text-center">이름</th>
                            </tr>
                            </thead>
                            <tbody>
                            {modifyReqData.map((item, index) => (
                                <tr
                                    className="cursor-pointer hover:bg-gray-100"
                                    key={index}
                                >
                                    <td className="p-2" onClick={() => handleUserClick(item)}>{index + 1}</td>
                                    <td className="p-2" onClick={() => handleUserClick(item)}>{item.depCode}</td>
                                    <td className="p-2" onClick={() => handleUserClick(item)}>{item.posCode}</td>
                                    <td className="p-2" onClick={() => handleUserClick(item)}>{item.empName}</td>
                                </tr>
                            ))}
                            </tbody>

                        </table>
                    </div>
                </main>
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
        </div>
    );
}
