import React, {useEffect, useState} from 'react';
import {ChevronDown, ChevronRight, Paperclip, Search, Mail ,Archive ,Send,FileText,Trash,Settings,Download} from 'lucide-react';
import axios from "axios";
import {useLocation, useNavigate} from "react-router-dom";

const Input = ({className, ...props}) => {
    return <input className={`border rounded px-3 py-2 ${className}`} {...props} />;
};

export default function EmailSend() {
    const [empCode,setEmpCode] = useState("")
    const location = useLocation();
    const [mailDetailList,setMailDetailList] = useState(location.state)
    const navigate = useNavigate();
    console.log(mailDetailList)


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

    // useEffect(() => {
    //     const fetchData = async ()=> {
    //         console.log("파일")
    //             try {
    //                 console.log("파일222");
    //                 console.log(mailDetailList.mailNum);
    //                 const result = await axios.get(`/download/${mailDetailList.mailNum}`); // 공백 제거
    //                 console.log("파일333333")
    //                 console.log(result);
    //
    //
    //             } catch (error) {
    //                 console.error(error.response ? error.response.data : error.message);
    //             }
    //         }
    //     fetchData();
    // }, [mailDetailList]);

    //날짜변환
    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const year = String(date.getFullYear()).slice(2); // 마지막 두 자리 연도
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 01-12
        const day = String(date.getDate()).padStart(2, '0'); // 01-31
        const hours = String(date.getHours()).padStart(2, '0'); // 00-23
        const minutes = String(date.getMinutes()).padStart(2, '0'); // 00-59

        // 요일 배열
        const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
        const weekday = weekdays[date.getDay()]; // 요일 가져오기

        return `${year}.${month}.${day} (${weekday}) ${hours}:${minutes}`;
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

                    <button className="w-full flex items-center text-lg"
                            style={{marginBottom: "30px", marginLeft: "50px"}}>
                        <Mail className="mr-2 h-4 w-4"/>전체메일함
                    </button>

                    <button className="w-full flex items-center text-lg"
                            style={{marginBottom: "30px", marginLeft: "50px"}}>
                        <Mail className="mr-2 h-4 w-4"/>받은메일함
                    </button>

                    <button className="w-full flex items-center text-lg"
                            style={{marginBottom: "30px", marginLeft: "50px"}}>
                        <Archive className="mr-2 h-4 w-4"/>첨부파일메일함
                    </button>

                    <button className="w-full flex items-center text-lg"
                            style={{marginBottom: "30px", marginLeft: "50px"}}>
                        <FileText className="mr-2 h-4 w-4"/>내게쓴메일함
                    </button>

                    <button onClick={goSendMailList} className="w-full flex items-center text-lg"
                            style={{marginBottom: "30px", marginLeft: "50px"}}>
                        <Send className="mr-2 h-4 w-4"/>
                        보낸메일함 <button className="border rounded-md px-2 py-2 text-xs"
                                      style={{marginLeft: "10px"}}>수신확인</button></button>

                    <button className="w-full flex items-center text-lg"
                            style={{marginBottom: "30px", marginLeft: "50px"}}>
                        <Trash className="mr-2 h-4 w-4"/>휴지통
                    </button>

                    {/*<Settings className="h-4 w-4" />*/}
                </div>

                {/* Main content */}
                <main className="flex-grow flex items-center justify-center flex-col" style={{marginTop:"-50px"}}>
                    <div className="mb-4 text-left">
                        <h1 className="text-2xl font-bold" style={{marginLeft:"-400px"}}>
                            {mailDetailList.title}
                        </h1>
                    </div>

                    <div className="text-left">
                        <p>보낸사람 : {empCode}</p>
                        <p>받는사람 : {mailDetailList.mailTarget}</p>
                        <div className="flex" style={{marginBottom: "30px"}}>
                        <p >보낸일자 : {formatDate(mailDetailList.startDate)}</p>
                        <button style={{marginLeft:"380px"}} className="border rounded-md px-4 py-2">삭제</button>
                        <button style={{marginLeft:"10px"}} className="border rounded-md px-4 py-2">목록</button>
                        <button style={{marginLeft:"10px"}} className="border rounded-md px-4 py-2">답장</button>
                        </div>
                        <hr className="border-gray-300 my-2 w-full" style={{width: "auto"}}/>
                        <p style={{marginBottom: "30px", display: 'flex', alignItems: 'center'}}>
                            {mailDetailList.fileName ? (
                                <>
                                    <a
                                        className="flex"
                                        style={{
                                            color: 'blue',
                                            textDecoration: 'underline',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                        href={`http://localhost:8080/download/${mailDetailList.mailNum}`}
                                    >
                                        <Download className="h-4 w-4 text-gray-500" title="파일 다운로드"
                                                  style={{marginRight: '10px'}}/>
                                        {mailDetailList.fileName}
                                    </a>
                                </>
                            ) : (
                                <span style={{color: 'gray'}}>파일이 없습니다.</span>
                            )}
                        </p>

                        <p style={{height: '500px', width: '800px', border: '1px solid #ccc', padding: '10px'}}>
                            {mailDetailList.content}
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}

