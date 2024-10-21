import React, {useCallback, useEffect, useState} from 'react'
import axios from "axios";

export default function UserInfo() {
    const [empName, setEmpName] = useState(""); // 이름
    const [department, setDepartment] = useState(""); // 부서코드
    const [position, setPosition] = useState(""); // 직급코드
    const [empRrn, setEmpRrn] = useState(""); // 주민등록번호
    const [empCode, setEmpCode] = useState(""); // 사원코드
    const [empPass, setEmpPass] = useState(""); // 비밀번호
    const [phoneNum, setPhoneNum] = useState(""); // 전화번호
    const [extNum, setExtNum] = useState(""); // 내선번호
    const [empMail, setEmpMail] = useState(""); // 메일
    const [corCode, setCorCode] = useState(""); // 상관코드
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    const empNameOnChangeHandler = useCallback((e) => {
        setEmpName(e.target.value);
    }, []);
    const departmentOnChangeHandler = useCallback((e) => {
        setDepartment(e.target.value);
    }, []);
    const positionOnChangeHandler = useCallback((e) => {
        setPosition(e.target.value);
    }, []);
    const empRrnOnChangeHandler = useCallback((e) => {
        setEmpRrn(e.target.value);
    }, []);
    const empPassOnChangeHandler = useCallback((e) => {
        setEmpPass(e.target.value);
    }, []);
    const phoneNumOnChangeHandler = useCallback((e) => {
        setPhoneNum(e.target.value);
    }, []);
    const extNumOnChangeHandler = useCallback((e) => {
        setExtNum(e.target.value);
    }, []);
    const empMailOnChangeHandler = useCallback((e) => {
        setEmpMail(e.target.value);
    }, []);
    const corCodeOnChangeHandler = useCallback((e) => {
        setCorCode(e.target.value);
    }, []);

    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const empCode = 1111; // 가져올 empCode
        axios.get(`/${empCode}`)
            .then(response => {
                console.log(response.data);
                setUserInfo(response.data);
                // 상태 초기화
                setEmpName(response.data.empName);
                setDepartment(response.data.depCode);
                setPosition(response.data.posCode);
                setEmpRrn(response.data.empRrn);
                setEmpCode(response.data.empCode);
                setEmpPass(response.data.empPass);
                setPhoneNum(response.data.phoneNum);
                setExtNum(response.data.extNum);
                setEmpMail(response.data.empMail);
                setCorCode(response.data.corCode);
            })
            .catch(e => {
                console.error("에러: " + e);

            });
    }, []);


    const goInfoRequest = () => {
        //     현재 값들 가져와서 db에 요청
        const updateUserInfo = {
            empName,
            department,
            position,
            empPass,
            phoneNum,
            extNum,
            empMail,
            corCode,
        };

        axios.post(`/userInfoUpdate`, updateUserInfo)
            .then(response => {
                console.log("수정 요청 성공: ", response.data);
            })
            .catch(error => {
                console.error("수정 요청 실패: ", error)
            });
    };

    // 유효성 검사 확인.
    // 스페이스바 다 무시.

    return (
        <div className="max-w-6xl mx-auto p-5 font-sans">
            <header className="bg-gray-100 p-3 mb-5 text-center">
                <div className="text-2xl font-bold">
                    로고
                </div>
            </header>
            <h1 className="text-2xl font-bold mb-5 pb-3 border-b border-gray-200">
                인사관리
            </h1>
            <div className="bg-white border border-gray-200 rounded-md p-5">
                {/* userInfo가 있을때만 렌더링 */}
                {userInfo ? (
                    <>
                        <h2 className="text-xl mb-4">
                            {userInfo.empName}님 정보 관리
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="mb-2">
                                <label className="block mb-1 text-sm text-gray-600">이름</label>
                                <input type="text"
                                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                                       onChange={empNameOnChangeHandler}
                                       value={empName}/>
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1 text-sm text-gray-600">부서</label>
                                <input type="text"
                                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                                       onChange={departmentOnChangeHandler}
                                       value={department}/>
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1 text-sm text-gray-600">직급</label>
                                <input type="text"
                                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                                       onChange={positionOnChangeHandler}
                                       value={position}/>
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1 text-sm text-gray-600">주민등록번호</label>
                                <input type="text"
                                       readOnly
                                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                                       onChange={empRrnOnChangeHandler}
                                       value={empRrn}/>
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1 text-sm text-gray-600">회원코드</label>
                                <input type="text"
                                       readOnly
                                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                                       value={empCode}/>
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1 text-sm text-gray-600">비밀번호</label>
                                <input type="text"
                                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                                       onChange={empPassOnChangeHandler}
                                       value={empPass}/>
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1 text-sm text-gray-600">전화번호</label>
                                <input type="text"
                                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                                       onChange={phoneNumOnChangeHandler}
                                       value={phoneNum}/>
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1 text-sm text-gray-600">내선번호</label>
                                <input type="text"
                                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                                       onChange={extNumOnChangeHandler}
                                       value={extNum}/>
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1 text-sm text-gray-600">메일</label>
                                <input type="text"
                                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                                       onChange={empMailOnChangeHandler}
                                       value={empMail}/>
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1 text-sm text-gray-600">상관코드</label>
                                <input type="text"
                                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                                       onChange={corCodeOnChangeHandler}
                                       value={corCode}/>
                            </div>
                        </div>
                    </>
                ) : (<p>로딩중...</p>)}
            </div>
            <div className="mt-2">
                <button
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                    onClick={goInfoRequest}
                >
                    수정 요청하기
                </button>
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
                    <h2 className="text-xl font-bold mb-4">로그인</h2>
                    <input type="text" placeholder="아이디" className="w-full p-2 mb-2 border rounded"/>
                    <input type="password" placeholder="비밀번호" className="w-full p-2 mb-4 border rounded"/>
                    <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4">
                        로그인
                    </button>
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
    )
}

// function InputField({ label, value, type = 'text' }) {
//     return (
//         <div className="mb-2">
//             <label className="block mb-1 text-sm text-gray-600">
//                 {label}
//             </label>
//             <input
//                 type={type}
//                 value={value}
//                 readOnly
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
//             />
//         </div>
//     )
// }