import React, {useEffect, useState} from 'react';
import {ChevronDown, ChevronRight} from 'lucide-react';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import useComCode from "hooks/useComCode";
import {useAuth} from "./noticeAuth";
import Clock from "react-live-clock";

const Button = ({variant, className, children, ...props}) => {
    const baseClass = "px-4 py-2 rounded text-left";
    const variantClass = variant === "outline" ? "border border-gray-300" : "text-gray-700";
    return (
        <button className={`${baseClass} ${variantClass} ${className}`} {...props}>
            {children}
        </button>
    );
};

const Input = ({className, ...props}) => {
    return <input className={`border rounded px-3 py-2 ${className}`} {...props} />;
};

export default function DocumentDetail() {
    const [isExpanded, setIsExpanded] = useState(true);
    const {id} = useParams(); // 여기서 id는 docNum을 의미
    const [doc, setDoc] = useState(null);
    const [codeCategory, setCodeCategory] = useState([]); // 카테고리 상태 추가
    // const [codeCategory] = useComCode();
    const [loading, setLoading] = useState(true); // 상세 페이지 로딩 상태 추가
    const navigate = useNavigate();
    const [comCode, setComCode] = useState('');
    // const [empCode, setEmpCode] = useState(process.env.REACT_APP_EMP_CODE);
    const [auth, setAuth] = useState(null);
    // 로그인
    const {isLoggedIn, empCode, logout} = useAuth();
    const [userInfo, setUserInfo] = useState([])
    const [inputId, setInputId] = useState(""); // 사용자 ID 상태 추가
    const [inputPassword, setInputPassword] = useState("");
    // slide 변수
    const [isPanelOpen, setIsPanelOpen] = useState(false); // 화면 옆 슬라이드
    const [btnCtl, setBtnCtl] = useState(0)
    const [isRClick, setIsRClick] = useState(false)
    const [newWindowPosY, setNewWindowPosY] = useState(500)

    const today = new Date();
    const formattedDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`;

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    // empCode에서 comCode를 추출하는 함수
    const getComCode = (empCode) => {
        return empCode.split('-')[0]; // '3148127227-user001' -> '3148127227'
    };

    useEffect(() => {
        // empCode가 변경될 때마다 comCode를 업데이트
        if (empCode && isLoggedIn) {
            const newComCode = getComCode(empCode);
            fetchAuth();
            setComCode(newComCode);  // comCode 상태 업데이트
            empInfo();
        }
    }, [empCode, isLoggedIn]); // empCode가 변경될 때마다 실행

    useEffect(() => {
        if (isLoggedIn && comCode) {
            axios.get(`/code/${comCode}`)
                .then(response => {
                    setCodeCategory(response.data);
                })
        }
    }, [isLoggedIn, comCode]); //isLoggedIn과 comCode 변경 시에만 실행

    useEffect(() => {
        if (isLoggedIn) {
            async function documentDetail() {
                try {
                    const response = await axios.get(`/documents/${id}`) // 여기서 id는 docNum 값
                    setDoc(response.data);
                } catch (e) {
                    console.error(e);
                } finally {
                    setLoading(false); // 로딩이 끝남
                }
            }

            documentDetail();
        }
    }, [id, isLoggedIn, empCode]);

    const fetchAuth = async () => {
        try {
            // 권한 정보 가져오기
            const response = await axios.get(`/authority/document/${empCode}`);
            setAuth(response.data);
        } catch (error) {
            console.error('권한 정보를 가져오는 데 실패했습니다.', error);
        }
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

    useEffect(() => {
        const fetchAuth = async () => {
            try {
                // 권한 정보 가져오기
                const response = await axios.get(`/authority/document/${empCode}`);
                setAuth(response.data);
            } catch (error) {
                console.error('권한 정보를 가져오는 데 실패했습니다.', error);
            }
        };
        empInfo();
        fetchAuth();
    }, [comCode, empCode]);

    const empInfo = async () => {
        try{
            const response = await axios.get(`/emp/${empCode}`);
            setUserInfo(response.data);
        }catch (e){
            console.log(e)
        }
    }

    // 문서가 로딩 중일 때는 아무것도 표시하지 않음
    if (loading) {
        return null;
    }

    // 문서를 찾을 수 없는 경우의 처리
    if (!doc) {
        return null; // 문서가 없을 경우도 아무것도 표시하지 않음
    }

    const formatDate = (dateString) => {
        return dateString.replace("T", " ").slice(0, 16); // LocalDateTime의 기본 형식을 변경
    };

    const fileDownload = (blobData, fileName) => {
        const url = window.URL.createObjectURL(blobData);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.fileOriginName;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        a.remove();
    }

    const handleDocumentDownload = async (doc) => {
        try {
            const response = await axios({
                method: "get",
                url: `/documents/download/${doc.docNum}`,
                responseType: "blob"
            });
            fileDownload(response.data, doc.fileOriginName);
        } catch (e) {
            console.error(e);
        }
        // 2번째 방법
        // axios.get(`/documents/download/${document.docNum}`) // API 엔드포인트를 조정하세요
        //     .then(response => {
        //         console.log(response);
        //     })
        //     .catch(error => console.log(error));
    }

    // 수정
    const handleUpdateClick = () => {
        if (auth == '2' || auth == '4' || auth == '6' || auth == '7') {
            navigate(`/documents/update/${id}`);
        } else {
            alert("문서를 수정할 수 있는 권한이 없습니다.");
        }
    };

    // 삭제
    const handleDeleteClick = async () => {
        if (auth == '3' || auth == '5' || auth == '6' || auth == '7') {
            try {
                await axios.delete(`/documents/${id}`)
                navigate(`/documents/`); // 삭제 후 문서 리스트로 이동
                alert("성공적으로 삭제되었습니다.")

            } catch (e) {
                console.error(e);
                alert("삭제에 실패했습니다.");
            }
        } else {
            alert("문서를 삭제할 수 있는 권한이 없습니다.");
        }
    };

    // 목록 버튼 클릭 시 리스트 페이지로 이동
    const handleHome = () => {
        navigate(`/documents/`);
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

                        <div>
                            <Button
                                variant="ghost"
                                className="w-full flex items-center"
                                onClick={() => setIsExpanded(!isExpanded)}
                            >
                                {isExpanded ? <ChevronDown className="mr-2 h-4 w-4"/> :
                                    <ChevronRight className="mr-2 h-4 w-4"/>}
                                {/*<Mail className="mr-2 h-4 w-4"/>*/}
                                문서함
                            </Button>
                            {isExpanded && (
                                <div className="ml-8 space-y-2 pace-y-2 mt-2">
                                    {codeCategory && codeCategory.docCateCode && codeCategory.docCateCode.split(',').map((item, index) => (
                                            <Button variant="ghost" className="w-full" key={`${item}`}>
                                                {item}
                                            </Button>
                                        )
                                    )}
                                </div>
                            )}
                        </div>

                    </aside>
                </div>
                <main className="ml-64 mt-14 flex-1 p-4 w-full h-full sm:w-[80%] md:w-[70%] lg:w-[60%]">
                    <div className="flex justify-start space-x-2 mb-4">
                        <Button variant="outline" onClick={handleHome}>목록</Button>
                    </div>
                    <h1 className="text-2xl font-bold mb-4">문서 상세</h1>

                    <div className="border rounded-lg p-4">
                        <div className="flex items-center space-x-4 mb-4">

                            <div className="text-sm font-bold text-gray-600 text-left">{doc.docCateCode}</div>
                            <h2 className="text-2xl font-bold mb-4 text-left">{doc.title}</h2>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-semibold mb-2"></h3>
                            <p className="whitespace-pre-wrap text-left"><span
                                className="font-semibold">등록일 : </span>{formatDate(doc.startDate)}
                            </p>
                        </div>
                        <div className="mb-4">
                            <h3 className="font-semibold mb-2"></h3>
                            <p className="whitespace-pre-wrap text-left"><span
                                className="font-semibold">첨부파일명 : </span>
                                <span onClick={() => handleDocumentDownload(doc)}
                                      className={'cursor-pointer text-indigo-600 hover:text-indigo-500 hover:underline hover:underline-offset-1'}>{doc.fileOriginName}</span>
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2"></h3>
                            <p className="whitespace-pre-wrap text-left"><span
                                className="font-semibold">설명 : </span>{doc.content}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="outline" onClick={handleUpdateClick}>수정</Button>
                        <Button variant="outline" onClick={handleDeleteClick}>삭제</Button>
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
)
    ;
}