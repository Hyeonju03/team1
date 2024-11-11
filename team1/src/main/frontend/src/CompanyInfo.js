import React, {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {AlertTriangle, ChevronRight} from 'lucide-react';
import Clock from "react-live-clock";

import {useAuth} from "./noticeAuth";

export default function SignUpForm() {
    const [empNum, setEmpNum] = useState("");
    const [selectEmpNumList, setSelectEmpNumList] = useState([]);
    const [comCode, setComCode] = useState("");
    const [comInfo, setComInfo] = useState([]);
    const navigate = useNavigate();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const [showMessage, setShowMessage] = useState(false)
    const [permission, setPermission] = useState(false)
    const today = new Date();
    const formattedDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`;

    // 로그인
    const {isLoggedIn, empCode, logout} = useAuth();
    const [userInfo, setUserInfo] = useState([])
    const [btnCtl, setBtnCtl] = useState(0)
    const [isRClick, setIsRClick] = useState(false)
    const [newWindowPosY, setNewWindowPosY] = useState(500)

    // slide 변수
    const [isPanelOpen, setIsPanelOpen] = useState(false); // 화면 옆 슬라이드

    //로그아웃이 맨위로
    useEffect(() => {
        if (!localStorage.getItem('empCode')) {
            alert("로그인하세요")
            navigate("/"); // 로그인하지 않으면 홈페이지로 이동
        }else {
            empInfo();
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

    const empInfo = async () => {
        try{
            const response = await axios.get(`/emp/${empCode}`);
            setUserInfo(response.data);
        }catch (e){
            console.log(e)
        }
    }

    //회사직원 몇명?
    const selectEmpNum = async () => {
        try {
            const resp = await axios.get("/selectAllEmpNum", {params: {comCode: comCode}});
            setSelectEmpNumList(resp.data)
            console.log("몇명?", resp.data);
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
        navigate("/PaymentCom", {state: {empNum: selectEmpNumList, comCode: comCode}});
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
                        <img width="40" height="40"
                             src="https://img.icons8.com/external-tanah-basah-basic-outline-tanah-basah/24/5A5A5A/external-marketing-advertisement-tanah-basah-basic-outline-tanah-basah.png"
                             alt="external-marketing-advertisement-tanah-basah-basic-outline-tanah-basah"
                             onClick={() => {
                                 navigate(`/user/notice/list`)
                             }}/>
                    </div>
                    <div className="mr-5">
                        <img width="40" height="40" src="https://img.icons8.com/ios-filled/50/5A5A5A/help.png"
                             alt="help" onClick={() => {
                            navigate(`/AdminFAQ`)
                        }}/>
                    </div>
                    <div className="mr-5">
                        <img width="40" height="40" src="https://img.icons8.com/windows/32/5A5A5A/home.png"
                             alt="home" onClick={() => {
                            navigate("/")
                        }}/>
                    </div>
                    <div className="mr-16">
                        <img width="45" height="45"
                             src="https://img.icons8.com/ios-glyphs/60/5A5A5A/user-male-circle.png"
                             alt="user-male-circle" onClick={togglePanel}/>
                    </div>
                </header>
            </div>
            <div className="flex-1 flex">
                <div className="fixed h-full">
                    <aside className="mt-14 h-full w-64 bg-gray-200 border-r-2 shadow-lg p-4 space-y-2">
                        <ol>
                            <li>
                                <div>
                                    <button
                                        className={`w-full flex items-center transition-colors duration-300`}
                                    >
                                        <ChevronRight className="mr-2 h-4 w-4"/>
                                        <span className="hover:underline">부서관리</span>

                                    </button>
                                </div>
                            </li>
                        </ol>
                    </aside>
                </div>
                <main className="ml-64 mt-14 flex-1 p-4 w-full h-full sm:w-[80%] md:w-[70%] lg:w-[60%]">
                    <h1 className="text-2xl font-bold mb-4">회사정보관리</h1>
                    <div className="space-y-2">
                        <form onSubmit={goUpdate}>
                            <div className=" max-w-4xl mx-auto p-4 rounded-lg" style={{marginTop: "20px"}}>
                                <div style={{marginBottom: "30px"}}>
                                    <p className="text-sm text-left">회사정보 관리</p>
                                    <p className="text-sm text-left">회사 정보를 확인하고 수정합니다.</p>
                                </div>
                                {comInfo.map((v, i) => {
                                    const empNum = selectEmpNumList;
                                    return (
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
                                                <p style={{marginLeft: "80px"}} className="ml-4">{empNum}</p>
                                                {empNum > 9 && showMessage && (
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
                                    )
                                })}
                                <div className="flex justify-center">
                                    <button type="submit" style={{marginLeft: "10px"}}
                                            className="border rounded-md px-4 py-2">저장
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </main>
            </div>

            {/* Slide-out panel with toggle button */}
            <div className={`${isPanelOpen ? "" : "hidden"}`}>
                <div
                    className="fixed mt-16 top-0 right-0 h-11/12 w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out max-w-xs p-1 rounded-lg border-2 border-gray-300">
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
                                            <p className="">이름: {userInfo.empName}</p>
                                            <p className="">직급: {userInfo.posCode}</p>
                                            <p className="">부서: {userInfo.depCode}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col text-left mb-1">
                                        <p className="">사내 이메일: {userInfo.empMail}</p>
                                        <p className="">전화번호: {userInfo.phoneNum}</p>
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
                                    className="mt-2 w-full h-10 text-white bg-gray-400 hover:bg-gray-500 rounded"
                                    onClick={handleLogout}>로그아웃
                                </button>
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
                                        className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 mb-4">
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
                    className="fixed mt-14 top-0 right-16 transform -translate-x-3 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-gray-300"></div>
            </div>
        </div>
    )
        ;
}