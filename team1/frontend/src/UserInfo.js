import React, {useCallback, useEffect, useState} from 'react'
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useAuth} from "./noticeAuth";
import Clock from "react-live-clock";
import {ChevronDown, ChevronRight} from "lucide-react";

export default function UserInfo() {
    const [empName, setEmpName] = useState(""); // 이름
    const [depCode, setDepCode] = useState(""); // 부서코드
    const [posCode, setPosCode] = useState(""); // 직급코드
    const [empRrn, setEmpRrn] = useState(""); // 주민등록번호 (변경불가)
    const [empCodeValue, setEmpCodeValue] = useState(""); // 사원코드 (변경불가)
    const [empPass, setEmpPass] = useState(""); // 비밀번호
    const [phoneNum, setPhoneNum] = useState(""); // 전화번호
    const [extNum, setExtNum] = useState(""); // 내선번호
    const [empMail, setEmpMail] = useState(""); // 메일
    const [corCode, setCorCode] = useState(""); // 상관코드 (필수아님)
    const [codeCategory, setCodeCategory] = useState();
    // const [userEmpCode, setUserEmpCode] = useState(process.env.REACT_APP_EMP_CODE);
    const navigate = useNavigate();
    // 로그인
    const {isLoggedIn, empCode, logout} = useAuth();
    const [empInfo, setEmpInfo] = useState([])
    const [btnCtl, setBtnCtl] = useState(0)
    const [isRClick, setIsRClick] = useState(false)
    const [newWindowPosY, setNewWindowPosY] = useState(500)

    const [viewPassword, setViewPassword] = useState(false)

    // slide 변수
    const [isPanelOpen, setIsPanelOpen] = useState(false); // 화면 옆 슬라이드
    const today = new Date();
    const formattedDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`;
    const [isExpanded, setIsExpanded] = useState(true);
    // const navigate = useNavigate(); // 경로 navigate

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    // 모든 칸에 스페이스바 입력 금지
    const preventSpaceBar = (e) => {
        if (e.key === ' ') {
            e.preventDefault();
        }
    };

    const [userInfo, setUserInfo] = useState();

    const UserInfoOnChangeHandler = useCallback((e) => {
        if (userInfo) {
            setUserInfo({
                ...userInfo,
                empName: e.target.value,
                depCode: e.target.value,
                posCode: e.target.value,
                empPass: e.target.value,
                phoneNum: e.target.value,
                extNum: e.target.value,
                empMail: e.target.value,
                corCode: e.target.value
            })
        }

    }, [userInfo]);


    useEffect(() => {
        if (isLoggedIn) {
            empUserInfo();
            axios.get(`/emp/${empCode}`)
                .then(response => {
                    setUserInfo(response.data);

                    if (response.data) {
                        // 상태 초기화
                        setEmpName(response.data.empName || "");
                        setDepCode(response.data.depCode || "");
                        setPosCode(response.data.posCode || "");
                        setEmpRrn(response.data.empRrn || "");
                        setEmpCodeValue(response.data.empCode || "");
                        setEmpPass(response.data.empPass || "");
                        setPhoneNum(response.data.phoneNum || "");
                        setExtNum(response.data.extNum || "");
                        setEmpMail(response.data.empMail || "");
                        setCorCode(response.data.corCode || "");

                        // code 테이블에서 카테고리 가져오기
                        axios.get(`/code/${empCode.split('-')[0]}`)
                            .then(response => {
                                setCodeCategory(response.data);
                            })
                            .catch(error => console.log(error));
                    }
                })
                .catch(e => {
                    console.error("에러: " + e);
                });
        }
    }, [isLoggedIn, empCode]);

    const empUserInfo = async () => {
        try{
            const response = await axios.get(`/emp/${empCode}`);
            setEmpInfo(response.data);
        }catch (e){
            console.log(e)
        }
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

    // 유효성체크
    const validateForm = () => {
        if (!empName) {
            alert("이름를 입력해주세요.");
            return false;
        }
        if (!depCode) {
            alert("부서를 입력해주세요.");
            return false;
        }
        if (!posCode) {
            alert("직급을 입력해주세요.");
            return false;

        }
        if (!empPass) {
            alert("비밀번호를 입력해주세요.");
            return false;
        }
        const phoneNumCheck = /^\d{3}-\d{4}-\d{4}$/;
        if (!phoneNum) {
            alert("전화번호를 입력해주세요.");
            return false;
        } else if (!phoneNumCheck.test(phoneNum)) {
            alert("전화번호는 000-0000-0000 형식이어야 합니다.");
            return false;
        }
        const extNumCheck = /^\d{3}-\d{3}-\d{4}$/;
        if (!extNumCheck.test(extNum) && extNum != "") {
            alert("내선번호는 000-000-0000 형식이어야 합니다.");
            return false;
        }
        const empMailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!empMail) {
            alert("이메일을 입력해주세요.");
            return false;
        } else if (!empMailCheck.test(empMail)) {
            alert("유효한 이메일 주소를 입력해주세요");
            return false;
        }
        // 상관코드는 필수 아님
        return true;
    }

    // 수정 요청하기 버튼
    const goInfoRequest = () => {
        // 현재 값들 가져와서 db에 요청

        if (!validateForm()) {
            return;
        }

        // 현재 값 문자열로 결합한 것
        const currentValue = `${empCode}:${userInfo.empName || '이름 없음'}_${userInfo.depCode || '부서 없음'}_${userInfo.posCode || '직급 없음'}_${userInfo.empPass || '비밀번호 없음'}_${userInfo.phoneNum || '전화번호 없음'}_${userInfo.extNum || '내선번호 없음'}_${userInfo.empMail || '메일 없음'}_${userInfo.corCode || '상관코드 없음'}`;

        // 수정된 필드들을 하나의 modifyReq 문자열로 결합
        const modifyReq = `${empCode}:${empName || '이름 없음'}_${depCode || '부서 없음'}_${posCode || '직급 없음'}_${empPass || '비밀번호 없음'}_${phoneNum || '전화번호 없음'}_${extNum || ''}_${empMail || '메일 없음'}_${corCode || '상관코드 없음'}`;

        if (currentValue == modifyReq) {
            alert("수정 전 내용과 동일하여 수정 요청 할 수 없습니다.");
            return;
        }

        // currentValue와 modifyReq가 다를 때만 userInfoUpdate 실행
        const userInfoUpdate = {
            empName: userInfo.empName,
            empCode: userInfo.empCode, // 사원코드도 포함해서 전송
            corCode: userInfo.corCode,
            modifyReq // 수정 요청 정보
        };

        const bool = Boolean(corCode)
        console.log(bool)

        if (bool) {
            axios.post(`/modifyRequest`, userInfoUpdate)
                .then(response => {
                    console.log("수정 요청 성공: ", response.data);
                    alert("수정이 요청이 완료되었습니다.");
                })
                .catch(error => {
                    console.error("수정 요청 실패: ", error)
                    alert("수정 요청이 실패되었습니다.");
                });
        } else {
            axios.put(`/userSelf/${empCode}`, {
                empName: empName,
                depCode: depCode,
                posCode: posCode,
                empPass: empPass,
                phoneNum: phoneNum,
                extNum: extNum,
                empMail: empMail,
                corCode: corCode
            }).then(response => {
                console.log("수정 성공: ", response.data);
                alert("수정이 완료되었습니다.");
            })
                .catch(error => {
                    console.error("수정 실패: ", error)
                    alert("수정 실패되었습니다.");
                });
        }

    };

    const viewPasswordHandler = () => {
        setViewPassword(!viewPassword);
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
                                                        <div className="hover:underline"
                                                             onClick={() => {
                                                                 navigate("/userInfo")
                                                             }}>내 인사 정보
                                                        </div>
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
                        인사정보 > 나의 정보
                    </h1>
                    {/* userInfo가 있을때만 렌더링 */}
                    {userInfo ? (
                        <div className="flex flex-col w-3/5">
                            <div className="border-2 w-full text-left">
                                <div className="pl-10 font-bold my-2">프로필</div>
                                <div className="bg-gray-200 pl-10 flex">
                                    <div className="mr-5">
                                        <img width="90" height="90"
                                             src="https://img.icons8.com/ios-glyphs/90/5A5A5A/user-male-circle.png"
                                             alt="user-male-circle"/>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <div className="flex ">
                                            <input type="text"
                                                   className="text-lg font-bold px-3 py-2 border-b-2 border-gray-800 bg-gray-200 text-gray-800"
                                                   onChange={(e) => setEmpName(e.target.value)}
                                                   value={empName}
                                                   onKeyDown={preventSpaceBar}
                                            />
                                        </div>
                                        <div className="mt-2 ">{empCode}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 border-2 w-full text-left">
                                <div className="pl-10 font-bold my-2">사내정보</div>
                                <div className="bg-gray-200 pl-10 py-4 flex">
                                    <div className="flex flex-col justify-center">
                                        <div className="flex mb-2">
                                            <div className="mt-2">부서</div>
                                            <div className="flex ml-24">
                                                <select name="userInfoDepartment"
                                                        value={depCode}
                                                        onChange={(e) => setDepCode(e.target.value)}
                                                        className="ml-2 px-3 py-2 border-b-2 border-gray-800 bg-gray-200 text-gray-800">
                                                    {codeCategory && depCode && codeCategory.depCode.split(',').map((item, index) => (
                                                        <option key={`${item}`} value={item}
                                                                className="hover:bg-gray-400">
                                                            {item}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex mb-2">
                                            <div className="mt-2">직급</div>
                                            <div className="flex ml-24">
                                                {userInfo && codeCategory && posCode && (
                                                    <select
                                                        name="userInfoPosCode"
                                                        value={posCode}
                                                        onChange={(e) => setPosCode(e.target.value)}
                                                        className="ml-2 px-3 py-2 border-b-2 border-gray-800 bg-gray-200 text-gray-800"
                                                    >
                                                        {codeCategory.posCode.split(',').map((item, index) => (
                                                            <option key={`${item}`} value={item}>
                                                                {item}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex mb-2">
                                            <div className="mt-2">상관코드</div>
                                            <div className="flex ml-16">
                                                <input type="text"
                                                       className="ml-2 px-3 py-2 border-b-2 border-gray-800 bg-gray-200 text-gray-800"
                                                       onChange={(e) => setCorCode(e.target.value)}
                                                       value={corCode}
                                                       onKeyDown={preventSpaceBar}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex mb-2">
                                            <div className="mt-2">주민등록번호</div>
                                            <div className="flex ml-10">
                                                <input type="text"
                                                       readOnly
                                                       className="px-3 py-2 border-b-2 border-gray-800 bg-gray-200 text-gray-800"
                                                       value={empRrn}/>
                                                <p className="text-red-700 mt-2">* 수정불가 </p>
                                            </div>
                                        </div>
                                        <div className="flex mb-2">
                                            <div className="mt-2">비밀번호</div>
                                            <div className="flex ml-16">
                                                <input type="text"
                                                       className="ml-2 px-3 py-2 border-b-2 border-gray-800 bg-gray-200 text-gray-800"
                                                       onChange={(e) => setEmpPass(e.target.value)}
                                                       value={viewPassword ? empPass : empPass.replaceAll(/[a-zA-Z0-9]/g, "*")}
                                                       onKeyDown={preventSpaceBar}/>
                                                <p className="mt-2" onClick={viewPasswordHandler}>
                                                    {viewPassword ? <img width="20" height="20"
                                                                         src="https://img.icons8.com/material/48/visible--v1.png"
                                                                         alt="visible--v1"/> :
                                                        <img width="20" height="20"
                                                             src="https://img.icons8.com/ios-glyphs/30/invisible.png"
                                                             alt="invisible"/>}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex mb-2">
                                            <div className="mt-2">전화번호</div>
                                            <div className="flex ml-16">
                                                <input type="text"
                                                       className="ml-2 px-3 py-2 border-b-2 border-gray-800 bg-gray-200 text-gray-800"
                                                       onChange={(e) => setPhoneNum(e.target.value)}
                                                       value={phoneNum}
                                                       onKeyDown={preventSpaceBar}
                                                       placeholder={"000-0000-0000"}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex mb-2">
                                            <div className="mt-2">내선번호</div>
                                            <div className="flex ml-16">
                                                <input type="text"
                                                       className="ml-2 px-3 py-2 border-b-2 border-gray-800 bg-gray-200 text-gray-800"
                                                       onChange={(e) => setExtNum(e.target.value)}
                                                       value={extNum}
                                                       onKeyDown={preventSpaceBar}
                                                       placeholder={"000-0000-0000"}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex mb-2">
                                            <div className="mt-2">메일</div>
                                            <div className="flex ml-24">
                                                <input type="text"
                                                       className="ml-2 px-3 py-2 border-b-2 border-gray-800 bg-gray-200 text-gray-800"
                                                       onChange={(e) => setEmpMail(e.target.value)}
                                                       value={empMail}
                                                       onKeyDown={preventSpaceBar}
                                                       placeholder={"xxxx@xxxx.xxx"}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <button
                                    className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                                    onClick={goInfoRequest}
                                >
                                    수정 요청하기
                                </button>
                            </div>
                        </div>
                    ) : (<p></p>)}
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
                                            <p className="">이름: {empInfo.empName}</p>
                                            <p className="">직급: {empInfo.posCode}</p>
                                            <p className="">부서: {empInfo.depCode}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col text-left mb-1">
                                        <p className="">사내 이메일: {empInfo.empMail}</p>
                                        <p className="">전화번호: {empInfo.phoneNum}</p>
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
}
