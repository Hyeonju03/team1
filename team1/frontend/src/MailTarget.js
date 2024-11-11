import React, {useEffect, useState} from "react";
import axios from "axios";

export default function SignTarget({onClose, empCode}) {
    const comCode = empCode.split("-")[0];
    console.log(comCode);

    const [selectedItems, setSelectedItems] = useState([]); // 선택된 항목들을 관리
    const [userInfo, setUserInfo] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/selectMailTarget`, {params: {comCode: comCode}});
                setUserInfo(response.data); // 서버에서 받은 데이터로 상태 업데이트
            } catch (error) {
                console.error("데이터 조회 중 오류 발생:", error);
            }
        };
        if (comCode) {
            fetchData(); // comCode가 있을 경우 데이터 호출
        }
    }, [comCode]);

    const handleCheckboxChange = (e, empCode) => {
        if (e.target.checked) {
            // 체크박스가 선택된 경우 selectedItems에 empCode 추가
            setSelectedItems(prevItems => [...prevItems, empCode]);
        } else {
            // 체크박스가 해제된 경우 selectedItems에서 empCode 제거
            setSelectedItems(prevItems => prevItems.filter(item => item !== empCode));
        }
    };

    // 선택된 항목들 로그 출력 (예시: 등록 버튼 클릭 시)
    const goSave = (e) => {
        console.log("선택된 사원들:", selectedItems);
        e.preventDefault();
        onClose(selectedItems);
    };

    return (
        <div className="fixed py-12 transition duration-150 ease-in-out z-10 top-0 right-0 bottom-0 left-0" id="modal">
            <div className="container ml-[570px] mt-[100px] md:w-2/3 max-w-lg bg-white">
                <div className="relative py-8 px-5 md:px-10 shadow-md rounded border-2 bg-white w-[600px] h-[750px]">
                    <h1 className="text-2xl font-bold mt-3 mb-6">주소록</h1>
                    <div className="flex justify-around">
                        <div>
                            <div
                                className="text-left w-[400px] h-[550px] border-2 border-black rounded-[3px] overflow-auto p-2">
                                {userInfo.map((v, i) => (
                                    <div key={i} className="flex items-center mb-4">
                                        {/* 체크박스 */}
                                        <input
                                            type="checkbox"
                                            id={`empCode-${v.empCode}`} // 각 사원별로 id를 다르게 설정
                                            checked={selectedItems.includes(v.empCode)} // 해당 사원이 선택된 상태인지 확인
                                            onChange={(e) => handleCheckboxChange(e, v.empCode)} // 체크박스 변경 시 실행되는 함수
                                            className="mr-2"
                                        />
                                        {/* 사원 정보 */}
                                        <div>
                                            <p className="hidden ">사원코드 : {v.empCode}</p>
                                            <p>이름 : {v.empName}</p>
                                            <p>직급 : {v.posCode}</p>
                                            <p>부서 : {v.depCode}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm"
                                style={{marginTop: "20px"}} onClick={goSave}
                            >
                                등록
                            </button>
                            <button
                                className="focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-gray-400 ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm"
                                onClick={() => onClose()}
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
