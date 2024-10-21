package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.DTOs.SignDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SignMapper {
    List<SignDTO> selectSigns();
//    SignDTO selectSign(int id);
//    int registerSign(SignDTO sign);
//    int modifySign(SignDTO sign);
//    int removeSign(int id);
}
