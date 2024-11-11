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
import MailTarget from "./MailTarget";

const Input = ({className, ...props}) => {
    return <input className={`border rounded px-3 py-2 ${className}`} {...props} />;
};

export default function EmailSend() {

    // 로그인
    const {isLoggedIn, empCode, logout} = useAuth();
    const [prevLogin, setPrevLogin] = useState(undefined);   // 이전 로그인 상태를 추적할 변수

    const [errors, setErrors] = useState({});
    const [attachment, setAttachment] = useState(null);
    const navigate = useNavigate();
    const [showConfirmation, setShowConfirmation] = useState(false);

    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isTargetOpen, setIsTargetOpen] = useState(false);

    const [mailTargetList, setMailTargetList] = useState([]);

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
        setPrevLogin(isLoggedIn);

    }, [isLoggedIn, empCode]); // isLoggedIn과 empCode 변경 시에만 실행

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

        if (!formedMailTarget || formedMailTarget.length === 0) {
            alert("받을사람을 선택해주세요");
            return;
        }

        const dataToSubmit = new FormData();
        dataToSubmit.append('empCode', empCode);
        // dataToSubmit.append('mailTarget', formData.to);
        dataToSubmit.append('mailTarget', formedMailTarget);
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
            alert("삭제완료")
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

    const openAddressBook = (e) => {
        e.preventDefault();
        setIsTargetOpen(true)
    }

    const selectMailTargetList = (selectedItems) => {
        setMailTargetList(selectedItems);
        setIsTargetOpen(false)
        console.log("뭐징", selectedItems)
    }

    const formedMailTarget = mailTargetList?.map(empCode => {
        const email = empCode.replace("-", "") + '@damail.com';
        return email;
    }) || [];

    return (
        // <div className="container mx-auto p-4">
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
                <div className="flex flex-1 items-center " style={{marginLeft: "200px"}}>
                    <form onSubmit={handleSubmit} className="space-y-4" style={{justifyContent: 'center'}}>
                        {!showConfirmation && (
                            <div>
                                <div style={{display: showConfirmation ? "none" : "block"}}>
                                    <h1 className="text-xl font-bold mb-4 text-left">메일쓰기</h1>
                                </div>
                                {/*받는사람*/}
                                <div className="flex space-x-8" style={{marginTop: '20px', marginBottom: "20px"}}>
                                    <label htmlFor="to"
                                           className="block font-medium text-gray-700 mb-1">받는사람</label>
                                    <Input onChange={handleChange} id="to" name="to"
                                           placeholder="받는사람을 입력해주세요."
                                           value={formedMailTarget}
                                           style={{height: '40px', width: '800px'}}/>

                                    {/*주소록*/}
                                    <button onClick={openAddressBook} className="border">주소록</button>
                                </div>


                                {/*참조*/}
                                <div className="flex space-x-8" style={{marginBottom: "20px"}}>
                                    <label htmlFor="cc"
                                           className="block font-medium text-gray-700 mb-1">참조</label>
                                    <Input onChange={handleChange} id="cc" name="cc" value={formData.cc}
                                           placeholder="참조를 입력해주세요."
                                           style={{height: '40px', width: '800px', marginLeft: '63px'}}/>
                                </div>

                                {/*제목*/}
                                <div className="flex space-x-8" style={{marginBottom: "20px"}}>
                                    <label htmlFor="title"
                                           className="block font-medium text-gray-700 mb-1">제목</label>
                                    <Input onChange={handleChange} id="title" name="title" value={formData.title}
                                           placeholder="제목을 입력해주세요."
                                           style={{height: '40px', width: '800px', marginLeft: '63px'}}/>
                                </div>

                                {/*파일첨부*/}
                                <div className="flex space-x-8" style={{marginBottom: "20px"}}>
                                    <label htmlFor="file"
                                           className="block font-medium text-gray-700 mb-1">파일첨부</label>
                                    <Input onChange={handleChange} id="file" type="file" name="file"
                                           style={{height: '50px', width: '800px'}}/>
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
                        )}
                        {showConfirmation && (
                            <main style={{marginLeft: "-150PX"}}>
                                <h1 style={{marginBottom: "50px", marginTop: "-370px"}}
                                    className="text-xl font-bold text-left">메일을 보냈습니다.</h1>
                                <div style={{marginBottom: "80px"}}>
                                    <p style={{marginBottom: "20px"}}
                                       className="text-left">{formData.title ? `제목: ${formData.title}` : '제목 : 제목없음'}</p>
                                    <p className="text-left">받는사람: {formedMailTarget}</p>
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
                    {isTargetOpen && <MailTarget onClose={selectMailTargetList} empCode={empCode}/>}
                </div>

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
