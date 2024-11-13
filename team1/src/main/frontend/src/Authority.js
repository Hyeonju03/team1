import React, {useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from "axios"; // useNavigate 임포트 추가
import {useAuth} from "./noticeAuth";
import Clock from "react-live-clock";
import {ChevronRight} from "lucide-react";
import ListLibrary from "./HtmlFunctions/ListLibrary";
import {useListLibrary} from "./Context/ListLibraryContext";

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
    return <tr className="border-b text-center">{children}</tr>;
}

function TableHead({children}) {
    return <th className="p-2 border border-gray-300 text-center">{children}</th>;
}

function TableCell({children, colSpan, className}) {
    return <td colSpan={colSpan} className={`p-2 border border-gray-300 ${className}`}>{children}</td>;
}

export default function Component() {
    const [empList, setEmpList] = useState([]);
    const [formData, setFormData] = useState([]);
    const [hasPermission, setHasPermission] = useState(false)
    const today = new Date();
    const formattedDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`;

    const navigate = useNavigate(); // useNavigate 훅 사용
    // 로그인
    const {isLoggedIn, empCode, logout} = useAuth();
    const [userInfo, setUserInfo] = useState([])
    const [isAdmin, setIsAdmin] = useState(null)

    // 슬라이드 부분
    const socket = useRef(null);
    const [sendMessage, setSendMessage] = useState(null);
    const [isRClick, setIsRClick] = useState(false);
    const [newWindowPosY, setNewWindowPosY] = useState(500);
    const [newWindowPosX, setNewWindowPosX] = useState(500);
    const [newWindowData, setNewWindowData] = useState([]);
    const [noticeNum, setNoticeNum] = useState("");
    const {btnCtl, setBtnCtl} = useListLibrary();
    const [user, setUser] = useState(null);
    const [com, setCom] = useState(null);
    const [chatNum, setChatNum] = useState("")
    const [inviteChatCtl, setInviteChatCtl] = useState(0)

    const [noticeHtml, setNoticeHtml] = useState("");
    const [loadNoticeHtml, setLoadNoticeHtml] = useState("");
    const [addressBookHtml, setAddressBookHtml] = useState("");
    const [chatListLoad, setChatListLoad] = useState("");
    const [chatInHTML, setChatInHTML] = useState("");
    const [chatMemList2, setChatMemList2] = useState("")
    const fetchData = async () => {
        const result1 = await ListLibrary.noticeList(user, btnCtl);
        setNoticeHtml(result1);
        const result2 = await ListLibrary.loadNotice(noticeNum);
        setLoadNoticeHtml(result2);
        const result3 = await ListLibrary.addressBook(user, "");
        setAddressBookHtml(result3);
        const result4 = await ListLibrary.chatListLoad(user)
        setChatListLoad(result4);
        const result5 = await ListLibrary.chatMemList2(user, chatNum)
        setChatMemList2(result5);

        const result6 = await ListLibrary.chatIn(user, chatNum) //이거 제일 마지막에 들어가야함 부하 심함
        setChatInHTML(result6);
    };


    useEffect(() => {
        if(user !== null && com !== null){
            fetchData();
        }
    }, [btnCtl]);

    useEffect(() => {
        if (empCode !== null && empCode !== undefined && empCode !== "") {
            setUser(empCode);
            setCom(empCode.split("-")[0]);
            if(localStorage.getItem('role')){
                setIsAdmin(localStorage.getItem('role'))
            }
        }
    }, [empCode]);

    useEffect(() => {

        const elements = document.querySelectorAll(".testEvent");

        const handleClick = (event) => {
            setBtnCtl(5);
            setNoticeNum(event.currentTarget.id);
            ListLibrary.noticeUpdate(event.currentTarget.id, user);
        };

        elements.forEach((element) => {
            element.addEventListener("click", handleClick);
        });

        return () => {
            elements.forEach((element) => {
                element.removeEventListener("click", handleClick);
            });
        };
    }, [noticeHtml, btnCtl]);
    useEffect(() => {
        const elements = document.querySelectorAll(".AddBtn");
        const btnElement = document.querySelector(".BtnAddressBookAdd");
        const InputAddressBookAdd = document.querySelectorAll(".InputAddressBookAdd");
        const InputAddressBookSearch = document.querySelector(".InputAddressBookSearch");
        let keyWord = "";
        const keyWordSet = async (e) => {
            if (e.key === "Enter") {
                keyWord = e.currentTarget.value;
                setAddressBookHtml(await ListLibrary.addressBook(user, keyWord));
            }
        };
        const addBtnClick = async (e) => {
            if (await ListLibrary.addressTargetSelect(InputAddressBookAdd[0].value, InputAddressBookAdd[1].value)) {
                if (!(await ListLibrary.addressEmpAddSelect(user, InputAddressBookAdd[0].value))) {
                    await ListLibrary.addressBookAdd(InputAddressBookAdd[0].value, user);
                } else {
                    alert("이미 존재하는 아이디 입니다");
                }
                setAddressBookHtml(await ListLibrary.addressBook(user, keyWord));
            } else {
                alert("정보가 일치하지 않습니다");
            }
        };
        const handleClick = async (e) => {
            await ListLibrary.addressBookDelete(e.currentTarget.parentNode.parentNode.id.replace("Add", ""), user);
            setAddressBookHtml(await ListLibrary.addressBook(user, keyWord));
        };
        elements.forEach((element) => {
            element.addEventListener("click", handleClick);
        });
        if (btnElement) {
            btnElement.addEventListener("click", addBtnClick);
        } else {
            //첫 로딩 거르기(주소록 누르기전 방지)
        }
        if (InputAddressBookSearch) {
            InputAddressBookSearch.addEventListener("keydown", keyWordSet);
        }
        return () => {
            elements.forEach((element) => {
                element.removeEventListener("click", handleClick);
            });
            if (btnElement) {
                btnElement.removeEventListener("click", addBtnClick);
            }
            if (InputAddressBookSearch) {
                InputAddressBookSearch.removeEventListener("keydown", keyWordSet);
            }
        };
    }, [addressBookHtml, btnCtl]);
    useEffect(() => {

        socket.current = new WebSocket('ws://nextit.or.kr:3002');

        socket.current.onopen = () => {
            console.log('WebSocket 연결 성공');
        };

        socket.current.onclose = () => {
            console.log('WebSocket 연결 종료');
        };

        socket.current.onerror = (error) => {
            console.error('WebSocket 오류:', error);
        };

        // 서버로부터 메시지 수신 처리
        socket.current.onmessage = (event) => {
            setSendMessage(event.data);
            console.log("서버")
        };

        // cleanup: 컴포넌트 언마운트 시 WebSocket 연결 종료
        return () => {
            if (socket.current) {
                socket.current.close();
            }
        };
    }, []);


    useEffect(() => {
        //채팅 내부 이벤트들
        const chatUpdate = async () => {
            setChatInHTML(await ListLibrary.chatIn(user, chatNum))
        }
        chatUpdate();
    }, [sendMessage]);

    const handleSendMessage = () => {
        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
            const message = document.querySelector('.chatInput').value;
            ListLibrary.chatinput(user, message, chatNum);
            socket.current.send(message);
            console.log('메시지 전송:', message);
            document.querySelector('.chatInput').value = ""
            document.querySelector('.chatRoomDiv').scrollTop = document.querySelector('.chatRoomDiv').scrollHeight
        } else {
            console.error('WebSocket 연결이 열리지 않았습니다.');
        }
    };

    useEffect(() => {
        const chatInBtn = document.querySelectorAll(".chatInBtn");
        const chatDeleteBtn = document.querySelectorAll(".chatDeleteBtn");
        const chatListAddBtn1 = document.querySelector(".chatListAddBtn1");
        const chatListAddBtn2 = document.querySelector(".chatListAddBtn2");
        const chatInviteListDiv = document.querySelector(".chatInviteListDiv");
        const chatListDiv = document.querySelectorAll(".chatListDiv");
        const chatListFrameDiv = document.querySelector(".chatListFrameDiv");
        const chatInviteListInput = document.querySelector(".chatInviteListInput");

        const handleClick1 = (e) => {
            setChatNum(e.target.dataset.value)
            setBtnCtl(4);
        };
        const handleClick2 = async (e) => {
            await ListLibrary.chatOut(user, e.target.dataset.value)
            setChatListLoad(await ListLibrary.chatListLoad(user));
        };
        const handleClick3 = (event) => {
            chatInviteListDiv.style.display = "block"
            //chatInviteListInput.style.display = "block"
            chatListFrameDiv.style.display = "none"
            chatListAddBtn1.style.display = "none"
            chatListAddBtn2.style.display = "block"
        };
        const handleClick4 = async (event) => {
            chatInviteListDiv.style.display = "none"
            //chatInviteListInput.style.display = "none"
            chatListFrameDiv.style.display = "block"
            chatListAddBtn1.style.display = "block"
            chatListAddBtn2.style.display = "none"

            let members = ""
            let memberCount = 0
            chatInviteListDiv.querySelectorAll(".worker").forEach((e, i1) => {
                if (e.children[0].checked) {
                    members += e.dataset.value + ","
                    memberCount++;
                }
            });
            if (memberCount > 1) {
                await ListLibrary.chatAdd1(user, members)
            } else {
                alert("인원이 너무 적습니다")
                chatInviteListDiv.querySelectorAll(".worker").forEach((e, i1) => {
                    if (!e.children[0].disabled) {
                        e.children[0].checked = false
                    }
                });
            }
            setChatListLoad(await ListLibrary.chatListLoad(user));
        };


        chatInBtn.forEach((e) => {
            e.addEventListener("click", handleClick1);
        })
        chatDeleteBtn.forEach((e) => {
            e.addEventListener("click", handleClick2);
        })
        if (chatListAddBtn1) {
            chatListAddBtn1.addEventListener("click", handleClick3);
        }
        if (chatListAddBtn2) {
            chatListAddBtn2.addEventListener("click", handleClick4);
        }

        return () => {
            chatInBtn.forEach((e) => {
                e.removeEventListener("click", handleClick1);
            })
            chatDeleteBtn.forEach((e) => {
                e.removeEventListener("click", handleClick2);
            })
            if (chatListAddBtn1) {
                chatListAddBtn1.removeEventListener("click", handleClick3);
            }
            if (chatListAddBtn2) {
                chatListAddBtn2.removeEventListener("click", handleClick4);
            }
        };

    }, [chatListLoad, btnCtl]);

    const chatInviteList = async () => {
        const chatMemList2Div = document.querySelector(".chatMemList2Div");
        let members = ""
        let memberCount = 0
        chatMemList2Div.querySelectorAll(".worker").forEach((e, i1) => {
            if (e.children[0].checked && !e.children[0].disabled) {
                members += e.dataset.value + ","
                memberCount++;
            }
        });
        if (memberCount > 0) {
            await ListLibrary.chatAdd2(chatNum, members)
        } else {
            alert("인원이 너무 적습니다")
            chatMemList2Div.querySelectorAll(".worker").forEach((e, i1) => {
                if (!e.children[0].disabled) {
                    e.children[0].checked = false
                }
            });
        }
    };
    const chatInviteList2 = async (e) => {
        let member = await ListLibrary.empCodeCheck(e)
        const empCodeIsTrue = await ListLibrary.empCodeCheck2(e, chatNum)
        console.log(member, empCodeIsTrue)
        if (member !== "" && empCodeIsTrue) {
            member += ","
            await ListLibrary.chatAdd2(chatNum, member)
        } else if (!empCodeIsTrue) {
            alert("이미 존재하는 참가자 입니다.")
        } else {
            alert("존재하지 않는 아이디 입니다.")
        }
    };

    const setChatMemList2Set = async () => {
        setChatMemList2(await ListLibrary.chatMemList2(user, chatNum));
    }


    // slide 변수
    const [isPanelOpen, setIsPanelOpen] = useState(false); // 화면 옆 슬라이드

    //로그아웃이 맨위로
    useEffect(() => {
        if (!localStorage.getItem('empCode')) {
            alert("로그인하세요")
            navigate("/"); // 로그인하지 않으면 홈페이지로 이동
        }else {
            empInfo();
        }
    }, [])

    console.log("emp", empCode)


    useEffect(() => {
        if (isLoggedIn) {
            const fetchData = async () => {
                console.log("여기는옴")
                const response = await axios.get("/permissionSelect", {params: {empCode: empCode}})
                console.log("->->", response.data);

                if (response.data === 0) {
                    setHasPermission(false);
                } else {
                    setHasPermission(true);
                    fetchData2();
                }
            };
            fetchData(); // 권한이 있을 경우 fetchData 호출
        }
    }, [isLoggedIn, empCode]); // isLoggedIn과 empCode 변경 시에만 실행

    const empInfo = async () => {
        try{
            const response = await axios.get(`/emp/${empCode}`);
            setUserInfo(response.data);
        }catch (e){
            console.log(e)
        }
    }

    // 직원 데이터를 가져오는 함수
    const fetchData2 = async () => {
        if (empCode) {
            const EmpCode2 = empCode.split("-")[0];
            console.log(EmpCode2)
            const response = await axios.get("/selectEmployeeList", {params: {empCode: EmpCode2}});
            setEmpList(response.data);
            setFormData(response.data.map(item => ({
                permissionEdit: item.permissionEdit,
                departmentManagement: item.departmentManagement,
                rankEdit: item.rankEdit,
                companyEdit: item.companyEdit,
                notice: item.notice,
                document: item.document,
                persInfo: item.persInfo,
                schedule: item.schedule
            }))); // formData 초기화
        }
    };

    const handleCheckboxChange = (index, field) => {
        const newFormData = [...formData];
        newFormData[index] = {
            ...newFormData[index],
            [field]: !newFormData[index][field]
        };
        setFormData(newFormData);
    };

    const handleSelectChange = (index, field, value) => {
        const newFormData = [...formData];
        newFormData[index] = {
            ...newFormData[index],
            [field]: value
        };
        setFormData(newFormData);
    };

    const handleSubmit = async () => {
        const completeFormData = empList.map((item, index) => {
            return {
                empCode: item.empCode,
                depCode: item.depCode,
                empName: item.empName,
                posCode: item.posCode,
                permissionEdit: formData[index]?.permissionEdit !== undefined ? formData[index].permissionEdit : item.permissionEdit,
                departmentManagement: formData[index]?.departmentManagement !== undefined ? formData[index].departmentManagement : item.departmentManagement,
                rankEdit: formData[index]?.rankEdit !== undefined ? formData[index].rankEdit : item.rankEdit,
                companyEdit: formData[index]?.companyEdit !== undefined ? formData[index].companyEdit : item.companyEdit,
                notice: formData[index]?.notice !== undefined ? formData[index].notice : item.notice,
                document: formData[index]?.document !== undefined ? formData[index].document : item.document,
                persInfo: formData[index]?.persInfo !== undefined ? formData[index].persInfo : item.persInfo,
                schedule: formData[index]?.schedule !== undefined ? formData[index].schedule : item.schedule
            };
        });

        console.log(completeFormData); // 요청 데이터 확인

        try {
            for (const data of completeFormData) {
                const existsResponse = await axios.get('/selectAllAuth', {
                    params: {empCode: data.empCode}
                });

                if (existsResponse.data.length > 0) {
                    await axios.put('/updateAuth', data, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                } else {
                    await axios.post('/insertAuth', data, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                }
            }
            alert("저장 완료");
            // fetchData(); // 저장 후 데이터 다시 가져오기

        } catch (error) {
            console.error(error);
            alert("저장 중 오류가 발생했습니다.");
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

//<토글>
    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };


    if (!hasPermission) {
        return (
            <div className="flex items-center justify-center h-screen">
                <h1 className="text-center text-4xl font-bold text-gray-500">권한이 없습니다. 접근할 수 없습니다.</h1>
            </div>
        );
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
                <div className="fixed h-full">
                    <aside className="mt-14 h-full w-64 bg-gray-200 border-r-2 shadow-lg p-4 space-y-2">
                        <ol>
                            <li>
                                <div>
                                    <button
                                        className={`w-full flex items-center transition-colors duration-300`}
                                    >
                                        <ChevronRight className="mr-2 h-4 w-4"/>
                                        <span className="hover:underline">권한관리</span>

                                    </button>
                                </div>
                            </li>
                        </ol>
                    </aside>
                </div>
                <main className="ml-64 mt-14 flex-1 p-4 w-full h-full sm:w-[80%] md:w-[70%] lg:w-[60%]">
                    <h1 className="text-2xl font-bold mb-4">권한관리</h1>
                    <div className="space-y-2">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>사원코드</TableHead>
                                    <TableHead>사원명</TableHead>
                                    <TableHead>부서명</TableHead>
                                    <TableHead>직급</TableHead>
                                    <TableHead>권한수정</TableHead>
                                    <TableHead>부서관리</TableHead>
                                    <TableHead>직급관리</TableHead>
                                    <TableHead>회사관리</TableHead>
                                    <TableHead>공지사항권한</TableHead>
                                    <TableHead>문서함권한</TableHead>
                                    <TableHead>인사정보권한</TableHead>
                                    <TableHead>전체일정권한</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {empList.length > 0 ? (
                                    empList.map((item, index) => (
                                        <TableRow key={item.empCode}>
                                            <TableCell>{item.empCode}</TableCell>
                                            <TableCell>{item.empName}</TableCell>
                                            <TableCell>{item.depCode}</TableCell>
                                            <TableCell>{item.posCode}</TableCell>
                                            <TableCell>
                                                <input type="checkbox"
                                                       checked={formData[index]?.permissionEdit}
                                                       onChange={() => handleCheckboxChange(index, 'permissionEdit')}/>
                                            </TableCell>
                                            <TableCell>
                                                <input type="checkbox"
                                                       checked={formData[index]?.departmentManagement}
                                                       onChange={() => handleCheckboxChange(index, 'departmentManagement')}/>
                                            </TableCell>
                                            <TableCell>
                                                <input type="checkbox"
                                                       checked={formData[index]?.rankEdit}
                                                       onChange={() => handleCheckboxChange(index, 'rankEdit')}/>
                                            </TableCell>
                                            <TableCell>
                                                <input type="checkbox"
                                                       checked={formData[index]?.companyEdit}
                                                       onChange={() => handleCheckboxChange(index, 'companyEdit')}/>
                                            </TableCell>
                                            <TableCell>
                                                <select className="text-center"
                                                        value={formData[index]?.notice}
                                                        onChange={(e) => handleSelectChange(index, 'notice', e.target.value)}>
                                                    <option value="0">없음</option>
                                                    <option value="1">작성</option>
                                                    <option value="2">수정</option>
                                                    <option value="3">삭제</option>
                                                    <option value="4">작성+수정</option>
                                                    <option value="5">작성+삭제</option>
                                                    <option value="6">수정+삭제</option>
                                                    <option value="7">전부</option>
                                                </select>
                                            </TableCell>
                                            <TableCell>
                                                <select className="text-center"
                                                        value={formData[index]?.document}
                                                        onChange={(e) => handleSelectChange(index, 'document', e.target.value)}>
                                                    <option value="0">없음</option>
                                                    <option value="1">작성</option>
                                                    <option value="2">수정</option>
                                                    <option value="3">삭제</option>
                                                    <option value="4">작성+수정</option>
                                                    <option value="5">작성+삭제</option>
                                                    <option value="6">수정+삭제</option>
                                                    <option value="7">전부</option>
                                                </select>
                                            </TableCell>
                                            <TableCell>
                                                <select className="text-center"
                                                        value={formData[index]?.persInfo}
                                                        onChange={(e) => handleSelectChange(index, 'persInfo', e.target.value)}>
                                                    <option value="0">없음</option>
                                                    <option value="1">조회</option>
                                                    <option value="2">수정</option>
                                                    <option value="3">삭제</option>
                                                    <option value="4">조회+수정</option>
                                                    <option value="5">조회+삭제</option>
                                                    <option value="6">수정+삭제</option>
                                                    <option value="7">전부</option>
                                                </select>
                                            </TableCell>
                                            <TableCell>
                                                <select className="text-center"
                                                        value={formData[index]?.schedule}
                                                        onChange={(e) => handleSelectChange(index, 'schedule', e.target.value)}>
                                                    <option value="0">없음</option>
                                                    <option value="1">작성</option>
                                                    <option value="2">수정</option>
                                                    <option value="3">삭제</option>
                                                    <option value="4">작성+수정</option>
                                                    <option value="5">작성+삭제</option>
                                                    <option value="6">수정+삭제</option>
                                                    <option value="7">전부</option>
                                                </select>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={10} className="text-center">검색 결과가 없습니다.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <div className="text-center mt-4">
                            <button onClick={handleSubmit} className="bg-gray-500 text-white rounded px-4 py-2">저장
                            </button>
                        </div>
                    </div>
                </main>
            </div>

            <div className="flex absolute ml-96 mt-2" onClick={() => {
                navigate(`/`)
            }}>
                <img src="/BusinessClip.png" alt="mainLogo" className="w-20"/>
                <div className="font-bold mt-2 ml-2">BusinessClip</div>
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
                        {isLoggedIn ? (
                                isAdmin == "admin" ? <button
                                        className="mt-2 w-full h-10 text-white bg-gray-400 hover:bg-gray-500 rounded"
                                        onClick={handleLogout}>로그아웃
                                    </button> :
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
                                                    com !== null && com !== "" ? ListLibrary.WorkerList(com) : <></>
                                                ) : btnCtl === 1 ? (
                                                    <>
                                                        <div dangerouslySetInnerHTML={{__html: chatListLoad}}/>
                                                    </>
                                                ) : btnCtl === 2 ? (
                                                    <>
                                                        <div dangerouslySetInnerHTML={{__html: addressBookHtml}}/>
                                                    </>
                                                ) : btnCtl === 3 ? (
                                                    <>
                                                        <div dangerouslySetInnerHTML={{__html: noticeHtml}}/>
                                                        <div>
                                                            <button className="text-center border w-full h-[45px]"
                                                                    onClick={() => setBtnCtl(6)}>
                                                                {" "}
                                                                공지사항 추가하기
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : btnCtl === 4 ? (
                                                    <>
                                                        {inviteChatCtl === 0 ? <>
                                                                <div className="h-[353px] overflow-y-auto chatRoomDiv">
                                                                    <div dangerouslySetInnerHTML={{__html: chatInHTML}}/>
                                                                </div>
                                                                <div className="w-[100%] h-[50px] flex">
                                                                    <input className="w-[70%] border chatInput"/>
                                                                    <button
                                                                        className="w-[30%] border flex justify-center items-center"
                                                                        onClick={() => {
                                                                            handleSendMessage();
                                                                        }}>입력
                                                                    </button>
                                                                </div>
                                                                <div className="flex">
                                                                    <button
                                                                        className="w-[50%] h-[30px] border flex justify-center items-center"
                                                                        onClick={() => {
                                                                            setInviteChatCtl(1)
                                                                            setChatMemList2Set()
                                                                        }}>조직도로 초대하기
                                                                    </button>
                                                                    <button
                                                                        className="w-[50%] h-[30px] border flex justify-center items-center"
                                                                        onClick={() => {
                                                                            document.querySelector(".chatInput").value = ""
                                                                            setInviteChatCtl(2)
                                                                        }}>아이디로 초대하기
                                                                    </button>
                                                                </div>
                                                            </> :
                                                            inviteChatCtl === 1 ? <>
                                                                    <div dangerouslySetInnerHTML={{__html: chatMemList2}}/>
                                                                    <button className="border w-[100%] h-[45px] chatListAddBtn3"
                                                                            onClick={() => {
                                                                                chatInviteList().then(r => setInviteChatCtl(0))
                                                                                setChatMemList2Set()
                                                                            }}>초대하기
                                                                    </button>
                                                                </> :
                                                                inviteChatCtl === 2 ?
                                                                    <>
                                                                        <div
                                                                            className="h-[383px] overflow-y-auto chatRoomDiv">
                                                                            <div
                                                                                dangerouslySetInnerHTML={{__html: chatInHTML}}/>
                                                                        </div>
                                                                        <div className="flex">
                                                                            <input className="border w-[70%] h-[50px]"/>
                                                                            <button
                                                                                className="w-[30%] h-[50px] border flex justify-center items-center"
                                                                                onClick={(e) => {
                                                                                    setInviteChatCtl(0)
                                                                                    chatInviteList2(e.currentTarget.parentNode.children[0].value).then(e.currentTarget.parentNode.children[0].value = "")
                                                                                    setChatMemList2Set()
                                                                                }}>
                                                                                아이디로<br/>초대하기
                                                                            </button>
                                                                        </div>
                                                                    </>
                                                                    : <></>
                                                        }
                                                    </>
                                                ) : btnCtl === 5 ? (
                                                    <>
                                                        <div dangerouslySetInnerHTML={{__html: loadNoticeHtml}}/>
                                                        <div>
                                                            <button className="text-center border w-full h-[45px]"
                                                                    onClick={() => setBtnCtl(3)}>
                                                                목록으로
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : btnCtl === 6 ? (
                                                    <>
                                                        {ListLibrary.noticeWritePage(com, setBtnCtl)}
                                                        <button
                                                            className="text-center border w-full h-[45px]"
                                                            onClick={() => {
                                                                setBtnCtl(3);
                                                                ListLibrary.noticeInsert(user);
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
                            )
                            : (<><h2 className="mt-2">로그인</h2>
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
                                        className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 mb-4">
                                        로그인
                                    </button>
                                </>
                            )}
                    </div>
                </div>
                <div
                    className="fixed mt-14 top-0 right-16 transform -translate-x-3 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-gray-300"></div>
            </div>
        </div>
    )
        ;
}