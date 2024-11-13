import React, {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import SelectCorCodePopup from "./SelectCorCodePopup";
import Clock from "react-live-clock";

export default function SignUpForm() {


    const [departments, setDepartments] = useState([])
    const [ranks, setRanks] = useState([])
    const [formData, setFormData] = useState({
        companyCode: '',
        name: '',
        id: '',
        password: '',
        confirmPassword: '',
        phone: '',
        email: '',
        verificationCode: '',
        department: '',
        supervisorCode: '',
        rank: '',
        residentNumber1: '',
        residentNumber2: '',
    });

    const [idConfirm, setIdConfirm] = useState(false)
    const [pwConfirm, setPwConfirm] = useState(false)
    const [companyConfirm, setCompanyConfirm] = useState(false)
    const [inputidCheck, setInputIdCheck] = useState("")
    const [errors, setErrors] = useState({});
    const [generatedCode, setGeneratedCode] = useState(null);
    const navigate = useNavigate();
    const [signUpResponse, setSignUpResponse] = useState("")
    const [empCodeCheck, setEmpCodeCheck] = useState("")
    const [corCode, setCorCode] = useState([]);
    const [popUp, setPopUp] = useState(false)
    const [checkCorCode, setCheckCorCode] = useState("")
    const [checkEmpNum, setCheckEmpNum] = useState(null)
    const [status, setStatus] = useState(null)
    const today = new Date();
    const formattedDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`;

    const handleChange = (e) => {
        const {name, value} = e.target;
        setInputIdCheck(e.target)
        setFormData(prev => ({...prev, [name]: value}));
        setErrors(prev => ({...prev, [name]: ''})); // Clear error when user types

        if (name === 'department') {
            corCheck(value); // 업데이트된 부서 값 전달
            console.log(formData.department)
        }
    };

    const validateForm = () => {

        console.log("validateForm")
        const newErrors = {};

        if (!formData.companyCode) newErrors.companyCode = "회사코드를 입력해주세요";
        if (!formData.name) newErrors.name = "이름을 입력해주세요"
        if (!formData.id) newErrors.id = "아이디를 입력해주세요";
        if (!formData.password) newErrors.password = "비밀번호를 입력해주세요";
        if (!formData.confirmPassword) newErrors.confirmPassword = "비밀번호 확인을 입력해주세요";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
        if (!formData.phone) newErrors.phone = "휴대전화를 입력해주세요";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = "이메일을 입력해주세요";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "유효한 이메일 주소를 입력해주세요";
        }
        if (!formData.verificationCode) newErrors.verificationCode = "인증번호를 입력해주세요";
        if (!formData.department) newErrors.department = "부서를 선택해주세요";
        //if (!formData.supervisorCode) newErrors.supervisorCode = "상관 코드를 입력해주세요";
        if (!formData.rank) newErrors.rank = "직급을 선택해주세요";
        if (!formData.residentNumber1) newErrors.residentNumber1 = "주민등록번호 앞자리 입력해주세요";
        if (!formData.residentNumber2) newErrors.residentNumber2 = "주민등록번호 뒷자리 입력해주세요";

        return newErrors;
    };


    const companyCodeCheck = async () => {
        const response = await axios.get('/apitest');
        const companyFound = response.data.some(company => company[2] === formData.companyCode);  // 입력한 회사코드가 있는지 확인

        if (companyFound) {
            alert("인증완료");
            setCompanyConfirm(true)
            //부서검색누르면 부서리스트나와서하는기능
            //3148200040
            try {
                const response = await axios.get(`http://localhost:8080/codeSignUp?comCode=${formData.companyCode}`);
                const list = response.data

                const newDepartments = list.map(v => v.depCode);
                const dede = newDepartments.join(",").split(",");
                setDepartments(dede);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        } else {
            alert("없는 회사코드임");
        }
    }

    const rankCheck = async () => {
        const response = await axios.get('/apitest');
        const companyFound = response.data.some(company => company[2] === formData.companyCode);  // 입력한 회사코드가 있는지 확인

        if (companyFound) {
            try {
                const response = await axios.get(`http://localhost:8080/rankSignUp?comCode=${formData.companyCode}`); //  Spring Boot API URL
                const list = response.data

                const newRanks = list.map(v => v.posCode)
                console.log("오잉", newRanks)

                const nene = newRanks.join(",").split(",");
                setRanks(nene)

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        } else {
            alert("없는 회사코드임");
        }
    }
    // 상사리스트
    const corCheck = async (param) => {
        console.log("formData", param)
        const response = await axios.get('/apitest');
        const companyFonud = response.data.some(company => company[2] === formData.companyCode);

        if (companyFonud) {
            try {
                const response = await axios.get(`http://localhost:8080/selectCorcode?comCode=${formData.companyCode}&depCode=${param}`);
                console.log(response);
                setCorCode(response.data)

            } catch (error) {
                console.error(error);
            }
        }
    }


    const idCheck = async () => {
        const companyCode = formData.companyCode;
        const id = formData.id;
        if (!id) {
            console.error("ID is empty");
            return; // ID가 비어있으면 함수 종료
        }
        try {
            const response = await axios.post('/findAllempCode', {empCode: `${companyCode}-${id}`});

            if (response.data > 0) {
                alert("중복입니다.")
            } else {
                alert("사용가능합니다.")
                setIdConfirm(true)
            }


        } catch (error) {
            console.error('Error fetching data:', error);
        }


    };

    const pwCheck = (e) => {
        const pw = formData.password
        const pwConfirm = formData.confirmPassword

        if (pw == pwConfirm) {
            alert("일치합니다")
            setPwConfirm(true)
        } else {
            alert("재확인")
        }
    }

    const sendVerificationCode = async () => {
        const email = formData.email;
        if (!email) {
            alert("이메일 입력해")
            return
        }
        try {
            const response = await axios.post('/randomCode', {email});
            const code = response.data.code; // 서버에서 받은 인증 코드를 저장
            console.log(code)
            setGeneratedCode(code); // 인증 코드를 상태에 저장

            alert(`인증번호가 발송되었습니다: ${code}`); // 확인 메시지 (실제 이메일 발송 후 삭제 가능)
        } catch (error) {
            console.error('Error sending verification code:', error);
            alert("인증번호 전송에 실패했습니다.");
        }
    }

    const verifyCode = () => {

        console.log(generatedCode)
        if (parseInt(formData.verificationCode) == generatedCode) {
            alert("인증번호가 일치합니다.");
        } else {
            alert("인증번호가 일치하지 않습니다.");
        }
    };


    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault(); // 기본 동작 방지
        }
    };

    const searchCorcode = (e) => {
        console.log("클릭")
        setPopUp(true)
    }

    const fetchData = async () => {
        try {
            const response = await axios.get("/selectStatus", {params: {comCode: formData.companyCode}});
            console.log("결제여부?", response);
            setStatus(response.data)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const selectEmpNum = async () => {
            try {
                const resp = await axios.get("/selectAllEmpNum", {params: {comCode: formData.companyCode}});
                console.log("몇명?", resp);
                setCheckEmpNum(resp.data)
            } catch (error) {
                console.error(error);
            }
        }
        if (idConfirm) {
            selectEmpNum();
            fetchData();
        }
    }, [idConfirm])


    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("회원가입 하기");

        console.log("제대로뜨는지 함보자", status, checkEmpNum);

        console.log("Condition met?", status === 0 && checkEmpNum > 9);

        if (status === 0 && checkEmpNum >= 9) {
            alert("회원가입 불가 돈내세용")
            return;
        }

        const validationErrors = validateForm();
        console.log(validationErrors)

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            console.log("setErrors")
            return;
        }
        console.log("회원가입 하기2222");

        if (!companyConfirm) {
            alert("회사코드 확인하삼")
            return;
        }
        console.log("회원가입 하기33333");

        if (!idConfirm) {
            alert("아이디중복확인 하삼")
            return;
        }

        if (!pwConfirm) {
            alert("비밀번호확인 제대로 하삼")
            return;
        }

        if (formData.phone.length != 11) {
            alert("휴대폰번호를 확인해주세용")
            return;
        }

        if (formData.residentNumber1.length != 6) {
            alert("주민등록번호 앞자리 다시 확인해주삼")
            return;
        }
        if (formData.residentNumber2.length != 7) {
            alert("주민등록번호 뒷자리 다시 확인해주삼")
            return;
        }

        if ((formData.residentNumber1.length + formData.residentNumber2.length) != 13) {
            alert("주민등록번호 확인하삼")
        }
        // console.log('Form submitted:', formData);

        const send = {
            companyCode: formData.companyCode,
            empCode: `${formData.companyCode}-${formData.id}`,  // 아이디
            empName: formData.name, // 이름
            empPass: formData.password, // 비밀번호
            depCode: formData.department, // 부서
            phoneNum: formData.phone, // 전화번호
            empMail: formData.email, // 이메일
            empRrn: `${formData.residentNumber1}-${formData.residentNumber2}`, // 주민등록번호
            // supervisorCode: formData.supervisorCode,//상관
            corCode: checkCorCode,
            posCode: formData.rank

        };

        console.log('send send:', send);

        const config = {
            headers: {"Content-Type": `application/json`}
        };


        try {
            const reuslt = await axios.post('/signUp', send, config);
            console.log(reuslt);
            alert("회원가입 완룡")
        } catch (error) {
            console.error(error)
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
        <div className="flex flex-col min-h-screen">
            {/*// <div className="min-h-screen flex flex-col overflow-hidden">*/}
            <style>
                {`
                 input::placeholder {
                        color: ${errors.companyCode ? 'red' : 'gray'};
                    }
                    input.error {
                        color: red; /* 에러가 있을 때 텍스트 색상 */
                    }
            `}
            </style>
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
            <div className="ml-40 p-5">
                <div className="ml-96 mt-28 max-w-4xl items-center">
                    <form onSubmit={handleSubmit} className="space-y-0.5">
                        {/* 회사코드 */}
                        <div className="flex items-center mb-4" style={{marginBottom: "20px"}}>
                            <label htmlFor="companyCode" className="flex-none w-32 text-left">회사코드</label>
                            <input
                                id="companyCode"
                                name="companyCode"
                                value={formData.companyCode}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                className={`border p-2 flex-grow ${errors.companyCode ? 'border-red-500' : ''}`}
                                placeholder={errors.companyCode || '회사코드 입력'}
                                disabled={companyConfirm ? true : false}
                                style={{color: errors.companyCode ? 'red' : 'black'}}
                            />
                            <button onClick={() => {
                                companyCodeCheck();
                                rankCheck();
                            }} type="button" className="ml-2 border p-2">확인
                            </button>

                        </div>

                        {/* 이름 */}
                        <div className="flex items-center mb-4" style={{marginBottom: "20px"}}>
                            <label htmlFor="name" className="flex-none w-32 text-left">이름</label>
                            <input
                                id="name"
                                name="name"
                                maxLength={3}
                                value={formData.name}
                                onChange={(e) => {
                                    e.target.value = e.target.value.replace(/\d/g, "")
                                    handleChange(e)
                                }}
                                // onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                className={`border p-2 flex-grow ${errors.name ? 'border-red-500' : ''}`}
                                placeholder={errors.name || '이름 입력'}
                            />
                        </div>

                        {/* ID */}
                        <div className="flex items-center mb-4" style={{marginBottom: "20px"}}>
                            <label htmlFor="id" className="flex-none w-32 text-left">ID</label>
                            <input
                                id="id"
                                name="id"
                                value={formData.id}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                className={`border p-2 flex-grow ${errors.id ? 'border-red-500' : ''}`}
                                placeholder={errors.id || '아이디 입력'}
                                disabled={idConfirm ? true : false}
                            />
                            <button onClick={idCheck} type="button" className="ml-2 border p-2">중복확인</button>
                        </div>

                        {/* PW */}
                        <div className="flex items-center mb-4" style={{marginBottom: "20px"}}>
                            <label htmlFor="password" className="flex-none w-32 text-left">PW</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                disabled={pwConfirm ? true : false}
                                className={`border p-2 flex-grow ${errors.password ? 'border-red-500' : ''}`}
                                placeholder={errors.password || '비밀번호 입력'}
                            />

                        </div>

                        {/* PW 확인 */}
                        <div className="flex items-center mb-4" style={{marginBottom: "20px"}}>
                            <label htmlFor="confirmPassword" className="flex-none w-32 text-left">PW 확인</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                disabled={pwConfirm ? true : false}
                                className={`border p-2 flex-grow ${errors.confirmPassword ? 'border-red-500' : ''}`}
                                placeholder={errors.confirmPassword || '비밀번호 확인 입력'}
                            />
                            <button onClick={pwCheck} style={{marginLeft: "10px"}} type="button"
                                    className="mt-2 border p-2">확인
                            </button>
                        </div>

                        {/* 휴대전화 */}
                        <div className="flex items-center mb-4" style={{marginBottom: "20px"}}>
                            <label htmlFor="phone" className="flex-none w-32 text-left">휴대전화</label>
                            <input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onKeyDown={handleKeyDown}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 허용
                                    setFormData(prev => ({...prev, phone: value}));
                                    setErrors(prev => ({...prev, phone: ''})); // Clear error when user types
                                }}
                                className={`border p-2 flex-grow ${errors.phone ? 'border-red-500' : ''}`}
                                placeholder={errors.phone || '휴대전화 입력'}
                            />
                        </div>

                        {/* 이메일 주소 */}
                        <div className="flex items-center mb-4" style={{marginBottom: "20px"}}>
                            <label htmlFor="email" className="flex-none w-32 text-left">이메일 주소</label>
                            <div className="flex items-center flex-grow space-x-2">
                                <input
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    className={`border p-2 flex-grow ${errors.email ? 'border-red-500' : ''}`}
                                    placeholder={errors.email || '이메일 입력'}
                                />
                            </div>
                            <button onClick={sendVerificationCode} style={{marginLeft: "10px"}} type="button"
                                    className="mt-2 border p-2">인증번호 발송
                            </button>
                        </div>

                        {/* 인증번호 입력 */}
                        <div className="flex items-center mb-4" style={{marginBottom: "20px"}}>
                            <label htmlFor="verificationCode" className="flex-none w-32 text-left">인증번호 입력</label>
                            <input
                                id="verificationCode"
                                name="verificationCode"
                                value={formData.verificationCode}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                className={`border p-2 flex-grow ${errors.verificationCode ? 'border-red-500' : ''}`}
                                placeholder={errors.verificationCode || '인증번호 입력'}
                            />
                            <button onClick={verifyCode} style={{marginLeft: "10px"}} type="button"
                                    className="mt-2 border p-2">인증번호 확인
                            </button>
                        </div>


                        {/* 부서 */}
                        <div className="flex items-center mb-4" style={{marginBottom: "20px"}}>
                            <label htmlFor="department" className="flex-none w-32 text-left">부서</label>
                            <div className="flex-grow relative flex">
                                <select
                                    id="department"
                                    name="department"
                                    // value={formData.department}
                                    onChange={handleChange}
                                    className={`border p-2 flex-grow ${errors.department ? 'border-red-500' : ''}`}
                                >
                                    <option value="department">부서 선택</option>
                                    {/* 기본 선택 옵션 */}
                                    {departments.map((dep, index) => (
                                        <option key={index} value={dep}>
                                            {dep}
                                        </option>
                                    ))}
                                </select>

                            </div>
                        </div>

                        {/* 상관 코드 */}
                        <div className="flex items-center mb-4" style={{marginBottom: "20px"}}>
                            <label htmlFor="supervisorCode" className="flex-none w-32 text-left">상관 코드</label>
                            <div className="flex-grow relative flex">
                                <input
                                    id="supervisorCode"
                                    name="supervisorCode"
                                    // value={formData.supervisorCode}
                                    value={checkCorCode}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    className={`border p-2 flex-grow ${errors.supervisorCode ? 'border-red-500' : ''}`}
                                    placeholder={errors.supervisorCode || '상관 코드 입력'}
                                />
                                <button onClick={searchCorcode} type="button" className="border p-2 ml-2 flex-none">검색
                                </button>
                            </div>
                        </div>
                        <SelectCorCodePopup
                            isOpen={popUp}
                            onClose={() => setPopUp(false)}
                            onConfirm={(item) => {
                                console.log("item", item.EMP_CODE)
                                setCheckCorCode(item.EMP_CODE)
                                setPopUp(false); // 모달 닫기
                            }}
                            corCode={corCode}
                        />

                        {/* 직급 */}
                        <div className="flex items-center mb-4" style={{marginBottom: "20px"}}>
                            <label htmlFor="rank" className="flex-none w-32 text-left">직급</label>
                            <div className="flex-grow relative flex">
                                <select
                                    id="rank"
                                    name="rank"
                                    value={formData.rank}
                                    onChange={handleChange}
                                    className={`border p-2 flex-grow ${errors.rank ? 'border-red-500' : ''}`}
                                >
                                    <option value="">직급 선택</option>
                                    {/* 기본 선택 옵션 */}
                                    {ranks.map((r, index) => (
                                        <option key={index} value={r}>
                                            {r}
                                        </option>
                                    ))}
                                </select>

                            </div>
                        </div>

                        {/* 주민등록번호 */}
                        <div className="flex items-center mb-4" style={{marginBottom: "20px"}}>
                            <label htmlFor="residentNumber1" className="flex-none w-32 text-left">주민등록번호</label>
                            <div className="flex items-center space-x-2 flex-grow">
                                <input
                                    id="residentNumber1"
                                    name="residentNumber1"
                                    value={formData.residentNumber1}
                                    onKeyDown={handleKeyDown}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 허용
                                        setFormData(prev => ({...prev, residentNumber1: value}));
                                        setErrors(prev => ({...prev, residentNumber1: ''})); // Clear error when user types
                                    }}
                                    maxLength={6}
                                    className={`border p-2 flex-grow ${errors.residentNumber1 ? 'border-red-500' : ''}`}
                                    placeholder={errors.residentNumber1 || '앞자리'}
                                />
                                <span>-</span>
                                <input
                                    id="residentNumber2"
                                    name="residentNumber2"
                                    value={formData.residentNumber2}
                                    onKeyDown={handleKeyDown}
                                    maxLength={7}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 허용
                                        setFormData(prev => ({...prev, residentNumber2: value}));
                                        setErrors(prev => ({...prev, residentNumber2: ''})); // Clear error when user types
                                    }}
                                    className={`border p-2 flex-grow ${errors.residentNumber2 ? 'border-red-500' : ''}`}
                                    placeholder={errors.residentNumber2 || '뒷자리'}
                                />
                            </div>
                        </div>

                        <button type="submit" className="border bg-blue-500 text-white p-2">회원가입</button>
                    </form>
                </div>
            </div>
            <div className="flex absolute ml-96 mt-2" onClick={() => {
                navigate(`/`)
            }}>
                <img src="/BusinessClip.png" alt="mainLogo" className="w-20"/>
                <div className="font-bold mt-2 ml-2">BusinessClip</div>
            </div>
        </div>
    );
}
