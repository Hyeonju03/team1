import React, {useState, useEffect} from "react"; // React 및 Hook 가져오기
import axios from "axios"; // axios 가져오기
import {useNavigate} from "react-router-dom"; // useNavigate 훅 가져오기
import {useAuth} from "./noticeAuth"; // 인증 훅 가져오기
import Clock from "react-live-clock"
import {ChevronDown, ChevronRight} from "lucide-react";

const UserNoticeList = () => {
    const [notices, setNotices] = useState([]); // 공지사항 목록 상태 초기화
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 초기화
    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수 상태 초기화
    const [error, setError] = useState(null); // 오류 상태 초기화
    const [inputId, setInputId] = useState(""); // 사용자 ID 상태 추가
    const [inputPassword, setInputPassword] = useState(""); // 비밀번호 입력
    const {login, empCode, logout, isLoggedIn} = useAuth(); // 인증 훅에서 가져오기
    const [btnCtl, setBtnCtl] = useState(0)
    const [isRClick, setIsRClick] = useState(false)
    const [newWindowPosY, setNewWindowPosY] = useState(500)
    const [userInfo, setUserInfo] = useState([])
    const [isAdmin, setIsAdmin] = useState("");

    const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태 추가
    const [searchType, setSearchType] = useState("title"); // 검색 기준 상태 추가
    const [filteredNotices, setFilteredNotices] = useState([]); // 필터링된 공지사항 상태 추가

    const PAGE_SIZE = 6; // 페이지당 공지사항 수
    const navigate = useNavigate(); // navigate 훅

    const [isPanelOpen, setIsPanelOpen] = useState(false); // 화면 옆 슬라이드

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    // 공지사항을 가져오는 함수
    const fetchNotices = async () => {
        try {
            const response = await axios.get(`/api/usernotice`, {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            });
            setNotices(response.data); // DB 데이터로 공지사항 목록 업데이트
            setTotalPages(Math.ceil(response.data.length / PAGE_SIZE)); // 총 페이지 수 계산
            setFilteredNotices(response.data); // 초기에는 모든 공지사항을 필터링된 공지사항으로 설정
            setError(null);
        } catch (error) {
            console.error("공지사항을 가져오는 중 오류 발생:", error);
            setError("공지사항을 불러오는데 실패했습니다. 다시 시도해주세요.");
        }
    };

    // 공지사항을 가져오는 useEffect
    useEffect( () => {
        if(isLoggedIn && empCode) {
            const role = localStorage.getItem('role')
            setIsAdmin(role)

            empInfo();
            fetchNotices(); // 로그인 상태와 관계없이 공지사항 가져오기
        }
    }, [isLoggedIn, empCode]);

    const empInfo = async () => {
        try{
            const response = await axios.get(`/emp/${empCode}`);
            setUserInfo(response.data);
        }catch (e){
            console.log(e)
        }
    }

    // 로그인 처리 함수
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                '/api/employ/login',
                {
                    empCode: inputId,
                    empPass: inputPassword
                }
            );

            if (response.data.success) {
                login(inputId, response.data.role, response.data.token); // 역할과 토큰 추가
                localStorage.setItem('adminId', inputId); // 로그인 정보 로컬 스토리지에 저장
                localStorage.setItem('token', response.data.token);
                setInputId(""); // 아이디 입력 필드 초기화
                setInputPassword(""); // 비밀번호 입력 필드 초기화
                navigate('/user/notice/list'); // 로그인 후 관리자 공지사항 리스트 페이지로 이동
            } else {
                setError("유효하지 않은 로그인 정보입니다.");
            }
        } catch (error) {
            setError("잘못된 계정 정보입니다. 다시 시도해주세요.");
        }
    };

    // 로그아웃 처리 함수
    const handleLogout = async () => {
        try {
            await axios.post('/api/employ/logout');
            localStorage.removeItem('adminId'); // ID 제거
            localStorage.removeItem('token'); // 토큰 제거
            setInputId(""); // 아이디 입력 필드 초기화
            setInputPassword(""); // 비밀번호 입력 필드 초기화
            logout(); // 로그아웃 호출
            navigate('/user/notice/list'); // 리스트 페이지로 이동
        } catch (error) {
            console.error("로그아웃 중 오류 발생:", error);
        }
    };

    // 수정된 부분: 공지사항 클릭 시 state를 통해 noticeNum 전달
    const handleNoticeClick = (noticeNum) => {
        navigate('/user/notice/detail', {state: {noticeNum}});
    };

    // 필터링된 공지사항 가져오기 (검색버튼 클릭 시)
    const handleSearch = () => {
        const filtered = notices.filter((notice) => {
            return searchType === "title"
                ? notice.title.toLowerCase().includes(searchQuery.toLowerCase())
                : notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                notice.content.toLowerCase().includes(searchQuery.toLowerCase());
        });
        setFilteredNotices(filtered); // 필터링된 공지사항 상태 업데이트
        setCurrentPage(1); // 검색 후 첫 페이지로 리셋
    };

    const filteredCount = filteredNotices.length; // 필터링된 공지사항 수
    const total = Math.ceil(filteredCount / PAGE_SIZE); // 총 페이지 수를 필터링된 공지사항 수에 기반하여 계산

    const today = new Date();
    const formattedDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`;

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
            <div className="mt-14 flex-1 flex">
                <main className="flex-grow w-full p-4 bg-gray-200">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold text-center mb-6">공지사항</h1>

                        {error && (
                            <div
                                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                                role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        <div className="flex justify-center mb-4">
                            <select
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                                className="p-2 border rounded-lg mr-2"
                            >
                                <option value="title">제목</option>
                                <option value="content">제목 + 내용</option>
                            </select>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="검색어 입력"
                                className="border rounded-lg w-72 pl-2.5 shadow-sm focus:outline-none"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch(); // Enter 키가 눌리면 검색 실행
                                    }
                                }}
                            />
                            <button
                                onClick={handleSearch}
                                className="bg-gray-500 text-white px-4 py-2 ml-2 rounded-lg hover:bg-gray-600"
                            >
                                검색
                            </button>
                        </div>

                        <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full md:w-4/5 lg:w-3/4 mx-auto">
                            <ul className="divide-y divide-gray-200">
                                {filteredNotices.length === 0 ? (
                                    <li className="p-3 text-center text-indigo-600 font-semibold">
                                        검색결과가 없습니다.
                                    </li>
                                ) : (
                                    filteredNotices.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((notice) => (
                                        <li key={notice.noticeNum}
                                            className="p-3 hover:bg-gray-50 transition duration-200">
                                            <h3
                                                className="text-lg font-semibold text-indigo-700 cursor-pointer hover:text-indigo-500 transition duration-200"
                                                onClick={() => handleNoticeClick(notice.noticeNum)}
                                            >
                                                {notice.title}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">
                                                작성일: {new Date(notice.startDate).toLocaleString()}
                                            </p>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>

                        <div className="flex justify-between items-center w-full mt-4 md:w-4/5 lg:w-3/4 mx-auto">
                            {currentPage > 1 && filteredCount > 0 && ( // '이전' 버튼 숨기기 조건
                                <button
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    className="px-3 py-1 bg-gray-600 text-white text-sm rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 transition duration-200 focus:outline-none"
                                >
                                    이전
                                </button>
                            )}

                            <span className="text-gray-800 font-semibold text-sm">{currentPage} / {total}</span>

                            {currentPage < total && filteredCount > PAGE_SIZE && ( // '다음' 버튼 숨기기 조건
                                <button
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    className="px-3 py-1 bg-gray-600 text-white text-sm rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 transition duration-200 focus:outline-none"
                                >
                                    다음
                                </button>
                            )}
                        </div>
                        <div>
                            {isAdmin == "admin" && (
                                <div className="flex justify-center mt-6">
                                    <button
                                        onClick={() => navigate('/admin/notice/register')}
                                        className="bg-gray-500 text-white font-bold py-2 px-4 text-sm rounded-full hover:bg-gray-400 transition duration-200"
                                    >
                                        공지사항 등록
                                    </button>
                                </div>
                            )}
                        </div>
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
                                        onChange={(e) => {
                                            setInputId(e.target.value)
                                        }}
                                    />
                                    <input
                                        type="password"
                                        placeholder="비밀번호"
                                        className="w-full p-2 mb-4 border rounded"
                                        onChange={(e) => {
                                            setInputPassword(e.target.value)
                                        }}
                                    />
                                    <button
                                        className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 mb-4"
                                        onClick={handleLogin}>
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

export default UserNoticeList;
