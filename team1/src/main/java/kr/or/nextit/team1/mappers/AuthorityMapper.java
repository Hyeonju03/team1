package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.DTOs.AuthorityDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface AuthorityMapper {

    List<AuthorityDTO> selectEmployeeList(String empCode);

    int insertAuth(AuthorityDTO authorityDTO);

    List<AuthorityDTO> selectAllAuth(String empCode);

    void updateAuth(AuthorityDTO authorityDTO);

    int permissionSelect(String empCode);
}
