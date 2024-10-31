import React, {useCallback, useEffect, useState} from 'react'
import axios from "axios";

export default function UserInfo() {
    const [empName, setEmpName] = useState(""); // 이름
    const [depCode, setDepCode] = useState(""); // 부서코드
    const [posCode, setPosCode] = useState(""); // 직급코드
    const [empRrn, setEmpRrn] = useState(""); // 주민등록번호 (변경불가)
    const [empCode, setEmpCode] = useState(""); // 사원코드 (변경불가)
    const [empPass, setEmpPass] = useState(""); // 비밀번호
    const [phoneNum, setPhoneNum] = useState(""); // 전화번호
    const [extNum, setExtNum] = useState(""); // 내선번호
    const [empMail, setEmpMail] = useState(""); // 메일
    const [corCode, setCorCode] = useState(""); // 상관코드 (필수아님)
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [codeCategory, setCodeCategory] = useState();
    const [userEmpCode, setUserEmpCode] = useState(process.env.REACT_APP_EMP_CODE);
    // 모든 칸에 스페이스바 입력 금지
    const preventSpaceBar = (e) => {
        if (e.key === ' ') {
            e.preventDefault();
        }
    };

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
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
        axios.get(`/${userEmpCode}`)
            .then(response => {
                setUserInfo(response.data);

                if (response.data) {
                    // 상태 초기화
                    setEmpName(response.data.empName || "");
                    setDepCode(response.data.depCode || "");
                    setPosCode(response.data.posCode || "");
                    setEmpRrn(response.data.empRrn || "");
                    setEmpCode(response.data.empCode || "");
                    setEmpPass(response.data.empPass || "");
                    setPhoneNum(response.data.phoneNum || "");
                    setExtNum(response.data.extNum || "");
                    setEmpMail(response.data.empMail || "");
                    setCorCode(response.data.corCode || "");

                    // code 테이블에서 카테고리 가져오기
                    axios.get(`/code/${userEmpCode.split('-')[0]}`)
                        .then(response => {
                            setCodeCategory(response.data);
                        })
                        .catch(error => console.log(error));

                }
            })
            .catch(e => {
                console.error("에러: " + e);
            });

    }, []);

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
        if (!extNum) {
            alert("내선번호를 입력해주세요.");
            return false;
        } else if (!extNumCheck.test(extNum)) {
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
        const currentValue = `${empCode}:${userInfo.empName || '이름 없음'}_${depCode || '부서 없음'}_${posCode || '직급 없음'}_${userInfo.empPass || '비밀번호 없음'}_${userInfo.phoneNum || '전화번호 없음'}_${userInfo.extNum || '내선번호 없음'}_${userInfo.empMail || '메일 없음'}_${userInfo.corCode || '상관코드 없음'}`;

        // 수정된 필드들을 하나의 modifyReq 문자열로 결합
        const modifyReq = `${empCode}:${empName || '이름 없음'}_${userInfo.depCode || '부서 없음'}_${userInfo.posCode || '직급 없음'}_${empPass || '비밀번호 없음'}_${phoneNum || '전화번호 없음'}_${extNum || '내선번호 없음'}_${empMail || '메일 없음'}_${corCode || '상관코드 없음'}`;

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

        console.log("modifyReq 값:", modifyReq);

        axios.post(`/modifyRequest`, userInfoUpdate)
            .then(response => {
                console.log("수정 요청 성공: ", response.data);
                alert("수정 요청이 완료되었습니다.");
            })
            .catch(error => {
                console.error("수정 요청 실패: ", error)
                alert("수정 요청이 실패되었습니다.");
            });
    };

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
                            {empName}님 정보 관리
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="mb-2">
                                <label className="block mb-1 text-sm text-gray-600">이름</label>
                                <input type="text"
                                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                                       onChange={(e) => setEmpName(e.target.value)}
                                       value={empName}
                                       onKeyDown={preventSpaceBar}
                                />

                            </div>
                            <div className="mb-2">
                                <label className="block mb-1 text-sm text-gray-600">부서</label>
                                <select name="userInfoDepartment"
                                        value={userInfo.depCode}
                                        onChange={(e) => setUserInfo({...userInfo, depCode: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800">


                                    {/*codeCategory?*/}
                                    {codeCategory && depCode && codeCategory.depCode.split(',').map((item, index) => (
                                        <option key={`${item}`} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1 text-sm text-gray-600">직급</label>
                                {userInfo && codeCategory && posCode && (
                                    <select
                                        name="userInfoPosCode"
                                        value={userInfo.posCode}
                                        onChange={(e) => setUserInfo({...userInfo, posCode: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                                    >
                                        {codeCategory.posCode.split(',').map((item, index) => (
                                            <option key={`${item}`} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1 text-sm text-gray-600">주민등록번호</label>
                                <input type="text"
                                       readOnly
                                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                                       value={empRrn}/>
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1 text-sm text-gray-600">사원코드</label>
                                <input type="text"
                                       readOnly
                                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                                       value={empCode}/>
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1 text-sm text-gray-600">비밀번호</label>
                                <input type="text"
                                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                                       onChange={(e) => setEmpPass(e.target.value)}
                                       value={empPass}
                                       onKeyDown={preventSpaceBar}/>
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1 text-sm text-gray-600">전화번호</label>
                                <input type="text"
                                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                                       onChange={(e) => setPhoneNum(e.target.value)}
                                       value={phoneNum}
                                       onKeyDown={preventSpaceBar}
                                       placeholder={"000-0000-0000"}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1 text-sm text-gray-600">내선번호</label>
                                <input type="text"
                                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                                       onChange={(e) => setExtNum(e.target.value)}
                                       value={extNum}
                                       onKeyDown={preventSpaceBar}
                                       placeholder={"000-000-0000"}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1 text-sm text-gray-600">메일</label>
                                <input type="text"
                                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                                       onChange={(e) => setEmpMail(e.target.value)}
                                       value={empMail}
                                       onKeyDown={preventSpaceBar}
                                       placeholder={"xxxx@xxxx.xxx"}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1 text-sm text-gray-600">상관코드</label>
                                <input type="text"
                                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                                       onChange={(e) => setCorCode(e.target.value)}
                                       value={corCode}
                                       onKeyDown={preventSpaceBar}
                                />
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
