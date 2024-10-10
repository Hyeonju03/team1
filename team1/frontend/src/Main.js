import React, {useState} from 'react';
import './App.css';

export default function MainLayout() {

    const [btnCtl, setBtnCtl] = useState(0)
    const [moveslid, setMoveslid] = useState("move-Right")
    const [isRClick, setIsRClick] = useState(false)
    const [newWindowPosY,setNewWindowPosY] = useState(500)
    const windowRClick = async (e) => {
        e.preventDefault()
        await setNewWindowPosY(e.target.getBoundingClientRect().x + 24)
        console.log(e.target.getBoundingClientRect())
        console.log(e.target.value)
        console.log(e.target.className)
        e.target.className === "worker" ?
            setIsRClick(true) : setIsRClick(false)
    }
    return (
        <div className="min-h-screen flex flex-col overflow-hidden" onContextMenu={windowRClick}>
            {/* Header with centered logo */}
            <header className="bg-gray-200 p-4">
                <div className="container mx-auto flex justify-center items-center h-24">
                    <div className="w-48 h-24 bg-gray-300 flex items-center justify-center">
                        {/* Placeholder for logo image */}
                        <span className="text-gray-600">로고</span>
                        {/* Uncomment below and replace with your actual logo image */}
                        {/* <img
              src="/path-to-your-logo.png"
              alt="로고"
              className="max-w-full max-h-full object-contain"
            /> */}
                    </div>
                </div>
            </header>

            {/* Main content area */}
            <div className="flex-grow flex relative overflow-hidden">
                <main className="flex-grow p-4">
                    <div className="container mx-auto">
                        <h2 className="text-xl font-semibold mb-4">회사설명 (홍보)</h2>
                        <p>여기에 회사 설명 및 홍보 내용을 추가하세요.</p>
                    </div>
                </main>

                {/* Sidebar */}
                <aside className={`w-64 p-4 border-l ${moveslid}`}>
                    <div className="mb-4">
                        <input type="text" placeholder="아이디" className="w-full p-2 border mb-2"/>
                        <input type="password" placeholder="비밀번호" className="w-full p-2 border mb-2"/>
                        <button className="w-full bg-blue-500 text-white p-2 mb-2">로그인</button>
                        <div className="text-sm text-center">
                            <a href="/notice" className="text-blue-600 hover:underline">
                                공지사항
                            </a>
                            <span className="mx-1">|</span>
                            <a href="/inquiry" className="text-blue-600 hover:underline">
                                문의사항
                            </a>
                        </div>
                    </div>
                    {/*<div className="mb-4">*/}
                    {/*    <h3 className="font-semibold mb-2">공지사항</h3>*/}
                    {/*    <ul className="list-disc list-inside">*/}
                    {/*        여러줄 선택 <li>첫 번째 공지사항</li>*/}
                    {/*        <li>두 번째 공지사항</li>*/}
                    {/*    </ul>*/}
                    {/*</div>*/}
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
                    <button className="border w-[50px] h-[50px] absolute bottom-[760px] right-[270px]"
                            onClick={() => setMoveslid(moveslid === "move-Right" ? "move-Left" : "move-Right")}>on/off
                    </button>
                    {isRClick === true ?
                        <div className={`flex absolute left-10`} style={{top: `${newWindowPosY}px`}}>
                            <div className="w-1/3 border">
                                <img src="/logo192.png"/>
                            </div>
                            <div className="w-2/3 text-left border">
                                <p>사내 이메일:</p>
                                <p>전화번호:</p>
                                <p>상태:</p>
                            </div>
                        </div>
                        : <></>
                    }
                </aside>
            </div>
        </div>
    );
}