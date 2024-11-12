import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate, useLocation} from "react-router-dom";
import {useAuth} from './noticeAuth';
import Clock from "react-live-clock"
import ListLibrary from "./HtmlFunctions/ListLibrary";
import {useListLibrary} from "./Context/ListLibraryContext";

const UserNoticeDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {empCode, logout, login, isLoggedIn, config} = useAuth();
    const [userInfo, setUserInfo] = useState([])

    // 슬라이드 부분
    const socket = useRef(null);
    const [sendMessage, setSendMessage] = useState(null);
    const [isRClick, setIsRClick] = useState(false);
    const [newWindowPosY, setNewWindowPosY] = useState(500);
    const [newWindowPosX, setNewWindowPosX] = useState(500);
    const [newWindowData, setNewWindowData] = useState([]);
    const [noticeNum, setNoticeNum] = useState("");
    const {btnCtl, setBtnCtl} = useListLibrary();
    const [user, setUser] = useState(null);
    const [com, setCom] = useState(null);
    const [chatNum, setChatNum] = useState("")
    const [inviteChatCtl, setInviteChatCtl] = useState(0)

    const [noticeHtml, setNoticeHtml] = useState("");
    const [loadNoticeHtml, setLoadNoticeHtml] = useState("");
    const [addressBookHtml, setAddressBookHtml] = useState("");
    const [chatListLoad, setChatListLoad] = useState("");
    const [chatInHTML, setChatInHTML] = useState("");
    const [chatMemList2, setChatMemList2] = useState("")
    const fetchData = async () => {
        const result1 = await ListLibrary.noticeList(user, btnCtl);
        setNoticeHtml(result1);
        const result2 = await ListLibrary.loadNotice(noticeNum);
        setLoadNoticeHtml(result2);
        const result3 = await ListLibrary.addressBook(user, "");
        setAddressBookHtml(result3);
        const result4 = await ListLibrary.chatListLoad(user)
        setChatListLoad(result4);
        const result5 = await ListLibrary.chatMemList2(user, chatNum)
        setChatMemList2(result5);

        const result6 = await ListLibrary.chatIn(user, chatNum) //이거 제일 마지막에 들어가야함 부하 심함
        setChatInHTML(result6);
    };


    useEffect(() => {
        if(user !== null && com !== null){
            fetchData();
        }
    }, [btnCtl]);

    useEffect(() => {
        if (empCode !== null && empCode !== undefined && empCode !== "") {
            setUser(empCode);
            setCom(empCode.split("-")[0]);

        }
    }, [empCode]);

    useEffect(() => {

        const elements = document.querySelectorAll(".testEvent");

        const handleClick = (event) => {
            setBtnCtl(5);
            setNoticeNum(event.currentTarget.id);
            ListLibrary.noticeUpdate(event.currentTarget.id, user);
        };

        elements.forEach((element) => {
            element.addEventListener("click", handleClick);
        });

        return () => {
            elements.forEach((element) => {
                element.removeEventListener("click", handleClick);
            });
        };
    }, [noticeHtml, btnCtl]);
    useEffect(() => {
        const elements = document.querySelectorAll(".AddBtn");
        const btnElement = document.querySelector(".BtnAddressBookAdd");
        const InputAddressBookAdd = document.querySelectorAll(".InputAddressBookAdd");
        const InputAddressBookSearch = document.querySelector(".InputAddressBookSearch");
        let keyWord = "";
        const keyWordSet = async (e) => {
            if (e.key === "Enter") {
                keyWord = e.currentTarget.value;
                setAddressBookHtml(await ListLibrary.addressBook(user, keyWord));
            }
        };
        const addBtnClick = async (e) => {
            if (await ListLibrary.addressTargetSelect(InputAddressBookAdd[0].value, InputAddressBookAdd[1].value)) {
                if (!(await ListLibrary.addressEmpAddSelect(user, InputAddressBookAdd[0].value))) {
                    await ListLibrary.addressBookAdd(InputAddressBookAdd[0].value, user);
                } else {
                    alert("이미 존재하는 아이디 입니다");
                }
                setAddressBookHtml(await ListLibrary.addressBook(user, keyWord));
            } else {
                alert("정보가 일치하지 않습니다");
            }
        };
        const handleClick = async (e) => {
            await ListLibrary.addressBookDelete(e.currentTarget.parentNode.parentNode.id.replace("Add", ""), user);
            setAddressBookHtml(await ListLibrary.addressBook(user, keyWord));
        };
        elements.forEach((element) => {
            element.addEventListener("click", handleClick);
        });
        if (btnElement) {
            btnElement.addEventListener("click", addBtnClick);
        } else {
            //첫 로딩 거르기(주소록 누르기전 방지)
        }
        if (InputAddressBookSearch) {
            InputAddressBookSearch.addEventListener("keydown", keyWordSet);
        }
        return () => {
            elements.forEach((element) => {
                element.removeEventListener("click", handleClick);
            });
            if (btnElement) {
                btnElement.removeEventListener("click", addBtnClick);
            }
            if (InputAddressBookSearch) {
                InputAddressBookSearch.removeEventListener("keydown", keyWordSet);
            }
        };
    }, [addressBookHtml, btnCtl]);
    useEffect(() => {

        socket.current = new WebSocket('ws://nextit.or.kr:3002');

        socket.current.onopen = () => {
            console.log('WebSocket 연결 성공');
        };

        socket.current.onclose = () => {
            console.log('WebSocket 연결 종료');
        };

        socket.current.onerror = (error) => {
            console.error('WebSocket 오류:', error);
        };

        // 서버로부터 메시지 수신 처리
        socket.current.onmessage = (event) => {
            setSendMessage(event.data);
            console.log("서버")
        };

        // cleanup: 컴포넌트 언마운트 시 WebSocket 연결 종료
        return () => {
            if (socket.current) {
                socket.current.close();
            }
        };
    }, []);


    useEffect(() => {
        //채팅 내부 이벤트들
        const chatUpdate = async () => {
            setChatInHTML(await ListLibrary.chatIn(user, chatNum))
        }
        chatUpdate();
    }, [sendMessage]);

    const handleSendMessage = () => {
        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
            const message = document.querySelector('.chatInput').value;
            ListLibrary.chatinput(user, message, chatNum);
            socket.current.send(message);
            console.log('메시지 전송:', message);
            document.querySelector('.chatInput').value = ""
            document.querySelector('.chatRoomDiv').scrollTop = document.querySelector('.chatRoomDiv').scrollHeight
        } else {
            console.error('WebSocket 연결이 열리지 않았습니다.');
        }
    };

    useEffect(() => {
        const chatInBtn = document.querySelectorAll(".chatInBtn");
        const chatDeleteBtn = document.querySelectorAll(".chatDeleteBtn");
        const chatListAddBtn1 = document.querySelector(".chatListAddBtn1");
        const chatListAddBtn2 = document.querySelector(".chatListAddBtn2");
        const chatInviteListDiv = document.querySelector(".chatInviteListDiv");
        const chatListDiv = document.querySelectorAll(".chatListDiv");
        const chatListFrameDiv = document.querySelector(".chatListFrameDiv");
        const chatInviteListInput = document.querySelector(".chatInviteListInput");

        const handleClick1 = (e) => {
            setChatNum(e.target.dataset.value)
            setBtnCtl(4);
        };
        const handleClick2 = async (e) => {
            await ListLibrary.chatOut(user, e.target.dataset.value)
            setChatListLoad(await ListLibrary.chatListLoad(user));
        };
        const handleClick3 = (event) => {
            chatInviteListDiv.style.display = "block"
            //chatInviteListInput.style.display = "block"
            chatListFrameDiv.style.display = "none"
            chatListAddBtn1.style.display = "none"
            chatListAddBtn2.style.display = "block"
        };
        const handleClick4 = async (event) => {
            chatInviteListDiv.style.display = "none"
            //chatInviteListInput.style.display = "none"
            chatListFrameDiv.style.display = "block"
            chatListAddBtn1.style.display = "block"
            chatListAddBtn2.style.display = "none"

            let members = ""
            let memberCount = 0
            chatInviteListDiv.querySelectorAll(".worker").forEach((e, i1) => {
                if (e.children[0].checked) {
                    members += e.dataset.value + ","
                    memberCount++;
                }
            });
            if (memberCount > 1) {
                await ListLibrary.chatAdd1(user, members)
            } else {
                alert("인원이 너무 적습니다")
                chatInviteListDiv.querySelectorAll(".worker").forEach((e, i1) => {
                    if (!e.children[0].disabled) {
                        e.children[0].checked = false
                    }
                });
            }
            setChatListLoad(await ListLibrary.chatListLoad(user));
        };


        chatInBtn.forEach((e) => {
            e.addEventListener("click", handleClick1);
        })
        chatDeleteBtn.forEach((e) => {
            e.addEventListener("click", handleClick2);
        })
        if (chatListAddBtn1) {
            chatListAddBtn1.addEventListener("click", handleClick3);
        }
        if (chatListAddBtn2) {
            chatListAddBtn2.addEventListener("click", handleClick4);
        }

        return () => {
            chatInBtn.forEach((e) => {
                e.removeEventListener("click", handleClick1);
            })
            chatDeleteBtn.forEach((e) => {
                e.removeEventListener("click", handleClick2);
            })
            if (chatListAddBtn1) {
                chatListAddBtn1.removeEventListener("click", handleClick3);
            }
            if (chatListAddBtn2) {
                chatListAddBtn2.removeEventListener("click", handleClick4);
            }
        };

    }, [chatListLoad, btnCtl]);

    const chatInviteList = async () => {
        const chatMemList2Div = document.querySelector(".chatMemList2Div");
        let members = ""
        let memberCount = 0
        chatMemList2Div.querySelectorAll(".worker").forEach((e, i1) => {
            if (e.children[0].checked && !e.children[0].disabled) {
                members += e.dataset.value + ","
                memberCount++;
            }
        });
        if (memberCount > 0) {
            await ListLibrary.chatAdd2(chatNum, members)
        } else {
            alert("인원이 너무 적습니다")
            chatMemList2Div.querySelectorAll(".worker").forEach((e, i1) => {
                if (!e.children[0].disabled) {
                    e.children[0].checked = false
                }
            });
        }
    };
    const chatInviteList2 = async (e) => {
        let member = await ListLibrary.empCodeCheck(e)
        const empCodeIsTrue = await ListLibrary.empCodeCheck2(e, chatNum)
        console.log(member, empCodeIsTrue)
        if (member !== "" && empCodeIsTrue) {
            member += ","
            await ListLibrary.chatAdd2(chatNum, member)
        } else if (!empCodeIsTrue) {
            alert("이미 존재하는 참가자 입니다.")
        } else {
            alert("존재하지 않는 아이디 입니다.")
        }
    };

    const setChatMemList2Set = async () => {
        setChatMemList2(await ListLibrary.chatMemList2(user, chatNum));
    }

    const [notice, setNotice] = useState(null);
    const [inputId, setInputId] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const userNoticeNum = location.state?.noticeNum;

    const [isPanelOpen, setIsPanelOpen] = useState(false); // 화면 옆 슬라이드

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    useEffect(() => {
        if(empCode != ""){
            empInfo();
        }
    }, [empCode]);

    useEffect(() => {
        const fetchNotice = async () => {
            if (!userNoticeNum) {
                console.error("noticeNum이 없습니다.");
                navigate('/user/notice/list');
                return;
            }

            try {
                const response = await axios.get(`/api/usernotice/detail/${userNoticeNum}`, config);
                setNotice(response.data);
            } catch (error) {
                console.error("공지사항을 가져오는 중 오류 발생:", error);
            }
        };

        fetchNotice();
    }, [userNoticeNum, navigate, config]);

    const empInfo = async () => {
        try{
            const response = await axios.get(`/emp/${empCode}`);
            setUserInfo(response.data);
        }catch (e){
            console.log(e)
        }
    }

    // 로그인 처리 함수
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!inputId || !inputPassword) {
            alert("아이디와 비밀번호를 모두 입력해주세요.");
            return;
        }

        try {
            const response = await axios.post('/api/employ/login', {
                empCode: inputId,
                empPass: inputPassword
            });

            if (response.data.success) {
                login(inputId, response.data.role, response.data.token); // 로그인 상태 업데이트
                localStorage.setItem('empCode', inputId);
                localStorage.setItem('token', response.data.token);
                navigate('/user/notice/list'); // 로그인 후 페이지 이동
            } else {
                alert("유효하지 않은 로그인 정보입니다.");
            }
        } catch (error) {
            alert("로그인 중 오류 발생.");
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/user/notice/list');
    };

    const today = new Date();
    const formattedDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`;

    return (
        <div className="min-h-screen flex flex-col">
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
                        <img width="40" height="40"
                             src="https://img.icons8.com/external-tanah-basah-basic-outline-tanah-basah/24/5A5A5A/external-marketing-advertisement-tanah-basah-basic-outline-tanah-basah.png"
                             alt="external-marketing-advertisement-tanah-basah-basic-outline-tanah-basah"
                             onClick={() => {
                                 navigate(`/user/notice/list`)
                             }}/>
                    </div>
                    <div className="mr-5">
                        <img width="40" height="40" src="https://img.icons8.com/ios-filled/50/5A5A5A/help.png"
                             alt="help" onClick={() => {
                            navigate(`/AdminFAQ`)
                        }}/>
                    </div>
                    <div className="mr-5">
                        <img width="40" height="40" src="https://img.icons8.com/windows/32/5A5A5A/home.png"
                             alt="home" onClick={() => {
                            navigate("/")
                        }}/>
                    </div>
                    <div className="mr-16">
                        <img width="45" height="45"
                             src="https://img.icons8.com/ios-glyphs/60/5A5A5A/user-male-circle.png"
                             alt="user-male-circle" onClick={togglePanel}/>
                    </div>
                </header>
            </div>
            <div className="mt-14 flex flex-grow">
                <main className="flex-grow w-full bg-gray-200 min-h-screen p-4">
                    <div className="max-w-4xl mx-auto">
                        {notice ? (
                            <div className="max-w-4xl mx-auto">
                                <div className="bg-gray-100 p-6 rounded-lg shadow-lg mb-6">
                                    <h2 className="text-4xl font-extrabold text-gray-800">{notice.title}</h2>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-md">
                                    <div
                                        className="text-gray-700 text-lg whitespace-pre-line mb-4">{notice.content}</div>
                                    <p className="text-sm text-gray-500 text-right">
                                        작성일: <span
                                        className="font-semibold text-gray-600">{new Date(notice.startDate).toLocaleString()}</span>
                                    </p>
                                    <div className="flex justify-end mt-4">
                                        <button onClick={() => navigate('/user/notice/list')}
                                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50">목록
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center h-64">
                                <div
                                    className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Slide-out panel with toggle button */}
            <div className={`${isPanelOpen ? "" : "hidden"}`}>
                <div
                    className="fixed mt-16 top-0 right-0 h-11/12 w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out max-w-xs p-1 rounded-lg border-2 border-gray-300">
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
                                            <p className="">이름: {userInfo.empName}</p>
                                            <p className="">직급: {userInfo.posCode}</p>
                                            <p className="">부서: {userInfo.depCode}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col text-left mb-1">
                                        <p className="">사내 이메일: {userInfo.empMail}</p>
                                        <p className="">전화번호: {userInfo.phoneNum}</p>
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
                                            com !== null && com !== "" ? ListLibrary.WorkerList(com):<></>
                                        ) : btnCtl === 1 ? (
                                            <>
                                                <div dangerouslySetInnerHTML={{__html: chatListLoad}}/>
                                            </>
                                        ) : btnCtl === 2 ? (
                                            <>
                                                <div dangerouslySetInnerHTML={{__html: addressBookHtml}}/>
                                            </>
                                        ) : btnCtl === 3 ? (
                                            <>
                                                <div dangerouslySetInnerHTML={{__html: noticeHtml}}/>
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
                                                {inviteChatCtl === 0 ? <>
                                                        <div className="h-[353px] overflow-y-auto chatRoomDiv">
                                                            <div dangerouslySetInnerHTML={{__html: chatInHTML}}/>
                                                        </div>
                                                        <div className="w-[100%] h-[50px] flex">
                                                            <input className="w-[70%] border chatInput"/>
                                                            <button
                                                                className="w-[30%] border flex justify-center items-center"
                                                                onClick={() => {
                                                                    handleSendMessage();
                                                                }}>입력
                                                            </button>
                                                        </div>
                                                        <div className="flex">
                                                            <button
                                                                className="w-[50%] h-[30px] border flex justify-center items-center"
                                                                onClick={() => {
                                                                    setInviteChatCtl(1)
                                                                    setChatMemList2Set()
                                                                }}>조직도로 초대하기
                                                            </button>
                                                            <button
                                                                className="w-[50%] h-[30px] border flex justify-center items-center"
                                                                onClick={() => {
                                                                    document.querySelector(".chatInput").value = ""
                                                                    setInviteChatCtl(2)
                                                                }}>아이디로 초대하기
                                                            </button>
                                                        </div>
                                                    </> :
                                                    inviteChatCtl === 1 ? <>
                                                            <div dangerouslySetInnerHTML={{__html: chatMemList2}}/>
                                                            <button className="border w-[100%] h-[45px] chatListAddBtn3"
                                                                    onClick={() => {
                                                                        chatInviteList().then(r => setInviteChatCtl(0))
                                                                        setChatMemList2Set()
                                                                    }}>초대하기
                                                            </button>
                                                        </> :
                                                        inviteChatCtl === 2 ?
                                                            <>
                                                                <div className="h-[383px] overflow-y-auto chatRoomDiv">
                                                                    <div
                                                                        dangerouslySetInnerHTML={{__html: chatInHTML}}/>
                                                                </div>
                                                                <div className="flex">
                                                                    <input className="border w-[70%] h-[50px]"/>
                                                                    <button
                                                                        className="w-[30%] h-[50px] border flex justify-center items-center"
                                                                        onClick={(e) => {
                                                                            setInviteChatCtl(0)
                                                                            chatInviteList2(e.currentTarget.parentNode.children[0].value).then(e.currentTarget.parentNode.children[0].value = "")
                                                                            setChatMemList2Set()
                                                                        }}>
                                                                        아이디로<br/>초대하기
                                                                    </button>
                                                                </div>
                                                            </>
                                                            : <></>
                                                }
                                            </>
                                        ) : btnCtl === 5 ? (
                                            <>
                                                <div dangerouslySetInnerHTML={{__html: loadNoticeHtml}}/>
                                                <div>
                                                    <button className="text-center border w-full h-[45px]"
                                                            onClick={() => setBtnCtl(3)}>
                                                        목록으로
                                                    </button>
                                                </div>
                                            </>
                                        ) : btnCtl === 6 ? (
                                            <>
                                                {ListLibrary.noticeWritePage(com, setBtnCtl)}
                                                <button
                                                    className="text-center border w-full h-[45px]"
                                                    onClick={() => {
                                                        setBtnCtl(3);
                                                        ListLibrary.noticeInsert(user);
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
                                    className="mt-2 w-full h-10 text-white bg-gray-400 hover:bg-gray-500 rounded"
                                    onClick={handleLogout}>로그아웃
                                </button>
                            </div>
                            : (<><h2 className="mt-2">로그인</h2>
                                    <input
                                        type="text"
                                        placeholder="아이디"
                                        className="w-full p-2 mb-2 border rounded"
                                        onChange={(e) => {setInputId(e.target.value)}}
                                    />
                                    <input
                                        type="password"
                                        placeholder="비밀번호"
                                        className="w-full p-2 mb-4 border rounded"
                                        onChange={(e) => {setInputPassword(e.target.value)}}
                                    />
                                    <button
                                        className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 mb-4"
                                        onClick={handleLogin}>
                                        로그인
                                    </button>
                                </>
                            )}
                    </div>
                </div>
                <div
                    className="fixed mt-14 top-0 right-16 transform -translate-x-3 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-gray-300"></div>
            </div>
        </div>
    )
        ;
}

export default UserNoticeDetail;
