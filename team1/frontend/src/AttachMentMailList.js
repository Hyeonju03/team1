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
    RefreshCw
} from 'lucide-react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import DeletePopup from './DeletePopup';

import {useAuth} from "./noticeAuth";
import Clock from "react-live-clock";

const Input = ({className, ...props}) => {
    return <input className={`border rounded px-3 py-2 ${className}`} {...props} />;
};

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.35-4.35"/>
    </svg>
);


export default function EmailSend() {
    // 로그인
    const {isLoggedIn, empCode, logout} = useAuth();
    const [prevLogin, setPrevLogin] = useState(undefined);   // 이전 로그인 상태를 추적할 변수

    const [isPanelOpen, setIsPanelOpen] = useState(false); // 화면 옆 슬라이드
    const navigate = useNavigate();
    const [sendList, setSendList] = useState([])
    const [searchList, setSearchList] = useState("")
    const [serachResult, setSerachResult] = useState([])
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [mailEmpCode, setMailEmpCode] = useState("")

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const indexOfLastMail = currentPage * itemsPerPage;
    const indexOfFirstMail = indexOfLastMail - itemsPerPage;
    const currentMails = sendList.slice(indexOfFirstMail, indexOfLastMail);

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const today = new Date();
    const formattedDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`;

    //날짜변환
    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const year = String(date.getFullYear()).slice(2); // 마지막 두 자리 연도
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 01-12
        const day = String(date.getDate()).padStart(2, '0'); // 01-31
        const hours = String(date.getHours()).padStart(2, '0'); // 00-23
        const minutes = String(date.getMinutes()).padStart(2, '0'); // 00-59

        return `${year}.${month}.${day} ${hours}:${minutes}`;
    };

    const totalPages = Math.ceil(sendList.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        if (!localStorage.getItem('empCode')) {
            alert("로그인하세요")
            navigate("/"); // 로그인하지 않으면 홈페이지로 이동
        }
    }, [])


    useEffect(() => {
        if (isLoggedIn && empCode) {
            const fetchData = async () => {
                try {
                    const response = await axios.get(`/selectEmpCode?empCode=${empCode}`); // 공백 제거
                    console.log(response.data);
                    setSelectedCheckboxes(new Array(response.data.length).fill(false));
                    //서버로받은길이를 가져와서 생성된배열의 모든요소를 false로 채우는것.
                    const mailEmpCode = response.data.split("-").join("") + '@damail.com';
                    setMailEmpCode(mailEmpCode)
                    console.log(mailEmpCode)

                    //메일가져오기
                    const response2 = await axios.get('/attachmentMailList', {
                        params: {
                            mailRef: mailEmpCode, mailTarget: mailEmpCode // 필요한 파라미터
                        }
                    });

                    console.log(response2)
                    setSendList(response2.data)

                } catch (error) {
                    console.error(error.response ? error.response.data : error.message);
                }
            }
            fetchData();
        }
        setPrevLogin(isLoggedIn);
    }, [isLoggedIn, empCode]); // isLoggedIn과 empCode 변경 시에만 실행


    const handleSelectAll = (e) => {
        const checked = e.target.checked;
        setSelectAll(checked);
        setSelectedCheckboxes(new Array(sendList.length).fill(checked)); // 모든 체크박스 상태 업데이트
    };

    const handleCheckboxChange = (index) => {
        const updatedCheckboxes = [...selectedCheckboxes];
        updatedCheckboxes[index] = !updatedCheckboxes[index];
        setSelectedCheckboxes(updatedCheckboxes);
        setSelectAll(updatedCheckboxes.every(Boolean)); // 모든 체크박스가 선택되었는지 확인
    };
    //새로운 체크박스를 기존배열의길이를 복사하고 체크박스의 상태를 반전시킴


    const goSendMail = (e) => {
        navigate("/MailSend");
        window.location.reload();
    }

    const goSendMailList = (e) => {
        navigate("/MailSendList");
        window.location.reload();
    }

    const refresh = (e) => {
        navigate("/AttachMentMailList");
        window.location.reload();
    }

    const goMailTrashList = () => {
        navigate("/MailTrashList");
        window.location.reload();
    }


    const deleteSelectedMails = async () => {
        const mailNumsToDelete = sendList
            .filter((_, index) => selectedCheckboxes[index]) // 선택된 메일의 인덱스를 가져옴
            .map(v => v.mailNum); // 선택된 메일의 mailNum 배열 생성

        if (mailNumsToDelete.length === 0) {
            alert("삭제할 메일을 선택하세요.");
            return;
        }

        console.log("메일 삭제 요청할 ID:", mailNumsToDelete);

        try {
            await axios.put('/updateMail', mailNumsToDelete);
            // 삭제 성공 후, UI를 업데이트
            setSendList(sendList.filter((_, index) => !selectedCheckboxes[index]));
            setSelectedCheckboxes(new Array(sendList.length).fill(false)); // 체크박스 초기화
            setSelectAll(false); // 전체 선택 체크 해제
        } catch (error) {
            console.error(error);
            alert("메일 삭제 중 오류가 발생했습니다.");
        }
    };


    const mailOnChangeHandler = (e) => {
        setSearchList(e.target.value)
    }

    const mailSearch = () => {
        // 클릭 시 question 입력받은 거 조회하는 기능
        const filterMail = sendList.filter(item =>
            item.title.includes(searchList) || item.content.includes(searchList)
        );
        setSerachResult(filterMail);
    };

    const gogoDetail = (v) => {
        navigate("/MailDetail", {state: v});

    }

    const goToMeMailSend = () => {
        navigate("/ToMeMailSend");
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
            setSendList([]);
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
        <div className="overflow-hidden flex flex-col min-h-screen w-full  mx-auto p-4  rounded-lg ">
            <header className="flex justify-end items-center border-b shadow-md h-[6%] bg-white">
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
            <div className="flex flex-col md:flex-row gap-6">

                <div className="w-64 bg-white p-6 shadow-md flex flex-col justify-center items-center"
                     style={{height: "900px"}}>
                    <div className="flex" style={{marginTop: "-350px", marginBottom: "30px"}}>
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
                </div>

                {/* Main content */}
                <main className="flex-1" style={{marginTop: "20px"}}>
                    <h1 className="text-xl font-bold mb-4 text-left">첨부파일메일함</h1>
                    <div className="flex items-center mb-6 justify-end"
                         style={{marginRight: "10px", justifyContent: "flex-end"}}>
                        <Input
                            style={{width: "500px"}}
                            className="flex-grow mr-2"
                            placeholder="메일 검색"
                            onChange={mailOnChangeHandler}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    mailSearch();
                                }
                            }}

                        />
                        <button onClick={mailSearch} variant="outline">
                            <SearchIcon/>
                        </button>
                    </div>
                    <div className="flex" style={{marginBottom: "20px"}}>
                        <input type="checkbox" checked={selectAll}
                               onChange={handleSelectAll}
                        />
                        {/*<p style={{marginLeft:"10px"}}>전체선택</p>*/}
                        <button onClick={deleteSelectedMails} className="flex items-center flex"
                                style={{marginLeft: "30px"}}>삭제
                        </button>
                        <button onClick={refresh} className="flex items-center flex"
                                style={{marginLeft: "30px"}}>새로고침<RefreshCw
                            className="h-4 w-4"/></button>
                    </div>
                    <div style={{marginBottom: "20px"}}>
                        {(searchList ? serachResult : currentMails).map((v, i) => (
                            <div className="flex" key={i} style={{marginBottom: "10px", alignItems: "center"}}>
                                <input type="checkbox" checked={selectedCheckboxes[i] || false}
                                       onChange={() => handleCheckboxChange(i)}/>
                                <button onClick={deleteSelectedMails} style={{marginLeft: "40px"}}>
                                    <Trash className="mr-2 h-4 w-4"/>
                                </button>
                                <div className="flex"
                                     style={{marginLeft: "20px", width: "100%", justifyContent: "space-between"}}>
                                    <p style={{
                                        width: "30%", textAlign: "left", overflow: "hidden",
                                        whiteSpace: "nowrap", textOverflow: "ellipsis"
                                    }}>{v.empCode}</p>
                                    <div className="flex items-center" style={{
                                        width: "30%",
                                        textAlign: "left",
                                        minWidth: "150px"
                                    }}> {/* minWidth 추가 */}
                                        {v.fileName && (  // 파일이 있을 경우에만 아이콘 표시
                                            <Paperclip className="h-4 w-4 text-gray-500 mr-1" title="파일 첨부됨"/>
                                        )}
                                        <p onClick={() => gogoDetail(v)} className="cursor-pointer"
                                           style={{marginLeft: v.fileName ? '0' : '1.25rem'}}> {/* 여백 조정 */}
                                            {v.title}
                                        </p>
                                    </div>
                                    <p style={{width: "30%", textAlign: "right"}}>{formatDate(v.startDate)}</p>
                                </div>
                            </div>
                        ))}


                    </div>
                    <div className="flex justify-center mt-4">
                        {Array.from({length: totalPages}, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => handlePageChange(i + 1)}
                                className={`mx-1 px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </main>
            </div>

            {/* Slide-out panel with toggle button */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Panel toggle button */}
                <button
                    onClick={togglePanel}
                    className="absolute top-1/2 -left-6 transform -translate-y-1/2 bg-blue-500 text-white w-6 h-12 flex items-center justify-center rounded-l-md hover:bg-blue-600"
                >
                    {isPanelOpen ? '>' : '<'}
                </button>

                <div className="p-4">
                    {isLoggedIn ? <button onClick={handleLogout}>로그아웃</button>
                        : (<><h2 className="text-xl font-bold mb-4">로그인</h2>
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
                    <div className="text-sm text-center mb-4">
                        <a href="#" className="text-blue-600 hover:underline">공지사항</a>
                        <span className="mx-1">|</span>
                        <a href="#" className="text-blue-600 hover:underline">문의사항</a>
                    </div>
                    <h2 className="text-xl font-bold mb-2">메신저</h2>
                    <p>메신저 기능은 준비 중입니다.</p>
                </div>
            </div>

        </div>
    );
}

