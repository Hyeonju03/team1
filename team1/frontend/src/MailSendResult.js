import React, {useEffect, useState} from 'react';
import {ChevronDown, ChevronRight, Paperclip, Search, Mail ,Archive ,Send,FileText,Trash,Settings} from 'lucide-react';
import axios from "axios";
import {useLocation, useNavigate} from "react-router-dom";

const Input = ({className, ...props}) => {
    return <input className={`border rounded px-3 py-2 ${className}`} {...props} />;
};

export default function EmailSend() {
    const location = useLocation();
    const {title, to, cc} = location.state || {};
    const [empCode,setEmpCode] = useState("")
    const [isExpanded, setIsExpanded] = useState(false);
    const [errors, setErrors] = useState({});
    const [attachment, setAttachment] = useState(null);
    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        to: '',
        cc:null,
        title: '',
        file:null,
        content: '',
        fileName: '',
        fileSize: '',
        attachment: null,
    });

    //로그인시 empcode를 일단 가져오는코드
    useEffect(() => {
        // 로그인 후 empCode를 설정하는 로직
        const fetchEmpCode = async () => {
            // 여기에서 실제 empCode를 설정
            const loggedInEmpCode = "2048209555-dffdsfd"; // 로그인 후 받아온 empCode
            setEmpCode(loggedInEmpCode);
        };
        fetchEmpCode();
    }, []);


    useEffect(() => {
        const fetchData = async ()=> {
            if (empCode) { // empCode가 설정된 경우에만 호출
                try {
                    const response = await axios.get(`/selectEmpCode?empCode=${empCode}`); // 공백 제거
                    console.log(response.data);


                } catch (error) {
                    console.error(error.response ? error.response.data : error.message);
                }
            }
        }
        fetchData();
    }, [empCode]);

    const handleChange = (e)=>{
        const { name, value, type, files } = e.target;


        if (type === 'file') {
            const file = files[0];
            console.log(file.name);

            setAttachment(file);
            setFormData(prev => ({
                ...prev,
                [name]: file,
                fileName: file.name,
                fileSize: file.size,
            }));
        } else {
            // 일반 입력인 경우
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        setErrors(prev => ({ ...prev, [name]: '' })); // Clear error when user types
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(formData);

        const dataToSubmit = new FormData();
        dataToSubmit.append('empCode', empCode); // empCode 추가
        dataToSubmit.append('mailTarget', formData.to); // 받는 사람
        dataToSubmit.append('mailRef', formData.cc); // 참조
        dataToSubmit.append('title', formData.title); // 제목
        dataToSubmit.append('content', formData.content); // 내용
        dataToSubmit.append('fileName', formData.fileName); // 파일 이름

        // 파일이 선택된 경우에만 추가
        if (formData.file) {
            console.log("파일추가")
            console.log(attachment);
            dataToSubmit.append('fileOriginalName', formData.file.name); // 원본 파일 이름
            dataToSubmit.append('fileSize', formData.fileSize); // 파일 크기
            dataToSubmit.append('filePath', '...'); // 파일 경로
            dataToSubmit.append('file', formData.file); // 파일 데이터 추가
            dataToSubmit.append('attachment', attachment);
        } else {
            // 파일이 선택되지 않았을 경우에 대한 처리
            console.error('파일이 선택되지 않았습니다.');
            console.log(formData.file)
        }


        console.log(dataToSubmit);

        try {
            const response = await axios.post('/mailSend', dataToSubmit);
            alert("메일보내기 성공")

        } catch (error) {
            console.error('Error uploading data:', error);
            alert("실패")

        }
    };

    const goSendMail=(e)=>{
        navigate("/MailSend");
        window.location.reload();
    }

    const goSendMailList=(e)=>{
        navigate("/MailSendList");
        window.location.reload();
    }

    return (
        <div className="container mx-auto p-4">
            <header className="text-2xl font-bold text-center p-4 bg-gray-200 mb-6">로고</header>
            <div className="flex flex-col md:flex-row gap-6">

                <div className="w-64 bg-white p-6 shadow-md flex flex-col justify-center items-center"
                     style={{height: "900px"}}>
                    <div className="flex" style={{marginTop: "-350px", marginBottom: "30px"}}>
                        <button onClick={goSendMail} className="border rounded-md px-4 py-2">메일쓰기</button>
                        <button className="border rounded-md px-4 py-2" style={{marginLeft: "10px"}}>내게쓰기</button>
                    </div>

                    <button className="w-full flex items-center text-lg" style={{marginBottom: "30px" , marginLeft:"50px"}}>
                        <Mail className="mr-2 h-4 w-4"/>전체메일함</button>

                    <button className="w-full flex items-center text-lg" style={{marginBottom: "30px" , marginLeft:"50px"}}>
                        <Mail className="mr-2 h-4 w-4"/>받은메일함</button>

                    <button className="w-full flex items-center text-lg" style={{marginBottom: "30px", marginLeft:"50px"}}>
                        <Archive className="mr-2 h-4 w-4" />첨부파일메일함</button>

                    <button className="w-full flex items-center text-lg" style={{marginBottom: "30px", marginLeft:"50px"}}>
                        <FileText className="mr-2 h-4 w-4" />내게쓴메일함</button>

                    <button onClick={goSendMailList} className="w-full flex items-center text-lg"
                            style={{marginBottom: "30px", marginLeft: "50px"}}>
                        <Send className="mr-2 h-4 w-4"/>
                        보낸메일함 <button className="border rounded-md px-2 py-2 text-xs" style={{marginLeft:"10px"}}>수신확인</button></button>

                    <button className="w-full flex items-center text-lg" style={{marginBottom: "30px", marginLeft:"50px"}}>
                        <Trash className="mr-2 h-4 w-4" />휴지통</button>

                    {/*<Settings className="h-4 w-4" />*/}
                </div>

                {/* Main content */}
                <main>
                <h1 style={{marginBottom:"50px" , marginTop:"70px"}} className="text-xl font-bold text-left">메일을 보냈습니다.</h1>
                <div style={{marginBottom:"80px"}} >
                <p style={{marginBottom:"20px"}} className="text-left">{title? `제목: ${title}` : '제목 : 제목없음'}</p>
                <p className="text-left">받는사람: {to}</p>
                <p className="text-left">{cc ? `참조: ${cc}` : null}</p>
                </div>
                    <div>
                        <button onClick={goSendMailList} className="border rounded-md px-4 py-2"  >확인</button>
                        <button className="border rounded-md px-4 py-2" style={{marginLeft:"30px"}}>쓰던 페이지 가기</button>
                    </div>
                </main>
            </div>
        </div>
    );
}

