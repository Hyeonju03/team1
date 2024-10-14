package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.DTOs.SignUpDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SignUpMapper {
    int insertUserXML(SignUpDTO signUpDTO);
}
