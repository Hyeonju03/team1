import React, {useState} from 'react';
import {useAuth} from './noticeAuth'; // useAuth 훅 가져오기
import {useNavigate} from "react-router-dom";

function LoginPage() {
    const {login} = useAuth(); // useAuth 훅을 사용하여 login 함수 가져오기
    const [empCode, setEmpCode] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        // 로그인 처리 (여기서는 예시로 간단하게 처리)
        const userRole = 'admin';  // 예시로 'admin' 역할
        const authToken = 'your-token';  // 예시로 토큰
        login(empCode, userRole, authToken);  // login 함수 호출하여 로그인 처리
    };

    return (
        <div>
            <h2 style={{marginBottom: "50px"}}>로그인</h2>
            <input
                type="text"
                placeholder="사원 코드"
                value={empCode}
                onChange={(e) => setEmpCode(e.target.value)}
            />
            <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>로그인</button>
        </div>
    );
}

export default LoginPage;
