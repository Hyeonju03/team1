import React, {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Button({ children, size, variant, onClick }) {
    const baseStyle = "px-4 py-2 rounded";
    const sizeStyle = size === "sm" ? "text-sm" : "text-base";
    const variantStyle = variant === "outline" ? "border border-gray-300 bg-white" : "bg-blue-500 text-white";


    return (
        <button className={`${baseStyle} ${sizeStyle} ${variantStyle}`} onClick={onClick}>
            {children}
        </button>
    );
}

function Input({ placeholder ,onChange }) {
    return (
        <input type="text"  onChange={onChange}  placeholder={placeholder} className="border border-gray-300 p-2 rounded w-full" />
    );
}

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
    return <tr className="border-b">{children}</tr>;
}

function TableHead({ children }) {
    return <th className="p-2 text-center">{children}</th>;
}

function TableCell({ children }) {
    return <td className="p-2 text-center">{children}</td>;
}

export default function Component() {
    const navigate = useNavigate();
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const [Qlist,setQList] = useState([])
    const [qSearch,setQSearch] = useState("")
    const [filterQlist,setFilterQlist] = useState([])

    const handleCheckboxChange = (id) => {
        setQList(prevData =>
            prevData.map(item =>
                item.qNum === id ? { ...item, checked: !item.checked } : item
            )
        );

        // filterQlist는 원본 Qlist의 상태를 기반으로 동적으로 업데이트
        setFilterQlist(prevFilterQlist =>
            prevFilterQlist.map(item =>
                item.qNum === id ? { ...item, checked: !item.checked } : item
            )
        );
    };


    useEffect(() => {
        const fetchData = async ()=>{
            try{
                const response = await axios.get("/QDetailList");
                const list = response.data;

                // startDate 변환
                const updatedList = list.map(v => {
                    const date = new Date(v.startDate);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');

                    return {
                        ...v, // 기존 데이터 유지
                        startDate: `${year}-${month}-${day}`, // 변환된 날짜
                        checked: false
                    };
                });

                setQList(updatedList);
                setFilterQlist(updatedList)
            }catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, []);

    const handleDelete = async () => {
        //db데이터 삭제하는 기능 구현해야됨
        const idsToDelete = Qlist.filter(item => item.checked).map(item => item.qNum);
        console.log(idsToDelete)
        if (idsToDelete.length > 0) {
            try {
                await axios.delete("/deleteAdminQDetail",  { data: idsToDelete });
                // 체크된 항목 삭제 후 상태 업데이트
                setQList(prevQList => prevQList.filter(item => !item.checked));
                setFilterQlist(prevFilterQList => prevFilterQList.filter(item => !item.checked));
            } catch (error) {
                console.error("Error deleting items:", error);
            }
        } else {
            alert("삭제할 항목이 선택되지 않았습니다.");
        }
    };

    const qRegister = () => {
        console.log("클릭됨");
        navigate("/AdminQ");
    }


    const qListOnChangeHandler =(e)=>{
        setQSearch(e.target.value)
    }

    const search =(e)=>{
        console.log("클릭");
        if (qSearch.trim() === "") {
            setFilterQlist(Qlist); // 검색어가 없으면 모든 리스트를 보여줍니다.
        } else {
            const filtered = Qlist.filter(item =>
                item.title.includes(qSearch)
            );
            setFilterQlist(filtered);
        }
    }

    const goQDetail =()=>{
        navigate("/AdminQDetail");
        window.location.reload();
    }

    const goFAQ =()=>{
        navigate("/AdminFAQ");
        window.location.reload();
    }

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };


    return (
        <div className="container mx-auto p-4">
            <header className="text-2xl font-bold text-center p-4 bg-gray-200 mb-6">로고</header>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-64 bg-white p-6 shadow-md flex flex-col justify-center items-center"
                     style={{height: "900px"}}>
                    <h2 onClick={goFAQ} className="text-2xl mb-2 cursor-pointer" style={{marginLeft: "-40px" ,marginTop:"-200px"}}>
                        <span   className="inline-block w-2 h-2 bg-black rounded-full mr-2"
                                style={{marginRight: "15px"}}/>FAQ</h2>
                    <ul className="mb-4 text-center">
                        <li className="text-2xl mb-2 ">
                            <span className="inline-block w-2 h-2 bg-black rounded-full mr-2"
                                  style={{marginLeft: "5px"}}/> {/* 점 추가 */}
                            1:1 상담
                            <ul className="ml-4">
                                <li onClick={qRegister}  className="text-lg cursor-pointer" style={{fontWeight: "400"}}>- 문의작성</li>
                                <li onClick={goQDetail}  className="text-lg cursor-pointer" style={{fontWeight: "400"}}>-
                                    문의내역
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <hr className="border-gray-300 my-2 w-full" style={{marginTop:"250px"}}/>
                    <h3 className="text-2xl  mb-2 text-center mt-2">CS 센터</h3>
                    <p className="text-lg mb-2 text-center mt-2" style={{fontWeight: "400"}}>1234-5678</p>
                    <p className="text-lg text-center mt-2">월-금 09:00 ~ 12:00<br/>13:00 ~ 18:00</p>
                    <p className="text-lg mt-2 text-center">(공휴일 휴무)</p>
                </div>

                <main className="flex-1">
                    <h1 className="text-xl font-bold mb-4 text-left">문의내역</h1>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>번호</TableHead>
                                <TableHead>제목</TableHead>
                                <TableHead>등록일</TableHead>
                                <TableHead>상태</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filterQlist.length > 0 ? (
                                filterQlist.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="text-left">{item.qNum}</TableCell>
                                        <TableCell className="text-left">{item.title}</TableCell>
                                        <TableCell className="text-left">{item.startDate}</TableCell>
                                        <TableCell className="text-left flex items-center">
                                            <Button size="sm" variant="outline">{item.qstatus === false ? "답변대기" : "답변완료"}</Button>
                                            <input
                                                type="checkbox"
                                                className="ml-2"
                                                checked={item.checked || false}
                                                onChange={() => handleCheckboxChange(item.qNum)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">결과가 없습니다.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <div className="flex items-center gap-4 mt-4">
                        <div className="flex-1">
                            <Input onChange={qListOnChangeHandler} placeholder="검색" />
                        </div>
                        <Button onClick={search} size="icon" variant="outline">
                            <span className="material-icons">검색</span>
                        </Button>
                        <Button variant="outline" onClick={handleDelete}>삭제</Button>
                        <Button onClick={qRegister}>문의등록</Button>
                    </div>
                </main>
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
