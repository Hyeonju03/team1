import React, {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useAuth} from './noticeAuth';
import Clock from "react-live-clock"

const AdminNoticeRegister = () => {
    const [formData, setFormData] = useState({title: "", content: ""});
    const {isLoggedIn, empCode, logout} = useAuth(); // 로그인 상태 가져오기 (각 페이지 별 로그인 연동)
    const navigate = useNavigate();

    const [isPanelOpen, setIsPanelOpen] = useState(false); // 화면 옆 슬라이드

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    // 등록시 입력하는 함수
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({...prevData, [name]: value}));
    };

    // 입력된 내용 제출 함수
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData); // 추가: 전송할 데이터 확인
        try {
            // 백엔드(DB)로 데이터 저장
            await axios.post("/api/adminnotice/register", formData);
            navigate("/admin/notice/list"); // 등록 완료 후 리스트 페이지로 이동
        } catch (error) {
            console.error("등록 중 오류 발생:", error);
        }
    };

    // 등록 취소 버튼 함수
    const handleCancel = () => {
        navigate("/admin/notice/list"); // 리스트 페이지로 이동
    };

    // 로그아웃 함수
    const handleLogout = () => {
        logout(); // 로그아웃 처리
        navigate('/admin/notice/list'); // 리스트 페이지로 이동
    };

    const today = new Date();
    const formattedDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`;

    return (
        <div className="min-h-screen flex flex-col">
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

            <div className="flex flex-grow">
                <main className="flex-grow bg-gradient-to-br from-blue-200 to-indigo-100 p-6">
                    <h2 className="text-3xl font-bold mb-8 text-indigo-800 text-center">공지사항 등록</h2>
                    <div className="flex justify-center items-center w-full">
                        <form onSubmit={handleSubmit}
                              className="w-full max-w-2xl bg-white shadow-xl rounded-lg p-8 text-center">
                            <div className="mb-6">
                                <label className="block text-indigo-700 text-sm font-bold mb-2"
                                       htmlFor="title">제목</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title} // 제목 불러오기
                                    onChange={handleInputChange} // 제목 등록
                                    required // 필수 입력 필드
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 transition duration-200"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-indigo-700 text-sm font-bold mb-2"
                                       htmlFor="content">내용</label>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={formData.content} // 내용 불러오기
                                    onChange={handleInputChange} // 내용 등록
                                    required // 필수 입력 필드
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 transition duration-200 h-48"
                                />
                            </div>
                            <div className="flex items-center justify-center">
                                <button type="submit"
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-200">
                                    등록하기
                                </button>
                                <button type="button" onClick={handleCancel}
                                        className="ml-4 bg-gray-400 hover:bg-gray-300 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-200">
                                    취소
                                </button>
                            </div>
                        </form>
                    </div>
                </main>

                <aside className="w-64 p-4 border-l border-gray-300">
                    <div className="mb-4">
                        <p className="mb-2">{empCode}님<br/>반갑습니다.</p>
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-500 text-white p-2 mb-2 hover:bg-red-600 transition duration-200"
                        >
                            로그아웃
                        </button>
                    </div>
                    <div className="text-sm text-center mb-4">
                        <a href="#" className="text-blue-600 hover:underline">공지사항</a>
                        <span className="mx-1">|</span>
                        <a href="#" className="text-blue-600 hover:underline">문의사항</a>
                    </div>
                    <h2 className="text-xl font-bold mb-2">메신저</h2>
                    <p>메신저 기능은 준비 중입니다.</p>
                </aside>
            </div>
        </div>
    );
};

export default AdminNoticeRegister;