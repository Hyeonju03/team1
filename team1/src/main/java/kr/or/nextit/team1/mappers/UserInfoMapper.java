package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.DTOs.UserInfoDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserInfoMapper {
    UserInfoDTO userInfoSelect(String empCode);

    void userInfoUpdate(UserInfoDTO userInfoDTO);

    // 상관의 기존 modifyReq 값 가져오기
    String getModifyReq(String corCode);

    // 상관의 modifyReq 값 업데이트
    void modifyReqUpdate(@Param("corCode") String corCode, @Param("modifyReq") String modifyReq);

    String getPosCode(@Param("empCode") String empCode);

}