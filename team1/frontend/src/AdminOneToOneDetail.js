import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import axios from "axios";


function Button({children, size, variant, onClick}) {


    const baseStyle = "px-4 py-2 rounded";
    const sizeStyle = size === "sm" ? "text-sm" : "text-base";
    const variantStyle = variant === "outline" ? "border border-gray-300 bg-white" : "bg-blue-500 text-white";


    return (
        <button className={`${baseStyle} ${sizeStyle} ${variantStyle}`} onClick={onClick}>
            {children}
        </button>
    );
}

function Input({placeholder, onChange}) {
    return (
        <input type="text" onChange={onChange} placeholder={placeholder}
               className="border border-gray-300 p-2 rounded w-full"/>
    );
}

function Table({children}) {
    return (
        <table className="min-w-full border border-gray-300">
            {children}
        </table>
    );
}

function TableHeader({children}) {
    return <thead className="bg-gray-200">{children}</thead>;
}

function TableBody({children}) {
    return <tbody>{children}</tbody>;
}

function TableRow({children}) {
    return <tr className="border-b">{children}</tr>;
}

function TableHead({children}) {
    return <th className="p-2 text-center">{children}</th>;
}

function TableCell({children, onClick}) {
    return <td className="p-2 text-center" onClick={onClick}>{children}</td>;
}

export default function Component() {
    const location = useLocation();
    const {item} = location.state || {qNum: "없음"};
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const navigate = useNavigate();

    const [Qlist, setQList] = useState([])
    const [filterQlist, setFilterQlist] = useState([])

    const [empCode, setEmpCode] = useState("")

    //로그인시 empcode를 일단 가져오는코드
    useEffect(() => {
        // 로그인 후 empCode를 설정하는 로직
        const fetchEmpCode = async () => {
            // 여기에서 실제 empCode를 설정
            const loggedInEmpCode = "3148127227-user001"; // 로그인 후 받아온 empCode
            setEmpCode(loggedInEmpCode);
        };
        fetchEmpCode();
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/QDetailList", {params: {empCode}});
                const list = response.data;

                // startDate 변환
                const updatedList = list.map(v => {
                    const date = new Date(v.startDate);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');

                    return {
                        ...v, // 기존 데이터 유지
                        startDate: `${year}-${month}-${day}`, // 변환된 날짜
                        checked: false
                    };
                });

                setQList(updatedList);
                setFilterQlist(updatedList)
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, []);


    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    const goBack = () => {
        navigate(-1)
    }
    

    return (
        <div className="overflow-hidden flex flex-col min-h-screen w-full  mx-auto p-4  rounded-lg ">
            <header className="text-2xl font-bold text-center p-4 bg-gray-200 mb-6 ">로고</header>

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold mb-4 text-left "
                    style={{marginLeft: "375px"}}>{item.qNum} {item.title}</h1>
                <button onClick={goBack} style={{marginRight: "415px", marginTop: "-10px", height: "50px"}}
                        className=" border rounded-md px-4 text-lg font-bold">목록
                </button>
            </div>
            <div className="flex flex-col md:flex-row gap-6" style={{marginLeft: "350px"}}>


                {/*<main className="flex-1">*/}
                <div className="flex"></div>

                <div className="space-y-4">
                    <div className="flex space-x-8">
                        <p className="block text-xl font-medium text-gray-700 mb-1">Q: 내용 </p>
                        <p id="content" className="border-2 border-gray-300 p-2  text-lg"
                           style={{height: '300px', width: '1000px'}}>{item.content}</p>
                    </div>
                    <div className="flex space-x-8">
                        <p className="block text-xl font-medium text-gray-700 mb-1">Q: 등록일</p>
                        <p className="block text-xl font-medium text-gray-700 mb-1">{item.startDate}</p>
                    </div>
                    <div className="flex space-x-8">
                        <p className="block text-xl font-medium text-gray-700 mb-1">A: 제목</p>
                        <p id="title" className="border-2 border-gray-300 p-2  h-8 text-lg"
                           style={{width: '1000px', height: "50px"}}>{item.ansTitle}</p>
                    </div>
                    <div className="flex space-x-8">
                        <p className="block text-xl font-medium text-gray-700 mb-1">A: 내용</p>
                        <p id="content" className="border-2 border-gray-300 p-2  text-lg"
                           style={{height: '300px', width: '1000px'}}>{item.ansContent}</p>
                    </div>
                </div>

                {/*</main>*/}
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
