import { useState,useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";

export default function SignUpForm() {


    const [departments,setDepartments] = useState([])
    const [formData, setFormData] = useState({
        companyCode: '',
        name:'',
        id: '',
        password: '',
        confirmPassword: '',
        phone: '',
        email: '',
        verificationCode: '',
        department: '',
        supervisorCode: '',
        residentNumber1: '',
        residentNumber2: '',
    });

    const [idConfirm,setIdConfirm] = useState(false)
    const [pwConfirm,setPwConfirm] = useState(false)
    const [companyConfirm,setCompanyConfirm] = useState(false)
    const [inputidCheck,setInputIdCheck] = useState("")
    const [errors, setErrors] = useState({});
    const [generatedCode, setGeneratedCode] = useState(null);
    const navigate = useNavigate();
    const [signUpResponse,setSignUpResponse] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputIdCheck(e.target)
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' })); // Clear error when user types
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.companyCode) newErrors.companyCode = "회사코드를 입력해주세요";
        if(!formData.name) newErrors.name = "이름을 입력해주세요"
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
        if (!formData.department) newErrors.department = "부서를 입력해주세요";
        if (!formData.supervisorCode) newErrors.supervisorCode = "상관 코드를 입력해주세요";
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
                    const response = await axios.get(`http://localhost:8080/codeSignUp?comCode=${formData.companyCode}`); //  Spring Boot API URL
                    const list = response.data

                    const newDepartments = list.map(v => v.depCode);
                    newDepartments.map((v,i)=>{
                        setDepartments(newDepartments);
                    })


                } catch (error) {
                    console.error('Error fetching data:', error);
                }
        } else {
            alert("없는 회사코드임");
        }
    }

    const idCheck = async() => {
        const companyCode = formData.companyCode;
        const id = formData.id;
        if (!id) {
            console.error("ID is empty");
            return; // ID가 비어있으면 함수 종료
        }
        try {
            const response = await axios.get('/findAllempCode', {params: { comCode: companyCode }});
            const empCodes = response.data.map(item => item.empCode);

            const resultEmpCode = empCodes.map(code => code.split('-')[1]);
            console.log(resultEmpCode)
            for (let i = 0; i <= resultEmpCode.length; i++) {
                if(id == resultEmpCode[i] ){
                    alert("이미 있는 아이디입니다");
                    break;
                }else{
                    alert("가능");
                    setIdConfirm(true)
                }
            }



        } catch (error) {
            console.error('Error fetching data:', error);
        }


    };

    const pwCheck =(e)=>{
        const pw = formData.password
        const pwConfirm = formData.confirmPassword

        if(pw == pwConfirm){
            alert("일치합니다")
            setPwConfirm(true)
        }else{
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
            const response = await axios.post('/randomCode', { email });
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


    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        if(! companyConfirm){
            alert("회사코드 확인하삼")
            return;
        }

        if(! idConfirm){
            alert("아이디중복확인 하삼")
            return;
        }

        if(! pwConfirm){
            alert("비밀번호확인 제대로 하삼")
            return;
        }
        
        if(formData.phone.length != 11){
            alert("휴대폰번호를 확인해주세용")
            return;
        }

        if(formData.residentNumber1.length != 6){
            alert("주민등록번호 앞자리 다시 확인해주삼")
            return;
        }
        if(formData.residentNumber2.length != 7){
            alert("주민등록번호 뒷자리 다시 확인해주삼")
            return;
        }

        if ((formData.residentNumber1.length + formData.residentNumber2.length) != 13){
            alert("주민등록번호 확인하삼")
        }
        console.log('Form submitted:', formData);

        const send = {
            empCode: `${formData.companyCode}-${formData.id}`,  // 아이디
            empName: formData.name, // 이름
            empPass: formData.password, // 비밀번호
            depCode: formData.department, // 부서
            phoneNum: formData.phone, // 전화번호
            empMail: formData.email, // 이메일
            empRrn: `${formData.residentNumber1}-${formData.residentNumber2}` // 주민등록번호
        };

        const config = {
            headers: { "Content-Type": `application/json`}
        };

        const reuslt = await axios.post('/signUp' ,  send, config);
        //여기url주소가 contro;ller url이랑 똑같아야함.

        console.log(reuslt);


    };





    return (
        <div className="w-full max-w-3xl mx-auto p-4 border rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center bg-gray-200 py-2" style={{ marginBottom: "30px" }}>로고</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* 회사코드 */}
                <div className="flex items-center mb-4" style={{marginBottom: "30px"}}>
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
                    />
                    <button onClick={companyCodeCheck} type="button" className="ml-2 border p-2">확인</button>
                </div>

                {/* 이름 */}
                <div className="flex items-center mb-4" style={{marginBottom: "30px"}}>
                    <label htmlFor="name" className="flex-none w-32 text-left">이름</label>
                    <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className={`border p-2 flex-grow ${errors.name ? 'border-red-500' : ''}`}
                        placeholder={errors.name || '이름 입력'}
                    />
                </div>

                {/* ID */}
                <div className="flex items-center mb-4" style={{marginBottom: "30px"}}>
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
                <div className="flex items-center mb-4" style={{marginBottom: "30px"}}>
                    <label htmlFor="password" className="flex-none w-32 text-left">PW</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className={`border p-2 flex-grow ${errors.password ? 'border-red-500' : ''}`}
                        placeholder={errors.password || '비밀번호 입력'}
                    />

                </div>

                {/* PW 확인 */}
                <div className="flex items-center mb-4" style={{marginBottom: "30px"}}>
                    <label htmlFor="confirmPassword" className="flex-none w-32 text-left">PW 확인</label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className={`border p-2 flex-grow ${errors.confirmPassword ? 'border-red-500' : ''}`}
                        placeholder={errors.confirmPassword || '비밀번호 확인 입력'}
                    />
                    <button onClick={pwCheck} style={{marginLeft: "10px"}} type="button"
                            className="mt-2 border p-2">확인
                    </button>
                </div>

                {/* 휴대전화 */}
                <div className="flex items-center mb-4" style={{marginBottom: "30px"}}>
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
                <div className="flex items-center mb-4" style={{marginBottom: "30px"}}>
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
                <div className="flex items-center mb-4" style={{marginBottom: "30px"}}>
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
                <div className="flex items-center mb-4" style={{marginBottom: "30px"}}>
                    <label htmlFor="department" className="flex-none w-32 text-left">부서</label>
                    <div className="flex-grow relative flex">
                        <select
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className={`border p-2 flex-grow ${errors.department ? 'border-red-500' : ''}`}
                        >
                            <option value="">부서 선택</option>
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
                <div className="flex items-center mb-4" style={{marginBottom: "30px"}}>
                    <label htmlFor="supervisorCode" className="flex-none w-32 text-left">상관 코드</label>
                    <div className="flex-grow relative flex">
                        <input
                            id="supervisorCode"
                            name="supervisorCode"
                            value={formData.supervisorCode}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            className={`border p-2 flex-grow ${errors.supervisorCode ? 'border-red-500' : ''}`}
                            placeholder={errors.supervisorCode || '상관 코드 입력'}
                        />
                        {/*<button onClick={firmSearch} type="button" className="border p-2 ml-2 flex-none">검색</button>*/}
                    </div>
                </div>

                {/* 주민등록번호 */}
                <div className="flex items-center mb-4" style={{marginBottom: "30px"}}>
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
                            className={`border p-2 flex-grow ${errors.residentNumber1 ? 'border-red-500' : ''}`}
                            placeholder={errors.residentNumber1 || '앞자리'}
                        />
                        <span>-</span>
                        <input
                            id="residentNumber2"
                            name="residentNumber2"
                            value={formData.residentNumber2}
                            onKeyDown={handleKeyDown}
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

                <button  type="submit" className="w-full bg-blue-500 text-white p-2">회원가입</button>
            </form>
        </div>
    );
}
