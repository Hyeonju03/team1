import React, { useState } from 'react'
//
// export default function PersonnelManagement() {
//     const [employeeData, setEmployeeData] = useState(null)
//     const [isDialogOpen, setIsDialogOpen] = useState(false)
//
//     // useEffect(() => {
//     //     // Fetch employee data from Spring Boot backend
//     //     fetch('/api/employee/A')
//     //         .then(response => response.json())
//     //         .then(data => setEmployeeData(data))
//     //         .catch(error => console.error('Error fetching employee data:', error))
//     // }, [])
//
//     // const handleModificationRequest = () => {
//     //     // Send modification request to the backend
//     //     fetch('/api/employee/A/request-modification', {
//     //         method: 'POST',
//     //     })
//     //         .then(response => response.json())
//     //         .then(data => {
//     //             console.log('Modification request sent:', data)
//     //             setIsDialogOpen(false)
//     //         })
//     //         .catch(error => console.error('Error sending modification request:', error))
//     // }
//
//     // if (!employeeData) return <div>Loading...</div>
//
//     return (
//         <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
//             <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>인사관리</h1>
//             <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>{/*employeeData.name ? employeeData.name : */"bb"}님 정보 관리</h2>
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
//                 <InputField label="이름" value={/*employeeData.name ? employeeData.name : */"dd"} />
//                 <InputField label="부서" value={/*employeeData.department ? employeeData.department : */"dd"} />
//                 <InputField label="직급" value={/*employeeData.position ? employeeData.position : */"dd"} />
//                 <InputField label="주민등록번호" value={/*employeeData.residentNumber ? employeeData.residentNumber : */"dd"} />
//                 <InputField label="회원코드" value={/*employeeData.memberCode ? employeeData.memberCode : */"dd"} />
//                 <InputField label="비밀번호" type="password" value={/*employeeData.password ? employeeData.password : */"dd"} />
//                 <InputField label="전화번호" value={/*employeeData.phoneNumber ? employeeData.phoneNumber : */"dd"} />
//                 <InputField label="내선번호" value={/*employeeData.extensionNumber ? employeeData.extensionNumber : */"dd"} />
//                 <InputField label="메일" value={/*employeeData.email ? employeeData.email : */"dd"} />
//                 <InputField label="상관코드" value={/*employeeData.superiorCode ? employeeData.superiorCode : */"dd"} />
//             </div>
//             <div style={{ marginTop: '24px', textAlign: 'right' }}>
//                 <button
//                     // onClick={() => setIsDialogOpen(true)}
//                     style={{
//                         padding: '8px 16px',
//                         backgroundColor: '#007bff',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: '4px',
//                         cursor: 'pointer'
//                     }}
//                 >
//                     수정요청하기
//                 </button>
//             </div>
//             {isDialogOpen && (
//                 <div style={{
//                     position: 'fixed',
//                     top: 0,
//                     left: 0,
//                     right: 0,
//                     bottom: 0,
//                     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//                     display: 'flex',
//                     justifyContent: 'center',
//                     alignItems: 'center'
//                 }}>
//                     <div style={{
//                         backgroundColor: 'white',
//                         padding: '20px',
//                         borderRadius: '8px',
//                         maxWidth: '400px'
//                     }}>
//                         <h3 style={{ marginBottom: '16px' }}>수정요청 확인</h3>
//                         <p>수정요청 하시겠습니까?</p>
//                         <div style={{ marginTop: '20px', textAlign: 'right' }}>
//                             <button
//                                 onClick={() => setIsDialogOpen(false)}
//                                 style={{
//                                     marginRight: '8px',
//                                     padding: '8px 16px',
//                                     backgroundColor: '#f8f9fa',
//                                     border: '1px solid #ced4da',
//                                     borderRadius: '4px',
//                                     cursor: 'pointer'
//                                 }}
//                             >
//                                 취소
//                             </button>
//                             <button
//                                 // onClick={handleModificationRequest}
//                                 style={{
//                                     padding: '8px 16px',
//                                     backgroundColor: '#007bff',
//                                     color: 'white',
//                                     border: 'none',
//                                     borderRadius: '4px',
//                                     cursor: 'pointer'
//                                 }}
//                             >
//                                 확인
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }
//
// function InputField({ label, value, type = 'text' }) {
//     return (
//         <div style={{ marginBottom: '8px' }}>
//             <label style={{ display: 'block', marginBottom: '4px' }}>{label}</label>
//             <input
//                 type={type}
//                 value={value}
//                 readOnly
//                 style={{
//                     width: '100%',
//                     padding: '8px',
//                     border: '1px solid #ced4da',
//                     borderRadius: '4px'
//                 }}
//             />
//         </div>
//     )
// }

export default function PersonnelManagement() {
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    const [employeeData] = useState({
        name: "홍길동",
        department: "개발팀",
        position: "선임 개발자",
        residentNumber: "860101-1234567",
        memberCode: "EMP001",
        password: "********",
        phoneNumber: "010-1234-5678",
        extensionNumber: "1234",
        email: "hong@example.com",
        superiorCode: "MGR001"
    })

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
                    {employeeData.name}님 정보 관리
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="이름" value={employeeData.name} />
                    <InputField label="부서" value={employeeData.department} />
                    <InputField label="직급" value={employeeData.position} />
                    <InputField label="주민등록번호" value={employeeData.residentNumber} />
                    <InputField label="회원코드" value={employeeData.memberCode} />
                    <InputField label="비밀번호" type="password" value={employeeData.password} />
                    <InputField label="전화번호" value={employeeData.phoneNumber} />
                    <InputField label="내선번호" value={employeeData.extensionNumber} />
                    <InputField label="메일" value={employeeData.email} />
                    <InputField label="상관코드" value={employeeData.superiorCode} />
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