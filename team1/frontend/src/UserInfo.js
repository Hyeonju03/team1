import React, {useCallback, useState} from 'react'

export default function UserInfo() {
    const [empName, setEmpName] = useState("홍길동");
    const [department, setDepartment] = useState("개발팀");
    const [position, setPosition] = useState("대리");
    const [empRrn, setEmpRrn] = useState("010101-0101010");
    const [empCode, setEmpCode] = useState("12345678-123456");
    const [empPass, setEmpPass] = useState("123456");
    const [phoneNum, setPhoneNum] = useState("010-0101-0101");
    const [extNum, setExtNum] = useState("123456-1234");
    const [empMail, setEmpMail] = useState("123456@naver.com");
    const [corCode, setCorCode] = useState("12345678-456789");
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    const empNameOnChangeHandler = useCallback((e) => {
        setEmpName(e.target.value);
    },[]);
    const departmentOnChangeHandler = useCallback((e) => {
        setDepartment(e.target.value);
    },[]);
    const positionOnChangeHandler = useCallback((e) => {
        setPosition(e.target.value);
    },[]);
    const empRrnOnChangeHandler = useCallback((e) => {
        setEmpRrn(e.target.value);
    },[]);
    const empPassOnChangeHandler = useCallback((e) => {
        setEmpPass(e.target.value);
    },[]);
    const phoneNumOnChangeHandler = useCallback((e) => {
        setPhoneNum(e.target.value);
    },[]);
    const extNumOnChangeHandler = useCallback((e) => {
        setExtNum(e.target.value);
    },[]);
    const empMailOnChangeHandler = useCallback((e) => {
        setEmpMail(e.target.value);
    },[]);
    const corCodeOnChangeHandler = useCallback((e) => {
        setCorCode(e.target.value);
    },[]);



    return (
        <div className="max-w-6xl mx-auto p-5 font-sans">
            <header className="bg-gray-100 p-3 mb-5 text-center">
                <div className="text-2xl font-bold">
                    로고
                </div>
            </header>
            <h1 className="text-2xl font-bold mb-5 pb-3 border-b border-gray-200">
                인사관리
            </h1>
            <div className="bg-white border border-gray-200 rounded-md p-5">
                <h2 className="text-xl mb-4">
                    {empName}님 정보 관리
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-2">
                        <label className="block mb-1 text-sm text-gray-600">이름</label>
                        <input type="text"
                               className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                               onChange={empNameOnChangeHandler}
                               value={empName}/>
                    </div>
                    <div className="mb-2">
                        <label className="block mb-1 text-sm text-gray-600">부서</label>
                        <input type="text"
                               className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                               onChange={departmentOnChangeHandler}
                               value={department}/>
                    </div>
                    <div className="mb-2">
                        <label className="block mb-1 text-sm text-gray-600">직급</label>
                        <input type="text"
                               className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                               onChange={positionOnChangeHandler}
                               value={position}/>
                    </div>
                    <div className="mb-2">
                        <label className="block mb-1 text-sm text-gray-600">주민등록번호</label>
                        <input type="text"
                               className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                               onChange={empRrnOnChangeHandler}
                               value={empRrn}/>
                    </div>
                    <div className="mb-2">
                        <label className="block mb-1 text-sm text-gray-600">회원코드</label>
                        <input type="text"
                               readOnly
                               className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                               value={empCode}/>
                    </div>
                    <div className="mb-2">
                        <label className="block mb-1 text-sm text-gray-600">비밀번호</label>
                        <input type="text"
                               className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                               onChange={empPassOnChangeHandler}
                               value={empPass}/>
                    </div>
                    <div className="mb-2">
                        <label className="block mb-1 text-sm text-gray-600">전화번호</label>
                        <input type="text"
                               className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                               onChange={phoneNumOnChangeHandler}
                               value={phoneNum}/>
                    </div>
                    <div className="mb-2">
                        <label className="block mb-1 text-sm text-gray-600">내선번호</label>
                        <input type="text"
                               className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                               onChange={extNumOnChangeHandler}
                               value={extNum}/>
                    </div>
                    <div className="mb-2">
                        <label className="block mb-1 text-sm text-gray-600">메일</label>
                        <input type="text"
                               className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                               onChange={departmentOnChangeHandler}
                               value={empMail}/>
                    </div>
                    <div className="mb-2">
                        <label className="block mb-1 text-sm text-gray-600">상관코드</label>
                        <input type="text"
                               className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                               onChange={departmentOnChangeHandler}
                               value={corCode}/>
                    </div>
                </div>
            </div>
            {/* Slide-out panel with toggle button */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Panel toggle button */}
                <button
                    onClick={togglePanel}
                    className="absolute top-1/2 -left-6 transform -translate-y-1/2 bg-blue-500 text-white w-6 h-12 flex items-center justify-center rounded-l-md hover:bg-blue-600"
                >
                    {isPanelOpen ? '>' : '<'}
                </button>

                <div className="p-4">
                    <h2 className="text-xl font-bold mb-4">로그인</h2>
                    <input type="text" placeholder="아이디" className="w-full p-2 mb-2 border rounded" />
                    <input type="password" placeholder="비밀번호" className="w-full p-2 mb-4 border rounded" />
                    <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4">
                        로그인
                    </button>
                    <div className="text-sm text-center mb-4">
                        <a href="#" className="text-blue-600 hover:underline">공지사항</a>
                        <span className="mx-1">|</span>
                        <a href="#" className="text-blue-600 hover:underline">문의사항</a>
                    </div>
                    <h2 className="text-xl font-bold mb-2">메신저</h2>
                    <p>메신저 기능은 준비 중입니다.</p>
                </div>
            </div>
        </div>
    )
}

function InputField({ label, value, type = 'text' }) {
    return (
        <div className="mb-2">
            <label className="block mb-1 text-sm text-gray-600">
                {label}
            </label>
            <input
                type={type}
                value={value}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
            />
        </div>
    )
}