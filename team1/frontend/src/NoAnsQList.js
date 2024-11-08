import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import Clock from "react-live-clock";

import {useAuth} from "./noticeAuth";

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

function Input({placeholder, onChange, onKeyDown}) {
    return (
        <input type="text" onChange={onChange} onKeyDown={onKeyDown} placeholder={placeholder}
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
    return <tbody className="border">{children}</tbody>;
}

function TableRow({children}) {
    return <tr>{children}</tr>;
}

function TableHead({children}) {
    return <th className="p-2 text-center">{children}</th>;
}

function TableCell({children, onClick}) {
    return <td className="p-2 text-center" onClick={onClick}>{children}</td>;
}

export default function Component() {
    const navigate = useNavigate();
    const [Qlist, setQList] = useState([])
    const [qSearch, setQSearch] = useState("")
    const [filterQlist, setFilterQlist] = useState([])

    // 로그인
    const {isLoggedIn, empCode, logout} = useAuth();
    const [prevLogin, setPrevLogin] = useState(undefined);   // 이전 로그인 상태를 추적할 변수

    // slide 변수
    const [isPanelOpen, setIsPanelOpen] = useState(false); // 화면 옆 슬라이드

    const [adminId, setAdminId] = useState("")
    const [permission, setPermission] = useState(false)
    const today = new Date();
    const formattedDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`;


    const location = useLocation();
    const {item} = location.state || {qNum: "없음"};

    //로그아웃이 맨위로
    useEffect(() => {
        if (!localStorage.getItem('empCode')) {
            alert("로그인하세요")
            navigate("/"); // 로그인하지 않으면 홈페이지로 이동
        }
    }, [])

    const handleCheckboxChange = (id) => {
        setQList(prevData =>
            prevData.map(item =>
                item.qnum === id ? {...item, checked: !item.checked} : item
            )
        );

        // filterQlist는 원본 Qlist의 상태를 기반으로 동적으로 업데이트
        setFilterQlist(prevFilterQlist =>
            prevFilterQlist.map(item =>
                item.qnum === id ? {...item, checked: !item.checked} : item
            )
        );
    };


    useEffect(() => {
        if (isLoggedIn && empCode) {
            const fetchData = async () => {
                try {
                    //영자씨인지 확인
                    const response = await axios.get(`/selectAdmin`, {params: {adminId: empCode}});
                    console.log(response.data)
                    setAdminId(response.data);

                    if (response.data === 0) {
                        setPermission(false);
                    } else {
                        setPermission(true);
                    }


                    //리스트가져오기
                    const response2 = await axios.get("/noAnsList");
                    const list = response2.data;
                    console.log(response2.data)

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
        }
        setPrevLogin(isLoggedIn);

    }, [isLoggedIn, empCode]); // isLoggedIn과 empCode 변경 시에만 실행


    const handleDelete = async () => {
        //db데이터 삭제하는 기능 구현해야됨
        const idsToDelete = Qlist.filter(item => item.checked).map(item => item.qnum);
        console.log(idsToDelete)
        if (idsToDelete.length > 0) {
            try {
                await axios.delete("/deleteAdminQDetail", {data: idsToDelete});
                // 체크된 항목 삭제 후 상태 업데이트
                setQList(prevQList => prevQList.filter(item => !item.checked));
                setFilterQlist(prevFilterQList => prevFilterQList.filter(item => !item.checked));
            } catch (error) {
                console.error("Error deleting items:", error);
            }
        } else {
            alert("삭제할 항목이 선택되지 않았습니다.");
        }
    };


    const qListOnChangeHandler = (e) => {
        setQSearch(e.target.value)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault(); // 기본 동작 방지
            search();
        }
    };

    const search = (e) => {
        console.log("클릭");
        if (qSearch.trim() === "") {
            setFilterQlist(Qlist); // 검색어가 없으면 모든 리스트를 보여줍니다.
        } else {
            const filtered = Qlist.filter(item =>
                item.title.includes(qSearch)
            );
            setFilterQlist(filtered);
        }
    }

    const goDetail = (item) => {
        // const {qNum} = item
        console.log(item)
        navigate("/AdminOneToOneDetail", {state: {item}});

    }


    const goAnsQ = (item) => {
        navigate("/AnsQ", {state: {item}});
    }

    const goCompleteList = () => {
        navigate("/AnsQCompleteList");
    }

    const goNoAnsList = () => {
        navigate("/NoAnsQList");
    }

    const goAnsQList = () => {
        navigate("/AnsQDetail")
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

//<토글>
    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    if (!permission) {
        return (
            <div className="flex items-center justify-center h-screen">
                <h1 className="text-center text-4xl font-bold text-red-500">권한이 없습니다. 접근할 수 없습니다.</h1>
            </div>
        );
    }

    return (
        <div className="overflow-hidden flex flex-col min-h-screen w-full  mx-auto p-4  rounded-lg ">
            <header className="flex justify-end items-center border-b shadow-md h-[6%] bg-white">
                <div className="flex mr-6">
                    <div className="font-bold mr-1">{formattedDate}</div>
                    <Clock
                        format={'HH:mm:ss'}
                        ticking={true}
                        timezone={'Asia/Seoul'}/>
                </div>
                <div className="mr-5">
                    <img width="40" height="40" src="https://img.icons8.com/windows/32/f87171/home.png"
                         alt="home"/>
                </div>
                <div className="mr-16">
                    <img width="45" height="45"
                         src="https://img.icons8.com/ios-glyphs/60/f87171/user-male-circle.png"
                         alt="user-male-circle" onClick={togglePanel}/>
                </div>
            </header>

            <div className="flex flex-col md:flex-row gap-6">

                <div className="w-64 bg-white p-6 shadow-md flex flex-col justify-center items-center"
                     style={{height: "auto"}}>
                    <ul className="mb-4 text-center">
                        <li className="text-2xl mb-2 ">
                            <h2 onClick={goAnsQList} className="cursor-pointer">
                            <span className="inline-block w-2 h-2 bg-black rounded-full mr-2"
                                  style={{marginLeft: "5px"}}/> {/* 점 추가 */}
                                1:1 상담</h2>
                            <ul className="ml-4">
                                <li onClick={goNoAnsList} className="text-sm cursor-pointer"
                                    style={{fontWeight: "400", marginTop: "10px", marginBottom: "10px"}}>-
                                    미답변내역
                                </li>
                                <li onClick={goCompleteList} className="text-sm cursor-pointer"
                                    style={{fontWeight: "400", marginLeft: "10px"}}>-
                                    답변완료내역
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <hr className="border-gray-300 my-2 w-full" style={{marginTop: "250px"}}/>
                    <h3 className="text-2xl  mb-2 text-center mt-2">CS 센터</h3>
                    <p className="text-lg mb-2 text-center mt-2" style={{fontWeight: "400"}}>1234-5678</p>
                    <p className="text-lg text-center mt-2">월-금 09:00 ~ 12:00<br/>13:00 ~ 18:00</p>
                    <p className="text-lg mt-2 text-center">(공휴일 휴무)</p>
                </div>


                <main className="flex-1" style={{marginTop: "20px"}}>
                    <h1 className="text-xl font-bold mb-4 text-left">미답변내역</h1>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>번호</TableHead>
                                <TableHead>제목</TableHead>
                                <TableHead>등록일</TableHead>
                                <TableHead>상태</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filterQlist.length > 0 ? (
                                filterQlist.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="text-left">{index + 1}</TableCell>
                                        <TableCell onClick={() => goDetail(item)} className="text-left cursor-pointer">
                                            <span className="cursor-pointer">{item.title}</span></TableCell>
                                        <TableCell className="text-left">{item.startDate}</TableCell>
                                        <TableCell className="text-left flex items-center">
                                            <Button onClick={() => goAnsQ(item)}
                                                    size="sm"
                                                    variant={item.qstatus === false ? 'outline' : 'primary'}
                                                    className={item.qstatus === false ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}
                                            >{item.qstatus === false ? "답변대기" : "답변완료"}</Button>
                                            <input
                                                type="checkbox"
                                                className="ml-2"
                                                checked={item.checked || false}
                                                onChange={() => handleCheckboxChange(item.qnum)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">결과가 없습니다.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <div className="flex items-center gap-4 mt-4">
                        <div className="flex-1">
                            <Input onKeyDown={handleKeyDown} onChange={qListOnChangeHandler} placeholder="검색"/>
                        </div>
                        <Button onClick={search} size="icon" variant="outline">
                            <span className="material-icons">검색</span>
                        </Button>
                        <Button variant="outline" onClick={handleDelete}>삭제</Button>
                    </div>
                </main>
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
                    {isLoggedIn ? <button onClick={handleLogout}>로그아웃</button>
                        : (<><h2 className="text-xl font-bold mb-4">로그인</h2>
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
                                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4">
                                    로그인
                                </button>
                            </>
                        )}
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
