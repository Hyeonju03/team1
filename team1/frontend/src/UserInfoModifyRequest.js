import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useAuth} from "./noticeAuth";
import Clock from "react-live-clock";
import {useUserContext} from "./UserContext";

export default function UserInfoModifyRequest() {
    const {selectedUser} = useUserContext();

    const [subordinates, setSubordinates] = useState([]); // 부하직원 관련 내용
    const [modifyReqData, setModifyReqData] = useState(null); // modifyReq에서 파싱한 데이터
    // const [hasModifyReq, setHasModifyReq] = useState(false);
    // const [corCode, setCorCode] = useState(process.env.REACT_APP_COR_CODE);
    const [auth, setAuth] = useState(null);
    const navigate = useNavigate();
    // 로그인
    const {isLoggedIn, empCode, logout} = useAuth();
    const [prevLogin, setPrevLogin] = useState(undefined);   // 이전 로그인 상태를 추적할 변수
    // slide 변수
    const [isPanelOpen, setIsPanelOpen] = useState(false); // 화면 옆 슬라이드
    const today = new Date();
    const formattedDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`;

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    // useEffect(() => {
    //     // 부하직원 중 수정 요청이 있는지 확인
    //     const hasRequest = subordinates.some(subordinate => subordinate && subordinate.modifyReq);
    //     setHasModifyReq(hasRequest);
    // }, [subordinates]);

    // 수정 요청 목록 페이지에 버튼의 id에 있는 숫자를 잘라서
    // setIndex(세팅)

    useEffect(() => {
        if (isLoggedIn) {
            const fetchSubordinates = async () => {
                try {
                    const response = await axios.get(`/emp/${empCode}`);
                    console.log("res>",response.data)
                } catch (e) {
                    console.error(e);
                }
            };
            fetchSubordinates();
        }
        // 상태 변경 후 이전 상태를 현재 상태로 설정
        setPrevLogin(isLoggedIn);
    }, [isLoggedIn, empCode]);

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


    // 부하직원이 변경될 때마다
    useEffect(() => {
        if (subordinates.length > 0 && subordinates[0] && subordinates[0].modifyReq) {

            const modifyReq = subordinates[0].modifyReq;

            // modifyReq가 있을 때만 split
            if (modifyReq && modifyReq.includes(":")) {
                // ":" 기준으로 나누기
                const [prefix, data] = modifyReq.split(":"); // ":" 기준으로 앞에꺼는 prefix, 뒤에꺼는 data에 저장

                if (data && data.includes("_")) {
                    // "_" 기준으로 나누기
                    const [empName, depCode, posCode, empPass, phoneNum, extNum, empMail, corCode] = data.split("_");

                    // 파싱한 데이터 설정
                    setModifyReqData({
                        prefix, // 사원코드
                        empName,
                        depCode,
                        posCode,
                        empPass,
                        phoneNum,
                        extNum,
                        empMail,
                        corCode
                    });
                } else {
                    // data가 올바르지 않은 경우
                    setModifyReqData(null);
                }
            } else {
                // modifyReq가 ":"를 포함하지 않는 경우
                setModifyReqData(null);
            }
        } else {
            // subordinates가 없거나 modifyReq가 없는 경우
            setModifyReqData(null);
        }
    }, [subordinates]); // subordinates가 변경될 때마다 실행

    useEffect(() => {
        const fetchAuth = async () => {
            try {
                // 권한 정보 가져오기
                const response = await axios.get(`/authority/userInfo/${empCode}`);
                setAuth(response.data);
            } catch (error) {
                console.error('권한 정보를 가져오는 데 실패했습니다.', error);
            }
        };

        fetchAuth();
    }, [empCode]);

    /* 0:x, 1:조회, 2: 수정. 3: 삭제, 4:조회+수정, 5:조회+삭제, 6:수정+삭제. 7:전부 */
    // 보류 버튼 클릭 시(인사 정보 수정 x, 수정 요청 내역 유지)
    const handleHold = () => {
        if (auth == '2' || auth == '4' || auth == '6' || auth == '7') {
            alert("수정 요청이 보류되었습니다.");
        } else {
            alert("정보를 수정할 수 있는 권한이 없습니다.");
        }
    };

    // 반려 버튼 클릭 시(인사 정보 수정 x, 수정 요청 내역 삭제)
    const handleReject = async () => {
        if (auth == '2' || auth == '4' || auth == '6' || auth == '7') {
            if (!modifyReqData) return;
            try {
                // modify_req 값 비우기 요청
                await axios.put(`/userInfo/modifyDelete/${modifyReqData.corCode}`)
                alert("수정 요청이 반려되었습니다.");
            } catch (e) {
                console.error("반려 실패:", e);
                alert("반려 처리 중 오류가 발생했습니다.");
            }
        } else {
            alert("정보를 수정할 수 있는 권한이 없습니다.");
        }
    };

    // 승인 버튼 클릭 시(인사 정보 수정 o, 수정 요청 내역 삭제)
    const handleApprove = async () => {
        if (auth == '2' || auth == '4' || auth == '6' || auth == '7') {
            if (!modifyReqData) return;
            try {
                // 수정 요청 데이터 전송
                await axios.put(`/userInfo/${modifyReqData.prefix}`, {
                    empName: modifyReqData.empName,
                    depCode: modifyReqData.depCode,
                    posCode: modifyReqData.posCode,
                    empPass: modifyReqData.empPass,
                    phoneNum: modifyReqData.phoneNum,
                    extNum: modifyReqData.extNum,
                    empMail: modifyReqData.empMail,
                    corCode: modifyReqData.corCode
                });
                alert("수정이 완료되었습니다.");
            } catch (e) {
                console.error("수정 실패:", e);
                alert("수정 중 오류가 발생했습니다.");
            }
        } else {
            alert("정보를 수정할 수 있는 권한이 없습니다.");
        }
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
            {/* 수정 요청 내역이 있을 때 메인에 "인사관리" 탭에 알림 아이콘 표시 할 때 사용 하고 싶음 */}
            {/*<div className="tabs">*/}
            {/*    <div className="tab">*/}
            {/*        <span>인사관리</span>*/}
            {/*        {hasModifyReq && (*/}
            {/*            <span className="notification-icon">🔔</span> // 알림 아이콘으로 대체*/}
            {/*        )}*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div className="flex-1 flex">
                <aside className="w-64 bg-gray-100 p-4 space-y-2">
                    <div>
                        <p>사이드 부분</p>
                    </div>
                </aside>
                <main className="w-3/4 mx-auto">
                    <h1 className="text-2xl font-bold mb-5 pb-3 border-b border-gray-200 mt-8">직원 정보 수정 요청</h1>
                    {modifyReqData ? (
                        <div>
                            <div className="grid grid-cols-2 gap-4 mt-14">
                                <div className="mx-10">
                                    <label htmlFor="empName"
                                           className="block text-lg font-medium text-gray-700">이름</label>
                                    <input id="empName" type="text" value={modifyReqData.empName} readOnly
                                           className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-lg"/>
                                </div>
                                <div className="mx-10">
                                    <label htmlFor="depCode"
                                           className="block text-lg font-medium text-gray-700">부서</label>
                                    <input id="depCode" type="text" value={modifyReqData.depCode} readOnly
                                           className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-lg"/>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-14">
                                <div className="mx-10">
                                    <label htmlFor="posCode"
                                           className="block text-lg font-medium text-gray-700">직급</label>
                                    <input id="posCode" type="text" value={modifyReqData.posCode} readOnly
                                           className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-lg"/>
                                </div>
                                <div className="mx-10">
                                    <label htmlFor="empPass"
                                           className="block text-lg font-medium text-gray-700">비밀번호</label>
                                    <input id="empPass" type="password" value={modifyReqData.empPass} readOnly
                                           className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-lg"/>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-14">
                                <div className="mx-10">
                                    <label htmlFor="phoneNum"
                                           className="block text-lg font-medium text-gray-700">전화번호</label>
                                    <input id="phoneNum" type="text" value={modifyReqData.phoneNum} readOnly
                                           className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-lg"/>
                                </div>
                                <div className="mx-10">
                                    <label htmlFor="extNum"
                                           className="block text-lg font-medium text-gray-700">내선번호</label>
                                    <input id="extNum" type="text"
                                           value={modifyReqData.extNum ? modifyReqData.extNum : "내선번호 없음"} readOnly
                                           className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-lg"/>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-14">
                                <div className="mx-10">
                                    <label htmlFor="empMail"
                                           className="block text-lg font-medium text-gray-700">메일</label>
                                    <input id="empMail" type="email" value={modifyReqData.empMail} readOnly
                                           className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-lg"/>
                                </div>
                                <div className="mx-10">
                                    <label htmlFor="corCode"
                                           className="block text-lg font-medium text-gray-700">상관코드</label>
                                    <input id="corCode" type="text" value={modifyReqData.corCode} readOnly
                                           className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-lg"/>
                                </div>
                            </div>
                            <div className="flex justify-evenly mt-14">
                                <button
                                    onClick={handleHold}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
                                    보류
                                </button>
                                <button
                                    onClick={handleReject}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                                    반려
                                </button>
                                <button
                                    onClick={handleApprove}
                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                                    승인
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p> 수정 요청 내역이 없습니다.</p>
                    )}
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