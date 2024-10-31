import React, {useEffect, useState} from 'react';
import axios from "axios";

export default function UserInfoModifyRequest() {

    const [subordinates, setSubordinates] = useState([]); // 부하직원 관련 내용
    const [modifyReqData, setModifyReqData] = useState(null); // modifyReq에서 파싱한 데이터
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [hasModifyReq, setHasModifyReq] = useState(false);

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    useEffect(() => {
        // 부하직원 중 수정 요청이 있는지 확인
        const hasRequest = subordinates.some(subordinate => subordinate && subordinate.modifyReq);
        setHasModifyReq(hasRequest);
    }, [subordinates]);


    useEffect(() => {
        const fetchSubordinates = async () => {
            try {
                const response = await axios.get(`/userInfo/${process.env.REACT_APP_COR_CODE}`);
                setSubordinates(response.data);
            } catch (e) {
                console.error(e);
            }
        };
        fetchSubordinates();
    }, []);

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

    // 보류 버튼 클릭 시(인사 정보 수정 x, 수정 요청 내역 유지)
    const handleHold = () => {
        alert("수정 요청이 보류되었습니다.");
    };

    // 반려 버튼 클릭 시(인사 정보 수정 x, 수정 요청 내역 삭제)
    const handleReject = async () => {
        if (!modifyReqData) return;

        try {
            // modify_req 값 비우기 요청
            await axios.put(`/userInfo/modifyDelete/${modifyReqData.corCode}`)
            alert("수정 요청이 반려되었습니다.");
        } catch (e) {
            console.error("반려 실패:", e);
            alert("반려 처리 중 오류가 발생했습니다.");
        }
    };

    // 승인 버튼 클릭 시(인사 정보 수정 o, 수정 요청 내역 삭제)
    const handleApprove = async () => {
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
    };

    return (
        <div className="max-w-6xl mx-auto p-5 bg-white rounded-lg shadow-md">
            <header className="bg-gray-100 p-3 mb-5 text-center">
                <div className="text-2xl font-bold">
                    로고
                </div>
            </header>
            {/* 수정 요청 내역이 있을 때 메인에 "인사관리" 탭에 알림 아이콘 표시 할 때 사용 하고 싶음 */}
            <div className="tabs">
                <div className="tab">
                    <span>인사관리</span>
                    {hasModifyReq && (
                        <span className="notification-icon">🔔</span> // 알림 아이콘으로 대체
                    )}
                </div>
            </div>

            <h1 className="text-2xl font-bold text-center mb-6">직원 정보 수정 요청</h1>
            {modifyReqData ? (
                <div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="empName" className="block text-sm font-medium text-gray-700">이름</label>
                            <input id="empName" type="text" value={modifyReqData.empName} readOnly
                                   className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"/>
                        </div>
                        <div>
                            <label htmlFor="depCode" className="block text-sm font-medium text-gray-700">부서</label>
                            <input id="depCode" type="text" value={modifyReqData.depCode} readOnly
                                   className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"/>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="posCode" className="block text-sm font-medium text-gray-700">직급</label>
                            <input id="posCode" type="text" value={modifyReqData.posCode} readOnly
                                   className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"/>
                        </div>
                        <div>
                            <label htmlFor="empPass" className="block text-sm font-medium text-gray-700">비밀번호</label>
                            <input id="empPass" type="password" value={modifyReqData.empPass} readOnly
                                   className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"/>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="phoneNum" className="block text-sm font-medium text-gray-700">전화번호</label>
                            <input id="phoneNum" type="text" value={modifyReqData.phoneNum} readOnly
                                   className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"/>
                        </div>
                        <div>
                            <label htmlFor="extNum" className="block text-sm font-medium text-gray-700">내선번호</label>
                            <input id="extNum" type="text" value={modifyReqData.extNum} readOnly
                                   className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"/>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="empMail" className="block text-sm font-medium text-gray-700">메일</label>
                            <input id="empMail" type="email" value={modifyReqData.empMail} readOnly
                                   className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"/>
                        </div>
                        <div>
                            <label htmlFor="corCode" className="block text-sm font-medium text-gray-700">상관코드</label>
                            <input id="corCode" type="text" value={modifyReqData.corCode} readOnly
                                   className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"/>
                        </div>
                    </div>
                    <div className="flex justify-evenly">
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
    );
}