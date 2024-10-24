import React, {useEffect, useState} from 'react';
import axios from "axios";

export default function UserInfoModifyRequest() {

    const [subordinates, setSubordinates] = useState([]); // 부하직원 관련 내용
    const [modifyReqData, setModifyReqData] = useState(null); // modifyReq에서 파싱한 데이터


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
        if (subordinates.length > 0) {
            const modifyReq = subordinates[0].modifyReq;

            // modifyReq가 있을 때만 split
            if (modifyReq) {
                // ":" 기준으로 나누기
                const [prefix, data] = modifyReq.split(":"); // ":" 기준으로 앞에꺼는 prefix, 뒤에꺼는 data에 저장

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
                console.log("prefix 값:", prefix);
            }
        }
    }, [subordinates]); // subordinates가 변경될 때마다 실행


    console.log(process.env.REACT_APP_COR_CODE)
    // 반려 버튼 클릭 시
    const handleReject = async () => {
        if (!modifyReqData) return;


        console.log(modifyReqData);

        try {
            // modify_req 값 비우기 요청
            await axios.put(`/userInfo/modifyDelete/${modifyReqData.corCode}`)
            alert("수정 요청이 반려되었습니다.");
        } catch (e) {
            console.error("반려 실패:", e);
            alert("반려 처리 중 오류가 발생했습니다.");
        }
    };


    // 승인 버튼 클릭 시
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
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center mb-6">직원 정보 수정 요청</h1>
            {modifyReqData && (
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
            )}
        </div>
    );
}