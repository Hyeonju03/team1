import React, {useCallback, useEffect, useRef, useState} from "react";
import {createRoot} from "react-dom/client";
import axios from "axios";
import ListLibrary from "./HtmlFunctions/ListLibrary";

export default function SignTarget({onClose}) {
    const [title, setTitle] = useState("");
    const [contents, setContents] = useState("");
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
        if (target.tagName === "LI") {
            // 클릭된 항목의 클래스 토글
            target.classList.toggle("bg-yellow-200");

            // 항목의 정보를 콘솔에 출력
            console.log(target.textContent);

            // 선택된 항목 관리
            const itemText = target.textContent;
            setSelectedItems((prevItems) => {
                if (target.classList.contains("bg-yellow-200")) {
                    // 항목이 선택되었으면 추가
                    return [...prevItems, itemText];
                } else {
                    // 선택이 해제되었으면 제거
                    return prevItems.filter((item) => item !== itemText);
                }
            });
        }
    };

    const handleAdd = () => {
        // 추가 버튼 클릭 시 선택된 항목들을 추가하는 로직
        console.log("선택된 항목들:", selectedItems);
    };

    const titleOnChangeHandler = useCallback((e) => {
        setTitle(e.target.value);
    });

    const contentsOnChangeHandler = useCallback((e) => {
        setContents(e.target.value);
    });

    const goSave = () => {
        onClose({title: title, contents: contents});
    };

    return (
        <div className="fixed py-12 transition duration-150 ease-in-out z-10 top-0 right-0 bottom-0 left-0" id="modal">
            <div className="container ml-[570px] mt-[100px] md:w-2/3 max-w-lg bg-white">
                <div className="relativepy-8 px-5 md:px-10 shadow-md rounded border-2 bg-white w-[1000px] h-[700px]">
                    <h1 className="text-2xl font-bold mt-3 mb-6">결재선</h1>
                    <div className="flex justify-between">
                        <div>
                            <div
                                className="text-gray-800 text-sm font-bold leading-tight tracking-normal mb-2"
                            >
                                주소록
                            </div>
                            <div className=" w-[350px] h-[550px] border-2 border-black rounded-[3px]">
                                <div ref={listContainerRef} onClick={handleListClick}/>
                            </div>
                        </div>
                        <div className="flex flex-col items-center flex-wrap justify-center">
                            <div>
                                <button
                                    className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm"
                                    onClick={handleAdd}
                                >
                                    추가
                                </button>
                            </div>
                            <div>
                                <button
                                    className="mt-1 focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-gray-400 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm">
                                    빼기
                                </button>
                            </div>
                        </div>
                        <div>
                            <div
                                className="text-gray-800 text-sm font-bold leading-tight tracking-normal mb-2"
                            >
                                결재선
                            </div>
                            <div className=" w-[350px] h-[550px] border-2 border-black rounded-[3px]">
                                <table className="h-[30px]">
                                    <thead>
                                    <tr className="bg-gray-400">
                                        <th className="w-[80px]">순서</th>
                                        <th className="w-[90px]">성명</th>
                                        <th className="w-[90px]">부서</th>
                                        <th className="w-[90px]">직급</th>
                                    </tr>

                                    </thead>
                                    <tbody>
                                    {selectedItems.map((item, index) => (
                                        <tr key={index} className="h-[30px]">
                                            <td>{index + 1}</td>
                                            <td>{item}</td>
                                            <td>부서명</td>
                                            <td>직급명</td>
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