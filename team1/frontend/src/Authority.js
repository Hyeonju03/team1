import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from "axios"; // useNavigate 임포트 추가
import {useAuth} from "./noticeAuth";

function Table({children}) {
    return (
        <table className="min-w-full border border-gray-300">
            {children}
        </table>
    );
}

function TableHeader({children}) {
    return <thead className="bg-gray-200">{children}</thead>;
}

function TableBody({children}) {
    return <tbody>{children}</tbody>;
}

function TableRow({children}) {
    return <tr className="border-b text-center">{children}</tr>;
}

function TableHead({children}) {
    return <th className="p-2 border border-gray-300 text-center">{children}</th>;
}

function TableCell({children, colSpan, className}) {
    return <td colSpan={colSpan} className={`p-2 border border-gray-300 ${className}`}>{children}</td>;
}

export default function Component() {
    const [empList, setEmpList] = useState([]);
    const [formData, setFormData] = useState([]);
    const [hasPermission, setHasPermission] = useState(false)

    const navigate = useNavigate(); // useNavigate 훅 사용
    // 로그인
    const {isLoggedIn, empCode, logout} = useAuth();
    const [prevLogin, setPrevLogin] = useState(undefined);   // 이전 로그인 상태를 추적할 변수

    // slide 변수
    const [isPanelOpen, setIsPanelOpen] = useState(false); // 화면 옆 슬라이드

    //로그아웃이 맨위로
    useEffect(() => {
        if (!localStorage.getItem('empCode')) {
            alert("로그인하세요")
            navigate("/"); // 로그인하지 않으면 홈페이지로 이동
        }
    }, [])

    console.log("emp", empCode)


    useEffect(() => {
        if (isLoggedIn) {
            const fetchData = async () => {
                console.log("여기는옴")
                const response = await axios.get("/permissionSelect", {params: {empCode: empCode}})
                console.log("->->", response.data);

                if (response.data === 0) {
                    setHasPermission(false);
                } else {
                    setHasPermission(true);
                    fetchData2();
                }
            };
            fetchData(); // 권한이 있을 경우 fetchData 호출
        }
        setPrevLogin(isLoggedIn);
    }, [isLoggedIn, empCode]); // isLoggedIn과 empCode 변경 시에만 실행

    // 직원 데이터를 가져오는 함수
    const fetchData2 = async () => {
        if (empCode) {
            const EmpCode2 = empCode.split("-")[0];
            console.log(EmpCode2)
            const response = await axios.get("/selectEmployeeList", {params: {empCode: EmpCode2}});
            setEmpList(response.data);
            setFormData(response.data.map(item => ({
                permissionEdit: item.permissionEdit,
                departmentManagement: item.departmentManagement,
                rankEdit: item.rankEdit,
                companyEdit: item.companyEdit,
                notice: item.notice,
                document: item.document,
                persInfo: item.persInfo,
                schedule: item.schedule
            }))); // formData 초기화
        }
    };

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
                rankEdit: formData[index]?.rankEdit !== undefined ? formData[index].rankEdit : item.rankEdit,
                companyEdit: formData[index]?.companyEdit !== undefined ? formData[index].companyEdit : item.companyEdit,
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
                    params: {empCode: data.empCode}
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
            // fetchData(); // 저장 후 데이터 다시 가져오기

        } catch (error) {
            console.error(error);
            alert("저장 중 오류가 발생했습니다.");
        }
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

//<토글>
    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };


    if (!hasPermission) {
        return (
            <div className="flex items-center justify-center h-screen">
                <h1 className="text-center text-4xl font-bold text-red-500">권한이 없습니다. 접근할 수 없습니다.</h1>
            </div>
        );
    }

    return (
        <div className="overflow-hidden flex flex-col min-h-screen w-full  mx-auto p-4  rounded-lg ">
            <h1 className="text-2xl font-bold text-center p-4 bg-gray-200 mb-6">로고</h1>
            <div className="flex">
                {/*사이드바*/}
                <div>
                    <aside className="w-64 bg-gray-100 p-4 space-y-2" style={{height: "800px"}}>
                        <ol>
                            <li>
                                <div>
                                    <button
                                        className={`w-full flex items-center transition-colors duration-300`}>
                                        <span className="hover:underline">결재함</span>
                                    </button>
                                    <div className="ml-8 space-y-2 pace-y-2 mt-2">
                                        <li>
                                            <div>
                                                <button className="w-full flex items-center">
                                                    <div className="hover:underline">전체 보기</div>
                                                </button>
                                            </div>
                                        </li>
                                        <li>
                                            <div>
                                                <button className="w-full flex items-center">
                                                    <div className="hover:underline">카테고리</div>
                                                </button>
                                                <li className={`text-left transition-colors duration-300`}>
                                                    <div className="flex">
                                                        <button className="hover:underline">
                                                        </button>
                                                    </div>
                                                </li>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="flex justify-between">
                                                <button className="w-full flex items-center">
                                                    <div className="hover:underline">내 결재함</div>
                                                </button>

                                            </div>
                                        </li>
                                    </div>
                                </div>
                            </li>
                        </ol>
                    </aside>
                </div>
                <div className="flex-1" style={{marginLeft: "10px"}}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>사원코드</TableHead>
                                <TableHead>사원명</TableHead>
                                <TableHead>부서명</TableHead>
                                <TableHead>직급</TableHead>
                                <TableHead>권한수정</TableHead>
                                <TableHead>부서관리</TableHead>
                                <TableHead>직급관리</TableHead>
                                <TableHead>회사관리</TableHead>
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
                                            <input type="checkbox"
                                                   checked={formData[index]?.rankEdit}
                                                   onChange={() => handleCheckboxChange(index, 'rankEdit')}/>
                                        </TableCell>
                                        <TableCell>
                                            <input type="checkbox"
                                                   checked={formData[index]?.companyEdit}
                                                   onChange={() => handleCheckboxChange(index, 'companyEdit')}/>
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
