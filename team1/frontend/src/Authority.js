import React, {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios"; // useNavigate 임포트 추가



function Table({ children }) {
    return (
        <table className="min-w-full border border-gray-300">
            {children}
        </table>
    );
}

function TableHeader({ children }) {
    return <thead className="bg-gray-200">{children}</thead>;
}

function TableBody({ children }) {
    return <tbody>{children}</tbody>;
}

function TableRow({ children }) {
    return <tr className="border-b text-center">{children}</tr>;
}

function TableHead({ children }) {
    return <th className="p-2 border border-gray-300 text-center">{children}</th>;
}

function TableCell({ children, colSpan, className }) {
    return <td colSpan={colSpan} className={`p-2 border border-gray-300 ${className}`}>{children}</td>;
}

export default function Component() {
    const [empCode, setEmpCode] = useState("");
    const [empList, setEmpList] = useState([]);
    const [formData, setFormData] = useState([]);

    useEffect(() => {
        const fetchEmpCode = async () => {
            const loggedInEmpCode = "3118115625-cjm"; // 로그인 후 받아온 empCode
            const EmpCode2 = loggedInEmpCode.split("-")[0];
            setEmpCode(EmpCode2);
        };
        fetchEmpCode();
    }, []);

    // 직원 데이터를 가져오는 함수
    const fetchData = async () => {
        if (empCode) {
            const response = await axios.get("/selectEmployeeList", { params: { empCode } });
            setEmpList(response.data);
            setFormData(response.data.map(item => ({
                permissionEdit: item.permissionEdit,
                departmentManagement: item.departmentManagement,
                notice: item.notice,
                document: item.document,
                persInfo: item.persInfo,
                schedule: item.schedule
            }))); // formData 초기화
        }
    };

    useEffect(() => {
        fetchData(); // empCode가 설정되면 fetchData 호출
    }, [empCode]);

    const handleCheckboxChange = (index, field) => {
        const newFormData = [...formData];
        newFormData[index] = {
            ...newFormData[index],
            [field]: !newFormData[index][field]
        };
        setFormData(newFormData);
    };

    const handleSelectChange = (index, field, value) => {
        const newFormData = [...formData];
        newFormData[index] = {
            ...newFormData[index],
            [field]: value
        };
        setFormData(newFormData);
    };

    const handleSubmit = async () => {
        const completeFormData = empList.map((item, index) => {
            return {
                empCode: item.empCode,
                depCode: item.depCode,
                empName: item.empName,
                posCode: item.posCode,
                permissionEdit: formData[index]?.permissionEdit !== undefined ? formData[index].permissionEdit : item.permissionEdit,
                departmentManagement: formData[index]?.departmentManagement !== undefined ? formData[index].departmentManagement : item.departmentManagement,
                notice: formData[index]?.notice !== undefined ? formData[index].notice : item.notice,
                document: formData[index]?.document !== undefined ? formData[index].document : item.document,
                persInfo: formData[index]?.persInfo !== undefined ? formData[index].persInfo : item.persInfo,
                schedule: formData[index]?.schedule !== undefined ? formData[index].schedule : item.schedule
            };
        });

        console.log(completeFormData); // 요청 데이터 확인

        try {
            for (const data of completeFormData) {
                const existsResponse = await axios.get('/selectAllAuth', {
                    params: { empCode: data.empCode }
                });

                if (existsResponse.data.length > 0) {
                    await axios.put('/updateAuth', data, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                } else {
                    await axios.post('/insertAuth', data, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                }
            }
            alert("저장 완료");
            fetchData(); // 저장 후 데이터 다시 가져오기

        } catch (error) {
            console.error(error);
            alert("저장 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-center p-4 bg-gray-200 mb-6">로고</h1>
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>사원코드</TableHead>
                            <TableHead>사원명</TableHead>
                            <TableHead>부서명</TableHead>
                            <TableHead>직급</TableHead>
                            <TableHead>권한수정</TableHead>
                            <TableHead>부서관리</TableHead>
                            <TableHead>공지사항권한</TableHead>
                            <TableHead>문서함권한</TableHead>
                            <TableHead>인사정보권한</TableHead>
                            <TableHead>전체일정권한</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {empList.length > 0 ? (
                            empList.map((item, index) => (
                                <TableRow key={item.empCode}>
                                    <TableCell>{item.empCode}</TableCell>
                                    <TableCell>{item.empName}</TableCell>
                                    <TableCell>{item.depCode}</TableCell>
                                    <TableCell>{item.posCode}</TableCell>
                                    <TableCell>
                                        <input type="checkbox"
                                               checked={formData[index]?.permissionEdit}
                                               onChange={() => handleCheckboxChange(index, 'permissionEdit')}/>
                                    </TableCell>
                                    <TableCell>
                                        <input type="checkbox"
                                               checked={formData[index]?.departmentManagement}
                                               onChange={() => handleCheckboxChange(index, 'departmentManagement')}/>
                                    </TableCell>
                                    <TableCell>
                                        <select className="text-center"
                                                value={formData[index]?.notice}
                                                onChange={(e) => handleSelectChange(index, 'notice', e.target.value)}>
                                            <option value="0">없음</option>
                                            <option value="1">작성</option>
                                            <option value="2">수정</option>
                                            <option value="3">삭제</option>
                                            <option value="4">작성+수정</option>
                                            <option value="5">작성+삭제</option>
                                            <option value="6">수정+삭제</option>
                                            <option value="7">전부</option>
                                        </select>
                                    </TableCell>
                                    <TableCell>
                                        <select className="text-center"
                                                value={formData[index]?.document}
                                                onChange={(e) => handleSelectChange(index, 'document', e.target.value)}>
                                            <option value="0">없음</option>
                                            <option value="1">작성</option>
                                            <option value="2">수정</option>
                                            <option value="3">삭제</option>
                                            <option value="4">작성+수정</option>
                                            <option value="5">작성+삭제</option>
                                            <option value="6">수정+삭제</option>
                                            <option value="7">전부</option>
                                        </select>
                                    </TableCell>
                                    <TableCell>
                                        <select className="text-center"
                                                value={formData[index]?.persInfo}
                                                onChange={(e) => handleSelectChange(index, 'persInfo', e.target.value)}>
                                            <option value="0">없음</option>
                                            <option value="1">조회</option>
                                            <option value="2">수정</option>
                                            <option value="3">삭제</option>
                                            <option value="4">조회+수정</option>
                                            <option value="5">조회+삭제</option>
                                            <option value="6">수정+삭제</option>
                                            <option value="7">전부</option>
                                        </select>
                                    </TableCell>
                                    <TableCell>
                                        <select className="text-center"
                                                value={formData[index]?.schedule}
                                                onChange={(e) => handleSelectChange(index, 'schedule', e.target.value)}>
                                            <option value="0">없음</option>
                                            <option value="1">작성</option>
                                            <option value="2">수정</option>
                                            <option value="3">삭제</option>
                                            <option value="4">작성+수정</option>
                                            <option value="5">작성+삭제</option>
                                            <option value="6">수정+삭제</option>
                                            <option value="7">전부</option>
                                        </select>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={10} className="text-center">검색 결과가 없습니다.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <div className="text-center mt-4">
                    <button onClick={handleSubmit} className="bg-blue-500 text-white rounded px-4 py-2">저장</button>
                </div>
            </div>
        </div>
    );
}
