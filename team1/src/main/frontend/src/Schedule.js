import React, {useEffect, useRef, useState} from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Schedule.css';
import axios from "axios";
import moment from "moment";
import {useNavigate} from "react-router-dom";
import ListLibrary from "./HtmlFunctions/ListLibrary";
import {useListLibrary} from "./Context/ListLibraryContext";
import {useAuth} from "./noticeAuth";
import Clock from "react-live-clock";
import {ChevronRight} from "lucide-react";


const typeColors = {
    '개인': 'bg-[#fbc2eb]', '부서': 'bg-[#BEA4EE]', '전체': 'bg-[#a6c1ee]',
};

export default function Schedule() {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [schedules, setSchedules] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    // 로그인
    const {isLoggedIn, empCode, logout} = useAuth();
    const [userInfo, setUserInfo] = useState([])
    const navigate = useNavigate();

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

    const [selectedScheduleId, setSelectedScheduleId] = useState(null);
    const [auth, setAuth] = useState("");
    const [newSchedule, setNewSchedule] = useState({
        snum: 0, content: '', startDate: new Date(), endDate: new Date(), category: '개인',
    });
    const today = new Date();
    const formattedDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`;

    //로그아웃이 맨위로
    useEffect(() => {
        if (!localStorage.getItem('empCode')) {
            alert("로그인하세요")
            navigate("/"); // 로그인하지 않으면 홈페이지로 이동
        }
    }, [])


    useEffect(() => {
        if (isLoggedIn) {
            getAuth(); // 로그인한 후 권한 조회
        }
        if(empCode != "") {
            empInfo();
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


    /* 권한 조회 함수 */
    const getAuth = async () => {
        try {
            const resp = await axios.get("/selectAuth", {params: {empCode: empCode}});
            setAuth(resp.data)

            fetchSchedules(); //개일일정조회
        } catch (error) {
            console.error(error)
        }
    }

    /* 개인일정 조회 함수 */
    const fetchSchedules = async () => {
        try {
            const response = await axios.get(`/selectSchedule?empCode=${empCode}`);
            const schedulesWithDates = response.data.map(schedule => ({
                ...schedule, snum: schedule.snum, startDate: new Date(schedule.startDate), // 문자열을 Date 객체로 변환
                endDate: new Date(schedule.endDate), // 문자열을 Date 객체로 변환
            }));
            scheduleData(schedulesWithDates);
        } catch (error) {
            console.error("개에러", error);
        }
    };

    /* 부서일정 조회 함수 */
    const scheduleData = async (arr) => {
        try {
            const response = await axios.get("/selectDepSchedule", {params: {empCode: empCode}});

            const schedulesWithDates = response.data.map(schedule => ({
                ...schedule, snum: schedule.snum, startDate: new Date(schedule.startDate), // 문자열을 Date 객체로 변환
                endDate: new Date(schedule.endDate),     // 문자열을 Date 객체로 변환
            }));

            setSchedules(item => [...arr, ...schedulesWithDates]);

            fullData([...arr, ...schedulesWithDates]);
        } catch (error) {
            console.error(error)
        }
    }

    /* 전체일정 조회 */
    const fullData = async (arr) => {
        try {
            const response = await axios.get("/selectFullSchedule", {params: {empCode: empCode}});
            console.log("resp", response)
            const schedulesWithDates = response.data.map(schedule => ({
                ...schedule, snum: schedule.snum, startDate: new Date(schedule.startDate), // 문자열을 Date 객체로 변환
                endDate: new Date(schedule.endDate),     // 문자열을 Date 객체로 변환
            }));

            setSchedules(item => [...arr, ...schedulesWithDates]);


        } catch (error) {
            console.error(error)
        }
    }


    useEffect(() => {
        console.log(schedules)
    }, [schedules])

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        setNewSchedule(prev => ({...prev, startDate: date, endDate: date}));
        setIsModalOpen(true);
    };

    const handleAddSchedule = async () => {
        if (newSchedule.content && newSchedule.category) {

            try {
                const resp = await axios.post("/scheduleInsert", {
                    empCode: empCode,
                    content: newSchedule.content,
                    startDate: newSchedule.startDate.toISOString(),
                    endDate: newSchedule.endDate.toISOString(),
                    category: newSchedule.category,
                });
                console.log(resp);

                const newScheduleWithId = {
                    //id: Date.now(),
                    id: newSchedule.snum,
                    content: newSchedule.content,
                    startDate: newSchedule.startDate,
                    endDate: newSchedule.endDate,
                    category: newSchedule.category,
                };

                setSchedules(prev => [...prev, newScheduleWithId]); // 새로운 일정 추가

                resetModal();
            } catch (error) {
                console.error(error)
            }
        }
    };

    const handleEditSchedule = async (schedule) => {
        setEditingSchedule(schedule);
        setNewSchedule(schedule);
        setIsModalOpen(true);
        console.log("..?", newSchedule)

    };

    const handleUpdateSchedule = async () => {
        if (editingSchedule && newSchedule.content && newSchedule.category) {

            try {
                const resp = await axios.put("/updateSchedule", newSchedule);
                console.log(resp)
            } catch (error) {
                console.error(error)
            }

            setSchedules(prev => prev.map(s => (s.snum === editingSchedule.snum ? {...s, ...newSchedule} : s)));
            resetModal();
        }


    };

    const handleDeleteSchedules = async () => {
        console.log("handleDeleteSchedules");
        console.log(selectedScheduleId);
        try {
            const resp = await axios.delete("/deleteSchedule", {
                params: {sNum: selectedScheduleId}
            });
            console.log(resp)
        } catch (error) {
            console.error(error)
        }

        setSchedules(prev => prev.filter(s => !s.selected));

    };

    const toggleScheduleSelection = (id) => {
        setSelectedScheduleId(prev => (prev === id ? null : id));
        setSchedules(prev => prev.map(s => ({...s, selected: s.snum === id})));
    };
    const handleScheduleTypeChange = (category) => {
        setNewSchedule(prev => ({...prev, category}));
    };

    const resetModal = () => {
        setIsModalOpen(false);
        setEditingSchedule(null);
        setNewSchedule({
            content: '', startDate: new Date(), endDate: new Date(), category: '개인',
        });
        setSelectedDate(null);
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


    const canAdd = auth == '1' || auth == '4' || auth == '5' || auth == '7';
    const canEdit = auth == '2' || auth == '4' || auth == '6' || auth == '7';
    const canDelete = auth == '3' || auth == '5' || auth == '6' || auth == '7';

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
                                        <span className="hover:underline">일정관리</span>

                                    </button>
                                </div>
                            </li>
                        </ol>
                    </aside>
                </div>
                <main className="ml-64 mt-14 flex-1 p-4 w-full h-full sm:w-[80%] md:w-[70%] lg:w-[60%]">
                    <h1 className="text-2xl font-bold mb-4">일정관리</h1>
                    <div className="space-y-2 flex">
                        <div className="pr-4"> {/* 너비와 높이 설정 */}
                            <Calendar
                                onChange={handleDateClick}
                                value={selectedDate}
                                className="w-full h-full text-lg" // Tailwind 클래스로 크기 설정
                                tileContent={({date}) => {
                                    const calDate = moment(date).format("YYYY-MM-DD")
                                    const daySchedules = schedules.filter(s => {
                                        const start = moment(s.startDate).format("YYYY-MM-DD");
                                        const end = moment(s.endDate).format("YYYY-MM-DD");
                                        // 현재 날짜가 시작일과 종료일 사이에 있는지 확인
                                        const title = calDate >= start && calDate <= end;
                                        return title;
                                    });

                                    return (<div className="text-xs mt-1">
                                        {daySchedules.map(s => (
                                            <div key={s.snum} className={`truncate ${typeColors[s.category]}`}>
                                                {s.content}
                                            </div>))}
                                        {daySchedules.length > 2 && <div>...</div>}
                                    </div>);
                                }}

                            />
                        </div>
                        <div className="w-2/5 pl-4">
                            <div className="flex justify-between mb-4">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                >
                                    일정추가하기
                                </button>
                                <button
                                    // onClick={handleDeleteSchedules}
                                    onClick={() => {
                                        const selectedSchedule = schedules.find(s => s.snum === selectedScheduleId);
                                        if (selectedSchedule && selectedSchedule.category === '전체') {
                                            if (!canDelete) {
                                                alert("전체 일정을 삭제할 수 있는 권한이 없습니다.");
                                                return; // 권한이 없으면 함수 종료
                                            }
                                        }
                                        handleDeleteSchedules();
                                    }}
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    삭제하기
                                </button>
                            </div>
                            <div className="h-[calc(100vh-200px)] overflow-y-auto border rounded p-2">
                                <ul>
                                    {schedules.sort((a, b) => a.startDate.getTime() - b.startDate.getTime()).map(schedule => (
                                        <li key={schedule.snum}
                                            className={`mb-2 p-2 border rounded ${typeColors[schedule.category]}`}>
                                            <div className="flex items-start">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedScheduleId === schedule.snum}
                                                    onChange={() => toggleScheduleSelection(schedule.snum)} // 선택 토글
                                                    className="mr-2"
                                                />
                                                <div className="flex-1">
                                                    <span className="block">{schedule.content}</span> {/* 블록으로 설정 */}
                                                </div>
                                                <span
                                                    className="ml-auto text-xs" style={{marginTop: "10px"}}
                                                > {schedule.category}</span>
                                                <button
                                                    onClick={() => handleEditSchedule(schedule)}
                                                    className="ml-2 bg-gray-200 px-2 py-1 rounded">
                                                    수정
                                                </button>
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                {schedule.startDate.toLocaleDateString()} - {schedule.endDate.toLocaleDateString()}
                                            </div>
                                        </li>))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white p-4 rounded">
                                <h2 className="text-xl font-bold mb-4">
                                    {editingSchedule ? '일정 수정' : '새 일정'}
                                </h2>
                                <input
                                    type="text"
                                    value={newSchedule.content}
                                    onChange={e => setNewSchedule(prev => ({...prev, content: e.target.value}))}
                                    placeholder="내용"
                                    className="w-full p-2 mb-2 border rounded"
                                />
                                <div className="flex mb-2">
                                    <input
                                        type="date"
                                        value={newSchedule.startDate.toISOString().split('T')[0]}
                                        onChange={e => setNewSchedule(prev => ({
                                            ...prev,
                                            startDate: new Date(e.target.value)
                                        }))}
                                        className="w-1/2 p-2 border rounded mr-2"
                                    />
                                    <input
                                        type="date"
                                        value={newSchedule.endDate.toISOString().split('T')[0]}
                                        onChange={e => setNewSchedule(prev => ({
                                            ...prev,
                                            endDate: new Date(e.target.value)
                                        }))}
                                        className="w-1/2 p-2 border rounded"
                                    />
                                </div>
                                <div className="mb-2">
                                    {!editingSchedule && (<>
                                        <label className="mr-2">
                                            <input
                                                type="radio"
                                                name="type"
                                                value="개인"
                                                checked={newSchedule.category === '개인'}
                                                // onChange={() => setNewSchedule(prev => ({ ...prev, type: '개인' }))}
                                                onChange={() => handleScheduleTypeChange('개인')}
                                                className="mr-1"
                                            />
                                            개인
                                        </label>
                                        <label className="mr-2">
                                            <input
                                                type="radio"
                                                name="type"
                                                value="부서"
                                                checked={newSchedule.category === '부서'}
                                                onChange={() => handleScheduleTypeChange('부서')}
                                                className="mr-1"
                                            />
                                            부서
                                        </label>
                                        {canAdd && (<label>
                                            <input
                                                type="radio"
                                                name="type"
                                                value="전체"
                                                checked={newSchedule.category === '전체'}
                                                onChange={() => handleScheduleTypeChange('전체')}
                                                className="mr-1"
                                            />
                                            전체
                                        </label>)}
                                    </>)}


                                </div>
                                <div className="flex justify-end">
                                    <button
                                        onClick={resetModal}
                                        className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
                                    >
                                        취소
                                    </button>
                                    <button
                                        // onClick={editingSchedule ? handleUpdateSchedule : handleAddSchedule}
                                        onClick={() => {
                                            if (editingSchedule && editingSchedule.category === '전체' && !canEdit) {
                                                alert("전체 일정을 수정할 수 있는 권한이 없습니다.");
                                                return; // 권한이 없으면 함수 종료
                                            }
                                            editingSchedule ? handleUpdateSchedule() : handleAddSchedule();
                                        }}
                                        className="bg-gray-500 text-white px-4 py-2 rounded"
                                    >
                                        {editingSchedule ? '수정' : '추가'}
                                    </button>
                                </div>
                            </div>
                        </div>)}
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
                                            com !== null && com !== "" ? ListLibrary.WorkerList(com):<></>
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
                                                                <div className="h-[383px] overflow-y-auto chatRoomDiv">
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