package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.DTOs.AuthorityDTO;
import kr.or.nextit.team1.DTOs.CodeDTO;
import kr.or.nextit.team1.DTOs.SignUpDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface SignUpMapper {
    int insertUserXML(SignUpDTO signUpDTO);

    List<CodeDTO> findAllCodes(String comCode);

    List<CodeDTO> getAllranks(String comCode);

    int findAllempCode(SignUpDTO signUpDTO);

    int insertAuthData(SignUpDTO signUpDTO);

    int countEmpCode(String companyCode);

    List<SignUpDTO> selectCorcode(String comCode, String depCode);

}
