import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useAuth} from "./noticeAuth";
import Clock from "react-live-clock";

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
        <table className="min-w-full border-2 border-gray-300">
            {children}
        </table>
    );
}

function TableHeader({children}) {
    return <thead className="bg-gray-200">{children}</thead>;
}

function TableBody({children}) {
    return <tbody className="">{children}</tbody>;
}

function TableRow({children}) {
    return <tr className="hover:bg-gray-100 border-b-2 border-gray-300">{children}</tr>;
}

function TableHead({children}) {
    return <th className="p-2 text-center">{children}</th>;
}

function TableCell({children, onClick}) {
    return <td className="p-2 text-center" onClick={onClick}>{children}</td>;
}

export default function Component() {
    const navigate = useNavigate();
    const [btnCtl, setBtnCtl] = useState(0)
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isRClick, setIsRClick] = useState(false)
    const [newWindowPosY, setNewWindowPosY] = useState(500)

    const [Qlist, setQList] = useState([])
    const [qSearch, setQSearch] = useState("")
    const [filterQlist, setFilterQlist] = useState([])

    // 로그인
    const {isLoggedIn, empCode, logout, login} = useAuth();
    const [userInfo, setUserInfo] = useState([])
    const [inputId, setInputId] = useState(""); // 사용자 ID 상태 추가
    const [inputPassword, setInputPassword] = useState(""); // 비밀번호 입력

    const today = new Date();
    const formattedDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`;

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

    const empInfo = async () => {
        try {
            const response = await axios.get(`/emp/${empCode}`);
            setUserInfo(response.data);
        } catch (e) {
            console.log(e)
        }
    }
    //
    // //로그아웃이 맨위로
    // useEffect(() => {
    //     // if (!localStorage.getItem('empCode')) {
    //     if (isLoggedIn && empCode) {
    //
    //     } else {
    //
    //     }
    // }, [])


    useEffect(() => {
        if (isLoggedIn && empCode) {
            const fetchData = async () => {
                try {
                    const response = await axios.get("/QDetailList", {params: {empCode}});
                    const list = response.data;
                    console.log(response.data)

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
            empInfo();
            fetchData();
        } else {
            alert("로그인이 필요합니다")
            navigate("/AdminFAQ"); // 로그인하지 않으면 홈페이지로 이동
        }
    }, [isLoggedIn, empCode]); // isLoggedIn과 empCode 변경 시에만 실행

    // 로그인 처리 함수
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                '/api/employ/login',
                {
                    empCode: inputId,
                    empPass: inputPassword
                }
            );

            if (response.data.success) {
                login(inputId, response.data.role, response.data.token); // 인증 처리
            } else {
                alert("유효하지 않은 로그인 정보입니다.");
            }
        } catch (error) {
            alert("잘못된 계정 정보입니다. 다시 시도해주세요.");
        }
    };

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

    const qRegister = () => {
        console.log("클릭됨");
        navigate("/AdminQ");
    }


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

    const goQDetail = () => {
        navigate("/AdminQDetail");
        window.location.reload();
    }

    const goFAQ = () => {
        navigate("/AdminFAQ");
        window.location.reload();
    }

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    const goQList = () => {
        navigate("/AdminQDetail");
    }

    return (
        <div className="min-h-screen flex flex-col">
            <div className="fixed w-full">
                <header className="w-full flex justify-end items-center border-b shadow-md h-14 bg-white">
                    <div className="flex mr-6">
                        <div className="font-bold mr-1">{formattedDate}</div>
                        <Clock
                            format={'HH:mm:ss'}
                            ticking={true}
                            timezone={'Asia/Seoul'}/>
                    </div>
                    <div className="mr-5">
                        <img width="40" height="40"
                             src="https://img.icons8.com/external-tanah-basah-basic-outline-tanah-basah/24/5A5A5A/external-marketing-advertisement-tanah-basah-basic-outline-tanah-basah.png"
                             alt="external-marketing-advertisement-tanah-basah-basic-outline-tanah-basah"
                             onClick={() => {
                                 navigate(`/user/notice/list`)
                             }}/>
                    </div>
                    <div className="mr-5">
                        <img width="40" height="40" src="https://img.icons8.com/ios-filled/50/5A5A5A/help.png"
                             alt="help" onClick={() => {
                            navigate(`/AdminFAQ`)
                        }}/>
                    </div>
                    <div className="mr-5">
                        <img width="40" height="40" src="https://img.icons8.com/windows/32/5A5A5A/home.png"
                             alt="home" onClick={() => {
                            navigate("/")
                        }}/>
                    </div>
                    <div className="mr-16">
                        <img width="45" height="45"
                             src="https://img.icons8.com/ios-glyphs/60/5A5A5A/user-male-circle.png"
                             alt="user-male-circle" onClick={togglePanel}/>
                    </div>
                </header>
            </div>

            <div className="flex-1 flex">
                <div className="fixed h-4/6 mt-32">
                    <div
                        className="w-64 h-full bg-gray-200 p-2 rounded-r-lg shadow-md flex flex-col justify-around items-center"
                    >
                        <div className="flex justify-center">
                            <div className="h-full">
                                <h2 className="text-left text-2xl ml-1 mb-2 cursor-pointer" onClick={() => {
                                    navigate(`/ApplyForBusiness`)
                                }}>사용 등록 신청</h2>
                                <h2 className="text-left text-2xl ml-1 mb-2 cursor-pointer" onClick={() => {
                                    navigate(`/SignUp`)
                                }}>회원가입</h2>
                                <h2 onClick={goFAQ} className="text-left text-2xl ml-1 mb-2 cursor-pointer">FAQ</h2>

                                <h2 onClick={goQList} className="text-left text-2xl ml-1 mb-2 cursor-pointer">
                                    1:1 상담</h2>
                                <ul className="ml-2">
                                    <li onClick={qRegister} className="text-left cursor-pointer">-
                                        문의작성
                                    </li>
                                    <li onClick={goQDetail} className="text-left cursor-pointer">-
                                        문의내역
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <hr className="border-gray-300 w-full"/>
                        <div className="flex justify-center">
                            <div className="h-full">
                                <h3 className="text-2xl  mb-2 text-center mt-2">CS 센터</h3>
                                <p className="text-lg mb-2 text-center mt-2" style={{fontWeight: "400"}}>1234-5678</p>
                                <p className="text-lg text-center mt-2">월-금 09:00 ~ 12:00<br/>13:00 ~ 18:00</p>
                                <p className="text-lg mt-2 text-center">(공휴일 휴무)</p>
                            </div>
                        </div>
                    </div>
                </div>

                <main className="flex-1 w-full p-5 ml-64 mt-14">
                    <h1 className="text-xl font-bold mb-4 text-left">문의내역</h1>
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
                                    <TableRow key={item.qnum}>
                                        <TableCell onClick={() => goDetail(item)}
                                                   className="text-left">{index + 1}</TableCell>
                                        <TableCell onClick={() => goDetail(item)}
                                                   className="text-left cursor-pointer">
                                            <span className="cursor-pointer">{item.title}</span></TableCell>
                                        <TableCell onClick={() => goDetail(item)}
                                                   className="text-left">{item.startDate}</TableCell>
                                        <TableCell className="text-left flex items-center">
                                            <Button size="sm"
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
                        <Button onClick={qRegister}>문의등록</Button>
                    </div>
                </main>
            </div>

            {/* Slide-out panel with toggle button */}
            <div className={`${isPanelOpen ? "" : "hidden"}`}>
                <div
                    className="fixed mt-16 top-0 right-0 h-11/12 w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out max-w-xs p-1 rounded-lg border-2 border-gray-300">
                    <div className="p-1 h-full">
                        {/*<div className="text-sm text-center">*/}
                        {/*    <a href="#" className="text-blue-600 hover:underline">*/}
                        {/*        공지사항*/}
                        {/*    </a>*/}
                        {/*    <span className="mx-1">|</span>*/}
                        {/*    <a href="#" className="text-blue-600 hover:underline">*/}
                        {/*        문의사항*/}
                        {/*    </a>*/}
                        {/*</div>*/}
                        {isLoggedIn ?
                            <div className="h-full">
                                <div className="h-1/4">
                                    <div className="flex h-3/6">
                                        <div className="w-1/3 ">
                                            <img width="75px" height="75px" src="/logo192.png"/>
                                        </div>
                                        <div className="w-2/3 text-left">
                                            <p className="">이름: {userInfo.empName}</p>
                                            <p className="">직급: {userInfo.posCode}</p>
                                            <p className="">부서: {userInfo.depCode}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col text-left mb-1">
                                        <p className="">사내 이메일: {userInfo.empMail}</p>
                                        <p className="">전화번호: {userInfo.phoneNum}</p>
                                    </div>


                                    <div className="flex">
                                        <button className="border w-1/5 text-sm p-1"
                                                onClick={() => setBtnCtl(0)}>
                                            조직도
                                        </button>
                                        <button className="border w-1/5 text-sm p-1"
                                                onClick={() => setBtnCtl(1)}>
                                            대화방
                                        </button>
                                        <button className="border w-1/5 text-sm p-1"
                                                onClick={() => setBtnCtl(2)}>
                                            주소록
                                        </button>
                                        <button className="border w-2/5 text-sm p-1"
                                                onClick={() => setBtnCtl(3)}>
                                            공지사항
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <div className="border text-left h-[435px] blue">
                                        {btnCtl === 0 ? (
                                            // ListLibrary.WorkerList(com)
                                            <></>
                                        ) : btnCtl === 1 ? (
                                            <>
                                                <div className="h-[100%] overflow-y-auto">
                                                    <div className="border flex justify-between">
                                                        <button>대화방</button>
                                                        <button>나가기</button>
                                                    </div>
                                                </div>
                                            </>
                                        ) : btnCtl === 2 ? (
                                            <>
                                                {/*<div dangerouslySetInnerHTML={{__html: addressBookHtml}}/>*/}
                                            </>
                                        ) : btnCtl === 3 ? (
                                            <>
                                                {/*<div dangerouslySetInnerHTML={{__html: noticeHtml}}/>*/}
                                                <div>
                                                    <button
                                                        className="text-center border w-full h-[45px]"
                                                        onClick={() => setBtnCtl(6)}>
                                                        {" "}
                                                        공지사항 추가하기
                                                    </button>
                                                </div>
                                            </>
                                        ) : btnCtl === 4 ? (
                                            <>
                                                <div className="h-[480px] overflow-y-auto">
                                                    <ul className="pb-2">
                                                        상대방이름 <li className="pl-4">대화내용 </li>
                                                    </ul>
                                                    <ul className="text-right pb-2">
                                                        사용자이름 <li className="pr-4">대화내요ㅛㅛㅛㅛㅛㅇ </li>
                                                    </ul>
                                                    <ul className="pb-2">
                                                        상대방이름 <li className="pl-4">대화내용 </li>
                                                    </ul>
                                                    <ul className="pb-2">
                                                        상대방이름 <li className="pl-4">대화내용 </li>
                                                    </ul>
                                                    <ul className="pb-2">
                                                        상대방이름 <li className="pl-4">대화내용 </li>
                                                    </ul>
                                                    <ul className="pb-2">
                                                        상대방이름 <li className="pl-4">대화내용 </li>
                                                    </ul>
                                                    <ul className="pb-2">
                                                        상대방이름 <li className="pl-4">대화내용 </li>
                                                    </ul>
                                                    <ul className="pb-2">
                                                        상대방이름 <li className="pl-4">대화내용 </li>
                                                    </ul>
                                                    <ul className="pb-2">
                                                        상대방이름 <li className="pl-4">대화내용 </li>
                                                    </ul>
                                                    <ul className="pb-2">
                                                        상대방이름 <li className="pl-4">대화내용 </li>
                                                    </ul>
                                                    <ul className="pb-2">
                                                        상대방이름 <li className="pl-4">대화내용 </li>
                                                    </ul>
                                                    <ul className="pb-2">
                                                        상대방이름 <li className="pl-4">대화내용 </li>
                                                    </ul>
                                                </div>
                                            </>
                                        ) : btnCtl === 5 ? (
                                            <>
                                                {/*<div dangerouslySetInnerHTML={{__html: loadNoticeHtml}}/>*/}
                                                <div>
                                                    <button
                                                        className="text-center border w-full h-[45px]"
                                                        onClick={() => setBtnCtl(3)}>
                                                        목록으로
                                                    </button>
                                                </div>
                                            </>
                                        ) : btnCtl === 6 ? (
                                            <>
                                                {/*{ListLibrary.noticeWritePage(com, setBtnCtl)}*/}
                                                <button
                                                    className="text-center border w-full h-[45px]"
                                                    onClick={() => {
                                                        setBtnCtl(3);
                                                        // ListLibrary.noticeInsert(user);
                                                    }}
                                                >
                                                    공지사항 등록
                                                </button>
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </div>
                                <button
                                    className="mt-2 w-full h-10 text-white bg-gray-400 hover:bg-gray-500 rounded"
                                    onClick={handleLogout}>로그아웃
                                </button>
                            </div>
                            : (<><h2 className="mt-2">로그인</h2>
                                    <input
                                        type="text"
                                        placeholder="아이디"
                                        className="w-full p-2 mb-2 border rounded"
                                        onChange={(e) => {
                                            setInputId(e.target.value)
                                        }}
                                    />
                                    <input
                                        type="password"
                                        placeholder="비밀번호"
                                        className="w-full p-2 mb-4 border rounded"
                                        onChange={(e) => {
                                            setInputPassword(e.target.value)
                                        }}
                                    />
                                    <button
                                        className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 mb-4"
                                        onClick={handleLogin}>
                                        로그인
                                    </button>
                                </>
                            )}


                        {isRClick === true ? (
                            <></>
                            // <div className={`flex absolute`}
                            //      style={{top: `${newWindowPosY}px`, right: `${newWindowPosX}px`}}>
                            //     <div className="w-1/3 border">
                            //         <img src="/logo192.png"/>
                            //     </div>
                            //     <div className="w-2/3 text-left border">
                            //         <p>사내 이메일:{newWindowData[0]}</p>
                            //         <p>전화번호:{newWindowData[1]}</p>
                            //         <p>상태:</p>
                            //         <button
                            //             onClick={() => {
                            //                 setIsRClick(false);
                            //                 setNewWindowData([]);
                            //             }}
                            //         >
                            //             닫기
                            //         </button>
                            //     </div>
                            // </div>
                        ) : (
                            <></>
                        )}


                    </div>
                </div>
                <div
                    className="fixed mt-14 top-0 right-16 transform -translate-x-3 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-gray-300"></div>
            </div>
        </div>
    );
}
