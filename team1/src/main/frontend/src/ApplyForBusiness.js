import React, {useState} from 'react';
import Clock from "react-live-clock";
import {useNavigate} from "react-router-dom";

export default function ApplyForBusiness() {
    const navigate = useNavigate()

    const [comCode, setComCode] = useState(''); // 사업자등록번호
    const [isComCodeChecked, setIsComCodeChecked] = useState(false); // 사업자등록번호 확인 여부
    const [comName, setComName] = useState(''); // 회사 이름
    const [ceoName, setCeoName] = useState(''); // 대표 이름
    const [ceoPhone, setCeoPhone] = useState(''); // 대표 연락처
    const [contectPhone, setContectPhone] = useState(''); // 담당자 연락처
    const [empNum, setEmpNum] = useState(''); // 직원수
    const [comEmail, setComEmail] = useState(''); // 이메일
    const [showAlert, setShowAlert] = useState(false); // 경고창 숨김 상태
    const [alertMessage, setAlertMessage] = useState(''); // 경고창 안에
    // slide 변수
    const [isPanelOpen, setIsPanelOpen] = useState(false); // 화면 옆 슬라이드
    const today = new Date();
    const formattedDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`;

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    // 모든 칸에 스페이스바 입력 금지
    const preventSpaceBar = (e) => {
        if (e.key === ' ') {
            e.preventDefault();
        }
    };

    // 사업자등록번호 확인해서 자동기입 하기
    const handleComCodeCheck = async () => {
        try {
            const response = await fetch('/apitest'); // API 호출
            const data = await response.json(); // API 응답을 JSON으로 파싱

            // 입력한 사업자번호와 매칭되는 데이터를 찾음
            const companyFound = data.some(company => company[2] === comCode);

            if (companyFound) {
                const matchedCompany = data.find(company => company[2] === comCode);
                setCeoName(matchedCompany[0]); // 대표자 이름 자동기입
                setComName(matchedCompany[1]);  // 회사 이름 자동기입
                setCeoPhone(matchedCompany[3]); // 대표 연락처 자동기입
                setIsComCodeChecked(true); // 사업자등록번호 확인 완료

            } else {
                alert('해당 사업자 번호로 정보를 찾을 수 없습니다.');
                setIsComCodeChecked(false); // 확인 실패
            }
        } catch (error) {
            console.error('API 호출 중 오류 발생:', error);
            alert('API 호출 중 오류가 발생했습니다.');
        }
    };

    // 유효성체크
    const validateForm = () => {
        if (!comCode) {
            alert("사업자 등록번호를 입력해주세요.");
            return false;
        }
        if (!isComCodeChecked) {
            alert("사업자 등록번호를 확인하세요.");
            return false;
        }
        const contectPhoneCheck = /^\d{3}-\d{4}-\d{4}$/;
        if (!contectPhone) {
            alert("담당자 연락처를 입력해주세요.");
            return false;
        } else if (!contectPhoneCheck.test(contectPhone)) {
            alert("담당자 연락처는 000-0000-0000 형식이어야 합니다.");
            return false;
        }
        if (!empNum) {
            alert("직원수를 입력해주세요.");
            return false;
        } else if (isNaN(empNum)) {
            alert("직원수는 숫자여야 합니다");
            return false;
        }
        const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!comEmail) {
            alert("이메일을 입력해주세요.");
            return false;
        } else if (!emailCheck.test(comEmail)) {
            alert("유효한 이메일 주소를 입력해주세요");
            return false;
        }
        return true;
    }

    // 신청하기
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const businessData = {
            comCode,
            comName,
            ceoName,
            ceoPhone,
            contectPhone,
            empNum,
            comEmail,
            deleteDate: null,
            payStatus: false
        };

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(businessData),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || '신청에 실패했습니다.');
            }

            const registeredBusiness = await response.json();
            console.log('등록된 사업:', registeredBusiness);
            setAlertMessage('정상적으로 신청이 완료되었습니다.');
            setShowAlert(true);
        } catch (error) {
            console.error('Error:', error);
            setAlertMessage(error.message);
            setShowAlert(true);
        }
    };

    const goFAQ = () => {
        navigate("/AdminFAQ");
        window.location.reload();
    };

    const goQList = () => {
        navigate("/AdminQDetail");
    }

    const qRegister = () => {
        navigate("/AdminQ");
        window.location.reload();
    };

    const goQDetail = () => {
        navigate("/AdminQDetail");
        window.location.reload();
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
                        <div className="bg-white text-white font-bold w-36 h-8 pt-1 rounded-2xl">로그인 / 회원가입
                        </div>
                    </div>
                </header>
            </div>
            <aside className="fixed h-4/6 mt-32">
                <div
                    className="w-64 h-full bg-gray-200 p-2 rounded-r-lg shadow-md flex flex-col justify-around items-center"
                >
                    <div className="flex justify-center">
                        <div className="h-full">
                            <h2 className="text-left text-2xl ml-1 mb-2 cursor-pointer" onClick={() => {
                                navigate(`/ApplyForBusiness`)
                            }}>사용 등록 신청</h2>
                            <h2 className="text-left text-2xl ml-1 mb-2 cursor-pointer" onClick={() => {
                                navigate(`/SignUp`)
                            }}>회원가입</h2>
                            <h2 onClick={goFAQ} className="text-left text-2xl ml-1 mb-2 cursor-pointer">FAQ</h2>

                            <h2 onClick={goQList} className="text-left text-2xl ml-1 mb-2 cursor-pointer">
                                1:1 상담</h2>
                            <ul className="ml-2">
                                <li onClick={qRegister} className="text-left cursor-pointer">-
                                    문의작성
                                </li>
                                <li onClick={goQDetail} className="text-left cursor-pointer">-
                                    문의내역
                                </li>
                            </ul>
                        </div>
                    </div>
                    <hr className="border-gray-300 w-full"/>
                    <div className="flex justify-center">
                        <div className="h-full">
                            <h3 className="text-2xl  mb-2 text-center mt-2">CS 센터</h3>
                            <p className="text-lg mb-2 text-center mt-2" style={{fontWeight: "400"}}>1234-5678</p>
                            <p className="text-lg text-center mt-2">월-금 09:00 ~ 12:00<br/>13:00 ~ 18:00</p>
                            <p className="text-lg mt-2 text-center">(공휴일 휴무)</p>
                        </div>
                    </div>
                </div>
            </aside>
            <div
                className="flex w-3/5 mt-32 ml-64 max-h-[70vh] pl-10 h-auto">
                <div className="flex-1 pl-96">
                    <div className="border-2 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl text-center mb-6 bg-blue-500 text-white py-2 rounded max-w-3xl mx-auto">사용
                            등록
                            신청</h2>
                        <form onSubmit={handleSubmit} className="space-y-8 text-lg">
                            <div className="flex items-center space-x-2">
                                <label className="w-1/2">사업자 등록번호</label>
                                <div className="flex-1 flex items-center">
                                    <input
                                        className="w-3/6 border rounded px-2 py-1"
                                        value={comCode}
                                        onChange={(e) => setComCode(e.target.value)}
                                        onKeyDown={preventSpaceBar}
                                        placeholder={"숫자만 입력"}
                                    />
                                    <button
                                        type="button"
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded ml-3"
                                        onClick={handleComCodeCheck}
                                    >
                                        확인
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <label className="w-1/2">회사 이름</label>
                                <input
                                    className="w-[31%] border rounded px-2 py-1"
                                    value={comName}
                                    readOnly
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <label className="w-1/2">대표 이름</label>
                                <input
                                    className="w-[31%] border rounded px-2 py-1"
                                    value={ceoName}
                                    readOnly
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <label className="w-1/2">대표 연락처</label>
                                <input
                                    className="w-[31%] border rounded px-2 py-1"
                                    value={ceoPhone}
                                    readOnly
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <label className="w-1/2">담당자 연락처</label>
                                <input
                                    className="w-[31%] border rounded px-2 py-1"
                                    value={contectPhone}
                                    onChange={(e) => setContectPhone(e.target.value)}
                                    onKeyDown={preventSpaceBar}
                                    placeholder={"000-0000-0000"}
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <label className="w-1/2">직원 수</label>
                                <input
                                    className="w-[31%] border rounded px-2 py-1"
                                    value={empNum}
                                    onChange={(e) => setEmpNum(e.target.value)}
                                    onKeyDown={preventSpaceBar}
                                    placeholder={"숫자만 입력"}
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <label className="w-1/2">이메일</label>
                                <input
                                    className="w-[31%] border rounded px-2 py-1"
                                    type="comEmail"
                                    value={comEmail}
                                    onChange={(e) => setComEmail(e.target.value)}
                                    onKeyDown={preventSpaceBar}
                                    placeholder={"xxxx@xxxx.xxx"}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-2/3 bg-blue-500 hover:bg-blue-600 text-white mt-6 py-2 rounded"

                            >
                                신청하기
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {showAlert && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
                        <p className="text-lg mb-4">{alertMessage}</p>
                        <button
                            onClick={() => setShowAlert(false)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}

            <div className="flex absolute ml-96 mt-2" onClick={() => {
                navigate(`/`)
            }}>
                <img src="/BusinessClip.png" alt="mainLogo" className="w-20"/>
                <div className="font-bold mt-2 ml-2">BusinessClip</div>
            </div>

        </div>
    )
        ;
}
