import React, {useCallback, useEffect, useState} from 'react';
import './App.css';
import ListLibrary from "./HtmlFunctions/ListLibrary";

export default function SignRequest() {
    const [btnCtl, setBtnCtl] = useState(0)
    const [isRClick, setIsRClick] = useState(false)
    const [newWindowPosY, setNewWindowPosY] = useState(500)
    const [newWindowPosX, setNewWindowPosX] = useState(500)
    const [newWindowData, setNewWindowData] = useState([])

    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [openDocumentId, setOpenDocumentId] = useState(null); // 열려 있는 문서 ID 저장

    const windowRClick = async (e) => {
        e.preventDefault()
        if (e.target.className.includes("worker"))
        {
            await setNewWindowPosY(e.target.getBoundingClientRect().y + 24);
            await setNewWindowPosX(50);
            setIsRClick(true);
            ListLibrary.RClickWindow(newWindowPosX,newWindowPosY,e.target.getAttribute("data-value")).then(data=> setNewWindowData([data[0],data[1]]))
        }

    }


    const setDoc = useCallback(() => {
        // doc리스트 가져오기
        setDocuments([
            {
                id: '001',
                classification: '일반',
                title: '2023년 4분기 보고서',
                submissionDate: '2023-12-01',
                completionDate: '2023-12-05',
                approvalStatus: '승인 > 미승인 > 미승인',
                content: '2023년 4분기 보고서에 대한 상세 내용입니다.',
            },
            {
                id: '002',
                classification: '긴급',
                title: '신규 프로젝트 계획서',
                submissionDate: '2023-12-10',
                completionDate: '-',
                approvalStatus: '승인 > 승인 > 미승인',
                content: '신규 프로젝트 계획서에 대한 상세 내용입니다.',
            },
        ]);
    }, []);

    useEffect(() => {
        setDoc();
    }, [setDoc]);

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    const toggleDocument = (docId) => {
        // 클릭한 문서 ID가 열려 있는 문서 ID와 같으면 닫고, 다르면 그 문서 ID로 변경
        setOpenDocumentId(openDocumentId === docId ? null : docId);
    };

    const addNewDocument = () => {
        const newDoc = {
            id: `00${documents.length + 1}`,
            classification: '신규',
            title: `새 문서 ${documents.length + 1}`,
            submissionDate: new Date().toISOString().split('T')[0],
            completionDate: '-',
            approvalStatus: '미승인 > 미승인 > 미승인',
            content: '새 문서에 대한 상세 내용입니다.',
        };
        setDocuments([...documents, newDoc]);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100"  onContextMenu={windowRClick}>
            {/* Header with logo */}
            <header className="bg-white shadow-md p-4">
                <div className="container mx-auto">
                    <div className="w-32 h-8 bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600">로고</span>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main
                className="flex-grow flex flex-col items-center container mx-auto mt-8 p-4 bg-white rounded-lg shadow">
                <h1 className="text-2xl font-bold mb-6">문서작성</h1>

                <div
                    className="h-[1697px] w-[1200px] flex flex-col justify-center items-center border-black border-2 px-6 py-12 mb-4">
                    {/* 내용 추가 가능 */}
                    {/*  회사명, 결재라인  */}
                    <table className="h-[178px]">
                        <tr>
                            <td className="w-[500px] text-2xl">
                                <input type="text" placeholder="기업명"
                                       className="text-center h-[100px] w-[450px] text-2xl"/>
                            </td>
                            <td className="w-[500px] flex flex-row justify-center mt-5">
                                <div className="flex flex-col justify-center w-[80px] border-2 border-black">
                                    <div className="h-[30px] bg-gray-200">
                                        결 재
                                    </div>
                                    <div className="h-[100px] border-t-2 border-black">그렇게됬다</div>
                                </div>
                            </td>
                        </tr>
                    </table>
                    {/*    */}
                    <div className="mt-[20px]">
                        <input type="text" placeholder="주소" className="text-center h-[50px] w-[900px] text-lg"/>
                    </div>
                    {/*    */}
                    <table className="mb-[40px] border-t-2 border-b-4 border-black">
                        <tr>
                            <td className="w-[500px] border-r-2 border-black">
                                <input type="tel" placeholder="TEL: (000)0000-0000"
                                       className="text-center h-[50px] w-[400px] text-lg"/>
                            </td>
                            <td className="w-[500px] border-l-2 border-black">
                                <input type="tel" placeholder="FAX: (000)0000-0000"
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
                                <input type="text" className="text-center h-[50px] w-[700px] text-lg"/>
                            </td>
                        </tr>
                        <tr className="border-b-2 border-black">
                            <td className="w-[200px] border-r-2 border-black">
                                <div>수 신</div>
                            </td>
                            <td className="w-[800px]">
                                <input type="text" className="text-center h-[50px] w-[700px] text-lg"/>
                            </td>
                        </tr>
                        <tr className="border-b-2 border-black">
                            <td className="w-[200px] border-r-2 border-black">
                                <div>참 조</div>
                            </td>
                            <td className="w-[800px]">
                                <input type="text" className="text-center h-[50px] w-[700px] text-lg"/>
                            </td>
                        </tr>
                        <tr>
                            <td className="w-[200px] border-r-2 border-black">
                                <div>제 목</div>
                            </td>
                            <td className="w-[800px]">
                                <input type="text" className="text-center h-[50px] w-[700px] text-lg"/>
                            </td>
                        </tr>
                    </table>
                    {/*    */}
                    <div>
                        <textarea className="w-[950px] h-[300px]" placeholder="문서의 개요를 작성하세요."/>
                    </div>
                    {/*    */}
                    <table>
                        <tr>
                            <td className="h-[50px]">
                                <div>- 아 래 -</div>
                            </td>
                        </tr>
                        <tr>
                            <td className="">
                                <div>
                                    <textarea className="w-[950px] h-[400px]" placeholder="문서의 내용을 작성하세요."/>
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
                                1. <input type="text" className="w-[700px] h-[50px]" placeholder="내용을 입력해주세요."/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                2. <input type="text" className="w-[700px] h-[50px]" placeholder="내용을 입력해주세요."/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                3. <input type="text" className="w-[700px] h-[50px]" placeholder="내용을 입력해주세요."/>
                            </td>
                        </tr>
                    </table>
                    <div>
                        <input className="text-center h-[50px] w-[200px]" placeholder="20oo년  oo월  oo일"/>
                    </div>
                    <div>
                        <input type='textbox' className="text-center h-[100px] w-[300px] text-2xl"
                               placeholder="대표이사   ○ ○ ○"/>
                    </div>
                </div>
                <div>
                    <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mr-[5px]">
                        문서 만들기
                    </button>
                    <button className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 ml-[5px]">
                        취소
                    </button>
                </div>
            </main>


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
                        <div className="h-[138px]">
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
                        <div className="border text-left h-[435px] blue">
                            {
                                btnCtl === 0 ?
                                    ListLibrary.WorkerList("3118115625")
                                    :
                                    btnCtl === 1 ?
                                        <>
                                            <div className="h-[100%] overflow-y-auto">
                                                <div className="border flex justify-between">
                                                    <button>대화방</button>
                                                    <button>나가기</button>
                                                </div>
                                            </div>
                                        </> :
                                        btnCtl === 2 ?
                                            <>
                                                <div className="h-[355px] overflow-y-auto">
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
                                                ListLibrary.noticeList("3118115625",setBtnCtl)
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
                                                            {ListLibrary.noticeWritePage("3118115625",setBtnCtl)}
                                                            <button className="text-center border w-full h-[45px]" onClick={() => {setBtnCtl(3);console.log(ListLibrary.data);ListLibrary.noticeInsert()}}>공지사항 등록</button>
                                                            </>: <></>

                            }
                        </div>
                    </div>
                    {isRClick === true ?
                        (
                            <div className={`flex absolute`} style={{top: `${newWindowPosY}px`, right: `${newWindowPosX}px`}}>
                                <div className="w-1/3 border">
                                    <img src="/logo192.png"/>
                                </div>
                                <div className="w-2/3 text-left border">
                                    <p>사내 이메일:{newWindowData[0]}</p>
                                    <p>전화번호:{newWindowData[1]}</p>
                                    <p>상태:</p>
                                    <button onClick={() => {
                                        setIsRClick(false)
                                        setNewWindowData([])
                                    }}>닫기
                                    </button>
                                </div>
                            </div>
                        )
                        : <></>
                    }
                </div>
            </div>
        </div>
    )
}