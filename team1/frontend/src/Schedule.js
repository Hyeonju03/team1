import React, {useEffect, useState} from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Schedule.css';
import axios from "axios";
import moment from "moment";

import {useAuth} from "./noticeAuth";


const typeColors = {
    '개인': 'bg-blue-200', '부서': 'bg-green-200', '전체': 'bg-yellow-200',
};

export default function Schedule() {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [schedules, setSchedules] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    // const [empCode, setEmpCode] = useState("")
    const {empCode} = useAuth();
    const [selectedScheduleId, setSelectedScheduleId] = useState(null);
    const [auth, setAuth] = useState("");
    const [newSchedule, setNewSchedule] = useState({
        snum: 0, content: '', startDate: new Date(), endDate: new Date(), category: '개인',
    });


    useEffect(() => {
        if (empCode) {
            getAuth(); // 로그인한 후 권한 조회
        }
    }, [empCode]);

    console.log(empCode);

    /* 로그인 후 empCode 설정 함수
    const fetchEmpCode = async () => {
        // 여기에서 실제 empCode를 설정
        const loggedInEmpCode = "3148127227-user002"; // 로그인 후 받아온 empCode
        // setEmpCode(loggedInEmpCode);
    };

    useEffect(() => {
        fetchEmpCode();
    }, []);

     */

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
            const response = await axios.get("/selectFullScgedule", {params: {empCode: empCode}});
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
        if (empCode) {
            getAuth()
        }
    }, [empCode]);

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

    const canAdd = auth == '1' || auth == '4' || auth == '5' || auth == '7';
    const canEdit = auth == '2' || auth == '4' || auth == '6' || auth == '7';
    const canDelete = auth == '3' || auth == '5' || auth == '6' || auth == '7';

    return (<div className="min-h-screen flex flex-col">
        <div className="bg-gray-200 p-4">
            <h1 className="text-2xl font-bold">로고</h1>
        </div>
        <div className="flex-1 p-4">
            <h2 className="text-xl font-semibold mb-4">일정관리</h2>
            <div className="flex">
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
                            className="bg-blue-500 text-white px-4 py-2 rounded"
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
        </div>
        {isModalOpen && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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
                        onChange={e => setNewSchedule(prev => ({...prev, startDate: new Date(e.target.value)}))}
                        className="w-1/2 p-2 border rounded mr-2"
                    />
                    <input
                        type="date"
                        value={newSchedule.endDate.toISOString().split('T')[0]}
                        onChange={e => setNewSchedule(prev => ({...prev, endDate: new Date(e.target.value)}))}
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
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        {editingSchedule ? '수정' : '추가'}
                    </button>
                </div>
            </div>
        </div>)}
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
    </div>);
}
