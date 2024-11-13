import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from "axios";
import {ChevronDown, ChevronRight} from "lucide-react";
import {useAuth} from "./noticeAuth";
import Clock from "react-live-clock";
import ListLibrary from "./HtmlFunctions/ListLibrary";
import {useListLibrary} from "./Context/ListLibraryContext";


export default function SignList() {
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

    const navigate = useNavigate(); // 경로 navigate
    const [isPanelOpen, setIsPanelOpen] = useState(false); // 화면 옆 슬라이드

    // 결재함 열기
    const [isExpanded, setIsExpanded] = useState(true);
    // 카테고리 열기
    const [isCategoriExpanded, setIsCategoriExpanded] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // 검색 입력 상태 추가
    const [filteredDocuments, setFilteredDocuments] = useState([]); // 필터링된 문서 상태
    const [selectedCategory, setSelectedCategory] = useState(''); // 카테고리 상태 변수
    const [checkDoc, setCheckDoc] = useState([]);
    const [rejectedCount, setRejectedCount] = useState(0); // 반려 문서 수 상태 추가

    const today = new Date();
    const formattedDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`;
    const comCode = empCode.split("-")[0];

    useEffect(() => {
        if (isLoggedIn) {
            empInfo();
            const fetchData = async () => {
                try {
                    axios.get(`/sign/${empCode}`)
                        .then(response => {
                            setDocuments(response.data);
                            setFilteredDocuments(response.data); // 초기값은 전체 문서
                        })
                        .catch(error => console.log(error));

                    // 코드 가져오기
                    axios.get(`/code/${comCode}`)
                        .then(response => {
                            const uniqueCategories = [...new Set(response.data.signCateCode.split(",").map(category => category))];
                            setCategories(uniqueCategories);
                        })
                        .catch(error => console.log(error));
                } catch
                    (error) {
                    console.error(error);
                }
            }

            fetchData()
        }
    }, [isLoggedIn, empCode]); // isLoggedIn과 empCode 변경 시에만 실행

    // 반려된 문서 수 계산
    useEffect(() => {
        axios.get(`/sign/${empCode}`)
            .then(response => {
                let count = 0;
                response.data.forEach((data) => {
                    if (data.empCode === empCode && data.target.includes("반려")) {
                        count += 1;
                    }
                });
                setRejectedCount(count);
            })
            .catch(error => console.log(error));
    }, [empCode, documents]);

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

    // 화면 옆 슬라이드 열림 구분
    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    const goSignRequest = () => {
        // 권한 테이블, controller참고해서 작성권한(따진다면)에 따라 통제하는 코드 필요 ///////////
        navigate("/sign/register");
    }

    // 제목 클릭 시 상세 페이지로 이동
    const handleDocumentClick = async (signNum) => {
        // 문서의 세부 정보 가져오기
        const detailResponse = await axios.get(`/sign/detail/${signNum}`);

        const {target} = detailResponse.data;

        // 기존 TARGET 값에서 현재 사용자의 empCode가 있는지 확인
        const targetEntries = target.split(',');
        const updatedTargetEntries = targetEntries.map(entry => {
            // entry 형식: "AB:미확인_미승인"
            const [code, status] = entry.split(':');
            if (code === empCode && status === '미확인_미승인') {
                return `${code}:확인_미승인`; // 업데이트된 값
            }
            return entry; // 업데이트하지 않은 값
        });

        // 새로운 TARGET 값 생성
        const updatedTarget = updatedTargetEntries.join(',');
        // DB 업데이트 요청
        try {
            // endDate를 null로 보내고 싶으면 생략 가능
            await axios.put(`/sign/update/${signNum}`, null, {
                params: {
                    target: updatedTarget
                }
            });
        } catch (error) {
            console.error("PUT 요청 오류:", error);
            alert("업데이트 중 오류가 발생했습니다.");
        }

        // 이동
        navigate(`/sign/detail/${signNum}`)
    }

    // 날짜 형식 변환
    const formatDate = (dateString) => {
        if (!dateString) return ''; // null 또는 undefined일 경우 빈 문자열 반환
        return dateString.replace("T", " ").slice(0, 16);
    };

    // 검색 버튼 클릭 시
    const handleSearch = () => {
        // 검색어가 포함된 문서를 필터링
        const filtered = documents.filter((doc) =>
            doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || // 제목 검색
            doc.content?.toLowerCase().includes(searchQuery.toLowerCase()) || // 내용(문서 설명) 검색
            doc.docCateCode?.toLowerCase().includes(searchQuery.toLowerCase()) // 카테고리 검색
        );
        setFilteredDocuments(filtered); // 필터링된 문서로 상태 업데이트

        // 검색된 결과가 없을 경우
        if (filtered.length === 0) {
            alert("검색된 문서가 없습니다.");
        }
    };

    // 엔터키로 문서 검색 가능
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    }

    // 왼쪽 메뉴 카테고리 선택 시 해당 카테고리와 일치하는 문서들만 필터링
    const handleCategorySelect = (category) => {
        setSelectedCategory(category); // 별도의 선택 상태

        if (category == "all") {
            setFilteredDocuments(documents);
        } else {
            const filtered = documents.filter((document) => document.signCateCode === category);
            setFilteredDocuments(filtered); // 필터링된 문서로 상태 업데이트
            if (filtered.length === 0) {
                alert("해당 카테고리 관련 문서를 찾을 수 없습니다.");
            }
        }
    }

    const mineSignDoc = () => {
        const filtered = documents.filter((document) => document.empCode == empCode);
        setFilteredDocuments(filtered);
        if (filtered.length === 0) {
            alert("본인이 작성한 문서가 없습니다.");
        }
    }

    // 체크박스 상태 변화
    const handleCheckboxChange = (signNum) => {
        setCheckDoc(prevState => {
            if (prevState.includes(signNum)) {
                return prevState.filter(num => num !== signNum); // 이미 선택된 문서는 해제
            } else {
                return [...prevState, signNum]; // 새로운 문서 선택
            }
        });
    };

    const handleDelete = async () => {
        const deletePromises = checkDoc.map(signNum => {
            return axios.delete(`/sign/delete/${signNum}`); // DELETE 요청을 반환하도록 수정
        });

        try {
            await Promise.all(deletePromises);

            // 상태 업데이트: 삭제된 문서들을 필터링하여 상태를 갱신
            setDocuments(prevDocuments =>
                prevDocuments.filter(doc => !checkDoc.includes(doc.signNum))
            );
            setFilteredDocuments(prevFilteredDocuments =>
                prevFilteredDocuments.filter(doc => !checkDoc.includes(doc.signNum))
            );

            if (checkDoc.length > 0) {
                alert("삭제 완료");
            } else {
                alert("삭제할 문서가 선택되지 않았습니다.")
            }

            // 체크박스 초기화
            setCheckDoc([]); // 체크된 문서 초기화

        } catch (error) {
            console.error("삭제 오류:", error);
            alert("삭제 중 오류가 발생했습니다.");
        }
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
                                                    <button className="w-full flex items-center"
                                                            onClick={() => handleCategorySelect("all")}>
                                                        <ChevronRight className="mr-2 h-4 w-4"/>
                                                        <div className="hover:underline">전체 보기</div>
                                                    </button>
                                                </div>
                                            </li>
                                            <li>
                                                <div>
                                                    <button className="w-full flex items-center"
                                                            onClick={() => setIsCategoriExpanded(!isCategoriExpanded)}>
                                                        {isCategoriExpanded ?
                                                            <ChevronDown className="mr-2 h-4 w-4"/> :
                                                            <ChevronRight className="mr-2 h-4 w-4"/>}
                                                        <div className="hover:underline">카테고리</div>
                                                    </button>
                                                    {isCategoriExpanded && (
                                                        categories.map((category, index) => (
                                                            // 각 카테고리를 ','로 나누고 각 항목을 한 줄씩 출력
                                                            category.split(',').map((item, subIndex) => (
                                                                <li className={`text-left transition-colors duration-300`}>
                                                                    <div className="flex">
                                                                        <ChevronRight
                                                                            className="ml-4 mr-2 h-4 w-4"/>
                                                                        <button key={`${index}-${subIndex}`}
                                                                                className="hover:underline"
                                                                                onClick={() => handleCategorySelect(item)}>
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
                                                    <button className="w-full flex items-center"
                                                            onClick={mineSignDoc}>
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
                {/* Main content */}
                <main className="ml-64 mt-14 flex-1 p-4 w-full h-full sm:w-[80%] md:w-[70%] lg:w-[60%]">
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="relative flex flex-1 max-w-xl">
                            <input type="text" placeholder="문서 검색"
                                   className="pl-10 pr-4 w-[300px] h-[40px] border border-gray-300 rounded"
                                   value={searchQuery} // 검색 입력값 상태와 연결
                                   onChange={(e) => setSearchQuery(e.target.value)} // 입력값이 변경될 때 상태 업데이트
                                   onKeyDown={handleKeyDown}
                            />
                            <search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
                            <button className="ml-2 bg-gray-200 hover:bg-gray-400 rounded w-[50px]"
                                    onClick={handleSearch}>검색
                            </button>
                        </div>

                    </div>
                    <div className="flex justify-end space-x-2 mb-4 ">
                        <button className="w-[50px] h-[40px] hover:bg-gray-400 rounded" onClick={() => {
                            // 등록 페이지로 이동할 때 선택된 카테고리를 전달
                            navigate('/sign/register', {state: {selectedCategory: selectedCategory}});
                        }}>등록
                        </button>
                        <button className="bg-red-700 text-white rounded w-[50px] h-[40px] ml-2"
                                onClick={handleDelete}>삭제
                        </button>
                    </div>
                    <h1 className="text-2xl font-bold mb-4">문서결재</h1>
                    <div className="space-y-2">
                        {/* Document table */}
                        <table className="w-full mb-6 rounded shadow-lg">
                            <thead>
                            <tr className="bg-gray-200">
                                <th></th>
                                <th className="p-2 text-center">문서번호</th>
                                <th className="p-2 text-center">분류</th>
                                <th className="p-2 text-center">제목</th>
                                <th className="p-2 text-center">기안일</th>
                                <th className="p-2 text-center">완료일</th>
                                <th className="p-2 text-center">승인현황</th>
                            </tr>
                            </thead>
                            <tbody className="">
                            {(filteredDocuments.length > 0 ? filteredDocuments : documents).map((document, docIndex) => {
                                const target = document.target
                                return (
                                    <tr key={docIndex} className="cursor-pointer hover:bg-gray-100">
                                        <td><input type="checkbox" className="checkDelete"
                                                   onChange={() => handleCheckboxChange(document.signNum)}
                                                   checked={checkDoc.includes(document.signNum)}/></td>
                                        <td className="p-2"
                                            onClick={() => handleDocumentClick(document.signNum)}>{docIndex + 1}</td>
                                        <td className="p-2"
                                            onClick={() => handleDocumentClick(document.signNum)}>{document.signCateCode}</td>
                                        <td className="p-2"
                                            onClick={() => handleDocumentClick(document.signNum)}>{document.title}</td>
                                        <td className="p-2"
                                            onClick={() => handleDocumentClick(document.signNum)}>{formatDate(document.startDate)}</td>
                                        <td className="p-2"
                                            onClick={() => handleDocumentClick(document.signNum)}>{target.includes("반려") ? (
                                            <div className="font-bold text-red-700">반려</div>) : (
                                            target.includes("미승인") ? (
                                                <div></div>) : formatDate(document.endDate))}</td>
                                        <td className="p-2" onClick={() => handleDocumentClick(document.signNum)}>
                                            {target.split(',')[1]?.split('_')[1] || ''}
                                            {target.split(',')[2] ? (" > " + target.split(',')[2].split('_')[1]) : ""}
                                            {target.split(',')[3] ? (" > " + target.split(',')[3].split('_')[1]) : ""}
                                            {target.split(',')[4] ? (" > " + target.split(',')[4].split('_')[1]) : ""}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>


                    {/* Create document button */}
                    <button
                        className="text-white bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
                        onClick={goSignRequest}
                    >
                        문서 만들기
                    </button>
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
        ;
}