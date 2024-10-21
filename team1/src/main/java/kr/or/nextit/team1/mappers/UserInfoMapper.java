package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.DTOs.UserInfoDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserInfoMapper {
    UserInfoDTO userInfoSelect(String empCode);
    int userInfoUpdate(UserInfoDTO userInfoDTO);

}
