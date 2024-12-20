package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.DTOs.AdminInfoDTO;
import kr.or.nextit.team1.DTOs.AdminQDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AdminQMapper {
    int insertQ(AdminQDTO adminQDTO);

    String findEmpCode(String empCode);

    void updateAdminQ(AdminQDTO adminQDTO);

    int selectAdmin(String adminId);
}
