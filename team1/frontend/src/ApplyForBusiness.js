import React, {useState} from 'react';
import Clock from "react-live-clock"

export default function ApplyForBusiness() {
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

  const [isPanelOpen, setIsPanelOpen] = useState(false); // 화면 옆 슬라이드

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

  const today = new Date();
  const formattedDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`;

  return (
      <div className="min-h-screen flex flex-col">
        <header className="flex justify-end items-center border-b shadow-md h-[6%] bg-white">
          <div className="flex mr-6">
            <div className="font-bold mr-1">{formattedDate}</div>
            <Clock
                format={'HH:mm:ss'}
                ticking={true}
                timezone={'Asia/Seoul'}/>
          </div>
          <div className="mr-5">
            <img width="40" height="40" src="https://img.icons8.com/windows/32/f87171/home.png"
                 alt="home"/>
          </div>
          <div className="mr-16">
            <img width="45" height="45"
                 src="https://img.icons8.com/ios-glyphs/60/f87171/user-male-circle.png"
                 alt="user-male-circle" onClick={togglePanel}/>
          </div>
        </header>

        <div className="flex max-w-screen-xl mx-auto mt-10 p-14 bg-blue-200 rounded-lg shadow-md relative">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-center mb-6 bg-gray-500 text-white py-2 rounded">사용 등록
              신청</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center space-x-2">
                <label className="w-1/2">사업자 등록번호</label>
                <div className="flex-1 flex items-center">
                  <input
                      className="w-3/5 border rounded px-2 py-1"
                      value={comCode}
                      onChange={(e) => setComCode(e.target.value)}
                      onKeyDown={preventSpaceBar}
                      placeholder={"숫자만 입력"}
                  />
                  <button
                      type="button"
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded ml-3 mt-1"
                      onClick={handleComCodeCheck}
                  >
                    확인
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-1/2">회사 이름</label>
                <input
                    className="w-1/2 border rounded px-2 py-1"
                    value={comName}
                    readOnly
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-1/2">대표 이름</label>
                <input
                    className="w-1/2 border rounded px-2 py-1"
                    value={ceoName}
                    readOnly
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-1/2">대표 연락처</label>
                <input
                    className="w-1/2 border rounded px-2 py-1"
                    value={ceoPhone}
                    readOnly
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-1/2">담당자 연락처</label>
                <input
                    className="w-1/2 border rounded px-2 py-1"
                    value={contectPhone}
                    onChange={(e) => setContectPhone(e.target.value)}
                    onKeyDown={preventSpaceBar}
                    placeholder={"000-000-0000"}
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-1/2">직원 수</label>
                <input
                    className="w-1/2 border rounded px-2 py-1"
                    value={empNum}
                    onChange={(e) => setEmpNum(e.target.value)}
                    onKeyDown={preventSpaceBar}
                    placeholder={"숫자만 입력"}
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-1/2">이메일</label>
                <input
                    className="w-1/2 border rounded px-2 py-1"
                    type="comEmail"
                    value={comEmail}
                    onChange={(e) => setComEmail(e.target.value)}
                    onKeyDown={preventSpaceBar}
                    placeholder={"xxxx@xxxx.xxx"}
                />
              </div>
              <button
                  type="submit"
                  className="w-2/3 bg-orange-500 hover:bg-orange-700 text-white mt-6 py-2 rounded"
              >
                신청하기
              </button>
            </form>
          </div>
        </div>

        <aside className="w-64 p-4 border-l bg-white h-full fixed right-0 top-12">
          <form className="mb-4">
            <input
                type="text"
                placeholder="ID"
                className="w-full p-2 border mb-2"
                required
            />
            <input
                type="password"
                placeholder="비밀번호"
                className="w-full p-2 border mb-2"
                required
            />
            <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 mb-2 hover:bg-blue-600 transition duration-200"
            >
              로그인
            </button>
          </form>
          <div className="text-sm text-center mb-4">
            <a href="#" className="text-blue-600 hover:underline">공지사항</a>
            <span className="mx-1">|</span>
            <a href="#" className="text-blue-600 hover:underline">문의사항</a>
          </div>
          <h2 className="text-xl font-bold mb-2">메신저</h2>
          <p>메신저 기능은 준비 중입니다.</p>
        </aside>

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
      </div>
  );
}
