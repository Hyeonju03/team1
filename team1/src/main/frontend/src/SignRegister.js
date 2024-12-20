import React, {useEffect, useState, useRef} from "react";
import "./App.css";
import SignTarget from "./SignTarget";
import axios from "axios";
import {ChevronDown, ChevronRight, Paperclip} from "lucide-react";
import {useLocation, useNavigate} from "react-router-dom";
import ListLibrary from "./HtmlFunctions/ListLibrary";
import {useListLibrary} from "./Context/ListLibraryContext";
import {useAuth} from "./noticeAuth";
import Clock from "react-live-clock";

export default function SignRegister() {
    const navigate = useNavigate();
    const location = useLocation(); // location 객체를 사용하여 이전 페이지에서 전달된 데이터 수신

    // 로그인
    const {isLoggedIn, empCode, logout} = useAuth();
    const [userEmpInfo, setUserEmpInfo] = useState([]);   // 이전 로그인 상태를 추적할 변수
    const [isAdmin, setIsAdmin] = useState(null)

    console.log(userEmpInfo)

    // 슬라이드 부분
    const socket = useRef(null);
    const [sendMessage, setSendMessage] = useState(null);
    const [isRClick, setIsRClick] = useState(false);
    const [newWindowPosY, setNewWindowPosY] = useState(500);
    const [newWindowPosX, setNewWindowPosX] = useState(500);
    const [newWindowData, setNewWindowData] = useState([]);
    const [noticeNum, setNoticeNum] = useState("");
    const {btnCtl, setBtnCtl} = useListLibrary();
    const [user, setUser] = useState(empCode);
    const [com, setCom] = useState(empCode.split("-")[0]);
    const [chatNum, setChatNum] = useState("")
    const [inviteChatCtl, setInviteChatCtl] = useState(0)

    /* 공지사항 내용 가져오기 */
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
        fetchData();
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
        socket.current = new WebSocket('ws://localhost:3002');

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


    // 왼쪽 카테고리
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [rejectedCount, setRejectedCount] = useState(0); // 반려 문서 수 상태 추가
    const [isCategoriExpanded, setIsCategoriExpanded] = useState(false);

    // 카테고리
    const [category, setCategory] = useState(location.state?.selectCategory || "");
    const [categories, setCategories] = useState([]);

    const [isExpanded, setIsExpanded] = useState(false);
    const [isToggled, setIsToggled] = useState(false);
    const [openTarget, setOpenTarget] = useState(false);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [attachment, setAttachment] = useState(null);
    const [userInfo, setUserInfo] = useState([]);

    // 양식 사용하면
    const [companyName, setCompanyName] = useState("");
    const [companyAddress, setCompanyAddress] = useState("");
    const [companyTel, setCompanyTel] = useState("");
    const [companyFax, setCompanyFax] = useState("");
    const [docNum, setDocNum] = useState("");
    const [docReception, setDocReception] = useState("");
    const [docReference, setDocReference] = useState("");
    const [docTitle, setDocTitle] = useState("");
    const [docOutline, setDocOutline] = useState("");
    const [docContent, setDocContent] = useState("");
    const [docAttached1, setDocAttached1] = useState("");
    const [docAttached2, setDocAttached2] = useState("");
    const [docAttached3, setDocAttached3] = useState("");
    const [docDate, setDocDate] = useState("");
    const [docCeo, setDocCeo] = useState("");

    const today = new Date();
    const formattedDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`;
    const empInfo = async () => {
        try {
            const response = await axios.get(`/emp/${empCode}`);
            setUserEmpInfo(response.data);
        } catch (e) {
            console.log(e)
        }
    }
    // 오른쪽 슬라이드 관련
    const windowRClick = async (e) => {
        e.preventDefault();
        if (e.target.className.includes("worker")) {
            await setNewWindowPosY(e.target.getBoundingClientRect().y + 24);
            await setNewWindowPosX(50);
            setIsRClick(true);
            ListLibrary.RClickWindow(newWindowPosX, newWindowPosY, e.target.getAttribute("data-value")).then((data) =>
                setNewWindowData([data[0], data[1]])
            );
        }
    };

    // 카테고리 불러오기
    useEffect(() => {
        if (isLoggedIn) {
            empInfo();
            try {
                axios
                    .get(`/code/${com}`) // API 엔드포인트를 조정하세요
                    .then((response) => {
                        console.log(response.data.signCateCode);
                        const uniqueCategories = [...new Set(response.data.signCateCode.split(",").map((category) => category))];
                        console.log("uniqueCategories::", uniqueCategories);
                        setCategories(uniqueCategories);
                    })
                    .catch((error) => console.log(error));

                axios.get(`/emp/${empCode}`).then((response) => {
                    const user = response.data;
                    setUserInfo([
                        {
                            empCode: user.empCode,
                            name: user.empName,
                            dep: user.depCode,
                            pos: user.posCode,
                            sign: "기안",
                        },
                    ]);
                });

                axios.get(`/sign/${empCode}`)
                    .then(response => {
                        let count = 0;
                        response.data.map((data, index) => {
                            if (data.empCode === empCode) {
                                if (data.target.includes("반려")) {
                                    count += 1;
                                }
                            }
                        })
                        setRejectedCount(count)
                    })
                    .catch(error => console.log(error));
            } catch (error) {
                console.error(error);
            }
        }
    }, [isLoggedIn, empCode]);

    useEffect(() => {
        if (isToggled) {
            // 양식이 사용될 때 content 업데이트
            const newContent =
                "양식_companyName:" +
                companyName +
                "_companyAddress:" +
                companyAddress +
                "_companyTel:" +
                companyTel +
                "_companyFax:" +
                companyFax +
                "_docNum:" +
                docNum +
                "_docReception:" +
                docReception +
                "_docReference:" +
                docReference +
                "_docTitle:" +
                docTitle +
                "_docOutline:" +
                docOutline +
                "_docContent:" +
                docContent +
                `${docAttached1 ? "_docAttached1:" + docAttached1 : ""}` +
                `${docAttached2 ? "_docAttached2:" + docAttached2 : ""}` +
                `${docAttached3 ? "_docAttached3:" + docAttached3 : ""}` +
                "_docDate:" +
                docDate +
                "_docCeo:" +
                docCeo;

            setContent(newContent);
        }
    }, [
        isToggled,
        companyName,
        companyAddress,
        companyTel,
        companyFax,
        docNum,
        docReception,
        docReference,
        docTitle,
        docOutline,
        docContent,
        docAttached1,
        docAttached2,
        docAttached3,
        docDate,
        docCeo,
    ]);

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

    const handleFileChange = (event) => {
        setAttachment(event.target.files[0]); // 선택한 파일 상태 업데이트
    };

    const goClose = (param) => {
        setOpenTarget(false);
        if (param) {
            setUserInfo([userInfo[0], ...param]);
        }
    };

    // 문서 작성 버튼 클릭 시
    const handleSubmit = async () => {
        const formData = new FormData();

        // 결재선
        if (userInfo.length == 1) {
            alert("결재선을 추가해야 합니다."); // 길이가 1인 경우 알림
            return; // DB와 연결하지 않음
        }
        // 카테고리
        if (category == "") {
            alert("카테고리 입력은 필수입니다.");
            return;
        }
        // 제목
        if (title == "") {
            alert("제목을 입력해주세요.");
            return;
        }
        // 양식 사용 여부
        if (isToggled) {
            // 양식 사용하면
            if (companyName == "") {
                alert("회사명 칸이 비어 있습니다.");
                return;
            }

            if (docNum == "") {
                alert("문서번호 칸이 비어 있습니다.");
                return;
            }

            if (docTitle == "") {
                alert("문서제목 칸이 비어 있습니다.");
                return;
            }

            if (docOutline == "") {
                alert("개요 칸이 비어 있습니다.");
                return;
            }

            if (docContent == "") {
                alert("문서내용 칸이 비어 있습니다.");
                return;
            }

            if (docDate == "") {
                alert("날짜 칸이 비어 있습니다.");
                return;
            }

            if (docCeo == "") {
                alert("대표작성 칸이 비어 있습니다.");
                return;
            }
        } else if (content == "") {
            alert("전체 내용이 비어있습니다. 다시 확인해 주세요.");
            return;
        }

        // 결재선 구성
        let target = `${userInfo[0].empCode}:확인_기안,`;
        for (let i = 1; i < userInfo.length; i++) {
            target += `${userInfo[i].empCode}:미확인_미승인`; // 첫 번째 인덱스 제외
            if (i < userInfo.length - 1) {
                target += ","; // 마지막 인덱스가 아니면 쉼표 추가
            }
        }

        formData.append("empCode", empCode); // 사용자 코드
        formData.append("title", title); // 제목
        formData.append("category", category); // 카테고리
        formData.append("content", content); // 내용
        formData.append("target", target); // 결재선

        // 첨부파일이 있는 경우 추가
        if (attachment) {
            formData.append("attachment", attachment);
        }

        try {
            const response = await axios.post("/sign/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            const success = window.confirm("정말 저장 하시겠습니까? 수정이 불가하니 양식을 사용한다면 다시 한번 확인하는것을 권장드립니다."); // 성공 메시지

            if (success) {
                // 성공 시 문서 리스트로 이동
                alert("성공적으로 저장되었습니다.")
                navigate("/sign");
            } else {
                return;
            }
        } catch (error) {
            console.error("Error creating sign:", error);
            // 오류 처리: 사용자에게 알림 추가 가능
        }
    };

    // 목록 버튼 클릭 시 리스트 페이지로 이동
    const handleHome = () => {
        navigate("/sign");
    };

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    const handleToggle = () => {
        setIsToggled((prevState) => !prevState);

        console.log(isToggled);
    };

    return (
        <div className="min-h-screen flex flex-col" onContextMenu={windowRClick}>
            {/* Header with logo */}
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
            {/* Main content */}
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
                                        <span className="hover:underline">결재함</span>

                                    </button>
                                    {isExpanded && (
                                        <div className="ml-8 space-y-2 pace-y-2 mt-2">
                                            <li>
                                                <div>
                                                    <button className="w-full flex items-center">
                                                        <ChevronRight className="mr-2 h-4 w-4"/>
                                                        <div className="hover:underline"
                                                             onClick={() => navigate("/sign")}>전체 보기
                                                        </div>
                                                    </button>
                                                </div>
                                            </li>
                                            <li>
                                                <div>
                                                    <button className="w-full flex items-center"
                                                            onClick={() => setIsCategoriExpanded(!isCategoriExpanded)}>
                                                        {isCategoriExpanded ? <ChevronDown className="mr-2 h-4 w-4"/> :
                                                            <ChevronRight className="mr-2 h-4 w-4"/>}
                                                        <div className="hover:underline">카테고리</div>
                                                    </button>
                                                    {isCategoriExpanded && (
                                                        categories.map((category, index) => (
                                                            // 각 카테고리를 ','로 나누고 각 항목을 한 줄씩 출력
                                                            category.split(',').map((item, subIndex) => (
                                                                <li className={`text-left transition-colors duration-300`}>
                                                                    <div className="flex">
                                                                        <ChevronRight className="ml-4 mr-2 h-4 w-4"/>
                                                                        <button key={`${index}-${subIndex}`}
                                                                                className="hover:underline">
                                                                            {item}
                                                                        </button>
                                                                    </div>
                                                                </li>
                                                            ))
                                                        ))
                                                    )}
                                                </div>
                                            </li>
                                            <li>
                                                <div className="flex justify-between">
                                                    <button className="w-full flex items-center">
                                                        <ChevronRight className="mr-2 h-4 w-4"/>
                                                        <div className="hover:underline">내 결재함</div>
                                                    </button>
                                                    {rejectedCount > 0 &&
                                                        <span
                                                            className="bg-red-700 text-white rounded-full w-6">{rejectedCount}</span>}
                                                </div>
                                            </li>
                                        </div>
                                    )}
                                </div>
                            </li>
                        </ol>
                    </aside>
                </div>
                <main className="ml-64 mt-14 flex-1 p-4 w-full h-full sm:w-[80%] md:w-[70%] lg:w-[60%]">
                    <div className="flex items-center space-x-2 mb-4">
                        <button className="w-[80px] h-[40px] bg-gray-200 hover:bg-gray-400 rounded"
                                onClick={handleHome}>
                            목록
                        </button>
                    </div>
                    <h1 className="text-2xl font-bold mb-4">결재 문서 작성</h1>

                    <div className="flex justify-center">
                        <div className="flex justify-center w-full mb-4">
                            <div className={`${isToggled ? "" : "font-bold"} mr-2`}>파일만 첨부하기</div>
                            <p
                                className={`w-[60px] h-[30px] rounded-[30px] border-gray-600 border-2 flex items-center cursor-pointer relative ${
                                    isToggled ? "on bg-gray-300" : "off"
                                }`}
                                onClick={handleToggle}
                            >
                                <div
                                    className={`w-[25px] h-[23px] rounded-full bg-gray-600 absolute top-[1px] ${
                                        isToggled ? "right-[3px]" : "left-[3px] border-gray-600"
                                    }`}
                                ></div>
                            </p>
                            <div className={`${isToggled ? "font-bold" : ""} ml-2`}>제공된 양식 사용하기</div>
                        </div>
                    </div>
                    <div className="border border-black rounded p-2">
                        <div className="flex h-full">
                            <div className="w-2/3">
                                <div className="flex">
                                    <fieldset className="mr-2">
                                        {/*<legend>카테고리</legend>*/}
                                        <div>

                                            <select name="category" value={category}
                                                    onChange={(e) => setCategory(e.target.value)}
                                                    className="border rounded p-2">
                                                <option value="">카테고리</option>
                                                {categories.map((category, index) =>
                                                    category.split(",").map((item, subIndex) => (
                                                        <option key={subIndex} value={item}>
                                                            {item}
                                                        </option>
                                                    ))
                                                )}
                                            </select>
                                        </div>
                                    </fieldset>

                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded mb-2"
                                        placeholder="제목을 입력하세요"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                {openTarget ? <SignTarget onClose={goClose} empCode={empCode}/> : null}

                                {isToggled ? (
                                    <form>
                                        <div
                                            className="h-auto w-full flex flex-col justify-center items-center border-black border-2 px-8 py-12 mb-4">
                                            {/* 내용 추가 가능 */}
                                            {/*  회사명, 결재라인  */}
                                            <table className="h-1/5 w-full">
                                                <tr className="w-full">
                                                    <td className="w-2/4 text-2xl">
                                                        <input
                                                            name="companyName"
                                                            type="text"
                                                            placeholder="기업명"
                                                            className="text-center h-full w-full text-2xl"
                                                            onChange={(e) => setCompanyName(e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="w-full flex flex-row justify-center mt-1">
                                                        {userInfo.map((user, index) => {
                                                            return (
                                                                <div
                                                                    className="flex flex-col justify-center w-1/5 border-2 border-black">
                                                                    <div
                                                                        className="h-[30px] bg-gray-200">{user.sign == "미승인" ? "승인" : user.sign}</div>
                                                                    <div
                                                                        className="h-[90px] border-t-2 border-black p-2 flex flex-col justify-around">
                                                                        <div>{user.name}</div>
                                                                        <div>{user.sign}</div>
                                                                    </div>
                                                                    {/*  결재자 있으면 추가 작성되게 하기  */}
                                                                </div>
                                                            );
                                                        })}
                                                    </td>
                                                </tr>
                                            </table>
                                            {/*    */}
                                            <div className="mt-1 w-full">
                                                <input
                                                    name="companyAddress"
                                                    type="text"
                                                    placeholder="주소"
                                                    className="text-center h-[50px] w-full text-lg"
                                                    onChange={(e) => setCompanyAddress(e.target.value)}
                                                />
                                            </div>
                                            {/*    */}
                                            <table className="w-full mb-3 border-t-2 border-b-4 border-black">
                                                <tr>
                                                    <td className="w-1/2 border-r-2 border-black">
                                                        <input
                                                            name="companyTel"
                                                            type="tel"
                                                            placeholder="TEL: (000)0000-0000"
                                                            className="text-center h-10 w-full text-lg"
                                                            onChange={(e) => setCompanyTel(e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="w-full border-l-2 border-black">
                                                        <input
                                                            name="companyFax"
                                                            type="tel"
                                                            placeholder="FAX: (000)0000-0000"
                                                            className="text-center h-10 w-full text-lg"
                                                            onChange={(e) => setCompanyFax(e.target.value)}
                                                        />
                                                    </td>
                                                </tr>
                                            </table>
                                            {/*    */}
                                            <table className="w-full border-t-4 border-b-4 border-black mb-5">
                                                <tr className="border-b-2 border-black">
                                                    <td className="w-1/4 border-r-2 border-black">
                                                        <div>문 서 번 호</div>
                                                    </td>
                                                    <td className="w-full">
                                                        <input
                                                            name="docNum"
                                                            type="text"
                                                            className="text-center h-10 w-full text-lg"
                                                            onChange={(e) => setDocNum(e.target.value)}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr className="border-b-2 border-black">
                                                    <td className="w-1/4 border-r-2 border-black">
                                                        <div>수 신</div>
                                                    </td>
                                                    <td className="w-full">
                                                        <input
                                                            name="docReception"
                                                            type="text"
                                                            className="text-center h-10 w-full text-lg"
                                                            onChange={(e) => setDocReception(e.target.value)}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr className="border-b-2 border-black">
                                                    <td className="w-1/4 border-r-2 border-black">
                                                        <div>참 조</div>
                                                    </td>
                                                    <td className="w-full">
                                                        <input
                                                            name="docReference"
                                                            type="text"
                                                            className="text-center h-10 w-full text-lg"
                                                            onChange={(e) => setDocReference(e.target.value)}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="w-1/4 border-r-2 border-black">
                                                        <div>제 목</div>
                                                    </td>
                                                    <td className="w-full">
                                                        <input
                                                            name="docTitle"
                                                            type="text"
                                                            className="text-center h-10 w-full text-lg"
                                                            onChange={(e) => setDocTitle(e.target.value)}
                                                        />
                                                    </td>
                                                </tr>
                                            </table>
                                            {/*    */}
                                            <div className="w-full">
                        <textarea
                            name="docOutline"
                            className="w-full h-36"
                            placeholder="문서의 개요를 작성하세요."
                            onChange={(e) => setDocOutline(e.target.value)}
                        />
                                            </div>
                                            {/*    */}
                                            <table className="w-full">
                                                <tr className="w-full">
                                                    <td className="h-10">
                                                        <div>- 아 래 -</div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="w-full">
                              <textarea
                                  name="docContent"
                                  className="w-full min-h-40"
                                  placeholder="문서의 내용을 작성하세요."
                                  onChange={(e) => setDocContent(e.target.value)}
                              />
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                            {/*    */}
                                            <table className="w-full">
                                                <tr>
                                                    <td rowSpan="3" className="w-1/6">
                                                        <div>※ 붙임</div>
                                                    </td>
                                                    <td>
                                                        1.{" "}
                                                        <input
                                                            name="docAttached1"
                                                            type="text"
                                                            className="w-5/6 h-[50px]"
                                                            placeholder="내용을 입력해주세요."
                                                            onChange={(e) => setDocAttached1(e.target.value)}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        2.{" "}
                                                        <input
                                                            name="docAttached2"
                                                            type="text"
                                                            className="w-5/6 h-[50px]"
                                                            placeholder="내용을 입력해주세요."
                                                            onChange={(e) => setDocAttached2(e.target.value)}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        3.{" "}
                                                        <input
                                                            name="docAttached3"
                                                            type="text"
                                                            className="w-5/6 h-[50px]"
                                                            placeholder="내용을 입력해주세요."
                                                            onChange={(e) => setDocAttached3(e.target.value)}
                                                        />
                                                    </td>
                                                </tr>
                                            </table>
                                            <div>
                                                <input
                                                    name="docDate"
                                                    className="text-center h-[50px] w-full"
                                                    placeholder="20oo.  oo.  oo."
                                                    onChange={(e) => setDocDate(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    name="docCeo"
                                                    type="textbox"
                                                    className="text-center h-[100px] w-full text-2xl"
                                                    placeholder="대표이사   ○ ○ ○"
                                                    onChange={(e) => setDocCeo(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="flex mb-2">
                    <textarea
                        className="min-h-60 p-1 w-full h-full border border-black rounded"
                        placeholder="파일과 함께 보낼 내용을 작성해주세요."
                        onChange={(e) => setContent(e.target.value)}
                    />
                                    </div>
                                )}
                                <div>
                                    <div className="flex justify-between mb-4 w-full p-2 border rounded">
                                        <div className="flex items-center">
                                            <Paperclip className="h-5 w-5 mr-2"/>
                                            <span className="whitespace-nowrap">첨부파일</span>
                                            <input type="file" className="m-1" onChange={handleFileChange}/>
                                        </div>
                                        <div> {attachment ? `${(attachment.size / 1024).toFixed(2)} KB / 10 MB` : "0 KB / 10 MB"}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-1/3 flex flex-col ml-2">
                                <button
                                    className="bg-amber-500 text-white px-6 py-2 rounded hover:bg-amber-600"
                                    onClick={() => {
                                        setOpenTarget(true);
                                    }}
                                >
                                    결재선 정하기
                                </button>
                                <table className="table-auto mt-2 border rounded w-full">
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
                                    {userInfo.map((user, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{user.name}</td>
                                                <td>{user.dep}</td>
                                                <td>{user.pos}</td>
                                                <td>{user.sign}</td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                                <div>
                                    <div className="rounded bg-amber-100 mt-2 p-3 text-left">
                                        <div className="mb-2">
                                            <span className="font-bold">필수 입력 요소</span>
                                            <br/>- 결재선(본인 제외 최대 3명), 카테고리, 제목, 내용
                                        </div>
                                        <div>
                                            <span className="font-bold">양식 사용시 필수 입력 요소</span>
                                            <br/>- 회사명, 문서번호, 문서제목, 개요, 내용, 날짜, 대표자
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mr-[5px]"
                                onClick={handleSubmit}>
                            문서 만들기
                        </button>
                        <button className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 ml-[5px]"
                                onClick={handleHome}>
                            취소
                        </button>
                    </div>
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
                                                    <p className="">이름: {userEmpInfo.empName}</p>
                                                    <p className="">직급: {userEmpInfo.posCode}</p>
                                                    <p className="">부서: {userEmpInfo.depCode}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col text-left mb-1">
                                                <p className="">사내 이메일: {userEmpInfo.empMail}</p>
                                                <p className="">전화번호: {userEmpInfo.phoneNum}</p>
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