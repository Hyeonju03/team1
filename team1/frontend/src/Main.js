import React, {useState, useEffect} from 'react';
import './App.css';
import axios from "axios";
import Clock from "react-live-clock";

export default function MainLayout() {

    const [btnCtl, setBtnCtl] = useState(0)
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isRClick, setIsRClick] = useState(false)
    const [newWindowPosY, setNewWindowPosY] = useState(500)

    const windowRClick = async (e) => {
        e.preventDefault()
        await setNewWindowPosY(e.target.getBoundingClientRect().x + 24)
        console.log(e.target.getBoundingClientRect())
        console.log(e.target.value)
        console.log(e.target.className)
        e.target.className === "worker" ? setIsRClick(true) : setIsRClick(false)
    }

    const today = new Date();
    const formattedDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`;


    useEffect(() => {
        axios.get('/selectLog')
            .then(response => console.log(response.data))
            .catch(error => console.log(error))

    }, []);

    useEffect(() => {
        const logData = {
            comCode: "TEST_1", log: "메인 페이지 새로고침 테스트임", time: "TEST_TIME"
        };

        axios.post('/logInsert', logData)
            .then(response => console.log(response.data))
            .catch(error => console.log(error));
    }, []);


    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    return (
        <div className="min-h-screen flex flex-col h-[919px]" onContextMenu={windowRClick}>
            {/* Header with centered logo */}
            <header className="flex justify-end items-center border-b shadow-md h-[6%] bg-white">
                <div className="flex mr-6">
                    <div className="font-bold mr-1">{formattedDate}</div>
                    <Clock
                        format={'HH:mm:ss'}
                        ticking={true}
                        timezone={'Asia/Seoul'}/>
                </div>
                <div className="mr-5">
                    <img width="40" height="40" src="https://img.icons8.com/windows/32/smart-home-2.png"
                         alt="smart-home-2"/>
                </div>
                <div className="mr-16">
                    <img width="45" height="45"
                         src="https://img.icons8.com/external-kiranshastry-solid-kiranshastry/64/external-user-interface-kiranshastry-solid-kiranshastry.png"
                         alt="external-user-interface-kiranshastry-solid-kiranshastry"
                         onClick={togglePanel}/>
                </div>
                {/*    <div className="container mx-auto flex justify-center items-center h-24">*/}
                {/*        <div className="w-48 h-24 bg-gray-300 flex items-center justify-center">*/}
                {/*            /!* Placeholder for logo image *!/*/}
                {/*            <span className="text-gray-600">로고</span>*/}
                {/*            /!* Uncomment below and replace with your actual logo image *!/*/}
                {/*            /!* <img*/}
                {/*  src="/path-to-your-logo.png"*/}
                {/*  alt="로고"*/}
                {/*  className="max-w-full max-h-full object-contain"*/}
                {/*/> *!/*/}
                {/*        </div>*/}
                {/*    </div>*/}
            </header>

            {/* Main content area */}
            <div className="bg-gray-100 h-[94%] w-[100%]">
                <div className="flex overflow-hidden h-full shadow-inner">
                    {/*<main className="flex-grow p-4">*/}
                    {/*    <div className="container mx-auto">*/}
                    {/*        <h2 className="text-xl font-semibold mb-4">회사설명 (홍보)</h2>*/}
                    {/*        <p>여기에 회사 설명 및 홍보 내용을 추가하세요.</p>*/}
                    {/*    </div>*/}
                    {/*</main>*/}
                    <div className="bg-white ml-[5%] mt-[3.5%] w-[60%] h-[750px] rounded-3xl shadow-lg p-5">
                        <div className="flex overflow-auto justify-around mt-20 mb-10">
                            <div className="w-[20%] h-[150px] rounded bg-blue-200">
                                <div>이미지</div>
                                <div className="w-[50px] h-[50px] rounded-full bg-red-800 p-3 text-white">
                                    1
                                    {/*각 카테고리에 대한 알림 : 없으면 hidden처리*/}
                                </div>
                            </div>
                            <div className="w-[20%] bg-blue-400 rounded">
                                버튼 2
                            </div>
                            <div className="w-[20%] bg-blue-600 rounded">
                                버튼 3
                            </div>
                            <div className="w-[20%] bg-blue-800 rounded">
                                버튼 4
                            </div>
                        </div>
                    </div>
                    <div className="flex ml-[2%] mr-[5%] mt-[3.5%] flex-col justify-between h-[750px] w-[40%]">
                    <div className="bg-white h-[300px] rounded-3xl shadow-lg p-5">
                        <div className="flex overflow-auto justify-around mt-20 mb-10">
                            날씨가 들어왔으면 좋겠는데 귀찮으면 없애야지
                        </div>
                    </div>
                    <div className="bg-white h-[400px] rounded-3xl shadow-lg p-5">
                        <div className="flex overflow-auto justify-around mt-20 mb-10">
                            여기에는 일정 넣을까나
                        </div>
                    </div>
                    </div>
                </div>
            </div>

            {/*/////////////////////////////////////////////////////////////////*/}
            {/* Sidebar */}
            <div
                className={`fixed mt-[55px] top-0 right-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isPanelOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="p-4">
                    <h2 className="text-xl font-bold mb-4">로그인</h2>
                    <input type="text" placeholder="아이디" className="w-full p-2 mb-2 border rounded"/>
                    <input type="password" placeholder="비밀번호" className="w-full p-2 mb-4 border rounded"/>
                    <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4">로그인</button>
                    <div className="text-sm text-center mb-2">
                        <a href="#" className="text-blue-600 hover:underline">
                            공지사항
                        </a>
                        <span className="mx-1">|</span>
                        <a href="#" className="text-blue-600 hover:underline">
                            문의사항
                        </a>
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
                                <button className="border w-1/5 text-sm" onClick={() => setBtnCtl(0)}>
                                    조직도
                                </button>
                                <button className="border w-1/5 text-sm" onClick={() => setBtnCtl(1)}>
                                    대화방
                                </button>
                                <button className="border w-1/5 text-sm" onClick={() => setBtnCtl(2)}>
                                    주소록
                                </button>
                                <button className="border w-2/5 text-sm" onClick={() => setBtnCtl(3)}>
                                    공지사항
                                </button>
                            </div>
                        </div>
                        <div className="border text-left h-[435px] blue">
                            {btnCtl === 0 ? (
                                // ListLibrary.WorkerList(com)
                                <></>
                            ) : btnCtl === 1 ? (
                                <>
                                    <div className="h-[100%] overflow-y-auto">
                                        <div className="border flex justify-between">
                                            <button>대화방</button>
                                            <button>나가기</button>
                                        </div>
                                    </div>
                                </>
                            ) : btnCtl === 2 ? (
                                <>
                                    {/*<div dangerouslySetInnerHTML={{__html: addressBookHtml}}/>*/}
                                </>
                            ) : btnCtl === 3 ? (
                                <>
                                    {/*<div dangerouslySetInnerHTML={{__html: noticeHtml}}/>*/}
                                    <div>
                                        <button className="text-center border w-full h-[45px]"
                                                onClick={() => setBtnCtl(6)}>
                                            {" "}
                                            공지사항 추가하기
                                        </button>
                                    </div>
                                </>
                            ) : btnCtl === 4 ? (
                                <>
                                    <div className="h-[480px] overflow-y-auto">
                                        <ul className="pb-2">
                                            상대방이름 <li className="pl-4">대화내용 </li>
                                        </ul>
                                        <ul className="text-right pb-2">
                                            사용자이름 <li className="pr-4">대화내요ㅛㅛㅛㅛㅛㅇ </li>
                                        </ul>
                                        <ul className="pb-2">
                                            상대방이름 <li className="pl-4">대화내용 </li>
                                        </ul>
                                        <ul className="pb-2">
                                            상대방이름 <li className="pl-4">대화내용 </li>
                                        </ul>
                                        <ul className="pb-2">
                                            상대방이름 <li className="pl-4">대화내용 </li>
                                        </ul>
                                        <ul className="pb-2">
                                            상대방이름 <li className="pl-4">대화내용 </li>
                                        </ul>
                                        <ul className="pb-2">
                                            상대방이름 <li className="pl-4">대화내용 </li>
                                        </ul>
                                        <ul className="pb-2">
                                            상대방이름 <li className="pl-4">대화내용 </li>
                                        </ul>
                                        <ul className="pb-2">
                                            상대방이름 <li className="pl-4">대화내용 </li>
                                        </ul>
                                        <ul className="pb-2">
                                            상대방이름 <li className="pl-4">대화내용 </li>
                                        </ul>
                                        <ul className="pb-2">
                                            상대방이름 <li className="pl-4">대화내용 </li>
                                        </ul>
                                        <ul className="pb-2">
                                            상대방이름 <li className="pl-4">대화내용 </li>
                                        </ul>
                                    </div>
                                </>
                            ) : btnCtl === 5 ? (
                                <>
                                    {/*<div dangerouslySetInnerHTML={{__html: loadNoticeHtml}}/>*/}
                                    <div>
                                        <button className="text-center border w-full h-[45px]"
                                                onClick={() => setBtnCtl(3)}>
                                            목록으로
                                        </button>
                                    </div>
                                </>
                            ) : btnCtl === 6 ? (
                                <>
                                    {/*{ListLibrary.noticeWritePage(com, setBtnCtl)}*/}
                                    <button
                                        className="text-center border w-full h-[45px]"
                                        onClick={() => {
                                            setBtnCtl(3);
                                            // ListLibrary.noticeInsert(user);
                                        }}
                                    >
                                        공지사항 등록
                                    </button>
                                </>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                    {isRClick === true ? (
                        <></>
                        // <div className={`flex absolute`}
                        //      style={{top: `${newWindowPosY}px`, right: `${newWindowPosX}px`}}>
                        //     <div className="w-1/3 border">
                        //         <img src="/logo192.png"/>
                        //     </div>
                        //     <div className="w-2/3 text-left border">
                        //         <p>사내 이메일:{newWindowData[0]}</p>
                        //         <p>전화번호:{newWindowData[1]}</p>
                        //         <p>상태:</p>
                        //         <button
                        //             onClick={() => {
                        //                 setIsRClick(false);
                        //                 setNewWindowData([]);
                        //             }}
                        //         >
                        //             닫기
                        //         </button>
                        //     </div>
                        // </div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
}
