package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.DTOs.CodeDTO;
import kr.or.nextit.team1.DTOs.SignUpDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SignUpMapper {
    int insertUserXML(SignUpDTO signUpDTO);


    List<CodeDTO> findAllCodes(String comCode);

    List<SignUpDTO> findAllempCode(String comCode);

}
