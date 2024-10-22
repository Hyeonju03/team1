import React, { useState, useEffect  } from 'react';
import axios from 'axios';

export default function ApplyForBusiness() {

    // 입력한 데이터 저장 폼
    const [formData, setFormData] = useState({
        comCode: '',
        comName: '',
        ceoName: '',
        ceoPhone: '',
        contectPhone: '',
        empNum: '',
        comEmail: ''
    });

    // 알림창 설정 변수
    const [showAlert, setShowAlert] = useState(false);

    // 알림창 메세지
    const [alertMessage, setAlertMessage] = useState('');

    // 회사 정보 fetch
    const [fetchData, setFetchData] = useState(false); // fetchData 상태 추가


    // 입력값 변경 핸들러  (사용자가 입력한 내용 처리한는 함수)
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // 사업자 번호로 회사 정보 조회
    const fetchCompanyInfo = async () => {
        if (!formData.comCode) {  // 사업자 번호 누락시
            setAlertMessage('사업자 번호를 입력하세요.');
            setShowAlert(true);
            return;
        }

        try {
            const response = await axios.get(`/api/apply/${formData.comCode}`); // 사업자 정보 가져오기
            if (response.data) {  // DB에 있는 사업자 번호 입력시
                // 타입을 명시적으로 정의
                const { comName, ceoName, ceoPhone } = response.data;
                setFormData(prevState => ({
                    ...prevState,
                    comName: comName || '',  // 기본값을 빈 문자열로 설정
                    ceoName: ceoName || '',
                    ceoPhone: ceoPhone || ''
                }));
            } else { // DB에 없는 사업자 번호 입력시
                setAlertMessage('존재하지 않는 사업자 번호입니다.');
                setShowAlert(true);
            }
        } catch (error) { // 기타 다른 오류 발생시
            setAlertMessage('정보를 가져오는 중 오류가 발생했습니다.');
            setShowAlert(true);
        }
    };

    // useEffect: fetchData가 true일 때 회사 정보 조회
    useEffect(() => {
        const fetchDataAsync = async () => {
            if (fetchData) {
                await fetchCompanyInfo(); // 회사 정보 가져오기
                setFetchData(false); // 데이터 가져온 후 false로 상태 초기화
            }
        };
        fetchDataAsync();
    }, [fetchData]);


    // 확인 버튼을 누르면 사업자 번호의 데이터 호출
    const handleBusinessNumberCheck = () => {
        setFetchData(true); // fetchData를 true로 설정하여 useEffect 트리거
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.comCode || !formData.comName || !formData.ceoName) { // 하나라도 빈칸시 알림창 출력
            setAlertMessage('필수 정보를 모두 입력하세요.');
            setShowAlert(true);
            return;
        }

        try {
            const response = await axios.post('/api/apply', formData); // 입력 데이터를 DB에 전송

            // 전송이 성공적이면 알림창 출력하고 전송한 데이터 폼을 초기화
            if (response.status === 200 && response.data === "사용 등록 신청이 완료되었습니다.") {
                setAlertMessage('사용등록 신청이 완료되었습니다.');
                setShowAlert(true);

                setFormData({
                    comCode: '',
                    comName: '',
                    ceoName: '',
                    ceoPhone: '',
                    contectPhone: '',
                    empNum: '',
                    comEmail: ''
                });
            } else {
                throw new Error('Unexpected response');
            }
        } catch (error) {
            console.error('Error:', error);
            setAlertMessage('신청 중 오류가 발생했습니다.');
            setShowAlert(true);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* 메인 콘텐츠 */}
            <div className="flex-1 flex flex-col">
                <header className="bg-gray-200 p-4">
                    <div className="container mx-auto flex justify-center items-center h-24">
                        <div className="w-48 h-24 bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-600">로고</span>
                        </div>
                    </div>
                </header>

                <div className="flex max-w-screen-lg mx-auto mt-10 p-6 bg-yellow-100 rounded-lg shadow-md relative">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-center mb-6 bg-gray-500 text-white py-2 rounded">사용
                            등록 신청</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* 사업자 등록번호 */}
                            <div className="flex items-center space-x-2">
                                <label className="w-1/2">사업자 등록번호</label>
                                <div className="flex-1 flex items-center">
                                    <input
                                        className="w-3/5 border rounded px-2 py-1"
                                        name="comCode"
                                        value={formData.comCode}
                                        onChange={handleInputChange}
                                    />
                                    <button
                                        type="button"
                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded ml-3 mt-1"
                                        onClick={handleBusinessNumberCheck}
                                    >
                                        확인
                                    </button>
                                </div>
                            </div>

                            {/* 회사 이름 */}
                            <div className="flex items-center space-x-2">
                                <label className="w-1/2">회사 이름</label>
                                <input
                                    className="w-1/2 border rounded px-2 py-1"
                                    name="comName"
                                    value={formData.comName}
                                    onChange={handleInputChange}
                                    readOnly
                                />
                            </div>

                            {/* 대표 이름 */}
                            <div className="flex items-center space-x-2">
                                <label className="w-1/2">대표 이름</label>
                                <input
                                    className="w-1/2 border rounded px-2 py-1"
                                    name="ceoName"
                                    value={formData.ceoName}
                                    onChange={handleInputChange}
                                    readOnly
                                />
                            </div>

                            {/* 대표 연락처 */}
                            <div className="flex items-center space-x-2">
                                <label className="w-1/2">대표 연락처</label>
                                <input
                                    className="w-1/2 border rounded px-2 py-1"
                                    name="ceoPhone"
                                    value={formData.ceoPhone}
                                    onChange={handleInputChange}
                                    readOnly
                                />
                            </div>

                            {/* 담당자 연락처 */}
                            <div className="flex items-center space-x-2">
                                <label className="w-1/2">담당자 연락처</label>
                                <input
                                    className="w-1/2 border rounded px-2 py-1"
                                    name="contectPhone"
                                    value={formData.contectPhone}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* 직원 수 */}
                            <div className="flex items-center space-x-2">
                                <label className="w-1/2">직원 수</label>
                                <input
                                    className="w-1/2 border rounded px-2 py-1"
                                    name="empNum"
                                    value={formData.empNum}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* 이메일 */}
                            <div className="flex items-center space-x-2">
                                <label className="w-1/2">이메일</label>
                                <input
                                    className="w-1/2 border rounded px-2 py-1"
                                    type="email"
                                    name="comEmail"
                                    value={formData.comEmail}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-2/3 bg-orange-400 hover:bg-orange-600 text-white mt-6 py-2 rounded"
                            >
                                신청하기
                            </button>
                        </form>
                    </div>
                </div>

                {/* 알림창 */}
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

            {/* 사이드 메뉴 */}
            <aside className="w-64 p-4 border-l bg-white h-full fixed right-0 top-32">
                <div className="mb-4">
                    <input type="text" placeholder="아이디" className="w-full p-2 border mb-2"/>
                    <input type="password" placeholder="비밀번호" className="w-full p-2 border mb-2"/>
                    <button className="w-full bg-blue-500 text-white p-2 mb-2">로그인</button>
                    <div className="text-sm text-center">
                        <a href="#" className="text-blue-600 hover:underline">공지사항</a>
                        <span className="mx-1">|</span>
                        <a href="#" className="text-blue-600 hover:underline">문의사항</a>
                    </div>
                </div>
                <div className="mb-4">
                    <h3 className="font-semibold mb-2">공지사항</h3>
                    <ul className="list-disc list-inside">
                        <li>첫 번째 공지사항</li>
                        <li>두 번째 공지사항</li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">메신저</h3>
                    <p>메신저 기능은 준비 중입니다.</p>
                </div>
            </aside>
        </div>
    );
}


