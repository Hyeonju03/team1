// UserInfoDetail.js
import {useUserContext} from './UserContext';

const UserInfoDetail = () => {
    const {selectedUser: user} = useUserContext();  // UserContext에서 선택된 사용자 가져오기

    if (!user) return <div>선택된 사용자가 없습니다.</div>;  // 사용자가 없으면 메시지 표시

    return (
        <div>
            <h2>{user.empName}의 상세 정보</h2>
            <p>이름: {user.empName}</p>
            <p>부서: {user.depCode}</p>
            <p>직급: {user.posCode}</p>
            <p>전화번호: {user.phoneNum}</p>
            <p>이메일: {user.empMail}</p>
        </div>
    );
};

export default UserInfoDetail;

