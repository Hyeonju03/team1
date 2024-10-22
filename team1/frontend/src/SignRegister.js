import React, {useEffect, useState} from 'react';
import './App.css';
import SignTarget from "./SignTarget";
import axios from "axios";
import {ChevronDown, ChevronRight, Paperclip} from "lucide-react";
import {useLocation, useNavigate} from "react-router-dom";

export default function SignRegister() {
    const navigate = useNavigate();
    const location = useLocation(); // location 객체를 사용하여 이전 페이지에서 전달된 데이터 수신

    // 슬라이드 부분
    const [btnCtl, setBtnCtl] = useState(0)
    const [isRClick, setIsRClick] = useState(false)
    const [newWindowPosY, setNewWindowPosY] = useState(500)
    const [newWindowPosX, setNewWindowPosX] = useState(500)
    const [list, setList] = useState([{number: "", empCode: ""}]);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    // 카테고리
    const [category, setCategory] = useState(location.state?.selectCategory || '');
    const [categories, setCategories] = useState([]);

    const [isExpanded, setIsExpanded] = useState(true);
    const [isToggled, setIsToggled] = useState(false);
    const [openTarget, setOpenTarget] = useState(false);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [attachment, setAttachment] = useState(null);


    // 오른쪽 슬라이드 관련
    const windowRClick = async (e) => {
        e.preventDefault()
        await setNewWindowPosY(e.target.getBoundingClientRect().y + 24)
        await setNewWindowPosX(50)
        console.log(e.target.getBoundingClientRect())
        console.log(e.target.value)
        console.log(e.target.className)
        e.target.className === "worker" ?
            setIsRClick(true) : setIsRClick(false)
    }

    // 카테고리 불러오기
    useEffect(() => {
        // 나중에 지금 로그인 한 사원의 코드를 받아와서 split해줘야함 <<<<<<<<<<<<<<<<<<<
        const comCode = 3118115625;

        axios.get(`/code/${comCode}`) // API 엔드포인트를 조정하세요
            .then(response => {
                console.log(response.data);
                // 응답이 카테고리 배열이라고 가정할 때
                const uniqueCategories = [...new Set(response.data.map(category => category.signCateCode))]; // 중복 제거
                setCategories(uniqueCategories); // 카테고리 상태에 저장
            })
            .catch(error => console.log(error));
    }, []);

    const handleFileChange = (event) => {
        setAttachment(event.target.files[0]); // 선택한 파일 상태 업데이트
    }


    const goClose = (param) => {
        setOpenTarget(false);
        if (param) {
            console.log(param)
            // setList([
            //     ...list,
            //     {
            //         number: param.number,
            //         empCode: param.empCode,
            //     }
            // ])
        }
    }

    const validateForm = () => {
        if (!category) {
            alert("카테고리 입력은 필수입니다.")
            return false;
        }

        if (!title) {
            alert("제목을 입력해주세요")
            return false;
        }

        if (!content) {
            alert("내용을 입력해주세요")
            return false;
        }

        if (!attachment) {
            alert("첨부파일을 넣어주세요")
            return false;
        }

        return true;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('content', content);
        if (attachment) {
            formData.append('attachment', attachment);
        }

        axios.post('/sign', formData)
            .then(response => {
                console.log(response.data);
                // 성공시 문서 리스트로 이동
                navigate('/sign');
            })
            .catch(error => {
                console.error('Error fetching documents:', error);
            });
    };

    // 목록 버튼 클릭 시 리스트 페이지로 이동
    const handleHome = () => {
        navigate('/sign')
    };

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    const handleToggle = () => {
        setIsToggled(prevState => !prevState);
    };

    return (
        <div className="min-h-screen flex flex-col" onContextMenu={windowRClick}>
            {/* Header with logo */}
            <header className="bg-gray-200 p-4">
                <h1 className="text-2xl font-bold text-center">로고</h1>
            </header>

            {/* Main content */}
            <div className="flex-1 flex">
                <aside className="w-64 bg-gray-100 p-4 space-y-2">

                    <div>
                        <button
                            className="w-full flex items-center"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? <ChevronDown className="mr-2 h-4 w-4"/> :
                                <ChevronRight className="mr-2 h-4 w-4"/>}
                            결재함
                        </button>
                        {isExpanded && (
                            <div className="ml-8 shandleDelete pace-y-2 mt-2">
                                {categories.map((category, index) => (
                                    // 각 카테고리를 ','로 나누고 각 항목을 한 줄씩 출력
                                    category.split(',').map((item, subIndex) => (
                                        <button className="w-full" key={`${index}-${subIndex}`}
                                                onClick={() => setCategory(item)}>
                                            {item}
                                        </button>
                                    ))
                                ))}
                            </div>
                        )}
                    </div>
                </aside>
                <main className="flex-1 p-4">
                    <div className="flex justify-start space-x-2 mb-4">
                        <button className="w-[80px] h-[40px] bg-gray-200 hover:bg-gray-400 rounded"
                                onClick={handleHome}>목록
                        </button>
                    </div>
                    <h1 className="text-2xl font-bold mb-4">결재 문서 작성</h1>


                    <div className="flex justify-center">
                        <div className="flex justify-between w-[350px] mb-4">
                            <div className={`${isToggled ? '' : 'font-bold'}`}>파일만 첨부하기</div>
                            <p className={`w-[60px] h-[30px] rounded-[30px] border-blue-600 border-2 flex items-center cursor-pointer relative ${isToggled ? 'on bg-blue-300' : 'off'}`}
                               onClick={handleToggle}>
                                <div
                                    className={`w-[25px] h-[23px] rounded-full bg-blue-600 absolute top-[1px] ${isToggled ? 'right-[3px]' : 'left-[3px] border-blue-600'}`}></div>
                            </p>
                            <div className={`${isToggled ? 'font-bold' : ''}`}>제공된 양식 사용하기</div>
                        </div>
                    </div>

                    <div className="border border-black rounded p-2">
                        <div className="flex">
                            <div>
                                <div className="flex">
                                    <fieldset className="mr-2">
                                        {/*<legend>카테고리</legend>*/}
                                        <div>
                                            <select name="category" value={category}
                                                    onChange={(e) => setCategory(e.target.value)}
                                                    className="border rounded p-2">
                                                <option value="">카테고리</option>
                                                {categories.map((category, index) => (
                                                    category.split(',').map((item, subIndex) => (
                                                        <option key={subIndex} value={item}>
                                                            {item}
                                                        </option>
                                                    ))
                                                ))}
                                            </select>
                                        </div>
                                    </fieldset>


                                    <input type="text" className="w-[1087px] p-2 border rounded mb-2"
                                           placeholder="제목을 입력하세요" value={title}
                                           onChange={(e) => setTitle(e.target.value)}/>
                                </div>
                                {openTarget ? <SignTarget onClose={goClose}/> : null}


                                {isToggled ?
                                    <div
                                        className="h-[1697px] w-[1200px] flex flex-col justify-center items-center border-black border-2 px-6 py-12 mb-4">
                                        {/* 내용 추가 가능 */}
                                        {/*  회사명, 결재라인  */}
                                        <table className="h-[178px]">
                                            <tr>
                                                <td className="w-[500px] text-2xl">
                                                    <input name="companyName" type="text" placeholder="기업명"
                                                           className="text-center h-[100px] w-[450px] text-2xl"/>
                                                </td>
                                                <td className="w-[500px] flex flex-row justify-center mt-5">
                                                    <div
                                                        className="flex flex-col justify-center w-[80px] border-2 border-black">
                                                        <div className="h-[30px] bg-gray-200">
                                                            기 안
                                                        </div>
                                                        <div className="h-[90px] border-t-2 border-black">그렇게됬다
                                                        </div>
                                                        {/*  결재자 있으면 추가 작성되게 하기  */}
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                        {/*    */}
                                        <div className="mt-[20px]">
                                            <input name="companyAddress" type="text" placeholder="주소"
                                                   className="text-center h-[50px] w-[900px] text-lg"/>
                                        </div>
                                        {/*    */}
                                        <table className="mb-[40px] border-t-2 border-b-4 border-black">
                                            <tr>
                                                <td className="w-[500px] border-r-2 border-black">
                                                    <input name="companyTel" type="tel"
                                                           placeholder="TEL: (000)0000-0000"
                                                           className="text-center h-[50px] w-[400px] text-lg"/>
                                                </td>
                                                <td className="w-[500px] border-l-2 border-black">
                                                    <input name="companyFax" type="tel"
                                                           placeholder="FAX: (000)0000-0000"
                                                           className="text-center h-[50px] w-[400px] text-lg"/>
                                                </td>
                                            </tr>
                                        </table>
                                        {/*    */}
                                        <table className="border-t-4 border-b-4 border-black mb-[20px]">
                                            <tr className="border-b-2 border-black">
                                                <td className="w-[200px] border-r-2 border-black">
                                                    <div>문 서 번 호</div>
                                                </td>
                                                <td className="w-[800px]">
                                                    <input name="docNum" type="text"
                                                           className="text-center h-[50px] w-[700px] text-lg"/>
                                                </td>
                                            </tr>
                                            <tr className="border-b-2 border-black">
                                                <td className="w-[200px] border-r-2 border-black">
                                                    <div>수 신</div>
                                                </td>
                                                <td className="w-[800px]">
                                                    <input name="docReception" type="text"
                                                           className="text-center h-[50px] w-[700px] text-lg"/>
                                                </td>
                                            </tr>
                                            <tr className="border-b-2 border-black">
                                                <td className="w-[200px] border-r-2 border-black">
                                                    <div>참 조</div>
                                                </td>
                                                <td className="w-[800px]">
                                                    <input name="docReference" type="text"
                                                           className="text-center h-[50px] w-[700px] text-lg"/>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="w-[200px] border-r-2 border-black">
                                                    <div>제 목</div>
                                                </td>
                                                <td className="w-[800px]">
                                                    <input name="docTitle" type="text"
                                                           className="text-center h-[50px] w-[700px] text-lg"/>
                                                </td>
                                            </tr>
                                        </table>
                                        {/*    */}
                                        <div>
                                            <textarea name="docOutline" className="w-[950px] h-[300px]"
                                                      placeholder="문서의 개요를 작성하세요."/>
                                        </div>
                                        {/*    */}
                                        <table>
                                            <tr>
                                                <td className="h-[50px]">
                                                    <div>- 아 래 -</div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div>
                                                    <textarea name="docContent" className="w-[950px] h-[400px]"
                                                              placeholder="문서의 내용을 작성하세요."/>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                        {/*    */}
                                        <table className="w-[950px]">
                                            <tr>
                                                <td rowSpan="3">
                                                    <div>※ 붙임</div>
                                                </td>
                                                <td>
                                                    1. <input name="docAttached1" type="text"
                                                              className="w-[700px] h-[50px]"
                                                              placeholder="내용을 입력해주세요."/>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    2. <input name="docAttached2" type="text"
                                                              className="w-[700px] h-[50px]"
                                                              placeholder="내용을 입력해주세요."/>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    3. <input name="docAttached3" type="text"
                                                              className="w-[700px] h-[50px]"
                                                              placeholder="내용을 입력해주세요."/>
                                                </td>
                                            </tr>
                                        </table>
                                        <div>
                                            <input name="docDate" className="text-center h-[50px] w-[200px]"
                                                   placeholder="20oo년  oo월  oo일"/>
                                        </div>
                                        <div>
                                            <input name="docCeo" type='textbox'
                                                   className="text-center h-[100px] w-[300px] text-2xl"
                                                   placeholder="대표이사   ○ ○ ○"/>
                                        </div>
                                    </div> :
                                    <div className="flex mb-2">
                    <textarea className="p-1 w-[1200px] h-[400px] border border-black rounded"
                              placeholder="파일과 함께 보낼 내용을 작성해주세요."/>
                                    </div>}
                                <div>
                                    <div className="flex justify-between mb-4 w-[1200px] p-2 border rounded">
                                        <div className="flex items-center">
                                            <Paperclip className="h-5 w-5 mr-2"/>
                                            <span className="whitespace-nowrap">첨부파일</span>
                                            <input type="file" className="m-1" onChange={handleFileChange}/>
                                        </div>
                                        <div> {attachment ?
                                            `${(attachment.size / 1024).toFixed(2)} KB / 10 MB` :
                                            '0 KB / 10 MB'}</div>
                                    </div>
                                </div>

                            </div>
                            <div className="flex flex-col ml-2">
                                <button
                                    className="bg-amber-500 text-white px-6 py-2 rounded hover:bg-amber-600 mr-[5px]"
                                    onClick={() => {
                                        setOpenTarget(true)
                                    }}>
                                    결재선 정하기
                                </button>
                                <table className="table-auto mt-2 border rounded w-[400px]">
                                    <thead>
                                    <tr className="bg-gray-200">
                                        <td>순서</td>
                                        <td>성명</td>
                                        <td>부서</td>
                                        <td>직급</td>
                                        <td>승인</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {/* 팝업 할때 []변수 주고 target.length[no: ,name: ,dep: ,pos: ] 0번은 부조건 본인 들어가게 하기 */}
                                    {/*{(signTarget.map((document) => (*/}
                                    {/*    <tr key={target.no} className="cursor-pointer">*/}
                                    {/*        <td className="p-2">{target.no}</td>*/}
                                    {/*        <td className="p-2">{target.name}</td>*/}
                                    {/*        <td className="p-2">{target.dep}</td>*/}
                                    {/*        <td className="p-2">{target.pos}</td>*/}
                                    {/*        <td className="p-2">{target.sign}</td>*/}
                                    {/*    </tr>*/}
                                    {/*))}*/}
                                    <tr>
                                        <td>1</td>
                                        <td>ㅇㅇㅇ</td>
                                        <td>경리부</td>
                                        <td>대리</td>
                                        <td>미승인</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mr-[5px]">
                            문서 만들기
                        </button>
                        <button className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 ml-[5px]"
                                onClick={handleHome}>
                            취소
                        </button>
                    </div>

                </main>
            </div>


            {/* Slide-out panel with toggle button */}
            <div
                className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}
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
                    <input type="text" placeholder="아이디" className="w-full p-2 mb-2 border rounded"/>
                    <input type="password" placeholder="비밀번호" className="w-full p-2 mb-4 border rounded"/>
                    <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4">
                        로그인
                    </button>
                    <div className="text-sm text-center mb-4">
                        <a href="#" className="text-blue-600 hover:underline">공지사항</a>
                        <span className="mx-1">|</span>
                        <a href="#" className="text-blue-600 hover:underline">문의사항</a>
                    </div>
                    <div className="h-[600px]">
                        <h3 className="font-semibold mb-2 h-[25px]">메신저</h3>
                        <div className="h-[95px]">
                            <div className="flex">
                                <div className="w-1/3 border">
                                    <img src="/logo192.png"/>
                                </div>
                                <div className="w-2/3 text-left border">
                                    <p>사내 이메일:</p>
                                    <p>전화번호:</p>
                                    <p>상태:</p>
                                </div>
                            </div>
                            <div className="flex">
                                <button className="border w-1/5 text-sm" onClick={() => setBtnCtl(0)}>조직도</button>
                                <button className="border w-1/5 text-sm" onClick={() => setBtnCtl(1)}>대화방</button>
                                <button className="border w-1/5 text-sm" onClick={() => setBtnCtl(2)}>주소록</button>
                                <button className="border w-2/5 text-sm" onClick={() => setBtnCtl(3)}>공지사항</button>
                            </div>
                        </div>
                        <div className="border text-left h-[480px]">
                            {
                                btnCtl === 0 ?
                                    <div className="h-[100%] overflow-y-auto">
                                        <ul className="list-disc pl-5">
                                            <li>최상위 부서
                                                <ul className="list-disc pl-5">
                                                    <li>하위부서
                                                        <ul className="list-disc pl-5">
                                                            <li className="worker" value="1234567">직원1</li>
                                                            <li>직원2</li>
                                                            <li>직원3</li>
                                                            <li>직원5</li>
                                                            <li>직원6</li>
                                                            <li>직원7</li>
                                                            <li>직원8</li>
                                                            <li>직원9</li>
                                                            <li>직원10</li>
                                                        </ul>
                                                    </li>
                                                    <li>하위부서
                                                        <ul className="list-disc pl-5">
                                                            <li>직원1</li>
                                                            <li>직원2</li>
                                                            <li>직원3</li>
                                                            <li>직원5</li>
                                                            <li>직원6</li>
                                                            <li>직원7</li>
                                                            <li>직원8</li>
                                                            <li>직원9</li>
                                                            <li>직원10</li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div> :
                                    btnCtl === 1 ?
                                        <>
                                            <div className="h-[100%] overflow-y-auto">
                                                <div className="border flex justify-between">
                                                    <button>대화방</button>
                                                    <button>나가기</button>
                                                </div>
                                                <div className="border flex justify-between">
                                                    <button>대화방</button>
                                                    <button>나가기</button>
                                                </div>
                                                <div className="border flex justify-between">
                                                    <button>대화방</button>
                                                    <button>나가기</button>
                                                </div>
                                                <div className="border flex justify-between">
                                                    <button>대화방</button>
                                                    <button>나가기</button>
                                                </div>
                                                <div className="border flex justify-between">
                                                    <button>대화방</button>
                                                    <button>나가기</button>
                                                </div>
                                                <div className="border flex justify-between">
                                                    <button>대화방</button>
                                                    <button>나가기</button>
                                                </div>
                                                <div className="border flex justify-between">
                                                    <button>대화방</button>
                                                    <button>나가기</button>
                                                </div>
                                                <div className="border flex justify-between">
                                                    <button>대화방</button>
                                                    <button>나가기</button>
                                                </div>
                                                <div className="border flex justify-between">
                                                    <button>대화방</button>
                                                    <button>나가기</button>
                                                </div>
                                                <div className="border flex justify-between">
                                                    <button>대화방</button>
                                                    <button>나가기</button>
                                                </div>
                                                <div className="border flex justify-between">
                                                    <button>대화방</button>
                                                    <button>나가기</button>
                                                </div>
                                                <div className="border flex justify-between">
                                                    <button>대화방</button>
                                                    <button>나가기</button>
                                                </div>
                                                <div className="border flex justify-between">
                                                    <button>대화방</button>
                                                    <button>나가기</button>
                                                </div>
                                                <div className="border flex justify-between">
                                                    <button>대화방</button>
                                                    <button>나가기</button>
                                                </div>
                                                <div className="border flex justify-between">
                                                    <button>대화방</button>
                                                    <button>나가기</button>
                                                </div>
                                                <div className="border flex justify-between">
                                                    <button>대화방</button>
                                                    <button>나가기</button>
                                                </div>
                                                <div className="border flex justify-between">
                                                    <button>대화방</button>
                                                    <button>나가기</button>
                                                </div>
                                                <div className="border flex justify-between">
                                                    <button>대화방</button>
                                                    <button>나가기</button>
                                                </div>
                                                <div className="border flex justify-between">
                                                    <button>대화방</button>
                                                    <button>나가기</button>
                                                </div>
                                                <div className="border flex justify-between">
                                                    <button>대화방</button>
                                                    <button>나가기</button>
                                                </div>
                                                <div className="border flex justify-between">
                                                    <button>대화방</button>
                                                    <button>나가기</button>
                                                </div>
                                            </div>
                                        </> :
                                        btnCtl === 2 ?
                                            <>
                                                <div className="h-[400px] overflow-y-auto">
                                                    <div className="text-xs border break-words">
                                                        <p>부서:</p>
                                                        <p>이름:</p>
                                                        <p className="flex justify-between">직급: <button>삭제</button></p>
                                                        <p>연락처:</p>
                                                        <p>사내이메일:</p>
                                                    </div>
                                                    <div className="text-xs border break-words">
                                                        <p>부서:</p>
                                                        <p>이름:</p>
                                                        <p className="flex justify-between">직급: <button>삭제</button></p>
                                                        <p>연락처:</p>
                                                        <p>사내이메일:</p>
                                                    </div>
                                                    <div className="text-xs border break-words">
                                                        <p>부서:</p>
                                                        <p>이름:</p>
                                                        <p className="flex justify-between">직급: <button>삭제</button></p>
                                                        <p>연락처:</p>
                                                        <p>사내이메일:</p>
                                                    </div>
                                                    <div className="text-xs border break-words">
                                                        <p>부서:</p>
                                                        <p>이름:</p>
                                                        <p className="flex justify-between">직급: <button>삭제</button></p>
                                                        <p>연락처:</p>
                                                        <p>사내이메일:</p>
                                                    </div>
                                                    <div className="text-xs border break-words">
                                                        <p>부서:</p>
                                                        <p>이름:</p>
                                                        <p className="flex justify-between">직급: <button>삭제</button></p>
                                                        <p>연락처:</p>
                                                        <p>사내이메일:</p>
                                                    </div>
                                                    <div className="text-xs border break-words">
                                                        <p>부서:</p>
                                                        <p>이름:</p>
                                                        <p className="flex justify-between">직급: <button>삭제</button></p>
                                                        <p>연락처:</p>
                                                        <p>사내이메일:</p>
                                                    </div>
                                                    <div className="text-xs border break-words">
                                                        <p>부서:</p>
                                                        <p>이름:</p>
                                                        <p className="flex justify-between">직급: <button>삭제</button></p>
                                                        <p>연락처:</p>
                                                        <p>사내이메일:</p>
                                                    </div>
                                                    <div className="text-xs border break-words">
                                                        <p>부서:</p>
                                                        <p>이름:</p>
                                                        <p className="flex justify-between">직급: <button>삭제</button></p>
                                                        <p>연락처:</p>
                                                        <p>사내이메일:</p>
                                                    </div>
                                                    <div className="text-xs border break-words">
                                                        <p>부서:</p>
                                                        <p>이름:</p>
                                                        <p className="flex justify-between">직급: <button>삭제</button></p>
                                                        <p>연락처:</p>
                                                        <p>사내이메일:</p>
                                                    </div>
                                                    <div className="text-xs border break-words">
                                                        <p>부서:</p>
                                                        <p>이름:</p>
                                                        <p className="flex justify-between">직급: <button>삭제</button></p>
                                                        <p>연락처:</p>
                                                        <p>사내이메일:</p>
                                                    </div>
                                                    <div className="text-xs border break-words">
                                                        <p>부서:</p>
                                                        <p>이름:</p>
                                                        <p className="flex justify-between">직급: <button>삭제</button></p>
                                                        <p>연락처:</p>
                                                        <p>사내이메일:</p>
                                                    </div>
                                                </div>
                                                <div className="h-[80px]">
                                                    <div className="flex">
                                                        <div
                                                            className="border text-xs flex items-center pl-1 w-[30%]"> 아이디
                                                        </div>
                                                        <input className="border w-[70%]"/>
                                                    </div>
                                                    <div className="flex">
                                                        <div
                                                            className="border text-xs flex items-center pl-1 w-[30%]"> 전화번호
                                                        </div>
                                                        <input className="border w-[70%]"/>
                                                    </div>
                                                    <button className="text-center border w-full">주소록에 추가 하기
                                                    </button>
                                                </div>
                                            </>
                                            :
                                            btnCtl === 3 ?
                                                <>
                                                    <div className="h-[435px] overflow-y-auto">
                                                        <div className="text-xs border break-words">
                                                            <p>제목</p>
                                                            <p>시작기간~종료기간</p>
                                                            <p>확인여부</p>
                                                        </div>
                                                        <div className="text-xs border break-words">
                                                            <p>제목</p>
                                                            <p>시작기간~종료기간</p>
                                                            <p>확인여부</p>
                                                        </div>
                                                        <div className="text-xs border break-words">
                                                            <p>제목</p>
                                                            <p>시작기간~종료기간</p>
                                                            <p>확인여부</p>
                                                        </div>
                                                        <div className="text-xs border break-words">
                                                            <p>제목</p>
                                                            <p>시작기간~종료기간</p>
                                                            <p>확인여부</p>
                                                        </div>
                                                        <div className="text-xs border break-words">
                                                            <p>제목</p>
                                                            <p>시작기간~종료기간</p>
                                                            <p>확인여부</p>
                                                        </div>
                                                        <div className="text-xs border break-words">
                                                            <p>제목</p>
                                                            <p>시작기간~종료기간</p>
                                                            <p>확인여부</p>
                                                        </div>
                                                        <div className="text-xs border break-words">
                                                            <p>제목</p>
                                                            <p>시작기간~종료기간</p>
                                                            <p>확인여부</p>
                                                        </div>
                                                        <div className="text-xs border break-words">
                                                            <p>제목</p>
                                                            <p>시작기간~종료기간</p>
                                                            <p>확인여부</p>
                                                        </div>
                                                        <div className="text-xs border break-words">
                                                            <p>제목</p>
                                                            <p>시작기간~종료기간</p>
                                                            <p>확인여부</p>
                                                        </div>
                                                        <div className="text-xs border break-words">
                                                            <p>제목</p>
                                                            <p>시작기간~종료기간</p>
                                                            <p>확인여부</p>
                                                        </div>
                                                        <div className="text-xs border break-words">
                                                            <p>제목</p>
                                                            <p>시작기간~종료기간</p>
                                                            <p>확인여부</p>
                                                        </div>
                                                        <div className="text-xs border break-words">
                                                            <p>제목</p>
                                                            <p>시작기간~종료기간</p>
                                                            <p>확인여부</p>
                                                        </div>
                                                        <div className="text-xs border break-words">
                                                            <p>제목</p>
                                                            <p>시작기간~종료기간</p>
                                                            <p>확인여부</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <button className="text-center border w-full h-[45px]"
                                                                onClick={() => setBtnCtl(6)}>공지사항 추가하기
                                                        </button>
                                                    </div>
                                                </>
                                                :
                                                btnCtl === 4 ?
                                                    <>
                                                        <div className="h-[480px] overflow-y-auto">
                                                            <ul className="pb-2">상대방이름 <li className="pl-4">대화내용 </li>
                                                            </ul>
                                                            <ul className="text-right pb-2">사용자이름 <li
                                                                className="pr-4">대화내요ㅛㅛㅛㅛㅛㅇ </li></ul>
                                                            <ul className="pb-2">상대방이름 <li className="pl-4">대화내용 </li>
                                                            </ul>
                                                            <ul className="pb-2">상대방이름 <li className="pl-4">대화내용 </li>
                                                            </ul>
                                                            <ul className="pb-2">상대방이름 <li className="pl-4">대화내용 </li>
                                                            </ul>
                                                            <ul className="pb-2">상대방이름 <li className="pl-4">대화내용 </li>
                                                            </ul>
                                                            <ul className="pb-2">상대방이름 <li className="pl-4">대화내용 </li>
                                                            </ul>
                                                            <ul className="pb-2">상대방이름 <li className="pl-4">대화내용 </li>
                                                            </ul>
                                                            <ul className="pb-2">상대방이름 <li className="pl-4">대화내용 </li>
                                                            </ul>
                                                            <ul className="pb-2">상대방이름 <li className="pl-4">대화내용 </li>
                                                            </ul>
                                                            <ul className="pb-2">상대방이름 <li className="pl-4">대화내용 </li>
                                                            </ul>
                                                            <ul className="pb-2">상대방이름 <li className="pl-4">대화내용 </li>
                                                            </ul>
                                                        </div>
                                                    </>
                                                    :
                                                    btnCtl === 5 ?
                                                        <>
                                                            <div className="border h-[235px]">
                                                                <div className="border w-[100%] h-[25px]">제목</div>
                                                                <div className="border w-[100%] h-[25px]">기간</div>
                                                                <div className="border w-[100%] h-[185px]">내용</div>
                                                            </div>
                                                            <div className="border h-[200px]">조직도 들어갈 부분</div>
                                                            <div>
                                                                <button
                                                                    className="text-center border w-full h-[45px]"
                                                                    onClick={() => setBtnCtl(6)}>공지사항
                                                                    추가하기
                                                                </button>
                                                            </div>
                                                        </>
                                                        :
                                                        btnCtl === 6 ?
                                                            <>
                                                                <div className="border h-[235px]">
                                                                    <input className="border w-[100%] h-[25px]"
                                                                           placeholder="제목입력"/>
                                                                    <input type="date"
                                                                           className="border w-[100%] h-[25px]"/>
                                                                    <textarea className="border w-[100%] h-[185px]"
                                                                              placeholder="내용입력"/>
                                                                </div>
                                                                <div className="border h-[200px]">
                                                                    조직도 들어갈 부분
                                                                </div>
                                                                <button
                                                                    className="text-center border w-full h-[45px]"
                                                                    onClick={() => setBtnCtl(3)}>공지사항
                                                                    등록
                                                                </button>
                                                            </>
                                                            : <></>

                            }
                        </div>
                    </div>
                    {isRClick === true ?
                        <div className={`flex absolute`}
                             style={{top: `${newWindowPosY}px`, right: `${newWindowPosX}px`}}>
                            <div className="w-1/3 border">
                                <img src="/logo192.png"/>
                            </div>
                            <div className="w-2/3 text-left border">
                                <p>사내 이메일:</p>
                                <p>전화번호:</p>
                                <p>상태:</p>
                                <button onClick={() => {

                                }}>닫기
                                </button>
                            </div>
                        </div>
                        : <></>
                    }
                </div>
            </div>
        </div>
    )
}