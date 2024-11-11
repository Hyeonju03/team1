import React, {useEffect, useState} from 'react'
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd'
import {FaExchangeAlt} from 'react-icons/fa'
import axios from "axios";
import {ChevronDown, ChevronRight, Pencil, Trash} from "lucide-react";
import {useAuth} from "./noticeAuth";
import {useNavigate} from "react-router-dom";
import Clock from "react-live-clock";

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
    const navigate = useNavigate();
    // 로그인
    const {isLoggedIn, empCode, logout} = useAuth();
    const [userInfo, setUserInfo] = useState([])
    // slide 변수
    const [btnCtl, setBtnCtl] = useState(0)
    const [isRClick, setIsRClick] = useState(false)
    const [newWindowPosY, setNewWindowPosY] = useState(500)
    const [isPanelOpen, setIsPanelOpen] = useState(false); // 화면 옆 슬라이드
    const today = new Date();
    const formattedDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`;

    const [auth, setAuth] = useState(null);

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    const [comCode, setComCode] = useState('');
    const [permission, setPermission] = useState(true);

    // empCode에서 comCode를 추출하는 함수
    const getComCode = (empCode) => {
        return empCode.split('-')[0]; // '3148127227-user001' -> '3148127227'
    };

    useEffect(() => {
        // empCode가 변경될 때마다 comCode를 업데이트
        if (empCode) {
            const newComCode = getComCode(empCode);
            setComCode(newComCode);  // comCode 상태 업데이트
        }
    }, [empCode]); // empCode가 변경될 때마다 실행

    useEffect(() => {
        const fetchAuth = async () => {
            try {
                // 권한 정보 가져오기
                const response = await axios.get(`/authority/positionManagement/${empCode}`);
                setAuth(response.data);
                if (response.data === 0) {
                    setPermission(false);
                } else {
                    setPermission(true);
                }
            } catch (error) {
                console.error('권한 정보를 가져오는 데 실패했습니다.', error);
            }
        };
        if (empCode) {
            fetchAuth();
            empInfo();
        }
    }, [empCode]);

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
    }, [isLoggedIn, empCode, comCode]);

    // 조회
    useEffect(() => {
        if (isLoggedIn && auth == '1') {
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
    }, [isLoggedIn, auth, empCode]);

    const empInfo = async () => {
        try{
            const response = await axios.get(`/emp/${empCode}`);
            setUserInfo(response.data);
        }catch (e){
            console.log(e)
        }
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
                                        <span className="hover:underline">직급관리</span>

                                    </button>
                                </div>
                            </li>
                        </ol>
                    </aside>
                </div>
                <main className="ml-64 mt-14 flex-1 p-4 w-full sm:w-[80%] md:w-[70%] lg:w-[60%]">
                    <h1 className="text-2xl font-bold mb-4">직급관리</h1>
                    <div className="flex justify-center mb-8">
                        <div className="space-y-2 w-4/6 flex flex-col justify-center">
                            {/* 회사 이름 */}
                            <div className="flex items-center gap-2 py-2 mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-2xl">{companyName}</span>
                                </div>
                                <button
                                    onClick={toggleReorderMode}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                                        isReordering
                                            ? 'bg-red-500 text-white hover:bg-red-600'
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
                                                <Draggable key={position.id} draggableId={position.id}
                                                           index={index}>
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
                            <div className="ml-4 space-y-6">
                                {positions.map((position) => (
                                    <div
                                        key={position.id}
                                        className="flex items-center gap-2 py-2 px-3 bg-white border border-gray-200 rounded-md shadow-sm"
                                    >
                                        <span className="text-lg">{position.name}</span>
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
                                className="ml-4 mt-4 w-[80%] h-4/5 flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            />
                            <button
                                onClick={handleInsert}
                                className="w-[18%] mt-4 h-4/5 px-4 py-2 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600 transition-colors"
                            >
                                추가
                            </button>
                        </div>
                    </div>
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