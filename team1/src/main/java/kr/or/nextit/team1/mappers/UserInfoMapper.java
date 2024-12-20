package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.DTOs.UserInfoDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserInfoMapper {
    UserInfoDTO userInfoSelect(String empCode);

    void userInfoUpdate(UserInfoDTO userInfoDTO);

    // 상관의 기존 modifyReq 값 가져오기
    String getModifyReq(String corCode);

    // 상관의 modifyReq 값 업데이트
    void modifyReqUpdate(@Param("corCode") String corCode, @Param("modifyReq") String modifyReq);

    String getPosCode(@Param("empCode") String empCode);

    // corCodeCheck
    List<UserInfoDTO> corCodeCheck(String corCode);

    // 수정
    void userInfoUpdate(@Param("empCode") String empCode, @Param("userInfo") UserInfoDTO userInfoDTO);

    // 수정하면서 동시에 MODIFY_REQ 비우기
    void modifyReqDelete(UserInfoDTO userInfoDTO);

    // 반려
    void modifyReqClear(String corCode, String modifyRequest);

    // 권한
    String getAuthorityUserInfoByEmpCode(String empCode);

    //요청리스트
    List<UserInfoDTO> selectUserInfoList(String empCode);


}
