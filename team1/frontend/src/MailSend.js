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
import {useNavigate} from "react-router-dom";
import DeletePopup from './DeletePopup';
import {useAuth} from "./noticeAuth";
import Clock from "react-live-clock";

const Input = ({className, ...props}) => {
    return <input className={`rounded px-3 py-2 ${className}`} {...props} />;
};

export default function EmailSend() {

    // 로그인
    const {isLoggedIn, empCode, logout} = useAuth();
    const [userInfo, setUserInfo] = useState([])
    const [btnCtl, setBtnCtl] = useState(0)
    const [isRClick, setIsRClick] = useState(false)
    const [newWindowPosY, setNewWindowPosY] = useState(500)

    const [errors, setErrors] = useState({});
    const [attachment, setAttachment] = useState(null);
    const navigate = useNavigate();
    const [showConfirmation, setShowConfirmation] = useState(false);

    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

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

    //로그아웃이 맨위로
    useEffect(() => {
        if (!localStorage.getItem('empCode')) {
            alert("로그인하세요")
            navigate("/"); // 로그인하지 않으면 홈페이지로 이동
        }else {
            empInfo();
        }
    }, [])


    useEffect(() => {
        const fetchData = async () => {
            if (isLoggedIn) {
                try {
                    const response = await axios.get(`/selectEmpCode?empCode=${empCode}`);
                    console.log(response.data);
                } catch (error) {
                    console.error(error.response ? error.response.data : error.message);
                }
            }
        }
        fetchData();

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
        dataToSubmit.append('mailTarget', formData.to);
        dataToSubmit.append('mailRef', formData.cc);
        dataToSubmit.append('title', formData.title);
        dataToSubmit.append('content', formData.content);
        dataToSubmit.append('fileName', formData.fileName);

        if (formData.file) {
            dataToSubmit.append('fileOriginalName', formData.file.name);
            dataToSubmit.append('fileSize', formData.fileSize);
            dataToSubmit.append('filePath', '');
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
        console.log("클릭")
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
                    <form onSubmit={handleSubmit} className="space-y-4 flex items-center mb-7">
                        {!showConfirmation && (
                            <div>
                                <div style={{display: showConfirmation ? "none" : "block"}}>
                                    <div className="text-2xl w-full font-bold mb-4 text-left">메일쓰기</div>
                                </div>
                                {/*받는사람*/}
                                <div className="flex space-x-8" style={{marginTop: '20px', marginBottom: "20px"}}>
                                    <label htmlFor="to"
                                           className="block font-bold mb-1">받는사람</label>
                                    <Input onChange={handleChange} id="to" name="to" value={formData.to}
                                           placeholder="받는사람을 입력해주세요."
                                           className="h-10 w-[800px] border-b-2 hover:border-blue-400"/>
                                    <button className="bg-gray-100 hover:bg-gray-200 border-2 border-gray-600 rounded w-20 h-10">주소록</button>
                                </div>

                                {/*참조*/}
                                <div className="flex space-x-8" style={{marginBottom: "20px"}}>
                                    <label htmlFor="cc"
                                           className="block font-bold mb-1 mr-8">참조</label>
                                    <Input onChange={handleChange} id="cc" name="cc" value={formData.cc}
                                           placeholder="참조를 입력해주세요."
                                           className="h-10 w-[800px] border-b-2 hover:border-blue-400"/>
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
                                           className="block font-bold mb-1">내용</label>
                                    <Input onChange={handleChange} id="content" name="content" value={formData.content}
                                           placeholder="내용을 입력해주세요."
                                           style={{height: '500px', width: '800px ', marginLeft: '63px'}}/>
                                </div>

                                <div className="flex justify-center space-x-4 text-center" style={{marginLeft: '50px'}}>
                                    <button type={"submit"} className="border rounded-md px-4 py-2">보내기</button>
                                </div>
                            </div>
                        )}
                        {showConfirmation && (
                            <main style={{marginLeft: "-150PX"}}>
                                <h1 style={{marginBottom: "50px", marginTop: "-370px"}}
                                    className="text-xl font-bold text-left">메일을 보냈습니다.</h1>
                                <div style={{marginBottom: "80px"}}>
                                    <p style={{marginBottom: "20px"}}
                                       className="text-left">{formData.title ? `제목: ${formData.title}` : '제목 : 제목없음'}</p>
                                    <p className="text-left">받는사람: {formData.to}</p>
                                    <p className="text-left">{formData.cc ? `참조: ${formData.cc}` : null}</p>
                                </div>
                                <div>
                                    <button onClick={goSendMailList} className="border rounded-md px-4 py-2">확인</button>
                                    <button onClick={backSend} className="border rounded-md px-4 py-2"
                                            style={{marginLeft: "30px"}}>쓰던 페이지 가기
                                    </button>
                                </div>
                            </main>
                        )}
                    </form>
                </div>

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
                    className="fixed mt-14 top-0 right-16 transform -translate-x-3 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-gray-300"></div>
            </div>
        </div>
    );
}
