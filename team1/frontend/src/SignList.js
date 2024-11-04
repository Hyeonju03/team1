import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from "axios";
import {ChevronDown, ChevronRight} from "lucide-react";


export default function SignList() {
    const navigate = useNavigate(); // 경로 navigate
    const [isPanelOpen, setIsPanelOpen] = useState(false); // 화면 옆 슬라이드

    // 결재함 열기
    const [isExpanded, setIsExpanded] = useState(false);
    // 카테고리 열기
    const [isCategoriExpanded, setIsCategoriExpanded] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // 검색 입력 상태 추가
    const [filteredDocuments, setFilteredDocuments] = useState([]); // 필터링된 문서 상태
    const [selectedCategory, setSelectedCategory] = useState(''); // 카테고리 상태 변수
    const [checkDoc, setCheckDoc] = useState([]);

    const [rejectedCount, setRejectedCount] = useState(0); // 반려 문서 수 상태 추가

    const empCode = "3148127227-user001";

    useEffect(() => {
        // doc리스트 가져오기
        const comCode = 3148127227

        axios.get(`/sign/${empCode}`)
            .then(response => {
                setDocuments(response.data);
                setFilteredDocuments(response.data); // 초기값은 전체 문서
            })
            .catch(error => console.log(error));

        // code 가져오기
        axios.get(`/code/${comCode} `)
            .then(response => {
                console.log(response.data)
                const uniqueCategories = [...new Set(response.data.signCateCode.split(",").map(category => category))];
                console.log("uniqueCategories::",uniqueCategories)
                setCategories(uniqueCategories);
            })

    }, []);

    useEffect(() => {
        axios.get(`/sign/${empCode}`)
            .then(response => {
                let count = 0;
                response.data.map((data, index) => {
                    if (data.empCode === empCode) {
                        if (data.target.includes("반려")) {
                            count += 1;
                        }
                    }
                })
                setRejectedCount(count)
            })
            .catch(error => console.log(error));

    }, [empCode]);

    // 화면 옆 슬라이드 열림 구분
    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    const goSignRequest = () => {
        // 권한 테이블, controller참고해서 작성권한(따진다면)에 따라 통제하는 코드 필요 ///////////
        navigate("/sign/register");
    }

    // 제목 클릭 시 상세 페이지로 이동
    const handleDocumentClick = async (signNum) => {
        // 문서의 세부 정보 가져오기
        const detailResponse = await axios.get(`/sign/detail/${signNum}`);

        const {target} = detailResponse.data;

        // 현재 사용자의 empCode
        const empCode = "3148127227-user001"; // 실제 empCode로 변경

        // 기존 TARGET 값에서 현재 사용자의 empCode가 있는지 확인
        const targetEntries = target.split(',');
        const updatedTargetEntries = targetEntries.map(entry => {
            // entry 형식: "AB:미확인_미승인"
            const [code, status] = entry.split(':');
            if (code === empCode && status === '미확인_미승인') {
                return `${code}:확인_미승인`; // 업데이트된 값
            }
            return entry; // 업데이트하지 않은 값
        });

        // 새로운 TARGET 값 생성
        const updatedTarget = updatedTargetEntries.join(',');
        // DB 업데이트 요청
        try {
            // endDate를 null로 보내고 싶으면 생략 가능
            await axios.put(`/sign/update/${signNum}`, null, {
                params: {
                    target: updatedTarget
                }
            });
        } catch (error) {
            console.error("PUT 요청 오류:", error);
            alert("업데이트 중 오류가 발생했습니다.");
        }

        // 이동
        navigate(`/sign/detail/${signNum}`)
    }

    // 날짜 형식 변환
    const formatDate = (dateString) => {
        if (!dateString) return ''; // null 또는 undefined일 경우 빈 문자열 반환
        return dateString.replace("T", " ").slice(0, 16);
    };

    // 검색 버튼 클릭 시
    const handleSearch = () => {
        // 검색어가 포함된 문서를 필터링
        const filtered = documents.filter((doc) =>
            doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || // 제목 검색
            doc.content?.toLowerCase().includes(searchQuery.toLowerCase()) || // 내용(문서 설명) 검색
            doc.docCateCode?.toLowerCase().includes(searchQuery.toLowerCase()) // 카테고리 검색
        );
        setFilteredDocuments(filtered); // 필터링된 문서로 상태 업데이트

        // 검색된 결과가 없을 경우
        if (filtered.length === 0) {
            alert("검색된 문서가 없습니다.");
        }
    };

    // 엔터키로 문서 검색 가능
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    }

    // 왼쪽 메뉴 카테고리 선택 시 해당 카테고리와 일치하는 문서들만 필터링
    const handleCategorySelect = (category) => {
        setSelectedCategory(category); // 별도의 선택 상태

        if (category == "all") {
            setFilteredDocuments(documents);
        } else {
            const filtered = documents.filter((document) => document.signCateCode === category);
            setFilteredDocuments(filtered); // 필터링된 문서로 상태 업데이트
            if (filtered.length === 0) {
                alert("해당 카테고리 관련 문서를 찾을 수 없습니다.");
            }
        }
    }

    const mineSignDoc = () => {
        const filtered = documents.filter((document) => document.empCode == "3148127227-user001");
        setFilteredDocuments(filtered);
        if (filtered.length === 0) {
            alert("본인이 작성한 문서가 없습니다.");
        }
    }

    // 체크박스 상태 변화
    const handleCheckboxChange = (signNum) => {
        setCheckDoc(prevState => {
            if (prevState.includes(signNum)) {
                return prevState.filter(num => num !== signNum); // 이미 선택된 문서는 해제
            } else {
                return [...prevState, signNum]; // 새로운 문서 선택
            }
        });
    };

    const handleDelete = async () => {
        const deletePromises = checkDoc.map(signNum => {
            return axios.delete(`/sign/delete/${signNum}`); // DELETE 요청을 반환하도록 수정
        });

        try {
            await Promise.all(deletePromises);

            // 상태 업데이트: 삭제된 문서들을 필터링하여 상태를 갱신
            setDocuments(prevDocuments =>
                prevDocuments.filter(doc => !checkDoc.includes(doc.signNum))
            );
            setFilteredDocuments(prevFilteredDocuments =>
                prevFilteredDocuments.filter(doc => !checkDoc.includes(doc.signNum))
            );

            if (checkDoc.length > 0) {
                alert("삭제 완료");
            } else {
                alert("삭제할 문서가 선택되지 않았습니다.")
            }

            // 체크박스 초기화
            setCheckDoc([]); // 체크된 문서 초기화

        } catch (error) {
            console.error("삭제 오류:", error);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header with logo */}
            <header className="bg-gray-200 p-4">
                <h1 className="text-2xl font-bold text-center">로고</h1>
            </header>
            <div className="flex-1 flex">
                <aside className="w-64 bg-gray-100 p-4 space-y-2">
                    <ol>
                        <li>
                            <div>
                                <button
                                    className={`w-full flex items-center transition-colors duration-300`}
                                    onClick={() => setIsExpanded(!isExpanded)}
                                >
                                    {isExpanded ? <ChevronDown className="mr-2 h-4 w-4"/> :
                                        <ChevronRight className="mr-2 h-4 w-4"/>}
                                    <span className="hover:underline">결재함</span>

                                </button>
                                {isExpanded && (
                                    <div className="ml-8 space-y-2 pace-y-2 mt-2">
                                        <li>
                                            <div>
                                                <button className="w-full flex items-center"
                                                        onClick={() => handleCategorySelect("all")}>
                                                    <ChevronRight className="mr-2 h-4 w-4"/>
                                                    <div className="hover:underline">전체 보기</div>
                                                </button>
                                            </div>
                                        </li>
                                        <li>
                                            <div>
                                                <button className="w-full flex items-center"
                                                        onClick={() => setIsCategoriExpanded(!isCategoriExpanded)}>
                                                    {isCategoriExpanded ? <ChevronDown className="mr-2 h-4 w-4"/> :
                                                        <ChevronRight className="mr-2 h-4 w-4"/>}
                                                    <div className="hover:underline">카테고리</div>
                                                </button>
                                                {isCategoriExpanded && (
                                                    categories.map((category, index) => (
                                                        // 각 카테고리를 ','로 나누고 각 항목을 한 줄씩 출력
                                                        category.split(',').map((item, subIndex) => (
                                                            <li className={`text-left transition-colors duration-300`}>
                                                                <div className="flex">
                                                                    <ChevronRight className="ml-4 mr-2 h-4 w-4"/>
                                                                    <button key={`${index}-${subIndex}`}
                                                                            className="hover:underline"
                                                                            onClick={() => handleCategorySelect(item)}>
                                                                        {item}
                                                                    </button>
                                                                </div>
                                                            </li>
                                                        ))
                                                    ))
                                                )}
                                            </div>
                                        </li>
                                        <li>
                                            <div className="flex justify-between">
                                                <button className="w-full flex items-center"
                                                        onClick={mineSignDoc}>
                                                    <ChevronRight className="mr-2 h-4 w-4"/>
                                                    <div className="hover:underline">내 결재함</div>
                                                </button>
                                                {rejectedCount > 0 &&
                                                    <span
                                                        className="bg-red-700 text-white rounded-full w-6">{rejectedCount}</span>}
                                            </div>
                                        </li>
                                    </div>
                                )}
                            </div>
                        </li>
                    </ol>
                </aside>

                {/* Main content */}
                <main className="flex-1 p-4">
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="relative flex flex-1 max-w-xl">
                            <input type="text" placeholder="문서 검색"
                                   className="pl-10 pr-4 w-[300px] h-[40px] border border-gray-300 rounded"
                                   value={searchQuery} // 검색 입력값 상태와 연결
                                   onChange={(e) => setSearchQuery(e.target.value)} // 입력값이 변경될 때 상태 업데이트
                                   onKeyDown={handleKeyDown}
                            />
                            <search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
                            <button className="ml-2 bg-gray-200 hover:bg-gray-400 rounded w-[50px]"
                                    onClick={handleSearch}>검색
                            </button>
                        </div>

                    </div>
                    <div className="flex justify-end space-x-2 mb-4 ">
                        <button className="w-[50px] h-[40px] hover:bg-gray-400 rounded" onClick={() => {
                            // 등록 페이지로 이동할 때 선택된 카테고리를 전달
                            navigate('/sign/register', {state: {selectedCategory: selectedCategory}});
                        }}>등록
                        </button>
                        <button className="bg-red-700 text-white rounded w-[50px] h-[40px] ml-2"
                                onClick={handleDelete}>삭제
                        </button>
                    </div>
                    <h1 className="text-2xl font-bold mb-4">문서결재</h1>
                    <div className="space-y-2">
                        {/* Document table */}
                        <table className="w-full mb-6">
                            <thead>
                            <tr className="bg-gray-200">
                                <th></th>
                                <th className="p-2 text-center">문서번호</th>
                                <th className="p-2 text-center">분류</th>
                                <th className="p-2 text-center">제목</th>
                                <th className="p-2 text-center">기안일</th>
                                <th className="p-2 text-center">완료일</th>
                                <th className="p-2 text-center">승인현황</th>
                            </tr>
                            </thead>
                            <tbody className="shadow-lg">
                            {(filteredDocuments.length > 0 ? filteredDocuments : documents).map((document, docIndex) => {
                                const target = document.target
                                return (
                                    <tr key={docIndex} className="cursor-pointer hover:bg-gray-100">
                                        <td><input type="checkbox" className="checkDelete"
                                                   onChange={() => handleCheckboxChange(document.signNum)}
                                                   checked={checkDoc.includes(document.signNum)}/></td>
                                        <td className="p-2"
                                            onClick={() => handleDocumentClick(document.signNum)}>{docIndex + 1}</td>
                                        <td className="p-2"
                                            onClick={() => handleDocumentClick(document.signNum)}>{document.signCateCode}</td>
                                        <td className="p-2"
                                            onClick={() => handleDocumentClick(document.signNum)}>{document.title}</td>
                                        <td className="p-2"
                                            onClick={() => handleDocumentClick(document.signNum)}>{formatDate(document.startDate)}</td>
                                        <td className="p-2"
                                            onClick={() => handleDocumentClick(document.signNum)}>{target.includes("반려") ? (
                                            <div className="font-bold text-red-700">반려</div>) : (
                                            target.includes("미승인") ? (<div></div>) : formatDate(document.endDate))}</td>
                                        <td className="p-2" onClick={() => handleDocumentClick(document.signNum)}>
                                            {target.split(',')[1]?.split('_')[1] || ''}
                                            {target.split(',')[2] ? (" > " + target.split(',')[2].split('_')[1]) : ""}
                                            {target.split(',')[3] ? (" > " + target.split(',')[3].split('_')[1]) : ""}
                                            {target.split(',')[4] ? (" > " + target.split(',')[4].split('_')[1]) : ""}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>


                    {/* Create document button */}
                    <button
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                        onClick={goSignRequest}
                    >
                        문서 만들기
                    </button>
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
        </div>
    );

}