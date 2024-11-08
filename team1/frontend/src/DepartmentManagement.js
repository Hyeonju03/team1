import React, {useEffect, useState} from 'react';
import {ChevronDown, ChevronRight, Pencil, Plus, Trash} from 'lucide-react';
import axios from 'axios';
import './DepartmentManagement.css';
import {useAuth} from "./noticeAuth";
import {useNavigate} from "react-router-dom";
import Clock from "react-live-clock";


// 부서 트리
const DepartmentTree = ({departments, onAdd, onDelete, onUpdate}) => {
    const initializeExpandedState = (depts) => {
        const state = {};
        const setExpandedRecursively = (depts) => {
            depts.forEach(dept => {
                state[dept.depCode] = true; // 모든 부서를 확장된 상태로 설정
                if (dept.children && dept.children.length > 0) {
                    setExpandedRecursively(dept.children); // 자식 부서도 재귀적으로 처리
                }
            });
        };
        setExpandedRecursively(depts);
        return state;
    };

    // 컴포넌트가 처음 렌더링될 때, `expanded` 상태를 설정
    const [expanded, setExpanded] = useState({});

    useEffect(() => {
        // 초기 `expanded` 상태를 설정 (모든 부서 확장)
        setExpanded(initializeExpandedState(departments));
    }, [departments]); // `departments`가 변경될 때마다 초기화

    // 부서 확장, 축소
    const toggleExpand = (code) => {
        setExpanded(prev => ({...prev, [code]: !prev[code]}));
    };

    return (
        <ul className="pl-4">
            {departments.map(dept => (
                <li key={dept.depCode} className="my-2">
                    <div className="flex items-center">
                        {dept.children && dept.children.length > 0 ? (
                            <button onClick={() => toggleExpand(dept.depCode)} className="mr-1">
                                {expanded[dept.depCode] ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
                            </button>
                        ) : (
                            <span className="w-4 mr-1"/>
                        )}
                        <span className="font-semibold text-gray-700 department-name">{dept.depCode}</span>
                        {/* 추가 버튼 */}
                        <button onClick={() => onAdd(dept.depCode)} className="ml-4 text-blue-500">
                            <Plus size={16}/>
                        </button>
                        {/* 수정 버튼 */}
                        {dept.updepCode && (
                            <button onClick={() => onUpdate(dept)} className="ml-2 text-yellow-500">
                                <Pencil size={16}/>
                            </button>
                        )}
                        {/* 삭제 버튼 */}
                        {dept.updepCode && (
                            <button onClick={() => onDelete(dept.depCode)}
                                    className="ml-2 text-red-500">
                                <Trash size={16}/>
                            </button>
                        )}
                    </div>
                    {expanded[dept.depCode] && dept.children.length > 0 && (
                        <DepartmentTree departments={dept.children} onAdd={onAdd} onDelete={onDelete}
                                        onUpdate={onUpdate}/>
                    )}
                </li>
            ))}
        </ul>
    );
};

// 부서 관리
export default function DepartmentManagement() {
    const [departments, setDepartments] = useState([]);
    const navigate = useNavigate();
    // 로그인
    const {isLoggedIn, empCode, logout} = useAuth();
    const [prevLogin, setPrevLogin] = useState(undefined);   // 이전 로그인 상태를 추적할 변수
    // slide 변수
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
                const response = await axios.get(`/authority/departmentManagement/${empCode}`);
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
        }
    }, [empCode]);

    // 부서 데이터 가져오기
    useEffect(() => {
        if (isLoggedIn && auth == '1') {
            const fetchDepartments = async () => {
                try {
                    const response = await axios.get('/departments/tree', {params: {comCode: comCode}});
                    setDepartments(response.data);


                } catch (e) {
                    console.error('부서 트리를 가져오는 중 오류가 발생했습니다.', e);
                }
            };
            fetchDepartments();
        }

        // 상태 변경 후 이전 상태를 현재 상태로 설정
        setPrevLogin(isLoggedIn);
    }, [isLoggedIn, auth, empCode]);

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

    // 부서 추가
    const insertDepartment = async (parentCode) => {
        const newName = prompt('새 부서 이름을 입력하세요:');
        if (newName) {
            const newDepartment = {depCode: newName, name: newName, children: [], updepCode: parentCode};

            // 새로운 부서 코드가 기존 부서 목록에 있는지 확인
            const isDuplicate = (deps) => {
                return deps.some(dept => {
                    // 현재 부서의 이름을 확인
                    if (dept.depCode && dept.depCode.trim() === newName.trim()) {
                        return true; // 중복 발견
                    }
                    // 하위 부서도 확인
                    return isDuplicate(dept.children);
                });
            };

            const hasDuplicate = isDuplicate(departments);

            if (hasDuplicate) {
                alert('해당 부서가 이미 존재합니다: ' + newName);
                return; // 중복인 경우 함수 종료
            }

            // 백엔드에 부서 추가 요청
            let ok = true;
            try {
                await axios.put('/departments/insert', {
                    comCode: comCode,
                    depCode: newName,
                    updepCode: parentCode
                });
            } catch (e) {
                alert('부서 추가 중 오류가 발생했습니다.');
                ok = false;
            }

            if (ok) {
                // 부서 트리 업데이트 함수
                setDepartments(prevDepartments => {
                    const updateDepartments = (deps) => {
                        return deps.map(dept => {
                            if (dept.depCode === parentCode) {
                                return {...dept, children: [...dept.children, newDepartment]};
                            }
                            return {...dept, children: updateDepartments(dept.children)};
                        });
                    };

                    return updateDepartments(prevDepartments);
                });
                alert('부서가 성공적으로 추가되었습니다.');
            }
        }
    };

    // 부서 수정
    const updateDepartment = async (department) => {
        const newName = prompt('수정할 부서 이름을 입력하세요:', department.depCode);


        if (newName && newName !== department.depCode) {
            // 새로운 부서 코드가 기존 부서 목록에 있는지 확인
            const isDuplicate = (deps) => {
                return deps.some(dept => {
                    // 현재 부서의 이름을 확인
                    if (dept.depCode && dept.depCode.trim() === newName.trim()) {
                        return true; // 중복 발견
                    }
                    // 하위 부서도 확인
                    return isDuplicate(dept.children);
                });
            };

            const hasDuplicate = isDuplicate(departments);

            if (hasDuplicate) {
                alert('해당 부서가 이미 존재합니다: ' + newName);
                return; // 중복인 경우 함수 종료
            }

            try {
                await axios.put('/departments/update', {
                    comCode: comCode,
                    depCode: newName,
                    updepCode: department.updepCode,
                    oldDepCode: department.depCode
                });

                // 부서 트리 업데이트 함수
                const updateDepartments = (deps) => {
                    return deps.map(dept => {
                        if (dept.depCode === department.depCode) {
                            return {...dept, depCode: newName, name: newName};
                        }

                        return {...dept, children: updateDepartments(dept.children)};
                    });
                };

                setDepartments(updateDepartments(departments));
                alert('부서가 성공적으로 수정되었습니다.');
            } catch (e) {
                alert('부서 수정 중 오류가 발생했습니다.');
            }
        }
    };

    // 부서 삭제
    const deleteDepartment = async (depCode) => {
        const confirmDelete = window.confirm('부서를 삭제하시겠습니까?');
        if (confirmDelete) {
            try {
                // 부서 사용 여부 확인
                const response = await axios.get(`/departments/checkUsage/${comCode}/${depCode}`);
                if (response.data.isUsed) {
                    alert('해당 부서가 사용 중이므로 삭제할 수 없습니다.');
                    return; // 사용 중이면 삭제하지 않음
                }

                await axios.delete(`/departments/delete/${comCode}/${depCode}`);
                // 부서 트리 업데이트 함수
                const updateDepartments = (deps) => {
                    return deps.filter(dept => dept.depCode !== depCode).map(dept => ({
                        ...dept,
                        children: updateDepartments(dept.children),
                    }));
                };
                setDepartments(updateDepartments(departments));
                alert('부서가 성공적으로 삭제되었습니다.');
            } catch (e) {
                alert('부서 삭제 중 오류가 발생했습니다.');
            }
        }
    };

    return (
        <>
            <div className={`flex items-center justify-center h-screen ${permission ? "hidden" : ""}`}>
                <h1 className="text-center text-4xl font-bold text-red-500">권한이 없습니다. 접근할 수 없습니다.</h1>
            </div>
            <div className="min-h-screen flex flex-col">
                <header className="flex justify-end items-center border-b shadow-md h-[6%] bg-white">
                    <div className="flex mr-6">
                        <div className="font-bold mr-1">{formattedDate}</div>
                        <Clock
                            format={'HH:mm:ss'}
                            ticking={true}
                            timezone={'Asia/Seoul'}/>
                    </div>
                    <div className="mr-5">
                        <img width="40" height="40" src="https://img.icons8.com/windows/32/f87171/home.png"
                             alt="home"/>
                    </div>
                    <div className="mr-16">
                        <img width="45" height="45"
                             src="https://img.icons8.com/ios-glyphs/60/f87171/user-male-circle.png"
                             alt="user-male-circle" onClick={togglePanel}/>
                    </div>
                </header>
                <div className="flex-1 flex">
                    <aside className="w-64 bg-gray-100 p-4 space-y-2">
                        <div>
                            <p>사이드 부분</p>
                        </div>
                    </aside>
                    <main
                        className={`w-full mx-auto p-5 font-sans department-container ${permission ? "" : "hidden"}`}>
                        <h1 className="text-2xl font-bold mb-4 mt-8 text-gray-800 border-b pb-8">부서 관리</h1>
                        <DepartmentTree departments={departments} onAdd={insertDepartment} onDelete={deleteDepartment}
                                        onUpdate={updateDepartment}/>
                    </main>
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
            </div>
        </>
    );
}