import React, {useEffect, useState} from 'react';
import {
    ChevronDown,
    ChevronRight,
    Paperclip,
    Search,
    Mail,
    Archive,
    Send,
    FileText,
    Trash,
    Settings
} from 'lucide-react';
import axios from "axios";
import {useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "./noticeAuth";
import DeletePopup from './DeletePopup';
import Clock from "react-live-clock";

const Input = ({className, ...props}) => {
    return <input className={`border rounded px-3 py-2 ${className}`} {...props} />;
};

export default function EmailSend() {
    const location = useLocation();
    const {title, to, cc} = location.state || {};
    const [isExpanded, setIsExpanded] = useState(false);
    const [errors, setErrors] = useState({});
    const [attachment, setAttachment] = useState(null);
    const navigate = useNavigate();
    const [sendList, setSendList] = useState([])
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
    const today = new Date();
    const formattedDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`;

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    // 로그인
    const {isLoggedIn, empCode, logout} = useAuth();
    const [btnCtl, setBtnCtl] = useState(0)
    const [isRClick, setIsRClick] = useState(false)
    const [newWindowPosY, setNewWindowPosY] = useState(500)

    const [isPanelOpen, setIsPanelOpen] = useState(false); // 화면 옆 슬라이드


    const [formData, setFormData] = useState({
        to: '',
        cc: null,
        title: '',
        file: null,
        content: '',
        fileName: '',
        fileSize: '',
        attachment: null,
    });

    useEffect(() => {
        if (!localStorage.getItem('empCode')) {
            alert("로그인하세요")
            navigate("/"); // 로그인하지 않으면 홈페이지로 이동
        }
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            if (isLoggedIn) {
                try {
                    const response = await axios.get(`/selectEmpCode?empCode=${empCode}`); // 공백 제거
                    console.log(response.data);
                } catch (error) {
                    console.error(error.response ? error.response.data : error.message);
                }
            }
        }
        fetchData();
    }, [isLoggedIn, empCode]); // isLoggedIn과 empCode 변경 시에만 실행


    const goSendMail = (e) => {
        navigate("/MailSend");
        window.location.reload();
    }

    const goSendMailList = (e) => {
        navigate("/MailSendList");
        window.location.reload();
    }

    const gogoDetail = (v) => {
        navigate("/MailDetail", {state: v});

    }

    const goToMeMailSend = () => {
        navigate("/ToMeMailSend");
        window.location.reload();
    }

    const goMailTrashList = () => {
        navigate("/MailTrashList");
        window.location.reload();
    }

    const goRealDelete = (e) => {
        console.log("진짜?")
        setIsPopupOpen(true)
    }


    const goToMeMailSendList = () => {
        //내게
        navigate("/ToMeMailSendList");
        window.location.reload();
    }

    const goAttachMentMailList = () => {
        //첨부
        navigate("/AttachMentMailList");
        window.location.reload();
    }

    const goToTalMailSendList = () => {
        //전부
        navigate("/ToTalMailSendList");
        window.location.reload();
    }

    const goReceivedMailList = () => {
        //받은
        navigate("/ReceivedMailList");
        window.location.reload();
    }

    const handleConfirmDelete = async () => {
        try {
            await axios.delete('/AlldeleteMail');
            alert("삭제완룡")
            setIsPopupOpen(false);
            setSelectedCheckboxes([]);
        } catch (error) {
            console.error(error);
            alert("메일 삭제 중 오류가 발생했습니다.");
        }
    }

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


    return (
        <div className="flex flex-col min-h-screen">
            <div className="fixed w-full">
                <header className="w-full flex justify-end items-center border-b shadow-md h-14 bg-white">
                    <div className="flex mr-6">
                        <div className="font-bold mr-1">{formattedDate}</div>
                        <Clock
                            format={'HH:mm:ss'}
                            ticking={true}
                            timezone={'Asia/Seoul'}/>
                    </div>
                    <div className="mr-5">
                        <img width="40" height="40" src="https://img.icons8.com/windows/32/f87171/home.png"
                             alt="home"/>
                    </div>
                    <div className="mr-16">
                        <img width="45" height="45"
                             src="https://img.icons8.com/ios-glyphs/60/f87171/user-male-circle.png"
                             alt="user-male-circle" onClick={togglePanel}/>
                    </div>
                </header>
            </div>
            <div className="flex-1 flex">
                <div className="fixed h-full">
                    <aside
                        className="mt-14 h-full w-64 bg-red-200 border-r-2 shadow-lg p-4 space-y-2 flex flex-col justify-items-start items-center"
                    >
                        <div className="flex mb-8 mt-4">
                            <button onClick={goSendMail} className="border rounded-md px-4 py-2">메일쓰기</button>
                            <button onClick={goToMeMailSend} className="border rounded-md px-4 py-2"
                                    style={{marginLeft: "10px"}}>내게쓰기
                            </button>
                        </div>

                        <button onClick={goToTalMailSendList} className="w-full flex items-center text-lg"
                                style={{marginBottom: "30px", marginLeft: "50px"}}>
                            <Mail className="mr-2 h-4 w-4"/>전체메일함
                        </button>

                        <button onClick={goReceivedMailList} className="w-full flex items-center text-lg"
                                style={{marginBottom: "30px", marginLeft: "50px"}}>
                            <Mail className="mr-2 h-4 w-4"/>받은메일함
                        </button>

                        <button onClick={goAttachMentMailList} className="w-full flex items-center text-lg"
                                style={{marginBottom: "30px", marginLeft: "50px"}}>
                            <Archive className="mr-2 h-4 w-4"/>첨부파일메일함
                        </button>

                        <button onClick={goToMeMailSendList} className="w-full flex items-center text-lg"
                                style={{marginBottom: "30px", marginLeft: "50px"}}>
                            <FileText className="mr-2 h-4 w-4"/>내게쓴메일함
                        </button>

                        <button onClick={goSendMailList} className="w-full flex items-center text-lg"
                                style={{marginBottom: "30px", marginLeft: "50px"}}>
                            <Send className="mr-2 h-4 w-4"/>
                            보낸메일함
                        </button>

                        <div className="flex">
                            <button onClick={goMailTrashList} className="w-full flex items-center text-lg"
                                    style={{marginBottom: "30px"}}>
                                <Trash className="mr-2 h-4 w-4"/>휴지통
                            </button>
                            <button onClick={goRealDelete} style={{width: "80px", height: "30px"}}
                                    className="text-xs border rounded-md px-2 py-2">비우기
                            </button>
                        </div>
                        {/*<Settings className="h-4 w-4" />*/}
                        <DeletePopup
                            isOpen={isPopupOpen}
                            onClose={() => setIsPopupOpen(false)}
                            onConfirm={handleConfirmDelete}
                        />
                    </aside>
                </div>

                {/* Main content */}
                <main className="flex ml-64 mt-14 flex-1 p-6 w-full h-full sm:w-[80%] md:w-[70%] lg:w-[60%] justify-center">
                    <div className="mt-28 flex flex-col h-full">
                        <div className="font-bold text-2xl m-2 p-2">성공적으로 메일을 보냈습니다.</div>
                        <div className="m-2 p-2 border-2 w-[500px] h-60 flex flex-col justify-center">
                            <p className="m-2">{title ? `제목: ${title}` : '제목 : 제목없음'}</p>
                            <p className="m-2">받는사람: {to}</p>
                            <p className="m-2">{cc ? `참조: ${cc}` : null}</p>
                        </div>
                        <div className="m-2">
                            <button onClick={goSendMailList} className="border rounded-md m-2 px-4 py-2 hover:bg-gray-300">확인</button>
                            <button className="border rounded-md m-2 px-4 py-2 hover:bg-gray-300">작성 페이지로 돌아가기
                            </button>
                        </div>
                    </div>
                </main>
            </div>

            {/* Slide-out panel with toggle button */}
            <div className={`${isPanelOpen ? "" : "hidden"}`}>
                <div
                    className="fixed mt-16 top-0 right-0 h-11/12 w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out max-w-xs p-1 rounded-lg border-2 border-red-300">
                    {/* 내용 부분 */}
                    {/*<div*/}
                    {/*    className={`fixed mt-[55px] top-0 right-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isPanelOpen ? "translate-x-0" : "translate-x-full"}`}*/}
                    {/*>*/}
                    <div className="p-1 h-full">
                        {/*<div className="text-sm text-center">*/}
                        {/*    <a href="#" className="text-blue-600 hover:underline">*/}
                        {/*        공지사항*/}
                        {/*    </a>*/}
                        {/*    <span className="mx-1">|</span>*/}
                        {/*    <a href="#" className="text-blue-600 hover:underline">*/}
                        {/*        문의사항*/}
                        {/*    </a>*/}
                        {/*</div>*/}
                        {isLoggedIn ?
                            <div className="h-full">
                                <div className="h-1/4">
                                    <div className="flex h-3/6">
                                        <div className="w-1/3 ">
                                            <img width="75px" height="75px" src="/logo192.png"/>
                                        </div>
                                        <div className="w-2/3 text-left">
                                            <p className="">이름:</p>
                                            <p className="">직급:</p>
                                            <p className="">부서:</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col text-left mb-1">
                                        <p className="">사내 이메일:</p>
                                        <p className="">전화번호:</p>
                                    </div>


                                    <div className="flex">
                                        <button className="border w-1/5 text-sm p-1"
                                                onClick={() => setBtnCtl(0)}>
                                            조직도
                                        </button>
                                        <button className="border w-1/5 text-sm p-1"
                                                onClick={() => setBtnCtl(1)}>
                                            대화방
                                        </button>
                                        <button className="border w-1/5 text-sm p-1"
                                                onClick={() => setBtnCtl(2)}>
                                            주소록
                                        </button>
                                        <button className="border w-2/5 text-sm p-1"
                                                onClick={() => setBtnCtl(3)}>
                                            공지사항
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-2">
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
                                                    <button
                                                        className="text-center border w-full h-[45px]"
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
                                                    <button
                                                        className="text-center border w-full h-[45px]"
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
                                <button
                                    className="mt-2 w-full h-10 text-white bg-red-400 hover:bg-red-500 rounded"
                                    onClick={handleLogout}>로그아웃</button>
                            </div>
                            : (<><h2 className="mt-2">로그인</h2>
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
                <div
                    className="fixed mt-14 top-0 right-16 transform -translate-x-3 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-red-300"></div>
            </div>
        </div>
    );
}

