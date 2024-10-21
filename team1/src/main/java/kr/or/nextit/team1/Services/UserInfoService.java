package kr.or.nextit.team1.Services;

import kr.or.nextit.team1.DTOs.UserInfoDTO;
import kr.or.nextit.team1.mappers.UserInfoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserInfoService {

    @Autowired
    private UserInfoMapper userInfoMapper;

    public UserInfoDTO userInfoSelect(String empCode){
        return userInfoMapper.userInfoSelect(empCode);
    }
    
    public boolean userInfoUpdate(UserInfoDTO userInfoDTO){
        int rowsAffected = userInfoMapper.userInfoUpdate(userInfoDTO);
        return rowsAffected > 0; // 1이상의 행이 수정되면 true 반환
    }
}
