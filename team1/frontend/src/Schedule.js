import React, {useEffect, useState} from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Schedule.css';
import axios from "axios";

const typeColors = {
    '개인': 'bg-blue-200',
    '부서': 'bg-green-200',
    '전체': 'bg-yellow-200',
};

export default function Schedule() {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [schedules, setSchedules] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [empCode,setEmpCode] = useState("")
    const [selectedScheduleId, setSelectedScheduleId] = useState(null);
    const [auth, setAuth] = useState("");
    const [newSchedule, setNewSchedule] = useState({
        snum : 0,
        content: '',
        startDate: new Date(),
        endDate: new Date(),
        category: '개인',
    });

    //로그인시 empcode를 일단 가져오는코드
    useEffect(() => {
        // 로그인 후 empCode를 설정하는 로직
        const fetchEmpCode = async () => {
            // 여기에서 실제 empCode를 설정
            const loggedInEmpCode = "2218701188-d"; // 로그인 후 받아온 empCode
            setEmpCode(loggedInEmpCode);
        };
        fetchEmpCode();
    }, []);

    //console.log(empCode)

    useEffect(() => {
        if(empCode){
            const fetchSchedules = async () => {
                try {
                    const response = await axios.get(`/selectSchedule?empCode=${empCode}`);
                    const schedulesWithDates = response.data.map(schedule => ({
                        ...schedule,
                        snum : schedule.snum,
                        startDate: new Date(schedule.startDate), // 문자열을 Date 객체로 변환
                        endDate: new Date(schedule.endDate), // 문자열을 Date 객체로 변환
                    }));
                    console.log(schedulesWithDates);
                    setSchedules(schedulesWithDates);
                } catch (error) {
                    console.error("개에러", error);
                }
            };
            fetchSchedules();
        }
    }, [empCode]);

    useEffect(() => {
        if(empCode) {
            const fetchData = async () => {
                console.log(empCode)
                try {
                    const resp = await axios.get("/selectAuth", {params: {empCode: empCode}});
                    console.log(resp);
                    setAuth(resp.data)
                } catch (error){
                    console.error(error)
                }
            }
                if (auth ==0){
                    //암것도못함
                }
                else if(auth == 1){
                    //작성가능
                }else if (auth == 2) {
                    //수정가능
                }else if (auth== 3) {
                    //삭제
                }else if (auth == 4) {
                    //작성+수정
                }else if (auth== 5) {
                    //작성+삭제
                }else if (auth == 6) {
                    //수정+삭제
                }else {
                    //다가능
                }
            }

        if(empCode){
            fetch();
        }
        },[empCode])

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        setNewSchedule(prev => ({ ...prev, startDate: date, endDate: date }));
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
            }catch (error){
                console.error(error)
            }
        }
    };

    const handleEditSchedule = async (schedule) => {
        setEditingSchedule(schedule);
        setNewSchedule(schedule);
        setIsModalOpen(true);
        console.log("..?",newSchedule)

    };

    const handleUpdateSchedule = async () => {
        if (editingSchedule && newSchedule.content && newSchedule.category) {

            try {
                const resp = await axios.put("/updateSchedule",  newSchedule);
                console.log(resp)
            } catch (error){
                console.error(error)
            }

            setSchedules(prev =>
                prev.map(s => (s.snum === editingSchedule.snum ? { ...s, ...newSchedule } : s))
            );
            resetModal();
        }


    };

    const handleDeleteSchedules = async () => {
        console.log("handleDeleteSchedules");
        console.log(selectedScheduleId);
        try {
            const resp = await axios.delete("/deleteSchedule", {
                params: { sNum: selectedScheduleId }});
            console.log(resp)
        } catch (error){
            console.error(error)
        }

        setSchedules(prev => prev.filter(s => !s.selected));

    };

    const toggleScheduleSelection = (id) => {
        setSelectedScheduleId(prev => (prev === id ? null : id));
        setSchedules(prev =>
            prev.map(s => ({ ...s, selected: s.snum === id }))
        );
    };
    const handleScheduleTypeChange = (category) => {
        setNewSchedule(prev => ({ ...prev, category }));
    };

    const resetModal = () => {
        setIsModalOpen(false);
        setEditingSchedule(null);
        setNewSchedule({
            content: '',
            startDate: new Date(),
            endDate: new Date(),
            category: '개인',
        });
        setSelectedDate(null);
    };

    return (
        <div className="min-h-screen flex flex-col">
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

                            tileContent={({ date }) => {
                                const daySchedules = schedules.filter(s => {

                                    //console.log(s.snum);
                                    const start = s.startDate;
                                    const end = s.endDate;
                                    // 현재 날짜가 시작일과 종료일 사이에 있는지 확인

                                    const title = date >= start && date <= end;

                                    //console.log(title);

                                    return title;
                                });

                                return (
                                    <div className="text-xs mt-1">
                                        {daySchedules.map(s => (
                                            <div key={s.snum} className={`truncate ${typeColors[s.category]}`}>
                                                {s.content}
                                            </div>
                                        ))}
                                        {daySchedules.length > 2 && <div>...</div>}
                                    </div>
                                );
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
                                onClick={handleDeleteSchedules}
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
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedScheduleId === schedule.snum}
                                                onChange={() => toggleScheduleSelection(schedule.snum)} // 선택 토글
                                                className="mr-2"
                                            />
                                            <span>{schedule.content}</span>
                                            <span className="ml-auto text-xs">{schedule.category} 일정</span>
                                            <button
                                                onClick={() => handleEditSchedule(schedule)}
                                                className="ml-2 bg-gray-200 px-2 py-1 rounded"
                                            >
                                                수정
                                            </button>
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            {schedule.startDate.toLocaleDateString()} - {schedule.endDate.toLocaleDateString()}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
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
                                onChange={e => setNewSchedule(prev => ({...prev, startDate: new Date(e.target.value)}))}
                                className="w-1/2 p-2 border rounded mr-2"
                            />
                            <input
                                type="date"
                                value={newSchedule.endDate.toISOString().split('T')[0]}
                                onChange={e => setNewSchedule(prev => ({ ...prev, endDate: new Date(e.target.value) }))}
                                className="w-1/2 p-2 border rounded"
                            />
                        </div>
                        <div className="mb-2">
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
                            <label>
                                <input
                                    type="radio"
                                    name="type"
                                    value="전체"
                                    checked={newSchedule.category === '전체'}
                                    onChange={() => handleScheduleTypeChange('전체')}
                                    className="mr-1"
                                />
                                전체
                            </label>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={resetModal}
                                className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
                            >
                                취소
                            </button>
                            <button
                                onClick={editingSchedule ? handleUpdateSchedule : handleAddSchedule}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                {editingSchedule ? '수정' : '추가'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
