import {useCallback, useState} from "react";

export default function SignTarget() {
    const [title, setTitle] = useState("");
    const [contents, setContents] = useState("");

    const titleOnChangeHandler = useCallback((e) => {
        setTitle(e.target.value);
    });
    const contentsOnChangeHandler = useCallback((e) => {
        setContents(e.target.value);
    });

    const goSave = () => {
        onclose({ title: title, contents: contents });
    };

    return (
        <div className="py-12 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0" id="modal">
            <div className="container ml-[400px] md:w-2/3 max-w-lg bg-white">
                <div className="relativepy-8 px-5 md:px-10 shadow-md rounded border border-gray-400 bg-white w-[1000px] h-[700px]">
                    <h1 className="text-gray-800 font-lg font-bold tracking-normal leading-tight mb-4">
                        결재선
                    </h1>
                    <div className="flex justify-between">
                        <div>
                            <div
                                className="text-gray-800 text-sm font-bold leading-tight tracking-normal mb-2"
                            >
                                주소록
                            </div>
                            <div className=" w-[350px] h-[550px] border-2 border-black rounded-[3px]">
                                Select 문으로 사람 조회하기
                            </div>
                        </div>
                        <div className="flex center items-center justify-center">
                            <div className="flex-col items-center justify-start w-full">
                                <button
                                    className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm"
                                    onClick={goSave}
                                >
                                    등록
                                </button>
                                <button
                                    className="focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-gray-400 ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm"
                                    onClick={() => onclose()}
                                >
                                    취소
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
                                <div className="flex justify-around h-[25px]">
                                    <div>순서</div>
                                    <div>성명</div>
                                    <div>부서</div>
                                    <div>직급</div>
                                </div>
                            </div>
                            <div className="flex items-center justify-start w-full">
                                <button
                                    className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm"
                                    onClick={goSave}
                                >
                                    등록
                                </button>
                                <button
                                    className="focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-gray-400 ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm"
                                    onClick={() => onclose()}
                                >
                                    취소
                                </button>
                            </div>
                        </div>


                    </div>

                </div>
            </div>
        </div>
    );
}