import React, {useEffect, useState} from 'react'
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd'
import {FaExchangeAlt} from 'react-icons/fa'
import axios from "axios";
import {Pencil, Trash} from "lucide-react";
import {useAuth} from "./noticeAuth";
import {useNavigate} from "react-router-dom";

// React 18 strict mode에서 작동하기 위한 wrapper
const StrictModeDroppable = ({children, ...props}) => {
    const [enabled, setEnabled] = useState(false)

    useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true))
        return () => {
            cancelAnimationFrame(animation)
            setEnabled(false)
        }
    }, [])

    if (!enabled) {
        return null
    }

    return <Droppable {...props}>{children}</Droppable>
}

export default function PositionManagement() {
    const [companyName, setCompanyName] = useState('');
    const [positions, setPositions] = useState([]);
    const [newPositionName, setNewPositionName] = useState('');
    const [isReordering, setIsReordering] = useState(false); // 순서 바꾸기
    const [originalPositions, setOriginalPositions] = useState([]);
    //------------------------------------------------
    const [comCode, setComCode] = useState(process.env.REACT_APP_COM_TEST_CODE);
    //------------------------------------------------
    const navigate = useNavigate();
    // 로그인
    const {isLoggedIn, empCode, logout} = useAuth();
    const [prevLogin, setPrevLogin] = useState(undefined);   // 이전 로그인 상태를 추적할 변수
    // slide 변수
    const [isPanelOpen, setIsPanelOpen] = useState(false); // 화면 옆 슬라이드

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };


    // 회사명 불러오기
    useEffect(() => {
        if (isLoggedIn) {
            const fetchCompanyName = async () => {
                try {
                    const response = await axios.get('/companyName', {
                        params: {comCode: comCode}
                    })
                    setCompanyName(response.data);
                } catch (e) {
                    console.error(e);
                }
            };

            fetchCompanyName();
        }
        // 상태 변경 후 이전 상태를 현재 상태로 설정
        setPrevLogin(isLoggedIn);
    }, [isLoggedIn, empCode]);

    // 조회
    useEffect(() => {
        if (isLoggedIn) {
            const fetchPositions = async () => {
                try {
                    const response = await axios.get('/positions', {
                        params: {comCode: comCode}
                    });
                    const positionNames = response.data.posCode.split(','); // 쉼표로 분리
                    const positionObjects = positionNames.map((name, index) => ({
                        id: `${index + 1}`,
                        name: name.trim(),
                    }));
                    setPositions(positionObjects);
                } catch (e) {
                    console.error(e);
                }
            };
            fetchPositions();
        }
        // 상태 변경 후 이전 상태를 현재 상태로 설정
        setPrevLogin(isLoggedIn);
    }, [isLoggedIn, empCode]);

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

    // 추가
    const handleInsert = async () => {
        if (!newPositionName) return;

        // posCode를 문자열로 설정
        const posCode = newPositionName.trim();

        // 새로운 직급 코드가 기존 직급 목록에 있는지 확인
        const isDuplicate = positions.some(pos => pos.name.trim() === posCode.trim());
        if (isDuplicate) {
            alert('해당 직급이 이미 존재합니다: ' + posCode);
            return;
        }

        try {
            await axios.put('/positions/insert', {
                comCode: comCode,
                posCode: posCode
            });

            // 상태 업데이트
            setPositions([...positions, {id: `new-${Date.now()}`, name: newPositionName}]);
            setNewPositionName('');
            alert('직급이 성공적으로 추가되었습니다.');
        } catch (e) {
            alert('직급 추가 중 오류가 발생했습니다.');
        }
    }

    // 순서 변경
    const handleReorderComplete = async () => {
        // console.log(items.map(d => d.name).join(','));
        const updatedPosCode = positions.map(d => d.name).join(',');

        try {
            await axios.put('/positions/updateOrder', {
                comCode: comCode,
                posCode: updatedPosCode
            });

            setIsReordering(false);
            setOriginalPositions([]);
        } catch (e) {
            console.error(e);
        }
    };

    // 수정
    const handleUpdate = async (nodeId, newName) => {
        const oldName = positions.find(pos => pos.id === nodeId).name;

        // 새로운 직급 코드가 기존 직급 목록에 있는지 확인
        const isDuplicate = positions.some(pos => pos.name.trim() === newName.trim());
        if (isDuplicate) {
            alert('해당 직급이 이미 존재합니다: ' + newName);
            return;
        }

        try {
            const response = await axios.put('/positions/update', {
                comCode: comCode,
                oldPosCode: oldName,
                newPosCode: newName,
            });

            if (response.status === 200) {
                setPositions(positions.map(pos =>
                    pos.id === nodeId ? {...pos, name: newName} : pos
                ));
                alert('직급이 성공적으로 수정되었습니다.');
            }
        } catch (e) {
            alert('직급 수정 중 오류가 발생했습니다.');
        }
    }

    // 삭제
    const handleDelete = async (nodeId, posCode) => {
        const confirmDelete = window.confirm('직급을 삭제하시겠습니까?');
        if (confirmDelete) {
            try {
                // 직급 사용 여부 확인
                const response = await axios.get(`/positions/checkUsage/${comCode}/${posCode}`);
                if (response.data.isUsed) {
                    alert('해당 직급이 사용 중이므로 삭제할 수 없습니다.');
                    return; // 사용 중이면 삭제하지 않음
                }

                await axios.delete(`/positions/delete/${comCode}/${posCode}`)
                setPositions(positions.filter(pos => pos.id !== nodeId))
                alert('직급이 성공적으로 삭제되었습니다.');
            } catch (e) {
                alert('직급 삭제 중 오류가 발생했습니다.');
            }
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return

        const items = Array.from(positions)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        setPositions(items)
    }

    const toggleReorderMode = () => {
        if (!isReordering) {
            setOriginalPositions([...positions])
        } else {
            setPositions([...originalPositions])
            setOriginalPositions([])
        }
        setIsReordering(!isReordering)
    }

    return (
        <div className="p-4 max-w-md mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">직급 관리</h1>
                {/* 회사 이름 */}
                <div className="flex items-center gap-2 py-2 mb-4">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{companyName}</span>
                    </div>
                    <button
                        onClick={toggleReorderMode}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                            isReordering
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {isReordering ? '취소' : '순서 바꾸기'}
                    </button>
                </div>

                {/* 직급 리스트 */}
                {isReordering ? (
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <StrictModeDroppable droppableId="positions">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="ml-4 space-y-2"
                                >
                                    {positions.map((position, index) => (
                                        <Draggable key={position.id} draggableId={position.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`flex items-center gap-2 py-2 px-3 bg-white border border-gray-200 rounded-md shadow-sm
                            ${snapshot.isDragging ? 'shadow-md bg-gray-50' : ''}`}
                                                >
                                                    <FaExchangeAlt className="text-gray-400 mr-2"/>
                                                    <span>{position.name}</span>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </StrictModeDroppable>
                    </DragDropContext>
                ) : (
                    <div className="ml-4 space-y-2">
                        {positions.map((position) => (
                            <div
                                key={position.id}
                                className="flex items-center gap-2 py-2 px-3 bg-white border border-gray-200 rounded-md shadow-sm"
                            >
                                <span>{position.name}</span>
                                <div className="ml-auto flex items-center gap-1">
                                    <button
                                        onClick={() => {
                                            const newName = prompt('직급명을 입력하세요:', position.name)
                                            if (newName) handleUpdate(position.id, newName)
                                        }}
                                        className="ml-2 text-yellow-500"
                                    >
                                        <Pencil size={16}/>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(position.id, position.name)}
                                        className="ml-2 text-red-500"
                                    >
                                        <Trash size={16}/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isReordering && (
                <button
                    onClick={handleReorderComplete}
                    className="ml-4 w-[96.5%] px-4 py-2 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition-colors mb-4"
                >
                    순서 변경 완료
                </button>
            )}

            {/* 새 직급 추가 */}
            <div className="flex gap-2 w-[100%]">
                <input
                    type="text"
                    value={newPositionName}
                    onChange={(e) => setNewPositionName(e.target.value)}
                    placeholder="새 직급 이름"
                    className="ml-4 w-[80%] flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                    onClick={handleInsert}
                    className="w-[18%] px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors"
                >
                    추가
                </button>
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
