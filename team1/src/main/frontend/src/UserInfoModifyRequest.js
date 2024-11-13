import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useAuth} from "./noticeAuth";
import Clock from "react-live-clock";
import {useUserContext} from "./UserContext";
import {ChevronDown, ChevronRight} from "lucide-react";
import ListLibrary from "./HtmlFunctions/ListLibrary";
import {useListLibrary} from "./Context/ListLibraryContext";

export default function UserInfoModifyRequest() {
    const {selectedUser} = useUserContext();

    const [modifyReqList, setModifyReqList] = useState("");

    const [subordinates, setSubordinates] = useState([]); // 부하직원 관련 내용
    const [modifyReqData, setModifyReqData] = useState(null); // modifyReq에서 파싱한 데이터
    // const [hasModifyReq, setHasModifyReq] = useState(false);
    // const [corCode, setCorCode] = useState(process.env.REACT_APP_COR_CODE);
    const [auth, setAuth] = useState(null);
    const navigate = useNavigate();
    // 로그인
    const {isLoggedIn, empCode, logout} = useAuth();
    const [userInfo, setUserInfo] = useState([])
    const [viewPassword, setViewPassword] = useState(false)
    const [isAdmin, setIsAdmin] = useState(null)

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
            if(localStorage.getItem('role')){
                setIsAdmin(localStorage.getItem('role'))
            }
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

    // slide 변수
    const [isPanelOpen, setIsPanelOpen] = useState(false); // 화면 옆 슬라이드
    const today = new Date();
    const formattedDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`;
    const [isExpanded, setIsExpanded] = useState(true);

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    // 수정 요청 목록 페이지에 버튼의 id에 있는 숫자를 잘라서
    // setIndex(세팅)
    useEffect(() => {
        // selectedUser가 null이 아닐 때만 처리
        if (selectedUser !== null) {
            // selectedUser에 따라 부하직원 데이터를 가져오는 코드
            console.log("선택된 사용자 인덱스:", selectedUser);
            // 예를 들어, selectedUser가 인덱스라면 해당 인덱스를 기반으로 데이터를 가져오거나 처리할 수 있음
        } else {
            console.log("selectedUser가 null입니다.");
        }
    }, [selectedUser]);  // selectedUser가 변경될 때마다 실행

    useEffect(() => {
        if (isLoggedIn) {
            const fetchSubordinates = async () => {
                try {
                    const response = await axios.get(`/emp/${empCode}`);
                    console.log("res>", response.data)
                    setModifyReqList(response.data.modifyReq)
                } catch (e) {
                    console.error(e);
                }
            };
            fetchSubordinates();
        }
        if(empCode != ""){
            empInfo();
        }
    }, [isLoggedIn, empCode]);

    const empInfo = async () => {
        try{
            const response = await axios.get(`/emp/${empCode}`);
            setUserInfo(response.data);
        }catch (e){
            console.log(e)
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

    // 부하직원이 변경될 때마다
    useEffect(() => {
        if (subordinates) {
            if (subordinates.includes(":")) {
                const [prefix, data] = subordinates.split(":"); // ":" 기준으로 앞에꺼는 prefix, 뒤에꺼는 data에 저장

                if (data && data.includes("_")) {
                    // "_" 기준으로 나누기
                    const [empName, depCode, posCode, empPass, phoneNum, extNum, empMail, corCode] = data.split("_");

                    // 파싱한 데이터 설정
                    setModifyReqData({
                        prefix, // 사원코드
                        empName,
                        depCode,
                        posCode,
                        empPass,
                        phoneNum,
                        extNum,
                        empMail,
                        corCode
                    });
                } else {
                    // data가 올바르지 않은 경우
                    setModifyReqData(null);
                }
            } else {
                // modifyReq가 ":"를 포함하지 않는 경우
                setModifyReqData(null);
            }
        } else {
            // subordinates가 없거나 modifyReq가 없는 경우
            setModifyReqData(null);
        }
    }, [subordinates]); // subordinates가 변경될 때마다 실행

    useEffect(() => {
        const fetchAuth = async () => {
            try {
                // 권한 정보 가져오기
                const response = await axios.get(`/authority/userInfo/${empCode}`);
                setAuth(response.data);
            } catch (error) {
                console.error('권한 정보를 가져오는 데 실패했습니다.', error);
            }
        };

        fetchAuth();
    }, [empCode]);

    /* 0:x, 1:조회, 2: 수정. 3: 삭제, 4:조회+수정, 5:조회+삭제, 6:수정+삭제. 7:전부 */
    // 보류 버튼 클릭 시(인사 정보 수정 x, 수정 요청 내역 유지)
    const handleHold = () => {
        if (auth == '2' || auth == '4' || auth == '6' || auth == '7') {
            alert("수정 요청이 보류되었습니다.");
        } else {
            alert("정보를 수정할 수 있는 권한이 없습니다.");
        }
    };

    // 반려 버튼 클릭 시(인사 정보 수정 x, 수정 요청 내역 삭제)
    const handleReject = async () => {
        setModifyReqData(selectedUser)
        if (auth == '2' || auth == '4' || auth == '6' || auth == '7') {
            if (!modifyReqData) return;
            try {
                console.log("modifyReqData>>", modifyReqData)
                console.log("modifyReqList>>", modifyReqList)
                let modifyRequest = "";
                if(modifyReqList.includes(",")) {
                    const modifyReq = modifyReqList.split(",")
                    modifyReq.map((req) => {
                        if(req.startsWith(selectedUser.empCode)) {

                        }else if(modifyRequest == ""){
                            modifyRequest = req;
                        } else {
                            modifyRequest += (","+req);
                        }
                    })

                } else {
                    modifyRequest = "";
                }
                // modifyReqList.split()
                // modify_req 값 비우기 요청
                await axios.put(`/userInfo/modifyDelete/${empCode}`, {
                    modifyRequest: modifyRequest
                });
                alert("수정 요청이 반려되었습니다.");
                navigate(`/UserInfoRequestList`);
            } catch (e) {
                console.error("반려 실패:", e);
                alert("반려 처리 중 오류가 발생했습니다.");
            }
        } else {
            alert("정보를 수정할 수 있는 권한이 없습니다.");
        }
    };

    // 승인 버튼 클릭 시(인사 정보 수정 o, 수정 요청 내역 삭제)
    const handleApprove = async () => {
        if (auth == '2' || auth == '4' || auth == '6' || auth == '7') {
            if (!modifyReqData) return;
            try {
                // 수정 요청 데이터 전송
                await axios.put(`/userInfo/${modifyReqData.prefix}`, {
                    empName: modifyReqData.empName,
                    depCode: modifyReqData.depCode,
                    posCode: modifyReqData.posCode,
                    empPass: modifyReqData.empPass,
                    phoneNum: modifyReqData.phoneNum,
                    extNum: modifyReqData.extNum,
                    empMail: modifyReqData.empMail,
                    corCode: modifyReqData.corCode
                });
                alert("수정이 완료되었습니다.");
            } catch (e) {
                console.error("수정 실패:", e);
                alert("수정 중 오류가 발생했습니다.");
            }
        } else {
            alert("정보를 수정할 수 있는 권한이 없습니다.");
        }
    };

    const viewPasswordHandler = () => {
        setViewPassword(!viewPassword);
    }

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
            <div className="flex-1 flex">
                <div className="fixed h-full">
                    <aside className="mt-14 h-full w-64 bg-gray-200 border-r-2 shadow-lg p-4 space-y-2">
                        <ol>
                            <li>
                                <div>
                                    <button
                                        className={`w-full flex items-center transition-colors duration-300`}
                                        onClick={() => setIsExpanded(!isExpanded)}
                                    >
                                        {isExpanded ? <ChevronDown className="mr-2 h-4 w-4"/> :
                                            <ChevronRight className="mr-2 h-4 w-4"/>}
                                        <span className="hover:underline">인사 정보</span>

                                    </button>
                                    {isExpanded && (
                                        <div className="ml-8 space-y-2 pace-y-2 mt-2">
                                            <li>
                                                <div className="flex justify-between">
                                                    <button className="w-full flex items-center"

                                                    >
                                                        <ChevronRight className="mr-2 h-4 w-4"/>
                                                        <div className="hover:underline"
                                                             onClick={() => {
                                                                 navigate("/userInfo")
                                                             }}>내 인사 정보
                                                        </div>
                                                    </button>

                                                </div>
                                            </li>
                                            <li>
                                                <div className="flex justify-between">
                                                    <button className="w-full flex items-center"
                                                            onClick={() => {
                                                                navigate('/UserInfoRequestList')
                                                            }}
                                                    >
                                                        <ChevronRight className="mr-2 h-4 w-4"/>
                                                        <div className="hover:underline">정보 수정 요청</div>
                                                    </button>
                                                </div>
                                            </li>
                                        </div>
                                    )}
                                </div>
                            </li>
                        </ol>
                    </aside>
                </div>
                {/* 수정 요청 내역이 있을 때 메인에 "인사관리" 탭에 알림 아이콘 표시 할 때 사용 하고 싶음 */}
                {/*<div className="tabs">*/}
                {/*    <div className="tab">*/}
                {/*        <span>인사관리</span>*/}
                {/*        {hasModifyReq && (*/}
                {/*            <span className="notification-icon">🔔</span> // 알림 아이콘으로 대체*/}
                {/*        )}*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/* Main content */}
                <main className="ml-64 mt-14 flex-1 p-4 w-full h-full sm:w-[80%] md:w-[70%] lg:w-[60%]">
                    {selectedUser ? (
                        <>
                            <h1 className="text-left text-2xl font-bold mb-2 pb-3 border-b border-gray-200 mt-2">
                                인사정보 > {selectedUser.empName}님 인사 정보
                            </h1>

                            <div className="flex flex-col w-3/5">
                                <div className="border-2 w-full text-left">
                                    <div className="pl-10 font-bold my-2">프로필</div>
                                    <div className="bg-gray-200 pl-10 flex">
                                        <div className="mr-5">
                                            <img width="90" height="90"
                                                 src="https://img.icons8.com/ios-glyphs/90/5A5A5A/user-male-circle.png"
                                                 alt="user-male-circle"/>
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <div className="flex ">
                                                <input id="empName" type="text" value={selectedUser.empName} readOnly
                                                       className="text-lg font-bold px-3 py-2 border-b-2 border-gray-800 bg-gray-200 text-gray-800"/>
                                            </div>
                                            <div id="empCode" className="mt-2">{selectedUser.empCode}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 border-2 w-full text-left">
                                    <div className="pl-10 font-bold my-2">사내정보</div>
                                    <div className="bg-gray-200 pl-10 py-4 flex">
                                        <div className="flex flex-col justify-center">
                                            <div className="flex mb-2">
                                                <div className="mt-2">부서</div>
                                                <div className="flex ml-24">
                                                    <input id="depCode" type="text" value={selectedUser.depCode}
                                                           readOnly
                                                           className="ml-2 px-3 py-2 border-b-2 border-gray-800 bg-gray-200 text-gray-800"/>
                                                </div>
                                            </div>
                                            <div className="flex mb-2">
                                                <div className="mt-2">직급</div>
                                                <div className="flex ml-24">
                                                    <input id="posCode" type="text"
                                                           value={selectedUser.posCode} readOnly
                                                           className="ml-2 px-3 py-2 border-b-2 border-gray-800 bg-gray-200 text-gray-800"/>
                                                </div>
                                            </div>
                                            <div className="flex mb-2">
                                                <div className="mt-2">상관코드</div>
                                                <div className="flex ml-16">
                                                    <input id="corCode" type="text" value={selectedUser.corCode}
                                                           readOnly
                                                           className="ml-2 px-3 py-2 border-b-2 border-gray-800 bg-gray-200 text-gray-800"/>
                                                </div>
                                            </div>
                                            <div className="flex mb-2">
                                                <div className="mt-2">주민등록번호</div>
                                                <div className="flex ml-10">
                                                    <input id="empRrn" type="text"
                                                           value={selectedUser.empRrn} readOnly
                                                           className="px-3 py-2 border-b-2 border-gray-800 bg-gray-200 text-gray-800"/>
                                                    <p className="text-red-700 mt-2">* 수정불가 </p>
                                                </div>
                                            </div>
                                            <div className="flex mb-2">
                                                <div className="mt-2">비밀번호</div>
                                                <div className="flex ml-16">
                                                    <input id="empPass" type="text"
                                                           value={viewPassword ? selectedUser.empPass : selectedUser.empPass.replaceAll(/[a-zA-Z0-9]/g, "*")}
                                                           readOnly
                                                           className="ml-2 px-3 py-2 border-b-2 border-gray-800 bg-gray-200 text-gray-800"/>
                                                    <p className="mt-2" onClick={viewPasswordHandler}>
                                                        {viewPassword ? <img width="20" height="20"
                                                                             src="https://img.icons8.com/material/48/visible--v1.png"
                                                                             alt="visible--v1"/> :
                                                            <img width="20" height="20"
                                                                 src="https://img.icons8.com/ios-glyphs/30/invisible.png"
                                                                 alt="invisible"/>}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex mb-2">
                                                <div className="mt-2">전화번호</div>
                                                <div className="flex ml-16">
                                                    <input id="phoneNum" type="email"
                                                           value={selectedUser.phoneNum} readOnly
                                                           className="ml-2 px-3 py-2 border-b-2 border-gray-800 bg-gray-200 text-gray-800"/>
                                                </div>
                                            </div>
                                            <div className="flex mb-2">
                                                <div className="mt-2">내선번호</div>
                                                <div className="flex ml-16">
                                                    <input id="extNum" type="text"
                                                           value={selectedUser.extNum ? selectedUser.extNum : "내선번호 없음"}
                                                           readOnly
                                                           className="ml-2 px-3 py-2 border-b-2 border-gray-800 bg-gray-200 text-gray-800"/>

                                                </div>
                                            </div>
                                            <div className="flex mb-2">
                                                <div className="mt-2">메일</div>
                                                <div className="flex ml-24">
                                                    <input id="empMail" type="text"
                                                           className="ml-2 px-3 py-2 border-b-2 border-gray-800 bg-gray-200 text-gray-800"
                                                           value={selectedUser.empMail}
                                                           placeholder={"xxxx@xxxx.xxx"}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <button
                                        onClick={handleHold}
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
                                        보류
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        className="px-4 py-2 mx-3 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                                        반려
                                    </button>
                                    <button
                                        onClick={handleApprove}
                                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                                        승인
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p> 수정 요청 내역이 없습니다.</p>
                    )}
                </main>
            </div>

            <div className="flex absolute ml-96 mt-2" onClick={() => {
                navigate(`/`)
            }}>
                <img src="/BusinessClip.png" alt="mainLogo" className="w-20"/>
                <div className="font-bold mt-2 ml-2">BusinessClip</div>
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
                        {isLoggedIn ? (
                                isAdmin == "admin" ? <button
                                        className="mt-2 w-full h-10 text-white bg-gray-400 hover:bg-gray-500 rounded"
                                        onClick={handleLogout}>로그아웃
                                    </button> :
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
                                                    com !== null && com !== "" ? ListLibrary.WorkerList(com) : <></>
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
                                                                        <div
                                                                            className="h-[383px] overflow-y-auto chatRoomDiv">
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
                            )
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
                                        className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 mb-4">
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
}