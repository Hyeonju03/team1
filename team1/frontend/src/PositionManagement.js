import React, {useEffect, useState} from 'react'
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd'
import {FaPencilAlt, FaTrash} from 'react-icons/fa'
import axios from "axios";

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
    const [companyName, setCompanyName] = useState('회사명');
    const [positions, setPositions] = useState([]);
    const [newPositionName, setNewPositionName] = useState('');

    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const response = await axios.get('/positions', {
                    params: {comCode: process.env.REACT_APP_COM_TEST_CODE}
                });
                const positionNames = response.data.posCode.split(','); // 쉼표로 분리
                const positionObjects = positionNames.map((name, index) => ({
                    id: `${index + 1}`,
                    name: name.trim(),
                }));
                setPositions(positionObjects);
            } catch (error) {
                console.error(error);
            }
        };

        fetchPositions();
    }, []);


    const handleDelete = (nodeId) => {
        setPositions(positions.filter(pos => pos.id !== nodeId))
    }

    const handleUpdate = (nodeId, newName) => {
        setPositions(positions.map(pos =>
            pos.id === nodeId ? {...pos, name: newName} : pos
        ))
    }

    const handleCompanyEdit = (newName) => {
        setCompanyName(newName)
    }

    const handleDragEnd = async (result) => {
        if (!result.destination) return

        const items = Array.from(positions)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        // console.log(items.map(d => d.name).join(','));
        const updatedPosCode = items.map(d => d.name).join(',');

        try {
            await axios.put('/positions/updateOrder', {
                comCode: process.env.REACT_APP_COM_TEST_CODE,
                posCode: updatedPosCode
            });

            setPositions(items);
        } catch (e) {
            console.error(e);
        }
    };

    const handleInsert = async () => {
        if (!newPositionName) return;

        // posCode를 문자열로 설정
        const posCode = newPositionName.trim();

        try {
            await axios.put('/positions/insert', {
                comCode: process.env.REACT_APP_COM_TEST_CODE,
                posCode: posCode
            });
            // 상태 업데이트
            setPositions([...positions, {id: `new-${Date.now()}`, name: newPositionName}]);
            setNewPositionName('');
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="p-4 max-w-md mx-auto">
            <div className="mb-8">
                {/* Company Name */}
                <div className="flex items-center gap-2 py-2 mb-4">
                    <span className="font-bold text-lg">{companyName}</span>
                    <button
                        onClick={() => {
                            const newName = prompt('회사명을 입력하세요:', companyName)
                            if (newName) handleCompanyEdit(newName)
                        }}
                        className="p-1 hover:text-blue-500 transition-colors"
                    >
                        <FaPencilAlt className="w-4 h-4"/>
                    </button>
                </div>

                {/* 직급 리스트 */}
                <DragDropContext onDragEnd={handleDragEnd}>
                    <StrictModeDroppable droppableId="positions">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="ml-4 space-y-2"
                            >
                                {positions.map((position, index) => (
                                    <Draggable
                                        key={position.id}
                                        draggableId={position.id}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`flex items-center gap-2 py-2 px-3 bg-white border border-gray-200 rounded-md shadow-sm
                          ${snapshot.isDragging ? 'shadow-md bg-gray-50' : ''}`}
                                            >
                                                <span className="cursor-move">{position.name}</span>
                                                <div className="ml-auto flex items-center gap-1">
                                                    <button
                                                        onClick={() => {
                                                            const newName = prompt('직급명을 입력하세요:', position.name)
                                                            if (newName) handleUpdate(position.id, newName)
                                                        }}
                                                        className="p-1 hover:text-blue-500 transition-colors"
                                                    >
                                                        <FaPencilAlt className="w-4 h-4"/>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(position.id)}
                                                        className="p-1 hover:text-red-500 transition-colors"
                                                    >
                                                        <FaTrash className="w-4 h-4"/>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </StrictModeDroppable>
                </DragDropContext>
            </div>

            {/* Add New Position Form */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newPositionName}
                    onChange={(e) => setNewPositionName(e.target.value)}
                    placeholder="새 직급 이름"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                    onClick={handleInsert}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors"
                >
                    추가
                </button>
            </div>
        </div>
    )
}