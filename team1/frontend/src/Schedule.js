import React, {useEffect, useState} from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Schedule.css';
import axios from "axios";
import moment from "moment";
import {useNavigate} from "react-router-dom";

import {useAuth} from "./noticeAuth";
import Clock from "react-live-clock";
import {ChevronRight} from "lucide-react";


const typeColors = {
    '개인': 'bg-pink-200', '부서': 'bg-green-200', '전체': 'bg-yellow-200',
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
    const [btnCtl, setBtnCtl] = useState(0)
    const [isRClick, setIsRClick] = useState(false)
    const [newWindowPosY, setNewWindowPosY] = useState(500)
    const navigate = useNavigate();

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
        }else {
            empInfo();
        }
    }, [])


    useEffect(() => {
        if (isLoggedIn) {
            getAuth(); // 로그인한 후 권한 조회
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
            fetchData(schedulesWithDates);
        } catch (error) {
            console.error("개에러", error);
        }
    };

    /* 부서일정 조회 함수 */
    const fetchData = async (arr) => {
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
    )
        ;
}