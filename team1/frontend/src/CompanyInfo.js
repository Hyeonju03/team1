import React, {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {AlertTriangle} from 'lucide-react';

import {useAuth} from "./noticeAuth";

export default function SignUpForm() {
    const [empNum, setEmpNum] = useState("");
    const [comCode, setComCode] = useState("");
    const [comInfo, setComInfo] = useState([]);
    const navigate = useNavigate();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const [showMessage, setShowMessage] = useState(false)
    const [permission, setPermission] = useState(false)

    // 로그인
    const {isLoggedIn, empCode, logout} = useAuth();
    const [prevLogin, setPrevLogin] = useState(undefined);   // 이전 로그인 상태를 추적할 변수

    // slide 변수
    const [isPanelOpen, setIsPanelOpen] = useState(false); // 화면 옆 슬라이드

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
                const response = await axios.get("/permissionSelect", {params: {empCode: empCode}})
                console.log(response.data);

                if (response.data === 0) {
                    setPermission(false);
                } else {
                    setPermission(true);
                }

                // 회사데이터 가지고오기
                const comCode = empCode.split("-")[0];
                setComCode(comCode);
                const response2 = await axios.get("/selectComList", {params: {comCode: comCode}});
                console.log(response2);
                setComInfo(response2.data);
                const userNum = response2.data.map(v => v.empNum)
                setEmpNum(userNum)
            }
            fetchData();
        }
        setPrevLogin(isLoggedIn);

    }, [isLoggedIn, empCode]); // isLoggedIn과 empCode 변경 시에만 실행

    useEffect(() => {
        const fetchData = async () => {
            try {
                const comCode = empCode.split("-")[0];
                setComCode(comCode);
                const response = await axios.get("/selectComList", {params: {comCode: comCode}});
                console.log(response);
                setComInfo(response.data);
                const userNum = response.data.map(v => v.empNum)
                setEmpNum(userNum)
            } catch (error) {
                console.error(error);
            }
        };
        if (comCode) {
            fetchData();
        }
    }, [comCode]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/selectStatus", {params: {comCode: comCode}});
                console.log("우엥?", response);

                if (response.data === 1) {
                    setShowMessage(false);
                } else {
                    setShowMessage(true)
                }
            } catch (error) {
                console.error(error)
            }
        }
        if (comCode) {
            fetchData();
            selectEmpNum();
        }
    }, [comCode]);

    //회사직원 몇명?
    const selectEmpNum = async () => {
        try {
            const resp = await axios.get("/selectAllEmpNum", {params: {comCode: comCode}});
            console.log("몇명?", resp);
        } catch (error) {
            console.error(error);
        }
    }

    // 날짜 변환
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = String(date.getFullYear());
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`; // YYYY-MM-DD 형식으로 반환
    };

    // 전화번호
    const handlePhoneNumberChange = (index, value) => {
        const formattedValue = value
            .replace(/[^0-9]/g, '') // 숫자 이외의 문자 제거
            .replace(/(\d{3})(\d)/, '$1-$2') // 첫 3자리 뒤에 대시 추가
            .replace(/(\d{4})(\d)/, '$1-$2') // 다음 3자리 뒤에 대시 추가
            .replace(/(-\d{4})\d+/, '$1'); // 마지막 4자리 제한
        const newComInfo = [...comInfo];
        newComInfo[index].contectPhone = formattedValue;
        setComInfo(newComInfo);
    };

    // 이메일
    const handleEmailChange = (index, value) => {
        const newComInfo = [...comInfo];
        newComInfo[index].comEmail = value;

        // 이메일 유효성 검사
        if (!emailRegex.test(value)) {
            console.warn("유효하지 않은 이메일 주소입니다.");
        }

        setComInfo(newComInfo);
    };

    const goUpdate = async (e) => {
        e.preventDefault();

        // 업데이트할 데이터 준비
        const updatedData = comInfo.map(v => ({
            comName: v.comName,
            ceoName: v.ceoName,
            contectPhone: v.contectPhone,
            comEmail: v.comEmail,
            comCode: v.comCode
        }));

        console.log(updatedData)

        try {
            await axios.put("/updateInfo", updatedData);
            console.log("업데이트 성공!");
            alert("수정완룡")
        } catch (error) {
            console.error("업데이트 실패:", error);
        }
    };

    console.log(comCode)
    const goPayMent = () => {
        navigate("/PaymentCom", {state: {empNum: empNum, comCode: comCode}});
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
        <div>
            <form onSubmit={goUpdate}>
                <div className="w-full">
                    <h2 className="text-2xl font-bold text-center bg-gray-200 py-2"
                        style={{marginBottom: "30px"}}>로고</h2>
                </div>
                <div className=" max-w-4xl mx-auto p-4 rounded-lg">
                    <div style={{marginBottom: "30px"}}>
                        <p className="text-sm text-left">회사정보 관리</p>
                        <p className="text-sm text-left">회사 정보를 확인하고 수정합니다.</p>
                    </div>
                    {comInfo.map((v, i) => (
                        <div className="text-left" key={i} style={{marginBottom: "30px"}}>
                            <p className="flex" style={{marginBottom: "30px"}}>회사명:
                                <input
                                    id="comName"
                                    name="comName"
                                    placeholder={v.comName}
                                    className="border"
                                    style={{marginLeft: "83px", width: "80%"}}
                                    value={v.comName}
                                    onChange={(e) => {
                                        const newComInfo = [...comInfo];
                                        newComInfo[i].comName = e.target.value;
                                        setComInfo(newComInfo);
                                    }}
                                />
                            </p>
                            <div className="flex">
                                <p style={{marginBottom: "30px"}}>사업자등록번호: </p>
                                <p style={{marginLeft: "20px"}}>{v.comCode}</p>
                            </div>
                            <p style={{marginBottom: "30px"}}>대표자:
                                <input
                                    id="ceoName"
                                    name="ceoName"
                                    placeholder={v.ceoName}
                                    className="border"
                                    style={{marginLeft: "83px", width: "80%"}}
                                    value={v.ceoName}
                                    onChange={(e) => {
                                        const newComInfo = [...comInfo];
                                        newComInfo[i].ceoName = e.target.value;
                                        setComInfo(newComInfo);
                                    }}
                                />
                            </p>
                            <p className="flex" style={{marginBottom: "30px"}}>대표번호:
                                <p style={{marginLeft: "70px"}}>{v.ceoPhone}</p>
                            </p>
                            <p style={{marginBottom: "30px"}}>전화번호:
                                <input
                                    id="contectPhone"
                                    name="contectPhone"
                                    placeholder={v.contectPhone}
                                    className="border"
                                    style={{marginLeft: "65px", width: "80%"}}
                                    onChange={(e) => handlePhoneNumberChange(i, e.target.value)}
                                    value={v.contectPhone}
                                />
                            </p>
                            <p style={{marginBottom: "30px"}}>이메일:
                                <input
                                    id="comEmail"
                                    name="comEmail"
                                    placeholder={v.comEmail}
                                    className="border"
                                    style={{marginLeft: "80px", width: "80%"}}
                                    onChange={(e) => handleEmailChange(i, e.target.value)}
                                    value={v.comEmail}
                                />
                            </p>
                            <div className="flex items-center mb-4">
                                <p>직원수:</p>
                                <p style={{marginLeft: "80px"}} className="ml-4">{v.empNum}</p>
                                {v.empNum > 9 && showMessage && (
                                    <div
                                        className="bg-red-100 border border-red-400 text-red-700 p-3 rounded-md ml-4 flex items-center">
                                        <AlertTriangle className="h-5 w-5 mr-2"/>
                                        <span onClick={goPayMent} className="cursor-pointer">주의: 직원 수가 10명 이상입니다. 계속하려면 결제가 필요합니다.</span>
                                    </div>
                                )}
                            </div>

                            <p className="flex" style={{marginBottom: "20px"}}>등록일자:
                                <p style={{marginLeft: "65px"}}>{formatDate(v.registerDate)}</p>
                            </p>
                        </div>
                    ))}
                    <div className="flex justify-center">
                        <button type="submit" style={{marginLeft: "10px"}} className="border rounded-md px-4 py-2">저장
                        </button>
                    </div>
                </div>
            </form>
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
