import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from './noticeAuth';
import axios from "axios"; // useAuth 가져오기

export default function Login() {
    const [inputId, setInputId] = useState(""); // 사용자 ID 상태 추가
    const [inputPassword, setInputPassword] = useState(""); // 비밀번호 입력
    const navigate = useNavigate();
    const {login} = useAuth(); // login 함수 가져오기

    const handleLogin = async () => {
        try {
            const response = await axios.post(
                '/api/employ/login',
                {empCode: inputId, empPass: inputPassword}
            );

            if (response.data.success) {
                const {token, role} = response.data;

                login(inputId, role, token);
                navigate("/");
            } else {
                alert("로그인 실패");
            }
        } catch (error) {
            console.error('로그인 요청에 실패했습니다:', error);
            alert("로그인 실패: " + error.message);
        }
    };
    

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="p-6 bg-white shadow-md rounded-md w-96">
                <h2 className="text-xl font-semibold mb-4">로그인</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="사원 코드"
                        value={inputId}
                        onChange={(e) => setInputId(e.target.value)}
                        className="w-full px-4 py-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={inputPassword}
                        onChange={(e) => setInputPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded"
                    />
                </div>
                <button onClick={handleLogin} className="w-full px-4 py-2 bg-blue-500 text-white rounded">
                    로그인
                </button>
            </div>
        </div>
    );
}
