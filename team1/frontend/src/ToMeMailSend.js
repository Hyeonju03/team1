import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, Paperclip, Search, Mail, Archive, Send, FileText, Trash, Settings } from 'lucide-react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeletePopup from './DeletePopup';

const Input = ({ className, ...props }) => {
    return <input className={`border rounded px-3 py-2 ${className}`} {...props} />;
};

export default function EmailSend() {
    const [empCode, setEmpCode] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [errors, setErrors] = useState({});
    const [attachment, setAttachment] = useState(null);
    const navigate = useNavigate();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [mailEmpCode,setMailEmpCode] = useState("")

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

    // 로그인 시 empCode를 가져오는 코드
    useEffect(() => {
        const fetchEmpCode = async () => {
            const loggedInEmpCode = "3148200040-abcmart147"; // 로그인 후 받아온 empCode
            const  mailEmpCode = loggedInEmpCode.split("-").join("")+'@damail.com';
            console.log("->" , mailEmpCode)
            // ->2048209555dffdsfd@damail.com
            setMailEmpCode(mailEmpCode)
            setEmpCode(loggedInEmpCode);
        };
        fetchEmpCode();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (empCode) {
                try {
                    const response = await axios.get(`/selectEmpCode?empCode=${empCode}`);
                    console.log(response.data);
                } catch (error) {
                    console.error(error.response ? error.response.data : error.message);
                }
            }
        }
        fetchData();
    }, [empCode]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

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
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        setErrors(prev => ({ ...prev, [name]: '' }));
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

    const goToMeMailSend =(e)=>{
        console.log("클릭됨")
        navigate("/ToMeMailSend");
        window.location.reload();
    }

    const goMailTrashList =()=>{
        navigate("/MailTrashList");
        window.location.reload();
    }

    const goRealDelete =(e)=>{
        console.log("진짜?")
        setIsPopupOpen(true)
    }

    const goToMeMailSendList =()=>{
        //내게
        navigate("/ToMeMailSendList");
        window.location.reload();
    }

    const goAttachMentMailList =()=>{
        //첨부
        navigate("/AttachMentMailList");
        window.location.reload();
    }

    const goToTalMailSendList =()=>{
        //전부
        navigate("/ToTalMailSendList");
        window.location.reload();
    }

    const goReceivedMailList =()=>{
        //받은
        navigate("/ReceivedMailList");
        window.location.reload();
    }

    const handleConfirmDelete = async ()=>{
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


    return (
        <div className="container mx-auto p-4">
            <header className="text-2xl font-bold text-center p-4 bg-gray-200 mb-6">로고</header>
            <div className="flex md:flex-row gap-6">

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
                <div className="flex flex-1 items-center justify-center">
                    <form onSubmit={handleSubmit} className="space-y-4" style={{justifyContent: 'center'}}>
                        {!showConfirmation && (
                            <div>
                                <div style={{display: showConfirmation ? "none" : "block"}}>
                                    <h1 className="text-xl font-bold mb-10 text-left">내게쓰기</h1>
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
                                    <p className="text-left">받는사람: {mailEmpCode}</p>
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
        </div>
    );
}
