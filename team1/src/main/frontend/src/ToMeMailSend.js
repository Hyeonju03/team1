import React, {useEffect, useRef, useState} from 'react';
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
import {useNavigate} from "react-router-dom";
import DeletePopup from './DeletePopup';
import ListLibrary from "./HtmlFunctions/ListLibrary";
import {useListLibrary} from "./Context/ListLibraryContext";
import {useAuth} from "./noticeAuth";
import Clock from "react-live-clock";

const Input = ({className, ...props}) => {
    return <input className={`rounded px-3 py-2 ${className}`} {...props} />;
};

export default function EmailSend() {
    // 로그인
    const {isLoggedIn, empCode, logout} = useAuth();
    const [userInfo, setUserInfo] = useState([])
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


    const [isPanelOpen, setIsPanelOpen] = useState(false); // 화면 옆 슬라이드

    const [isExpanded, setIsExpanded] = useState(false);
    const [errors, setErrors] = useState({});
    const [attachment, setAttachment] = useState(null);
    const navigate = useNavigate();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [mailEmpCode, setMailEmpCode] = useState("")
    const today = new Date();
    const formattedDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`;

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
                    const response = await axios.get(`/selectEmpCode?empCode=${empCode}`);
                    console.log(response.data);
                    const mailEmpCode = response.data.split("-").join("") + '@damail.com';
                    setMailEmpCode(mailEmpCode)
                    console.log(mailEmpCode)
                } catch (error) {
                    console.error(error.response ? error.response.data : error.message);
                }
            }
        }
        fetchData();
        if(empCode != "") {
            empInfo()
        }
    }, [isLoggedIn, empCode]); // isLoggedIn과 empCode 변경 시에만 실행

    const empInfo = async () => {
        try{
            const response = await axios.get(`/emp/${empCode}`);
            setUserInfo(response.data);
        }catch (e){
            console.log(e)
        }
    }

    const handleChange = (e) => {
        const {name, value, type, files} = e.target;

        if (type === 'file') {
            const file = files[0];
            setAttachment(file);
            setFormData(prev => ({
                ...prev,
                [name]: file,
                fileName: file.name,
                fileSize: file.size,
            }));
        } else {
            setFormData(prev => ({...prev, [name]: value}));
        }
        setErrors(prev => ({...prev, [name]: ''}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSubmit = new FormData();
        dataToSubmit.append('empCode', empCode);
        dataToSubmit.append('mailTarget', mailEmpCode);
        dataToSubmit.append('mailRef', formData.cc);
        dataToSubmit.append('title', formData.title);
        dataToSubmit.append('content', formData.content);
        dataToSubmit.append('fileName', formData.fileName);

        if (formData.file) {
            dataToSubmit.append('fileOriginalName', formData.file.name);
            dataToSubmit.append('fileSize', formData.fileSize);
            dataToSubmit.append('filePath', '...');
            dataToSubmit.append('file', formData.file);
            dataToSubmit.append('attachment', attachment);
        } else {
            console.error('파일이 선택되지 않았습니다.');
        }

        try {
            const response = await axios.post('/mailSend', dataToSubmit);
            console.log(response.data);
            setShowConfirmation(true);
        } catch (error) {
            console.error('Error uploading data:', error);
            alert("실패");
        }
    };

    const goSendMail = () => {
        navigate("/MailSend");
        window.location.reload();
    }

    const goSendMailList = () => {
        navigate("/MailSendList");
        window.location.reload();
    }

    const backSend = () => {
        setShowConfirmation(false);
    }

    const goToMeMailSend = (e) => {
        console.log("클릭됨")
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

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };


    const handleConfirmDelete = async () => {
        try {
            await axios.delete('/AlldeleteMail');
            alert("삭제완료")
            setIsPopupOpen(false);
            setSelectedCheckboxes([]);
        } catch (error) {
            console.error(error);
            alert("삭제할 메일이 없습니다.");
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
                    <aside
                        className="mt-14 h-full w-64 bg-gray-200 border-r-2 shadow-lg p-4 space-y-2 flex flex-col justify-items-start items-center"
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
                <div className="ml-64 mt-14 flex-1 p-6 w-full h-full sm:w-[80%] md:w-[70%] lg:w-[60%]">
                    <form onSubmit={handleSubmit} className="space-y-4" style={{justifyContent: 'center'}}>
                        {console.log("showConfirmation", showConfirmation)}
                        {showConfirmation === false ?
                            <div>
                                <div style={{display: showConfirmation ? "none" : "block"}}>
                                    <div className="text-2xl w-full font-bold mb-6 text-left">내게쓰기</div>
                                </div>
                                {/*제목*/}
                                <div className="flex space-x-8" style={{marginBottom: "20px"}}>
                                    <label htmlFor="title"
                                           className="block font-bold mb-1 mr-8">제목</label>
                                    <Input onChange={handleChange} id="title" name="title" value={formData.title}
                                           placeholder="제목을 입력해주세요."
                                           className="h-10 w-[800px] border-b-2 hover:border-blue-400"/>
                                </div>

                                {/*파일첨부*/}
                                <div className="flex space-x-8" style={{marginBottom: "20px"}}>
                                    <label htmlFor="file"
                                           className="block font-bold mb-1">파일첨부</label>
                                    <Input onChange={handleChange} id="file" type="file" name="file"
                                           className="h-10 w-[800px] border-b-2 hover:border-blue-400"/>
                                </div>

                                {/*내용*/}
                                <div className="flex space-x-8" style={{marginBottom: "20px"}}>
                                    <label htmlFor="content"
                                           className="block font-medium text-gray-700 mb-1">내용</label>
                                    <Input onChange={handleChange} id="content" name="content" value={formData.content}
                                           placeholder="내용을 입력해주세요."
                                           style={{height: '500px', width: '800px ', marginLeft: '63px'}}/>
                                </div>

                                <div className="flex justify-center space-x-4 text-center" style={{marginLeft: '50px'}}>
                                    <button type={"submit"} className="border rounded-md px-4 py-2">보내기</button>
                                </div>
                            </div>
                            :
                            <div style={{marginLeft: "-150PX"}}>
                                <h1
                                    className="text-xl font-bold text-left mt-14 ml-80">메일을 보냈습니다.</h1>
                                <div style={{marginBottom: "80px"}} className="mt-14 ml-80">
                                    <p style={{marginBottom: "20px"}}
                                       className="text-left">{formData.title ? `제목: ${formData.title}` : '제목 : 제목없음'}</p>
                                    <p className="text-left">받는사람: {mailEmpCode}</p>
                                    <p className="text-left">{formData.cc ? `참조: ${formData.cc}` : null}</p>
                                </div>
                                <div>
                                    <button onClick={goSendMailList} className="border rounded-md px-4 py-2">확인</button>
                                    <button onClick={backSend} className="border rounded-md px-4 py-2"
                                            style={{marginLeft: "30px"}}>쓰던 페이지 가기
                                    </button>
                                </div>
                            </div>
                        }
                    </form>
                </div>
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
    );
}