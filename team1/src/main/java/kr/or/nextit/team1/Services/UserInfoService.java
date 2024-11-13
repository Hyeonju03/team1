package kr.or.nextit.team1.Services;

import kr.or.nextit.team1.DTOs.UserInfoDTO;
import kr.or.nextit.team1.mappers.UserInfoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserInfoService {

    @Autowired
    private UserInfoMapper userInfoMapper;

    // 조회
    public UserInfoDTO userInfoSelect(String empCode) {
        return userInfoMapper.userInfoSelect(empCode);
    }

    // 수정
    public void userInfoUpdate(UserInfoDTO userInfoDTO) {
        userInfoMapper.userInfoUpdate(userInfoDTO);
    }

    // 상관에게 수정 요청
    @Transactional
    public void updateRequest(UserInfoDTO userInfoDTO) {
        // 기존 상관의 수정 요청값 가져오기
        String currentModifyReq = userInfoMapper.getModifyReq(userInfoDTO.getCorCode());

        // 수정 요청 데이터 문자열 생성
        String modifyReq = userInfoDTO.getModifyReq();

        // 기존 값과 합치기
        String newModifyReq = currentModifyReq == null || currentModifyReq.isEmpty() ? modifyReq : (currentModifyReq + "," + modifyReq);

        // 상관의 modifyReq 컬럼 업데이트
        userInfoMapper.modifyReqUpdate(userInfoDTO.getCorCode(), newModifyReq);
    }

    public String getPosCode(String empCode) {
        return userInfoMapper.getPosCode(empCode);
    }

    public List<UserInfoDTO> corCodeCheck(String corCode) {
        return userInfoMapper.corCodeCheck(corCode);
    }

    // 수정
    @Transactional
    public void userInfoUpdate(String empCode, UserInfoDTO userInfoDTO) {

        // 정보 변경
        userInfoMapper.userInfoUpdate(empCode, userInfoDTO);

        // MODIFY_REQ 비우기
        userInfoMapper.modifyReqDelete(userInfoDTO);
    }

    // 반려
    @Transactional
    public void modifyReqClear(String corCode, String modifyRequest) {
        userInfoMapper.modifyReqClear(corCode, modifyRequest);
    }

    // 권한
    public String getAuthorityUserInfoByEmpCode(String empCode) {
        return userInfoMapper.getAuthorityUserInfoByEmpCode(empCode);
    }

    //요청리스트
    public List<UserInfoDTO> selectUserInfoList(String empCode) {

        return userInfoMapper.selectUserInfoList(empCode);
    }
}
