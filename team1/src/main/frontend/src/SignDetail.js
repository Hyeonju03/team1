import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from "axios";
import {ChevronDown, ChevronRight, Paperclip} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import SignModal from "./SignModal";
import {useAuth} from "./noticeAuth";
import Clock from "react-live-clock";
import ListLibrary from "./HtmlFunctions/ListLibrary";
import {useListLibrary} from "./Context/ListLibraryContext";

export default function SignDetail() {
    // pdf
    const printRef = useRef(null); // useRef로 초기화

    // 로그인
    const {isLoggedIn, empCode, logout} = useAuth();
    const [userEmpInfo, setUserEmpInfo] = useState([])

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

    const [isPanelOpen, setIsPanelOpen] = useState(false); // 화면 옆 슬라이드

    const navigate = useNavigate();
    const [isToggled, setIsToggled] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const {id} = useParams();
    const [sign, setSign] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState([]); // useState로 변경
    const [empUser, setEmpUser] = useState(null);
    const [isCategoriExpanded, setIsCategoriExpanded] = useState(false);
    const [rejectedCount, setRejectedCount] = useState(0); // 반려 문서 수 상태 추가
    let contentType;

    // confirm 오류로 만든 modal 관련
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentAction, setCurrentAction] = useState(null);
    const [modalMessage, setModalMessage] = useState("");

    const comCode = empCode.split("-")[0];

    const today = new Date();
    const formattedDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`;

    // pdf제작
    const handleDownloadPdf = async () => {
        const element = printRef.current
        if (!element) {
            return
        }
        const canvas = await html2canvas(element)
        const componentWidth = element.offsetWidth
        const componentHeight = element.offsetHeight

        const orientation = componentWidth >= componentHeight ? 'l' : 'p'

        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF({
            orientation,
            unit: 'px',
        })

        pdf.internal.pageSize.width = componentWidth
        pdf.internal.pageSize.height = componentHeight

        pdf.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight)
        pdf.save('결재서.pdf')
    }

    useEffect(() => {
        if (isLoggedIn) {
            axios.get(`/code/${comCode}`)
                .then(response => {
                    const uniqueCategories = [...new Set(response.data.signCateCode.split(",").map(category => category))];
                    setCategories(uniqueCategories);
                })
                .catch(error => console.log(error));

            fetchUserInfo();
            fetchCategories();
            fetchSignDetail();
            if(empCode != "") {
                empInfo();
            }
        }
    }, [isLoggedIn, empCode]); // isLoggedIn과 empCode 변경 시에만 실행

    useEffect(() => {
        if (!sign || !sign.target) {
            return;
        }
        fetchUserDetails();
        fetchSignContent();
    }, [sign]);

    useEffect(() => {
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
    }, [empCode, sign]);

    const empInfo = async () => {
        try{
            console.log()
            const response = await axios.get(`/emp/${empCode}`);
            setUserEmpInfo(response.data);
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

    // 유저 정보 조회 (필요성 재확인 필요.)
    const fetchUserInfo = async () => {
        try {
            const response = await axios.get(`/emp/${empCode}`);
            if (!response.data) {
                return;
            }
            setEmpUser(response.data); // user 상태 업데이트
        } catch (error) {
            console.error(error);
        }
    };

    // sign의 정보 불러옴
    const fetchSignDetail = async () => {
        try {
            const response = await axios.get(`/sign/detail/${id}`);
            setSign(response.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // 카테고리 불러옴
    const fetchCategories = async () => {
        const response = await axios.get(`/code/${comCode}`);
        const uniqueCategories = [...new Set(response.data.signCateCode.split(",").map(category => category))];
        setCategories(uniqueCategories);
    };

    // target 입력
    const fetchUserDetails = async () => {
        const signUsers = sign.target.split(",");

        for (const signUser of signUsers) {
            const empUser = signUser.split(":")[0];
            const signList = signUser.split(":")[1].split("_")[1];

            try {
                const response = await axios.get(`/emp/${empUser}`);
                const newUser = {
                    empCode: response.data.empCode,
                    name: response.data.empName,
                    dep: response.data.depCode,
                    pos: response.data.posCode,
                    sign: signList,
                };

                // userInfo에 새로운 사용자 추가
                setUserInfo(prevUserInfo => {
                    // 중복 체크
                    if (!prevUserInfo.find(user => user.name === newUser.name)) {
                        return [...prevUserInfo, newUser];
                    }
                    return prevUserInfo; // 중복일 경우 이전 상태 반환
                });
            } catch (error) {
                console.error(error);
            }
        }
    };

    // 양식 사용 여부
    const fetchSignContent = () => {
        if (!sign.content || !sign) {
            return;

        }
        contentType = sign.content.split("_")[0]
        if (contentType == "양식") {
            setIsToggled(true);
        }
    }

    if (loading) {
        return null;
    }

    if (!sign) {
        return null;
    }


    const fileDownload = (blobData, fileName) => {
        const url = window.URL.createObjectURL(blobData);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        a.remove();
    };

    const handleDocumentDownload = async (sign) => {
        try {
            const response = await axios({
                method: "get",
                url: `/sign/download/${sign.signNum}`,
                responseType: "blob"
            });
            fileDownload(response.data, sign.fileOriginName);
        } catch (e) {
            console.error(e);
        }
    };

    // 반려/승인 업데이트
    const handleSignUpdate = async (signNum, updatedTarget) => {
        try {
            await axios.put(`/sign/update/${signNum}`, null, {
                params: {
                    target: updatedTarget,
                    endDate: new Date().toISOString() // ISO 8601 형식으로 변환
                }
            });
            if (updatedTarget.includes("반려")) {
                alert("반려되었습니다."); // 확인 알림
            } else {
                alert("승인되었습니다."); // 확인 알림
            }
        } catch (error) {
            console.error("Error updating sign:", error);
            alert("결재 처리 중 오류가 발생했습니다.");
        }
    };

    // modal띄우기
    const handleConfirm = async () => {
        if (currentAction) {
            await currentAction();
            setCurrentAction(null);
        }
        setModalOpen(false);
    };

    // 승인버튼
    const asignButton = (signNum) => {
        const targetEntries = sign.target.split(',');

        targetEntries.map((entry, index) => {
            const [code, status] = entry.split(':');

            if (status === '확인_미승인' && index > 0) {
                const previousEntry = targetEntries[index - 1].split(':');
                const previousStatus = previousEntry[1];

                if (previousStatus.includes('미승인')) {
                    alert("앞에 있는 사람이 미승인 상태입니다. 승인할 수 없습니다.");
                    return entry;
                }
                if (previousStatus.includes('반려')) {
                    alert("이미 반려된 문서입니다. 승인할 수 없습니다.");
                    return entry;
                }

                if (code === empCode) {
                    setModalMessage("승인하시겠습니까?");
                    setCurrentAction(() => () => handleAsign(signNum, targetEntries)); // 승인 함수 설정
                    setModalOpen(true); // 모달 열기
                    return entry; // 변경하지 않음
                }
            }
            return entry; // 업데이트하지 않은 값
        });
    };

    const handleAsign = async (signNum, targetEntries) => {
        const updatedTargetEntries = targetEntries.map((entry) => {
            const [code, status] = entry.split(':');
            if (code === empCode) {
                return `${code}:확인_승인`; // 승인된 값으로 업데이트
            }
            return entry;
        });

        const updatedTarget = updatedTargetEntries.join(',');
        await handleSignUpdate(signNum, updatedTarget); // DB 업데이트
    };

    const rejectButton = (signNum) => {
        const targetEntries = sign.target.split(',');

        console.log(empCode);

        // targetEntries를 map으로 순차적으로 처리
        const updatedTargetEntries = targetEntries.map((entry, index) => {
            const [code, status] = entry.split(':');

            // "확인_미승인" 상태에서만 반려 처리 가능
            if (status === '확인_미승인' && index > 0) {
                const previousEntry = targetEntries[index - 1].split(':');
                const previousStatus = previousEntry[1];

                // 이전 결재자가 미승인 또는 반려 상태일 경우
                if (previousStatus.includes('미승인')) {
                    alert("앞에 있는 사람이 미승인 상태입니다. 결재를 진행할 수 없습니다.");
                    return entry;
                }
                if (previousStatus.includes('반려')) {
                    alert("이미 반려된 문서입니다. 결재를 진행할 수 없습니다.");
                    return entry;
                }

                // 현재 사용자가 해당 항목의 결재자이고, 반려 처리할 경우
                if (code === empCode) {
                    // 모달을 열어 반려 여부 확인
                    setModalMessage("반려 시 다음 결재 진행이 불가합니다. 반려하시겠습니까?");
                    setCurrentAction(() => () => handleReject(signNum, targetEntries)); // 반려 함수 설정
                    setModalOpen(true); // 모달 열기
                    return entry; // 해당 항목은 그대로 두기
                }
            }

            return entry; // 상태를 변경하지 않은 항목은 그대로 반환
        });

        // 상태가 변경된 경우에만 target을 업데이트
        console.log('Updated Target Entries:', updatedTargetEntries);
    };

    const handleReject = async (signNum, targetEntries) => {
        const updatedTargetEntries = targetEntries.map((entry) => {
            const [code] = entry.split(':');
            if (code === empCode) {
                return `${code}:확인_반려`; // 반려된 값으로 업데이트
            }
            return entry;
        });

        const updatedTarget = updatedTargetEntries.join(',');
        await handleSignUpdate(signNum, updatedTarget); // DB 업데이트

    };


    // 목록으로
    const handleHome = () => {
        navigate(`/sign`);
    };

    // 화면 옆 슬라이드 열림 구분
    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

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
                                onClick={handleHome}>목록
                        </button>
                    </div>
                    <h1 className="text-2xl font-bold mb-4">결재 문서 상세</h1>
                    <div className="space-y-2">
                        <div className="border border-black rounded p-2">
                            <div className="flex w-full">
                                <div className="w-2/3">
                                    <div className="flex w-full">
                                        <div
                                            className="border rounded text-center p-2 mr-2 mb-2 w-[70px] text-sm font-bold text-gray-600 text-left">{sign.signCateCode}</div>
                                        <input type="text" className="w-full p-2 border rounded mb-2"
                                               value={sign.title} readOnly/>
                                    </div>
                                    {isToggled ?
                                        <form>
                                            <div
                                                className="h-auto w-full border-black border-2 mb-4"
                                            >
                                                <div className="flex flex-col justify-center items-center px-8 py-12"
                                                     ref={printRef}>
                                                    {/* 내용 추가 가능 */}
                                                    {/*  회사명, 결재라인  */}
                                                    <table className="h-1/5 w-full">

                                                        <tr className="w-full">
                                                            <td className="w-2/4 text-2xl">
                                                                <input name="companyName" type="text"
                                                                       className="text-center h-full w-full text-2xl"
                                                                       value={sign.content.split("_")[1].split(":")[1]}
                                                                       readOnly/>
                                                            </td>
                                                            <td className="w-full flex flex-row justify-center mt-1">
                                                                {userInfo.map((user, index) => {
                                                                    return (
                                                                        <div
                                                                            className="flex flex-col justify-center w-1/5 border-2 border-black">
                                                                            <div className="h-[30px] bg-gray-200">
                                                                                {user.sign == "미승인" ? "승인" : user.sign}
                                                                            </div>
                                                                            <div
                                                                                className="h-[90px] border-t-2 border-black p-2 flex flex-col justify-around">
                                                                                <div>{user.name}</div>
                                                                                <div>{user.sign}</div>
                                                                            </div>
                                                                            {/*  결재자 있으면 추가 작성되게 하기  */}
                                                                        </div>
                                                                    )
                                                                })}
                                                            </td>
                                                        </tr>

                                                    < /table>
                                                    {/*    */}
                                                    <div className="mt-1 w-full">
                                                        <input name="companyAddress" type="text"
                                                               className="text-center h-[50px] w-full text-lg"
                                                               value={sign.content.split("_")[2].split(":")[1]}
                                                               readOnly/>
                                                    </div>
                                                    {/*    */}
                                                    <table className="w-full mb-3 border-t-2 border-b-4 border-black">
                                                        <tr>
                                                            <td className="w-1/2 border-r-2 border-black">
                                                                <input name="companyTel" type="tel"
                                                                       className="text-center h-10 w-full text-lg"
                                                                       value={sign.content.split("_")[3].split(":")[1]}
                                                                       readOnly/>
                                                            </td>
                                                            <td className="w-full border-l-2 border-black">
                                                                <input name="companyFax" type="tel"
                                                                       className="text-center h-10 w-full text-lg"
                                                                       value={sign.content.split("_")[4].split(":")[1]}
                                                                       readOnly/>
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
                                                                <input name="docNum" type="text"
                                                                       className="text-center h-10 w-full text-lg"
                                                                       value={sign.content.split("_")[5].split(":")[1]}
                                                                       readOnly/>
                                                            </td>
                                                        </tr>
                                                        <tr className="border-b-2 border-black">
                                                            <td className="w-w-1/4 border-r-2 border-black">
                                                                <div>수 신</div>
                                                            </td>
                                                            <td className="w-full">
                                                                <input name="docReception" type="text"
                                                                       className="text-center h-10 w-full text-lg"
                                                                       value={sign.content.split("_")[6].split(":")[1]}
                                                                       readOnly/>
                                                            </td>
                                                        </tr>
                                                        <tr className="border-b-2 border-black">
                                                            <td className="w-1/4 border-r-2 border-black">
                                                                <div>참 조</div>
                                                            </td>
                                                            <td className="w-full">
                                                                <input name="docReference" type="text"
                                                                       className="text-center h-10 w-full text-lg"
                                                                       value={sign.content.split("_")[7].split(":")[1]}
                                                                       readOnly/>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="w-1/4 border-r-2 border-black">
                                                                <div>제 목</div>
                                                            </td>
                                                            <td className="w-full">
                                                                <input name="docTitle" type="text"
                                                                       className="text-center h-10 w-full text-lg"
                                                                       value={sign.content.split("_")[8].split(":")[1]}
                                                                       readOnly/>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    {/*    */}
                                                    <div className="w-full">
                                            <textarea name="docOutline" className="w-full h-36"
                                                      value={sign.content.split("_")[9].split(":")[1]} readOnly/>
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
                                                    <textarea name="docContent" className="w-full min-h-40"
                                                              value={sign.content.split("_")[10].split(":")[1]}
                                                              readOnly/>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    {/*    */}
                                                    <table className="w-full">
                                                        <tr className={`${sign.content.split("_")[11].split(":")[0] != "docAttached1" ? "hidden" : ""}`}>
                                                            <td rowSpan="3" className="w-1/6">
                                                                <div>※ 붙임</div>
                                                            </td>
                                                            <td>
                                                                1. <input name="docAttached1" type="text"
                                                                          className="w-9/12 h-[50px]"
                                                                          value={sign.content.split("_")[11].split(":")[0] == "docAttached1" ? sign.content.split("_")[11].split(":")[1] : ""}
                                                                          readOnly/>
                                                            </td>
                                                        </tr>
                                                        <tr className={`${sign.content.split("_")[12].split(":")[0] != "docAttached2" ? "hidden" : ""}`}>
                                                            <td>
                                                                2. <input name="docAttached2" type="text"
                                                                          className="w-9/12 h-[50px]"
                                                                          value={sign.content.split("_")[12].split(":")[0] == "docAttached2" ? sign.content.split("_")[12].split(":")[1] : ""}
                                                                          readOnly/>
                                                            </td>
                                                        </tr>
                                                        <tr className={`${sign.content.split("_")[13].split(":")[0] != "docAttached3" ? "hidden" : ""}`}>
                                                            <td>
                                                                3. <input name="docAttached3" type="text"
                                                                          className="w-9/12 h-[50px]"
                                                                          value={sign.content.split("_")[13].split(":")[0] == "docAttached3" ? sign.content.split("_")[13].split(":")[1] : ""}
                                                                          readOnly/>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    <div>
                                                        <input name="docDate" className="text-center h-[50px] w-full"
                                                               value={sign.content.split("_")[11].split(":")[0] == "docDate" ?
                                                                   (sign.content.split("_")[11].split(":")[1]) :
                                                                   (sign.content.split("_")[12].split(":")[0] == "docDate" ?
                                                                       sign.content.split("_")[12].split(":")[1] :
                                                                       (sign.content.split("_")[13].split(":")[0] == "docDate" ?
                                                                           sign.content.split("_")[13].split(":")[1] :
                                                                           sign.content.split("_")[14].split(":")[1]))}
                                                               readOnly/>
                                                    </div>
                                                    <div>
                                                        <input name="docCeo" type='textbox'
                                                               className="text-center h-[100px] w-full text-2xl"
                                                               value={sign.content.split("_")[12].split(":")[0] == "docCeo" ?
                                                                   (sign.content.split("_")[12].split(":")[1]) :
                                                                   (sign.content.split("_")[13].split(":")[0] == "docCeo" ?
                                                                       sign.content.split("_")[13].split(":")[1] :
                                                                       (sign.content.split("_")[14].split(":")[0] == "docCeo" ?
                                                                           sign.content.split("_")[14].split(":")[1] :
                                                                           sign.content.split("_")[15].split(":")[1]))}
                                                               readOnly/>
                                                    </div>
                                                </div>
                                            </div>
                                        </form> : <div className="flex mb-2">
                                        <textarea className="p-1 w-full h-full min-h-60 border border-black rounded"
                                                  value={sign.content} readOnly/>
                                        </div>
                                    }
                                    <div>
                                        <div className="flex justify-between mb-4 w-full p-2 border rounded">
                                            <div className="flex items-center">
                                                <Paperclip className="h-5 w-5 mr-2"/>
                                                <span className="whitespace-nowrap mr-1">첨부파일: </span>
                                                <span onClick={() => handleDocumentDownload(sign)}
                                                      className={'cursor-pointer text-indigo-600 hover:text-indigo-500 hover:underline hover:underline-offset-1'}>
                                                  {sign.fileOriginName}
                                            </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col ml-2 w-1/3">
                                    {isToggled ?
                                        <button className="w-full group mb-2" onClick={handleDownloadPdf}>
                                            <div className="flex h-11">
                                                <div
                                                    className="w-5/6 bg-rose-400 group-hover:bg-rose-500 text-white p-2.5 rounded-l-lg font-bold">PDF
                                                    다운로드
                                                </div>
                                                <div
                                                    className="w-1/6 bg-rose-500 text-white items-center rounded-r-lg flex justify-center items-center">
                                                    <img
                                                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAU0lEQVR4nO3QsQqAMAxF0ffXHdM/v+KgQ0qtaCxIc6BLh3ch0jJwMtAgTzRCnsgDij/LBdOHEXs0fjNir8YHkZjxTiR2/ADU/Z0fKRTBND2gv9oAVZTQEh7ZErUAAAAASUVORK5CYII="/>
                                                </div>
                                            </div>
                                        </button> : ""}
                                    <table className="table-auto border rounded w-full">
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
                                            )

                                        })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <button
                            className={`bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mr-[5px] ${empCode == sign.empCode ? "hidden" : ""}`}
                            onClick={() => asignButton(sign.signNum)}
                        >
                            결재승인
                        </button>
                        <button className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 ml-[5px]"
                                onClick={handleHome}>
                            목록으로
                        </button>
                        <button
                            className={`bg-red-700 text-white px-6 py-2 rounded hover:bg-red-900 ml-[5px] ${empCode == sign.empCode ? "hidden" : ""}`}
                            onClick={() => rejectButton(sign.signNum)}>
                            결재반려
                        </button>
                        <SignModal
                            isOpen={isModalOpen}
                            onClose={() => setModalOpen(false)}
                            onConfirm={handleConfirm}
                            message={modalMessage}
                        />
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
        ;
}