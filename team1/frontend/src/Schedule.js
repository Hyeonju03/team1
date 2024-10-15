import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Schedule.css';

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
    const [newSchedule, setNewSchedule] = useState({
        content: '',
        startDate: new Date(),
        endDate: new Date(),
        type: '개인',
    });

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        setNewSchedule(prev => ({ ...prev, startDate: date, endDate: date }));
        setIsModalOpen(true);
    };

    const handleAddSchedule = () => {
        if (newSchedule.content && newSchedule.type) {
            setSchedules(prev => [
                ...prev,
                { id: Date.now(), ...newSchedule },
            ]);
            resetModal();
        }
    };

    const handleEditSchedule = (schedule) => {
        setEditingSchedule(schedule);
        setNewSchedule(schedule);
        setIsModalOpen(true);
    };

    const handleUpdateSchedule = () => {
        if (editingSchedule && newSchedule.content && newSchedule.type) {
            setSchedules(prev =>
                prev.map(s => (s.id === editingSchedule.id ? { ...s, ...newSchedule } : s))
            );
            resetModal();
        }
    };

    const handleDeleteSchedules = () => {
        setSchedules(prev => prev.filter(s => !s.selected));
    };

    const toggleScheduleSelection = (id) => {
        setSchedules(prev =>
            prev.map(s => (s.id === id ? { ...s, selected: !s.selected } : s))
        );
    };

    const resetModal = () => {
        setIsModalOpen(false);
        setEditingSchedule(null);
        setNewSchedule({
            content: '',
            startDate: new Date(),
            endDate: new Date(),
            type: '개인',
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
                                    const start = s.startDate;
                                    const end = s.endDate;
                                    // 시작일과 종료일 사이에 현재 날짜가 포함되는지 확인
                                    return date >= start && date <= end;
                                });
                                return (
                                    <div className="text-xs mt-1">
                                        {daySchedules.slice(0, 2).map(s => (
                                            <div key={s.id} className={`truncate ${typeColors[s.type]}`}>{s.content}</div>
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
                                    <li key={schedule.id}
                                        className={`mb-2 p-2 border rounded ${typeColors[schedule.type]}`}>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={schedule.selected}
                                                onChange={() => toggleScheduleSelection(schedule.id)}
                                                className="mr-2"
                                            />
                                            <span>{schedule.content}</span>
                                            <span className="ml-auto">{schedule.type}</span>
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
                                onChange={e => setNewSchedule(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
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
                                    checked={newSchedule.type === '개인'}
                                    onChange={() => setNewSchedule(prev => ({ ...prev, type: '개인' }))}
                                    className="mr-1"
                                />
                                개인
                            </label>
                            <label className="mr-2">
                                <input
                                    type="radio"
                                    name="type"
                                    value="부서"
                                    checked={newSchedule.type === '부서'}
                                    onChange={() => setNewSchedule(prev => ({ ...prev, type: '부서' }))}
                                    className="mr-1"
                                />
                                부서
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="type"
                                    value="전체"
                                    checked={newSchedule.type === '전체'}
                                    onChange={() => setNewSchedule(prev => ({ ...prev, type: '전체' }))}
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
