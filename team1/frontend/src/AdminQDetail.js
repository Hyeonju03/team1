import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

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
    const [data, setData] = useState([
        { id: 1, title: "우에에엥", date: "2024.10.02", status: "답변대기", checked: false },
        { id: 2, title: "하기싫어요", date: "2024.10.03", status: "답변완료", checked: false },
    ]);
    const [qSearch,setQSearch] = useState("")

    const handleCheckboxChange = (id) => {
        setData(prevData =>
            prevData.map(item =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        );
    };

    const handleDelete = () => {
        setData(prevData => prevData.filter(item => !item.checked));
        //db데이터 삭제하는 기능 구현해야됨
    };

    const qRegister = () => {
        console.log("클릭됨");
        navigate("/AdminQ");
    }


    const qListOnChangeHandler =(e)=>{
        setQSearch(e.target.value)
    }

    const search =(e)=>{
        console.log("클릭됨");
        //클릭하면 db에서 qSearch 값조회
    }

    const goQDetail =()=>{
        navigate("/AdminQDetail");
        window.location.reload();
    }

    const goFAQ =()=>{
        navigate("/AdminFAQ");
        window.location.reload();
    }



    return (
        <div className="container mx-auto p-4">
            <header className="text-2xl font-bold text-center p-4 bg-gray-200 mb-6">로고</header>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-64 bg-white p-6 shadow-md flex flex-col justify-center items-center"
                     style={{height: "900px"}}>
                    <h2 onClick={goFAQ} className="text-2xl mb-2 cursor-pointer" style={{marginLeft: "-40px"}}>
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
                    <hr className="border-gray-300 my-2 w-full"/>
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
                            {data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="text-left">{item.id}.</TableCell>
                                    <TableCell className="text-left">{item.title}</TableCell>
                                    <TableCell className="text-left">{item.date}</TableCell>
                                    <TableCell className="text-left flex items-center">
                                        <Button size="sm" variant="outline">{item.status}</Button>
                                        <input
                                            type="checkbox"
                                            className="ml-2"
                                            checked={item.checked}
                                            onChange={() => handleCheckboxChange(item.id)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
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
        </div>
    );
}
