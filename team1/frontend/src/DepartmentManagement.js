import React, {useEffect, useState} from 'react';
import {ChevronDown, ChevronRight, Pencil, Plus, Trash} from 'lucide-react';
import axios from 'axios';
import './DepartmentManagement.css';

// 부서 트리
const DepartmentTree = ({departments, onAdd, onDelete, onUpdate}) => {
    const [expanded, setExpanded] = useState({});

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
    const [comCode, setComCode] = useState(process.env.REACT_APP_COM_TEST_CODE);

    // 부서 데이터 가져오기
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('/departments/tree', {params: {comCode: comCode}});
                setDepartments(response.data);
            } catch (e) {
                console.error('부서 트리를 가져오는 중 오류가 발생했습니다.', e);
            }
        };

        fetchDepartments();
    }, []);

    // 부서 추가
    const insertDepartment = async (parentCode) => {
        const newName = prompt('새 부서 이름을 입력하세요:');
        if (newName) {
            const newDepartment = {depCode: newName, name: newName, children: [], updepCode: parentCode};

            // // 부서 트리 업데이트 함수
            // const updateDepartments = (deps) => {
            //     return deps.map(dept => {
            //         if (dept.depCode === parentCode) {
            //             return {...dept, children: [...dept.children, newDepartment]};
            //         }
            //         return {...dept, children: updateDepartments(dept.children)};
            //     });
            // };
            //
            // // 부서 트리 업데이트
            // setDepartments(updateDepartments(departments));

            // 백엔드에 부서 추가 요청
            let ok = true;
            try {
                await axios.put('/departments/insert', {
                    comCode: comCode,
                    depCode: newName,
                    updepCode: parentCode
                });
            } catch (e) {
                console.error('부서 추가 중 오류가 발생했습니다.', e);
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
                console.error('부서 수정 중 오류가 발생했습니다.', e);
            }
        }
    };

    // 부서 삭제
    const deleteDepartment = async (depCode) => {

        const confirmDelete = window.confirm('부서를 삭제하시겠습니까?');
        if (confirmDelete) {
            // 백엔드에 부서 삭제 요청
            try {
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
                console.error('부서 삭제 중 오류가 발생했습니다.', e);
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-5 font-sans department-container">
            <header className="bg-gray-100 p-3 mb-5 text-center">
                <div className="text-2xl font-bold">
                    로고
                </div>
            </header>
            <h1 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">부서 관리</h1>
            <DepartmentTree departments={departments} onAdd={insertDepartment} onDelete={deleteDepartment}
                            onUpdate={updateDepartment}/>
        </div>
    );
}