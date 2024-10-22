import React, {useEffect, useState} from 'react';
import {ChevronDown, ChevronRight, Paperclip, Search, Mail ,Archive ,Send,FileText,Trash, RefreshCw} from 'lucide-react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import DeletePopup from './DeletePopup';

const Input = ({className, ...props}) => {
    return <input className={`border rounded px-3 py-2 ${className}`} {...props} />;
};

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.35-4.35" />
    </svg>
);


export default function EmailSend() {
    const [empCode,setEmpCode] = useState("")
    const navigate = useNavigate();
    const [sendList,setSendList] = useState([])
    const[searchList,setSearchList]=useState("")
    const [serachResult,setSerachResult] = useState([])
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage  = 20;
    const indexOfLastMail = currentPage * itemsPerPage;
    const indexOfFirstMail = indexOfLastMail - itemsPerPage;
    const currentMails = sendList.slice(indexOfFirstMail, indexOfLastMail);

    const [isPopupOpen, setIsPopupOpen] = useState(false);

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
                    setSelectedCheckboxes(new Array(response.data.length).fill(false));
                    //서버로받은길이를 가져와서 생성된배열의 모든요소를 false로 채우는것.

                } catch (error) {
                    console.error(error.response ? error.response.data : error.message);
                }
            }
        }
        fetchData();
    }, [empCode]);

    useEffect(() => {
        const mailList = async()=>{
            //  여기 가 수정되어야함
            const response = await axios.get('/selectDeleteList', {
                params: {
                    empCode: empCode // 필요한 파라미터
                }
            });

            console.log(response)
            setSendList(response.data)
        }
        if (empCode) { // empCode가 있을 때만 호출
            mailList();
        }
    }, [empCode]);

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


    const goSendMail=(e)=>{
        navigate("/MailSend");
        window.location.reload();
    }

    const goSendMailList=(e)=>{
        navigate("/MailSendList");
        window.location.reload();
    }

    const refresh =(e)=>{
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
            await axios.delete('/deleteMail', { data: mailNumsToDelete});
            // 삭제 성공 후, UI를 업데이트
            setSendList(sendList.filter((_, index) => !selectedCheckboxes[index]));
            setSelectedCheckboxes(new Array(sendList.length).fill(false)); // 체크박스 초기화
            setSelectAll(false); // 전체 선택 체크 해제
        } catch (error) {
            console.error(error);
            alert("메일 삭제 중 오류가 발생했습니다.");
        }
    };


    const mailOnChangeHandler=(e)=>{
        setSearchList(e.target.value)
    }

    const mailSearch = () => {
        // 클릭 시 question 입력받은 거 조회하는 기능
        const filterMail = sendList.filter(item =>
            item.title.includes(searchList) || item.content.includes(searchList)
        );
        setSerachResult(filterMail);
    };

    const gogoDetail =(v)=>{
        navigate("/MailDetail",{state: v});

    }

    const goToMeMailSend =()=>{
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

    return (
        <div className="container mx-auto p-4">
            <header className="text-2xl font-bold text-center p-4 bg-gray-200 mb-6">로고</header>
            <div className="flex flex-col md:flex-row gap-6">

                <div className="w-64 bg-white p-6 shadow-md flex flex-col justify-center items-center"
                     style={{height: "900px"}}>
                    <div className="flex" style={{marginTop: "-350px", marginBottom: "30px"}}>
                        <button onClick={goSendMail} className="border rounded-md px-4 py-2">메일쓰기</button>
                        <button onClick={goToMeMailSend} className="border rounded-md px-4 py-2" style={{marginLeft: "10px"}}>내게쓰기</button>
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
                        보낸메일함 </button>

                    <div className="flex">
                    <button onClick={goMailTrashList} className="w-full flex items-center text-lg"
                            style={{marginBottom: "30px"}}>
                        <Trash className="mr-2 h-4 w-4"/>휴지통
                    </button>
                    <button onClick={goRealDelete} style={{width:"80px" , height:"30px"}}  className="text-xs border rounded-md px-2 py-2">비우기</button>
                    </div>
                    {/*<Settings className="h-4 w-4" />*/}
                    <DeletePopup
                        isOpen={isPopupOpen}
                        onClose={() => setIsPopupOpen(false)}
                        // onConfirm={handleConfirmDelete}
                    />
                </div>

                {/* Main content */}
                <main className="flex-1">
                    <h1 className="text-xl font-bold mb-4 text-left">휴지통</h1>
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
                            <div className="flex" key={i} style={{ marginBottom: "10px", alignItems: "center" }}>
                                <input type="checkbox" checked={selectedCheckboxes[i] || false} onChange={() => handleCheckboxChange(i)} />
                                <button onClick={deleteSelectedMails} style={{ marginLeft: "40px" }}>
                                    <Trash className="mr-2 h-4 w-4" />
                                </button>
                                <div className="flex" style={{ marginLeft: "20px", width: "100%", justifyContent: "space-between" }}>
                                    <p style={{
                                        width: "30%", textAlign: "left", overflow: "hidden",
                                        whiteSpace: "nowrap", textOverflow: "ellipsis"
                                    }}>{v.mailTarget}</p>
                                    <div className="flex items-center" style={{ width: "30%", textAlign: "left", minWidth: "150px" }}> {/* minWidth 추가 */}
                                        {v.fileName && (  // 파일이 있을 경우에만 아이콘 표시
                                            <Paperclip className="h-4 w-4 text-gray-500 mr-1" title="파일 첨부됨" />
                                        )}
                                        <p onClick={() => gogoDetail(v)} className="cursor-pointer" style={{ marginLeft: v.fileName ? '0' : '1.25rem' }}> {/* 여백 조정 */}
                                            {v.title}
                                        </p>
                                    </div>
                                    <p style={{ width: "30%", textAlign: "right" }}>{formatDate(v.startDate)}</p>
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
        </div>
    );
}

