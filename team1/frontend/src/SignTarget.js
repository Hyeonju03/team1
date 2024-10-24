import React, {useCallback, useEffect, useRef, useState} from "react";
import {createRoot} from "react-dom/client";
import axios from "axios";
import ListLibrary from "./HtmlFunctions/ListLibrary";

export default function SignTarget({onClose, empCode}) {
    const comCode = 3118115625
    const listContainerRef = useRef(null);
    const [selectedItems, setSelectedItems] = useState([]);


    useEffect(() => {
        const renderList = async () => {
            const listElement = ListLibrary.WorkerList(comCode); // 직접 호출

            if (listContainerRef.current) {
                const root = createRoot(listContainerRef.current); // createRoot 사용
                root.render(listElement); // 요소 렌더링
            }
        };

        renderList();
    }, [comCode]);

    const handleListClick = (event) => {
        const target = event.target;
        const dataValue = target.getAttribute('data-value');

        if (target.tagName === "LI" && dataValue != null) {
            if(empCode == dataValue) {
                alert("본인은 선택할 수 없습니다.")
                return ;
            }
            target.classList.toggle("bg-yellow-200");

            const isSelected = target.classList.contains("bg-yellow-200");

            // 비동기 요청 함수
            const fetchData = async () => {
                try {
                    const response = await axios.get(`/${dataValue}`);
                    if (response.status === 200) {
                        const user = response.data;
                        const userInfo = {
                            empCode: user.empCode,
                            name: user.empName,
                            dep: user.depCode,
                            pos: user.posCode,
                            sign: "미승인"
                        };

                        setSelectedItems((prevItems) => {
                            if (isSelected) {
                                // 중복 확인 후 추가
                                if (!prevItems.some(item => item.name === userInfo.name)) {
                                    return [...prevItems, userInfo];
                                }
                                return prevItems; // 이미 존재하면 그대로 반환
                            } else {
                                // 선택 해제 시 해당 항목 제거
                                return prevItems.filter(item => item.name !== userInfo.name);
                            }
                        });
                    }
                } catch (error) {
                    console.error("데이터 조회 중 오류 발생:", error);
                }
            };

            fetchData(); // 비동기 요청 실행
        }
    };

    const goSave = () => {
        onClose(selectedItems);
    };

    return (
        <div className="fixed py-12 transition duration-150 ease-in-out z-10 top-0 right-0 bottom-0 left-0" id="modal">
            <div className="container ml-[570px] mt-[100px] md:w-2/3 max-w-lg bg-white">
                <div className="relativepy-8 px-5 md:px-10 shadow-md rounded border-2 bg-white w-[1000px] h-[700px]">
                    <h1 className="text-2xl font-bold mt-3 mb-6">결재선</h1>
                    <div className="flex justify-around">
                        <div>
                            <div
                                className="text-gray-800 text-sm font-bold leading-tight tracking-normal mb-2"
                            >
                                주소록
                            </div>
                            <div className=" w-[400px] h-[550px] border-2 border-black rounded-[3px]">
                                <div ref={listContainerRef} onClick={handleListClick}/>
                            </div>
                        </div>
                        <div>
                            <div
                                className="text-gray-800 text-sm font-bold leading-tight tracking-normal mb-2"
                            >
                                결재선
                            </div>
                            <div className=" w-[400px] h-[550px] border-2 border-black rounded-[3px]">
                                <table className="h-[30px]">
                                    <thead>
                                    <tr className="bg-gray-400">
                                        <th className="w-[100px]">순서</th>
                                        <th className="w-[100px]">성명</th>
                                        <th className="w-[100px]">부서</th>
                                        <th className="w-[100px]">직급</th>
                                    </tr>

                                    </thead>
                                    <tbody>
                                    {selectedItems.map((item, index) => (
                                        <tr key={index} className="h-[30px]">
                                            <td>{index + 1}</td>
                                            <td>{item.name}</td>
                                            <td>{item.dep}</td>
                                            <td>{item.pos}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex items-center justify-end w-full mt-1">
                                <button
                                    className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm"
                                    onClick={goSave}
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
        </div>);
}